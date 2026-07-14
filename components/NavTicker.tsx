'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getPropertyStats } from '@/lib/propertyStats'

const ROTATE_MS = 4500

// Every line is a genuine fact pulled from lib/properties.ts via
// getPropertyStats() — no invented "3 people viewing this" / "added 2
// days ago" style activity, since we don't track a date-added field to
// back that up honestly. Lines that can't be computed (e.g. no rent data)
// are simply omitted rather than faked.
function buildMessages(): string[] {
  const stats = getPropertyStats()
  const lines: string[] = []

  if (stats.totalLive > 0) {
    lines.push(`${stats.totalLive} live listing${stats.totalLive === 1 ? '' : 's'} across London`)
  }
  if (stats.postcodes.length > 0) {
    lines.push(`Live in ${stats.postcodes.join(' & ')}`)
  }
  // Average rent is deliberately not in this rotation — it reads better
  // as a considered figure (see StatsStrip) than a flicked-past ticker
  // line, and every property card already surfaces its own rent. The
  // underlying figure is still available via getPropertyStats() for any
  // surface that wants it.
  if (stats.neighbourhoods.length > 0) {
    lines.push(`Covering ${stats.neighbourhoods.join(' · ')}`)
  }
  return lines
}

const MESSAGES = buildMessages()

// Thin status strip attached to the bottom of the fixed navbar — see
// components/Navbar.tsx, which renders this only on '/' and only inside
// its own fixed wrapper (so it always sits flush under the nav content
// regardless of the eyebrow row collapsing on scroll). Deliberately given
// its own background rather than sharing the nav's backdrop-filter pass,
// so it can't interfere with that blur.
export default function NavTicker() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (MESSAGES.length <= 1) return
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % MESSAGES.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [])

  if (MESSAGES.length === 0) return null

  return (
    <div
      style={{
        // Sits above the main nav row now (see Navbar.tsx) — the hairline
        // belongs on the bottom edge, separating it from the logo/links
        // row below rather than whatever used to be above it.
        borderBottom: '1px solid rgba(242,239,233,0.08)',
        // Solid-reading glass, not the near-transparent tint this started
        // with — deliberately close to the nav's own scrolled glass fill
        // (rgba(40,35,28,0.5) + blur) so hero content scrolling underneath
        // never shows through and clashes with the ticker text.
        background: 'rgba(20,17,14,0.72)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '7px var(--gutter)',
          display: 'flex',
          justifyContent: 'center',
          minHeight: 26,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: '100%' }}>
          <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: '#A0845C', flexShrink: 0 }} />
          {/* Fixed-ish width (not flex:1) so the dot+text unit sits as a
              single centred group in the strip rather than the text
              stretching to fill — flex:1 combined with justify-content on
              the row would have pinned this to one side instead of
              centering it. min(...) keeps it from ever exceeding the
              strip on narrow viewports, where longer lines (e.g. the
              "Covering ..." neighbourhood list) just ellipsis as before. */}
          <div style={{ position: 'relative', width: 'min(84vw, 780px)', minHeight: 14 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'block',
                  fontSize: 10.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  color: 'rgba(160,132,92,0.9)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                aria-live="polite"
              >
                {MESSAGES[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
