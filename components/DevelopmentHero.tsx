'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DevelopmentAssets } from '@/lib/developmentAssets'
import type { NearestStation } from '@/lib/developments'

// Full-bleed development hero: the gallery image spans edge-to-edge for impact,
// with the Gallery / Floorplan / Location tab strip and the thumbnail row aligned
// to the content width above/below it. Every surface reads from the theme tokens
// (light in light mode, dark in dark mode). Overlays (arrows, counter) are
// absolutely positioned INSIDE the media frame (position:relative +
// overflow:hidden) so they can never escape onto the page. (The brochure download
// was removed site-wide.)

type HeroTab = 'gallery' | 'floorplan' | 'location'

const CONTAINER: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 var(--gutter)' }

export default function DevelopmentHero({
  name, assets, locationNotes, nearestStation,
}: {
  name: string
  assets: DevelopmentAssets
  locationNotes?: string
  nearestStation?: NearestStation
}) {
  const hasStation = !!(nearestStation && nearestStation.name)
  const tabs = useMemo(() => {
    const t: HeroTab[] = []
    if (assets.images.length > 0) t.push('gallery')
    if (assets.floorplans.length > 0) t.push('floorplan')
    if (locationNotes || hasStation) t.push('location')
    return t
  }, [assets.images.length, assets.floorplans.length, locationNotes, hasStation])

  const [tab, setTab] = useState<HeroTab>(tabs[0] ?? 'gallery')
  const [idx, setIdx] = useState(0)
  const images = assets.images
  const multi = images.length > 1

  const go = useCallback((i: number) => setIdx(((i % images.length) + images.length) % images.length), [images.length])
  const prev = useCallback(() => go(idx - 1), [go, idx])
  const next = useCallback(() => go(idx + 1), [go, idx])

  // Floorplan tab has its own sequential gallery (same next/prev pattern).
  const floorplans = assets.floorplans
  const [fpIdx, setFpIdx] = useState(0)
  const fpMulti = floorplans.length > 1
  const goFp = useCallback((i: number) => setFpIdx(((i % floorplans.length) + floorplans.length) % floorplans.length), [floorplans.length])
  const prevFp = useCallback(() => goFp(fpIdx - 1), [goFp, fpIdx])
  const nextFp = useCallback(() => goFp(fpIdx + 1), [goFp, fpIdx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (tab === 'gallery' && multi) {
        if (e.key === 'ArrowLeft') prev()
        else if (e.key === 'ArrowRight') next()
      } else if (tab === 'floorplan' && fpMulti) {
        if (e.key === 'ArrowLeft') prevFp()
        else if (e.key === 'ArrowRight') nextFp()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tab, multi, fpMulti, prev, next, prevFp, nextFp])

  if (tabs.length === 0) return null
  const label: Record<HeroTab, string> = { gallery: 'Gallery', floorplan: 'Floorplan', location: 'Location' }

  // Full-bleed media band. Matches the /let hero exactly: a min-height: 72vh
  // container (was a fixed clamp(420px,66vh,760px) height) so the sharp,
  // object-fit:contain photo shows at its TRUE aspect ratio with no crop.
  const bandStyle: React.CSSProperties = { position: 'relative', width: '100%', minHeight: '72vh', overflow: 'hidden', background: 'var(--surface-3)' }

  return (
    <section style={{ background: 'var(--surface)', padding: '140px 0 0' }}>
      {/* Tab strip — aligned to content width, themed chips */}
      <div style={{ ...CONTAINER, marginBottom: 18 }}>
        <div role="tablist" aria-label="Development media" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tabs.map(t => {
            const active = t === tab
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t)}
                className="btn-press"
                style={{
                  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  padding: '10px 18px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                  color: active ? '#F2EFE9' : 'var(--text-muted)',
                  background: active ? '#A0845C' : 'var(--surface-2)',
                  border: active ? '1px solid #A0845C' : '1px solid var(--border)',
                  transition: 'background var(--dur) var(--ease-apple), color var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
                }}
              >
                {label[t]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Full-bleed media band */}
      {tab === 'gallery' && images.length > 0 && (
        <>
          <div style={bandStyle}>
            {/* Blurred object-fit:cover backfill so any gap around the photo is a
                soft glow of the image itself (not a flat band) — identical to the
                /let hero. */}
            <img src={images[idx]} alt="" aria-hidden loading="eager" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'blur(36px) brightness(0.82)', transform: 'scale(1.1)' }} />
            {/* Sharp, object-fit:contain foreground — the whole photo, uncropped. */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img key={images[idx]} src={images[idx]} alt={`${name}, image ${idx + 1} of ${images.length}`} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
            </div>
            {multi && (
              <>
                <HeroArrow dir="prev" onClick={prev} />
                <HeroArrow dir="next" onClick={next} />
                <div aria-live="polite" style={{ position: 'absolute', right: 'clamp(16px, 4vw, 40px)', bottom: 16, zIndex: 2, fontSize: 11, letterSpacing: '0.14em', color: '#F2EFE9', background: 'rgba(40,35,28,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(242,239,233,0.16)' }}>
                  {idx + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          {multi && (
            <div style={{ ...CONTAINER, marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === idx}
                    style={{ flexShrink: 0, width: 84, height: 58, padding: 0, cursor: 'pointer', borderRadius: 6, overflow: 'hidden', background: 'var(--surface-3)', border: i === idx ? '2px solid #A0845C' : '1px solid var(--border)' }}
                  >
                    <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: i === idx ? 1 : 0.7 }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'floorplan' && floorplans.length > 0 && (
        <div style={{ ...bandStyle, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 3vw, 40px)' }}>
          <img key={floorplans[fpIdx]} src={floorplans[fpIdx]} alt={`${name} floor plan ${fpIdx + 1} of ${floorplans.length}`} style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', display: 'block' }} />
          {fpMulti && (
            <>
              <HeroArrow dir="prev" onClick={prevFp} />
              <HeroArrow dir="next" onClick={nextFp} />
              <div aria-live="polite" style={{ position: 'absolute', right: 'clamp(16px, 4vw, 40px)', bottom: 16, zIndex: 2, fontSize: 11, letterSpacing: '0.14em', color: '#F2EFE9', background: 'rgba(40,35,28,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(242,239,233,0.16)' }}>
                {fpIdx + 1} / {floorplans.length}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'location' && (locationNotes || hasStation) && (
        <div style={{ ...bandStyle, background: 'var(--surface-2)', display: 'flex', alignItems: 'center' }}>
          <div style={{ ...CONTAINER, width: '100%' }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Location</p>
            {locationNotes && <p style={{ fontSize: 'clamp(15px, 1.7vw, 18px)', lineHeight: 1.9, color: 'var(--text)', opacity: 0.85, maxWidth: 820 }}>{locationNotes}</p>}
            {hasStation && (
              <div style={{ marginTop: 20, fontSize: 13, letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Nearest station — <span style={{ color: 'var(--text)' }}>{nearestStation!.name}</span>
                {(nearestStation!.time || nearestStation!.distance) && <span style={{ color: '#A0845C' }}> · {nearestStation!.time || nearestStation!.distance}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function HeroArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
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
