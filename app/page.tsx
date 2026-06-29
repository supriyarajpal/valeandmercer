import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TickerStrip from '@/components/TickerStrip'
import FeaturedProperties from '@/components/FeaturedProperties'
import BuyingSection from '@/components/BuyingSection'
import ValuationStrip from '@/components/ValuationStrip'
import AboutStrip from '@/components/AboutStrip'
import BlogSection from '@/components/BlogSection'
import GetInTouch from '@/components/GetInTouch'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Vale and Mercer | London Residential Property Agency',
  description: 'Lettings, new homes and student lets across London. Personal service, honest valuations, properties handled with care.',
  alternates: { canonical: '/' },
}

// schema.org RealEstateAgent — uses only facts already present in the
// codebase (Footer + complaints/fees pages). Do not add ratings, review
// counts, or anything not already published.
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Vale and Mercer Ltd',
  url: 'https://valeandmercer.co.uk',
  email: 'info@valeandmercer.co.uk',
  description: 'London residential property agency offering lettings, new homes, and student lets.',
  areaServed: { '@type': 'City', name: 'London' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '124 City Road',
    addressLocality: 'London',
    postalCode: 'EC1V 2NX',
    addressCountry: 'GB',
  },
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'CompanyNumber', value: '17212434' },
    { '@type': 'PropertyValue', propertyID: 'ICO', value: 'ZC155397' },
    { '@type': 'PropertyValue', propertyID: 'PropertyRedressScheme', value: 'PRS058796' },
  ],
  memberOf: { '@type': 'Organization', name: 'Property Redress Scheme', url: 'https://www.propertyredress.co.uk' },
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Navbar />
      <Hero />
      <TickerStrip />
      <FeaturedProperties />
      <BuyingSection />
      <ValuationStrip />
      <AboutStrip />
      <BlogSection />
      <GetInTouch />
      <Footer />
    </main>
  )
}
