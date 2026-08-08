'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { getLiveProperties, type Property } from '@/lib/properties'

// The `area` field is stored as `E14 · Cubitt Town` (postcode district
// dot neighbourhood). Take the neighbourhood segment for grouping.
function neighbourhoodOf(area: string): string {
  const parts = area.split('·').map(s => s.trim()).filter(Boolean)
  return parts[parts.length - 1] || area
}

// Live lettings browse experience — an area-grouped listing grid of the
// currently-available rentals. (Previously the standalone /rent page, folded
// into /let. The location map and the "coming soon" teaser cards were removed.)
export default function LettingsListings() {
  const availableNow = getLiveProperties().filter(p => p.listingType === 'To Let')

  // Non-Canary-Wharf listings grouped for the heading row: each group renders a
  // small-caps label + listing count directly above its card(s), and the groups
  // sit side by side as grid columns (see render below), so single-listing
  // areas fill the row rather than stacking vertically. Canary Wharf is split
  // out into its own separate section further down.
  //
  // Grouping key is the neighbourhood (segment after "·"), EXCEPT the two
  // client-added listings below, which are shown as their own street-named
  // groups per explicit client request — so Jude Street stays separate from
  // Bywell Place's "Canning Town" group instead of merging into it, and Newport
  // Avenue reads as "Newport Avenue" rather than its "Blackwall" locality. Each
  // card still carries its own locality tag (e.g. "E14 · Blackwall") regardless.
  const STREET_GROUPED_SLUGS = new Set(['newport-avenue-2bed-2500', 'jude-street-2bed-2947'])
  const { otherGroups, canaryWharf } = useMemo(() => {
    const map = new Map<string, Property[]>()
    const canaryWharf: Property[] = []
    for (const p of availableNow) {
      const n = neighbourhoodOf(p.area)
      if (n === 'Canary Wharf') { canaryWharf.push(p); continue }
      const key = STREET_GROUPED_SLUGS.has(p.slug) ? p.title : n
      const bucket = map.get(key)
      if (bucket) bucket.push(p)
      else map.set(key, [p])
    }
    const otherGroups = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    return { otherGroups, canaryWharf }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableNow])

  // Top padding uses the standard var(--section-y) so the hero → listings
  // transition matches every other section-after-hero on the site (/sell,
  // /student-lettings, homepage featured). Previously padding-top was 0 —
  // correct when this block followed the landlord section, but it left an
  // inconsistent rhythm once the listings were moved directly under the hero.
  return (
    <section style={{ background: 'var(--surface)', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Area-grouped grid — real active listings from lib/properties. */}
        {availableNow.length > 0 && (
          <section>
            <Reveal y={20} amount={0.2}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
                <div>
                  <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Available now</p>
                  <h2 style={{ color: 'var(--text)' }}>
                    Currently on <span style={{ color: '#A0845C', fontStyle: 'italic' }}>the market</span>
                  </h2>
                </div>
                <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                  {availableNow.length} {availableNow.length === 1 ? 'listing' : 'listings'}
                </span>
              </div>
            </Reveal>

            {/* Non-Canary-Wharf groups: each a small-caps heading + listing
                count directly above its card(s), laid out SIDE BY SIDE as grid
                columns (auto-fill minmax(320px)) — the heading row runs
                horizontally, one label per column, rather than stacking. This
                is the single, canonical render of these listings. */}
            {otherGroups.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '64px 36px', alignItems: 'start', marginBottom: canaryWharf.length > 0 ? 88 : 0 }}>
                {otherGroups.map(([label, list]) => (
                  <div key={label}>
                    <Reveal y={16} amount={0.15}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                        <div style={{ width: 18, height: 1, background: '#A0845C', flexShrink: 0 }} />
                        <h3 style={{ fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                          {label}
                        </h3>
                        <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                          {list.length} {list.length === 1 ? 'listing' : 'listings'}
                        </span>
                      </div>
                    </Reveal>
                    <Stagger as="div" stagger={0.08} style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                      {list.map(prop => (
                        <StaggerItem key={prop.slug} as="div">
                          <PropertyCard property={prop} />
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                ))}
              </div>
            )}

            {/* Canary Wharf kept as its own cluster (it holds several
                listings, so it fills a row on its own) rather than mixed
                into the combined grid above. */}
            {canaryWharf.length > 0 && (
              <div>
                <Reveal y={16} amount={0.15}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <div style={{ width: 22, height: 1, background: '#A0845C', flexShrink: 0 }} />
                    <h3 style={{ fontSize: 20, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      Canary Wharf
                    </h3>
                    <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                      {canaryWharf.length} {canaryWharf.length === 1 ? 'listing' : 'listings'}
                    </span>
                  </div>
                </Reveal>

                {/* Uniform grid: now that every card shares a fixed 4:3 image
                    frame, a plain auto-fill grid lines the cards up cleanly in
                    rows (matching the other neighbourhoods) instead of the old
                    masonry flow that suited varied natural-aspect frames. */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '48px 36px', alignItems: 'start' }}>
                  {canaryWharf.map(prop => (
                    <PropertyCard key={prop.slug} property={prop} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Property card — a full-bleed photo tile at a fixed 3:4 portrait     */
/* ratio (10px radius, no matting) so every card is the same height    */
/* and rows align. A bottom ink scrim (ink #28231C at ~82%, fading up) */
/* carries the label: locality in gold small caps, name in cream serif,*/
/* then beds · baths · price with the price in gold. TO LET pill sits   */
/* top-left, the favourite heart top-right. On hover the image zooms a  */
/* touch and the scrim lifts slightly to reveal a little more image.    */
/* ------------------------------------------------------------------ */

function PropertyCard({ property }: { property: Property }) {
  const bedLabel = property.beds === 0 ? 'Studio' : `${property.beds} bed${property.beds === 1 ? '' : 's'}`
  const href = `/property/${property.slug}`
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none', position: 'relative', display: 'block' }}
      onMouseEnter={e => {
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        const scrim = e.currentTarget.querySelector<HTMLDivElement>('[data-scrim]')
        if (img) img.style.transform = 'scale(1.06)'
        if (scrim) scrim.style.transform = 'translateY(-10px)'
      }}
      onMouseLeave={e => {
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        const scrim = e.currentTarget.querySelector<HTMLDivElement>('[data-scrim]')
        if (img) img.style.transform = 'scale(1)'
        if (scrim) scrim.style.transform = 'translateY(0)'
      }}
    >
      {/* Full-bleed 3:4 portrait tile — the image IS the card (no matting),
          10px radius, uniform ratio so rows always align. */}
      <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: 10, background: '#26221C', boxShadow: '0 18px 40px -24px rgba(40,35,28,0.5), 0 2px 6px -3px rgba(40,35,28,0.12)' }}>
        <img
          src={property.image}
          alt={`${property.title}, ${property.area}`}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
        />

        {/* TO LET pill — top-left, on the photo. */}
        <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 12px', borderRadius: 'var(--radius-pill)' }}>
          {property.listingType}
        </span>

        {/* Favourite heart — top-right, on the photo (unchanged behaviour). */}
        <FavoriteHeart slug={property.slug} title={property.title} />

        {/* Ink scrim panel over the bottom of the image (ink #28231C at ~82%,
            fading up so its top edge melts into the photo). Lifts on hover with
            the site's slow easing to reveal a little more image. */}
        <div
          data-scrim
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1,
            padding: 'clamp(18px, 2.2vw, 26px) clamp(16px, 2vw, 20px) clamp(16px, 2vw, 20px)',
            background: 'linear-gradient(to top, rgba(40,35,28,0.9) 0%, rgba(40,35,28,0.82) 46%, rgba(40,35,28,0.34) 82%, rgba(40,35,28,0) 100%)',
            transition: 'transform var(--dur-slow) var(--ease-out-soft)',
            willChange: 'transform',
          }}
        >
          {/* Locality — gold small caps. */}
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0845C', marginBottom: 7 }}>
            {property.area}
          </div>
          {/* Property name — cream serif. */}
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(21px, 2.2vw, 27px)', color: '#F2EFE9', lineHeight: 1.14, letterSpacing: '-0.01em', marginBottom: 10 }}>
            {property.title}
          </h3>
          {/* Beds · baths · price — price in gold. */}
          <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 10px', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.82)' }}>
            <span>{bedLabel}</span>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <span>{property.baths} bath{property.baths === 1 ? '' : 's'}</span>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <span style={{ fontSize: 13, letterSpacing: '0.04em', color: '#A0845C' }}>{property.rent}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Favourite heart — top-right of each Lettings card. Outline by       */
/* default, fills gold on tap with a smooth fill + a pop micro-        */
/* interaction. Persists favourited slugs in localStorage so the mark  */
/* survives navigation/reload. Client-only; no backend.               */
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
    /* private-mode / quota — favouriting is best-effort, never fatal */
  }
}

function FavoriteHeart({ slug, title }: { slug: string; title: string }) {
  // Starts false on both server and first client render (localStorage is not
  // available at SSR), then syncs to the stored value after mount — so there's
  // no hydration mismatch, just a one-frame settle for already-favourited cards.
  const [fav, setFav] = useState(false)

  useEffect(() => {
    setFav(readFavourites().includes(slug))
  }, [slug])

  // The card itself is a <Link>; a <button> nested in an <a> is invalid, so
  // this is a role="button" span — valid inside the anchor, moves with the
  // card's hover-lift, and toggles without navigating.
  const activate = (el: HTMLElement) => {
    const next = !fav
    setFav(next)
    const list = readFavourites()
    writeFavourites(next ? Array.from(new Set([...list, slug])) : list.filter(s => s !== slug))

    // Satisfying pop on every activation (Web Animations API retriggers cleanly).
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
        // Now sits on the photo (top-right), so a small ink glass disc backs
        // the gold heart to keep it legible over any image.
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
