import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/london-property-market-2025'
const IMAGE = 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1400&q=85'
const DATE_PUBLISHED = '2026-05-01'

export const metadata: Metadata = {
  title: 'The London Property Market in 2026',
  description: 'Vale and Mercer on the London property market in 2026. Supply is up, rates have settled, and buyers are moving again across prime London.',
  alternates: { canonical: SLUG },
  openGraph: {
    type: 'article',
    title: 'The London Property Market in 2026 | Vale and Mercer',
    description: 'Vale and Mercer on the London property market in 2026. Supply is up, rates have settled, and buyers are moving again across prime London.',
    url: SLUG,
    images: [IMAGE],
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + SLUG },
  headline: 'The London Property Market in 2026',
  description: 'Vale and Mercer on the London property market in 2026. Supply is up, rates have settled, and buyers are moving again across prime London.',
  image: IMAGE,
  datePublished: DATE_PUBLISHED,
  author: { '@type': 'Organization', name: 'Vale and Mercer', url: SITE_URL },
  publisher: { '@id': SITE_URL + '/#organization' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'London Property Journal', item: SITE_URL + '/blog' },
    { '@type': 'ListItem', position: 3, name: 'The London Property Market in 2026', item: SITE_URL + SLUG },
  ],
}

const sections = [
  { h: 'Supply is up. Buyers are back.', p: 'After a difficult couple of years, the London property market is showing signs of real recovery. Interest rates have begun to stabilise, mortgage products are more competitive than they were twelve months ago, and we are seeing more serious buyers coming back to the market.' },
  { h: 'What this means for sellers', p: 'If you have been holding off selling because the market felt uncertain, 2026 may be the year to move. We are seeing well-priced properties in Chelsea, Notting Hill, and Fulham selling quickly when they are presented properly and priced honestly. Overpricing is still the single biggest mistake sellers make.' },
  { h: 'What this means for buyers', p: 'The window of relative affordability may not last. With more buyers returning, competition for well-located properties is increasing. If you have been watching the market and waiting, now is a reasonable time to have a conversation with an agent you trust.' },
  { h: 'Our honest read', p: 'London property has always rewarded long-term thinking. The people who struggle are those who try to time the market perfectly. The people who do well are those who buy the right property, in the right location, at a fair price, and hold it.' },
]

export default function BlogPost1() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <ArticleLayout
        category="Market Insight"
        title="The London property market in 2026"
        meta="May 2026  ·  4 min read"
        image="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1400&q=85"
        imageAlt="London skyline from the South Bank"
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  May 2026"
      />
      <Footer />
    </>
  )
}
