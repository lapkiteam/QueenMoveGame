<script lang="ts">
  import { concat } from "../lib/utils"
  import { ElementId, Field, FieldElement, IntersectBetweens } from "../lib/field"
  const colsCount = 8
  const rowsCount = 8
  let field = Field.create(colsCount, rowsCount)
</script>

<div
  class={concat([
    "grid",
    "size-full",
    "aspect-square",
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
          "border-gray-500",
          (() => {
            if (value) {
              return "bg-white-900"
            }
            const intersects = IntersectBetweens.count(
              Field.getIntersectBetweens(field, { x, y })
            )
            return intersects === 0 ? (
              "bg-yellow-100"
            ) : (
              intersects === 1 ? (
                "bg-red-400"
              ) : (
                "bg-red-500"
              )
            )
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
