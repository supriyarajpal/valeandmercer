'use client'
import { useEffect, useState, useRef } from 'react'

export interface DevelopmentHeroSlideshowProps {
  images: string[]
  alt: string
  titleLeft: string
  pricingLines: string[]
}

export default function DevelopmentHeroSlideshow({
  images,
  alt,
  titleLeft,
  pricingLines,
}: DevelopmentHeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slideList = images.length > 0 ? images : []
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (slideList.length <= 1) return

    // Honor reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slideList.length)
    }, 4500)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slideList.length])

  return (
    <section
      aria-label={`${alt} gallery hero`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#28231C',
      }}
    >
      {/* Slides */}
      {slideList.map((src, idx) => {
        const isActive = idx === currentIndex
        return (
          <div
            key={src}
            aria-hidden={!isActive}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.2s var(--ease-out-soft)',
              pointerEvents: 'none',
              zIndex: isActive ? 1 : 0,
            }}
          >
            <img
              src={src}
              alt={idx === 0 ? alt : ''}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding={idx === 0 ? 'sync' : 'async'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )
      })}

      {/* Two-sided overlay */}

      {/* Left overlay: Scrim + Street / City name */}
      {titleLeft && (
        <>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 'min(64%, 620px)',
              height: 'min(46%, 340px)',
              zIndex: 2,
              pointerEvents: 'none',
              background:
                'radial-gradient(115% 115% at 0% 100%, rgba(20,17,14,0.65) 0%, rgba(20,17,14,0.22) 40%, rgba(20,17,14,0) 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 'clamp(20px, 4vw, 48px)',
              bottom: 'clamp(24px, 4vh, 48px)',
              zIndex: 3,
              maxWidth: 'min(80%, 540px)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                color: '#F2EFE9',
                fontSize: 'clamp(22px, 2.8vw, 36px)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                textShadow:
                  '0 1px 14px rgba(20,17,14,0.72), 0 1px 3px rgba(20,17,14,0.6)',
                display: 'block',
              }}
            >
              {titleLeft}
            </span>
          </div>
        </>
      )}

      {/* Right overlay: Scrim + Pricing / Interest lines */}
      {pricingLines && pricingLines.length > 0 && (
        <>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 'min(64%, 620px)',
              height: 'min(46%, 340px)',
              zIndex: 2,
              pointerEvents: 'none',
              background:
                'radial-gradient(115% 115% at 100% 100%, rgba(20,17,14,0.65) 0%, rgba(20,17,14,0.22) 40%, rgba(20,17,14,0) 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 'clamp(20px, 4vw, 48px)',
              bottom: 'clamp(24px, 4vh, 48px)',
              zIndex: 3,
              maxWidth: 'min(80%, 540px)',
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              alignItems: 'flex-end',
            }}
          >
            {pricingLines.map((line, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 400,
                  color: '#F2EFE9',
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  lineHeight: 1.4,
                  letterSpacing: '0.01em',
                  textShadow:
                    '0 1px 14px rgba(20,17,14,0.72), 0 1px 3px rgba(20,17,14,0.6)',
                }}
              >
                {line}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
