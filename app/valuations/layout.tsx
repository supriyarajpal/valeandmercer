import type { Metadata } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'Free Property Valuation London | Canary Wharf & Stratford',
  description: 'Get a free property valuation in London from local experts. Request accurate rental and property valuations across Canary Wharf, E20 and Stratford today.',
  alternates: { canonical: '/valuations' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Free London Property Valuations', item: SITE_URL + '/valuations' },
  ],
}

export default function ValuationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  )
}
