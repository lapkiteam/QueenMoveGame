<script lang="ts">
  import { concat } from "../lib/utils"
  const colsCount = 4
  const rowsCount = 8
</script>

<div
  class={concat([
    "grid",
    "size-full",
    "aspect-square",
    "gap-1",
  ])}
  style={`grid-template-columns: repeat(${colsCount}, minmax(0, 1fr))`}
>
  {#each new Array(colsCount * rowsCount) as _, index}
    <div class={concat([
      "bg-gray-500",
      "aspect-square",
    ])}>
      <div>i: {index}</div>
      <div>({index % colsCount}, {index / colsCount | 0})</div>
    </div>
  {/each}
</div>
