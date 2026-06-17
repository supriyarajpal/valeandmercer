import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero, { HeroLine, HeroSubtext } from '@/components/PageHero'
import ArrowButton from '@/components/ArrowButton'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'

const steps = [
  { step: '01', title: 'Free valuation', body: 'We visit your property, assess the market, and give you a realistic price based on what the market is doing right now.' },
  { step: '02', title: 'Professional presentation', body: 'Good photography, a proper floorplan, and a description written by someone who has actually been inside.' },
  { step: '03', title: 'Targeted marketing', body: 'We focus on finding the right buyer, not just the first one.' },
  { step: '04', title: 'Negotiation and completion', body: 'We handle the negotiation and stay on top of the process so you are not left chasing anyone.' },
]

export default function SellPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Selling"
          image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=85"
          imageAlt="London property"
        >
          <h1 style={{ color: '#EFECE6', marginBottom: 26, fontSize: 'clamp(36px, 5.6vw, 68px)', textShadow: '0 4px 24px rgba(40,35,28,0.5)' }}>
            <HeroLine text="Sell your home" delay={1.05} />
            <HeroLine text="for what it is" delay={1.18} />
            <HeroLine text="truly worth." delay={1.31} italic gold />
          </h1>
          <HeroSubtext delay={1.5}>
            We price honestly and we negotiate hard. That combination tends to get good results.
          </HeroSubtext>
          <div>
            <ArrowButton href="/valuations" label="Get a Free Valuation" variant="gold" />
          </div>
        </PageHero>

        <section style={{ background: '#EFECE6', padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Stagger as="div" stagger={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: '#C8C0B4', marginBottom: 80 }}>
              {steps.map(s => (
                <StaggerItem key={s.step} as="div">
                  <div style={{ background: '#EFECE6', padding: '40px 28px', height: '100%' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 300, color: 'rgba(160,132,92,0.28)', lineHeight: 1, marginBottom: 14 }}>{s.step}</div>
                    <h3 style={{ fontSize: 22, color: '#28231C', marginBottom: 10 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.95, color: '#6B6258' }}>{s.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal y={28} amount={0.25}>
              <div style={{ maxWidth: 720 }}>
                <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Why Vale and Mercer</p>
                <h2 style={{ color: '#28231C', marginBottom: 22 }}>
                  Selling your home <span style={{ color: '#A0845C', fontStyle: 'italic' }}>the right way</span>
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', marginBottom: 16 }}>
                  The right buyer does not just want to know the square footage. They want to picture their life there. We write listings with that in mind.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: '#6B6258', marginBottom: 32 }}>
                  We keep our client numbers small so nothing gets missed.
                </p>
                <ArrowButton href="/valuations" label="Book Your Free Valuation" variant="dark" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
