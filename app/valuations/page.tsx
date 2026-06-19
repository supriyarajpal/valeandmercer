'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

export default function ValuationsPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', postcode: '', propertyType: 'Flat', bedrooms: '2', reason: 'Looking to sell' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12])

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setStatus('sent')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const inp: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #C8C0B4',
    color: '#4A4036',
    fontSize: 15,
    padding: '12px 0',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.4s var(--ease-out-soft)',
  }
  const lab: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#9A9188',
    marginBottom: 8,
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#A0845C' }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#C8C0B4' }

  return (
    <>
      <Navbar />
      <main>
        <section
          ref={heroRef}
          style={{
            background: '#28231C',
            padding: '160px 20px 100px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <motion.div style={{ position: 'absolute', inset: '-5%', y: reduce ? 0 : bgY, scale: reduce ? 1 : bgScale }}>
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=85"
              alt="London residence"
              loading="eager"
              fetchPriority="high"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
            />
          </motion.div>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(40,35,28,0.65)' }} />
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(40,35,28,0.5) 0%, rgba(40,35,28,0) 25%, rgba(40,35,28,0) 70%, rgba(40,35,28,0.75) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
            >
              <div style={{ width: 32, height: 1, background: '#A0845C' }} />
              <span className="eyebrow" style={{ color: '#A0845C' }}>Free Valuation</span>
            </motion.div>

            <h1 style={{ color: '#EFECE6', marginBottom: 26, fontSize: 'clamp(38px, 5.8vw, 72px)', textShadow: '0 4px 24px rgba(40,35,28,0.5)' }}>
              <HeroLine text="Book your free" delay={1.05} />
              <HeroLine text="valuation" delay={1.18} italic gold />
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
              style={{ fontSize: 16, lineHeight: 2, color: 'rgba(239,236,230,0.96)', maxWidth: 520, textShadow: '0 2px 18px rgba(40,35,28,0.9), 0 1px 3px rgba(40,35,28,0.6)' }}
            >
              No online tool. No algorithm. We visit your property, look at it with fresh eyes, and give you a number you can actually rely on.
            </motion.p>
          </div>
        </section>

        <section style={{ background: '#EFECE6', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {status === 'sent' ? (
              <Reveal y={24}>
                <div style={{ textAlign: 'center', padding: '96px 40px', background: '#FFFFFF', border: '0.5px solid #DDD7CC', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 56, fontWeight: 300, color: '#4A4036', marginBottom: 20 }}>Request received</div>
                  <p style={{ fontSize: 15, lineHeight: 1.9, color: '#6B6258', maxWidth: 440, margin: '0 auto' }}>
                    Thank you for booking a valuation with Vale and Mercer. One of our senior agents will be in touch within 24 hours to confirm your appointment.
                  </p>
                </div>
              </Reveal>
            ) : (
              <>
                <Reveal y={28} amount={0.2}>
                  <div style={{ marginBottom: 64 }}>
                    <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Your Details</p>
                    <Stagger as="div" stagger={0.06} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
                      <StaggerItem>
                        <label style={lab}>First name</label>
                        <input type="text" placeholder="James" style={inp} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Last name</label>
                        <input type="text" placeholder="Sutton" style={inp} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Email address</label>
                        <input type="email" placeholder="your@email.com" style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Phone number</label>
                        <input type="tel" placeholder="+44 7700 000000" style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                      </StaggerItem>
                    </Stagger>
                  </div>
                </Reveal>

                <Reveal y={28} amount={0.2}>
                  <div style={{ marginBottom: 64 }}>
                    <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 24 }}>Property Details</p>
                    <Stagger as="div" stagger={0.06} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
                      <StaggerItem>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={lab}>Property address</label>
                          <input type="text" placeholder="14 Carlyle Square" style={inp} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Postcode</label>
                        <input type="text" placeholder="SW3 4LU" style={inp} value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Property type</label>
                        <select style={{ ...inp, appearance: 'none' }} value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} onFocus={onFocus} onBlur={onBlur}>
                          <option>Flat</option>
                          <option>Terraced house</option>
                          <option>Semi-detached house</option>
                          <option>Detached house</option>
                          <option>Maisonette</option>
                          <option>Penthouse</option>
                        </select>
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Bedrooms</label>
                        <select style={{ ...inp, appearance: 'none' }} value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} onFocus={onFocus} onBlur={onBlur}>
                          <option>Studio</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5+</option>
                        </select>
                      </StaggerItem>
                      <StaggerItem>
                        <label style={lab}>Reason for valuation</label>
                        <select style={{ ...inp, appearance: 'none' }} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} onFocus={onFocus} onBlur={onBlur}>
                          <option>Looking to sell</option>
                          <option>Looking to let</option>
                          <option>Remortgaging</option>
                          <option>Estate planning</option>
                          <option>Just curious</option>
                        </select>
                      </StaggerItem>
                    </Stagger>
                  </div>
                </Reveal>

                <Reveal y={20} amount={0.2}>
                  <div style={{ borderTop: '0.5px solid #DDD7CC', paddingTop: 36 }}>
                    {status === 'error' && <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 18 }}>Something went wrong. Please try again or call us directly.</p>}
                    <SubmitBtn status={status} onClick={handleSubmit} />
                    <p style={{ fontSize: 11, color: '#9A9188', marginTop: 14, lineHeight: 1.8 }}>No obligation. We will contact you within 24 hours to confirm your appointment.</p>
                  </div>
                </Reveal>
              </>
            )}
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
    <span style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: EASE }}
        style={{
          display: 'block',
          color: gold ? '#A0845C' : '#EFECE6',
          fontStyle: italic ? 'italic' : 'normal',
          willChange: 'transform',
        }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function SubmitBtn({ status, onClick }: { status: string; onClick: () => void }) {
  const disabled = status === 'sending'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        background: '#28231C',
        color: '#EFECE6',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        padding: '18px 48px',
        border: 'none',
        cursor: disabled ? 'wait' : 'pointer',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: '#A0845C', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        {disabled ? 'Submitting...' : 'Book Free Valuation'}
        {!disabled && <span aria-hidden>→</span>}
      </span>
    </button>
  )
}
