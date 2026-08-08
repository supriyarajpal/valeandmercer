import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DevelopmentDetail from '@/components/DevelopmentDetail'
import type { DevelopmentCardData } from '@/components/DevelopmentsListing'
import { SUPPRESS_UNITMIX } from '@/lib/developmentDisplay'
import { developments, getDevelopmentBySlug } from '@/lib/developments'
import { getDevelopmentAssets, developmentHeroImage, developmentHasPhotos } from '@/lib/developmentAssets'
import { developmentHasAddress, developmentTitle, developmentAddressLine, developmentUnitTypes } from '@/lib/developmentTitle'

const SITE_URL = 'https://valeandmercer.co.uk'

// Pre-render a detail page for every development that HAS an address. Developments
// with no address get no page (and no card) — their titles can't be built.
export function generateStaticParams() {
  return developments.filter(developmentHasAddress).map(d => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const dev = getDevelopmentBySlug(slug)
  if (!dev || !developmentHasAddress(dev)) return { title: 'Development not found' }

  const title = developmentTitle(dev)!
  const where = dev.locality ? ` in ${dev.locality}` : ''
  const desc = (dev.description || dev.headline || `New homes${where} from Vale and Mercer.`).slice(0, 180)
  const hero = developmentHeroImage(slug)

  return {
    title: `${title} · New Homes`,
    description: desc,
    alternates: { canonical: `/buy/${slug}` },
    openGraph: {
      title: `${title} | Vale and Mercer`,
      description: desc,
      url: `${SITE_URL}/buy/${slug}`,
      type: 'website',
      images: [{ url: SITE_URL + hero, alt: title }],
    },
  }
}

// Up to two "similar" developments (addressed only) — prefer the same locality,
// then fill from the rest, preserving order.
function similarFor(slug: string, locality?: string): DevelopmentCardData[] {
  const others = developments.filter(d => d.slug !== slug && developmentHasAddress(d))
  const sameCity = locality ? others.filter(d => d.locality === locality) : []
  const rest = others.filter(d => !sameCity.includes(d))
  return [...sameCity, ...rest].slice(0, 2).map(d => ({
    slug: d.slug,
    addressLine: developmentAddressLine(d)!,
    unitSummary: developmentUnitTypes(d) ?? undefined,
    price: d.price,
    heroImage: developmentHeroImage(d.slug),
    hasPhotos: developmentHasPhotos(d.slug),
  }))
}

export default async function DevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dev = getDevelopmentBySlug(slug)
  // No address → no page (matches the exclusion from the listing grid).
  if (!dev || !developmentHasAddress(dev)) notFound()

  const title = developmentTitle(dev)!
  // Brochure download was removed site-wide. The path stays recorded in the
  // asset manifest for internal reference, but is stripped here so it is neither
  // rendered nor shipped in the client hydration payload.
  const assets = { ...getDevelopmentAssets(slug), brochure: null }
  const similar = similarFor(slug, dev.locality)

  // Build the prop handed to the client, stripping fields that must not appear
  // in the output (data.json itself is untouched):
  //   • `developer` — not rendered anywhere on /buy (per spec), so it's also
  //     kept out of the client hydration payload.
  //   • `unitMix` for Fountain Court — its per-type split is disputed
  //     (SUPPRESS_UNITMIX); only the headline totalUnits ("70 apartments") shows.
  const safeDev = {
    ...dev,
    developer: undefined,
    ...(SUPPRESS_UNITMIX.has(slug) ? { unitMix: undefined } : {}),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'New Homes in London', item: SITE_URL + '/buy' },
      { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}/buy/${slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <DevelopmentDetail development={safeDev} title={title} assets={assets} similar={similar} />
      <Footer />
    </>
  )
}
