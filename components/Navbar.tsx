'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { useFirstLoad } from '@/components/MotionProvider'
import ThemeToggle from '@/components/ThemeToggle'

const links = [
  { label: 'Lettings', href: '/let' },
  { label: 'New Homes', href: '/buy' },
  { label: 'Blog', href: '/blog' },
]

const darkHeroPages = ['/', '/sell', '/let', '/about', '/valuations', '/student-lettings']
// Dynamic-route path prefixes whose pages render a dark hero band up
// against the navbar. Kept as a small array so future routes can be
// added by prefix rather than needing a one-off `pathname === '/foo'`
// check. Blog posts (`/blog/[slug]`) use the cream ArticleLayout hero
// and deliberately are NOT in this list.
const darkHeroPathPrefixes = ['/property/']

function pathIsDarkHero(pathname: string): boolean {
  return darkHeroPages.includes(pathname)
    || darkHeroPathPrefixes.some(prefix => pathname.startsWith(prefix))
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hideEyebrow, setHideEyebrow] = useState(false)
  const [mobile, setMobile] = useState(true)
  // Tracks the active colour theme. In dark mode the page background behind
  // a transparent (un-scrolled) navbar is dark on EVERY route — not just the
  // darkHeroPages — so the "over cream → dark text" branch below would leave
  // the wordmark/links invisible. Mirroring the <html data-theme> attribute
  // here lets those branches switch to light text. Reactive via a
  // MutationObserver so a ThemeToggle flip repaints the bar immediately.
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const firstLoad = useFirstLoad()

  const isDarkHero = pathIsDarkHero(pathname)
  // The site eyebrow ("Est. London") is homepage-exclusive — it belongs to
  // the home hero marque only. On individual property pages the eyebrow row
  // is repurposed as an inline "Back to Lettings" link (page back-nav). On
  // every other route the eyebrow row is not rendered at all.
  const isPropertyDetail = pathname.startsWith('/property/')
  const isHome = pathname === '/'

  useEffect(() => {
    const checkSize = () => setMobile(window.innerWidth < 900)
    const checkScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      setHideEyebrow(y > 8)
    }
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

  // Publishes the nav's real rendered height (nav rows + eyebrow,
  // whichever combination is currently showing) as a CSS var. Hero and
  // the pinned property showcase read it to reserve exactly enough
  // clearance — a fixed px/vh guess drifts out of sync as the eyebrow
  // collapses on scroll.
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const publish = () => document.documentElement.style.setProperty('--nav-total-height', `${el.offsetHeight}px`)
    publish()
    const obs = new ResizeObserver(publish)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const read = () => setIsDark(document.documentElement.dataset.theme === 'dark')
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // Single source of truth: "is the visible backdrop behind the navbar
  // currently dark?" Drives logo/link/hamburger/border colour.
  //
  // - When `scrolled` the navbar paints its own cream tint (navBg below)
  //   and provides contrast itself, so the backdrop is effectively cream
  //   from the wordmark's point of view — text must be dark.
  // - When NOT scrolled the navbar is transparent, so we see whatever is
  //   behind it: the dark hero on dark-hero pages, the dark mobile-menu
  //   overlay if the menu is open, or the light page top otherwise.
  //
  // This replaces the old per-page `darkHeroPages`-after-scroll logic
  // that left the wordmark light on cream sections after scroll.
  const isOverDark = !scrolled && (menuOpen || isDarkHero || isDark)

  // Phase 15: scrolled navbar = dark charcoal translucent glass.
  //   background:                rgba(52,48,43,0.55)
  //   backdrop-filter:           blur(20px) saturate(160%)
  //   -webkit-backdrop-filter:   blur(20px) saturate(160%)
  //
  // Set inline on <motion.nav> below (owned here, not in globals.css).
  // The dark tint reads correctly over both light sections and the dark
  // hero — the backdrop is dark in both cases from the wordmark's point
  // of view, so text stays LIGHT in the scrolled state regardless of
  // which section is behind the bar.
  //
  // Blur render requirement: no ancestor of <motion.nav> may hold a
  // lingering `transform`, `filter`, `will-change`, `perspective`, or
  // `contain` at rest — those disable backdrop-filter on descendants
  // per spec. Phase 13 removed the ancestor `animate={{ y: 0 }}` in
  // MotionProvider that was breaking this. See the block comment above
  // that wrapper for the do-not-reintroduce warning.
  //
  // Text-colour pairing has THREE branches, not two, because the
  // "scrolled" state and the "top-of-page over dark hero" state both
  // need LIGHT text but with SLIGHTLY DIFFERENT alpha values (the
  // Phase 15 target reads better over the blurred charcoal than the
  // Phase 7 values did over the raw dark hero photograph). Do NOT
  // collapse this back to a single boolean unless you also unify the
  // values — top-of-page behaviour must remain byte-identical.
  // Glass depth: an inner top highlight (light catching the top edge) plus
  // a soft ambient drop shadow, so the scrolled bar reads as a pane of
  // frosted glass rather than a flat tint.
  const navShadow = scrolled ? 'inset 0 1px 0 rgba(242,239,233,0.12), 0 8px 30px -12px rgba(40,35,28,0.5)' : 'none'

  const logoColor       = scrolled
    ? 'rgba(242,239,233,0.9)'
    : isOverDark ? 'rgba(242,239,233,0.95)' : 'rgba(52,48,43,0.92)'
  const linkColor       = scrolled
    ? 'rgba(242,239,233,0.8)'
    : isOverDark ? 'rgba(242,239,233,0.82)' : 'rgba(52,48,43,0.72)'
  const hamburgerColor  = scrolled
    ? 'rgba(242,239,233,0.85)'
    : isOverDark ? 'rgba(242,239,233,0.9)'  : 'rgba(52,48,43,0.85)'
  const btnBorder       = scrolled
    ? '1px solid rgba(242,239,233,0.3)'
    : isOverDark ? '1px solid rgba(242,239,233,0.35)' : '1px solid rgba(52,48,43,0.25)'

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
        ref={navRef}
        initial={reduce ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : firstLoad ? 0.85 : 0, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          // Liquid glass on scroll: ink-tinted translucent fill + blur +
          // saturation boost, a hairline bottom border, and the highlight/
          // shadow pair from navShadow. Values mirror the --glass-* tokens.
          background: scrolled ? 'rgba(40,35,28,0.5)' : 'transparent',
          backdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(242,239,233,0.08)' : '1px solid transparent',
          boxShadow: navShadow,
          transition: 'background 0.6s var(--ease-apple), box-shadow 0.6s var(--ease-apple), border-color 0.6s var(--ease-apple), backdrop-filter 0.6s var(--ease-apple)',
        }}
      >
        <div style={{ padding: '18px var(--gutter)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/*
            MAIN ROW — fixed-height (44px) flex with alignItems:'center'.
            Logo Link + right cluster/hamburger both centre on the row's
            cross-axis, so they sit on one shared horizontal line with
            equal space above and below the line. The 44px is the iOS
            touch-target standard and comfortably fits the Book Valuation
            pill (≈ 38.7px tall) with ~2.6px breathing room top/bottom.

            CRITICAL: the Est. London eyebrow used to live inside the logo
            as a flex-column sibling, which made the column ~90px tall
            (logo 20.4 + gap 14 + marginTop 32 + eyebrow 24) and forced
            the cluster to either anchor to row-top (the recent "sits too
            high" complaint) or get pushed ~35px below the logo if the
            row was centred. To get genuine cluster centring in BOTH
            scroll states, the eyebrow block has been lifted out to a
            sibling row below this one (see the EYEBROW ROW comment
            further down). Its content, collapse animation, and visible
            position are all preserved — only its parent changes.
          */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
            <motion.div initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: enterDelay - 0.05, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: logoColor, lineHeight: 1.2, transition: 'color 0.5s var(--ease-out-soft)' }}>
                Vale <span style={{ color: '#A0845C' }}>&</span> Mercer
              </Link>
            </motion.div>

          {mobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <ThemeToggle color={hamburgerColor} />
            <motion.button
              onClick={() => setMenuOpen(v => !v)}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: enterDelay, ease: 'easeOut' }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                // Vertical padding builds the 44px touch target; horizontal
                // padding-right is 0 so the 24px-wide lines sit flush with
                // the row's right edge (= --gutter from the viewport edge,
                // matching the logo's left inset).
                padding: '10px 0 10px 10px',
                display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0,
                minWidth: 44, minHeight: 44,
                alignItems: 'flex-end', justifyContent: 'center',
                // Parent main row is now alignItems:'center' with minHeight 44.
                // The button is exactly 44 tall (border-box) and the bar stack
                // is centred inside the button's content box via
                // justifyContent:'center', so the bar stack's vertical centre
                // sits on the row's vertical centre — same axis the logo Link
                // (also alignItems:'center') is centred on. No marginTop hack
                // needed; the older Phase 8 −12px pull-up has been removed.
              }}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span style={{ display: 'block', width: 24, height: 1.5, background: hamburgerColor, transition: 'transform 0.4s, background 0.4s', transform: menuOpen ? 'rotate(45deg) translate(4px,5px)' : 'none' }} />
              <span style={{ display: 'block', width: 24, height: 1.5, background: hamburgerColor, transition: 'opacity 0.3s, background 0.4s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 24, height: 1.5, background: hamburgerColor, transition: 'transform 0.4s, background 0.4s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-5px)' : 'none' }} />
            </motion.button>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              // Main row is alignItems:'center' with minHeight 44, so this
              // cluster (≈ 38.7px tall, dominated by the Book Valuation pill)
              // and the logo Link (≈ 20.4px tall) both centre on the row's
              // cross-axis automatically. Earlier marginTop:-9 lift removed
              // — no longer needed now that the eyebrow is a sibling row.
            }}>
              {links.map(link => (
                <motion.div key={link.href} variants={item}>
                  <Link href={link.href} className="link-underline" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: linkColor, transition: 'color 0.5s var(--ease-out-soft)' }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={item} style={{ display: 'inline-flex' }}>
                <ThemeToggle color={linkColor} />
              </motion.div>
              <motion.div variants={item}>
                <Link href="/valuations" className="btn-press" style={{ display: 'inline-flex', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', border: btnBorder, color: linkColor, padding: '10px 20px', borderRadius: 'var(--radius-pill)', transition: 'color 0.5s var(--ease-apple), border-color 0.5s var(--ease-apple), background 0.3s var(--ease-apple), transform 0.3s var(--ease-apple)' }}>
                  Book Valuation
                </Link>
              </motion.div>
            </motion.div>
          )}
          </div>
          {/*
            EYEBROW ROW — was previously the 2nd child of the logo column;
            lifted out so it doesn't drag on the main row's centring. Block
            content (gold bar + "Est. London" text) and collapse animation
            are byte-for-byte preserved; only the parent changed and the
            marginTop dropped from 32 to 22 to absorb the column gap (14)
            that no longer exists. Visible position from viewport top:
              old = 18 (nav pad) + 20.4 (logo) + 14 (col gap) + 32 = 84.4
              new = 18 (nav pad) + 44 (main row) + 22 (eyebrow mt) = 84
            Off by 0.4px — within imperceptible. Left edge stays at
            var(--gutter) because both rows share the same padded wrapper.
          */}
          {/* Eyebrow row: homepage shows the "Est. London" marque; property
              pages show a "Back to Lettings" link; every other route renders
              nothing here. */}
          {(isHome || isPropertyDetail) && (
          <motion.div initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: enterDelay - 0.05, ease: [0.22, 1, 0.36, 1] }}>
            <div
              aria-hidden={hideEyebrow}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginLeft: 0,
                marginTop: hideEyebrow ? 0 : 22,
                opacity: hideEyebrow ? 0 : 1,
                maxHeight: hideEyebrow ? 0 : 24,
                transform: hideEyebrow ? 'translateY(-6px)' : 'translateY(0)',
                pointerEvents: hideEyebrow ? 'none' : 'auto',
                overflow: 'hidden',
                transition: 'opacity 0.3s var(--ease-out-soft), max-height 0.3s var(--ease-out-soft), transform 0.3s var(--ease-out-soft), margin-top 0.3s var(--ease-out-soft)',
              }}
            >
              <div style={{ width: 32, height: 1, background: '#A0845C', flexShrink: 0 }} />
              {isPropertyDetail ? (
                <Link
                  href="/let"
                  className="eyebrow link-underline"
                  style={{ color: linkColor, transition: 'color 0.5s var(--ease-out-soft)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}>←</span> Back to Lettings
                </Link>
              ) : (
                <span className="eyebrow" style={{ color: linkColor, transition: 'color 0.5s var(--ease-out-soft)' }}>Est. London</span>
              )}
            </div>
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
            style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(40,35,28,0.72)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)' }}
          >
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 20 }}
            >
              {[...links, { label: 'Book Valuation', href: '/valuations' }].map(link => (
                <motion.div key={link.label} variants={item}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 6.5vw, 32px)', fontWeight: 300, color: '#F2EFE9', letterSpacing: '0.03em', textAlign: 'center', display: 'inline-block', padding: '8px 12px' }}>
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
