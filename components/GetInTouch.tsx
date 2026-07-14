'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, Stagger, StaggerItem, useInViewSafe } from '@/components/Reveal'
import { submitToWeb3Forms } from '@/lib/web3forms'

const EASE = [0.22, 1, 0.36, 1] as const

export default function GetInTouch() {
  const reduce = useReducedMotion()
  const { ref: headlineRef, inView: headlineInView } = useInViewSafe<HTMLHeadingElement>(0.3)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', interest: 'Lettings enquiry', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [consentError, setConsentError] = useState(false)

  const handleSubmit = async () => {
    if (!form.consent) {
      setConsentError(true)
      return
    }
    setConsentError(false)
    setStatus('sending')
    // Client-side submission to Web3Forms (its free tier is browser-only).
    // The access key resolves via lib/web3forms — env var when set, public
    // fallback otherwise — so it never depends on a build-time Vercel var.
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
    try {
      const ok = await submitToWeb3Forms({
        subject: 'New Enquiry from Website: ' + fullName,
        from_name: 'Vale and Mercer Website',
        replyto: form.email,
        'Form': 'Homepage Enquiry',
        'Name': fullName,
        'Email': form.email,
        'Interested in': form.interest,
        'Message': form.message,
        'Consent given': 'Yes (given at submission)',
      })
      setStatus(ok ? 'sent' : 'error')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Contact submission network error', err)
      setStatus('error')
    }
  }

  const inp: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-strong)',
    color: 'var(--text)',
    fontSize: 16,
    padding: '14px 0',
    minHeight: 48,
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.4s var(--ease-out-soft), background 0.3s var(--ease-out-soft)',
  }
  const focusOn = (el: HTMLElement) => {
    el.style.borderColor = '#A0845C'
    el.style.background = 'rgba(160,132,92,0.06)'
  }
  const focusOff = (el: HTMLElement) => {
    el.style.borderColor = 'var(--border-strong)'
    el.style.background = 'transparent'
  }
  const lab: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
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
              ref={headlineRef}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={reduce ? undefined : headlineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              style={{ color: 'var(--text)', marginBottom: 28, fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Let us find your <span style={{ color: '#A0845C', fontStyle: 'italic' }}>next chapter</span>
            </motion.h2>

            <Reveal as="div" delay={0.35} y={20} amount={0.2}>
              <p style={{ fontSize: 16, lineHeight: 2, color: 'var(--text)', opacity: 0.78, marginBottom: 22, maxWidth: 460 }}>
                Drop us a message and we will get back to you. No pitch, no pressure.
              </p>
            </Reveal>

            <Reveal as="div" delay={0.55} y={20} amount={0.2}>
              <div style={{ borderTop: '0.5px solid rgba(52,48,43,0.2)', paddingTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={lab}>Email</span>
                <a href="mailto:info@valeandmercer.co.uk" className="link-underline" style={{ fontSize: 16, color: 'var(--text)' }}>
                  info@valeandmercer.co.uk
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal y={28} delay={0.05} amount={0.2}>
            <div>
              {status === 'sent' ? (
                <div style={{ position: 'relative' }}>
                  {/* Gold/bronze blob backdrop so the cream glass panel has real
                      texture for backdrop-filter to blur (no-op over flat cream). */}
                  <div aria-hidden style={{ position: 'absolute', inset: '-6%', zIndex: 0, pointerEvents: 'none', filter: 'blur(30px)', background: 'radial-gradient(38% 45% at 26% 30%, rgba(160,132,92,0.5), transparent 70%), radial-gradient(42% 45% at 80% 74%, rgba(122,96,62,0.42), transparent 72%), radial-gradient(40% 40% at 62% 18%, rgba(189,160,122,0.4), transparent 72%)' }} />
                  <div className="glass-cream" style={{ position: 'relative', zIndex: 1, padding: '56px 32px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300, color: 'var(--text)', marginBottom: 14 }}>Thank you</div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.9, maxWidth: 360, margin: '0 auto' }}>
                      We have received your message and will be in touch within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <Stagger as="div" stagger={0.07} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <StaggerItem>
                    <div className="form-name-row">
                      <div>
                        <label style={lab}>First name</label>
                        <input type="text" placeholder="James" style={inp} value={form.firstName}
                          onChange={e => setForm({ ...form, firstName: e.target.value })}
                          onFocus={e => focusOn(e.currentTarget)}
                          onBlur={e => focusOff(e.currentTarget)} />
                      </div>
                      <div>
                        <label style={lab}>Last name</label>
                        <input type="text" placeholder="Sutton" style={inp} value={form.lastName}
                          onChange={e => setForm({ ...form, lastName: e.target.value })}
                          onFocus={e => focusOn(e.currentTarget)}
                          onBlur={e => focusOff(e.currentTarget)} />
                      </div>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <label style={lab}>Email</label>
                    <input type="email" inputMode="email" autoComplete="email" placeholder="your@email.com" style={inp} value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={e => focusOn(e.currentTarget)}
                      onBlur={e => focusOff(e.currentTarget)} />
                  </StaggerItem>
                  <StaggerItem>
                    <label style={lab}>I am interested in</label>
                    <select className="field-select" style={{ ...inp, appearance: 'none' }} value={form.interest}
                      onChange={e => setForm({ ...form, interest: e.target.value })}
                      onFocus={e => focusOn(e.currentTarget)}
                      onBlur={e => focusOff(e.currentTarget)}>
                      <option>Renting a property</option>
                      <option>Selling my property</option>
                      <option>A valuation</option>
                      <option>Student lettings</option>
                    </select>
                  </StaggerItem>
                  <StaggerItem>
                    <label style={lab}>Message</label>
                    <textarea rows={1} placeholder="Tell us what you are looking for..." style={{ ...inp, resize: 'vertical' }} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      onFocus={e => focusOn(e.currentTarget)}
                      onBlur={e => focusOff(e.currentTarget)} />
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

function ConsentCheckbox({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error: boolean }) {
  return (
    <div>
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          aria-invalid={error}
          aria-describedby={error ? 'consent-error-contact' : undefined}
          style={{
            marginTop: 3,
            width: 16,
            height: 16,
            accentColor: '#A0845C',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.8, letterSpacing: '0.01em' }}>
          I agree to Vale &amp; Mercer contacting me about this enquiry and, optionally, with property updates. Unsubscribe anytime.{' '}
          <a href="/privacy" className="link-underline" style={{ color: '#A0845C' }}>Privacy Notice</a>.
        </span>
      </label>
      {error && (
        <p id="consent-error-contact" role="alert" style={{ fontSize: 12, color: '#c0392b', marginTop: 8, marginLeft: 28 }}>
          Please tick the box to consent before submitting.
        </p>
      )}
    </div>
  )
}

function SubmitButton({ onClick, status }: { onClick: () => void; status: 'idle' | 'sending' | 'sent' | 'error' }) {
  const disabled = status === 'sending'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-press"
      style={{
        position: 'relative',
        background: '#34302B',
        color: '#F2EFE9',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        padding: '20px 28px',
        minHeight: 56,
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'wait' : 'pointer',
        width: '100%',
        overflow: 'hidden',
        transition: 'color var(--dur) var(--ease-apple), transform var(--dur) var(--ease-apple)',
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
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: '#A0845C', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-apple)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
        {status !== 'sending' && <span aria-hidden>→</span>}
      </span>
    </button>
  )
}
