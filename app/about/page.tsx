'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const principles = [
  { icon: '01', title: 'We listen first', body: 'Before we show you anything, we want to understand what you are actually looking for. Not just the number of bedrooms. What does your day-to-day look like? What matters most? We work from there.' },
  { icon: '02', title: 'We tell you the truth', body: 'If something is not right for you, we say so. We would rather lose a deal than watch you make a decision you will regret.' },
  { icon: '03', title: 'We see it through', body: 'From your first enquiry to the day you get your keys, you deal with the same person. No handoffs, no being passed around.' },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12])

  return (
    <>
      <Navbar />
      <main>
        <section
          ref={heroRef}
          style={{
            background: '#34302B',
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '160px 20px 100px',
          }}
        >
          <motion.div style={{ position: 'absolute', inset: '-5%', y: reduce ? 0 : bgY, scale: reduce ? 1 : bgScale }}>
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=85"
              alt="London townhouse street"
              loading="eager"
              fetchPriority="high"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
            />
          </motion.div>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(52,48,43,0.65)' }} />
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(52,48,43,0.5) 0%, rgba(52,48,43,0) 25%, rgba(52,48,43,0) 70%, rgba(52,48,43,0.75) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            <div style={{ maxWidth: 640 }}>
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
              >
                <div style={{ width: 32, height: 1, background: '#A0845C' }} />
                <span className="eyebrow" style={{ color: '#A0845C' }}>Our Story</span>
              </motion.div>
              <h1 style={{ color: '#F2EFE9', marginBottom: 26, fontSize: 'clamp(36px, 5.6vw, 68px)', textShadow: '0 4px 24px rgba(52,48,43,0.5)' }}>
                <HeroLine text="Home is not just" delay={1.05} />
                <HeroLine text="a place." delay={1.18} />
                <HeroLine text="It is a feeling." delay={1.31} italic gold />
              </h1>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 16, lineHeight: 2, color: 'rgba(242,239,233,0.96)', maxWidth: 460, textShadow: '0 2px 18px rgba(52,48,43,0.9), 0 1px 3px rgba(52,48,43,0.6)' }}
              >
                The search should feel as considered as the decision itself.
              </motion.p>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--surface)', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <Reveal y={28} amount={0.25}>
              <p style={{ fontSize: 16, lineHeight: 2.1, color: 'var(--text-muted)', marginBottom: 24 }}>
                Whether you are a landlord, a tenant, a first-time buyer or someone who has done this before and wants it done properly this time, the standard should be the same. Attentive, straight, and personal from first call to final key.
              </p>
            </Reveal>
            <Reveal y={28} delay={0.1} amount={0.25}>
              <p style={{ fontSize: 16, lineHeight: 2.1, color: 'var(--text-muted)' }}>
                Vale and Mercer exists for clients who care not only about the outcome, but about the way the process is handled. We are a team, working closely, keeping clients informed with clarity and discretion, and managing the detail properly in the background.
              </p>
            </Reveal>
          </div>
        </section>

        <section style={{ background: 'var(--border)', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border-strong)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {principles.map(item => (
                <StaggerItem key={item.icon} as="div">
                  <div
                    className="card-lift"
                    style={{ background: 'var(--surface)', padding: '44px 32px', height: '100%' }}
                  >
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, fontWeight: 300, color: 'rgba(160,132,92,0.28)', lineHeight: 1, marginBottom: 22 }}>{item.icon}</div>
                    <h3 style={{ fontSize: 26, color: 'var(--text)', marginBottom: 14 }}>{item.title}</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.9, color: 'var(--text-muted)' }}>{item.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section style={{ background: 'var(--surface)', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>
            <Reveal y={32} amount={0.25}>
              <div aria-hidden style={{ position: 'absolute', inset: '-40px', background: 'radial-gradient(closest-side, rgba(160,132,92,0.9) 0%, rgba(122,96,62,0.6) 35%, rgba(74,55,32,0.3) 65%, rgba(52,48,43,0) 100%)', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', background: 'rgba(52,48,43,0.82)', backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)', padding: '72px 36px', boxShadow: '0 30px 80px -10px rgba(122,96,62,0.55), 0 0 0 1px rgba(160,132,92,0.18) inset', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 0%, rgba(160,132,92,0.35) 0%, rgba(52,48,43,0) 60%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative' }}>
                  <h2 style={{ color: '#FFFFFF', marginBottom: 18, fontSize: 'clamp(30px, 5vw, 50px)', textShadow: '0 2px 24px rgba(52,48,43,0.6)' }}>
                    Ready to have a conversation?
                  </h2>
                  <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(255,251,240,0.92)', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px', textShadow: '0 1px 12px rgba(52,48,43,0.5)' }}>
                    No pitch. No pressure. Just a straightforward chat about what you need.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                    <CtaButton href="/valuations" label="Book a Valuation" filled />
                    <CtaButton href="/register" label="Get Notified of New Listings" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function HeroLine({ text, delay, italic, gold }: { text: string; delay: number; italic?: boolean; gold?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.16em' }}>
      <motion.span
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'block',
          color: gold ? '#A0845C' : '#F2EFE9',
          fontStyle: italic ? 'italic' : 'normal',
          willChange: 'transform',
        }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function CtaButton({ href, label, filled }: { href: string; label: string; filled?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: filled ? '#26221C' : '#FFFBF0',
        background: filled ? '#C9A876' : 'transparent',
        border: filled ? '1px solid #C9A876' : '1px solid rgba(255,251,240,0.55)',
        padding: '14px 26px',
        overflow: 'hidden',
        fontWeight: filled ? 600 : 500,
        transition: 'color 0.4s var(--ease-out-soft), border-color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
        if (filled) {
          e.currentTarget.style.color = '#FFFBF0'
        } else {
          e.currentTarget.style.color = '#26221C'
          e.currentTarget.style.borderColor = '#FFFBF0'
        }
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        if (filled) {
          e.currentTarget.style.color = '#26221C'
        } else {
          e.currentTarget.style.color = '#FFFBF0'
          e.currentTarget.style.borderColor = 'rgba(255,251,240,0.55)'
        }
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: filled ? '#26221C' : '#FFFBF0', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }} aria-hidden>→</span>
    </Link>
  )
}
