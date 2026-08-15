'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// Full-screen gallery lightbox for the /buy development pages. Opened from the
// interleaved gallery's "View all" control (or by clicking a tile). Provides
// prev/next arrows, keyboard arrow navigation, a fullscreen toggle, a position
// counter matching the hero gallery's counter style, and Escape/✕ close that
// restores the exact scroll position the user opened it from.
//
// Palette + easing are the existing brand tokens (ink #28231C, cream #F2EFE9,
// gold #A0845C, var(--ease-apple)); nothing new is introduced.

export default function DevelopmentLightbox({
  images, name, startIndex, onClose,
}: {
  images: string[]
  name: string
  startIndex: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const [isFs, setIsFs] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const count = images.length
  const go = useCallback((i: number) => setIdx(((i % count) + count) % count), [count])
  const prev = useCallback(() => go(idx - 1), [go, idx])
  const next = useCallback(() => go(idx + 1), [go, idx])

  // Lock the page behind the overlay and restore the scroll position on close.
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

  // Keyboard: ← / → navigate; Esc exits fullscreen first, otherwise closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      else if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  // Track fullscreen state so the toggle icon/label stays in sync (incl. when
  // the user exits fullscreen with the browser's own Escape).
  useEffect(() => {
    const onFsChange = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  // Move focus into the dialog so the arrow/Escape keys work immediately.
  useEffect(() => { rootRef.current?.focus() }, [])

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.()
    else document.exitFullscreen?.()
  }, [])

  const multi = count > 1

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} gallery`}
      tabIndex={-1}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(24,21,17,0.94)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        outline: 'none',
      }}
    >
      {/* Top bar: fullscreen toggle + close (stopPropagation so they don't close via the backdrop) */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: 'absolute', top: 'clamp(12px, 3vw, 28px)', right: 'clamp(12px, 4vw, 40px)', zIndex: 2, display: 'flex', gap: 10 }}
      >
        <IconButton label={isFs ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullscreen}>
          {isFs ? <CompressIcon /> : <ExpandIcon />}
        </IconButton>
        <IconButton label="Close gallery" onClick={onClose}><CloseIcon /></IconButton>
      </div>

      {/* Image stage */}
      <figure
        onClick={e => e.stopPropagation()}
        style={{ margin: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px, 8vh, 96px) clamp(56px, 10vw, 120px)' }}
      >
        <img
          key={images[idx]}
          src={images[idx]}
          alt={`${name}, image ${idx + 1} of ${count}`}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', borderRadius: 4 }}
        />
      </figure>

      {multi && (
        <>
          <Arrow dir="prev" onClick={e => { e.stopPropagation(); prev() }} />
          <Arrow dir="next" onClick={e => { e.stopPropagation(); next() }} />
          {/* Position counter — matches the hero gallery counter style */}
          <div
            aria-live="polite"
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: 'clamp(16px, 4vh, 32px)', left: '50%', transform: 'translateX(-50%)', zIndex: 2,
              fontSize: 11, letterSpacing: '0.14em', color: '#F2EFE9',
              background: 'rgba(40,35,28,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(242,239,233,0.16)',
            }}
          >
            {idx + 1} / {count}
          </div>
        </>
      )}
    </div>
  )
}

/* ---- pieces ---- */

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn-press"
      style={{
        width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
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

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: (e: React.MouseEvent) => void }) {
  const isPrev = dir === 'prev'
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? 'Previous image' : 'Next image'}
      className="btn-press"
      style={{
        position: 'absolute', top: '50%', [isPrev ? 'left' : 'right']: 'clamp(12px, 3vw, 32px)', transform: 'translateY(-50%)', zIndex: 2,
        width: 52, height: 52, borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#F2EFE9', background: 'rgba(40,35,28,0.5)', border: '1px solid rgba(242,239,233,0.2)',
        backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        fontSize: 20, lineHeight: 1,
        transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.85)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(40,35,28,0.5)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.2)' }}
    >
      {isPrev ? '←' : '→'}
    </button>
  )
}

const ICON = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
function CloseIcon() { return <svg {...ICON} aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg> }
function ExpandIcon() { return <svg {...ICON} aria-hidden><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" /></svg> }
function CompressIcon() { return <svg {...ICON} aria-hidden><path d="M8 3v5H3M21 8h-5V3M16 21v-5h5M3 16h5v5" /></svg> }
