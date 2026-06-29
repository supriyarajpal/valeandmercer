import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Valuation',
  description: 'Book a free in-person property valuation with Vale and Mercer. No online tools, no algorithms. A straight, well-reasoned figure.',
  alternates: { canonical: '/valuations' },
}

export default function ValuationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
