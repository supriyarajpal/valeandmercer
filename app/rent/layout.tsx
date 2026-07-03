import type { Metadata } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'London Rentals',
  description: 'London rental properties from Vale and Mercer. Register your interest for premium residential lettings coming soon across prime London postcodes.',
  alternates: { canonical: '/rent' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'London Rentals', item: SITE_URL + '/rent' },
  ],
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
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
