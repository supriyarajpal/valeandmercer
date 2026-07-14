'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useIsMobile } from '@/components/useDepthParallax'
import { useFirstLoad } from '@/components/MotionProvider'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()
  const firstLoad = useFirstLoad()

  // On first paint we sync with the curtain split (1.4s). On client-side
  // navigation back to home, there's no curtain — fire immediately.
  const ENTER_DELAY = firstLoad ? 0.9 : 0.1

  // Single scroll progress bound to the hero. Progress = 0 when the
  // hero is fully in view at page top; = 1 when scrolled fully past.
  // This is the only correct framing for an on-load hero (not the
  // generic `['start end', 'end start']` which assumes you approach
  // the section from below).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Depth layers, derived from the same progress — image L0 (barely
  // moves), overlay L1, text block L2, CTA L3 (sticks then exits first).
  const parallaxMult = isMobile || reduce ? 0 : 1
  const RANGE = 360
  const l0 = useTransform(scrollYProgress, [0, 1], [0, -RANGE * 0.15 * parallaxMult])
  const l1 = useTransform(scrollYProgress, [0, 1], [0, -RANGE * 0.35 * parallaxMult])
  const l2 = useTransform(scrollYProgress, [0, 1], [0, -RANGE * 0.60 * parallaxMult])

  // Recede on scroll-off. CTA dies earliest, then content, image lingers.
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0])
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.55], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [0.7, 0.4])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  return (
    <section
      ref={ref}
      className="vm-h-screen-dvh"
      style={{
        position: 'relative',
        // Min-height is set via `.vm-h-screen-dvh` so we can fall back to
        // `100vh` on iOS <15.4 / older WebKit where `dvh` is invalid and
        // the inline style would otherwise drop and leave min-height:auto.
        overflow: 'hidden',
        background: '#34302B',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Layer 0 — background image. The world. */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8%',
          y: l0,
          scale: heroScale,
          opacity: imageOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85"
          srcSet="
            https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80 800w,
            https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=82 1200w,
            https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85 1600w,
            https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=85 2000w
          "
          sizes="100vw"
          alt="Prime London residential streetscape at dusk"
          loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
      </motion.div>

      {/* Layer 1 — atmospheric overlays. Pinned to the section so the
          warm tint always covers the image regardless of scroll. */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(52,48,43,0.58)' }} />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(52,48,43,0.5) 0%, rgba(52,48,43,0.1) 22%, rgba(52,48,43,0.1) 70%, rgba(52,48,43,0.75) 100%)',
        }}
      />

      {/* Layer 2 — content block. Everything (eyebrow, headline, divider,
          subtitle, tagline) sits as one cluster at the bottom, just above
          the CTA row. flex-end pushes the cluster down. */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          // Top padding clears the fixed navbar + homepage-only NavTicker
          // strip using their real measured height (--nav-total-height,
          // set by Navbar.tsx) rather than a guessed vh value — a fixed
          // guess fell short on short/wide viewports (e.g. 1280x720) once
          // the ticker added extra height, letting the headline creep up
          // underneath it.
          padding: 'calc(var(--nav-total-height, 150px) + 24px) clamp(20px, 4vw, 40px) 24px',
          y: l2,
          opacity: contentOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ color: '#F2EFE9', margin: '0 0 1.6rem', fontSize: 'clamp(44px, 6.5vw, 88px)', lineHeight: 1.2, textShadow: '0 4px 28px rgba(52,48,43,0.55)' }}>
              <HeroLine text="Where" delay={ENTER_DELAY + 0.05} />
              <HeroLine text="homes" delay={ENTER_DELAY + 0.18} italic gold />
              <HeroLine text="find their" delay={ENTER_DELAY + 0.31} />
              <HeroLine text="people" delay={ENTER_DELAY + 0.44} />
            </h1>

            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: ENTER_DELAY + 0.55, ease: EASE }}
              style={{ width: 32, height: 1, background: '#A0845C', marginBottom: '1.4rem', transformOrigin: 'left center' }}
            />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: ENTER_DELAY + 0.6, ease: EASE }}
              style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(242,239,233,0.82)', marginBottom: 6, maxWidth: 460, textShadow: '0 2px 18px rgba(52,48,43,0.9), 0 1px 3px rgba(52,48,43,0.6)' }}
            >
              London&rsquo;s finest neighbourhoods, handled personally.
            </motion.p>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: ENTER_DELAY + 0.72, ease: EASE }}
              style={{ fontFamily: 'var(--font-serif)', fontSize: 22, lineHeight: 1.5, color: '#A0845C', marginBottom: 0, maxWidth: 460, fontStyle: 'italic', textShadow: '0 1px 16px rgba(52,48,43,0.9)' }}
            >
              Let&rsquo;s get you moving.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Layer 3 — CTA. In flex flow under the content, never absolute.
          That way the content and the CTA can't overlap on any viewport,
          regardless of headline height or mobile browser chrome. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: ENTER_DELAY + 0.85, ease: EASE }}
        style={{
          position: 'relative',
          zIndex: 11,
          padding: '0 clamp(20px, 4vw, 40px) clamp(56px, 10vh, 96px)',
          opacity: ctaOpacity,
          willChange: 'opacity',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <ArrowLink href="/valuations" label="Book Valuation" primary />
          <ArrowLink href="/register" label="Get Notified" />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: ENTER_DELAY + 1.1, ease: EASE }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          color: 'rgba(242,239,233,0.45)',
          opacity: cueOpacity,
        }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(242,239,233,0.6), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

function HeroLine({ text, delay, italic, gold }: { text: string; delay: number; italic?: boolean; gold?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.16em', marginBottom: '-0.16em' }}>
      <motion.span
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
        style={{
          display: 'block',
          color: gold ? '#A0845C' : '#F2EFE9',
          fontStyle: italic ? 'italic' : 'normal',
          willChange: 'transform',
        }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function ArrowLink({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: primary ? '#34302B' : 'rgba(242,239,233,0.9)',
        background: primary ? '#F2EFE9' : 'transparent',
        border: primary ? '1px solid #F2EFE9' : '1px solid rgba(242,239,233,0.35)',
        padding: '18px 26px',
        minHeight: 48,
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft), border-color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
        e.currentTarget.style.color = primary ? '#F2EFE9' : '#34302B'
        e.currentTarget.style.borderColor = primary ? '#A0845C' : '#F2EFE9'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        e.currentTarget.style.color = primary ? '#34302B' : 'rgba(242,239,233,0.9)'
        e.currentTarget.style.borderColor = primary ? '#F2EFE9' : 'rgba(242,239,233,0.35)'
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: primary ? '#A0845C' : '#F2EFE9', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 13, transform: 'translateY(-1px)' }} aria-hidden>→</span>
    </Link>
  )
}
