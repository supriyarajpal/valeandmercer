import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArrowButton from '@/components/ArrowButton'
import { Reveal } from '@/components/Reveal'
import BuyCityCards from '@/components/BuyCityCards'
import DevelopmentsListing, { type DevelopmentCardData } from '@/components/DevelopmentsListing'
import { developments } from '@/lib/developments'
import { getDevelopmentAssets, developmentHeroImage, developmentHasPhotos } from '@/lib/developmentAssets'
import { developmentIsPublished, developmentHeading, developmentUnitTypes } from '@/lib/developmentTitle'
import { developmentHasCityPage } from '@/lib/cityLanding'

// /buy: the New Homes listing. The page leads with a wide gateway card per city
// that has a /new-homes page (BuyCityCards), then lists every OTHER published
// development under an "Elsewhere in the UK" heading in the shared ListingTile
// grid. A development whose city has a page is shown on that city page, not
// here, so nothing is listed twice. Server Component: reads the build-time
// development data (lib/developments.ts is filesystem-backed / server-only) and
// hands plain, serialisable card data to the client grid.

export default function BuyPage() {
  // Every published development gets a card, EXCEPT those whose city has its own
  // /new-homes page: those move onto that city page (see lib/cityLanding.ts) so
  // they are not listed twice. A development whose city has no page keeps its
  // card here. The heading is its editorial displayName, else its street + city,
  // else its own name; only a nameless, addressless stub is excluded (and its
  // detail route is likewise not generated).
  const cards: DevelopmentCardData[] = developments
    .filter(developmentIsPublished)
    .filter(dev => !developmentHasCityPage(dev))
    .map(dev => {
      const base = getDevelopmentAssets(dev.slug)
      const gallery = dev.gallery && dev.gallery.length > 0 ? dev.gallery : base.images
      return {
        slug: dev.slug,
        title: developmentHeading(dev),
        unitSummary: developmentUnitTypes(dev) ?? undefined,
        price: dev.price,
        // Prefer a published data.json gallery; fall back to the asset manifest.
        heroImage: gallery[0] ?? developmentHeroImage(dev.slug),
        hasPhotos: gallery.length > 0 || developmentHasPhotos(dev.slug),
        images: gallery,
      }
    })

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--surface)', paddingTop: 160, paddingBottom: 'var(--section-y)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Reveal y={28} amount={0.2}>
            <div style={{ marginBottom: 8, maxWidth: 720 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 16 }}>New Homes</p>
              <h1 style={{ color: 'var(--text)', marginBottom: 22 }}>
                New homes <span style={{ color: '#A0845C', fontStyle: 'italic' }}>across the UK</span>
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.95, color: 'var(--text-muted)', maxWidth: 560, marginBottom: 36 }}>
                A curated selection of new-build developments. Register your interest and we&rsquo;ll keep you ahead of each release, with pricing, availability and floor plans as they land.
              </p>
              <ArrowButton href="/register" label="Register Your Interest" variant="dark" />
            </div>
          </Reveal>

          {/* Gateway cards: one per city that has a /new-homes page. */}
          <BuyCityCards />

          {/* The remaining developments (cities without a page). Heading and grid
              are omitted entirely when there are none. */}
          {cards.length > 0 && (
            <Reveal y={24} amount={0.2}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.08, color: 'var(--text)', margin: 'clamp(56px, 8vw, 96px) 0 0' }}>
                Elsewhere <span style={{ color: '#A0845C', fontStyle: 'italic' }}>in the UK</span>
              </h2>
            </Reveal>
          )}
        </div>

        {cards.length > 0 && <DevelopmentsListing developments={cards} />}
      </main>
      <Footer />
    </>
  )
}
