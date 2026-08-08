import './app.css'
import App from './App.svelte'
import { initVh } from "./lib/utils"

initVh()

const app = new App({
  target: document.getElementById('app')!,
})

export default app
