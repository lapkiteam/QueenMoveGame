// @ts-check
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  appType: "mpa", // for 404 when the resource is not found
  plugins: [
    svelte(),
  ],
  base: "",
})
