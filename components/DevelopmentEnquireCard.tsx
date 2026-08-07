'use client'
import { Reveal } from '@/components/Reveal'
import DevelopmentEnquiryActions from '@/components/DevelopmentEnquiryActions'

// Sticky right-column enquire card — a faithful copy of the lettings property
// sidebar card (app/property/[slug]/page.tsx → PropertySidebar): the same
// glass-strong panel over a blurred gold/bronze/ink blob backdrop, same text
// treatment, same email + actions layout. The blurred backdrop is CLIPPED to
// this card (overflow:hidden + inset:0 on a position:relative wrapper) and lives
// entirely inside this component, so it can never leak onto the page — the same
// scoping the lettings card relies on.

const AGENT_EMAIL = 'enquiry@valeandmercer.co.uk'

export default function DevelopmentEnquireCard({ name, price }: { name: string; price?: string }) {
  const subject = encodeURIComponent(`New Homes Enquiry: ${name}`)
  return (
    <aside style={{ position: 'sticky', top: 140 }}>
      <Reveal y={20} amount={0.1}>
        <div style={{ position: 'relative' }}>
          {/* Backdrop scoped ONLY to this card — clipped to its rounded box. */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ position: 'absolute', inset: '-15%', filter: 'blur(22px)', background: 'radial-gradient(45% 35% at 24% 18%, rgba(160,132,92,0.75), transparent 68%), radial-gradient(52% 42% at 88% 84%, rgba(122,96,62,0.65), transparent 70%), radial-gradient(50% 40% at 60% 52%, rgba(40,35,28,0.55), transparent 72%)' }} />
          </div>
          <div className="glass-strong" style={{ position: 'relative', zIndex: 1, color: '#F2EFE9', padding: '36px 32px 32px', borderRadius: 'var(--radius-lg)' }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Enquire</p>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, marginBottom: 6, letterSpacing: '-0.01em' }}>
              Vale and Mercer
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.55)', marginBottom: 24 }}>
              New Homes
            </div>

            <div style={{ marginBottom: 28, fontSize: 13 }}>
              <a href={`mailto:${AGENT_EMAIL}?subject=${subject}`} className="link-underline" style={{ color: '#F2EFE9', wordBreak: 'break-word' }}>
                {AGENT_EMAIL}
              </a>
            </div>

            <DevelopmentEnquiryActions name={name} price={price} />

            <div style={{ marginTop: 28, paddingTop: 22, borderTop: '0.5px solid rgba(242,239,233,0.14)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.5)' }}>
              {name}
            </div>
          </div>
        </div>
      </Reveal>
    </aside>
  )
}
