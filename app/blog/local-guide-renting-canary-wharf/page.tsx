import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/local-guide-renting-canary-wharf'
// Unsplash Canary Wharf skyline with river and bridge. Unsplash License
// allows free commercial use with no attribution required.
const IMAGE = 'https://images.unsplash.com/photo-1664624447750-39756899f4a7?w=1400&q=85'
const IMAGE_ALT = 'Canary Wharf towers seen across the River Thames'
const DATE_PUBLISHED = '2026-07-08'
const TITLE       = "A Local's Guide to Renting in Canary Wharf"
const DESCRIPTION = 'Vale and Mercer on renting in Canary Wharf. Transport, resident profile, what is nearby, and the kind of buildings the area is known for. A grounded read before you book viewings.'

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
    h: 'What the area actually feels like',
    p: 'Canary Wharf reads differently once you live here. The daytime rhythm is professional and quick, then in the evenings the estate empties and the surrounding neighbourhoods of Cubitt Town, Millwall, and the Isle of Dogs quiet down along the water. Most of what you need is within a fifteen minute walk. The best way to picture it is as a small, well run city inside a bigger city, with the Thames on three sides.',
  },
  {
    h: 'Transport, and why it matters here',
    p: 'Canary Wharf is one of the best connected pockets of London. The Elizabeth Line gets you to Bond Street in around thirteen minutes and to Paddington in around seventeen. The Jubilee Line covers Waterloo, Westminster, and London Bridge quickly. The DLR handles the shorter local hops to Bank, Stratford, or across to Greenwich. If you commute into the City or the West End, the daily journey is one of the reasons people move here in the first place.',
  },
  {
    h: 'Who tends to live here',
    p: 'The typical Canary Wharf resident is a working professional, often in finance, law, tech, or media. There is a strong corporate lettings market, so many buildings are used to serving relocations and short cycles. It also suits couples and small families who want a modern flat with amenities on their doorstep. Students at the nearby colleges take smaller studios or shares. It is not a village atmosphere. It is a very high functioning weekday neighbourhood with a genuinely calm weekend feel.',
  },
  {
    h: 'What is nearby',
    p: 'The rooftop garden at Crossrail Place is a small treat that most first time visitors miss. The riverside walks north along the Isle of Dogs and south into Greenwich give you real weekend distance without needing to leave the postcode. The main shopping centre covers the day to day and there is a proper cluster of restaurants and bars around Cabot Square, Reuters Plaza, and the newer developments to the south. Weekend markets appear at Canada Water, Greenwich, and Wapping if you want a change of pace.',
  },
  {
    h: 'The buildings themselves',
    p: 'Almost everything to rent in Canary Wharf and around the Isle of Dogs sits inside a newer high rise. Expect concierge, a residents lounge, a gym, and usually a pool. Many of the taller buildings have a sky garden or a rooftop terrace. Lifts are fast, insulation is good, and windows are large. The trade off is that you pay for these amenities inside the asking rent, so it is worth being clear about which of them you would actually use before you commit. A twenty fourth floor view is lovely. So is a lower floor closer to the ground with a shorter lift wait.',
  },
  {
    h: 'What to check on a viewing',
    p: 'Ask which direction the flat faces and when the sunlight arrives, since some blocks are close enough together to shadow each other. Ask about noise from the estate and from any nearby construction. Confirm what is included in the rent and what sits with the resident. Check whether the building allows pets, if you have one. If parking matters, confirm it explicitly, because in most newer buildings it does not come as standard. None of this is unusual to ask. It is simply the difference between the flat that looks right and the flat that lives right.',
  },
  {
    h: 'How we can help',
    p: 'Most of the properties we currently have to let are in and around Canary Wharf, and our team knows the buildings well. If you would like to talk through what suits you before you start viewings, register your interest with a short brief of what you need. We will only bring you a shortlist that fits.',
  },
]

export default function CanaryWharfGuidePost() {
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
        category="Area Guide"
        title="A local's guide to renting in Canary Wharf"
        meta="July 2026  ·  5 min read"
        image={IMAGE}
        imageAlt={IMAGE_ALT}
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  July 2026"
      />
      <Footer />
    </>
  )
}
