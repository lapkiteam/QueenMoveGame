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
  "flex-col",
  "items-center",
  "bg-gray-800",
  "text-white",
])}>
  <div class={concat([
    "text-xl"
  ])}>Расставлено фигур {elementsCount} из 8
  </div>
  <div class={concat([
    "size-full",
    "flex",
    "justify-center",
  ])}>
    <Field
      added={() => { elementsCount++ }}
      removed={() => { elementsCount-- }}
    />
  </div>
</main>
