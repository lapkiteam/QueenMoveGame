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

export type Position = {
  x: number,
  y: number,
}

export type IntersectBetweensPair = [ElementId, ElementId]

export type IntersectBetweens = {
  horizontal: Option<IntersectBetweensPair>
  vertical: Option<IntersectBetweensPair>
  leftTopRightBottom: Option<IntersectBetweensPair>
  rightTopLeftBottom: Option<IntersectBetweensPair>
}

export namespace IntersectBetweens {
  export function count(intersects: IntersectBetweens): number {
    const f = (pair: Option<IntersectBetweensPair>) => (
      Option.isSome(pair) ? 1 : 0
    )
    return f(intersects.horizontal)
      + f(intersects.vertical)
      + f(intersects.leftTopRightBottom)
      + f(intersects.rightTopLeftBottom)
  }
}

export type Field = {
  elements: Map<ElementId, Position>
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
    pos: Position,
    updating: ((element: FieldElement) => FieldElement),
  ): Field {
    const { x, y } = pos
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
            $set: pos
          }
        })
      },
    })
  }

  export function getIntersectBetweens(
    field: Field,
    pos: Position,
  ): IntersectBetweens {
    const cols = field.field

    function combine(
      fn1: () => Option<ElementId>,
      fn2: () => Option<ElementId>
    ): Option<IntersectBetweensPair> {
      const result1 = fn1()
      if (result1 === undefined) {
        return Option.mkNone()
      }
      const result2 = fn2()
      if (result2 === undefined) {
        return Option.mkNone()
      }
      return Option.mkSome([result1, result2])
    }

    /** ↖ North West */
    function leftUp() {
      for (
        let x = pos.x - 1, y = pos.y - 1;
        y >= 0 && x >= 0;
        y--, x--
      ) {
        const element = cols[y][x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** ↘ South East */
    function rightDown() {
      for (
        let y = pos.y + 1, x = pos.x + 1;
        y < cols.length && x < cols[0].length;
        y++, x++
      ) {
        const element = cols[y][x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** ↑ Upwards */
    function up() {
      for (let y = pos.y - 1; y >= 0; y--) {
        const element = cols[y][pos.x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** ↓ Downwards */
    function down() {
      for (let y = pos.y + 1; y < cols.length; y++) {
        const element = cols[y][pos.x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** ↗ North East */
    function rightUp() {
      for (
        let y = pos.y - 1, x = pos.x + 1;
        y >= 0 && x < cols[0].length;
        y--, x++
      ) {
        const element = cols[y][x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** ↙ South West */
    function leftDown() {
      for (
        let y = pos.y + 1, x = pos.x - 1;
        y < cols.length && x >= 0;
        y++, x--
      ) {
        const element = cols[y][x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** ← Leftwards */
    function left() {
      const rows = cols[pos.y]
      for (let x = pos.x - 1; x >= 0; x--) {
        const element = rows[x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    /** → Rightwards */
    function right() {
      const rows = cols[pos.y]
      for (let x = pos.x + 1; x < rows.length; x++) {
        const element = rows[x]
        if (element === undefined) {
          continue
        }
        return element
      }
    }

    return {
      leftTopRightBottom: combine(leftUp, rightDown),
      vertical: combine(up, down),
      horizontal: combine(left, right),
      rightTopLeftBottom: combine(rightUp, leftDown),
    }
  }
}
