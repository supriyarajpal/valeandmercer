import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Vale and Mercer is a London residential agency. Attentive, straightforward service from first call to final key.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
