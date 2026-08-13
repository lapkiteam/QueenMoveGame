import { describe, expect, it } from "vitest"
import { Option, UnionCase } from "@fering-org/functional-helper"
import immutableUpdate from "immutability-helper";

import { ElementId, Field, FieldElement, IntersectBetweens, Option2, Position } from "../../src/lib/field"

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
        changes: UnionCase.mkUnionCase("Added", elementId),
        updatedField: {
          elements: new Map([[elementId, elementPos]]),
          field: (() => {
            const field = Field.create(width, height).field
            field[elementPos.y][elementPos.x] = elementId
            return field
          })(),
        },
      } as ReturnType<typeof Field.update>)
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
        ).updatedField,
        elementPos,
        _ => Option.mkNone(),
      )
    )
      .toStrictEqual({
        changes: UnionCase.mkUnionCase("Removed", elementId),
        updatedField: {
          elements: new Map(),
          field: Field.create(width, height).field,
        },
      } as ReturnType<typeof Field.update>)
  })
  it("replace old element to new element", () => {
    const element1 = FieldElement.create(
      ElementId.create(new Date(0))
    )
    const element2 = FieldElement.create(
      ElementId.create(new Date(1))
    )
    const element1Id = FieldElement.getValue(element1)
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
        ).updatedField,
        elementPos,
        _ => element2,
      )
    )
      .toStrictEqual({
        changes: UnionCase.mkUnionCase("Replaced", {
          current: element1,
          new: element2,
        }),
        updatedField: {
          elements: new Map([
            [element2Id, elementPos]
          ]),
          field: (() => {
            const field = Field.create(width, height).field
            field[elementPos.y][elementPos.x] = element2Id
            return field
          })(),
        },
      } as ReturnType<typeof Field.update>)
  })
})

type IntersectionField = (" " | number | "x")[][]

namespace IntersectionField {
  export function parse(cols: IntersectionField) {
    const field = cols.reduce(
      (state, rows, y) => (
        rows.reduce(
          (state, current, x) => (
            (typeof current === "number") ? (
              immutableUpdate(state, {
                field: {
                  $apply: field => Field.update(
                    field,
                    { x, y },
                    _ => FieldElement.create(
                      ElementId.create(new Date(current))
                    )
                  ).updatedField
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

    return { field, targetPosition }
  }
}

describe("Field.getIntersectBetweens", () => {
  const getIntersection = (intersectField) => {
    const { field, targetPosition } = IntersectionField.parse(intersectField)
    return Field.getIntersectBetweens(field, targetPosition)
  }
  it("8", () => {
    expect(
      getIntersection([
        [ 1 , " ",  2 ,  3 ],
        [" ", " ", " ",  4 ],
        [" ",  5 , "x",  6 ],
        [" ",  7 ,  8 ,  9 ],
      ])
    )
      .toStrictEqual({
        horizontal: Option.mkSome(["5", "6"]),
        vertical: Option.mkSome(["2", "8"]),
        leftTopRightBottom: Option.mkSome(["1", "9"]),
        rightTopLeftBottom: Option.mkSome(["4", "7"]),
      } as IntersectBetweens)
  })
  it("0", () => {
    expect(
      getIntersection([
        [ 1 , " ",  2 ,  3 ],
        ["x", " ", " ",  4 ],
        [" ",  5 , " ",  6 ],
        [" ",  7 ,  8 ,  9 ],
      ])
    )
      .toStrictEqual({
        horizontal: Option.mkNone(),
        vertical: Option.mkNone(),
        leftTopRightBottom: Option.mkNone(),
        rightTopLeftBottom: Option.mkNone(),
      } as IntersectBetweens)
  })
  it("1", () => {
    expect(
      getIntersection([
        [ 1 , "x",  2 ,  3 ],
        [" ", " ", " ",  4 ],
        [" ",  5 , " ",  6 ],
        [" ",  7 ,  8 ,  9 ],
      ])
    )
      .toStrictEqual({
        horizontal: Option.mkSome(["1", "2"]),
        vertical: Option.mkNone(),
        leftTopRightBottom: Option.mkNone(),
        rightTopLeftBottom: Option.mkNone(),
      } as IntersectBetweens)
  })
})

describe("Field.getIntersections", () => {
  const getIntersection = (intersectField) => {
    const { field, targetPosition } = IntersectionField.parse(intersectField)
    return Field.getIntersections(field, targetPosition)
  }
  it("8", () => {
    expect(
      getIntersection([
        [ 1 , " ",  2 ,  3 ],
        [" ", " ", " ",  4 ],
        [" ",  5 , "x",  6 ],
        [" ",  7 ,  8 ,  9 ],
      ])
    )
      .toStrictEqual([
        "1", "9", // \
        "2", "8", // vertical
        "4", "7", // /
        "5", "6", // horizontal
      ])
  })
  it("4", () => {
    expect(
      getIntersection([
        [ 1 , " ",  2 ,  3 ],
        [" ", " ", " ",  4 ],
        ["x",  5 , " ",  6 ],
        [" ",  7 ,  8 ,  9 ],
      ])
    )
      .toStrictEqual([
        "7",      // \
        "1",      // vertical
        "2",      // /
        "5", "6", // horizontal
      ])
  })
})
