'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { useIsMobile } from '@/components/useDepthParallax'
import { properties } from '@/lib/properties'

type Listing = {
  label: string
  area: string
  desc: string
  image: string
  href: string
  meta?: string        // small line above CTA — e.g. "£4,050pcm · 2 beds"
  ctaLabel?: string    // "Register Interest" for coming-soon, "View Property" for live
}

// Live rentals with real photography flagged featured:true in lib/properties.
// Only live records (status === 'live') with `featured: true` appear here.
const listings: Listing[] = properties
  .filter(p => p.status === 'live' && p.featured)
  .map(p => {
    const beds = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds === 1 ? '' : 's'}`
    return {
      label: p.listingType,
      area: `${p.title} · ${p.area}`,
      desc: p.teaser ?? p.description,
      image: p.image,
      href: `/property/${p.slug}`,
      meta: `${p.rent} · ${beds} · Available ${p.available}`,
      ctaLabel: 'View Property',
    }
  })

export default function FeaturedProperties() {
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 72 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Our Listings</p>
              <h2 style={{ color: 'var(--text)' }}>
                Available <span style={{ color: '#A0845C', fontStyle: 'italic' }}>now</span>
              </h2>
            </div>
            <Link href="/let" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C', whiteSpace: 'nowrap' }}>
              All Lettings <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, perspective: '1400px' }}>
          {listings.map(item => (
            <StorefrontCard key={item.href + item.area} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

type StorefrontProps = {
  item: Listing
}

function StorefrontCard({ item }: StorefrontProps) {
  const ref = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  // Scroll progress through this card's lifecycle in viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Uniform, gentle parallax — every card drifts the SAME small amount so
  // the row stays visually aligned (the old differential drift + edge tilt
  // pushed cards to noticeably different heights, which read as
  // misalignment). Kept subtle and identical across cards; disabled on
  // mobile where the grid is a single column.
  const yRange = isMobile ? 0 : -18
  const y = useTransform(scrollYProgress, [0, 1], [-yRange, yRange])

  // Slight in-place scale on scroll. Scales about the card's own centre,
  // so it never shifts a card off the shared baseline.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98])

  return (
    <motion.article
      ref={ref}
      style={{
        y,
        scale,
        transformPerspective: 1400,
        willChange: 'transform',
      }}
    >
      <Link
        href={item.href}
        style={{
          position: 'relative',
          display: 'block',
          background: '#34302B',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: 440,
          boxShadow: '0 1px 0 rgba(52,48,43,0.04), 0 20px 40px -20px rgba(52,48,43,0.18)',
          transition: 'transform var(--dur-slow) var(--ease-apple), box-shadow var(--dur-slow) var(--ease-apple)',
        }}
        onMouseEnter={e => {
          const img = e.currentTarget.querySelector<HTMLImageElement>('img')
          const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
          const glass = e.currentTarget.querySelector<HTMLSpanElement>('[data-glass]')
          if (img) img.style.transform = 'scale(1.06)'
          if (arrow) arrow.style.transform = 'translateX(6px)'
          if (glass) glass.style.opacity = '1'
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 40px 80px -30px rgba(40,35,28,0.5)'
        }}
        onMouseLeave={e => {
          const img = e.currentTarget.querySelector<HTMLImageElement>('img')
          const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
          const glass = e.currentTarget.querySelector<HTMLSpanElement>('[data-glass]')
          if (img) img.style.transform = 'scale(1)'
          if (arrow) arrow.style.transform = 'translateX(0)'
          if (glass) glass.style.opacity = '0'
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 1px 0 rgba(52,48,43,0.04), 0 20px 40px -20px rgba(52,48,43,0.18)'
        }}
      >
        <img
          src={item.image}
          alt={item.area + ' property listing'}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            // Lighter scrim: darker at the top and bottom where the copy
            // sits, but eased right back through the middle so the
            // photograph reads clearly. Paired with the text-shadows on the
            // title/desc below, this keeps everything legible without
            // washing the image out.
            background: 'linear-gradient(180deg, rgba(52,48,43,0.72) 0%, rgba(52,48,43,0.30) 40%, rgba(52,48,43,0.34) 60%, rgba(52,48,43,0.82) 100%)',
          }}
        />
        {/* Hover-only glass sheen: a gold-tinted frosted wash + inner gold
            ring that fades in, replacing the old flat darkening on hover. */}
        <span
          data-glass
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            opacity: 0,
            background: 'linear-gradient(135deg, rgba(160,132,92,0.20) 0%, rgba(242,239,233,0.06) 45%, rgba(40,35,28,0.10) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(242,239,233,0.18), inset 0 0 0 1px rgba(160,132,92,0.24)',
            transition: 'opacity var(--dur-slow) var(--ease-apple)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '36px 32px', height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '6px 14px', borderRadius: 'var(--radius-pill)', marginBottom: 24 }}>
              {item.label}
            </span>
            <h3 style={{ color: '#F2EFE9', marginBottom: 14, fontSize: 'clamp(20px, 2.4vw, 26px)', lineHeight: 1.2 }}>
              {item.area}
            </h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.8, color: 'rgba(242,239,233,0.82)', maxWidth: 340, textShadow: '0 1px 8px rgba(52,48,43,0.6)' }}>
              {item.desc}
            </p>
          </div>
          <div>
            {item.meta && (
              <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.72)', marginBottom: 16, textShadow: '0 1px 6px rgba(52,48,43,0.7)' }}>
                {item.meta}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24, borderTop: '0.5px solid rgba(242,239,233,0.18)' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0845C' }}>{item.ctaLabel ?? 'Register Interest'}</span>
              <span data-arrow style={{ color: '#A0845C', fontSize: 14, transition: 'transform 0.4s var(--ease-out-soft)' }} aria-hidden>→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
