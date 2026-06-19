'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const posts = [
  { slug: 'london-property-market-2025', category: 'Market Insight', title: 'The London property market in 2025', excerpt: 'Supply is up, rates have settled a little, and buyers are moving again. Here is what we are seeing.', date: 'May 2025', image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1400&q=85' },
  { slug: 'guide-to-buying-in-chelsea', category: 'Buying Guide', title: 'Your complete guide to buying in Chelsea SW3', excerpt: 'What to expect, where to look, and what the streets actually feel like. A practical guide to buying in SW3.', date: 'April 2025', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1000&q=85' },
  { slug: 'student-lettings-london-guide', category: 'Student Living', title: 'Renting in London as a student', excerpt: 'No jargon, no hidden fees. Everything you need to find a good home near your university and avoid the common pitfalls.', date: 'March 2025', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=85' },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#EFECE6', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <div style={{ marginBottom: 72, maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Journal</p>
              <h1 style={{ color: '#4A4036' }}>
                Insight and <span style={{ color: '#A0845C', fontStyle: 'italic' }}>advice</span>
              </h1>
            </div>
          </Reveal>

          <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {posts.map(post => (
              <StaggerItem key={post.slug} as="article">
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-lift"
                  style={{
                    display: 'block',
                    background: '#FFFFFF',
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 1px 0 rgba(40,35,28,0.04), 0 16px 32px -22px rgba(40,35,28,0.2)',
                    height: '100%',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    const img = e.currentTarget.querySelector<HTMLImageElement>('img')
                    const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                    if (img) img.style.transform = 'scale(1.06)'
                    if (arrow) arrow.style.transform = 'translateX(6px)'
                  }}
                  onMouseLeave={e => {
                    const img = e.currentTarget.querySelector<HTMLImageElement>('img')
                    const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                    if (img) img.style.transform = 'scale(1)'
                    if (arrow) arrow.style.transform = 'translateX(0)'
                  }}
                >
                  <div style={{ height: 260, overflow: 'hidden' }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
                    />
                  </div>
                  <div style={{ padding: '28px 32px 32px' }}>
                    <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A0845C', marginBottom: 14 }}>{post.category}</span>
                    <h2 style={{ fontSize: 26, color: '#4A4036', lineHeight: 1.2, marginBottom: 14 }}>{post.title}</h2>
                    <p style={{ fontSize: 13.5, lineHeight: 1.85, color: '#6B6258', marginBottom: 22 }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '0.5px solid #DDD7CC' }}>
                      <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9188' }}>{post.date}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>
                        Read more
                        <span data-arrow aria-hidden style={{ fontSize: 13, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
                      </span>
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
