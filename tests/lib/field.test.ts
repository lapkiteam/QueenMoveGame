import { describe, expect, it } from "vitest"
import { Option } from "@fering-org/functional-helper"

import { ElementId, Field, FieldElement } from "../../src/lib/field"

describe("Field.update", () => {
  it("update empty", async () => {
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
  it("update fill to null", async () => {
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
})
