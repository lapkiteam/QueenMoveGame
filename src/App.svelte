<script lang="ts">
  import { concat } from "./lib/utils"
  import Field from "./components/Field.svelte"
</script>

<main class={concat([
  "w-full",
  "h-dvh",
  "h-[calc(var(--vh,_1vh)_*_100)]",
  "p-3",
  "flex",
  "justify-center",
  "bg-gray-800",
  "text-white",
])}>
  <div class={concat([
    "aspect-square",
  ])}>
    <div class={concat([
      "aspect-square",
    ])}>
      <Field />
    </div>
  </div>
</main>
