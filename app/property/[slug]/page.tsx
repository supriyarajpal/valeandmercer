import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyEnquiryActions from '@/components/PropertyEnquiryActions'
import PropertyHeroCarousel from '@/components/PropertyHeroCarousel'
import PropertyLocationMap from '@/components/PropertyLocationMap'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import {
  AGENT_CONTACT,
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
      { '@type': 'ListItem', position: 2, name: 'London Lettings', item: SITE_URL + '/let' },
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
      <PropertyHeroCarousel
        heroImage={property.image}
        heroLabel={property.imageLabel}
        gallery={property.gallery ?? []}
        usingPlaceholder={isUsingPlaceholder(property.image)}
        title={property.title}
        area={property.area}
        propertyRef={property.ref}
        listingType={property.listingType}
        rent={property.rent}
        rentPW={property.rentPW}
        beds={property.beds}
        baths={property.baths}
        sqft={property.sqft}
        floor={property.floor}
        available={property.available}
      />
      <PropertyBody property={property} />
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Hero is now `components/PropertyHeroCarousel.tsx` (client). Only the */
/* placeholder-detect helper lives here so it can run server-side.     */
/* ------------------------------------------------------------------ */

// True when the property falls back to the shared SVG placeholder rather
// than a real photograph. Drives the "Photography commissioned" badge in
// the carousel.
function isUsingPlaceholder(image: string): boolean {
  return image.endsWith('/property-placeholder.svg')
}

/* ------------------------------------------------------------------ */
/* Body: two-column (main + sidebar) above 900px, single-col below    */
/* ------------------------------------------------------------------ */

function PropertyBody({ property }: { property: Property }) {
  return (
    // Top padding is deliberately smaller than `--section-y` to tighten
    // the gap under the hero carousel — combined with the carousel's own
    // reduced bottom padding, this lands the hero-to-Overview transition
    // at roughly one normal section gap instead of two.
    <main style={{ background: 'var(--surface)', padding: '40px var(--gutter) var(--section-y)' }}>
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
          {/* Overview leads; tag pills sit alongside/after (left column,
              not above) so the page opens with narrative rather than
              a wall of amenity chips. */}
          <SectionBlock eyebrow="Overview" title={property.headline} first>
            <BodyPara>{property.description}</BodyPara>
          </SectionBlock>

          <TagPills tags={property.tags} />

          <SectionBlock eyebrow="Amenities" title="Building & apartment amenities">
            <BodyPara>{property.amenities}</BodyPara>
          </SectionBlock>

          {property.keyFeatures.length > 0 && (
            <SectionBlock eyebrow="Key Features" title="Highlights">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {property.keyFeatures.map(feature => (
                  <li key={feature} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 15, color: 'var(--text)', lineHeight: 1.75 }}>
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
    // `alignSelf: 'start'` is inherited from the parent grid's
    // `alignItems: 'start'`, so `position: sticky` still works. Adding
    // the map below the Enquire card makes the sidebar taller — on
    // shorter viewports the tail can clip while stuck, but the section
    // is short enough overall that the containing block unsticks it
    // near the end of the body copy on the left. Trade-off preserved
    // vs. adding internal overflow scroll.
    <aside style={{ position: 'sticky', top: 140 }}>
      <Reveal y={20} amount={0.1}>
        <div style={{ position: 'relative' }}>
          {/* Backdrop scoped ONLY to this card: a small blurred gold/bronze/
              ink blob clipped to the card's own rounded box, giving the
              panel's backdrop-filter real texture to frost. It cannot leak
              onto the page — overflow:hidden + inset:0 keep it card-sized. */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ position: 'absolute', inset: '-15%', filter: 'blur(22px)', background: 'radial-gradient(45% 35% at 24% 18%, rgba(160,132,92,0.75), transparent 68%), radial-gradient(52% 42% at 88% 84%, rgba(122,96,62,0.65), transparent 70%), radial-gradient(50% 40% at 60% 52%, rgba(40,35,28,0.55), transparent 72%)' }} />
          </div>
          <div className="glass-strong" style={{ position: 'relative', zIndex: 1, color: '#F2EFE9', padding: '36px 32px 32px', borderRadius: 'var(--radius-lg)' }}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Enquire</p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, marginBottom: 6, letterSpacing: '-0.01em' }}>
            Vale and Mercer
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.55)', marginBottom: 24 }}>
            Lettings
          </div>

          {/* Agent name intentionally omitted; the raw phone number is
              also gone from this card. Enquiry routes to email/WhatsApp/
              call via the CTA buttons below, which open the same
              contact affordances. */}
          <div style={{ marginBottom: 28, fontSize: 13 }}>
            <a href={`mailto:${AGENT_CONTACT.email}?subject=${subject}`} className="link-underline" style={{ color: '#F2EFE9', wordBreak: 'break-word' }}>
              {AGENT_CONTACT.email}
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
        </div>
      </Reveal>

      {property.coordinates && (
        <Reveal y={20} amount={0.1}>
          <div style={{ marginTop: 32 }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Location</p>
            <PropertyLocationMap property={property} />
          </div>
        </Reveal>
      )}
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* Reusable bits                                                      */
/* ------------------------------------------------------------------ */

function SectionBlock({ eyebrow, title, children, first }: { eyebrow: string; title: string; children: React.ReactNode; first?: boolean }) {
  return (
    <Reveal y={24} amount={0.15}>
      <section
        style={{
          marginBottom: 40,
          borderTop: first ? 'none' : '0.5px solid var(--border)',
          paddingTop: first ? 0 : 42,
        }}
      >
        <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>{eyebrow}</p>
        <h2 style={{ color: 'var(--text)', fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2, marginBottom: 24, maxWidth: 720 }}>{title}</h2>
        {children}
      </section>
    </Reveal>
  )
}

function BodyPara({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15.5, lineHeight: 1.95, color: 'var(--text)', opacity: 0.85, maxWidth: 780 }}>{children}</p>
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
              color: 'var(--text)',
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
            borderTop: i === 0 ? 'none' : '0.5px solid var(--border)',
            fontSize: 14,
          }}
        >
          <span style={{ color: '#7A7268', letterSpacing: '0.02em' }}>{row.label}</span>
          <span style={{ color: 'var(--text)' }}>{row.value}</span>
        </div>
      ))}
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
      <p className="eyebrow" style={{ color: 'var(--text-faint)', marginBottom: 14 }}>{title}</p>
      <Stagger as="ul" stagger={0.06} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {points.map(point => (
          <StaggerItem key={point.name + point.distance} as="li">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--text)' }}>{point.name}</span>
              <span style={{ color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{point.distance}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
