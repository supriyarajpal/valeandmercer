'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Inline disclosure pattern lifted from Navbar's mobile menu — same useState
// toggle + AnimatePresence + aria-expanded shape, scaled down to a
// per-button flyout list. Kept inline (not a positioned popover) so mobile
// tap behaviour is glitch-free and no positioning math is needed.

type Intent = 'viewing' | 'offer'

type Props = {
  title: string
  propertyRef: string
  rent: string
}

const AGENT_EMAIL   = 'enquire@valeandmercer.co.uk'
const AGENT_TEL_URL = 'tel:+447517696926'                    // no spaces per RFC 3966
const AGENT_TEL_LBL = '+44 7517 696926'
const AGENT_WA      = '447517696926'                          // wa.me uses country code without '+'

// Stricter encoder for mailto: query params. encodeURIComponent by itself
// leaves `!*'()` unencoded (they're "sub-delims" in RFC 3986), which some
// mail clients — Outlook / Windows Mail in particular — refuse to parse.
// Explicitly percent-encode those characters so the mailto works on every
// mail app we've ever seen.
function encodeMailtoParam(value: string): string {
  return encodeURIComponent(value)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

function buildMessage(intent: Intent, title: string, propertyRef: string, rent: string) {
  const noun          = intent === 'viewing' ? 'book a viewing for'          : 'make an offer on'
  const subjectPrefix = intent === 'viewing' ? 'Book a Viewing'              : 'Enquiry – Make an Offer'
  const subject = `${subjectPrefix} – ${title}, Ref ${propertyRef}`
  // CRLF (\r\n) per RFC 6068 for mailto: body newlines. LF-only worked in
  // Chrome + macOS Mail but was silently dropped by some Outlook builds.
  const body    = `Hi, I'd like to ${noun} ${title} (Ref ${propertyRef}, ${rent}).\r\n\r\n`
  return { subject, body }
}

export default function PropertyEnquiryActions({ title, propertyRef, rent }: Props) {
  const [open, setOpen] = useState<Intent | null>(null)
  const wrapperRef      = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape. Only mounts listeners while open.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      if (wrapperRef.current && !wrapperRef.current.contains(target)) setOpen(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
    }
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
        intent="viewing"
        label="Book a Viewing"
        variant="gold"
        title={title}
        propertyRef={propertyRef}
        rent={rent}
        isOpen={open === 'viewing'}
        onToggle={() => setOpen(o => (o === 'viewing' ? null : 'viewing'))}
        onSelect={() => setOpen(null)}
      />
      <EnquiryDisclosure
        intent="offer"
        label="Make an Offer"
        variant="outlined-light"
        title={title}
        propertyRef={propertyRef}
        rent={rent}
        isOpen={open === 'offer'}
        onToggle={() => setOpen(o => (o === 'offer' ? null : 'offer'))}
        onSelect={() => setOpen(null)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */

type DisclosureProps = {
  intent: Intent
  label: string
  variant: 'gold' | 'outlined-light'
  title: string
  propertyRef: string
  rent: string
  isOpen: boolean
  onToggle: () => void
  onSelect: () => void
}

function EnquiryDisclosure({
  intent, label, variant, title, propertyRef, rent, isOpen, onToggle, onSelect,
}: DisclosureProps) {
  const reduce  = useReducedMotion()
  const panelId = `enquiry-panel-${intent}`

  const { subject, body } = buildMessage(intent, title, propertyRef, rent)
  const mailtoHref = `mailto:${AGENT_EMAIL}?subject=${encodeMailtoParam(subject)}&body=${encodeMailtoParam(body)}`
  // wa.me uses ordinary URL encoding — strict mailto rules do not apply.
  const waHref     = `https://wa.me/${AGENT_WA}?text=${encodeURIComponent(body)}`

  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    padding: '15px 24px',
    borderRadius: 'var(--radius-pill)',
    cursor: 'pointer',
    transition: 'background var(--dur) var(--ease-apple), color var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple), transform var(--dur) var(--ease-apple)',
  }
  // gold = primary; the ghost variant is a subtle glass tint that reads as
  // frosted over the glass Enquire panel behind it.
  const btnVariant = variant === 'gold'
    ? { background: '#A0845C', color: '#F2EFE9', border: '1px solid #A0845C' }
    : { background: 'rgba(242,239,233,0.06)', color: 'rgba(242,239,233,0.9)', border: '1px solid rgba(242,239,233,0.28)' }

  return (
    <div>
      <button
        type="button"
        className="btn-press"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        style={{ ...btnBase, ...btnVariant }}
      >
        <span>{label}</span>
        <span
          aria-hidden
          style={{
            fontSize: 12,
            display: 'inline-block',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.35s var(--ease-out-soft)',
          }}
        >
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={panelId}
            id={panelId}
            initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <ul
              className="glass"
              style={{
                listStyle: 'none',
                margin: '8px 0 0',
                padding: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <EnquiryItem
                heading="Call"
                detail={AGENT_TEL_LBL}
                href={AGENT_TEL_URL}
                onSelect={onSelect}
              />
              <EnquiryItem
                heading="Email"
                detail={AGENT_EMAIL}
                href={mailtoHref}
                onSelect={onSelect}
              />
              <EnquiryItem
                heading="WhatsApp"
                detail="Message with property details pre-filled"
                href={waHref}
                external
                onSelect={onSelect}
              />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function EnquiryItem({
  heading, detail, href, external, onSelect,
}: {
  heading: string
  detail: string
  href: string
  external?: boolean
  onSelect: () => void
}) {
  // For non-http(s) schemes (mailto:, tel:), some browsers drop the OS
  // handoff when the click also triggers a React state update that
  // unmounts the anchor (in our case, AnimatePresence exit on the
  // parent panel). Assigning window.location.href side-steps that
  // ordering and reliably launches the OS handler. The href attribute
  // is kept so right-click "copy link", keyboard, and no-JS fallbacks
  // still work.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!external) {
      e.preventDefault()
      onSelect()
      // Defer navigation past this click's event loop turn so the
      // panel's exit animation begins first and the OS handler opens
      // over a settled DOM.
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          padding: '14px 20px',
          minHeight: 56,               // ≥44 iOS tap target
          color: '#F2EFE9',
          transition: 'background 0.3s var(--ease-out-soft)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.14)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#A0845C' }}>
            {heading}
          </span>
          <span style={{ fontSize: 13, color: 'rgba(242,239,233,0.78)', wordBreak: 'break-word' }}>
            {detail}
          </span>
        </div>
        <span aria-hidden style={{ color: '#A0845C', fontSize: 14, flexShrink: 0 }}>→</span>
      </a>
    </li>
  )
}
