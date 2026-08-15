'use client'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/Reveal'
import DevelopmentLightbox from '@/components/DevelopmentLightbox'
import DIMS from '@/lib/galleryImageDims.generated.json'

// Baked aspect ratios (width/height) per public image path — see
// scripts/measure-gallery.js. Deterministic + correct on first paint, so tile
// sizing never depends on (unreliable) in-browser image load timing.
const AR_MAP = DIMS as Record<string, number>

// Pinterest-style masonry gallery for the /buy detail pages.
//
// Real irregularity (not a row-height grid): tiles vary in WIDTH — a wide/
// landscape photo spans 2 columns, everything else spans 1 — AND in HEIGHT, each
// tile sized to its source image's true aspect ratio (no cropping of the
// subject). Placement uses CSS grid with a fine row unit + `grid-auto-flow:
// dense`, so tiles pack into gaps and rows never line up across columns. Gutters
// are a single constant everywhere.
//
// Behaviour carried over from the previous fix: click any tile to open the
// shared DevelopmentLightbox at that image's index; "View all" opens it at 1;
// hover = slight scale + brightness lift on the site's slow soft easing.

const GUTTER = 16   // px — the one gutter, used horizontally AND vertically
const ROW = 8       // px — grid-auto-rows unit; tile heights quantise to this
const DEFAULT_AR = 1.4

export default function DevelopmentGallery({ images, name, pullQuote }: { images: string[]; name: string; pullQuote: string | null }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)
  const [ars, setArs] = useState<Record<number, number>>({}) // imgIndex → width/height

  // Track the grid's width so column count + tile heights stay responsive.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const measure = () => setContainerW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cols = containerW >= 1000 ? 4 : containerW >= 680 ? 3 : containerW > 0 ? 2 : 3
  const colW = containerW > 0 ? (containerW - (cols - 1) * GUTTER) / cols : 300

  // A tile's column + row span. WIDTH variety: very wide panoramas, plus a
  // distributed ~1-in-3 of the landscape-ish images, become 2-column "feature"
  // tiles — never a tall portrait (which would balloon). This guarantees a
  // mix of 1- and 2-col tiles on every gallery, whatever its aspect mix. HEIGHT
  // always tracks the image's real aspect ratio, so nothing is cropped.
  function spanFor(ar: number, imgIndex: number) {
    const feature = ar >= 2 || (ar >= 1.2 && imgIndex % 3 === 0)
    const colSpan = cols >= 3 && feature ? 2 : 1
    const w = colSpan * colW + (colSpan - 1) * GUTTER
    const h = w / ar
    const rowSpan = Math.max(1, Math.round((h + GUTTER) / (ROW + GUTTER)))
    return { colSpan, rowSpan }
  }

  type Tile = { kind: 'img'; src: string; imgIndex: number } | { kind: 'quote'; text: string }
  const tiles: Tile[] = images.map((src, i) => ({ kind: 'img', src, imgIndex: i }))
  if (pullQuote && images.length >= 3) tiles.splice(Math.min(2, tiles.length), 0, { kind: 'quote', text: pullQuote })

  const quoteRowSpan = Math.max(1, Math.round((colW * 0.82 + GUTTER) / (ROW + GUTTER)))

  return (
    <>
      <section style={{ background: 'var(--surface)', padding: 'clamp(48px, 7vw, 96px) var(--gutter)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <Reveal y={18} amount={0.15}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 26 }}>
              <p className="eyebrow" style={{ color: '#A0845C' }}>Gallery</p>
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="link-underline"
                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: '#A0845C', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                View all ({images.length})
              </button>
            </div>
          </Reveal>

          <div
            ref={gridRef}
            style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: `${ROW}px`, gridAutoFlow: 'dense', gap: `${GUTTER}px` }}
          >
            {tiles.map((tile, i) => {
              if (tile.kind === 'quote') {
                return (
                  <blockquote key={i} className="vm-mquote" style={{ gridColumn: 'span 1', gridRow: `span ${quoteRowSpan}` }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(14px, 1.4vw, 18px)', lineHeight: 1.5 }}>
                      <span style={{ color: '#A0845C' }}>“</span>{tile.text}<span style={{ color: '#A0845C' }}>”</span>
                    </p>
                  </blockquote>
                )
              }
              const ar = AR_MAP[tile.src] ?? ars[tile.imgIndex] ?? DEFAULT_AR
              const { colSpan, rowSpan } = spanFor(ar, tile.imgIndex)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(tile.imgIndex)}
                  aria-label={`View ${name} image ${tile.imgIndex + 1} of ${images.length} full screen`}
                  className="vm-mtile"
                  style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
                >
                  <img
                    src={tile.src}
                    alt={`${name} gallery image ${tile.imgIndex + 1}`}
                    loading="lazy"
                    onLoad={e => {
                      const im = e.currentTarget
                      if (im.naturalWidth && im.naturalHeight) {
                        const r = im.naturalWidth / im.naturalHeight
                        setArs(prev => (Math.abs((prev[tile.imgIndex] ?? 0) - r) < 0.001 ? prev : { ...prev, [tile.imgIndex]: r }))
                      }
                    }}
                  />
                </button>
              )
            })}
          </div>

          <style>{`
            /* Tile height is set by its grid row-span (matched to the image's real
               aspect ratio), so object-fit:cover fills it with, at most, a sub-row
               trim — the subject is never cropped out. */
            .vm-mtile {
              display: block; padding: 0; cursor: pointer; overflow: hidden;
              border-radius: var(--radius-md); background: var(--surface-3); border: 1px solid var(--border);
              transition: transform var(--dur-slow) var(--ease-out-soft),
                          box-shadow var(--dur-slow) var(--ease-out-soft),
                          filter var(--dur-slow) var(--ease-out-soft);
            }
            .vm-mtile img { display: block; width: 100%; height: 100%; object-fit: cover; }
            .vm-mtile:hover, .vm-mtile:focus-visible {
              transform: scale(1.02); filter: brightness(1.03);
              box-shadow: 0 14px 34px rgba(40, 35, 28, 0.16); outline: none;
            }
            .vm-mquote {
              margin: 0; display: flex; align-items: center; overflow: hidden;
              padding: clamp(18px, 2vw, 28px); border-radius: var(--radius-md);
              background: #28231C; color: #F2EFE9;
            }
          `}</style>
        </div>
      </section>
      {lightboxIndex !== null && (
        <DevelopmentLightbox images={images} name={name} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}
