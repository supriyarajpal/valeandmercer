'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

export default function GetInTouch() {
  const reduce = useReducedMotion()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', interest: 'Lettings enquiry', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
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
    color: '#28231C',
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
    display: 'block',
    marginBottom: 6,
  }

  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) var(--gutter)', position: 'relative' }}>
      {/* Warmth wash — soft radial glow that says "you have arrived" */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(70% 60% at 50% 30%, rgba(160,132,92,0.12) 0%, rgba(160,132,92,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'flex-start' }}>
          <div>
            {/* Subtext + email arrive first — the room is set up */}
            <Reveal as="div" delay={0.1} y={20} amount={0.2}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Get in Touch</p>
            </Reveal>

            {/* Headline arrives LAST — like a welcome sign you see when
                you pull into a town. Slow, deliberate, large. */}
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              style={{ color: '#28231C', marginBottom: 28, fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Let us find your <span style={{ color: '#A0845C', fontStyle: 'italic' }}>next chapter</span>
            </motion.h2>

            <Reveal as="div" delay={0.35} y={20} amount={0.2}>
              <p style={{ fontSize: 16, lineHeight: 2, color: '#28231C', opacity: 0.78, marginBottom: 36, maxWidth: 460 }}>
                Drop us a message and we will get back to you. No pitch, no pressure.
              </p>
            </Reveal>

            <Reveal as="div" delay={0.55} y={20} amount={0.2}>
              <div style={{ borderTop: '0.5px solid rgba(40,35,28,0.2)', paddingTop: 22 }}>
                <span style={lab}>Email</span>
                <a href="mailto:info@valeandmercer.co.uk" className="link-underline" style={{ fontSize: 16, color: '#28231C', display: 'inline-block' }}>
                  info@valeandmercer.co.uk
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal y={28} delay={0.05} amount={0.2}>
            <div>
              {status === 'sent' ? (
                <div style={{ padding: '56px 32px', background: 'rgba(255,255,255,0.6)', border: '0.5px solid #DDD7CC', borderRadius: 10, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300, color: '#28231C', marginBottom: 14 }}>Thank you</div>
                  <p style={{ fontSize: 14, color: '#6B6258', lineHeight: 1.9, maxWidth: 360, margin: '0 auto' }}>
                    We have received your message and will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <Stagger as="div" stagger={0.07} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <StaggerItem>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <div>
                        <label style={lab}>First name</label>
                        <input type="text" placeholder="James" style={inp} value={form.firstName}
                          onChange={e => setForm({ ...form, firstName: e.target.value })}
                          onFocus={e => (e.currentTarget.style.borderColor = '#A0845C')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#C8C0B4')} />
                      </div>
                      <div>
                        <label style={lab}>Last name</label>
                        <input type="text" placeholder="Sutton" style={inp} value={form.lastName}
                          onChange={e => setForm({ ...form, lastName: e.target.value })}
                          onFocus={e => (e.currentTarget.style.borderColor = '#A0845C')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#C8C0B4')} />
                      </div>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <label style={lab}>Email</label>
                    <input type="email" placeholder="your@email.com" style={inp} value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={e => (e.currentTarget.style.borderColor = '#A0845C')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#C8C0B4')} />
                  </StaggerItem>
                  <StaggerItem>
                    <label style={lab}>I am interested in</label>
                    <select style={{ ...inp, appearance: 'none' }} value={form.interest}
                      onChange={e => setForm({ ...form, interest: e.target.value })}
                      onFocus={e => (e.currentTarget.style.borderColor = '#A0845C')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#C8C0B4')}>
                      <option>Renting a property</option>
                      <option>Selling my property</option>
                      <option>A valuation</option>
                      <option>Student lettings</option>
                    </select>
                  </StaggerItem>
                  <StaggerItem>
                    <label style={lab}>Message</label>
                    <textarea rows={4} placeholder="Tell us what you are looking for..." style={{ ...inp, resize: 'none' }} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      onFocus={e => (e.currentTarget.style.borderColor = '#A0845C')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#C8C0B4')} />
                  </StaggerItem>
                  {status === 'error' && (
                    <p style={{ fontSize: 13, color: '#c0392b' }}>Something went wrong. Please try again.</p>
                  )}
                  <StaggerItem>
                    <p style={{ fontSize: 11, color: '#9A9188', lineHeight: 1.8 }}>
                      We will use your details to respond to your enquiry and, if you agree, to send you property updates. See our{' '}
                      <a href="/privacy" className="link-underline" style={{ color: '#A0845C' }}>Privacy Notice</a> for full details.
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <SubmitButton onClick={handleSubmit} status={status} />
                  </StaggerItem>
                </Stagger>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SubmitButton({ onClick, status }: { onClick: () => void; status: 'idle' | 'sending' | 'sent' | 'error' }) {
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
        padding: '18px 28px',
        border: 'none',
        cursor: disabled ? 'wait' : 'pointer',
        width: '100%',
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
        {status === 'sending' ? 'Sending...' : 'Send Message'}
        {status !== 'sending' && <span aria-hidden>→</span>}
      </span>
    </button>
  )
}
