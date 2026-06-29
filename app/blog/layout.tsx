import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Insight and advice on the London property market, buying in prime postcodes, and renting in London as a student.',
  alternates: { canonical: '/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
