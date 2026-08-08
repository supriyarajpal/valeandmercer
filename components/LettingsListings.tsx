'use client'
import { useMemo } from 'react'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import ListingTile, { type ListingTileDetailPart } from '@/components/ListingTile'
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
/* Lettings card — the shared ListingTile with lettings data:          */
/* eyebrow = locality, title = property name, badge = "To Let", detail  */
/* = beds · baths · rent (rent in gold), plus the favourite heart.      */
/* ------------------------------------------------------------------ */

function PropertyCard({ property }: { property: Property }) {
  const bedLabel = property.beds === 0 ? 'Studio' : `${property.beds} bed${property.beds === 1 ? '' : 's'}`
  const bathLabel = `${property.baths} bath${property.baths === 1 ? '' : 's'}`
  const detail: ListingTileDetailPart[] = [
    { text: bedLabel },
    { text: bathLabel },
    { text: property.rent, gold: true },
  ]
  return (
    <ListingTile
      href={`/property/${property.slug}`}
      image={property.image}
      imageAlt={`${property.title}, ${property.area}`}
      badge={property.listingType}
      eyebrow={property.area}
      title={property.title}
      detail={detail}
      favourite={{ slug: property.slug, title: property.title }}
    />
  )
}
