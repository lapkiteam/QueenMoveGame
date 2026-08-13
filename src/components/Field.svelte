<script lang="ts">
  import { concat } from "../lib/utils"
  import { ElementId, Field, FieldElement, IntersectBetweens } from "../lib/field"
  const colsCount = 8
  const rowsCount = 8
  let field = Field.create(colsCount, rowsCount)
</script>

<div style="aspect-ratio: {colsCount / rowsCount};">
  <div style="aspect-ratio: {colsCount / rowsCount};">
    <div
      class={concat([
        "grid",
      ])}
      style={`grid-template-columns: repeat(${colsCount}, minmax(0, 1fr))`}
    >
      {#each field.field as rows, y}
        {#each rows as value, x}
          <button
            class={concat([
              "bg-gray-500",
              "aspect-square",
              "border",
              ...(() => {
                if (value === undefined) {
                  return ["border-gray-800"]
                }
                if (Field.getIntersections(field, { x, y }).length === 0) {
                  return ["border-gray-800"]
                }
                return [
                  "border-red-500",
                  "border-2",
                ]
              })(),
              (() => {
                if (value) {
                  return "bg-gray-800"
                }
                const intersects = IntersectBetweens.count(
                  Field.getIntersectBetweens(field, { x, y })
                )
                if (intersects === 0) {
                  if (Field.getIntersections(field, { x, y }).length === 0) {
                    return "bg-yellow-100"
                  }
                  return "bg-white-900"
                }
                if (intersects === 1) {
                  return "bg-red-400"
                }
                return "bg-red-500"
              })()
            ])}
            on:click={_ => {
              field = Field.update(
                field,
                { x, y },
                element => element ? (
                  FieldElement.create()
                ) : (
                  FieldElement.create(ElementId.create())
                )
              )
            }}
          >
          </button>
        {/each}
      {/each}
    </div>
  </div>
</div>
