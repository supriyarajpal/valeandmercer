'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DevelopmentAssets } from '@/lib/developmentAssets'
import type { NearestStation } from '@/lib/developments'

// Development hero: a media panel with Gallery / Floorplan / Location / Brochure
// tabs. Every surface reads from the theme tokens (var(--surface*), var(--text*),
// var(--border)) so it renders LIGHT in light mode and dark in dark mode — the
// previous version hardcoded a full-bleed #28231C section that made the whole
// page read dark in light mode. Overlays here (arrows, counter) are absolutely
// positioned INSIDE the image frame (position:relative + overflow:hidden), so
// they can never escape onto the page.

type HeroTab = 'gallery' | 'floorplan' | 'location' | 'brochure'

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
    if (assets.floorplan) t.push('floorplan')
    if (locationNotes || hasStation) t.push('location')
    if (assets.brochure) t.push('brochure')
    return t
  }, [assets.images.length, assets.floorplan, assets.brochure, locationNotes, hasStation])

  const [tab, setTab] = useState<HeroTab>(tabs[0] ?? 'brochure')
  const [idx, setIdx] = useState(0)
  const images = assets.images
  const multi = images.length > 1

  const go = useCallback((i: number) => setIdx(((i % images.length) + images.length) % images.length), [images.length])
  const prev = useCallback(() => go(idx - 1), [go, idx])
  const next = useCallback(() => go(idx + 1), [go, idx])

  // Left/right arrow keys advance the gallery while that tab is active.
  useEffect(() => {
    if (tab !== 'gallery' || !multi) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tab, multi, prev, next])

  if (tabs.length === 0) return null
  const label: Record<HeroTab, string> = { gallery: 'Gallery', floorplan: 'Floorplan', location: 'Location', brochure: 'Brochure' }

  return (
    <section style={{ background: 'var(--surface)', padding: '140px var(--gutter) 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Tab bar — themed chips */}
        <div role="tablist" aria-label="Development media" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
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

        {tab === 'gallery' && images.length > 0 && (
          <>
            {/* Image frame — overlays live INSIDE this position:relative box. */}
            <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface-3)' }}>
              <img key={images[idx]} src={images[idx]} alt={`${name}, image ${idx + 1} of ${images.length}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {multi && (
                <>
                  <HeroArrow dir="prev" onClick={prev} />
                  <HeroArrow dir="next" onClick={next} />
                  {/* Position counter, e.g. 3 / 14 */}
                  <div aria-live="polite" style={{ position: 'absolute', right: 14, bottom: 14, zIndex: 2, fontSize: 11, letterSpacing: '0.14em', color: '#F2EFE9', background: 'rgba(40,35,28,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(242,239,233,0.16)' }}>
                    {idx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            {multi && (
              <div style={{ display: 'flex', gap: 8, padding: '12px 0 0', overflowX: 'auto' }}>
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
            )}
          </>
        )}

        {tab === 'floorplan' && assets.floorplan && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'clamp(16px, 3vw, 40px)', display: 'flex', justifyContent: 'center' }}>
            <img src={assets.floorplan} alt={`${name} floor plan`} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        {tab === 'location' && (locationNotes || hasStation) && (
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 56px)' }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Location</p>
            {locationNotes && <p style={{ fontSize: 15.5, lineHeight: 1.9, color: 'var(--text)', opacity: 0.85, maxWidth: 780 }}>{locationNotes}</p>}
            {hasStation && (
              <div style={{ marginTop: 20, fontSize: 13, letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Nearest station — <span style={{ color: 'var(--text)' }}>{nearestStation!.name}</span>
                {(nearestStation!.time || nearestStation!.distance) && <span style={{ color: '#A0845C' }}> · {nearestStation!.time || nearestStation!.distance}</span>}
              </div>
            )}
          </div>
        )}

        {tab === 'brochure' && assets.brochure && (
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'clamp(40px, 7vw, 88px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 'clamp(300px, 40vh, 440px)' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3.4vw, 34px)', fontWeight: 300, color: 'var(--text)', marginBottom: 20 }}>The full brochure</div>
            <a href={assets.brochure} target="_blank" rel="noopener noreferrer" className="btn-press" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2EFE9', background: '#A0845C', padding: '15px 28px', borderRadius: 'var(--radius-pill)', border: '1px solid #A0845C' }}>
              <DownloadIcon /> Download brochure (PDF)
            </a>
          </div>
        )}
      </div>
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
        position: 'absolute', top: '50%', [isPrev ? 'left' : 'right']: 14, transform: 'translateY(-50%)', zIndex: 2,
        width: 46, height: 46, borderRadius: '50%', cursor: 'pointer',
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

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
    </svg>
  )
}
