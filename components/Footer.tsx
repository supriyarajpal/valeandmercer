'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

const navItems = [
  { label: 'Lettings', href: '/let' },
  { label: 'New Homes', href: '/buy' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Fees', href: '/fees' },
  { label: 'Book Valuation', href: '/valuations' },
]

const legalItems = [
  { label: 'Privacy Notice', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Complaints Policy', href: '/complaints' },
  { label: 'Terms of Use', href: '/terms' },
]

const linkStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(239,236,230,0.72)',
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
  return (
    <motion.footer
      initial={reduce ? false : { opacity: 0, scale: 0.98, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.4, ease: EASE }}
      style={{ background: '#28231C', color: '#EFECE6', transformOrigin: 'center bottom', willChange: 'transform, opacity' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 56 }}>
          <Stagger as="div" stagger={0.08}>
            <StaggerItem>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, letterSpacing: '0.26em', textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: 'rgba(239,236,230,0.95)' }}>VALE</span>
                <span style={{ color: '#A0845C' }}> &amp; </span>
                <span style={{ color: 'rgba(239,236,230,0.98)' }}>MERCER</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(239,236,230,0.72)', marginBottom: 18, maxWidth: 290 }}>
                Lettings, new homes and student lets across London.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', color: 'rgba(239,236,230,0.58)', marginBottom: 22, letterSpacing: '0.01em' }}>
                London, handled with care.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div style={{ borderTop: '0.5px solid rgba(239,236,230,0.1)', paddingTop: 16 }}>
                <a href="https://www.propertyredress.co.uk" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginBottom: 10 }}>
                  <div style={{ background: '#fff', padding: '6px 10px', display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="60" height="22" viewBox="0 0 120 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="8" width="6" height="26" fill="#333" />
                      <rect x="9" y="14" width="6" height="20" fill="#9B59B6" />
                      <rect x="18" y="19" width="6" height="15" fill="#C39BD3" />
                      <text x="28" y="22" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#333">Property</text>
                      <text x="28" y="36" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#333">Redress</text>
                    </svg>
                  </div>
                </a>
                <p style={{ fontSize: 11.5, color: 'rgba(239,236,230,0.55)', lineHeight: 1.75 }}>
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
                <p className="eyebrow" style={{ fontSize: 11, color: '#A0845C', margin: 0, letterSpacing: '0.22em' }}>Navigate</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                <p className="eyebrow" style={{ fontSize: 11, color: '#A0845C', margin: 0, letterSpacing: '0.22em' }}>Contact</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(239,236,230,0.5)', marginBottom: 6 }}>Email</div>
                <a href="mailto:info@valeandmercer.co.uk" className="link-underline" style={{ fontSize: 13, color: 'rgba(239,236,230,0.78)', letterSpacing: '0.01em' }}>
                  info@valeandmercer.co.uk
                </a>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(239,236,230,0.5)', marginBottom: 6 }}>Registered Office</div>
                <p style={{ fontSize: 13, color: 'rgba(239,236,230,0.7)', lineHeight: 1.75 }}>124 City Road, London EC1V 2NX</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

      <div style={{ borderTop: '0.5px solid rgba(239,236,230,0.1)', padding: '22px 20px 28px', maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: 12, color: 'rgba(239,236,230,0.55)', marginBottom: 16, lineHeight: 1.85 }}>
          2026 Vale and Mercer Ltd. Company No: 17212434. Registered in England and Wales. ICO No: ZC155397. AML Supervised by HMRC.
        </p>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center' }}>
          {legalItems.map(item => (
            <Link key={item.label} href={item.href} className="link-underline" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(239,236,230,0.6)' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.footer>
  )
}
