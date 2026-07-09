'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Shared drop-shadow — every text element in the hero needs this so it
// stays legible across bright/dark photographs. Mirrors the pattern used
// on the homepage HeroSubtext.
const HERO_TEXT_SHADOW = '0 2px 18px rgba(20,17,14,0.75), 0 1px 3px rgba(20,17,14,0.55)'

// Filenames that look like floor plans are pushed to the last slide so
// the carousel reads photos-then-plan by default. Semantic per-room
// ordering still needs manual curation of the gallery array in
// lib/properties.ts — this is the last-mile fallback.
const FLOOR_PLAN_RE = /floor[\s_-]?plan|floorplan|\/plan[\s_.-]|-plan\.|_plan\./i

function orderForCarousel(images: string[]): string[] {
  const nonPlans: string[] = []
  const plans:    string[] = []
  for (const src of images) {
    if (FLOOR_PLAN_RE.test(src)) plans.push(src)
    else nonPlans.push(src)
  }
  return [...nonPlans, ...plans]
}

export interface PropertyHeroCarouselProps {
  heroImage: string
  gallery: string[]
  usingPlaceholder: boolean
  title: string
  area: string
  propertyRef: string
  listingType: string
  rent: string
  rentPW: string
  beds: number
  baths: number
  sqft: number | null
  floor: string | null
  available: string
}

export default function PropertyHeroCarousel(props: PropertyHeroCarouselProps) {
  const {
    heroImage, gallery, usingPlaceholder,
    title, area, propertyRef, listingType, rent, rentPW,
    beds, baths, sqft, floor, available,
  } = props

  const reduce = useReducedMotion()

  const images = useMemo(
    () => orderForCarousel([heroImage, ...(gallery ?? [])]),
    [heroImage, gallery],
  )
  const multi = images.length > 1

  const [idx, setIdx] = useState(0)
  // Full hero copy shows exactly when the first slide is on screen —
  // whether that's the initial load OR the user navigated back to it.
  // Two-way toggle: `idx > 0` collapses to the minimised bottom-left
  // label, `idx === 0` restores the full title/price/details stack.
  const showFullText = idx === 0

  const go = useCallback((i: number) => {
    setIdx(((i % images.length) + images.length) % images.length)
  }, [images.length])
  const prev = useCallback(() => go(idx - 1), [go, idx])
  const next = useCallback(() => go(idx + 1), [go, idx])

  // Keyboard nav — arrow keys move between slides while the hero is in
  // view. No listener when the gallery has only one image.
  useEffect(() => {
    if (!multi) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [multi, prev, next])

  const bedLabel = beds === 0 ? 'Studio' : `${beds} bed${beds === 1 ? '' : 's'}`

  return (
    <section
      style={{
        background: '#28231C',
        minHeight: '72vh',
        position: 'relative',
        overflow: 'hidden',
        padding: '160px var(--gutter) 64px',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* All slides stacked; opacity crossfade drives the transition.
          Non-current frames are lazy-loaded so a 30-photo gallery doesn't
          eagerly pull every image on first paint. */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {images.map((src, i) => {
          const isCurrent = i === idx
          return (
            <img
              key={src + i}
              src={src}
              alt={isCurrent && !usingPlaceholder ? `${title}, ${area}` : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Frame 0 sits at 0.7 so the full hero copy reads over
                // the dual scrim. Any other frame restores to true
                // brightness — the scrim below is fading out at the same
                // time so we can't leave the image dimmed. Placeholder
                // path stays at 1 unconditionally (neutral gradient, not
                // a photo). Two-way: navigating back to slide 0 dims
                // again in sync with the scrim fade-in.
                opacity: isCurrent ? (usingPlaceholder ? 1 : (showFullText ? 0.7 : 1)) : 0,
                transition: 'opacity 500ms ease',
                pointerEvents: 'none',
              }}
            />
          )
        })}
      </div>

      {/* Scrim strategy:
            – Slide 0 (whether initial load or navigated back to it):
              heavy dual scrim covers the whole hero so the large
              title/price/details stack reads. Same values as the
              pre-carousel hero.
            – Any other slide: fade the full-bleed scrim out so the photo
              displays at its true brightness, and fade in a small corner
              gradient in the bottom-left just wide/tall enough to
              protect the minimised label.
          Both scrim modes stay mounted so opacity can transition
          smoothly on every direction change rather than pop. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(20,17,14,0.35)',
          opacity: showFullText ? 1 : 0,
          transition: 'opacity 500ms ease',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(20,17,14,0.55) 0%, rgba(20,17,14,0.12) 32%, rgba(20,17,14,0.55) 62%, rgba(20,17,14,0.92) 100%)',
          opacity: showFullText ? 1 : 0,
          transition: 'opacity 500ms ease',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          // Corner-only patch: ~half the hero width, roughly a third of
          // its height. The radial-ish diagonal gradient falls off before
          // it reaches the arrows or the counter on the right.
          width: '55%',
          height: '38%',
          background:
            'linear-gradient(to top right, rgba(20,17,14,0.72) 0%, rgba(20,17,14,0.4) 35%, rgba(20,17,14,0) 80%)',
          opacity: showFullText ? 0 : 1,
          transition: 'opacity 500ms ease',
          pointerEvents: 'none',
        }}
      />

      {usingPlaceholder && (
        <div
          style={{
            position: 'absolute',
            top: 132,
            right: 'var(--gutter)',
            zIndex: 11,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            border: '0.5px solid rgba(242,239,233,0.28)',
            background: 'rgba(20,17,14,0.4)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(242,239,233,0.75)',
          }}
        >
          <span aria-hidden style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', display: 'inline-block' }} />
          Photography commissioned
        </div>
      )}

      {/* Prev / next arrows — vertically centred at the edges. Hidden when
          only one image exists (i.e. placeholder-only listings). */}
      {multi && (
        <>
          <CarouselArrow direction="prev" onClick={prev} />
          <CarouselArrow direction="next" onClick={next} />
        </>
      )}

      {/* Text stack. AnimatePresence swaps between the full hero copy
          (whenever slide 0 is on screen) and the compact bottom-left
          label (any other slide). */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait" initial={false}>
          {!showFullText ? (
            <motion.div
              key="mini"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 20,
                  fontWeight: 300,
                  color: '#F2EFE9',
                  letterSpacing: '-0.005em',
                  textShadow: HERO_TEXT_SHADOW,
                }}
              >
                {title}
                <span style={{ color: '#A0845C', fontStyle: 'italic' }}> · {area}</span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(242,239,233,0.7)',
                  textShadow: HERO_TEXT_SHADOW,
                }}
              >
                {listingType} · Ref {propertyRef}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 32, height: 1, background: '#A0845C' }} />
                <span className="eyebrow" style={{ color: '#A0845C', textShadow: HERO_TEXT_SHADOW }}>
                  {listingType} · Ref {propertyRef}
                </span>
              </div>

              <h1
                style={{
                  color: '#F2EFE9',
                  marginBottom: 24,
                  fontSize: 'clamp(38px, 6vw, 72px)',
                  lineHeight: 1.05,
                  maxWidth: 900,
                  textShadow: HERO_TEXT_SHADOW,
                }}
              >
                {title}
                <span style={{ color: '#A0845C', fontStyle: 'italic' }}> · {area}</span>
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '18px 28px', marginBottom: 14 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(30px, 4.4vw, 44px)',
                    fontWeight: 300,
                    color: '#F2EFE9',
                    letterSpacing: '-0.01em',
                    textShadow: HERO_TEXT_SHADOW,
                  }}
                >
                  {rent}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(242,239,233,0.72)',
                    letterSpacing: '0.02em',
                    textShadow: HERO_TEXT_SHADOW,
                  }}
                >
                  {rentPW}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px 22px',
                  fontSize: 12,
                  color: 'rgba(242,239,233,0.82)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textShadow: HERO_TEXT_SHADOW,
                }}
              >
                <span>{bedLabel}</span>
                <span aria-hidden style={{ opacity: 0.4 }}>·</span>
                <span>{baths} bath{baths === 1 ? '' : 's'}</span>
                {sqft != null && (<>
                  <span aria-hidden style={{ opacity: 0.4 }}>·</span>
                  <span>{sqft} sq. ft.</span>
                </>)}
                {floor && (<>
                  <span aria-hidden style={{ opacity: 0.4 }}>·</span>
                  <span>{floor}</span>
                </>)}
                <span aria-hidden style={{ opacity: 0.4 }}>·</span>
                <span>Available {available}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dots + counter overlay, bottom-right so it never fights the
          minimised label in the bottom-left. */}
      {multi && (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 'var(--gutter)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <CarouselDots count={images.length} activeIdx={idx} onSelect={go} />
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(242,239,233,0.75)',
              textShadow: HERO_TEXT_SHADOW,
              whiteSpace: 'nowrap',
            }}
            aria-live="polite"
          >
            {idx + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */

function CarouselArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev'
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? 'Previous photo' : 'Next photo'}
      style={{
        position: 'absolute',
        top: '50%',
        [isPrev ? 'left' : 'right']: 'var(--gutter)',
        transform: 'translateY(-50%)',
        zIndex: 20,
        background: 'rgba(20,17,14,0.35)',
        border: '0.5px solid rgba(242,239,233,0.28)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        color: '#F2EFE9',
        cursor: 'pointer',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        lineHeight: 1,
        transition: 'background 0.3s var(--ease-out-soft), border-color 0.3s var(--ease-out-soft)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,17,14,0.6)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,17,14,0.35)' }}
    >
      {isPrev ? '←' : '→'}
    </button>
  )
}

function CarouselDots({ count, activeIdx, onSelect }: { count: number; activeIdx: number; onSelect: (i: number) => void }) {
  // For very long galleries the dot row would overflow; cap the visible
  // dots at 10 and show a compressed range around the active index.
  const MAX = 10
  const visible: number[] = []
  if (count <= MAX) {
    for (let i = 0; i < count; i++) visible.push(i)
  } else {
    const half = Math.floor(MAX / 2)
    let start = Math.max(0, activeIdx - half)
    const end = Math.min(count, start + MAX)
    start = Math.max(0, end - MAX)
    for (let i = start; i < end; i++) visible.push(i)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {visible.map(i => {
        const isActive = i === activeIdx
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={isActive}
            style={{
              width: isActive ? 22 : 7,
              height: 7,
              borderRadius: 999,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: isActive ? '#A0845C' : 'rgba(242,239,233,0.5)',
              transition: 'width 0.3s var(--ease-out-soft), background 0.3s var(--ease-out-soft)',
            }}
          />
        )
      })}
    </div>
  )
}
