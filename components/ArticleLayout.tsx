'use client'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'

type Section = { h: string; p: string }

type Props = {
  category: string
  title: string
  meta: string
  image: string
  imageAlt: string
  sections: Section[]
  signoff: string
}

export default function ArticleLayout({ category, title, meta, image, imageAlt, sections, signoff }: Props) {
  return (
    <main style={{ background: 'var(--surface)', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 var(--gutter)' }}>
        <Reveal y={20} amount={0.3}>
          <Link
            href="/blog"
            className="link-underline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C', marginBottom: 40 }}
          >
            <span aria-hidden style={{ fontSize: 14 }}>←</span> Back to Journal
          </Link>
        </Reveal>

        <Reveal y={24} amount={0.3}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>{category}</p>
        </Reveal>

        <Reveal y={28} delay={0.05} amount={0.3}>
          <h1 style={{ color: 'var(--text)', marginBottom: 18, lineHeight: 1.05, fontSize: 'clamp(38px, 6vw, 64px)' }}>{title}</h1>
        </Reveal>

        <Reveal y={20} delay={0.1} amount={0.3}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 48 }}>{meta}</p>
        </Reveal>

        <Reveal y={32} delay={0.15} amount={0.15}>
          <div className="img-zoom" style={{ height: 440, overflow: 'hidden', marginBottom: 56, borderRadius: 'var(--radius-lg)' }}>
            <img
              src={image}
              alt={imageAlt}
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Reveal>

        {sections.map((section, i) => (
          <Reveal key={section.h} y={28} delay={i === 0 ? 0 : 0} amount={0.25}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ color: 'var(--text)', marginBottom: 14, fontSize: 28, lineHeight: 1.2 }}>{section.h}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.95, color: 'var(--text)', opacity: 0.78 }}>{section.p}</p>
            </div>
          </Reveal>
        ))}

        <Reveal y={20} amount={0.3}>
          <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 32, marginTop: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>{signoff}</p>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
