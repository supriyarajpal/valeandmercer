'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

// Ken Burns CSS animation — scoped via a unique class so it only runs
// here. 12-second loop, completely independent of scroll.
const KEN_BURNS_CSS = `
@keyframes vm-ken-burns {
  0%   { transform: scale(1.0) translate3d(0%, 0%, 0); }
  50%  { transform: scale(1.06) translate3d(-1.8%, 1.4%, 0); }
  100% { transform: scale(1.0) translate3d(0%, 0%, 0); }
}
.vm-ken-burns {
  animation: vm-ken-burns 14s ease-in-out infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .vm-ken-burns { animation: none; }
}
`

export default function ValuationStrip() {
  return (
    <section
      style={{
        background: 'transparent',
        padding: 'var(--section-y) var(--gutter)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: KEN_BURNS_CSS }} />

      {/* Solid dark cocoon — hard edges. The merging into neighbour
          sections is handled by dark fades in those sections, so the
          boundary is dark→dark with no visible lighter strip. */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#28231C', zIndex: 0 }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div className="vm-ken-burns" style={{ position: 'absolute', inset: '-6%' }}>
          <img
            src="https://images.unsplash.com/photo-1573424334948-83945a5b2fa0?w=2000&q=85"
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.45 }}
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(40,35,28,0.55) 0%, rgba(40,35,28,0.7) 100%)' }} />
      </div>

      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Reveal as="div" amount={0.3}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 28, opacity: 0.9 }}>Free Valuation</p>
        </Reveal>

        {/* Big cinematic headline — forces a pause */}
        <h2 style={{
          color: '#EFECE6',
          fontSize: 'clamp(44px, 8vw, 108px)',
          lineHeight: 0.95,
          marginBottom: 36,
          letterSpacing: '-0.025em',
          textShadow: '0 4px 32px rgba(40,35,28,0.55)',
        }}>
          <DriftWord text="What" delay={0.0} fromX={-32} />{' '}
          <DriftWord text="is" delay={0.12} fromX={20} />{' '}
          <DriftWord text="your" delay={0.24} fromX={-18} />{' '}
          <DriftWord text="home" delay={0.36} fromX={24} />
          <br />
          <DriftWord text="really" delay={0.55} fromX={-28} italic gold />{' '}
          <DriftWord text="worth?" delay={0.7} fromX={26} italic gold />
        </h2>

        <Reveal as="div" delay={1.0} y={20} amount={0.3}>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: 'rgba(239,236,230,0.78)', marginBottom: 44, maxWidth: 640 }}>
            In London&rsquo;s most active neighbourhoods, values move quickly and quietly. We&rsquo;ll come to you, assess properly, and give you a straight, well-reasoned figure, because a number that flatters you helps no one.
          </p>
        </Reveal>

        <Reveal as="div" delay={1.2} y={20} amount={0.3}>
          <PrimaryCTA href="/valuations" label="Get My Free Valuation" />
        </Reveal>
      </motion.div>
    </section>
  )
}

// Words drift in from a horizontal offset and settle. The X distance
// varies per word so they feel like they floated in from different
// places, not as a single stamped row.
function DriftWord({ text, delay, fromX, italic, gold }: { text: string; delay: number; fromX: number; italic?: boolean; gold?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span
      style={{
        display: 'inline-block',
        verticalAlign: 'baseline',
        // No overflow clip — italic glyphs (?, f, h) extend above
        // the line-box and the entry animation uses opacity to mask
        // the drift-in, so we don't need a hard clip.
      }}
    >
      <motion.span
        initial={reduce ? false : { opacity: 0, x: fromX, y: 12 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.25, delay, ease: EASE }}
        style={{
          display: 'inline-block',
          color: gold ? '#A0845C' : '#EFECE6',
          fontStyle: italic ? 'italic' : 'normal',
          willChange: 'transform, opacity',
        }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function PrimaryCTA({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 12,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#EFECE6',
        background: '#A0845C',
        padding: '18px 32px',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
        e.currentTarget.style.color = '#28231C'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        e.currentTarget.style.color = '#EFECE6'
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: '#EFECE6', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 12 }}>{label}<span aria-hidden style={{ fontSize: 14 }}>→</span></span>
    </Link>
  )
}
