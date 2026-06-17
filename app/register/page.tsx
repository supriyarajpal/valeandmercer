'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', interest: 'Renting', budget: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'Property Alert Registration' }),
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
    marginBottom: 8,
    display: 'block',
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#A0845C' }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#C8C0B4' }

  return (
    <>
      <Navbar />
      <main style={{ background: '#EFECE6', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Stay Informed</p>
          </Reveal>
          <Reveal y={28} delay={0.05} amount={0.2}>
            <h1 style={{ color: '#28231C', marginBottom: 18 }}>
              Be first to hear about <span style={{ color: '#A0845C', fontStyle: 'italic' }}>new listings</span>
            </h1>
          </Reveal>
          <Reveal y={20} delay={0.1} amount={0.2}>
            <p style={{ fontSize: 15, lineHeight: 2, color: '#6B6258', marginBottom: 56 }}>
              Tell us what you need and we will get in touch when something fits. No spam.
            </p>
          </Reveal>

          {status === 'sent' ? (
            <Reveal y={24}>
              <div style={{ textAlign: 'center', padding: '96px 32px', background: '#FFFFFF', border: '0.5px solid #DDD7CC', borderRadius: 10 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 52, fontWeight: 300, color: '#28231C', marginBottom: 18 }}>Thank you</div>
                <p style={{ fontSize: 15, lineHeight: 2, color: '#6B6258' }}>
                  We have your details. We will be in touch as soon as something suitable comes up.
                </p>
              </div>
            </Reveal>
          ) : (
            <Stagger as="div" stagger={0.07} amount={0.1} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              <StaggerItem>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                  <div>
                    <label style={lab}>First name</label>
                    <input type="text" style={inp} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={lab}>Last name</label>
                    <input type="text" style={inp} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <label style={lab}>Email address</label>
                <input type="email" style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
              </StaggerItem>
              <StaggerItem>
                <label style={lab}>Phone number</label>
                <input type="tel" style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
              </StaggerItem>
              <StaggerItem>
                <label style={lab}>I am looking for</label>
                <select style={{ ...inp, appearance: 'none' }} value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} onFocus={onFocus} onBlur={onBlur}>
                  <option>Renting</option>
                  <option>Student Let</option>
                  <option>New Home</option>
                  <option>Both</option>
                </select>
              </StaggerItem>
              <StaggerItem>
                <label style={lab}>Budget</label>
                <input type="text" placeholder="e.g. £2,000 pcm" style={inp} value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
              </StaggerItem>
              {status === 'error' && (
                <p style={{ fontSize: 13, color: '#c0392b' }}>Something went wrong. Please try again.</p>
              )}
              <StaggerItem>
                <SubmitBtn status={status} onClick={handleSubmit} />
              </StaggerItem>
              <StaggerItem>
                <p style={{ fontSize: 11, color: '#9A9188', lineHeight: 1.8 }}>
                  No spam. Unsubscribe at any time. See our{' '}
                  <a href="/privacy" className="link-underline" style={{ color: '#A0845C' }}>Privacy Notice</a> for details.
                </p>
              </StaggerItem>
            </Stagger>
          )}
        </div>
      </main>
      <Footer />
    </>
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
        padding: '18px 28px',
        border: 'none',
        cursor: disabled ? 'wait' : 'pointer',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft)',
        width: '100%',
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
        {disabled ? 'Sending...' : 'Request Property Alerts'}
        {!disabled && <span aria-hidden>→</span>}
      </span>
    </button>
  )
}
