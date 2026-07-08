'use client'
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import AtmosphereLayer from './AtmosphereLayer'
import GrainOverlay from './GrainOverlay'

// Curtain is intentionally CSS-driven (not framer). On slow connections
// or before JS hydrates, the curtain still auto-dismisses via the keyframe
// so visitors never get stuck on a blank brown screen.
const CURTAIN_CSS = `
@keyframes vm-curtain-top   { to { transform: translateY(-100%); } }
@keyframes vm-curtain-bot   { to { transform: translateY(100%); } }
@keyframes vm-curtain-fade  { to { opacity: 0; visibility: hidden; } }
@keyframes vm-curtain-text-fade { to { opacity: 0; } }
.vm-curtain { animation: vm-curtain-fade 0.01s linear 1.6s forwards; }
.vm-curtain-top { animation: vm-curtain-top 0.6s cubic-bezier(0.76,0,0.24,1) 1s forwards; }
.vm-curtain-bot { animation: vm-curtain-bot 0.6s cubic-bezier(0.76,0,0.24,1) 1s forwards; }
.vm-curtain-text { animation: vm-curtain-text-fade 0.35s cubic-bezier(0.76,0,0.24,1) 0.75s forwards; }
@media (prefers-reduced-motion: reduce) {
  .vm-curtain, .vm-curtain-top, .vm-curtain-bot, .vm-curtain-text { display: none; }
}
`

// True only during the initial page load while the curtain is showing.
// Flips to false after the curtain has fully parted. Consumers (Hero,
// Navbar, anywhere with an entrance choreography) read this so they
// can be snappy on client-side navigation but cinematic on first paint.
const FirstLoadContext = createContext(false)

export function useFirstLoad() {
  return useContext(FirstLoadContext)
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function ScrollReset() {
  const pathname = usePathname()
  // Only reset on actual route changes. On initial mount we just record
  // the path so the user's scroll input isn't snapped back to 0 by an
  // effect that fires before they've had a chance to scroll.
  const prevPath = useRef<string | null>(null)
  useIsoLayoutEffect(() => {
    if (prevPath.current === pathname) return
    if (prevPath.current !== null) {
      window.scrollTo(0, 0)
    }
    prevPath.current = pathname
  }, [pathname])
  return null
}

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    // No explicit scrollTo here — it races with the user's first wheel/touch
    // input. Browser already loads at scroll 0 on fresh visits, and the
    // 'manual' flag stops auto-restore on future refreshes.
    const t = setTimeout(() => setFirstLoad(false), reduceMotion ? 0 : 800)
    return () => clearTimeout(t)
  }, [reduceMotion])

  // Native scroll everywhere. No Lenis. Browser wheel/touch smoothness
  // is reliable across devices; Lenis introduced race conditions
  // between its init phase and the user's first scroll input.
  return (
    <FirstLoadContext.Provider value={firstLoad}>
      <ScrollReset />
      <AtmosphereLayer />
      <GrainOverlay />
      <style dangerouslySetInnerHTML={{ __html: CURTAIN_CSS }} />
      {!reduceMotion && (
        <div
          className="vm-curtain"
          aria-hidden
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}
        >
          <div className="vm-curtain-top" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50.2%', background: '#34302B', willChange: 'transform' }} />
          <div className="vm-curtain-bot" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50.2%', background: '#34302B', willChange: 'transform' }} />

          <div className="vm-curtain-text" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, willChange: 'opacity' }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(20px, 2.4vw, 28px)',
              fontWeight: 300,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(242,239,233,0.95)',
              paddingLeft: '0.32em',
              textIndent: '-0.32em',
            }}>
              Vale <span style={{ color: '#A0845C', fontStyle: 'italic' }}>&amp;</span> Mercer
            </span>
            <div style={{ width: 72, height: 1, background: '#A0845C' }} />
            <span style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: 10,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(242,239,233,0.5)',
            }}>
              London, handled with care.
            </span>
          </div>
        </div>
      )}

      {/*
        IMPORTANT — do NOT add `y`, `x`, `scale`, `rotate`, or any
        transform-driven animate value to this wrapper. The descendant
        <Navbar> uses `backdrop-filter: blur(...)` for its frosted glass
        in the scrolled state, and per the CSS backdrop-filter spec a
        non-`none` `transform` on ANY ancestor disables backdrop-filter
        rendering on a descendant. Framer-motion writes `animate={{ y }}`
        / `animate={{ scale }}` etc. as inline `transform: ...` on the
        element, even when the value is the identity (`y: 0`). The
        previous `animate={{ opacity: 1, y: 0 }}` here is exactly what
        broke the navbar's blur for Phases 9b→12 — the cream tint
        rendered but the blur was a no-op, so cream-on-cream sections
        let the page text read straight through the bar. Opacity is
        safe; transform-axis properties are not.
      */}
      <motion.div
        key={pathname}
        initial={false}
        animate={{ opacity: 1 }}
      >
        {children}
      </motion.div>
    </FirstLoadContext.Provider>
  )
}
