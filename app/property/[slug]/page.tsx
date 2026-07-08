import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyEnquiryActions from '@/components/PropertyEnquiryActions'
import { PropertyGallery, HeroImageClickTarget } from '@/components/PropertyGallery'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import {
  AGENT_CONTACT,
  RENT_GUIDES,
  RENT_TERMS,
  getAllPropertySlugs,
  getPropertyBySlug,
  type NearbyPoint,
  type Property,
} from '@/lib/properties'

const SITE_URL = 'https://valeandmercer.co.uk'

export async function generateStaticParams() {
  return getAllPropertySlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) return { title: 'Property not found' }

  const shortDesc = `${property.title}, ${property.area}. ${property.rent} · ${property.beds === 0 ? 'Studio' : property.beds + '-bed'}, ${property.baths}-bath. Available ${property.available}.`
  return {
    title: `${property.title} · ${property.rent}`,
    description: shortDesc,
    alternates: { canonical: `/property/${property.slug}` },
    // Draft records lack confirmed EPC + council tax band and should not
    // be indexed by search engines. Flip to 'live' in lib/properties.ts
    // once compliance data is confirmed.
    robots: property.status === 'draft'
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${property.title} · ${property.rent} | Vale and Mercer`,
      description: shortDesc,
      url: `${SITE_URL}/property/${property.slug}`,
      type: 'website',
      images: [{ url: SITE_URL + property.image, width: 1600, height: 1000, alt: property.title }],
    },
  }
}

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) notFound()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',           item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'London Rentals', item: SITE_URL + '/rent' },
      { '@type': 'ListItem', position: 3, name: property.title,   item: SITE_URL + '/property/' + property.slug },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <PropertyHero property={property} />
      <PropertyBody property={property} />
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Hero: dark ink band with headline, ref, rent, image behind         */
/* ------------------------------------------------------------------ */

// Shared shadow used on every text element in the hero so title / price /
// details always clear whatever image sits behind them. Double-drop shadow
// mirrors the pattern used on the homepage HeroSubtext for consistency.
const HERO_TEXT_SHADOW = '0 2px 18px rgba(20,17,14,0.75), 0 1px 3px rgba(20,17,14,0.55)'

// True when the property is using the shared placeholder rather than a real
// photograph. Drives the small "Photo coming soon" tag in the hero corner.
function isUsingPlaceholder(image: string): boolean {
  return image.endsWith('/property-placeholder.svg')
}

function PropertyHero({ property }: { property: Property }) {
  const bedLabel = property.beds === 0 ? 'Studio' : `${property.beds} bed${property.beds === 1 ? '' : 's'}`
  const usingPlaceholder = isUsingPlaceholder(property.image)

  return (
    <section
      style={{
        background: '#28231C',
        minHeight: '72vh',
        position: 'relative',
        overflow: 'hidden',
        padding: '160px var(--gutter) 96px',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={property.image}
          alt={usingPlaceholder ? '' : `${property.title}, ${property.area}`}
          loading="eager"
          fetchPriority="high"
          // Placeholder is a neutral gradient by design (no imagery to
          // preserve), so we let it sit at full opacity. Real photos come
          // down to 0.7 so the scrim gradients can carry the text.
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: usingPlaceholder ? 1 : 0.7,
          }}
        />
        <HeroImageClickTarget show={!usingPlaceholder && (property.gallery?.length ?? 0) > 0} />
      </div>
      {/*
        Two-layer scrim:
          (a) uniform darken so no bright area of a real photo undercuts text
          (b) bottom-heavy gradient anchoring the copy zone.
        Values chosen to keep the title/price stack legible in all three
        cases: dark placeholder, bright daylight photo, low-key twilight.
      */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(20,17,14,0.35)' }} />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(20,17,14,0.55) 0%, rgba(20,17,14,0.12) 32%, rgba(20,17,14,0.55) 62%, rgba(20,17,14,0.92) 100%)',
        }}
      />

      {usingPlaceholder && (
        <div
          style={{
            position: 'absolute',
            top: 132,
            right: 'var(--gutter)',
            zIndex: 11,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            border: '0.5px solid rgba(242,239,233,0.28)',
            background: 'rgba(20,17,14,0.4)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(242,239,233,0.75)',
          }}
        >
          <span
            aria-hidden
            style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', display: 'inline-block' }}
          />
          Photography commissioned
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <Reveal y={16} amount={0.15}>
          <Link
            href="/rent"
            className="link-underline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#A0845C',
              marginBottom: 44,
              textShadow: HERO_TEXT_SHADOW,
            }}
          >
            <span aria-hidden style={{ fontSize: 14 }}>←</span> Back to Rentals
          </Link>
        </Reveal>

        <Reveal y={20} delay={0.05} amount={0.15}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 32, height: 1, background: '#A0845C' }} />
            <span
              className="eyebrow"
              style={{ color: '#A0845C', textShadow: HERO_TEXT_SHADOW }}
            >
              {property.listingType} · Ref {property.ref}
            </span>
          </div>
        </Reveal>

        <Reveal y={28} delay={0.1} amount={0.15}>
          <h1
            style={{
              color: '#F2EFE9',
              marginBottom: 24,
              fontSize: 'clamp(38px, 6vw, 72px)',
              lineHeight: 1.05,
              maxWidth: 900,
              textShadow: HERO_TEXT_SHADOW,
            }}
          >
            {property.title}
            <span style={{ color: '#A0845C', fontStyle: 'italic' }}> · {property.area}</span>
          </h1>
        </Reveal>

        <Reveal y={16} delay={0.15} amount={0.15}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '18px 28px', marginBottom: 14 }}>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(30px, 4.4vw, 44px)',
                fontWeight: 300,
                color: '#F2EFE9',
                letterSpacing: '-0.01em',
                textShadow: HERO_TEXT_SHADOW,
              }}
            >
              {property.rent}
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'rgba(242,239,233,0.72)',
                letterSpacing: '0.02em',
                textShadow: HERO_TEXT_SHADOW,
              }}
            >
              {property.rentPW}
            </div>
          </div>
        </Reveal>

        <Reveal y={12} delay={0.2} amount={0.15}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px 22px',
              fontSize: 12,
              color: 'rgba(242,239,233,0.82)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textShadow: HERO_TEXT_SHADOW,
            }}
          >
            <span>{bedLabel}</span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            <span>{property.baths} bath{property.baths === 1 ? '' : 's'}</span>
            {property.sqft != null && (<>
              <span aria-hidden style={{ opacity: 0.4 }}>·</span>
              <span>{property.sqft} sq. ft.</span>
            </>)}
            {property.floor && (<>
              <span aria-hidden style={{ opacity: 0.4 }}>·</span>
              <span>{property.floor}</span>
            </>)}
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            <span>Available {property.available}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Body: two-column (main + sidebar) above 900px, single-col below    */
/* ------------------------------------------------------------------ */

function PropertyBody({ property }: { property: Property }) {
  return (
    <main style={{ background: '#F2EFE9', padding: 'var(--section-y) var(--gutter)' }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 340px)',
          gap: 56,
          alignItems: 'start',
        }}
        className="vm-property-grid"
      >
        <div style={{ minWidth: 0 }}>
          <TagPills tags={property.tags} />
          {property.gallery && property.gallery.length > 0 && (
            <PropertyGallery
              heroImage={property.image}
              gallery={property.gallery}
              title={property.title}
              area={property.area}
            />
          )}
          <SectionBlock eyebrow="Overview" title={property.headline}>
            <BodyPara>{property.description}</BodyPara>
          </SectionBlock>

          <SectionBlock eyebrow="Amenities" title="Building & apartment amenities">
            <BodyPara>{property.amenities}</BodyPara>
          </SectionBlock>

          {property.keyFeatures.length > 0 && (
            <SectionBlock eyebrow="Key Features" title="Highlights">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {property.keyFeatures.map(feature => (
                  <li key={feature} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 15, color: '#4A4036', lineHeight: 1.75 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A0845C', marginTop: 9, flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {property.compliance && (
            <SectionBlock eyebrow="Compliance" title="EPC & Council Tax">
              <DataRows
                rows={[
                  { label: 'EPC rating',       value: property.compliance.epc },
                  { label: 'Council tax band', value: property.compliance.councilTax },
                ]}
              />
            </SectionBlock>
          )}

          <SectionBlock eyebrow="Location" title="Neighbourhood">
            <BodyPara>{property.location}</BodyPara>
            {property.nearby.length > 0 && <NearbyList points={property.nearby} />}
          </SectionBlock>

          <SectionBlock eyebrow="Deposits" title="Deposit summary">
            <DataRows
              rows={[
                { label: 'Holding deposit',  value: property.holdingDeposit },
                { label: 'Security deposit', value: property.securityDeposit },
              ]}
            />
          </SectionBlock>

          <SectionBlock eyebrow="Income" title="Rent payment & income requirements">
            <DataRows
              rows={[
                { label: 'Rent (per month)',                    value: property.income.rentPM },
                { label: 'UK income requirement',               value: property.income.ukIncome },
                { label: 'UK guarantor income requirement',     value: property.income.ukGuarantor },
                { label: 'Foreign guarantor',                   value: property.income.foreignGuarantor },
                { label: 'Adverse credit',                      value: property.income.adverseCredit },
              ]}
            />
            <div style={{ marginTop: 28, display: 'grid', gap: 10 }}>
              <RentTermLine label="Rent payment options"    value={RENT_TERMS.paymentOptions} />
              <RentTermLine label="Valid ID"                value={RENT_TERMS.validID} />
              <RentTermLine label="Valid Right-to-Rent"     value={RENT_TERMS.rightToRent} />
              <RentTermLine label="Proof of income or studies" value={RENT_TERMS.proofOfIncome} />
            </div>
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {RENT_GUIDES.map(guide => (
                <a
                  key={guide.label}
                  href={guide.href}
                  className="link-underline"
                  style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A0845C' }}
                >
                  {guide.label} <span aria-hidden style={{ marginLeft: 6 }}>→</span>
                </a>
              ))}
            </div>
          </SectionBlock>
        </div>

        <PropertySidebar property={property} />
      </div>

      {/* Small-screen fallback — flatten to one column below 900px.
          Inline stylesheet is safe here: scoped by unique class name. */}
      <style>{`
        @media (max-width: 900px) {
          .vm-property-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar: sticky agent card + CTAs                                  */
/* ------------------------------------------------------------------ */

function PropertySidebar({ property }: { property: Property }) {
  const subject = encodeURIComponent(`Enquiry: ${property.title} (Ref ${property.ref})`)
  return (
    <aside style={{ position: 'sticky', top: 140 }}>
      <Reveal y={20} amount={0.1}>
        <div style={{ background: '#34302B', color: '#F2EFE9', padding: '36px 32px 32px', boxShadow: '0 24px 60px -30px rgba(52,48,43,0.35)' }}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 22 }}>Enquire</p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300, marginBottom: 6, letterSpacing: '-0.01em' }}>
            {AGENT_CONTACT.name}
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.55)', marginBottom: 28 }}>
            Lettings · Vale and Mercer
          </div>

          <div style={{ display: 'grid', gap: 14, fontSize: 13, marginBottom: 32 }}>
            <a href={`mailto:${AGENT_CONTACT.email}?subject=${subject}`} className="link-underline" style={{ color: '#F2EFE9', wordBreak: 'break-word' }}>
              {AGENT_CONTACT.email}
            </a>
            <a href={`tel:${AGENT_CONTACT.phone.replace(/\s+/g, '')}`} className="link-underline" style={{ color: '#F2EFE9' }}>
              {AGENT_CONTACT.phone}
            </a>
          </div>

          <PropertyEnquiryActions
            title={property.title}
            propertyRef={property.ref}
            rent={property.rent}
          />


          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '0.5px solid rgba(242,239,233,0.14)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.5)' }}>
            Property Ref · {property.ref}
          </div>
        </div>
      </Reveal>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* Reusable bits                                                      */
/* ------------------------------------------------------------------ */

function SectionBlock({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal y={24} amount={0.15}>
      <section style={{ marginBottom: 64, borderTop: '0.5px solid #DDD7CC', paddingTop: 42 }}>
        <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>{eyebrow}</p>
        <h2 style={{ color: '#4A4036', fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2, marginBottom: 24, maxWidth: 720 }}>{title}</h2>
        {children}
      </section>
    </Reveal>
  )
}

function BodyPara({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15.5, lineHeight: 1.95, color: '#4A4036', opacity: 0.85, maxWidth: 780 }}>{children}</p>
}

function TagPills({ tags }: { tags: string[] }) {
  return (
    <Reveal y={16} amount={0.15}>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {tags.map(tag => (
          <li
            key={tag}
            style={{
              fontSize: 11,
              letterSpacing: '0.06em',
              color: '#4A4036',
              padding: '7px 14px',
              borderRadius: 999,
              background: 'rgba(221,215,204,0.5)',
              border: '0.5px solid rgba(200,192,180,0.55)',
            }}
          >
            {tag}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function DataRows({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <div style={{ display: 'grid', gap: 0 }}>
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 20,
            padding: '16px 0',
            borderTop: i === 0 ? 'none' : '0.5px solid #DDD7CC',
            fontSize: 14,
          }}
        >
          <span style={{ color: '#7A7268', letterSpacing: '0.02em' }}>{row.label}</span>
          <span style={{ color: '#4A4036' }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

function RentTermLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 13, color: '#4A4036' }}>
      <span style={{ letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: 10, color: '#9A9188', minWidth: 200, paddingTop: 2 }}>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function NearbyList({ points }: { points: NearbyPoint[] }) {
  const tube    = points.filter(p => p.kind === 'Tube')
  const schools = points.filter(p => p.kind === 'School')

  return (
    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
      {tube.length > 0 && <NearbyGroup title="Nearest tube / rail" points={tube} />}
      {schools.length > 0 && <NearbyGroup title="Nearest schools"    points={schools} />}
    </div>
  )
}

function NearbyGroup({ title, points }: { title: string; points: NearbyPoint[] }) {
  return (
    <div>
      <p className="eyebrow" style={{ color: '#9A9188', marginBottom: 14 }}>{title}</p>
      <Stagger as="ul" stagger={0.06} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {points.map(point => (
          <StaggerItem key={point.name + point.distance} as="li">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '10px 0', borderBottom: '0.5px solid #DDD7CC', fontSize: 13 }}>
              <span style={{ color: '#4A4036' }}>{point.name}</span>
              <span style={{ color: '#9A9188', whiteSpace: 'nowrap' }}>{point.distance}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
