import type { Metadata } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'Register for Property Alerts',
  description: 'Register for London property alerts from Vale and Mercer. Be first to hear about new lettings and residential sales across prime London postcodes.',
  alternates: { canonical: '/register' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Register for Property Alerts', item: SITE_URL + '/register' },
  ],
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
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
