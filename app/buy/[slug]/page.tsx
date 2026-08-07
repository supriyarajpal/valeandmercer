import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DevelopmentDetail from '@/components/DevelopmentDetail'
import type { DevelopmentCardData } from '@/components/DevelopmentsListing'
import { SUPPRESS_UNITMIX } from '@/lib/developmentDisplay'
import { developments, getAllDevelopmentSlugs, getDevelopmentBySlug } from '@/lib/developments'
import { getDevelopmentAssets, developmentHeroImage, developmentHasPhotos } from '@/lib/developmentAssets'

const SITE_URL = 'https://valeandmercer.co.uk'

// Pre-render all 11 development detail pages at build time.
export function generateStaticParams() {
  return getAllDevelopmentSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const dev = getDevelopmentBySlug(slug)
  if (!dev) return { title: 'Development not found' }

  const name = dev.name ?? slug
  const where = dev.locality ? ` in ${dev.locality}` : ''
  const desc = (dev.description || dev.headline || `New homes${where} from Vale and Mercer.`).slice(0, 180)
  const hero = developmentHeroImage(slug)

  return {
    title: `${name}${where ? ' · ' + dev.locality : ''} · New Homes`,
    description: desc,
    alternates: { canonical: `/buy/${slug}` },
    openGraph: {
      title: `${name} | Vale and Mercer`,
      description: desc,
      url: `${SITE_URL}/buy/${slug}`,
      type: 'website',
      images: [{ url: SITE_URL + hero, alt: name }],
    },
  }
}

// Up to two "similar" developments — prefer the same locality, then fill from
// the rest (excluding the current one), preserving the alphabetical order.
function similarFor(slug: string, locality?: string): DevelopmentCardData[] {
  const others = developments.filter(d => d.slug !== slug)
  const sameCity = locality ? others.filter(d => d.locality === locality) : []
  const rest = others.filter(d => !sameCity.includes(d))
  return [...sameCity, ...rest].slice(0, 2).map(d => ({
    slug: d.slug,
    name: d.name ?? d.slug,
    locality: d.locality,
    price: d.price,
    tenure: d.tenure,
    heroImage: developmentHeroImage(d.slug),
    hasPhotos: developmentHasPhotos(d.slug),
  }))
}

export default async function DevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dev = getDevelopmentBySlug(slug)
  if (!dev) notFound()

  const assets = getDevelopmentAssets(slug)
  const similar = similarFor(slug, dev.locality)

  // Fountain Court's unit split is disputed (see SUPPRESS_UNITMIX). Strip the
  // breakdown from the prop so the disputed figures aren't rendered OR shipped
  // in the client hydration payload; totalUnits ("70 apartments") still shows.
  // data.json is untouched — this only affects what this page hands to the UI.
  const safeDev = SUPPRESS_UNITMIX.has(slug) ? { ...dev, unitMix: undefined } : dev

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'New Homes in London', item: SITE_URL + '/buy' },
      { '@type': 'ListItem', position: 3, name: dev.name ?? slug, item: `${SITE_URL}/buy/${slug}` },
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
      <DevelopmentDetail development={safeDev} assets={assets} similar={similar} />
      <Footer />
    </>
  )
}
