'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { useFirstLoad } from '@/components/MotionProvider'

const links = [
  { label: 'Lettings', href: '/let' },
  { label: 'New Homes', href: '/buy' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

const darkHeroPages = ['/', '/sell', '/let', '/about', '/valuations']

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(true)
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const firstLoad = useFirstLoad()

  const isDarkHero = darkHeroPages.includes(pathname)

  useEffect(() => {
    const checkSize = () => setMobile(window.innerWidth < 900)
    const checkScroll = () => setScrolled(window.scrollY > 80)
    checkSize()
    checkScroll()
    window.addEventListener('resize', checkSize)
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', checkSize)
      window.removeEventListener('scroll', checkScroll)
    }
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
    return () => { document.documentElement.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => setMenuOpen(false), [pathname])

  const isLight = !scrolled && !isDarkHero
  // Lighter blur radius on mobile — backdrop-filter is GPU-expensive on
  // integrated/mobile graphics. Slightly bumped bg opacity compensates.
  const navBlur = scrolled ? (mobile ? 'blur(10px)' : 'blur(20px) saturate(160%)') : 'none'
  const logoColor = scrolled ? 'rgba(239,236,230,0.95)' : isDarkHero ? 'rgba(239,236,230,0.9)' : 'rgba(40,35,28,0.85)'
  const linkColor = scrolled ? 'rgba(239,236,230,0.82)' : isDarkHero ? 'rgba(239,236,230,0.78)' : 'rgba(40,35,28,0.7)'
  const btnBorder = isLight ? '1px solid rgba(40,35,28,0.25)' : '1px solid rgba(239,236,230,0.35)'
  const hamburgerColor = isLight ? 'rgba(40,35,28,0.75)' : 'rgba(239,236,230,0.9)'
  const navBg = scrolled ? 'rgba(40,35,28,0.78)' : 'transparent'
  const navShadow = scrolled ? '0 1px 0 rgba(239,236,230,0.06), 0 8px 24px rgba(0,0,0,0.18)' : 'none'

  const enterDelay = reduce ? 0 : firstLoad ? 0.9 : 0.05
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: enterDelay } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <>
      <motion.nav
        initial={reduce ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : firstLoad ? 0.85 : 0, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          boxShadow: navShadow,
          transition: 'background 0.5s var(--ease-out-soft), box-shadow 0.5s var(--ease-out-soft), backdrop-filter 0.5s',
        }}
      >
        <div style={{ padding: '18px var(--gutter)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: enterDelay - 0.05, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: logoColor, lineHeight: 1.2, transition: 'color 0.5s var(--ease-out-soft)' }}>
              Vale <span style={{ color: '#A0845C' }}>&</span> Mercer
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 32 }}>
              <div style={{ width: 32, height: 1, background: '#A0845C', flexShrink: 0 }} />
              <span className="eyebrow" style={{ color: linkColor, transition: 'color 0.5s var(--ease-out-soft)' }}>Est. London</span>
            </div>
          </motion.div>

          {mobile ? (
            <motion.button
              onClick={() => setMenuOpen(v => !v)}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: enterDelay, ease: 'easeOut' }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 10, display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0, minWidth: 44, minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' }}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span style={{ display: 'block', width: 24, height: 1.5, background: hamburgerColor, transition: 'transform 0.4s, background 0.4s', transform: menuOpen ? 'rotate(45deg) translate(4px,5px)' : 'none' }} />
              <span style={{ display: 'block', width: 24, height: 1.5, background: hamburgerColor, transition: 'opacity 0.3s, background 0.4s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 24, height: 1.5, background: hamburgerColor, transition: 'transform 0.4s, background 0.4s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-5px)' : 'none' }} />
            </motion.button>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {links.map(link => (
                <motion.div key={link.href} variants={item}>
                  <Link href={link.href} className="link-underline" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: linkColor, transition: 'color 0.5s var(--ease-out-soft)' }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={item}>
                <Link href="/valuations" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', border: btnBorder, color: linkColor, padding: '9px 16px', transition: 'all 0.5s var(--ease-out-soft)' }}>
                  Book Valuation
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobile && menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(40,35,28,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 20 }}
            >
              {[...links, { label: 'Book Valuation', href: '/valuations' }].map(link => (
                <motion.div key={link.label} variants={item}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 6.5vw, 32px)', fontWeight: 300, color: '#EFECE6', letterSpacing: '0.03em', textAlign: 'center', display: 'inline-block', padding: '8px 12px' }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
