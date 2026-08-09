import { describe, expect, it } from "vitest"
import { Option } from "@fering-org/functional-helper"

import { ElementId, Field, FieldElement } from "../../src/lib/field"

describe("Field.update", () => {
  it("place new element", async () => {
    const elementId = ElementId.create(new Date(0))
    const element = FieldElement.create(elementId)
    const elementVector = { x: 1, y: 0 }
    const width = 2
    const height = 2
    expect(
      Field.update(
        Field.create(width, height),
        elementVector,
        _ => element,
      )
    )
      .toStrictEqual({
        elements: new Map([[elementId, elementVector]]),
        field: (() => {
          const field = Field.create(width, height).field
          field[elementVector.y][elementVector.x] = elementId
          return field
        })(),
      } as Field)
  })
  it("remove element", async () => {
    const elementId = ElementId.create(new Date(0))
    const element = FieldElement.create(elementId)
    const elementVector = { x: 1, y: 0 }
    const width = 2
    const height = 2
    expect(
      Field.update(
        Field.update(
          Field.create(width, height),
          elementVector,
          _ => element,
        ),
        elementVector,
        _ => Option.mkNone(),
      )
    )
      .toStrictEqual({
        elements: new Map(),
        field: Field.create(width, height).field,
      } as Field)
  })
  it("replace old element to new element", async () => {
    const element1 = FieldElement.create(
      ElementId.create(new Date(0))
    )
    const element2 = FieldElement.create(
      ElementId.create(new Date(1))
    )
    const element2Id = FieldElement.getValue(element2)
    const elementVector = { x: 1, y: 0 }
    const width = 2
    const height = 2
    expect(
      Field.update(
        Field.update(
          Field.create(width, height),
          elementVector,
          _ => element1,
        ),
        elementVector,
        _ => element2,
      )
    )
      .toStrictEqual({
        elements: new Map([
          [element2Id, elementVector]
        ]),
        field: (() => {
          const field = Field.create(width, height).field
          field[elementVector.y][elementVector.x] = element2Id
          return field
        })(),
      } as Field)
  })
})
