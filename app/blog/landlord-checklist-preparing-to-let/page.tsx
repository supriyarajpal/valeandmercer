import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/landlord-checklist-preparing-to-let'
// Unsplash contemporary well-staged lounge. Unsplash License allows free
// commercial use with no attribution required.
const IMAGE = 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=1400&q=85'
const IMAGE_ALT = 'A well-staged residential lounge ready for viewings'
const DATE_PUBLISHED = '2026-07-08'
const TITLE       = "Getting Your Property Ready to Let: A Landlord's Checklist"
const DESCRIPTION = 'A practical landlord checklist from Vale and Mercer. Photography, staging, compliance paperwork, pricing, and what a good letting agent should be doing on your behalf before your property goes to market.'

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
    h: 'Start with the boring bit: compliance',
    p: 'Before a single viewing is booked, four pieces of paperwork should be sitting in a folder. A valid EPC. A valid gas safety certificate if the property has gas. A valid electrical safety report, which is now mandatory for most tenancies. And a deposit protection scheme registration to use once a tenant moves in. None of this is optional and none of it is expensive relative to the risk of letting a property without it. A good agent will confirm you have everything current on day one and flag anything that is close to expiring.',
  },
  {
    h: 'Photography is the single highest return you will get',
    p: 'The photographs of your property are the first thing every prospective tenant sees, and they decide, in under two seconds, whether to click through or scroll past. A professional shoot with proper lighting will typically cost less than one week of a vacant month, and it will save you far more than that in reduced void time and better applicants. If you take away one line from this piece, take this one. Do not use phone photos to market a rental.',
  },
  {
    h: 'Declutter, then stage lightly',
    p: 'A rental should feel spacious, well maintained, and easy to imagine yourself in. That means clearing personal items, small appliances off the kitchen counter, and anything that reads as clutter. A few tasteful touches such as fresh linens on the bed, a plant in the living room, and clean towels in the bathroom go a long way. Do not over stage. Renters can tell the difference between a home that has been prepared and a set that has been dressed. The former sells the property. The latter feels manipulative.',
  },
  {
    h: 'Small repairs, small paint',
    p: 'Fix the door that sticks, the tap that drips, the socket that is loose. Touch up scuffed skirtings and any obvious wall marks. If the walls are a strong colour that skewed to a particular taste, consider a neutral repaint. Neutral is not bland. It is respectful. It says the space is ready for someone to make it their own, which is exactly what a tenant is trying to do.',
  },
  {
    h: 'Price it honestly, first time',
    p: 'The single most common mistake is asking too much because a neighbour told you what they got, and then dropping the price twice while the property sits empty. Real evidence from your street in the last twelve weeks is worth more than any headline number. A well priced flat lets in ten to twenty days and attracts a shortlist of strong applicants. An overpriced flat sits, gathers the tenants who could not qualify for something better, and costs you a full month of rent for every month you waste. Under the new rules that came in earlier this year, you also cannot rely on bidding wars to correct an under priced listing after the fact. So price it right at the start.',
  },
  {
    h: 'What a good agent should be doing',
    p: 'A good letting agent runs comparable evidence with you before you agree an asking rent, arranges the professional photography, writes the listing copy so it actually describes the property, references applicants properly rather than waving through the first offer, and stays reachable during viewings and negotiations. During the tenancy, they hold the compliance calendar so nothing lapses, respond to maintenance issues before they escalate, and give you a straight read on when to renew and when to bring the property back to market. If your agent is doing less than this, it is worth asking why.',
  },
  {
    h: 'A short conversation goes a long way',
    p: 'If you have a property in London that you are thinking about letting, whether it is a first time or your fifth, we are happy to have an informal conversation about what it needs, what it is worth, and what a fair timeline to market looks like. No obligation. Book a valuation and we will come and see the property in person.',
  },
]

export default function LandlordChecklistPost() {
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
        category="For Landlords"
        title="Getting your property ready to let: a landlord's checklist"
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
