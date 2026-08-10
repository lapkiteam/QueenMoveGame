import { Option, UnionCase } from "@fering-org/functional-helper"
import immutableUpdate from "immutability-helper"

export namespace Option2 {
  // refactor: use `Option.get` (see. [feat(Option): add `get` function](https://github.com/gretmn102/functional-helper/issues/12))
  export function get<T>(opt: Option<T>): T {
    if (opt === undefined) {
      throw new Error("Argument is undefined")
    }
    return opt
  }
}

export type ElementId = string

export namespace ElementId {
  export function create(): ElementId
  export function create(date: Date): ElementId
  export function create(date?: Date): ElementId {
    return (() => {
      if (date === undefined) {
        return new Date()
      }
      return date
    })().valueOf().toString()
  }
}

export type FieldElement = Option<ElementId>

export namespace FieldElement {
  export function create(): FieldElement
  export function create(element: ElementId): FieldElement
  export function create(element?: ElementId): FieldElement {
    if (element === undefined) {
      return Option.mkNone()
    }
    UnionCase.mkUnionCase
    return Option.mkSome(element)
  }

  export function getValue(element: FieldElement): ElementId {
    return Option2.get(element)
  }
}

// refactor: rename to Position
export type Vector = {
  x: number,
  y: number,
}

export type Field = {
  elements: Map<ElementId, Vector>
  field: FieldElement[][]
}

export namespace Field {
  export function create(
    width: number,
    height: number,
  ): Field {
    const field = Array<FieldElement[]>(height)
    for (let i = 0; i < field.length; i++) {
      const xs = Array<FieldElement>(width)
      for (let j = 0; j < xs.length; j++) {
        xs[j] = Option.mkNone()
      }
      field[i] = xs
    }
    return {
      elements: new Map(),
      field,
    }
  }

  export function update(
    field: Field,
    vector: Vector,
    updating: ((element: FieldElement) => FieldElement),
  ): Field {
    const { x, y } = vector
    const currentElement = field.field[y][x]
    const updatedElement = updating(currentElement)
    const updatedField = immutableUpdate(field, {
      field: {
        [y]: {
          $apply: (row: FieldElement[]) => immutableUpdate(row, {
            [x]: {
              $set: updatedElement
            }
          })
        }
      }
    })

    if (updatedElement === undefined) {
      if (currentElement === undefined) {
        return updatedField
      }
      return immutableUpdate(updatedField, {
        elements: {
          $apply: (elements: Field["elements"]) => immutableUpdate(elements, {
            $remove: [currentElement]
          })
        },
      })
    }

    const updatedField2 = (() => {
      if (currentElement === undefined) {
        return updatedField
      }
      if (currentElement === updatedElement) {
        return updatedField
      }
      return immutableUpdate(updatedField, {
        elements: {
          $remove: [currentElement]
        }
      })
    })()

    return immutableUpdate(updatedField2, {
      elements: {
        $apply: (elements: Field["elements"]) => immutableUpdate(elements, {
          [updatedElement]: {
            $set: vector
          }
        })
      },
    })
  }

  export function getIntersections(
    field: Field,
    pos: Vector,
  ): ElementId[] {
    const intersects = new Array<ElementId>()
    const cols = field.field
    function add(element: FieldElement) {
      if (element === undefined) {
        return
      }
      intersects.push(element)
    }

    // ↖ North West
    for (let y = pos.y - 1; y >= 0; y--) {
      const rows = cols[y]
      for (let x = pos.x - 1; x >= 0; x--) {
        const element = rows[x]
        add(element)
      }
    }

    // ↘ South East
    for (let y = pos.y + 1; y < cols.length; y++) {
      const rows = cols[y]
      for (let x = pos.x + 1; x < rows.length; x++) {
        const element = rows[x]
        add(element)
      }
    }

    // ↑ Upwards
    for (let y = pos.y - 1; y >= 0; y--) {
      const rows = cols[y]
      const element = rows[pos.x]
      add(element)
    }

    // ↓ Downwards
    for (let y = pos.y + 1; y < cols.length; y++) {
      const rows = cols[y]
      const element = rows[pos.x]
      add(element)
    }

    // ↗ North East
    for (let y = pos.y - 1; y >= 0; y--) {
      const rows = cols[y]
      for (let x = pos.x + 1; x < rows.length; x++) {
        const element = rows[x]
        add(element)
      }
    }

    // ↙ South West
    for (let y = pos.y + 1; y < cols.length; y++) {
      const rows = cols[y]
      for (let x = pos.x - 1; x >= 0; x--) {
        const element = rows[x]
        add(element)
      }
    }

    // ← Leftwards
    {
      const rows = cols[pos.y]
      for (let x = pos.x - 1; x >= 0; x--) {
        const element = rows[x]
        add(element)
      }
    }

    // → Rightwards
    {
      const rows = cols[pos.y]
      for (let x = pos.x + 1; x < rows.length; x++) {
        const element = rows[x]
        add(element)
      }
    }

    return intersects
  }
}
