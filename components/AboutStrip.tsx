'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

const services = [
  {
    title: 'Lettings',
    href: '/let',
    desc: 'The right tenant is worth waiting for. We reference properly, vet thoroughly, and only put forward people we would be comfortable with ourselves.',
  },
  {
    title: 'New Homes',
    href: '/buy',
    desc: 'The best properties rarely wait. We keep our clients informed before anything reaches the open market.',
  },
  {
    title: 'Student Lets',
    href: '/rent',
    desc: 'Your first home in London is a big deal. Clear communication, no hidden costs, and someone who actually picks up the phone.',
  },
]

export default function AboutStrip() {
  return (
    <section style={{ background: '#EFECE6', padding: 'var(--section-y) var(--gutter)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ marginBottom: 64, maxWidth: 720 }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Who We Are</p>
            <h2 style={{ color: '#4A4036', marginBottom: 24 }}>
              Every home has a story.<br />
              <span style={{ color: '#A0845C', fontStyle: 'italic' }}>We help write the next chapter.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 2, color: '#4A4036', opacity: 0.78, marginBottom: 14 }}>
              We started Vale and Mercer because London deserved an agency that actually listened.
            </p>
            <p style={{ fontSize: 15, lineHeight: 2, color: '#4A4036', opacity: 0.78, marginBottom: 28 }}>
              Small enough that nothing falls through the cracks. Experienced enough that nothing needs to.
            </p>
            <Link href="/about" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>
              Meet the team <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {services.map((s, i) => (
            <ArcCard key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Arc entrance — translateY from below + slight rotate that eases to 0.
// Each card arrives along a small arc, like settling into place.
function ArcCard({ title, href, desc, index }: { title: string; href: string; desc: string; index: number }) {
  const reduce = useReducedMotion()
  const direction = index % 2 === 0 ? -1 : 1
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 56, rotate: direction * 1.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.95, delay: 0.08 + index * 0.13, ease: EASE }}
      style={{ willChange: 'transform, opacity' }}
    >
      <Link
        href={href}
        className="card-lift"
        style={{
          display: 'block',
          background: '#FFFFFF',
          padding: '36px 32px',
          borderRadius: 10,
          border: '0.5px solid rgba(40,35,28,0.06)',
          boxShadow: '0 1px 0 rgba(40,35,28,0.02), 0 18px 36px -22px rgba(40,35,28,0.2)',
          height: '100%',
        }}
        onMouseEnter={e => {
          const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
          if (arrow) arrow.style.transform = 'translateX(6px)'
        }}
        onMouseLeave={e => {
          const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
          if (arrow) arrow.style.transform = 'translateX(0)'
        }}
      >
        <div style={{ width: 22, height: 1, background: '#A0845C', marginBottom: 20 }} />
        <h3 style={{ color: '#4A4036', marginBottom: 14, fontSize: 24 }}>{title}</h3>
        <p style={{ fontSize: 13.5, lineHeight: 1.85, color: '#6B6258', marginBottom: 20 }}>{desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '0.5px solid #DDD7CC' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>Find out more</span>
          <span data-arrow style={{ color: '#A0845C', fontSize: 13, transition: 'transform 0.4s var(--ease-out-soft)' }} aria-hidden>→</span>
        </div>
      </Link>
    </motion.div>
  )
}
