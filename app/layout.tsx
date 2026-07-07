import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import MotionProvider from '@/components/MotionProvider'
import './globals.css'

const SITE_URL = 'https://valeandmercer.co.uk'
const OG_IMAGE = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop&q=85'
const DESCRIPTION = 'London lettings, sales and property valuations. Independent London estate agency for residential lettings, new homes, and student lets — personal service and honest advice from Vale and Mercer.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vale and Mercer | London Residential Property Agency',
    template: '%s | Vale and Mercer',
  },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Vale and Mercer',
    title: 'Vale and Mercer | London Residential Property Agency',
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Vale and Mercer — London residential property agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vale and Mercer | London Residential Property Agency',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
}

// One RealEstateAgent record for the whole site so every page carries
// the entity graph — Google prefers a single specific type over
// duplicated Organization + RealEstateAgent. Facts only: all fields
// below are verifiable from Footer / Companies House / Property Redress.
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': SITE_URL + '/#organization',
  name: 'Vale and Mercer Ltd',
  alternateName: 'Vale & Mercer',
  url: SITE_URL,
  logo: SITE_URL + '/icon.svg',
  email: 'info@valeandmercer.co.uk',
  description: 'London residential property agency offering lettings, new homes, and student lets.',
  areaServed: { '@type': 'City', name: 'London' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '124 City Road',
    addressLocality: 'London',
    postalCode: 'EC1V 2NX',
    addressCountry: 'GB',
  },
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'CompanyNumber', value: '17212434' },
    { '@type': 'PropertyValue', propertyID: 'ICO', value: 'ZC155397' },
    { '@type': 'PropertyValue', propertyID: 'PropertyRedressScheme', value: 'PRS058796' },
  ],
  memberOf: { '@type': 'Organization', name: 'Property Redress Scheme', url: 'https://www.propertyredress.co.uk' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* `afterInteractive` so a slow / blocked Cookiebot CDN (corp
            firewalls, strict ad blockers, restricted regions) can't hang
            page hydration. The consent banner still appears moments after
            paint, and `data-blockingmode="auto"` keeps tracker gating. */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="83316c47-05e4-4cd6-b5bc-7126635c5cc5"
          data-blockingmode="auto"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
