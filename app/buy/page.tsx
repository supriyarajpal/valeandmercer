'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const properties = [
  { area: 'Canary Wharf, East London', type: 'To Let', desc: 'Lettings coming shortly. Register to hear first.' },
  { area: 'Notting Hill W11', type: 'To Let', desc: 'Lettings across Notting Hill and Kensington coming soon.' },
  { area: 'Chelsea SW3', type: 'To Let', desc: 'Premium lettings in Chelsea. Register your interest now.' },
]

export default function BuyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#F2EFE9', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <div style={{ marginBottom: 64, maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Properties</p>
              <h1 style={{ color: '#4A4036', marginBottom: 22 }}>
                Properties <span style={{ color: '#A0845C', fontStyle: 'italic' }}>coming soon</span>
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', maxWidth: 540, marginBottom: 36 }}>
                Good properties move quickly and often quietly. Tell us what you&rsquo;re looking for and we&rsquo;ll reach out before anything reaches the open market.<br />Straight communication. No pressure. Just the right home when it arrives.
              </p>
              <ArrowButton href="/register" label="Register Your Interest" variant="dark" />
            </div>
          </Reveal>

          <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
            {properties.map(item => (
              <StaggerItem key={item.area} as="div">
                <Link
                  href="/register"
                  className="card-lift"
                  style={{ textDecoration: 'none', display: 'block', position: 'relative', minHeight: 220 }}
                  onMouseEnter={e => {
                    const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                    if (arrow) arrow.style.transform = 'translateX(6px)'
                  }}
                  onMouseLeave={e => {
                    const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                    if (arrow) arrow.style.transform = 'translateX(0)'
                  }}
                >
                  <div aria-hidden style={{ position: 'absolute', inset: '-60px', background: 'radial-gradient(closest-side, rgba(160,132,92,0.9) 0%, rgba(122,96,62,0.6) 35%, rgba(74,55,32,0.25) 65%, rgba(52,48,43,0) 100%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(52,48,43,0.88)', boxShadow: '0 30px 80px -10px rgba(122,96,62,0.6), 0 0 0 1px rgba(160,132,92,0.2) inset', zIndex: 1, borderRadius: 4 }} />
                  <div style={{ position: 'relative', zIndex: 2, padding: '36px 30px', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 11px', marginBottom: 18 }}>{item.type}</span>
                      <h3 style={{ fontSize: 24, color: '#F2EFE9', marginBottom: 10 }}>{item.area}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(242,239,233,0.62)', lineHeight: 1.75 }}>{item.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
                      <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>Register Interest</span>
                      <span data-arrow aria-hidden style={{ color: '#A0845C', fontSize: 13, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </main>
      <Footer />
    </>
  )
}
