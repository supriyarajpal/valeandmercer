'use client'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import PropertyShowcase from '@/components/PropertyShowcase'
import { properties } from '@/lib/properties'

export type Listing = {
  label: string
  area: string
  desc: string
  image: string
  href: string
  meta?: string        // small line above CTA — e.g. "£4,050pcm · 2 beds"
  ctaLabel?: string    // "Register Interest" for coming-soon, "View Property" for live
}

// Live rentals with real photography flagged featured:true in lib/properties.
// Only live records (status === 'live') with `featured: true` appear here.
const listings: Listing[] = properties
  .filter(p => p.status === 'live' && p.featured)
  .map(p => {
    const beds = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds === 1 ? '' : 's'}`
    return {
      label: p.listingType,
      area: `${p.title} · ${p.area}`,
      desc: p.teaser ?? p.description,
      image: p.image,
      href: `/property/${p.slug}`,
      meta: `${p.rent} · ${beds} · Available ${p.available}`,
      ctaLabel: 'View Property',
    }
  })

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
