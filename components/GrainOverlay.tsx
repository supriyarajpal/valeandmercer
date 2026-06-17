// Film-grain overlay. Pure SVG via feTurbulence + data URI — no PNG fetch,
// no JS, no canvas loop. Fixed full-viewport, ignores pointer events.
// Opacity kept under 0.05 so it reads as texture, not noise.

const grainSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`

// Encode the # in url(#n) so the data URI is valid
const grainUrl = `url("data:image/svg+xml;utf8,${grainSvg.replace(/"/g, "'").replace(/#/g, '%23')}")`

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: grainUrl,
        backgroundRepeat: 'repeat',
        opacity: 0.04,
        mixBlendMode: 'multiply',
      }}
    />
  )
}
