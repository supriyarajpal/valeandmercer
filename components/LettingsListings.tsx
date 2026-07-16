'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { getLiveProperties, type Property } from '@/lib/properties'

// Leaflet only runs in the browser. Dynamic import with ssr:false keeps
// it out of the SSR pass and out of the initial JS bundle for anyone who
// never scrolls to the map. Lightweight cream placeholder while the map
// chunk loads so the page doesn't jump. (Leaflet's own CSS is linked
// globally via app/globals.css, so the tile pane styles are always
// present regardless of when this chunk loads.)
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: 'clamp(360px, 55vh, 560px)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-faint)',
        fontSize: 11,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}
    >
      Loading map
    </div>
  ),
})

const properties_teaser = [
  { area: 'Canary Wharf, East London', desc: 'Lettings coming shortly. Register to hear first.' },
  { area: 'Notting Hill W11', desc: 'Lettings across Notting Hill and Kensington coming soon.' },
  { area: 'Kensington W8', desc: 'Premium lettings in Kensington. Register now.' },
]

// The `area` field is stored as `E14 · Cubitt Town` (postcode district
// dot neighbourhood). Take the neighbourhood segment for grouping.
function neighbourhoodOf(area: string): string {
  const parts = area.split('·').map(s => s.trim()).filter(Boolean)
  return parts[parts.length - 1] || area
}

// Live lettings browse experience — map + area-grouped listing grid +
// coming-soon teasers. Previously the standalone /rent (Rentals) page;
// folded into the /let Lettings page so lettings lives on one route.
export default function LettingsListings() {
  const availableNow = getLiveProperties().filter(p => p.listingType === 'To Let')

  // Non-Canary-Wharf listings grouped by neighbourhood (sorted), each group
  // rendered as its own small heading + card. The GROUPS are laid out side by
  // side as grid columns (see render below), so single-listing areas fill the
  // row instead of stacking vertically with dead space beside them. Canary
  // Wharf is split out into its own separate section further down.
  const { otherGroups, canaryWharf } = useMemo(() => {
    const map = new Map<string, Property[]>()
    const canaryWharf: Property[] = []
    for (const p of availableNow) {
      const n = neighbourhoodOf(p.area)
      if (n === 'Canary Wharf') { canaryWharf.push(p); continue }
      const bucket = map.get(n)
      if (bucket) bucket.push(p)
      else map.set(n, [p])
    }
    const otherGroups = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    return { otherGroups, canaryWharf }
  }, [availableNow])

  const handleMarkerFocus = useCallback((slug: string) => {
    // Scroll the matching card into view. Small delay so a marker click
    // that also opens a popup doesn't compete with the scroll animation.
    if (typeof window === 'undefined') return
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`property-${slug}`)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('vm-flash')
      window.setTimeout(() => el.classList.remove('vm-flash'), 1600)
    })
  }, [])

  // Top padding uses the standard var(--section-y) so the hero → listings
  // transition matches every other section-after-hero on the site (/sell,
  // /student-lettings, homepage featured). Previously padding-top was 0 —
  // correct when this block followed the landlord section, but it left an
  // inconsistent rhythm once the listings were moved directly under the hero.
  return (
    <section style={{ background: 'var(--surface)', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Map + area-grouped grid — real active listings from lib/properties. */}
        {availableNow.length > 0 && (
          <section style={{ marginBottom: 96 }}>
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

            <Reveal y={20} amount={0.1}>
              <div style={{ marginBottom: 48 }}>
                <PropertyMap properties={availableNow} onMarkerFocus={handleMarkerFocus} />
                <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: 12 }}>
                  Marker locations are indicative to the street, not the door.
                </p>
              </div>
            </Reveal>

            {/* Non-Canary-Wharf neighbourhoods, each a small heading + count
                above its card(s), laid out SIDE BY SIDE as grid columns
                (auto-fill minmax(300px)) — so single-listing areas fill the
                row rather than stacking vertically with dead space beside
                them. This is the single, canonical render of these listings;
                there is no second per-neighbourhood block below. */}
            {otherGroups.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '64px 36px', alignItems: 'start', marginBottom: canaryWharf.length > 0 ? 88 : 0 }}>
                {otherGroups.map(([area, list]) => (
                  <div key={area}>
                    <Reveal y={16} amount={0.15}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                        <div style={{ width: 18, height: 1, background: '#A0845C', flexShrink: 0 }} />
                        <h3 style={{ fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                          {area}
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

                {/* Masonry column flow: the varied natural-aspect frames pack
                    into a gallery-wall rhythm instead of a rigid grid whose
                    rows would size to the tallest card and leave gaps. */}
                <div style={{ columnWidth: '340px', columnGap: 36 }}>
                  {canaryWharf.map(prop => (
                    <div key={prop.slug} style={{ breakInside: 'avoid', marginBottom: 48 }}>
                      <PropertyCard property={prop} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Coming soon — teaser cards for portfolios not yet live. */}
        <Reveal y={16} amount={0.2}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Coming soon</p>
              <h2 style={{ color: 'var(--text)' }}>
                Building the <span style={{ color: '#A0845C', fontStyle: 'italic' }}>next portfolio</span>
              </h2>
            </div>
            <ArrowButton href="/register" label="Register Your Interest" variant="dark" />
          </div>
        </Reveal>

        <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border-strong)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {properties_teaser.map(item => (
            <StaggerItem key={item.area} as="div">
              <Link
                href="/register"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#34302B',
                  padding: '40px 32px',
                  minHeight: 200,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background 0.5s var(--ease-out-soft)',
                }}
                onMouseEnter={e => {
                  const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                  if (arrow) arrow.style.transform = 'translateX(6px)'
                  e.currentTarget.style.background = '#40392E'
                }}
                onMouseLeave={e => {
                  const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
                  if (arrow) arrow.style.transform = 'translateX(0)'
                  e.currentTarget.style.background = '#34302B'
                }}
              >
                <div>
                  <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 12px', borderRadius: 'var(--radius-pill)', marginBottom: 18 }}>To Let</span>
                  <h3 style={{ fontSize: 22, color: '#F2EFE9', marginBottom: 10 }}>{item.area}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(242,239,233,0.6)', lineHeight: 1.75 }}>{item.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0845C' }}>Register Interest</span>
                  <span data-arrow aria-hidden style={{ color: '#A0845C', fontSize: 13, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Marker-click highlight for the matching card. Kept as a small
          inline stylesheet with a scoped class so nothing else on the
          site can hit it. */}
      <style>{`
        .vm-flash { animation: vmFlash 1.6s var(--ease-out-soft); }
        @keyframes vmFlash {
          0%   { box-shadow: 0 0 0 0    rgba(160,132,92,0.55), 0 20px 40px -20px rgba(52,48,43,0.18); }
          40%  { box-shadow: 0 0 0 6px  rgba(160,132,92,0.35), 0 20px 40px -20px rgba(52,48,43,0.18); }
          100% { box-shadow: 0 0 0 0    rgba(160,132,92,0),    0 20px 40px -20px rgba(52,48,43,0.18); }
        }
      `}</style>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Gallery-frame property card — the photograph sits inside generous   */
/* cream matting with a thin gold hairline directly around it (framed  */
/* artwork, not an app card). The label (locality · name · specs) lives */
/* in open space BELOW the frame, never overlaid on the photo. The     */
/* image renders at its natural aspect ratio, so frame proportions vary */
/* photo to photo for a gallery-wall rhythm rather than a uniform box.  */
/* ------------------------------------------------------------------ */

function PropertyCard({ property }: { property: Property }) {
  const bedLabel = property.beds === 0 ? 'Studio' : `${property.beds} bed${property.beds === 1 ? '' : 's'}`
  const href = `/property/${property.slug}`
  return (
    <Link
      id={`property-${property.slug}`}
      href={href}
      style={{ textDecoration: 'none', position: 'relative', display: 'block' }}
      onMouseEnter={e => {
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        if (arrow) arrow.style.transform = 'translateX(6px)'
        if (img) img.style.transform = 'scale(1.04)'
      }}
      onMouseLeave={e => {
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        if (arrow) arrow.style.transform = 'translateX(0)'
        if (img) img.style.transform = 'scale(1)'
      }}
    >
      {/* The frame — cream matting (surface-2), generous padding on all
          sides, lifted off the page with a soft shadow like hung artwork. */}
      <div style={{ position: 'relative', background: 'var(--surface-2)', padding: 'clamp(24px, 3vw, 38px)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(52,48,43,0.06)', boxShadow: '0 16px 36px -22px rgba(40,35,28,0.42), 0 2px 6px -3px rgba(40,35,28,0.12)' }}>
        {/* The photo, with a thin gold hairline directly around it. Natural
            aspect ratio (height:auto) so each frame's proportion follows its
            own photo — some taller, some wider. */}
        <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(160,132,92,0.5)', borderRadius: 2, background: '#26221C' }}>
          <img
            src={property.image}
            alt={`${property.title}, ${property.area}`}
            loading="lazy"
            style={{ display: 'block', width: '100%', height: 'auto', transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
          />
          {/* TO LET badge — small, understated, sitting ON the photo, top-left. */}
          <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 12px', borderRadius: 'var(--radius-pill)' }}>
            {property.listingType}
          </span>
        </div>

        {/* Favourite heart — sits in the matting, top-right, off the photo. */}
        <FavoriteHeart slug={property.slug} title={property.title} />
      </div>

      {/* Label — in open space BELOW the frame, real vertical gap, never a
          panel butted against the image. */}
      <div style={{ marginTop: 'clamp(16px, 1.8vw, 24px)', padding: '0 2px' }}>
        {/* Locality — small, quiet italic line. */}
        <div style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.01em', marginBottom: 8 }}>
          {property.area}
        </div>
        {/* Property name — the dominant text element: large serif headline. */}
        <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(22px, 2.4vw, 30px)', color: 'var(--text)', lineHeight: 1.12, letterSpacing: '-0.01em', marginBottom: 14 }}>
          {property.title}
        </h3>
        {/* One minimal spec line — beds · baths · price, generously spaced
            small caps, no divider rule or boxed price. Price is emphasised;
            the arrow CTA follows it immediately. */}
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 12px', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <span>{bedLabel}</span>
          <span aria-hidden style={{ color: 'var(--border-strong)' }}>·</span>
          <span>{property.baths} bath{property.baths === 1 ? '' : 's'}</span>
          <span aria-hidden style={{ color: 'var(--border-strong)' }}>·</span>
          <span style={{ fontSize: 14, letterSpacing: '0.06em', color: 'var(--text)' }}>{property.rent}</span>
          <span data-arrow aria-hidden style={{ color: '#A0845C', fontSize: 15, letterSpacing: 0, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
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
        // Sits in the cream matting (top-right corner), off the photo, so no
        // dark glass backing is needed — a quiet gold outline that fills gold.
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 3,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        padding: 0,
        borderRadius: '50%',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        lineHeight: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden style={{ display: 'block', overflow: 'visible' }}>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={fav ? '#A0845C' : 'rgba(160,132,92,0)'}
          stroke={fav ? '#A0845C' : 'rgba(160,132,92,0.7)'}
          strokeWidth={1.6}
          strokeLinejoin="round"
          style={{ transition: 'fill 230ms var(--ease-apple), stroke 230ms var(--ease-apple)' }}
        />
      </svg>
    </span>
  )
}
