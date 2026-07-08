'use client'
// Leaflet CSS must be imported at the page level, not inside the
// dynamically-loaded PropertyMap component. Next.js reliably links CSS
// from top-level page modules into the initial CSS bundle for that
// route; CSS imported from inside a `next/dynamic({ ssr: false })`
// component gets bundled but is not always linked into the parent
// page's <link> tags, which leaves Leaflet's tile pane un-styled — the
// tiles load as <img> tags with no position/size, so the map appears
// blank while markers (which use inline transforms) still work. Keep
// this import here, do not move it.
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { getLiveProperties, type Property } from '@/lib/properties'

// Leaflet only runs in the browser. Dynamic import with ssr:false keeps
// it out of the SSR pass and out of the initial JS bundle for anyone who
// never opens /rent. Lightweight cream placeholder while the map chunk
// loads so the page doesn't jump.
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: 'clamp(360px, 55vh, 560px)',
        borderRadius: 12,
        background: '#F2EFE9',
        border: '0.5px solid #DDD7CC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9A9188',
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

export default function RentPage() {
  const availableNow = getLiveProperties().filter(p => p.listingType === 'To Let')

  // Group by neighbourhood; sort groups alphabetically for a stable read.
  const groups = useMemo(() => {
    const map = new Map<string, Property[]>()
    for (const p of availableNow) {
      const key = neighbourhoodOf(p.area)
      const bucket = map.get(key)
      if (bucket) bucket.push(p)
      else map.set(key, [p])
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
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

  return (
    <>
      <Navbar />
      <main style={{ background: '#F2EFE9', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <div style={{ marginBottom: 56, maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>Rentals</p>
              <h1 style={{ color: '#4A4036', marginBottom: 22 }}>
                Rental properties <span style={{ color: '#A0845C', fontStyle: 'italic' }}>coming soon</span>
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', maxWidth: 540, marginBottom: 36 }}>
                We are building our lettings portfolio across prime London. Register your interest and we will be in touch as soon as something available matches what you need.
              </p>
              <ArrowButton href="/register" label="Register Your Interest" variant="dark" />
            </div>
          </Reveal>

          {/* Map + area-grouped grid — real active listings from lib/properties. */}
          {availableNow.length > 0 && (
            <section style={{ marginBottom: 96 }}>
              <Reveal y={20} amount={0.2}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
                  <div>
                    <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Available now</p>
                    <h2 style={{ color: '#4A4036' }}>
                      Currently on <span style={{ color: '#A0845C', fontStyle: 'italic' }}>the market</span>
                    </h2>
                  </div>
                  <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9A9188' }}>
                    {availableNow.length} {availableNow.length === 1 ? 'listing' : 'listings'}
                  </span>
                </div>
              </Reveal>

              <Reveal y={20} amount={0.1}>
                <div style={{ marginBottom: 48 }}>
                  <PropertyMap properties={availableNow} onMarkerFocus={handleMarkerFocus} />
                  <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9188', marginTop: 12 }}>
                    Marker locations are indicative to the street, not the door.
                  </p>
                </div>
              </Reveal>

              {groups.map(([area, list], groupIdx) => (
                <div key={area} style={{ marginBottom: groupIdx === groups.length - 1 ? 0 : 56 }}>
                  <Reveal y={16} amount={0.15}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                      <div style={{ width: 22, height: 1, background: '#A0845C', flexShrink: 0 }} />
                      <h3 style={{ fontSize: 22, color: '#4A4036', letterSpacing: '-0.01em' }}>
                        {area}
                      </h3>
                      <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#9A9188' }}>
                        {list.length} {list.length === 1 ? 'listing' : 'listings'}
                      </span>
                    </div>
                  </Reveal>

                  <Stagger
                    as="div"
                    stagger={0.08}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}
                  >
                    {list.map(prop => (
                      <StaggerItem key={prop.slug} as="div">
                        <PropertyCard property={prop} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              ))}
            </section>
          )}

          {/* Coming soon — original teaser cards, untouched. */}
          <Reveal y={16} amount={0.2}>
            <div style={{ marginBottom: 32 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Coming soon</p>
              <h2 style={{ color: '#4A4036' }}>
                Building the <span style={{ color: '#A0845C', fontStyle: 'italic' }}>next portfolio</span>
              </h2>
            </div>
          </Reveal>

          <Stagger as="div" stagger={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: '#C8C0B4' }}>
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
                    <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 11px', marginBottom: 18 }}>To Let</span>
                    <h3 style={{ fontSize: 24, color: '#F2EFE9', marginBottom: 10 }}>{item.area}</h3>
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
      </main>
      <Footer />

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
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Individual property card — dark ink surface, gold accents,         */
/* linking to /property/[slug]. Same visual language as coming-soon   */
/* cards but with the rent, area and bed/bath details filled in.      */
/* ------------------------------------------------------------------ */

function PropertyCard({ property }: { property: Property }) {
  const bedLabel = property.beds === 0 ? 'Studio' : `${property.beds} bed${property.beds === 1 ? '' : 's'}`
  return (
    <Link
      id={`property-${property.slug}`}
      href={`/property/${property.slug}`}
      className="card-lift"
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        background: '#34302B',
        minHeight: 400,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -20px rgba(52,48,43,0.18)',
      }}
      onMouseEnter={e => {
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        if (arrow) arrow.style.transform = 'translateX(6px)'
        if (img) img.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={e => {
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        if (arrow) arrow.style.transform = 'translateX(0)'
        if (img) img.style.transform = 'scale(1)'
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: 200, background: '#26221C' }}>
        <img
          src={property.image}
          alt={`${property.title}, ${property.area}`}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
        />
        <span aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(52,48,43,0) 40%, rgba(52,48,43,0.85) 100%)' }} />
        <span style={{ position: 'absolute', top: 16, left: 16, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '5px 11px' }}>
          {property.listingType}
        </span>
      </div>

      <div style={{ padding: '26px 28px 28px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(160,132,92,0.85)', marginBottom: 8 }}>
            {property.area}
          </p>
          <h3 style={{ fontSize: 22, color: '#F2EFE9', lineHeight: 1.2 }}>
            {property.title}
          </h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.55)' }}>
          <span>{bedLabel}</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>{property.baths} bath{property.baths === 1 ? '' : 's'}</span>
          {property.sqft != null && (<>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>{property.sqft} sq. ft.</span>
          </>)}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 20, borderTop: '0.5px solid rgba(242,239,233,0.15)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 300, color: '#F2EFE9', letterSpacing: '-0.01em' }}>
              {property.rent}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(242,239,233,0.5)' }}>
              {property.rentPW} · Available {property.available}
            </div>
          </div>
          <span data-arrow aria-hidden style={{ color: '#A0845C', fontSize: 14, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
        </div>
      </div>
    </Link>
  )
}
