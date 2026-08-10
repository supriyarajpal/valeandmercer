'use client'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import ListingTile, { type ListingTileDetailPart } from '@/components/ListingTile'

// New-homes listing grid on /buy. One card per development, using the shared
// ListingTile ("Design C") — the same treatment as the lettings cards, with
// buy-specific data: title = the development heading (editorial displayName, else
// street address + city, else the development's own name; never the developer
// name), badge = "New Homes", detail = unit types + price (or "Register your
// interest" where no price is stated), and no favourite heart.

export type DevelopmentCardData = {
  slug: string
  /** Card heading — displayName, else street + city, else the development name. */
  title: string
  /** Unit-type phrase, e.g. "1–3 bed apartments"; omitted when not stated. */
  unitSummary?: string
  /** Price figure, or "Register your interest" / undefined where none is stated. */
  price?: string
  heroImage: string
  hasPhotos: boolean
}

export function DevelopmentCard({ dev }: { dev: DevelopmentCardData }) {
  const hasPrice = !!dev.price && dev.price.trim() !== 'Register your interest'
  // Detail line: unit types (if stated) then price — or "Register your interest"
  // when no figure is stated. Empty parts are dropped by ListingTile.
  const detail: ListingTileDetailPart[] = []
  if (dev.unitSummary) detail.push({ text: dev.unitSummary })
  detail.push({ text: hasPrice ? dev.price! : 'Register your interest', gold: true })

  return (
    <ListingTile
      href={`/buy/${dev.slug}`}
      image={dev.heroImage}
      imageAlt={dev.hasPhotos ? dev.title : ''}
      badge="New Homes"
      title={dev.title}
      detail={detail}
    />
  )
}

export default function DevelopmentsListing({ developments }: { developments: DevelopmentCardData[] }) {
  if (developments.length === 0) return null
  return (
    <section style={{ background: 'var(--surface)', padding: '20px var(--gutter) 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal y={16} amount={0.2}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
              {developments.length} {developments.length === 1 ? 'development' : 'developments'}
            </span>
          </div>
        </Reveal>

        <Stagger as="div" stagger={0.08} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '48px 36px', alignItems: 'start' }}>
          {developments.map(dev => (
            <StaggerItem key={dev.slug} as="div">
              <DevelopmentCard dev={dev} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
