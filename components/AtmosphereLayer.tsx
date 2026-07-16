// Global background layer — a single, flat, uniform page background so every
// section reads as ONE continuous colour with no seams or bands.
//
// Previously this layer animated a scroll-driven "colour journey": a brown
// (#34302B, up to 0.45 opacity) and a gold (#A0845C, up to 0.28) wash whose
// opacity ramped up and down with scroll position. Because it sits fixed at
// zIndex -1, those tints showed THROUGH every `transparent` section (Featured
// / "Available now", Blog, Get in touch) while the opaque `var(--surface)`
// sections (Buying / "Our services", About / "Who we are") painted over them —
// so the same cream background read as a different shade section to section.
// Standardised to a single flat `var(--surface)` (the brightest cream,
// #F2EFE9 in light) with no tint overlays, so the background is uniform on
// every section and every page. The navbar, footer, dark bands (ValuationStrip)
// and dark cards keep their own intentional backgrounds and are unaffected.
export default function AtmosphereLayer() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: -1,
        background: 'var(--surface)',
      }}
    />
  )
}
