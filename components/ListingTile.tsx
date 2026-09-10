'use client'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'

// Shared listing card ("Design C"), used by BOTH the lettings grid (/let) and
// the new-homes grid (/buy). The visual treatment is identical everywhere:
//   • full-bleed photo at a fixed 3:4 portrait ratio, 10px radius, no matting;
//   • an ink scrim (#28231C ~82%, fading up) over the bottom carrying the label:
//     eyebrow (locality) in gold small caps, title in cream serif, and a detail
//     line whose price part is gold;
//   • a badge pill top-left, an optional favourite heart top-right;
//   • on hover the image zooms a touch and the scrim lifts with the site's slow
//     ease-out (no snap). Fine-pointer hover also crossfades through gallery
//     images; mouseleave snaps back to the cover. Touch does not cycle.
// Everything that differs between /let and /buy is passed as data props.

export type ListingTileDetailPart = {
  text: string
  /** Render this part in gold (used for the price). */
  gold?: boolean
}

export type ListingTileProps = {
  href: string
  image: string
  imageAlt: string
  /** Optional extra gallery frames. Cover (`image`) is always first. */
  images?: string[]
  /** Badge pill text (rendered upper-case), e.g. "To Let" / "New Homes". */
  badge: string
  /** Gold small-caps line above the title (locality). Omitted when absent. */
  eyebrow?: string
  /** Cream serif heading. */
  title: string
  /** Detail line parts, joined by "·". Empty parts are skipped (no empty slot). */
  detail: ListingTileDetailPart[]
  /** When provided, renders the favourite heart (localStorage-backed). */
  favourite?: { slug: string; title: string }
  /** Image load strategy. Defaults to 'lazy' (good for the long lettings grid);
   *  the small /buy grid passes 'eager' so below-the-fold cards never flash a
   *  blank tile before their photo lazy-loads. */
  loading?: 'lazy' | 'eager'
}

const CYCLE_MS = 1350

function uniqueFrames(cover: string, extras?: string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const src of [cover, ...(extras ?? [])]) {
    if (!src || seen.has(src)) continue
    seen.add(src)
    out.push(src)
  }
  return out
}

function canCycleOnHover(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover)').matches
}

function preload(srcs: string[]): void {
  for (const src of srcs) {
    const img = new window.Image()
    img.src = src
  }
}

export default function ListingTile({ href, image, imageAlt, images, badge, eyebrow, title, detail, favourite, loading = 'lazy' }: ListingTileProps) {
  const parts = detail.filter(p => p.text && p.text.trim())
  const frames = uniqueFrames(image, images)
  const canCycle = frames.length > 1

  const [idx, setIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState(0)
  const [mounted, setMounted] = useState<number[]>([0])
  const [lifted, setLifted] = useState(false)
  const idxRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const revertCover = () => {
    clearTimer()
    idxRef.current = 0
    setIdx(0)
    setPrevIdx(0)
    setMounted([0])
  }

  useEffect(() => () => clearTimer(), [])

  const onMouseEnter = () => {
    setLifted(true)
    if (!canCycle || !canCycleOnHover()) return
    const ahead = [1, 2, 3].filter(i => i < frames.length)
    preload(ahead.map(i => frames[i]))
    setMounted(Array.from(new Set([0, ...ahead])))
    clearTimer()
    timerRef.current = window.setInterval(() => {
      const prev = idxRef.current
      const next = (idxRef.current + 1) % frames.length
      idxRef.current = next
      const more = [next, next + 1, next + 2, next + 3].map(i => i % frames.length)
      preload(more.map(i => frames[i]))
      setMounted(m => Array.from(new Set([...m, ...more])))
      setPrevIdx(prev)
      setIdx(next)
    }, CYCLE_MS)
  }

  const onMouseLeave = () => {
    setLifted(false)
    revertCover()
  }

  const visible = new Set(mounted)

  return (
    <Link
      href={href}
      style={{ textDecoration: 'none', position: 'relative', display: 'block' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Full-bleed 3:4 portrait tile: the image IS the card (no matting),
          10px radius, uniform ratio so rows always align. */}
      <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: 10, background: '#26221C', boxShadow: '0 18px 40px -24px rgba(40,35,28,0.5), 0 2px 6px -3px rgba(40,35,28,0.12)' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: lifted ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.9s var(--ease-out-soft)',
            willChange: 'transform',
          }}
        >
          {frames.map((src, i) => {
            if (!visible.has(i)) return null
            const isCover = i === 0
            const isCurrent = i === idx
            const isPrev = i === prevIdx && i !== idx
            return (
              <img
                key={src}
                src={src}
                alt={isCover ? imageAlt : ''}
                loading={isCover ? loading : 'eager'}
                aria-hidden={!isCover}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: (isCurrent || isPrev) ? 1 : 0,
                  transition: isCurrent
                    ? 'opacity var(--dur-fast) var(--ease-out-soft)'
                    : 'none',
                  zIndex: isCurrent ? 2 : (isPrev ? 1 : 0),
                  pointerEvents: 'none',
                }}
              />
            )
          })}
        </div>

        {/* Badge pill: top-left, on the photo. */}
        <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 12px', borderRadius: 'var(--radius-pill)' }}>
          {badge}
        </span>

        {favourite && <FavoriteHeart slug={favourite.slug} title={favourite.title} />}

        {/* Ink scrim over the bottom (ink #28231C at ~82%, fading up so its top
            edge melts into the photo). Lifts on hover with the slow ease. */}
        <div
          data-scrim
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1,
            padding: 'clamp(18px, 2.2vw, 26px) clamp(16px, 2vw, 20px) clamp(16px, 2vw, 20px)',
            background: 'linear-gradient(to top, rgba(40,35,28,0.9) 0%, rgba(40,35,28,0.82) 46%, rgba(40,35,28,0.34) 82%, rgba(40,35,28,0) 100%)',
            transform: lifted ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'transform var(--dur-slow) var(--ease-out-soft)',
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        >
          {eyebrow && (
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0845C', marginBottom: 7 }}>
              {eyebrow}
            </div>
          )}
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(21px, 2.2vw, 27px)', color: '#F2EFE9', lineHeight: 1.14, letterSpacing: '-0.01em', marginBottom: parts.length > 0 ? 10 : 0 }}>
            {title}
          </h3>
          {parts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 10px', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.82)' }}>
              {parts.map((p, i) => (
                <Fragment key={i}>
                  {i > 0 && <span aria-hidden style={{ opacity: 0.5 }}>·</span>}
                  <span style={p.gold ? { fontSize: 13, letterSpacing: '0.04em', color: '#A0845C' } : undefined}>{p.text}</span>
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Favourite heart: top-right, on the photo. Outline by default,       */
/* fills gold on tap with a pop. Persists favourited slugs in          */
/* localStorage so the mark survives navigation/reload. Client-only.   */
/* Clicking it toggles WITHOUT navigating the card.                    */
/* ------------------------------------------------------------------ */

const FAVORITES_KEY = 'vm-favourites'

function readFavourites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

function writeFavourites(list: string[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list))
  } catch {
    /* private-mode / quota: favouriting is best-effort, never fatal */
  }
}

function FavoriteHeart({ slug, title }: { slug: string; title: string }) {
  // Starts false on server + first client render (no localStorage at SSR),
  // then syncs after mount: no hydration mismatch, just a one-frame settle.
  const [fav, setFav] = useState(false)

  useEffect(() => {
    setFav(readFavourites().includes(slug))
  }, [slug])

  // The card is a <Link>; a <button> nested in an <a> is invalid, so this is a
  // role="button" span that toggles without navigating.
  const activate = (el: HTMLElement) => {
    const next = !fav
    setFav(next)
    const list = readFavourites()
    writeFavourites(next ? Array.from(new Set([...list, slug])) : list.filter(s => s !== slug))
    el.animate?.(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.28)', offset: 0.35 },
        { transform: 'scale(0.92)', offset: 0.7 },
        { transform: 'scale(1)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }

  const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation()
    activate(e.currentTarget)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      e.stopPropagation()
      activate(e.currentTarget)
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-pressed={fav}
      aria-label={fav ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
      style={{
        // On the photo (top-right): a small ink glass disc backs the gold
        // heart so it stays legible over any image.
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 3,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        padding: 0,
        borderRadius: '50%',
        cursor: 'pointer',
        background: 'rgba(40,35,28,0.4)',
        border: '1px solid rgba(242,239,233,0.18)',
        backdropFilter: 'blur(8px) saturate(160%)',
        WebkitBackdropFilter: 'blur(8px) saturate(160%)',
        lineHeight: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden style={{ display: 'block', overflow: 'visible' }}>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={fav ? '#A0845C' : 'rgba(160,132,92,0)'}
          stroke="#A0845C"
          strokeWidth={1.6}
          strokeLinejoin="round"
          style={{ transition: 'fill 230ms var(--ease-apple), stroke 230ms var(--ease-apple)' }}
        />
      </svg>
    </span>
  )
}
