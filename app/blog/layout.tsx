import type { Metadata } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'London Property Journal',
  description: 'Insight and advice on the London property market, buying guides for prime London postcodes like Chelsea SW3, and student lettings guidance from the Vale and Mercer journal.',
  alternates: { canonical: '/blog' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'London Property Journal', item: SITE_URL + '/blog' },
  ],
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
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
