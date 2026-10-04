'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, useInViewSafe } from '@/components/Reveal'
import { BLOG_POSTS, type BlogPost } from '@/lib/blogPosts'

const EASE = [0.22, 1, 0.36, 1] as const

// Pull straight from the shared blog source (same data the /blog index reads),
// newest first, so a new post never needs a homepage edit. Shows the three most
// recent posts, matching the count this section has always displayed.
const HOMEPAGE_POST_COUNT = 3
const posts = BLOG_POSTS.slice(0, HOMEPAGE_POST_COUNT)

export default function BlogSection() {
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Journal</p>
              <h2 style={{ color: 'var(--text)' }}>Insight and <span style={{ color: '#A0845C', fontStyle: 'italic' }}>advice</span></h2>
            </div>
            <Link href="/blog" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C', whiteSpace: 'nowrap' }}>
              All articles <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
          {posts.map((post, i) => <BlogCard key={post.slug} post={post} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const reduce = useReducedMotion()
  const direction = index % 2 === 0 ? -1 : 1
  const { ref, inView } = useInViewSafe<HTMLElement>(0.2)

  return (
    <motion.article
      ref={ref as never}
      initial={reduce ? false : { opacity: 0, y: 60, rotate: direction * 1.4 }}
      animate={reduce ? undefined : inView ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 60, rotate: direction * 1.4 }}
      transition={{ duration: 0.95, delay: 0.1 + index * 0.13, ease: EASE }}
      style={{ willChange: 'transform, opacity' }}
    >
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
        <div style={{ height: 240, overflow: 'hidden' }}>
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
          />
        </div>
        <div style={{ padding: '24px 26px 28px' }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A0845C' }}>{post.category}</span>
          </div>
          <h3 style={{ color: 'var(--text)', marginBottom: 12, fontSize: 'clamp(18px, 4vw, 22px)', lineHeight: 1.25 }}>{post.title}</h3>
          <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: 18 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '0.5px solid var(--border)' }}>
            <span style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{post.date}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>
              Read more
              <span data-arrow aria-hidden style={{ fontSize: 13, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

