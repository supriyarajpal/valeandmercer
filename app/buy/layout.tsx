import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Homes',
  description: 'Properties coming soon across prime London. Register your interest and hear about new listings before they reach the open market.',
  alternates: { canonical: '/buy' },
}

export default function BuyLayout({ children }: { children: React.ReactNode }) {
  return children
}
