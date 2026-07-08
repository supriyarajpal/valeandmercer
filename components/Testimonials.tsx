'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'

const testimonials = [
  { quote: 'Vale and Mercer found us our Chelsea home in 11 days. We were nervous first-time buyers and they made every step feel simple and safe.', name: 'Sarah M.', role: 'First-time buyer, Chelsea' },
  { quote: 'After three disappointing agents, Vale and Mercer sold our Fulham flat above asking price in under two weeks. Genuinely outstanding.', name: 'James & Rachel T.', role: 'Sellers, Fulham SW6' },
  { quote: 'I was relocating from abroad and they handled everything. Professional, warm, and completely trustworthy.', name: 'Priya K.', role: 'Buyer, Notting Hill' },
  { quote: 'As a landlord with three properties, I have never felt more looked after. They find the right tenants every time.', name: 'David L.', role: 'Landlord, Kensington' },
  { quote: 'They understood exactly what we needed. No pushy sales, just honest advice. We found our forever home.', name: 'Mark & Sophie W.', role: 'Family buyers, South Kensington' },
]

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(360)
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth
      if (w >= 1100) { setPerView(3); setCardWidth(Math.min(420, (w - 120) / 3)) }
      else if (w >= 700) { setPerView(2); setCardWidth(Math.min(420, (w - 80) / 2)) }
      else { setPerView(1); setCardWidth(Math.min(440, w - 64)) }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - perView)
  const gap = 24
  const offsetPx = -(index * (cardWidth + gap))

  const go = useCallback((dir: 1 | -1) => {
    setIndex(i => Math.min(maxIndex, Math.max(0, i + dir)))
  }, [maxIndex])

  return (
    <section style={{ background: '#34302B', padding: 'var(--section-y) 0', overflow: 'hidden' }}>
      <div style={{ padding: '0 var(--gutter)', marginBottom: 56 }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Client Stories</p>
              <h2 style={{ color: '#F2EFE9' }}>
                What our clients <span style={{ color: '#A0845C', fontStyle: 'italic' }}>say about us</span>
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <ArrowButton dir={-1} disabled={index === 0} onClick={() => go(-1)} aria="Previous testimonial" />
              <ArrowButton dir={1} disabled={index >= maxIndex} onClick={() => go(1)} aria="Next testimonial" />
            </div>
          </div>
        </Reveal>
      </div>

      <div style={{ padding: '0 var(--gutter)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', overflow: 'hidden' }}>
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -(maxIndex * (cardWidth + gap)), right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              const threshold = 60
              if (info.offset.x < -threshold) go(1)
              else if (info.offset.x > threshold) go(-1)
            }}
            animate={{ x: offsetPx }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            style={{ display: 'flex', gap, cursor: 'grab', willChange: 'transform' }}
          >
            {testimonials.map(t => (
              <article
                key={t.name}
                style={{
                  flexShrink: 0,
                  width: cardWidth,
                  background: 'rgba(242,239,233,0.04)',
                  border: '0.5px solid rgba(242,239,233,0.1)',
                  borderRadius: 8,
                  padding: '36px 32px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 280,
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 64, lineHeight: 0.6, color: '#A0845C', opacity: 0.5, marginBottom: 12, height: 32 }} aria-hidden>&ldquo;</div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.6, color: 'rgba(242,239,233,0.82)' }}>
                    {t.quote}
                  </p>
                </div>
                <div style={{ borderTop: '0.5px solid rgba(242,239,233,0.12)', paddingTop: 18, marginTop: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#F2EFE9', marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C' }}>{t.role}</div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ArrowButton({ dir, disabled, onClick, aria }: { dir: 1 | -1; disabled: boolean; onClick: () => void; aria: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      style={{
        width: 44,
        height: 44,
        border: '1px solid rgba(242,239,233,0.3)',
        background: 'transparent',
        color: '#F2EFE9',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        transition: 'all 0.4s var(--ease-out-soft)',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = '#A0845C'; e.currentTarget.style.borderColor = '#A0845C' } }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.3)' }}
    >
      {dir === -1 ? '←' : '→'}
    </button>
  )
}
