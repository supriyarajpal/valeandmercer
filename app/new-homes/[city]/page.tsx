import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CityLanding from '@/components/CityLanding'
import { CITY_PAGES, getCityBySlug } from '@/lib/cityPages'
import { buildCityLanding } from '@/lib/cityLanding'

const SITE_URL = 'https://valeandmercer.co.uk'

export function generateStaticParams() {
  return CITY_PAGES.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return { title: 'New Homes' }

  const title = `New Homes in ${city.name}`
  const data = buildCityLanding(slug, city.name)
  const hero = data.hero ? `${data.hero.base}-1920.webp` : undefined

  return {
    title,
    alternates: { canonical: `/new-homes/${slug}` },
    openGraph: {
      title: `${title} | Vale and Mercer`,
      url: `${SITE_URL}/new-homes/${slug}`,
      type: 'website',
      ...(hero ? { images: [{ url: SITE_URL + hero, alt: title }] } : {}),
    },
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const data = buildCityLanding(slug, city.name)

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'New Homes', item: SITE_URL + '/buy' },
      { '@type': 'ListItem', position: 3, name: `New Homes in ${city.name}`, item: `${SITE_URL}/new-homes/${slug}` },
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
      <CityLanding data={data} />
      <Footer />
    </>
  )
}
