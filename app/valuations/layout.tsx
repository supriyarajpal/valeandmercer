import type { Metadata } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'Free London Property Valuations',
  description: 'Book a free in-person London property valuation with Vale and Mercer. No online tools, no algorithms, just a straight, well-reasoned figure from a senior agent.',
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
