'use client'
import Link from 'next/link'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

// New-homes listing grid, rendered on /buy BELOW the existing "Properties
// coming soon" block. One card per development. Deliberately mirrors the
// lettings card in components/LettingsListings.tsx — same 4:3 framed photo in
// cream matting with a thin gold hairline, and the label sitting in open space
// BELOW the frame (no text over the photo, so no dark text-shadow is needed).
// The favourite heart is intentionally omitted here (sales, not lettings).

export type DevelopmentCardData = {
  slug: string
  name: string
  locality?: string
  price?: string
  tenure?: string
  heroImage: string
  hasPhotos: boolean
}

export default function DevelopmentsListing({ developments }: { developments: DevelopmentCardData[] }) {
  if (developments.length === 0) return null
  return (
    <section style={{ background: 'var(--surface)', padding: '20px var(--gutter) 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={16} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
              {developments.length} {developments.length === 1 ? 'development' : 'developments'}
            </span>
          </div>
        </Reveal>

        <Stagger as="div" stagger={0.08} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '64px 36px', alignItems: 'start' }}>
          {developments.map(dev => (
            <StaggerItem key={dev.slug} as="div">
              <DevelopmentCard dev={dev} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function DevelopmentCard({ dev }: { dev: DevelopmentCardData }) {
  return (
    <Link
      href={`/buy/${dev.slug}`}
      style={{ textDecoration: 'none', position: 'relative', display: 'block' }}
      onMouseEnter={e => {
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        if (arrow) arrow.style.transform = 'translateX(6px)'
        if (img) img.style.transform = 'scale(1.04)'
      }}
      onMouseLeave={e => {
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        if (arrow) arrow.style.transform = 'translateX(0)'
        if (img) img.style.transform = 'scale(1)'
      }}
    >
      {/* Cream matting frame — same treatment as the lettings card. */}
      <div style={{ position: 'relative', background: 'var(--surface-2)', padding: 'clamp(24px, 3vw, 38px)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(52,48,43,0.06)', boxShadow: '0 16px 36px -22px rgba(40,35,28,0.42), 0 2px 6px -3px rgba(40,35,28,0.12)' }}>
        {/* Fixed 4:3 photo frame with a thin gold hairline. object-fit:cover
            so photos of any native ratio fill the frame cleanly. */}
        {/* Photo frame bg matches the lettings card's dark matte (#26221C) when
            there IS a photo; for a photo-less development we use a light theme
            token instead so the placeholder reads as a soft cream tile rather
            than a heavy dark rectangle on the cream grid. */}
        <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', border: '1px solid rgba(160,132,92,0.5)', borderRadius: 2, background: dev.hasPhotos ? '#26221C' : 'var(--surface-3)' }}>
          <img
            src={dev.heroImage}
            alt={dev.hasPhotos ? `${dev.name}${dev.locality ? ', ' + dev.locality : ''}` : ''}
            loading="lazy"
            style={{
              display: 'block', width: '100%', height: '100%',
              objectFit: dev.hasPhotos ? 'cover' : 'contain',
              transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform',
              opacity: dev.hasPhotos ? 1 : 0.5,
            }}
          />
          {/* New Homes marker — small, understated, on the photo, top-left
              (parallels the lettings card's "TO LET"). */}
          <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 12px', borderRadius: 'var(--radius-pill)' }}>
            New Homes
          </span>
        </div>
      </div>

      {/* Label — open space below the frame, never overlaid on the photo. */}
      <div style={{ marginTop: 'clamp(16px, 1.8vw, 24px)', padding: '0 2px' }}>
        {dev.locality && (
          <div style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.01em', marginBottom: 8 }}>
            {dev.locality}
          </div>
        )}
        <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(22px, 2.4vw, 30px)', color: 'var(--text)', lineHeight: 1.12, letterSpacing: '-0.01em', marginBottom: 14 }}>
          {dev.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px 14px' }}>
          {dev.price && (
            <span style={{ fontSize: 14, letterSpacing: '0.04em', color: 'var(--text)' }}>{dev.price}</span>
          )}
          {dev.tenure && (
            <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A6F49', background: 'rgba(160,132,92,0.12)', border: '0.5px solid rgba(160,132,92,0.35)', padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}>
              {dev.tenure}
            </span>
          )}
          <span data-arrow aria-hidden style={{ color: '#A0845C', fontSize: 15, marginLeft: 'auto', transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
        </div>
      </div>
    </Link>
  )
}
