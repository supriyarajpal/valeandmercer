'use client'
import { useEffect, useRef, useState } from 'react'

// Full-bleed autoplay video hero for /buy detail pages whose property has a
// video (public/videos/<slug>.mp4). Rendered INSTEAD of the static image hero
// (DevelopmentHero) as the first thing on the page; the rest of the page — incl.
// the scroll gallery — follows unchanged. Muted + playsInline so mobile browsers
// permit autoplay. Palette/easing use existing tokens only.

const HERO_TEXT_SHADOW = '0 2px 18px rgba(20,17,14,0.75), 0 1px 3px rgba(20,17,14,0.55)'

export default function DevelopmentVideoHero({ src, title, poster }: { src: string; title: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  // Force the muted DOM property (React can miss the attribute) and kick off
  // playback; a rejected autoplay promise is harmless.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [])

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted) v.play().catch(() => {})
    setMuted(v.muted)
  }

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '72vh', overflow: 'hidden', background: '#28231C' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-label={`${title} — video tour`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Bottom scrim so the title reads over any footage (same darkened base as
          the /let hero). */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(20,17,14,0.80) 0%, rgba(20,17,14,0.34) 26%, rgba(20,17,14,0) 55%)' }} />

      {/* Bottom-left: street-address title (visual; the body <h1> carries the
          semantic heading) + a mute/unmute control near the same corner. */}
      <div style={{ position: 'absolute', left: 'var(--gutter)', right: 'var(--gutter)', bottom: 'clamp(28px, 5vw, 56px)', zIndex: 2 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: '#A0845C' }} />
            <span className="eyebrow" style={{ color: '#A0845C', textShadow: HERO_TEXT_SHADOW }}>New Homes</span>
          </div>
          {/* This is the page's semantic <h1> for video properties (the body
              header drops its duplicate title in that case). */}
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#F2EFE9', fontSize: 'clamp(32px, 5.2vw, 62px)', lineHeight: 1.05, letterSpacing: '-0.01em', maxWidth: 900, textShadow: HERO_TEXT_SHADOW }}>
            {title}
          </h1>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="btn-press"
            style={{
              marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer',
              color: '#F2EFE9', background: 'rgba(40,35,28,0.5)', border: '1px solid rgba(242,239,233,0.2)',
              backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)',
              padding: '9px 16px 9px 13px', borderRadius: 'var(--radius-pill)',
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,132,92,0.85)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(40,35,28,0.5)'; e.currentTarget.style.borderColor = 'rgba(242,239,233,0.2)' }}
          >
            {muted ? <MutedIcon /> : <SoundIcon />}
            {muted ? 'Sound off' : 'Sound on'}
          </button>
        </div>
      </div>
    </section>
  )
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 8.5a4 4 0 0 1 0 7M18.7 6a7 7 0 0 1 0 12" />
    </svg>
  )
}
function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M22 9l-6 6M16 9l6 6" />
    </svg>
  )
}
