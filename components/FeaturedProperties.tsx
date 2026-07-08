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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Our Listings</p>
              <h2 style={{ color: '#4A4036' }}>
                Available <span style={{ color: '#A0845C', fontStyle: 'italic' }}>now</span>
              </h2>
            </div>
            <Link href="/rent" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C', whiteSpace: 'nowrap' }}>
              All Rentals <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, perspective: '1400px' }}>
          {listings.map((item, i) => (
            <StorefrontCard key={item.href + item.area} item={item} index={i} total={listings.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

type StorefrontProps = {
  item: Listing
  index: number
  total: number
}

function StorefrontCard({ item, index, total }: StorefrontProps) {
  const ref = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  // Scroll progress through this card's lifecycle in viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Differential Y speed — outer cards drift faster, center card slower.
  // Creates the "near things streak past, far things linger" illusion.
  const sideBias = total > 1 ? Math.abs(index - (total - 1) / 2) / ((total - 1) / 2) : 0
  const yRange = isMobile ? 0 : -80 - sideBias * 60
  const y = useTransform(scrollYProgress, [0, 1], [-yRange * 0.3, yRange])

  // RotateY arc: tilted at edges, neutral when centered in viewport.
  // 0.0 (entering) → tilt away from center
  // 0.5 (centered) → neutral
  // 1.0 (exiting)  → tilt the other way
  const tiltSign = index < (total - 1) / 2 ? -1 : index > (total - 1) / 2 ? 1 : 0
  const maxTilt = isMobile ? 0 : 2.8
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [tiltSign * maxTilt, 0, -tiltSign * maxTilt])

  // Perspective scale — entering 0.96, centered 1.0, exiting 0.96
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96])

  return (
    <motion.article
      ref={ref}
      style={{
        y,
        rotateY,
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
          borderRadius: 12,
          overflow: 'hidden',
          minHeight: 440,
          boxShadow: '0 1px 0 rgba(52,48,43,0.04), 0 20px 40px -20px rgba(52,48,43,0.18)',
        }}
        onMouseEnter={e => {
          const img = e.currentTarget.querySelector<HTMLImageElement>('img')
          const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
          if (img) img.style.transform = 'scale(1.06)'
          if (arrow) arrow.style.transform = 'translateX(6px)'
        }}
        onMouseLeave={e => {
          const img = e.currentTarget.querySelector<HTMLImageElement>('img')
          const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
          if (img) img.style.transform = 'scale(1)'
          if (arrow) arrow.style.transform = 'translateX(0)'
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
            background: 'linear-gradient(180deg, rgba(52,48,43,0.92) 0%, rgba(52,48,43,0.86) 45%, rgba(52,48,43,0.55) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '36px 32px', height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '6px 12px', marginBottom: 24 }}>
              {item.label}
            </span>
            <h3 style={{ color: '#F2EFE9', marginBottom: 14, fontSize: 'clamp(24px, 3.4vw, 36px)' }}>
              {item.area}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(242,239,233,0.82)', maxWidth: 340, textShadow: '0 1px 8px rgba(52,48,43,0.6)' }}>
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
