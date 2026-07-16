'use client'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { getPropertyBySlug, type Property } from '@/lib/properties'

// The homepage showcase is a curated teaser, NOT the full inventory — three
// hand-picked live listings that then hand off to /let. Selected by explicit
// slug (independent of the lib `featured` flag) so the exact set and order are
// unambiguous. The FIRST entry is the large/flagship slot. An optional `image`
// overrides that card's hero photo on the HOMEPAGE ONLY — the property's own
// default image (first / living-room frame) is untouched everywhere else.
const FEATURED: { slug: string; image?: string }[] = [
  // Bywell Place uses its 8th photo (8.jpeg, a living-room shot) as the card
  // image here ONLY; its detail-page gallery, the /let card and every other
  // instance keep the default 1.jpeg lead, unaffected.
  { slug: 'bywell-place-1bed', image: '/images/bywell-place-1bed/8.jpeg' },
  { slug: 'marsh-wall-3bed-5958' },
  { slug: 'westferry-circus-4078' },
]

type FeaturedItem = { property: Property; image: string }
const featured: FeaturedItem[] = FEATURED
  .map(f => {
    const property = getPropertyBySlug(f.slug)
    return property ? { property, image: f.image ?? property.image } : null
  })
  .filter((x): x is FeaturedItem => x !== null)

// `area` is stored as `E14 · Millwall` (postcode district · neighbourhood).
// The neighbourhood segment is the italic-gold half of the resting card name.
function neighbourhoodOf(area: string): string {
  const parts = area.split('·').map(s => s.trim()).filter(Boolean)
  return parts[parts.length - 1] || area
}

// Bespoke, homepage-only "Available now" trio — a deliberately quiet,
// minimalist-luxury treatment that is NOT the /let card:
//   • Resting state shows only the photograph + the property name (regular
//     serif street name, italic-gold neighbourhood), nothing else.
//   • On hover a slim dark-glass panel glides up over the bottom of the image
//     (~400ms ease-out) revealing locality, beds/baths, price + arrow and
//     availability, while the image scales a touch (1.03) for depth.
//   • Asymmetric editorial layout: the first (flagship) card runs tall down
//     the left, the other two stack on the right — not a uniform 3-box grid.
// All hover/reveal motion is pure CSS (see the scoped <style>), with a
// (hover:none) fallback so touch devices show the panel and keyboard focus
// reveals it too.
export default function FeaturedProperties() {
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) 0' }}>
      <style>{`
        .vm-feat-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
        .vm-feat-card {
          position: relative; display: block; height: 460px;
          border-radius: var(--radius-lg); overflow: hidden;
          box-shadow: 0 1px 0 rgba(52,48,43,0.04), 0 30px 60px -28px rgba(40,35,28,0.5);
        }
        .vm-feat-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; will-change: transform;
          transition: transform 640ms var(--ease-out-soft);
        }
        .vm-feat-name {
          position: absolute; left: 28px; right: 28px; bottom: 26px; z-index: 2;
          font-family: var(--font-serif); font-weight: 300; line-height: 1.12;
          color: #F2EFE9; letter-spacing: -0.01em; font-size: clamp(19px, 2vw, 23px);
          text-shadow: 0 1px 16px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.55);
          transition: opacity 300ms ease, transform 420ms var(--ease-out-soft);
        }
        .vm-feat-name em { font-style: italic; color: #A0845C; }
        .vm-feat-panel {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 3;
          transform: translateY(100%);
          transition: transform 400ms var(--ease-out-soft);
          border-top-left-radius: 0; border-top-right-radius: 0;
        }
        .vm-feat-card:hover .vm-feat-img,
        .vm-feat-card:focus-visible .vm-feat-img { transform: scale(1.03); }
        .vm-feat-card:hover .vm-feat-name,
        .vm-feat-card:focus-visible .vm-feat-name { opacity: 0; transform: translateY(-8px); }
        .vm-feat-card:hover .vm-feat-panel,
        .vm-feat-card:focus-visible .vm-feat-panel { transform: translateY(0); }
        .vm-feat-name-lg { font-size: clamp(24px, 2.8vw, 34px); }

        @media (min-width: 860px) {
          .vm-feat-grid {
            grid-template-columns: 1.5fr 1fr;
            grid-template-rows: 326px 326px;
            gap: 44px;
          }
          .vm-feat-card { height: 100%; }
          .vm-feat-lg { grid-column: 1; grid-row: 1 / 3; }
        }
        /* Touch devices: no hover, so reveal the panel and hide the resting
           name by default rather than leaving details unreachable. */
        @media (hover: none) {
          .vm-feat-panel { transform: translateY(0); }
          .vm-feat-name { opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 var(--gutter)' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 52 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Curated for you</p>
              <h2 style={{ color: 'var(--text)' }}>
                Available <span style={{ color: '#A0845C', fontStyle: 'italic' }}>now</span>
              </h2>
            </div>
            <Link href="/let" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C', whiteSpace: 'nowrap' }}>
              All Lettings <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.12}>
          <div className="vm-feat-grid">
            {featured.map((item, i) => (
              <FeaturedCard key={item.property.slug} property={item.property} image={item.image} large={i === 0} />
            ))}
          </div>
        </Reveal>

        <Reveal y={20} amount={0.3}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
            <Link href="/let" className="link-underline" style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A0845C' }}>
              View all listings <span aria-hidden style={{ marginLeft: 8 }}>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Bespoke featured card — photo + name at rest, glass panel on hover. */
/* ------------------------------------------------------------------ */

function FeaturedCard({ property, image, large }: { property: Property; image: string; large?: boolean }) {
  const bedLabel = property.beds === 0 ? 'Studio' : `${property.beds} bed${property.beds === 1 ? '' : 's'}`
  return (
    <Link
      href={`/property/${property.slug}`}
      className={`vm-feat-card card-lift${large ? ' vm-feat-lg' : ''}`}
      aria-label={`${property.title}, ${property.area}`}
    >
      <img className="vm-feat-img" src={image} alt={`${property.title}, ${property.area}`} loading="lazy" />

      {/* Minimal bottom-only scrim — just enough for the resting name to read,
          not the heavy double vignette used elsewhere. */}
      <span aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(20,17,14,0.5) 0%, rgba(20,17,14,0.12) 28%, transparent 52%)' }} />

      {/* Resting state: property name only. */}
      <h3 className={`vm-feat-name${large ? ' vm-feat-name-lg' : ''}`}>
        {property.title} <em>{neighbourhoodOf(property.area)}</em>
      </h3>

      {/* Hover state: slim dark-glass panel slides up over the bottom. */}
      <div className="vm-feat-panel glass-strong" style={{ padding: '18px 22px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(160,132,92,0.95)' }}>
            {property.area}
          </span>
          <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.62)' }}>
            {bedLabel} · {property.baths} bath{property.baths === 1 ? '' : 's'}{property.sqft != null ? ` · ${property.sqft} sq. ft.` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingTop: 12, borderTop: '0.5px solid rgba(242,239,233,0.16)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, color: '#F2EFE9', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              {property.rent}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(242,239,233,0.55)', marginTop: 3 }}>
              {property.rentPW} · Available {property.available}
            </div>
          </div>
          <span aria-hidden style={{ color: '#A0845C', fontSize: 15, lineHeight: 1, paddingBottom: 2 }}>→</span>
        </div>
      </div>
    </Link>
  )
}
