import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArrowButton from '@/components/ArrowButton'
import { Reveal } from '@/components/Reveal'
import DevelopmentsListing, { type DevelopmentCardData } from '@/components/DevelopmentsListing'
import { developments } from '@/lib/developments'
import { developmentHeroImage, developmentHasPhotos } from '@/lib/developmentAssets'
import { developmentIsPublished, developmentHeading, developmentUnitTypes } from '@/lib/developmentTitle'

// /buy — the New Homes listing. The old "Properties coming soon" teaser block
// (Canary Wharf / Notting Hill / Chelsea) was removed per instruction; the
// developments grid is now the page. Server Component: reads the build-time
// development data (lib/developments.ts is filesystem-backed / server-only) and
// hands plain, serialisable card data to the client grid.

export default function BuyPage() {
  // Every published development gets a card. The heading is its editorial
  // displayName, else its street + city, else its own name; only a nameless,
  // addressless stub is excluded (and its detail route is likewise not generated).
  const cards: DevelopmentCardData[] = developments
    .filter(developmentIsPublished)
    .map(dev => ({
      slug: dev.slug,
      title: developmentHeading(dev),
      unitSummary: developmentUnitTypes(dev) ?? undefined,
      price: dev.price,
      // Prefer a published data.json gallery; fall back to the asset manifest.
      heroImage: dev.gallery?.[0] ?? developmentHeroImage(dev.slug),
      hasPhotos: (dev.gallery?.length ?? 0) > 0 || developmentHasPhotos(dev.slug),
    }))

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
        </div>

        <DevelopmentsListing developments={cards} />
      </main>
      <Footer />
    </>
  )
}
