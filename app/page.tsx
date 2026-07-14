import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TickerStrip from '@/components/TickerStrip'
import FeaturedProperties from '@/components/FeaturedProperties'
import StatsStrip from '@/components/StatsStrip'
import BuyingSection from '@/components/BuyingSection'
import ValuationStrip from '@/components/ValuationStrip'
import AboutStrip from '@/components/AboutStrip'
import BlogSection from '@/components/BlogSection'
import GetInTouch from '@/components/GetInTouch'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Vale and Mercer | London Residential Property Agency',
  description: 'London lettings, sales and valuations from Vale and Mercer, an independent London estate agency for lettings, new homes and student lets.',
  alternates: { canonical: '/' },
}

// WebSite schema exposes a SearchAction to Google's rich results / sitelinks
// searchbox. Only real facts — no invented values.
const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://valeandmercer.co.uk/#website',
  url: 'https://valeandmercer.co.uk',
  name: 'Vale and Mercer',
  publisher: { '@id': 'https://valeandmercer.co.uk/#organization' },
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <Navbar />
      <Hero />
      <TickerStrip />
      <FeaturedProperties />
      <StatsStrip />
      <BuyingSection />
      <ValuationStrip />
      <AboutStrip />
      <BlogSection />
      <GetInTouch />
      <Footer />
    </main>
  )
}
