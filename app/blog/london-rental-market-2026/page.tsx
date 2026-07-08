import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/london-rental-market-2026'
// Unsplash London city-at-dawn skyline. Unsplash License allows free
// commercial use with no attribution required.
const IMAGE = 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=1400&q=85'
const IMAGE_ALT = 'London city skyline at dawn'
const DATE_PUBLISHED = '2026-07-08'
const TITLE       = "London's Rental Market in 2026: What's Actually Happening to Rents"
const DESCRIPTION = "A calm, data-led look at London rents in mid-2026. UK average rent, London growth compared with other regions, supply, and time-to-let. Practical context from Vale and Mercer for anyone searching now."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    type: 'article',
    title: TITLE + ' | Vale and Mercer',
    description: DESCRIPTION,
    url: SLUG,
    images: [IMAGE],
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + SLUG },
  headline: TITLE,
  description: DESCRIPTION,
  image: IMAGE,
  datePublished: DATE_PUBLISHED,
  author: { '@type': 'Organization', name: 'Vale and Mercer', url: SITE_URL },
  publisher: { '@id': SITE_URL + '/#organization' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',                    item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'London Property Journal', item: SITE_URL + '/blog' },
    { '@type': 'ListItem', position: 3, name: TITLE,                     item: SITE_URL + SLUG },
  ],
}

const sections = [
  {
    h: 'The London rental market is calmer than the headlines suggest',
    p: 'If you have only read the headlines, you might think London rents are still running away. The current data tells a more measured story. Rents are still rising, but slowly, and much of the tightness that defined 2022 and 2023 has eased. Here is what the numbers actually show and what they mean if you are searching now.',
  },
  {
    h: 'The current numbers',
    p: 'The average rent for a new UK let is 1,321 pounds a month as of June 2026, according to Zoopla, up 2.1 percent on the same time last year. London’s average sits much higher at 2,273 pounds a month according to ONS data from earlier in the year, but the pace of London rent growth is now among the lowest of any UK region.',
  },
  {
    h: 'London growth is unusually mild right now',
    p: 'According to ONS and Zoopla figures, London rental inflation is running at around 1.7 to 2.2 percent annually. Compared with the double-digit growth seen at the peak of 2022 to 2023, this is a very different market. For anyone who paused a move because prices felt out of control, that pressure has largely eased.',
  },
  {
    h: 'More stock, more choice',
    p: 'Rental supply across the UK is still below pre-pandemic levels, but London specifically has been improving. There are more homes on the market at any given time than there were twelve months ago. In practical terms, that means renters can compare a shortlist rather than commit to the first flat they view. Well-priced homes still let quickly, but the era of viewing at nine in the morning and offering by lunchtime is no longer universal.',
  },
  {
    h: 'A little more time to decide',
    p: 'Average time-to-let in London is now hovering around twenty to thirty days, depending on the postcode and the property. That is longer than the frantic turnover of the recent past. For tenants, it means you can take a viewing, sleep on it, and often still find the flat available. For landlords, it is a reminder that pricing well and presenting the property well both matter more than they did at peak demand.',
  },
  {
    h: 'London is still London',
    p: 'None of this means London is cheap. The average rent is still the highest in the UK by a comfortable margin, and prime postcodes remain competitive. What has changed is the shape of the market. There is less bidding, less panic, and more room for informed decisions on both sides.',
  },
  {
    h: 'A practical read',
    p: 'If you have been waiting for a better moment to move, this is a calmer market than the one your friends may have described from 2022. If you are letting a property, honest pricing and a well-presented home are the two things that matter most. Talk to a good local agent about what your specific street is doing rather than the aggregate. That is the only useful number.',
  },
]

export default function LondonRentalMarketPost() {
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
        title="London's rental market in 2026: what's actually happening to rents"
        meta="July 2026  ·  6 min read"
        image={IMAGE}
        imageAlt={IMAGE_ALT}
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  July 2026"
      />
      <Footer />
    </>
  )
}
