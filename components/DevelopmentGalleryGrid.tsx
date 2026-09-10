'use client'
import { useEffect, useRef } from 'react'

// Thumbnail-grid overview of a development's gallery. Reachable ONLY via the
// carousel's explicit "View gallery" button — the default view stays the
// single-image carousel. Clicking a thumbnail hands its index back to the
// carousel, which opens the shared single-image lightbox at that position.
//
// Palette + easing are the existing brand tokens (ink #181511, cream #F2EFE9,
// gold #A0845C, var(--ease-apple) / var(--ease-out-soft)); nothing new.
export default function DevelopmentGalleryGrid({
  images, name, onSelect, onClose,
}: {
  images: string[]
  name: string
  onSelect: (index: number) => void
  onClose: () => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  // Lock the page behind the overlay and restore scroll on close (mirrors the
  // lightbox so the two overlays behave identically).
  useEffect(() => {
    const y = window.scrollY
    const { position, top, width } = document.body.style
    document.body.style.position = 'fixed'
    document.body.style.top = `-${y}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.position = position
      document.body.style.top = top
      document.body.style.width = width
      window.scrollTo(0, y)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => { rootRef.current?.focus() }, [])

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — all photos`}
      tabIndex={-1}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(24,21,17,0.96)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        overflowY: 'auto', outline: 'none',
      }}
    >
      {/* Sticky header: label + photo count + close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'sticky', top: 0, zIndex: 2,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: 'clamp(16px, 3vw, 28px) clamp(16px, 4vw, 40px)',
          background: 'linear-gradient(rgba(24,21,17,0.96), rgba(24,21,17,0))',
        }}
      >
        <div>
          <p className="eyebrow" style={{ color: '#A0845C', margin: 0 }}>Gallery</p>
          <p style={{ margin: '5px 0 0', color: 'rgba(242,239,233,0.6)', fontSize: 12, letterSpacing: '0.04em' }}>
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
        <IconButton label="Close gallery" onClick={onClose}><CloseIcon /></IconButton>
      </div>

      {/* Responsive thumbnail grid. Each tile opens the single-image lightbox
          at its index via onSelect. */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 1440, margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 40px) clamp(32px, 6vw, 72px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
          gap: 'clamp(8px, 1.4vw, 16px)',
        }}
      >
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            className="btn-press"
            style={{
              position: 'relative', display: 'block', padding: 0, border: 'none',
              cursor: 'zoom-in', aspectRatio: '4 / 3', overflow: 'hidden',
              borderRadius: 6, background: 'var(--surface-3)',
            }}
          >
            <img
              src={src}
              alt={`${name}, image ${i + 1}`}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s var(--ease-out-soft)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn-press"
      style={{
        flexShrink: 0, width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#F2EFE9', background: 'rgba(40,35,28,0.5)', border: '1px solid rgba(242,239,233,0.2)',
        backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.85)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(40,35,28,0.5)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.2)' }}
    >
      {children}
    </button>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
