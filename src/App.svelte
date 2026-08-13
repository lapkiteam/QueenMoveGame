<script lang="ts">
  import { concat } from "./lib/utils"
  import Field from "./components/Field.svelte"
  let elementsCount = 0
</script>

<main class={concat([
  "w-full",
  "p-3",
  "flex",
  "flex-col",
  "items-center",
  "bg-gray-800",
  "text-white",
])}>
  <div>Расставлено фигур {elementsCount} из 8</div>
  <Field />
</main>
