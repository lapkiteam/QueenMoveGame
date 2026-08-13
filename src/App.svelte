<script lang="ts">
  import { concat } from "./lib/utils"
  import Field from "./components/Field.svelte"
  let elementsCount = 0
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
  <div>Расставлено фигур {elementsCount} из 8</div>
  <Field
    added={() => { elementsCount++ }}
    removed={() => { elementsCount-- }}
  />
</main>
