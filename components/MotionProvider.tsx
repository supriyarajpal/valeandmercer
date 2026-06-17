'use client'
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ReactLenis, useLenis } from 'lenis/react'
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
  const lenis = useLenis()
  useIsoLayoutEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenis])
  return null
}

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const t = setTimeout(() => setFirstLoad(false), reduceMotion ? 0 : 1250)
    return () => clearTimeout(t)
  }, [reduceMotion])

  return (
    <FirstLoadContext.Provider value={firstLoad}>
    <ReactLenis root options={{ lerp: 0.085, duration: 1.35, smoothWheel: true, syncTouch: false }}>
      <ScrollReset />
      <AtmosphereLayer />
      <GrainOverlay />
      <AnimatePresence>
        {firstLoad && !reduceMotion && (
          <div
            key="curtain"
            style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}
          >
            {/* Top half — exits upward */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50.2%', background: '#28231C', willChange: 'transform' }}
            />
            {/* Bottom half — exits downward */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50.2%', background: '#28231C', willChange: 'transform' }}
            />

            {/* Logo lockup — centered between the two panels */}
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
              {/* Wordmark */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-serif, Cormorant Garamond, Georgia, serif)',
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

              {/* Gold hairline that draws across */}
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

              {/* Tagline */}
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
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
        transition={{ duration: 0.5, ease: 'easeOut', delay: firstLoad ? 1.25 : 0 }}
      >
        {children}
      </motion.div>
    </ReactLenis>
    </FirstLoadContext.Provider>
  )
}
