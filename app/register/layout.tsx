import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register Interest',
  description: 'Be first to hear about new properties from Vale and Mercer. Tell us what you need and we will be in touch when something fits.',
  alternates: { canonical: '/register' },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
