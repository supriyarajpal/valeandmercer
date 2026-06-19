'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { useIsMobile } from '@/components/useDepthParallax'

const points = [
  'Straight talking from day one',
  'Tenants vetted properly. Landlords kept informed.',
  'Properties before they reach the portals',
  'One person with you from first call to keys handed over',
]

const EASE = [0.22, 1, 0.36, 1] as const

export default function BuyingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  // Section progress drives the clip-path expand — image "opens" as you arrive
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'start 0.25'],
  })
  const inset = useTransform(sectionProgress, [0, 1], [8, 0])
  const clipPath = useTransform(inset, v => `inset(${v}% round 10px)`)

  // Inner image pan — looking through a window while moving
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const innerY = useTransform(imageProgress, [0, 1], isMobile ? ['0%', '0%'] : ['8%', '-8%'])

  return (
    <section ref={sectionRef} style={{ background: '#EFECE6', padding: 'var(--section-y) var(--gutter)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
        <motion.div
          ref={imageRef}
          style={{
            position: 'relative',
            height: 560,
            overflow: 'hidden',
            borderRadius: 10,
            clipPath: isMobile || reduce ? 'inset(0%)' : clipPath,
            willChange: 'clip-path',
          }}
        >
          <motion.div style={{ position: 'absolute', inset: '-10% 0', y: isMobile ? 0 : innerY, willChange: 'transform' }}>
            <img
              src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=1400&q=85"
              alt="London street"
              loading="lazy"
              style={{ width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(40,35,28,0.4) 0%, transparent 55%)' }} />
        </motion.div>

        <div>
          <SlowReveal delay={0}><p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Our Services</p></SlowReveal>

          <SlowReveal delay={0.05}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 46px)', color: '#4A4036', marginBottom: 20 }}>
              For landlords who care<br />and tenants who deserve<br />
              <span style={{ color: '#A0845C', fontStyle: 'italic' }}>better than average.</span>
            </h2>
          </SlowReveal>

          <SlowReveal delay={0.55}>
            <p style={{ fontSize: 13, lineHeight: 1.95, color: '#4A4036', opacity: 0.78, marginBottom: 18, maxWidth: 520 }}>
              The right tenant doesn&rsquo;t happen by accident. It happens because we took the time to understand what you actually need.
            </p>
          </SlowReveal>

          <SlowReveal delay={0.7}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.7, color: '#4A4036', opacity: 0.7, marginBottom: 32, fontStyle: 'italic', maxWidth: 520 }}>
              We sit. We listen. We find. Straight and simple.
            </p>
          </SlowReveal>

          <Stagger as="ul" stagger={0.32} delayChildren={0.85} style={{ listStyle: 'none', margin: '0 0 32px', padding: 0 }}>
            {points.map(point => (
              <StaggerItem key={point} as="li">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '6px 0', borderBottom: '0.5px solid rgba(40,35,28,0.15)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', flexShrink: 0, marginTop: 8 }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(74,64,54,0.72)', lineHeight: 1.45 }}>{point}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <SlowReveal delay={2.1}><ArrowCTA href="/valuations" label="Get in Touch" /></SlowReveal>
        </div>
      </div>
    </section>
  )
}

// Slow reveal — like reading a plaque on a wall as you walk toward it
function SlowReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function ArrowCTA({ href, label }: { href: string; label: string }) {
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
        color: '#EFECE6',
        background: '#28231C',
        padding: '15px 26px',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: '#A0845C', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }} aria-hidden>→</span>
    </Link>
  )
}
