import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero, { HeroLine, HeroSubtext } from '@/components/PageHero'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'Student Lettings in London',
  description: 'Student lettings in Canary Wharf and East London. Vale and Mercer helps students find well-located, furnished rental properties with straightforward referencing and guarantor support.',
  alternates: { canonical: '/student-lettings' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Student Lettings', item: SITE_URL + '/student-lettings' },
  ],
}

const services = [
  {
    title: 'Furnished properties',
    body: 'All our student lettings are fully or part-furnished. Move in with your essentials — everything else is already there.',
  },
  {
    title: 'Guarantor-friendly',
    body: 'We work with guarantors as standard. Whether a parent or guardian is guaranteeing the tenancy, we make the process clear and straightforward.',
  },
  {
    title: 'Transport connections',
    body: 'Our properties sit within walking distance of Canary Wharf, Crossrail, the DLR, and the Jubilee line — making your commute to university manageable from day one.',
  },
  {
    title: 'Honest referencing',
    body: 'We reference fairly and explain every step. No hidden requirements, no surprises. If something is unclear, we will tell you before it becomes a problem.',
  },
]

export default function StudentLettingsPage() {
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
          eyebrow="Student Lettings"
          image="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=2000&q=85"
          imageAlt="Canary Wharf skyline at dusk"
        >
          <h1 style={{ color: '#F2EFE9', marginBottom: 26, fontSize: 'clamp(36px, 5.6vw, 68px)', textShadow: '0 4px 24px rgba(52,48,43,0.5)' }}>
            <HeroLine text="Student lettings" delay={1.05} />
            <HeroLine text="done without" delay={1.18} />
            <HeroLine text="the runaround." delay={1.31} italic gold />
          </h1>
          <HeroSubtext delay={1.5}>
            Well-connected, furnished rentals in East London — with guarantor support included as standard.
          </HeroSubtext>
          <div>
            <ArrowButton href="/register" label="Register Your Interest" variant="gold" />
          </div>
        </PageHero>

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
                <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Canary Wharf &amp; East London</p>
                <h2 style={{ color: 'var(--text)', marginBottom: 22 }}>
                  Well-located for <span style={{ color: '#A0845C', fontStyle: 'italic' }}>university</span>
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Canary Wharf sits at the intersection of the Jubilee line, the DLR, and the Elizabeth line. Whether you are studying in central London, South Bank, or further east, you are rarely more than a straightforward commute away.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: 'var(--text-muted)', marginBottom: 32 }}>
                  We rent to students as we would to any other tenant: fairly, clearly, and without unnecessary hurdles. If you have questions about the referencing process or what a guarantor needs to provide, speak to us before you apply.
                </p>
                <ArrowButton href="/register" label="Register Your Interest" variant="dark" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
