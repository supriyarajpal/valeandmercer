'use client'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import PropertyShowcase from '@/components/PropertyShowcase'
import { properties } from '@/lib/properties'

export type Listing = {
  // 'cta' is the terminal "view all listings" card (see below); every
  // other card is a real property. Optional so existing property rows
  // don't need to set it.
  variant?: 'property' | 'cta'
  label: string
  area: string
  desc: string
  image?: string       // omitted on the CTA card (no photo)
  href: string
  meta?: string        // small line above CTA — e.g. "£4,050pcm · 2 beds"
  ctaLabel?: string    // "Register Interest" for coming-soon, "View Property" for live
}

// The homepage showcase is a curated teaser, NOT the full inventory: it
// shows the first few live, photo-backed `featured` records and then hands
// off to /let, where every live listing is browsable. Kept to 3 so the
// pinned scroll stays short and each card gets real focus time; the full
// count lives on /let (and the StatsStrip "Live Listings" figure, which
// still reflects the true total from lib/properties.ts).
const HOMEPAGE_FEATURED_COUNT = 3

// Live rentals with real photography flagged featured:true in lib/properties.
// Only live records (status === 'live') with `featured: true` are eligible;
// we then take the first HOMEPAGE_FEATURED_COUNT (their source order gives a
// natural spread of bed counts and buildings rather than near-duplicates).
const featured: Listing[] = properties
  .filter(p => p.status === 'live' && p.featured)
  .slice(0, HOMEPAGE_FEATURED_COUNT)
  .map(p => {
    const beds = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds === 1 ? '' : 's'}`
    return {
      variant: 'property' as const,
      label: p.listingType,
      area: `${p.title} · ${p.area}`,
      desc: p.teaser ?? p.description,
      image: p.image,
      href: `/property/${p.slug}`,
      meta: `${p.rent} · ${beds} · Available ${p.available}`,
      ctaLabel: 'View Property',
    }
  })

// Terminal card in the scroll sequence — a clear hand-off to the full
// lettings grid. Rendered as its own step (its own dot, its own centred
// resting position) after the last featured card.
const viewAllCard: Listing = {
  variant: 'cta',
  label: '',
  area: 'View all listings',
  desc: 'See every available home across London — full details, photography and floor plans.',
  href: '/let',
  ctaLabel: 'View all listings',
}

const listings: Listing[] = [...featured, viewAllCard]

// Scroll-pinned horizontal reveal (components/PropertyShowcase.tsx) —
// same listings/copy as before, replacing the static grid. Falls back to
// a native horizontal swipe row on mobile / prefers-reduced-motion.
export default function FeaturedProperties() {
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-y) 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
        <Reveal y={28} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Our Listings</p>
              <h2 style={{ color: 'var(--text)' }}>
                Available <span style={{ color: '#A0845C', fontStyle: 'italic' }}>now</span>
              </h2>
            </div>
            <Link href="/let" className="link-underline" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C', whiteSpace: 'nowrap' }}>
              All Lettings <span aria-hidden style={{ marginLeft: 6 }}>→</span>
            </Link>
          </div>
        </Reveal>
      </div>

      <PropertyShowcase listings={listings} />
    </section>
  )
}
