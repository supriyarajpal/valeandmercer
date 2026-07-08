'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'

// Custom event fired by HeroImageClickTarget; caught by PropertyGallery.
const GALLERY_EVENT = 'vm:open-gallery'

const STRIP_COUNT = 3  // max thumbnails shown in the preview strip

/* ------------------------------------------------------------------
   HeroImageClickTarget
   Renders a transparent button that covers the hero photograph.
   When clicked, dispatches an event picked up by PropertyGallery to
   open the lightbox at index 0 (the hero image).
   ------------------------------------------------------------------ */

export function HeroImageClickTarget({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <button
      onClick={() =>
        window.dispatchEvent(new CustomEvent(GALLERY_EVENT, { detail: { index: 0 } }))
      }
      style={{
        position: 'absolute',
        inset: 0,
        background: 'transparent',
        cursor: 'zoom-in',
        border: 'none',
        padding: 0,
        zIndex: 5,
      }}
      aria-label="View all property photos"
    />
  )
}

/* ------------------------------------------------------------------
   PropertyGallery
   Renders a compact 3-thumbnail strip below the hero + a full-screen
   lightbox. allImages = [heroImage, ...gallery] so the lightbox
   always includes the hero as its first frame.
   ------------------------------------------------------------------ */

interface GalleryProps {
  heroImage: string
  gallery: string[]
  title: string
  area: string
}

export function PropertyGallery({ heroImage, gallery, title, area }: GalleryProps) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  const allImages = [heroImage, ...gallery]
  const thumbnails = gallery.slice(0, STRIP_COUNT)
  // Images not visible in the strip (excluding the hero shown above the strip)
  const moreCount = Math.max(0, gallery.length - STRIP_COUNT)

  const openAt = useCallback((i: number) => { setIdx(i); setOpen(true) }, [])
  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(() => setIdx(i => (i - 1 + allImages.length) % allImages.length), [allImages.length])
  const next = useCallback(() => setIdx(i => (i + 1) % allImages.length), [allImages.length])

  // Listen for hero-image clicks dispatched by HeroImageClickTarget
  useEffect(() => {
    const h = (e: Event) =>
      openAt((e as CustomEvent<{ index: number }>).detail?.index ?? 0)
    window.addEventListener(GALLERY_EVENT, h)
    return () => window.removeEventListener(GALLERY_EVENT, h)
  }, [openAt])

  // Keyboard navigation while lightbox is open
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, close, prev, next])

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (gallery.length === 0) return null

  return (
    <>
      {/* ---- gallery label + thumbnail preview strip ---- */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#A0845C',
            marginBottom: 10,
          }}
        >
          Gallery
        </p>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {thumbnails.map((src, i) => {
            // allImages[0] = hero, so gallery[i] = allImages[i + 1]
            const imgIdx = i + 1
            const isLast = i === thumbnails.length - 1
            const showMore = isLast && moreCount > 0

            return (
              <button
                key={src}
                onClick={() => openAt(imgIdx)}
                style={{
                  position: 'relative',
                  width: 180,
                  height: 120,
                  flexShrink: 0,
                  border: 'none',
                  padding: 0,
                  cursor: 'zoom-in',
                  background: '#DDD7CC',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
                aria-label={showMore ? `View all ${allImages.length} photos` : `View photo ${imgIdx + 1} of ${allImages.length}`}
              >
                <Image
                  src={src}
                  alt={`${title}, ${area} - photo ${imgIdx + 1}`}
                  fill
                  sizes="180px"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
                {showMore && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(20,17,14,0.62)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F2EFE9',
                      fontFamily: 'var(--font-serif)',
                      fontSize: 22,
                      fontWeight: 300,
                      letterSpacing: '-0.01em',
                      pointerEvents: 'none',
                    }}
                  >
                    +{moreCount}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- full-screen lightbox ---- */}
      {open && (
        <Lightbox
          images={allImages}
          title={title}
          area={area}
          idx={idx}
          onPrev={prev}
          onNext={next}
          onClose={close}
        />
      )}
    </>
  )
}

/* ------------------------------------------------------------------
   Lightbox
   ------------------------------------------------------------------ */

interface LightboxProps {
  images: string[]
  title: string
  area: string
  idx: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

function Lightbox({ images, title, area, idx, onPrev, onNext, onClose }: LightboxProps) {
  const multi = images.length > 1
  const touchStartX = useRef(0)

  const GOLD = '#A0845C'

  return (
    // Clicking the backdrop closes the lightbox
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14,11,8,0.96)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Image container — stop propagation so clicking the photo itself doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (dx > 50) onPrev()
          else if (dx < -50) onNext()
        }}
        style={{
          position: 'relative',
          width: '88vw',
          maxWidth: 1100,
          height: '80vh',
        }}
      >
        <Image
          src={images[idx]}
          alt={`${title}, ${area} - photo ${idx + 1} of ${images.length}`}
          fill
          sizes="(max-width: 768px) 100vw, 88vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 24,
          right: 28,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: GOLD,
          fontSize: 20,
          lineHeight: 1,
          padding: '8px 10px',
          letterSpacing: 0,
          minWidth: 44,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Close gallery"
      >
        ✕
      </button>

      {/* Counter */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(242,239,233,0.55)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {idx + 1} / {images.length}
      </div>

      {/* Previous arrow */}
      {multi && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          style={{
            position: 'fixed',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: '0.5px solid rgba(160,132,92,0.35)',
            cursor: 'pointer',
            color: GOLD,
            fontSize: 17,
            lineHeight: 1,
            padding: '16px 18px',
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Previous photo"
        >
          ←
        </button>
      )}

      {/* Next arrow */}
      {multi && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          style={{
            position: 'fixed',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: '0.5px solid rgba(160,132,92,0.35)',
            cursor: 'pointer',
            color: GOLD,
            fontSize: 17,
            lineHeight: 1,
            padding: '16px 18px',
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Next photo"
        >
          →
        </button>
      )}
    </div>
  )
}
