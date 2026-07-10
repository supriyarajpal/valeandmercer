import type { Metadata } from 'next'
// Leaflet's tile-pane CSS is linked globally from app/globals.css, but we
// also import it at this page level for parity with the reliability note
// in PropertyMap — top-level page modules are the most dependable place
// for Next.js to link route CSS into the initial bundle.
import 'leaflet/dist/leaflet.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero, { HeroLine, HeroSubtext } from '@/components/PageHero'
import ArrowButton from '@/components/ArrowButton'
import LettingsListings from '@/components/LettingsListings'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'London Lettings',
  description: 'London residential lettings from Vale and Mercer. Browse rental properties available now across East London, and let your own property to well-referenced tenants with honest pricing and full management.',
  alternates: { canonical: '/let' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'London Lettings', item: SITE_URL + '/let' },
  ],
}

const services = [
  { title: 'Tenant sourcing', body: 'We advertise your property to qualified tenants and conduct thorough referencing. You only meet people who have already been vetted.' },
  { title: 'Honest rental pricing', body: 'We set a realistic price that attracts good tenants quickly.' },
  { title: 'Tenancy management', body: 'We handle the paperwork and keep everything on track.' },
  { title: 'Student lets', body: 'Straightforward support for landlords letting to students. No jargon, no surprises.' },
]

export default function LetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Lettings"
          image="https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=2000&q=85"
          imageAlt="London letting"
        >
          <h1 style={{ color: '#F2EFE9', marginBottom: 26, fontSize: 'clamp(36px, 5.6vw, 68px)', textShadow: '0 4px 24px rgba(52,48,43,0.5)' }}>
            <HeroLine text="Let your property" delay={1.05} />
            <HeroLine text="to tenants who" delay={1.18} />
            <HeroLine text="treat it like home." delay={1.31} italic gold />
          </h1>
          <HeroSubtext delay={1.5}>
            We take the time to find the right tenant, not just the first available one.
          </HeroSubtext>
          <div>
            <ArrowButton href="/valuations" label="Speak to Us About Letting" variant="gold" />
          </div>
        </PageHero>

        {/* Live lettings browse experience (map + available-now grid +
            coming-soon), merged in from the former standalone /rent route.
            Shown first, right after the hero, so available rentals lead the
            page ahead of the landlord-focused content below. */}
        <LettingsListings />

        <section style={{ background: 'var(--surface)', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Stagger as="div" stagger={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border-strong)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 80 }}>
              {services.map(s => (
                <StaggerItem key={s.title} as="div">
                  <div style={{ background: 'var(--surface)', padding: '40px 28px', height: '100%' }}>
                    <div style={{ width: 22, height: 1, background: '#A0845C', marginBottom: 18 }} />
                    <h3 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.95, color: 'var(--text-muted)' }}>{s.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal y={28} amount={0.25}>
              <div style={{ maxWidth: 720 }}>
                <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>For Landlords</p>
                <h2 style={{ color: 'var(--text)', marginBottom: 22 }}>
                  Why <span style={{ color: '#A0845C', fontStyle: 'italic' }}>referencing</span> matters
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: 'var(--text-muted)', marginBottom: 16 }}>
                  A bad tenant costs more than a short void period. We reference properly and only proceed when we are satisfied.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: 'var(--text-muted)', marginBottom: 32 }}>
                  Whether you have one property or several, the level of care is the same.
                </p>
                <ArrowButton href="/valuations" label="Discuss Your Property" variant="dark" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
