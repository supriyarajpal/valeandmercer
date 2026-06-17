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
  const ENTER_DELAY = firstLoad ? 1.4 : 0.1

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
      style={{
        position: 'relative',
        minHeight: '100vh',
        // No fixed height — let content expand on short viewports so
        // nothing overlaps. Section is at least viewport-tall.
        overflow: 'hidden',
        background: '#28231C',
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
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=90"
          alt="London"
          loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
      </motion.div>

      {/* Layer 1 — atmospheric overlays. */}
      <motion.div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(40,35,28,0.58)', y: l1, willChange: 'transform' }} />
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(40,35,28,0.5) 0%, rgba(40,35,28,0.1) 22%, rgba(40,35,28,0.1) 70%, rgba(40,35,28,0.75) 100%)',
          y: l1,
          willChange: 'transform',
        }}
      />

      {/* Layer 2 — content block. Centered vertically within the
          remaining flex space below the nav. Padding-top is the nav
          safe zone; padding-bottom keeps space above the CTA row. */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          padding: 'clamp(120px, 14vh, 180px) 40px clamp(160px, 22vh, 220px)',
          y: l2,
          opacity: contentOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ maxWidth: 640 }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: ENTER_DELAY, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}
            >
              <div style={{ width: 32, height: 1, background: '#A0845C', flexShrink: 0 }} />
              <span className="eyebrow" style={{ color: 'rgba(239,236,230,0.9)', textShadow: '0 1px 10px rgba(40,35,28,0.85)' }}>Est. London</span>
            </motion.div>

            <h1 style={{ color: '#EFECE6', marginBottom: '1.8rem', fontSize: 'clamp(56px, 8vw, 112px)', lineHeight: 0.95, textShadow: '0 4px 28px rgba(40,35,28,0.55)' }}>
              <HeroLine text="Where" delay={ENTER_DELAY + 0.05} />
              <HeroLine text="homes" delay={ENTER_DELAY + 0.18} italic gold />
              <HeroLine text="find their" delay={ENTER_DELAY + 0.31} />
              <HeroLine text="people" delay={ENTER_DELAY + 0.44} />
            </h1>

            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: ENTER_DELAY + 0.55, ease: EASE }}
              style={{ width: 44, height: 1, background: '#A0845C', marginBottom: '1.6rem', transformOrigin: 'left center' }}
            />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: ENTER_DELAY + 0.6, ease: EASE }}
              style={{ fontSize: 15, lineHeight: 2, color: 'rgba(239,236,230,0.95)', marginBottom: 8, maxWidth: 460, textShadow: '0 2px 18px rgba(40,35,28,0.9), 0 1px 3px rgba(40,35,28,0.6)' }}
            >
              London&rsquo;s finest neighbourhoods, handled personally.
            </motion.p>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: ENTER_DELAY + 0.72, ease: EASE }}
              style={{ fontFamily: 'var(--font-serif)', fontSize: 22, lineHeight: 1.7, color: '#A0845C', marginBottom: 0, maxWidth: 460, fontStyle: 'italic', textShadow: '0 1px 16px rgba(40,35,28,0.9)' }}
            >
              Let&rsquo;s get you moving.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Layer 3 — CTA. Lives at the bottom of the flex column so it
          never overlaps with content on short viewports. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: ENTER_DELAY + 0.85, ease: EASE }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 88,
          padding: '0 40px',
          zIndex: 11,
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
          color: 'rgba(239,236,230,0.45)',
          opacity: cueOpacity,
        }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(239,236,230,0.6), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

function HeroLine({ text, delay, italic, gold }: { text: string; delay: number; italic?: boolean; gold?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
        style={{
          display: 'block',
          color: gold ? '#A0845C' : '#EFECE6',
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
        color: primary ? '#28231C' : 'rgba(239,236,230,0.9)',
        background: primary ? '#EFECE6' : 'transparent',
        border: primary ? '1px solid #EFECE6' : '1px solid rgba(239,236,230,0.35)',
        padding: '15px 24px',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft), border-color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
        e.currentTarget.style.color = primary ? '#EFECE6' : '#28231C'
        e.currentTarget.style.borderColor = primary ? '#A0845C' : '#EFECE6'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        e.currentTarget.style.color = primary ? '#28231C' : 'rgba(239,236,230,0.9)'
        e.currentTarget.style.borderColor = primary ? '#EFECE6' : 'rgba(239,236,230,0.35)'
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: primary ? '#A0845C' : '#EFECE6', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 13, transform: 'translateY(-1px)' }} aria-hidden>→</span>
    </Link>
  )
}
