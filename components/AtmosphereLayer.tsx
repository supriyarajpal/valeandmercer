'use client'
import { useScroll, useTransform, motion } from 'framer-motion'

// Global ambient layer. Sits behind everything. Fades brown + gold tints
// over a bone baseline at the right scroll moments so the "air" of the
// page shifts as the user travels through the journey.
//
// Why opacity-only (not animated background-color):
//   color interpolation triggers paint every frame; opacity is
//   compositor-only. Stack solid layers, fade them.
//
// Palette is locked — only #EFECE6 / #28231C / #A0845C are used.
// "Warm intermediates" come from partial opacity on those three.

export default function AtmosphereLayer() {
  const { scrollYProgress } = useScroll()

  // Brown wash rises into the ValuationStrip "still point" and lingers
  const brownOp = useTransform(scrollYProgress, [0.28, 0.48, 0.62], [0, 1, 0])

  // Gold warmth blooms after the still point, peaks under About/Blog,
  // ebbs by the time the GetInTouch destination arrives
  const goldOp = useTransform(scrollYProgress, [0.55, 0.72, 0.88], [0, 0.55, 0])

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
