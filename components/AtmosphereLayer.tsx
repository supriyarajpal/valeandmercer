'use client'
import { useScroll, useTransform, motion } from 'framer-motion'

// Global ambient layer. Continuous color journey from top to bottom:
// the atmosphere is always shifting, never flat, but capped at opacities
// that keep dark text comfortably readable against the bone baseline.
//
// Approximate section positions on scrollYProgress:
//   Hero            0.00 – 0.15
//   Featured        0.15 – 0.30
//   Buying          0.30 – 0.42
//   Valuation       0.42 – 0.55   (own solid dark bg, atmosphere hidden)
//   About           0.55 – 0.67
//   Blog            0.67 – 0.78
//   GetInTouch      0.78 – 0.92
//   Footer          0.92 – 1.00   (own solid dark bg, atmosphere hidden)
//
// Brown peaks at the ValuationStrip boundary (~0.42 → 0.48). The user
// only sees the ramps on either side — a warming as Buying approaches
// Valuation, and a cooling as we exit toward About.
//
// Gold takes over once we exit the still point: blooms through About
// and Blog, ebbs into GetInTouch.

export default function AtmosphereLayer() {
  const { scrollYProgress } = useScroll()

  const brownOp = useTransform(
    scrollYProgress,
    [0.10, 0.30, 0.42, 0.55, 0.65],
    [0,    0.22, 0.45, 0.15, 0],
  )

  const goldOp = useTransform(
    scrollYProgress,
    [0.50, 0.60, 0.72, 0.85, 0.95],
    [0,    0.18, 0.40, 0.25, 0],
  )

  const base: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
  }

  return (
    <div aria-hidden style={{ ...base, zIndex: -1, background: '#EFECE6' }}>
      <motion.div style={{ ...base, background: '#A0845C', opacity: goldOp, willChange: 'opacity' }} />
      <motion.div style={{ ...base, background: '#28231C', opacity: brownOp, willChange: 'opacity' }} />
    </div>
  )
}
