import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/renters-rights-act-london-2026'
// Unsplash London residential street. Unsplash License allows free
// commercial use with no attribution required.
const IMAGE = 'https://images.unsplash.com/photo-1510265236892-329bfd7de7a1?w=1400&q=85'
const IMAGE_ALT = 'Leafy London residential street with a period terrace'
const DATE_PUBLISHED = '2026-07-08'
const TITLE       = "What the Renters' Rights Act Means for London Tenants and Landlords in 2026"
const DESCRIPTION = "How the Renters' Rights Act, in force in England since 1 May 2026, changes bidding wars, rent increases, and how London homes are advertised. Practical guidance from Vale and Mercer for tenants and landlords."

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
    h: 'The Renters’ Rights Act took effect on 1 May 2026',
    p: "For anyone renting or letting a home in England, the rules have changed. The Renters' Rights Act came into force on 1 May 2026 and it reshapes how tenancies are advertised, agreed, and adjusted. If you rent, or if you own a rented property, here is what you actually need to know.",
  },
  {
    h: 'What tenants gain, part one: no more bidding above asking',
    p: 'The most direct change for renters is that landlords and letting agents can no longer accept offers above the advertised rent. Before the Act, roughly one in ten rented tenancies across the UK were agreed above the asking price. In London, at peak, the figure climbed closer to one in five. That inflationary pressure at the point of signing has been removed. If a property is listed at 2,500 pounds a month, that is now the ceiling. Applicants can compete on quality of references and readiness to move, but not on price.',
  },
  {
    h: 'What tenants gain, part two: advance notice on rent increases',
    p: 'The Act also requires landlords to give tenants clear advance notice of any proposed rent increase. This closes a gap where a renewal offer at a much higher rent could arrive close to the end of a fixed term, leaving tenants little time to prepare or negotiate. Notice periods and the process for challenging a proposed increase are now clearer for both sides.',
  },
  {
    h: 'What landlords need to know: set an honest asking rent',
    p: 'The practical impact for landlords is that the advertised figure is the figure. If a property is under-priced, there is no upward mechanism to correct it during the letting process. The right approach is to price accurately from day one, guided by real recent evidence from your specific street, not the wider postcode. A good agent will walk you through comparable evidence before the listing goes live, rather than after.',
  },
  {
    h: 'Expect asking rents to reflect the ceiling',
    p: 'One market-wide consequence is that many landlords and agents will pitch initial asking rents at the top of a defensible band rather than the middle. That is a rational response, not overreach, but it means renters should compare a shortlist of similar homes carefully rather than assume the first advertised rent is negotiable downward by much. Speed of response and clean applications will matter more than bids.',
  },
  {
    h: 'What this means in practice',
    p: 'For tenants, the search process is now more transparent. What you see advertised is what you pay if you take the property. For landlords, the message is straightforward: price it right first time, offer a fair tenancy, and communicate clearly with tenants about any future changes. Both sides now have a clearer set of expectations to work within.',
  },
  {
    h: 'How we work with the new rules at Vale and Mercer',
    p: 'We advise landlords honestly on realistic asking rents backed by recent local evidence, and we take a clean, transparent approach to tenant applications. Tenants who register with us know the advertised rent is the rent. If you are letting a property in London and want a straight conversation about how to price it under the new rules, get in touch.',
  },
]

export default function RentersRightsActPost() {
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
        category="Regulation"
        title={"What the Renters’ Rights Act means for London tenants and landlords in 2026"}
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
