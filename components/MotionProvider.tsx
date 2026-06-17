'use client'
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import AtmosphereLayer from './AtmosphereLayer'
import GrainOverlay from './GrainOverlay'

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
      <AnimatePresence>
        {firstLoad && !reduceMotion && (
          <div
            key="curtain"
            style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50.2%', background: '#28231C', willChange: 'transform' }}
            />
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50.2%', background: '#28231C', willChange: 'transform' }}
            />

            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(20px, 2.4vw, 28px)',
                  fontWeight: 300,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'rgba(239,236,230,0.95)',
                  paddingLeft: '0.32em',
                  textIndent: '-0.32em',
                }}
              >
                Vale <span style={{ color: '#A0845C', fontStyle: 'italic' }}>&amp;</span> Mercer
              </motion.span>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.65, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 72,
                  height: 1,
                  background: '#A0845C',
                  transformOrigin: 'center',
                  willChange: 'transform',
                }}
              />

              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'rgba(239,236,230,0.5)',
                }}
              >
                London, handled with care.
              </motion.span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: firstLoad ? 0.8 : 0 }}
      >
        {children}
      </motion.div>
    </FirstLoadContext.Provider>
  )
}
