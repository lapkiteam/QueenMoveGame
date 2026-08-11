<script lang="ts">
  import { concat } from "../lib/utils"
  import { ElementId, Field, FieldElement } from "../lib/field"
  const colsCount = 25
  const rowsCount = 25
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
            const intersects = Field.getIntersections(field, { x, y }).length
            return value ? (
              "bg-white-900"
            ) : (
              intersects === 0 ? (
                "bg-yellow-100"
              ) : (
                intersects === 1 ? (
                  "bg-blue-400"
                ) : (
                  "bg-red-500"
                )
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
        <!-- <div>{x}, {y}</div> -->
        <!-- <div>{Field.getIntersections(field, { x, y })}</div> -->
      </button>
    {/each}
  {/each}
</div>
