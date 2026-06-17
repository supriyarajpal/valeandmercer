import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero, { HeroLine, HeroSubtext } from '@/components/PageHero'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const services = [
  { title: 'Tenant sourcing', body: 'We advertise your property to qualified tenants and conduct thorough referencing. You only meet people who have already been vetted.' },
  { title: 'Honest rental pricing', body: 'We set a realistic price that attracts good tenants quickly.' },
  { title: 'Tenancy management', body: 'We handle the paperwork and keep everything on track.' },
  { title: 'Student lets', body: 'Straightforward support for landlords letting to students. No jargon, no surprises.' },
]

export default function LetPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Lettings"
          image="https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=2000&q=85"
          imageAlt="London letting"
        >
          <h1 style={{ color: '#EFECE6', marginBottom: 26, fontSize: 'clamp(44px, 7vw, 84px)', textShadow: '0 4px 24px rgba(40,35,28,0.5)' }}>
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

        <section style={{ background: '#EFECE6', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Stagger as="div" stagger={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: '#C8C0B4', marginBottom: 80 }}>
              {services.map(s => (
                <StaggerItem key={s.title} as="div">
                  <div style={{ background: '#EFECE6', padding: '40px 28px', height: '100%' }}>
                    <div style={{ width: 22, height: 1, background: '#A0845C', marginBottom: 18 }} />
                    <h3 style={{ fontSize: 22, color: '#28231C', marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.95, color: '#6B6258' }}>{s.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal y={28} amount={0.25}>
              <div style={{ maxWidth: 720 }}>
                <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>For Landlords</p>
                <h2 style={{ color: '#28231C', marginBottom: 22 }}>
                  Why <span style={{ color: '#A0845C', fontStyle: 'italic' }}>referencing</span> matters
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', marginBottom: 16 }}>
                  A bad tenant costs more than a short void period. We reference properly and only proceed when we are satisfied.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', marginBottom: 32 }}>
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
