export function concat(classes: string []) {
  return classes.join(" ")
}

export function initVh() {
  // from https://github.com/Faisal-Manzer/postcss-viewport-height-correction/blob/ff1ab0b01f3d0a5b90c8ddae378e6b6f5f7ba784/README.md#installation
  const customViewportCorrectionVariable = "vh"
  function setViewportProperty(doc: HTMLElement) {
    let prevClientHeight: number
    const customVar = "--" + (customViewportCorrectionVariable || "vh")
    function handleResize() {
      const clientHeight = doc.clientHeight
      if (clientHeight === prevClientHeight) return
      requestAnimationFrame(() => {
        doc.style.setProperty(customVar, `${clientHeight * 0.01}px`)
        prevClientHeight = clientHeight
      })
    }
    handleResize()
    return handleResize
  }
  window.addEventListener("resize", setViewportProperty(document.documentElement))
}
