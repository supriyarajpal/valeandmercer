'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// New-homes enquiry actions. This is the SAME call/email/WhatsApp disclosure
// pattern used on the lettings property page (components/PropertyEnquiryActions):
// identical flyout mechanics, contact channels, encoding rules and styling —
// only the button copy and the pre-filled message are tuned for a development
// sale rather than a rental. Kept as its own component so the lettings one is
// untouched. As on the lettings pages, only the public agency number is shown;
// no personal/direct number is ever exposed.

type Intent = 'viewing' | 'enquire'

const AGENT_EMAIL   = 'enquiry@valeandmercer.co.uk'
const AGENT_TEL_URL = 'tel:+447517696926'                    // no spaces per RFC 3966
const AGENT_TEL_LBL = '+44 7517 696926'
const AGENT_WA      = '447517696926'                          // wa.me uses country code without '+'

// Stricter encoder for mailto: query params (encodeURIComponent leaves some
// RFC-3986 sub-delims that Outlook/Windows Mail refuse to parse).
function encodeMailtoParam(value: string): string {
  return encodeURIComponent(value)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

function buildMessage(intent: Intent, name: string, price?: string) {
  const priceNote = price && price.trim() && price.trim() !== 'Register your interest' ? ` (${price})` : ''
  if (intent === 'viewing') {
    return {
      subject: `Book a Viewing – ${name}`,
      // CRLF per RFC 6068 for mailto: body newlines.
      body: `Hi, I'd like to book a viewing at ${name}${priceNote}.\r\n\r\n`,
    }
  }
  return {
    subject: `New Homes Enquiry – ${name}`,
    body: `Hi, I'd like more information about ${name}${priceNote}.\r\n\r\n`,
  }
}

export default function DevelopmentEnquiryActions({ name, price }: { name: string; price?: string }) {
  const [open, setOpen] = useState<Intent | null>(null)
  const wrapperRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      if (wrapperRef.current && !wrapperRef.current.contains(target)) setOpen(null)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapperRef} style={{ display: 'grid', gap: 12 }}>
      <EnquiryDisclosure
        intent="enquire" label="Enquire" variant="gold" name={name} price={price}
        isOpen={open === 'enquire'}
        onToggle={() => setOpen(o => (o === 'enquire' ? null : 'enquire'))}
        onSelect={() => setOpen(null)}
      />
      <EnquiryDisclosure
        intent="viewing" label="Book a Viewing" variant="outlined-light" name={name} price={price}
        isOpen={open === 'viewing'}
        onToggle={() => setOpen(o => (o === 'viewing' ? null : 'viewing'))}
        onSelect={() => setOpen(null)}
      />
    </div>
  )
}

type DisclosureProps = {
  intent: Intent
  label: string
  variant: 'gold' | 'outlined-light'
  name: string
  price?: string
  isOpen: boolean
  onToggle: () => void
  onSelect: () => void
}

function EnquiryDisclosure({ intent, label, variant, name, price, isOpen, onToggle, onSelect }: DisclosureProps) {
  const reduce  = useReducedMotion()
  const panelId = `dev-enquiry-panel-${intent}`

  const { subject, body } = buildMessage(intent, name, price)
  const mailtoHref = `mailto:${AGENT_EMAIL}?subject=${encodeMailtoParam(subject)}&body=${encodeMailtoParam(body)}`
  const waHref     = `https://wa.me/${AGENT_WA}?text=${encodeURIComponent(body)}`

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 12, width: '100%', fontFamily: 'var(--font-sans)', fontSize: 11,
    letterSpacing: '0.18em', textTransform: 'uppercase' as const, padding: '15px 24px',
    borderRadius: 'var(--radius-pill)', cursor: 'pointer',
    transition: 'background var(--dur) var(--ease-apple), color var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple), transform var(--dur) var(--ease-apple)',
  }
  const btnVariant = variant === 'gold'
    ? { background: '#A0845C', color: '#F2EFE9', border: '1px solid #A0845C' }
    : { background: 'rgba(242,239,233,0.06)', color: 'rgba(242,239,233,0.9)', border: '1px solid rgba(242,239,233,0.28)' }

  return (
    <div>
      <button type="button" className="btn-press" aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle} style={{ ...btnBase, ...btnVariant }}>
        <span>{label}</span>
        <span aria-hidden style={{ fontSize: 12, display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.35s var(--ease-out-soft)' }}>▾</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={panelId} id={panelId}
            initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {/* glass-strong (not glass): higher opacity so the flyout reads as a
                solid dark panel with legible light text, rather than the
                washed-out olive it showed when the thinner .glass let the page
                bleed through. */}
            <ul className="glass-strong" style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(242,239,233,0.12)' }}>
              <EnquiryItem heading="Call" detail={AGENT_TEL_LBL} href={AGENT_TEL_URL} onSelect={onSelect} />
              <EnquiryItem heading="Email" detail={AGENT_EMAIL} href={mailtoHref} onSelect={onSelect} />
              <EnquiryItem heading="WhatsApp" detail="Message with development details pre-filled" href={waHref} external onSelect={onSelect} />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EnquiryItem({ heading, detail, href, external, onSelect }: { heading: string; detail: string; href: string; external?: boolean; onSelect: () => void }) {
  // For mailto:/tel:, assign window.location.href so the OS handoff survives
  // the panel's exit-animation unmount (same reliability note as the lettings
  // component). The href attribute is kept for right-click / no-JS.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!external) {
      e.preventDefault()
      onSelect()
      setTimeout(() => { window.location.href = href }, 0)
      return
    }
    onSelect()
  }

  return (
    <li style={{ borderTop: '0.5px solid rgba(242,239,233,0.08)' }}>
      <a
        href={href}
        onClick={handleClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 20px', minHeight: 56, color: '#F2EFE9', transition: 'background 0.3s var(--ease-out-soft)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.14)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#A0845C' }}>{heading}</span>
          <span style={{ fontSize: 13, color: 'rgba(242,239,233,0.78)', wordBreak: 'break-word' }}>{detail}</span>
        </div>
        <span aria-hidden style={{ color: '#A0845C', fontSize: 14, flexShrink: 0 }}>→</span>
      </a>
    </li>
  )
}
