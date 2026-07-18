'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Stagger, StaggerItem, useInViewSafe } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

const navItems = [
  { label: 'Lettings',         href: '/let' },
  { label: 'Student Lettings', href: '/student-lettings' },
  { label: 'New Homes',        href: '/buy' },
  { label: 'About',            href: '/about' },
  { label: 'Blog',             href: '/blog' },
  { label: 'Fees',             href: '/fees' },
  { label: 'Book Valuation',   href: '/valuations' },
]

const legalItems = [
  { label: 'Privacy Notice', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Complaints Policy', href: '/complaints' },
  { label: 'Terms of Use', href: '/terms' },
]

const linkStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(242,239,233,0.35)',
  letterSpacing: '0.03em',
}

const eyebrowRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 18,
}

const eyebrowRule: React.CSSProperties = {
  width: 22,
  height: 1,
  background: '#A0845C',
  flexShrink: 0,
}

export default function Footer() {
  const reduce = useReducedMotion()
  const { ref, inView } = useInViewSafe<HTMLElement>(0.1)
  return (
    <motion.footer
      ref={ref as never}
      initial={reduce ? false : { opacity: 0, scale: 0.98, y: 24 }}
      animate={reduce ? undefined : inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 24 }}
      transition={{ duration: 1.4, ease: EASE }}
      style={{ background: '#3E3931', color: '#F2EFE9', transformOrigin: 'center bottom', willChange: 'transform, opacity' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 20px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <Stagger as="div" stagger={0.08}>
            <StaggerItem>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: 'rgba(242,239,233,0.85)' }}>VALE</span>
                <span style={{ color: '#A0845C' }}> &amp; </span>
                <span style={{ color: 'rgba(242,239,233,0.95)' }}>MERCER</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontStyle: 'italic', color: 'rgba(242,239,233,0.55)', marginBottom: 20, letterSpacing: '0.01em' }}>
                London, handled with care.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div style={{ borderTop: '0.5px solid rgba(242,239,233,0.08)', paddingTop: 16 }}>
                {/* Accreditation badges sit side by side on one row. Both use
                    the same white plate + 8px/12px padding and the same 28px
                    logo height so they read as a matched pair regardless of
                    each logo's own aspect ratio. */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 10 }}>
                  <a href="https://www.propertyredress.co.uk" target="_blank" rel="noreferrer" style={{ display: 'inline-flex' }}>
                    <div style={{ background: '#fff', padding: '8px 12px', display: 'inline-flex', alignItems: 'center' }}>
                      <svg width="80" height="28" viewBox="0 0 120 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="8" width="6" height="26" fill="#333" />
                        <rect x="9" y="14" width="6" height="20" fill="#9B59B6" />
                        <rect x="18" y="19" width="6" height="15" fill="#C39BD3" />
                        <text x="28" y="22" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#333">Property</text>
                        <text x="28" y="36" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#333">Redress</text>
                      </svg>
                    </div>
                  </a>
                  {/* Same 44px-tall white plate as the Property Redress badge
                      (11px vertical padding + 22px logo = 44), so the two sit
                      as a matched pair on one baseline. Width scales with the
                      logo's own (wide) aspect ratio. */}
                  <div style={{ background: '#fff', padding: '11px 14px', display: 'inline-flex', alignItems: 'center' }}>
                    <img
                      src="/images/footer-image.svg"
                      alt="ARLA Propertymark"
                      style={{ height: 22, width: 'auto', display: 'block' }}
                    />
                  </div>
                  {/* Same 44px-tall white plate as the other two badges, but a
                      taller logo (32px vs 22px) inside its 6px padding: this is
                      a text-heavy 3-line lockup, so it needs more height to read
                      at the same weight as "Property Redress"/"arla". The source
                      PNG is cropped tight to its content so it fills the plate. */}
                  <div style={{ background: '#fff', padding: '6px 12px', display: 'inline-flex', alignItems: 'center' }}>
                    <img
                      src="/images/tenancy-deposit.png"
                      alt="Tenancy Deposit Scheme"
                      style={{ height: 32, width: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
                <p style={{ fontSize: 10, color: 'rgba(242,239,233,0.25)', lineHeight: 1.8 }}>
                  Member of Property Redress Scheme<br />
                  <span style={{ color: '#A0845C' }}>Membership No: PRS058796</span>
                </p>
              </div>
            </StaggerItem>
          </Stagger>

          <Stagger as="div" stagger={0.05}>
            <StaggerItem>
              <div style={eyebrowRow}>
                <span style={eyebrowRule} />
                <p className="eyebrow" style={{ fontSize: 9, color: '#A0845C', margin: 0, letterSpacing: '0.22em' }}>Navigate</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {navItems.map(item => (
                  <Link key={item.label} href={item.href} className="link-underline" style={linkStyle}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </StaggerItem>
          </Stagger>

          <Stagger as="div" stagger={0.05}>
            <StaggerItem>
              <div style={eyebrowRow}>
                <span style={eyebrowRule} />
                <p className="eyebrow" style={{ fontSize: 9, color: '#A0845C', margin: 0, letterSpacing: '0.22em' }}>Contact</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'rgba(242,239,233,0.2)', marginBottom: 4 }}>Email</div>
                <a href="mailto:info@valeandmercer.co.uk" className="link-underline" style={{ fontSize: 11, color: 'rgba(242,239,233,0.4)', letterSpacing: '0.01em' }}>
                  info@valeandmercer.co.uk
                </a>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'rgba(242,239,233,0.2)', marginBottom: 4 }}>Registered Office</div>
                <p style={{ fontSize: 11, color: 'rgba(242,239,233,0.35)', lineHeight: 1.7 }}>124 City Road, London EC1V 2NX</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

      <div style={{ borderTop: '0.5px solid rgba(242,239,233,0.06)', padding: '18px 20px', maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: 9, color: 'rgba(242,239,233,0.18)', marginBottom: 8, lineHeight: 1.9 }}>
          2026 Vale and Mercer Ltd. Company No: 17212434. Registered in England and Wales. ICO No: ZC155397. AML Supervised by HMRC.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {legalItems.map(item => (
            <Link key={item.label} href={item.href} className="link-underline" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(242,239,233,0.25)' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.footer>
  )
}
