import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/guide-to-buying-in-chelsea'
const IMAGE = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85'
const DATE_PUBLISHED = '2025-04-01'
const TITLE = 'Guide to Buying a Home in Chelsea SW3'
const DESC = 'A Vale and Mercer guide to buying a home in Chelsea SW3 — what to expect, where to look, pricing, leases, and the streets worth knowing.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: SLUG },
  openGraph: {
    type: 'article',
    title: TITLE + ' | Vale and Mercer',
    description: DESC,
    url: SLUG,
    images: [IMAGE],
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + SLUG },
  headline: TITLE,
  description: DESC,
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
    { '@type': 'ListItem', position: 3, name: TITLE, item: SITE_URL + SLUG },
  ],
}

const sections = [
  { h: 'Why Chelsea?', p: 'Chelsea is one of those London postcodes that genuinely delivers on its reputation. The streets around the King\'s Road, the garden squares of SW3, the quiet of Cheyne Walk. It is a neighbourhood that rewards the effort of finding the right property there.' },
  { h: 'What you need to know about pricing', p: 'Chelsea pricing is wide. A garden flat on a residential street and a lateral apartment on Sloane Square can both carry the Chelsea postcode and be separated by millions of pounds. The key is understanding which pockets offer the best long-term value and which ones are trading on name alone.' },
  { h: 'The streets worth knowing', p: 'Carlyle Square, Paultons Square, and Cheyne Walk consistently perform well. The area south of the King\'s Road towards the Embankment tends to hold value better than the north, which borders on the more variable Worlds End.' },
  { h: 'What to watch out for', p: 'Leasehold properties dominate Chelsea. Always check the remaining lease length before you fall in love with a property. Anything under 80 years will affect your mortgage options and resale value significantly.' },
  { h: 'Our advice', p: 'Chelsea rewards patience. The best properties here rarely sit for long, but rushing into the wrong one because you felt pressure to move is a mistake that takes years to correct. Come and speak to us before you start viewing. It will save you time.' },
]

export default function BlogPost2() {
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
        category="Buying Guide"
        title="Your complete guide to buying in Chelsea SW3"
        meta="April 2025  ·  6 min read"
        image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85"
        imageAlt="Chelsea SW3 residential street"
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  April 2025"
      />
      <Footer />
    </>
  )
}
