'use client'
import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import DevelopmentLightbox from '@/components/DevelopmentLightbox'

// Gallery entry point for /buy detail pages. Replaces the old inline
// single-image carousel: no preview image in the page flow — just a labelled
// button at the same position that opens the shared full-screen lightbox with
// every image (starting at the first). Palette + easing are existing tokens;
// the button mirrors the ArrowButton "dark" treatment (ink #34302B fill sliding
// to gold #A0845C on hover, var(--ease-apple)).
export default function DevelopmentGalleryButton({
  images, name, eyebrow = 'Gallery', id,
}: {
  images: string[]
  name: string
  eyebrow?: string
  id?: string
}) {
  const [open, setOpen] = useState(false)
  const count = images.length
  if (count === 0) return null

  return (
    <>
      <section id={id} style={{ background: 'var(--surface)', padding: 'clamp(48px, 7vw, 96px) 0 0' }}>
        <Reveal y={18} amount={0.15}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 var(--gutter)' }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 26 }}>{eyebrow}</p>
            <GalleryButton count={count} onClick={() => setOpen(true)} />
          </div>
        </Reveal>
      </section>

      {open && (
        <DevelopmentLightbox images={images} name={name} startIndex={0} onClose={() => setOpen(false)} />
      )}
    </>
  )
}

function GalleryButton({ count, onClick }: { count: number; onClick: () => void }) {
  const v = { bg: '#34302B', color: '#F2EFE9', border: '1px solid #34302B', fill: '#A0845C', hoverColor: '#F2EFE9', hoverBorder: '1px solid #A0845C' }
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-press"
      aria-label={`View gallery — ${count} ${count === 1 ? 'photo' : 'photos'}`}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12,
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'zoom-in',
        color: v.color, background: v.bg, border: v.border, padding: '15px 28px',
        borderRadius: 'var(--radius-pill)', overflow: 'hidden',
        transition: 'color var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple), box-shadow var(--dur) var(--ease-apple), transform var(--dur) var(--ease-apple)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
        e.currentTarget.style.color = v.hoverColor
        e.currentTarget.style.border = v.hoverBorder
        e.currentTarget.style.boxShadow = '0 12px 30px -10px rgba(40,35,28,0.4)'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        e.currentTarget.style.color = v.color
        e.currentTarget.style.border = v.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: v.fill, transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-apple)', zIndex: 0 }} />
      <span aria-hidden style={{ position: 'relative', zIndex: 1, display: 'inline-flex' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.4" />
          <rect x="14" y="3" width="7" height="7" rx="1.4" />
          <rect x="3" y="14" width="7" height="7" rx="1.4" />
          <rect x="14" y="14" width="7" height="7" rx="1.4" />
        </svg>
      </span>
      <span style={{ position: 'relative', zIndex: 1 }}>View gallery</span>
      <span style={{ position: 'relative', zIndex: 1, opacity: 0.6 }}>· {count}</span>
    </button>
  )
}
