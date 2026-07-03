'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { useIsMobile } from '@/components/useDepthParallax'

const listings = [
  {
    label: 'To Let',
    area: 'Canary Wharf, East London',
    desc: 'Lettings properties coming shortly across Canary Wharf and East London. Register to be the first to know.',
    image: 'https://images.unsplash.com/photo-1540770742812-9a2da5a37ec0?w=1400&q=85',
  },
  {
    label: 'To Let',
    area: 'Notting Hill W11',
    desc: 'Lettings properties coming shortly across Notting Hill and Kensington. Register to be the first to know.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85',
  },
]

export default function FeaturedProperties() {
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Our Listings</p>
              <h2 style={{ color: '#4A4036' }}>
                Properties <span style={{ color: '#A0845C', fontStyle: 'italic' }}>coming soon</span>
              </h2>
            </div>
            <Link href="/register" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C', whiteSpace: 'nowrap' }}>
              Get Notified <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, perspective: '1400px' }}>
          {listings.map((item, i) => (
            <StorefrontCard key={item.area} item={item} index={i} total={listings.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

type StorefrontProps = {
  item: { label: string; area: string; desc: string; image: string }
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
        href="/register"
        style={{
          position: 'relative',
          display: 'block',
          background: '#28231C',
          borderRadius: 12,
          overflow: 'hidden',
          minHeight: 440,
          boxShadow: '0 1px 0 rgba(40,35,28,0.04), 0 20px 40px -20px rgba(40,35,28,0.18)',
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
            background: 'linear-gradient(180deg, rgba(40,35,28,0.92) 0%, rgba(40,35,28,0.86) 45%, rgba(40,35,28,0.55) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '36px 32px', height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', background: '#A0845C', color: '#EFECE6', padding: '6px 12px', marginBottom: 24 }}>
              {item.label}
            </span>
            <h3 style={{ color: '#EFECE6', marginBottom: 14, fontSize: 'clamp(24px, 3.4vw, 36px)' }}>
              {item.area}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(239,236,230,0.82)', maxWidth: 340, textShadow: '0 1px 8px rgba(40,35,28,0.6)' }}>
              {item.desc}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24, borderTop: '0.5px solid rgba(239,236,230,0.18)' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0845C' }}>Register Interest</span>
            <span data-arrow style={{ color: '#A0845C', fontSize: 14, transition: 'transform 0.4s var(--ease-out-soft)' }} aria-hidden>→</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
