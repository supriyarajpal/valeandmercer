'use client'
import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { submitToWeb3Forms } from '@/lib/web3forms'
import { useFormGuard } from '@/lib/formGuard'

// The city-page enquiry form. Same Web3Forms submission and the same invisible
// spam protections as the /buy new-homes enquiry (honeypot, min time on form,
// server-side rate limit via useFormGuard): a tripped bot gets a silent
// fake-success, a rate-limited IP a generic notice, genuine submits fall
// through. The only difference from the development form is the subject/area.

export default function CityEnquiry({ city }: { city: string }) {
  const area = `New Homes in ${city}`
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'rate-limited'>('idle')
  const [consentError, setConsentError] = useState(false)
  const { honeypotField, precheck } = useFormGuard()

  const handleSubmit = async () => {
    if (!form.consent) { setConsentError(true); return }
    setConsentError(false)
    setStatus('sending')
    const verdict = await precheck('New Homes Enquiry')
    if (verdict === 'spam') { setStatus('sent'); return }
    if (verdict === 'rate-limited') { setStatus('rate-limited'); return }
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
    try {
      const ok = await submitToWeb3Forms({
        subject: `New Homes Enquiry: ${area}`,
        from_name: 'Vale and Mercer Website',
        replyto: form.email,
        'Form': 'New Homes Enquiry',
        'Area': area,
        'Name': fullName,
        'Email': form.email,
        'Phone': form.phone,
        'Message': form.message,
        'Consent given': 'Yes (given at submission)',
      })
      setStatus(ok ? 'sent' : 'error')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('City enquiry network error', err)
      setStatus('error')
    }
  }

  const inp: React.CSSProperties = { background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--text)', fontSize: 15, padding: '12px 0', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)', transition: 'border-color 0.4s var(--ease-out-soft)' }
  const lab: React.CSSProperties = { fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8, display: 'block' }
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#A0845C' }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--border-strong)' }

  return (
    <section id="enquiry-form" style={{ background: 'var(--surface)', padding: 'var(--section-y) 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 var(--gutter)' }}>
        <Reveal y={24} amount={0.15}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Enquiry</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--text)', fontSize: 'clamp(24px, 3.2vw, 38px)', lineHeight: 1.14, marginBottom: 24 }}>Register your interest</h2>
        </Reveal>

        {status === 'sent' ? (
          <Reveal y={20}>
            <div className="glass-cream" style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 'var(--radius-lg)', maxWidth: 760 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, fontWeight: 300, color: 'var(--text)', marginBottom: 14 }}>Thank you</div>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--text-muted)' }}>We have your enquiry and will be in touch shortly.</p>
            </div>
          </Reveal>
        ) : (
          <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div className="form-name-row">
              <div>
                <label style={lab}>First name</label>
                <input type="text" style={inp} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={lab}>Last name</label>
                <input type="text" style={inp} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
            <div>
              <label style={lab}>Email address</label>
              <input type="email" style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={lab}>Phone number</label>
              <input type="tel" style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={lab}>Message</label>
              <textarea rows={4} style={{ ...inp, resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            {status === 'error' && <p style={{ fontSize: 13, color: '#c0392b' }}>Something went wrong. Please try again.</p>}
            {status === 'rate-limited' && <p style={{ fontSize: 13, color: '#c0392b' }}>Too many submissions. Please try again in a few minutes.</p>}
            {honeypotField}
            <div>
              <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.consent} onChange={e => { setForm({ ...form, consent: e.target.checked }); if (e.target.checked) setConsentError(false) }} aria-invalid={consentError} style={{ marginTop: 3, width: 16, height: 16, accentColor: '#A0845C', flexShrink: 0, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.8, letterSpacing: '0.01em' }}>
                  I agree to Vale and Mercer contacting me about this enquiry and, optionally, with property updates. Unsubscribe anytime.{' '}
                  <a href="/privacy" className="link-underline" style={{ color: '#A0845C' }}>Privacy Notice</a>.
                </span>
              </label>
              {consentError && <p role="alert" style={{ fontSize: 12, color: '#c0392b', marginTop: 8, marginLeft: 28 }}>Please tick the box to consent before submitting.</p>}
            </div>
            <button onClick={handleSubmit} disabled={status === 'sending'} className="btn-press" style={{ position: 'relative', background: '#34302B', color: '#F2EFE9', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '18px 28px', border: 'none', borderRadius: 'var(--radius-pill)', cursor: status === 'sending' ? 'wait' : 'pointer', overflow: 'hidden', width: '100%' }}>
              <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
                {status !== 'sending' && <span aria-hidden>{'→'}</span>}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
