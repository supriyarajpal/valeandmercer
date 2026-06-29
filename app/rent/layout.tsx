import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rentals',
  description: 'Rental properties coming soon across prime London. Register your interest with Vale and Mercer.',
  alternates: { canonical: '/rent' },
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children
}
