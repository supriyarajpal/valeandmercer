'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { BLOG_POSTS } from '@/lib/blogPosts'

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--surface)', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <div style={{ marginBottom: 72, maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Journal</p>
              <h1 style={{ color: 'var(--text)' }}>
                Insight and <span style={{ color: '#A0845C', fontStyle: 'italic' }}>advice</span>
              </h1>
            </div>
          </Reveal>

          <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {BLOG_POSTS.map(post => (
              <StaggerItem key={post.slug} as="article">
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-lift"
                  style={{
                    display: 'block',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 1px 0 rgba(52,48,43,0.04), 0 16px 32px -22px rgba(52,48,43,0.2)',
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
                    <h2 style={{ fontSize: 26, color: 'var(--text)', lineHeight: 1.2, marginBottom: 14 }}>{post.title}</h2>
                    <p style={{ fontSize: 13.5, lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: 22 }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
                      <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{post.date}</span>
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
