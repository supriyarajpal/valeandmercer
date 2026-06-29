import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import MotionProvider from '@/components/MotionProvider'
import './globals.css'

const SITE_URL = 'https://valeandmercer.co.uk'
const OG_IMAGE = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop&q=85'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vale and Mercer | London Residential Property Agency',
    template: '%s | Vale and Mercer',
  },
  description: 'Lettings, new homes and student lets across London. Personal service, honest valuations, properties handled with care.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Vale and Mercer',
    title: 'Vale and Mercer | London Residential Property Agency',
    description: 'Lettings, new homes and student lets across London. Personal service, honest valuations, properties handled with care.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Vale and Mercer — London residential property agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vale and Mercer | London Residential Property Agency',
    description: 'Lettings, new homes and student lets across London. Personal service, honest valuations, properties handled with care.',
    images: [OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
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
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
