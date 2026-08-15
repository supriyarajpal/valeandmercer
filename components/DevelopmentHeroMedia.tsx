'use client'
import { useEffect, useRef } from 'react'

// Full-bleed hero for /buy detail pages. The video (autoplay, muted, loop,
// playsInline) fills the entire viewport; with no video, a full-bleed static
// image gets the exact same treatment. No overlay text, no controls, no header
// content — a clean cinematic first frame. The street-address title, description
// and key facts all live BELOW this, in the scrolling body.
export default function DevelopmentHeroMedia({ videoSrc, image, alt, title }: { videoSrc?: string | null; image?: string; alt: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true // ensure the DOM property is set (mobile autoplay requirement)
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [])

  const media: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#28231C' }}>
      {videoSrc ? (
        <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster={image} aria-label={alt} style={media}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : image ? (
        <img src={image} alt={alt} style={media} />
      ) : null}

      {/* Small street-address title, bottom-left, on every property WITH a video.
          A subtle scrim confined to just this corner (radial, fading out well
          before mid-frame) lends contrast without dimming the video itself. The
          body <h1> remains the semantic title; this is a visual label. */}
      {videoSrc && title && (
        <>
          <div aria-hidden style={{ position: 'absolute', left: 0, bottom: 0, width: 'min(64%, 660px)', height: 'min(46%, 380px)', zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(115% 115% at 0% 100%, rgba(20,17,14,0.55) 0%, rgba(20,17,14,0.22) 34%, rgba(20,17,14,0) 68%)' }} />
          <div style={{ position: 'absolute', left: 'clamp(20px, 4vw, 48px)', bottom: 'clamp(20px, 4vh, 44px)', zIndex: 2, maxWidth: 'min(80%, 620px)' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#F2EFE9', fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.22, letterSpacing: '0.01em', textShadow: '0 1px 14px rgba(20,17,14,0.72), 0 1px 3px rgba(20,17,14,0.6)' }}>
              {title}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
