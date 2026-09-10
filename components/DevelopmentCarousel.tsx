'use client'
import { useCallback, useEffect, useState } from 'react'
import { Reveal } from '@/components/Reveal'
import DevelopmentLightbox from '@/components/DevelopmentLightbox'
import DevelopmentGalleryGrid from '@/components/DevelopmentGalleryGrid'

// Full-width carousel showing ONE image at a time, with prev/next arrows and a
// position counter (e.g. 7 / 24). Used for BOTH the closing photo gallery and
// the floor-plan gallery. Not a grid, not masonry, not a stacked scroll.
//
// Image sizing matches the /let hero exactly so nothing is ever cropped: a
// blurred object-fit:cover backfill fills the frame while the sharp foreground
// is object-fit:contain (maxWidth/maxHeight 100%, width/height auto), so the
// WHOLE image is always visible. Floor plans opt out of the blurred backfill and
// sit on a white frame instead. Clicking opens the shared DevelopmentLightbox
// (also contain), reusing it rather than building a new full-screen viewer.
export default function DevelopmentCarousel({
  images, name, eyebrow = 'Gallery', id, frameBackground = 'var(--surface-3)', blurredBackfill = true,
}: {
  images: string[]
  name: string
  eyebrow?: string
  id?: string
  frameBackground?: string
  blurredBackfill?: boolean
}) {
  const [idx, setIdx] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [grid, setGrid] = useState(false)
  const count = images.length
  const multi = count > 1

  const go = useCallback((i: number) => setIdx(((i % count) + count) % count), [count])
  const prev = useCallback(() => go(idx - 1), [go, idx])
  const next = useCallback(() => go(idx + 1), [go, idx])

  useEffect(() => {
    if (!multi) return
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null || grid) return
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [multi, prev, next, lightbox, grid])

  if (count === 0) return null

  return (
    <>
      <section id={id} style={{ background: 'var(--surface)', padding: 'clamp(48px, 7vw, 96px) 0 0' }}>
        <Reveal y={18} amount={0.15}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 var(--gutter)' }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 26 }}>{eyebrow}</p>
          </div>
        </Reveal>

        <div
          onClick={() => setLightbox(idx)}
          style={{ position: 'relative', width: '100%', height: 'clamp(420px, 66vh, 760px)', overflow: 'hidden', background: frameBackground, cursor: 'zoom-in' }}
        >
          {/* Blurred cover backfill — fills the frame with a soft glow of the
              photo so the contained foreground never sits on a flat band. */}
          {blurredBackfill && (
            <img src={images[idx]} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'blur(36px) brightness(0.82)', transform: 'scale(1.1)' }} />
          )}
          {/* Sharp foreground — the WHOLE image, uncropped (contain via auto w/h). */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: blurredBackfill ? 0 : 'clamp(12px, 2.5vw, 36px)' }}>
            <img key={images[idx]} src={images[idx]} alt={`${name}, image ${idx + 1} of ${count}`} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
          </div>

          {/* Warm the browser cache for the adjacent slides so prev/next feels
              instant. display:none <img> is still fetched by browsers. */}
          {multi && (
            <div aria-hidden style={{ display: 'none' }}>
              <img src={images[(idx + 1) % count]} alt="" />
              <img src={images[(idx - 1 + count) % count]} alt="" />
            </div>
          )}

          {/* Explicit fullscreen affordance — the whole frame is already
              click-to-open, but this makes the option discoverable. */}
          <ExpandButton onClick={e => { e.stopPropagation(); setLightbox(idx) }} />

          {multi && (
            <>
              <Arrow dir="prev" onClick={e => { e.stopPropagation(); prev() }} />
              <Arrow dir="next" onClick={e => { e.stopPropagation(); next() }} />
              {/* Bottom-right cluster: an explicit "View gallery" pill (opens
                  the thumbnail grid) sitting next to the position counter.
                  Distinct from the circular fullscreen icon top-right. */}
              <div
                onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', right: 'clamp(16px, 4vw, 40px)', bottom: 16, zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <ViewGalleryButton onClick={() => setGrid(true)} />
                <div
                  aria-live="polite"
                  style={{ fontSize: 11, letterSpacing: '0.14em', color: '#F2EFE9', background: 'rgba(40,35,28,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(242,239,233,0.16)' }}
                >
                  {idx + 1} / {count}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Thumbnail-grid overview — reachable only via the "View gallery" pill.
          Selecting a tile syncs the carousel to that image and opens the shared
          single-image lightbox at that position. */}
      {grid && (
        <DevelopmentGalleryGrid
          images={images}
          name={name}
          onClose={() => setGrid(false)}
          onSelect={i => { setIdx(i); setGrid(false); setLightbox(i) }}
        />
      )}

      {lightbox !== null && (
        <DevelopmentLightbox images={images} name={name} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}

function ViewGalleryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="View gallery"
      title="View gallery"
      className="btn-press"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer',
        fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#F2EFE9',
        background: 'rgba(40,35,28,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(242,239,233,0.16)',
        transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.85)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(40,35,28,0.55)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.16)' }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.4" />
        <rect x="14" y="3" width="7" height="7" rx="1.4" />
        <rect x="3" y="14" width="7" height="7" rx="1.4" />
        <rect x="14" y="14" width="7" height="7" rx="1.4" />
      </svg>
      View gallery
    </button>
  )
}

function ExpandButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="View fullscreen"
      title="View fullscreen"
      className="btn-press"
      style={{
        position: 'absolute', top: 'clamp(12px, 3vw, 24px)', right: 'clamp(16px, 4vw, 40px)', zIndex: 2,
        width: 44, height: 44, borderRadius: '50%', cursor: 'zoom-in',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#F2EFE9', background: 'rgba(40,35,28,0.5)', border: '1px solid rgba(242,239,233,0.2)',
        backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.85)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(40,35,28,0.5)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.2)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
      </svg>
    </button>
  )
}

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: (e: React.MouseEvent) => void }) {
  const isPrev = dir === 'prev'
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? 'Previous image' : 'Next image'}
      className="btn-press"
      style={{
        position: 'absolute', top: '50%', [isPrev ? 'left' : 'right']: 'clamp(16px, 4vw, 40px)', transform: 'translateY(-50%)', zIndex: 2,
        width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#F2EFE9', background: 'rgba(40,35,28,0.5)', border: '1px solid rgba(242,239,233,0.2)',
        backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        fontSize: 18, lineHeight: 1,
        transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.85)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(40,35,28,0.5)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.2)' }}
    >
      {isPrev ? '←' : '→'}
    </button>
  )
}
