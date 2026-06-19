'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const properties = [
  { area: 'Canary Wharf, East London', desc: 'Lettings coming shortly. Register to hear first.' },
  { area: 'Notting Hill W11', desc: 'Lettings across Notting Hill and Kensington coming soon.' },
  { area: 'Kensington W8', desc: 'Premium lettings in Kensington. Register now.' },
]

export default function RentPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#EFECE6', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <div style={{ marginBottom: 64, maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Rentals</p>
              <h1 style={{ color: '#4A4036', marginBottom: 22 }}>
                Rental properties <span style={{ color: '#A0845C', fontStyle: 'italic' }}>coming soon</span>
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', maxWidth: 540, marginBottom: 36 }}>
                We are building our lettings portfolio across prime London. Register your interest and we will be in touch as soon as something available matches what you need.
              </p>
              <ArrowButton href="/register" label="Register Your Interest" variant="dark" />
            </div>
          </Reveal>

          <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: '#C8C0B4' }}>
            {properties.map(item => (
              <StaggerItem key={item.area} as="div">
                <Link
                  href="/register"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#28231C',
                    padding: '40px 32px',
                    minHeight: 200,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.5s var(--ease-out-soft)',
                  }}
                  onMouseEnter={e => {
                    const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                    if (arrow) arrow.style.transform = 'translateX(6px)'
                    e.currentTarget.style.background = '#332D24'
                  }}
                  onMouseLeave={e => {
                    const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                    if (arrow) arrow.style.transform = 'translateX(0)'
                    e.currentTarget.style.background = '#28231C'
                  }}
                >
                  <div>
                    <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#A0845C', color: '#EFECE6', padding: '5px 11px', marginBottom: 18 }}>To Let</span>
                    <h3 style={{ fontSize: 24, color: '#EFECE6', marginBottom: 10 }}>{item.area}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(239,236,230,0.6)', lineHeight: 1.75 }}>{item.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
                    <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>Register Interest</span>
                    <span data-arrow aria-hidden style={{ color: '#A0845C', fontSize: 13, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
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
