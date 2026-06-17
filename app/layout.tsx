import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import MotionProvider from '@/components/MotionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vale and Mercer - London Residential',
  description: 'Lettings, new homes and student lets across London. Handled personally.',
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
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="83316c47-05e4-4cd6-b5bc-7126635c5cc5"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
