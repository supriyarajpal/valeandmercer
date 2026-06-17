'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

const posts = [
  {
    slug: 'london-property-market-2025',
    category: 'Market Insight',
    title: 'The London property market in 2025',
    excerpt: 'Supply is up, rates have settled a little, and buyers are moving again. Here is what we are seeing.',
    date: 'May 2025',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1400&q=85',
  },
  {
    slug: 'guide-to-buying-in-chelsea',
    category: 'Buying Guide',
    title: 'Your complete guide to buying in Chelsea SW3',
    excerpt: 'What to expect, where to look, and what the streets actually feel like. A practical guide to buying in SW3.',
    date: 'April 2025',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85',
  },
  {
    slug: 'student-lettings-london-guide',
    category: 'Student Living',
    title: 'Renting in London as a student',
    excerpt: 'What nobody tells you before you start. A straight guide to renting in London as a student.',
    date: 'March 2025',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=85',
  },
]

export default function BlogSection() {
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Journal</p>
              <h2 style={{ color: '#28231C' }}>Insight and <span style={{ color: '#A0845C', fontStyle: 'italic' }}>advice</span></h2>
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

function BlogCard({ post, index }: { post: typeof posts[number]; index: number }) {
  const reduce = useReducedMotion()
  const direction = index % 2 === 0 ? -1 : 1

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 60, rotate: direction * 1.4 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.95, delay: 0.1 + index * 0.13, ease: EASE }}
      style={{ willChange: 'transform, opacity' }}
    >
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A0845C' }}>{post.category}</span>
            <span style={{ fontSize: 10, color: '#9A9188' }}>{post.readTime}</span>
          </div>
          <h3 style={{ color: '#28231C', marginBottom: 12, fontSize: 22, lineHeight: 1.2 }}>{post.title}</h3>
          <p style={{ fontSize: 13, lineHeight: 1.85, color: '#6B6258', marginBottom: 18 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '0.5px solid #DDD7CC' }}>
            <span style={{ fontSize: 10, color: '#9A9188', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{post.date}</span>
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

