import { describe, expect, it } from "vitest"
import { Option } from "@fering-org/functional-helper"
import immutableUpdate from "immutability-helper";

import { ElementId, Field, FieldElement, Option2, Position } from "../../src/lib/field"

// refactor: [feat(ArrayExt): add pick function #11](https://github.com/gretmn102/functional-helper/issues/11)
export namespace ArrayExt {
  export function pick<T, U>(
    array: T[],
    picking: (value: T, index: number) => Option<U>,
  ): Option<U> {
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      const result = picking(element, index)
      if (result === undefined) {
        continue
      }
      return result
    }
    return Option.mkNone()
  }
}

describe("Field.update", () => {
  it("place new element", () => {
    const elementId = ElementId.create(new Date(0))
    const element = FieldElement.create(elementId)
    const elementPos = { x: 1, y: 0 }
    const width = 2
    const height = 2
    expect(
      Field.update(
        Field.create(width, height),
        elementPos,
        _ => element,
      )
    )
      .toStrictEqual({
        elements: new Map([[elementId, elementPos]]),
        field: (() => {
          const field = Field.create(width, height).field
          field[elementPos.y][elementPos.x] = elementId
          return field
        })(),
      } as Field)
  })
  it("remove element", () => {
    const elementId = ElementId.create(new Date(0))
    const element = FieldElement.create(elementId)
    const elementPos = { x: 1, y: 0 }
    const width = 2
    const height = 2
    expect(
      Field.update(
        Field.update(
          Field.create(width, height),
          elementPos,
          _ => element,
        ),
        elementPos,
        _ => Option.mkNone(),
      )
    )
      .toStrictEqual({
        elements: new Map(),
        field: Field.create(width, height).field,
      } as Field)
  })
  it("replace old element to new element", () => {
    const element1 = FieldElement.create(
      ElementId.create(new Date(0))
    )
    const element2 = FieldElement.create(
      ElementId.create(new Date(1))
    )
    const element2Id = FieldElement.getValue(element2)
    const elementPos = { x: 1, y: 0 }
    const width = 2
    const height = 2
    expect(
      Field.update(
        Field.update(
          Field.create(width, height),
          elementPos,
          _ => element1,
        ),
        elementPos,
        _ => element2,
      )
    )
      .toStrictEqual({
        elements: new Map([
          [element2Id, elementPos]
        ]),
        field: (() => {
          const field = Field.create(width, height).field
          field[elementPos.y][elementPos.x] = element2Id
          return field
        })(),
      } as Field)
  })
})

type IntersectionField = (" " | "I" | "x")[][]

function getIntersection(cols: IntersectionField) {
  const field = cols.reduce(
    (state, rows, y) => (
      rows.reduce(
        (state, current, x) => (
          (current === "I") ? (
            immutableUpdate(state, {
              field: {
                $apply: field => Field.update(
                  field,
                  { x, y },
                  _ => FieldElement.create(
                    ElementId.create(new Date(state.id))
                  )
                )
              },
              id: {
                $apply: id => id + 1
              },
            })
          ) : (
            state
          )
        ),
        state
      )
    ), {
    field: Field.create(cols[0].length, cols.length),
    id: 0,
  }
  ).field

  const targetPosition = (() => {
    const result = ArrayExt.pick(cols, (rows, y) => (
      ArrayExt.pick(rows, (value, x) => {
        if (value !== "x") {
          return;
        }
        return Option.mkSome({ x, y } as Position);
      })
    ));
    return Option2.get(result);
  })()

  return Field.getIntersections(field, targetPosition)
}

describe("Field.getIntersections", () => {
  it("8", () => {
    expect(
      getIntersection([
        ["I", " ", "I", " "],
        [" ", " ", " ", "I"],
        [" ", "I", "x", "I"],
        [" ", "I", "I", "I"],
      ]).length
    )
      .toStrictEqual(8)
  })
  it("4", () => {
    expect(
      getIntersection([
        ["I", " ", "I", " "],
        ["x", " ", " ", "I"],
        [" ", "I", " ", "I"],
        [" ", "I", "I", "I"],
      ]).length
    )
      .toStrictEqual(4)
  })
})
