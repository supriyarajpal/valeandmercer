'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', interest: 'Renting', budget: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [consentError, setConsentError] = useState(false)

  const handleSubmit = async () => {
    if (!form.consent) {
      setConsentError(true)
      return
    }
    setConsentError(false)
    setStatus('sending')
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      // eslint-disable-next-line no-console
      console.error('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set')
      setStatus('error')
      return
    }
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'Property Alert Registration: ' + fullName,
          from_name: 'Vale and Mercer Website',
          replyto: form.email,
          'Form': 'Property Alert Registration',
          'Name': fullName,
          'Email': form.email,
          'Phone': form.phone,
          'Looking for': form.interest,
          'Budget': form.budget,
          'Consent given': 'Yes (given at submission)',
        }),
      })
      const result = await res.json().catch(() => null)
      if (res.ok && result?.success) setStatus('sent')
      else {
        // eslint-disable-next-line no-console
        console.error('Web3Forms rejected the submission', result)
        setStatus('error')
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Web3Forms network error', err)
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
            <h1 style={{ color: '#4A4036', marginBottom: 18 }}>
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
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 52, fontWeight: 300, color: '#4A4036', marginBottom: 18 }}>Thank you</div>
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
                <ConsentCheckbox
                  checked={form.consent}
                  onChange={next => {
                    setForm({ ...form, consent: next })
                    if (next) setConsentError(false)
                  }}
                  error={consentError}
                />
              </StaggerItem>
              <StaggerItem>
                <SubmitBtn status={status} onClick={handleSubmit} />
              </StaggerItem>
            </Stagger>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function ConsentCheckbox({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error: boolean }) {
  return (
    <div>
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          aria-invalid={error}
          aria-describedby={error ? 'consent-error-register' : undefined}
          style={{
            marginTop: 3,
            width: 16,
            height: 16,
            accentColor: '#A0845C',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: 11, color: '#6B6258', lineHeight: 1.8, letterSpacing: '0.01em' }}>
          I consent to Vale &amp; Mercer collecting and processing my information to respond to my enquiry. I understand my details may also be used to send me relevant property updates and marketing communications, and I can unsubscribe at any time. See our{' '}
          <a href="/privacy" className="link-underline" style={{ color: '#A0845C' }}>Privacy Notice</a> for full details.
        </span>
      </label>
      {error && (
        <p id="consent-error-register" role="alert" style={{ fontSize: 12, color: '#c0392b', marginTop: 8, marginLeft: 28 }}>
          Please tick the box to consent before submitting.
        </p>
      )}
    </div>
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
