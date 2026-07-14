'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { useInViewSafe } from '@/components/Reveal'
import { getPropertyStats } from '@/lib/propertyStats'

// Every figure is computed from lib/properties.ts via getPropertyStats() —
// nothing here is a hardcoded/invented number, so this stays accurate as
// listings are added, let, or re-priced.
const stats = getPropertyStats()

type Stat = {
  label: string
  value: number
  format: (n: number) => string
}

function buildStats(): Stat[] {
  const list: Stat[] = [
    { label: 'Live Listings', value: stats.totalLive, format: n => n.toLocaleString('en-GB') },
  ]
  if (stats.avgRentPCM != null) {
    list.push({
      label: 'Average Rent PCM',
      value: stats.avgRentPCM,
      format: n => `£${n.toLocaleString('en-GB')}`,
    })
  }
  if (stats.neighbourhoods.length > 0) {
    list.push({ label: 'Neighbourhoods Covered', value: stats.neighbourhoods.length, format: n => n.toLocaleString('en-GB') })
  }
  if (stats.totalRentRollPCM != null) {
    list.push({
      label: 'Total Monthly Rent Roll',
      value: stats.totalRentRollPCM,
      format: n => `£${n.toLocaleString('en-GB')}`,
    })
  }
  return list
}

const STAT_ITEMS = buildStats()

export default function StatsStrip() {
  const { ref, inView } = useInViewSafe<HTMLDivElement>(0.4)

  if (STAT_ITEMS.length === 0) return null

  return (
    <section style={{ background: 'transparent', padding: '0 var(--gutter) var(--section-y)' }}>
      <div
        ref={ref}
        className="glass stats-grid"
        style={{
          position: 'relative',
          maxWidth: 1280,
          margin: '0 auto',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 56px)',
          display: 'grid',
          gap: 32,
          background: '#28231C',
          overflow: 'hidden',
          // Read by the top breakpoint in .stats-grid (globals.css) so the
          // row always spans full-width evenly, whether there are 3 stats
          // or 4 — see the CSS comment for why auto-fit alone wasn't enough.
          '--stat-cols': STAT_ITEMS.length,
        } as CSSProperties}
      >
        {/* Decorative treatment only — a faint gold corner glow plus a
            large faded serif ampersand watermark, echoing the brand mark
            in the navbar logo. Keeps the panel from reading as a flat
            rectangle without competing with the numbers. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(48% 65% at 100% 0%, rgba(160,132,92,0.16), transparent 70%), radial-gradient(40% 55% at 0% 100%, rgba(160,132,92,0.10), transparent 70%)',
          }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: 'clamp(8px, 3vw, 32px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 0,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(160px, 22vw, 320px)',
            lineHeight: 1,
            color: 'rgba(242,239,233,0.035)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          &amp;
        </span>
        {STAT_ITEMS.map(stat => (
          <StatBlock key={stat.label} stat={stat} start={inView} />
        ))}
      </div>
    </section>
  )
}

function StatBlock({ stat, start }: { stat: Stat; start: boolean }) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? stat.value : 0)
  const started = useRef(false)

  useEffect(() => {
    if (!start || started.current) return
    started.current = true
    if (reduce) { setDisplay(stat.value); return }

    const controls = animate(0, stat.value, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1], // ease-out — fast start, gentle settle
      onUpdate: v => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [start, reduce, stat.value])

  return (
    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 300,
          fontSize: 'clamp(30px, 4vw, 48px)',
          color: '#A0845C',
          letterSpacing: '-0.01em',
          marginBottom: 10,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {stat.format(display)}
      </div>
      <div style={{ width: 20, height: 1, background: 'rgba(160,132,92,0.4)', margin: '0 auto 12px' }} />
      <div style={{ fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.65)' }}>
        {stat.label}
      </div>
    </div>
  )
}
