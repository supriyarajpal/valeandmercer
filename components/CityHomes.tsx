'use client'
import { useMemo, useState } from 'react'
import { DevelopmentCard, type DevelopmentCardData } from '@/components/DevelopmentsListing'

// Homes section: the shared ListingTile grid (via DevelopmentCard), unchanged,
// so titles stay street + city and never a development or developer name.
// Bedroom and type filter chips appear only when the city has 6 or more
// developments; there is deliberately no price filter.

const GOLD = '#A0845C'
const BEDROOMS = ['Studio', '1 bed', '2 bed', '3 bed', '4 bed']
const TYPES = ['apartments', 'duplexes', 'penthouses']

export default function CityHomes({ city, cards, devCount, showFilters }: { city: string; cards: DevelopmentCardData[]; devCount: number; showFilters: boolean }) {
  const [beds, setBeds] = useState<Set<string>>(new Set())
  const [types, setTypes] = useState<Set<string>>(new Set())

  // Only offer chips that some card could match.
  const bedOpts = useMemo(() => BEDROOMS.filter(b => cards.some(c => (c.unitSummary || '').toLowerCase().includes(b.toLowerCase()))), [cards])
  const typeOpts = useMemo(() => TYPES.filter(t => cards.some(c => (c.unitSummary || '').toLowerCase().includes(t))), [cards])

  const visible = useMemo(() => cards.filter(c => {
    const u = (c.unitSummary || '').toLowerCase()
    const bedOk = beds.size === 0 || [...beds].some(b => u.includes(b.toLowerCase()))
    const typeOk = types.size === 0 || [...types].some(t => u.includes(t))
    return bedOk && typeOk
  }), [cards, beds, types])

  const toggle = (set: Set<string>, setFn: (s: Set<string>) => void, v: string) => {
    const next = new Set(set); next.has(v) ? next.delete(v) : next.add(v); setFn(next)
  }

  return (
    <section id="homes" style={{ background: 'var(--surface)', padding: 'var(--section-y) var(--gutter)', contentVisibility: 'auto', containIntrinsicSize: '1px 1400px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--text)', margin: 0 }}>Homes in {city}</h2>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{devCount} {devCount === 1 ? 'development' : 'developments'}</span>
        </div>

        {showFilters && (bedOpts.length > 0 || typeOpts.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
            {bedOpts.map(b => <Chip key={b} label={b} active={beds.has(b)} onClick={() => toggle(beds, setBeds, b)} />)}
            {typeOpts.map(t => <Chip key={t} label={t[0].toUpperCase() + t.slice(1)} active={types.has(t)} onClick={() => toggle(types, setTypes, t)} />)}
          </div>
        )}

        {visible.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 36px', alignItems: 'start' }}>
            {visible.map(c => <DevelopmentCard key={c.slug} dev={c} loading="lazy" />)}
          </div>
        ) : (
          <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>No homes match those filters.</p>
        )}
      </div>
    </section>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', padding: '9px 16px', borderRadius: 'var(--radius-pill)', border: `1px solid ${active ? GOLD : 'var(--border)'}`, background: active ? GOLD : 'var(--surface-2)', color: active ? '#28231C' : 'var(--text)' }}
    >
      {label}
    </button>
  )
}
