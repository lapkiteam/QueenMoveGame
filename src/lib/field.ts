import immutableUpdate from "immutability-helper"

export type Element = boolean

export type Field = Element[][]

export namespace Field {
  export function create(
    width: number,
    height: number,
  ): Field {
    const xss = Array<Element[]>(height)
    for (let i = 0; i < xss.length; i++) {
      const xs = Array<Element>(width)
      for (let j = 0; j < xs.length; j++) {
        xs[j] = false
      }
      xss[i] = xs
    }
    return xss
  }

  export function update(
    field: Field,
    i: number,
    j: number,
    updating: ((element: Element) => Element),
  ): Field {
    return immutableUpdate(field, {
      [i]: {
        $apply: (row: Element[]) => immutableUpdate(row, {
          [j]: {
            $apply: updating
          }
        })
      }
    })
  }
}
