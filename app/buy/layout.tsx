import type { Metadata } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'New Homes in London',
  description: 'New homes and residential sales in London from Vale and Mercer. Register your interest and hear about new listings before they reach the open market.',
  alternates: { canonical: '/buy' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'New Homes in London', item: SITE_URL + '/buy' },
  ],
}

export default function BuyLayout({ children }: { children: React.ReactNode }) {
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
