import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'
import { Reveal } from '@/components/Reveal'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/new-homes-in-birmingham'
const IMAGE = '/images/cities/birmingham/hero-1920.webp'
const IMAGE_ALT = 'New Homes in Birmingham'
const DATE_PUBLISHED = '2026-11-05'
const DATE_LABEL = '5 November 2026'
const TITLE = 'New Homes in Birmingham'
const DESCRIPTION = 'Steelhouse Lane offers great developments in the heart of Birmingham, perfect for every individual.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    type: 'article',
    title: TITLE + ' | Vale and Mercer',
    description: DESCRIPTION,
    url: SLUG,
    images: [IMAGE],
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + SLUG },
  headline: TITLE,
  description: DESCRIPTION,
  image: IMAGE,
  datePublished: DATE_PUBLISHED,
  author: { '@type': 'Organization', name: 'Vale and Mercer', url: SITE_URL },
  publisher: { '@id': SITE_URL + '/#organization' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'London Property Journal', item: SITE_URL + '/blog' },
    { '@type': 'ListItem', position: 3, name: TITLE, item: SITE_URL + SLUG },
  ],
}

const faqs: Array<[string, string]> = [
  ['Which Council Covers This Area?', 'Birmingham City Council handles planning and local regulation. 5 Steelhouse Ln also sits within the Steelhouse Lane Conservation Area.'],
  ['What Security Does The Building Have?', 'We treat security very seriously. This is why our communal entrances use keypad access with a video intercom to each apartment and CCTV monitoring. The specification also includes fire sprinklers throughout.'],
  ['Can Overseas Buyers Purchase?', 'Yes, absolutely. International buyers are welcome to enquire. You will just have to speak to our team to understand how the payments and legal steps work from abroad.'],
  ['What Rental Return Can I Expect?', 'Yields in this market commonly fall between 5% and 8%. However, these are not guaranteed, as actual returns depend on occupancy, management costs, and market conditions.'],
  ['How Are Our Developments Different From One Another?', 'We believe in offering variety. This is why each of our developments for new homes in Birmingham and other places offers something different, giving you wide variety to choose from.'],
  ['Can I Arrange a Viewing?', 'Yes, absolutely. You can register your interest, and we’ll contact you about availability, pricing, and booking a viewing.'],
]

const faqsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const h2Style: React.CSSProperties = { color: 'var(--text)', marginTop: 48, marginBottom: 16, fontSize: 28, lineHeight: 1.25 }
const h3Style: React.CSSProperties = { fontSize: 18, color: 'var(--text)', marginTop: 28, marginBottom: 10, fontWeight: 600 }
const pStyle: React.CSSProperties = { fontSize: 16, lineHeight: 1.95, color: 'var(--text)', opacity: 0.82, marginBottom: 20 }
const liStyle: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.85, color: 'var(--text)', opacity: 0.82, marginBottom: 10 }
const stepListStyle: React.CSSProperties = { listStyle: 'none', padding: 0, margin: '0 0 24px' }

const specWrapStyle: React.CSSProperties = { overflowX: 'auto', margin: '12px 0 28px', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }
const specTableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '14px' }
const specKeyStyle: React.CSSProperties = { padding: '12px 14px', textAlign: 'left', color: 'var(--text)', fontWeight: 600, borderBottom: '0.5px solid var(--border)', verticalAlign: 'top', width: '38%', whiteSpace: 'nowrap' }
const specValStyle: React.CSSProperties = { padding: '12px 14px', color: 'var(--text-muted)', borderBottom: '0.5px solid var(--border)', verticalAlign: 'top', lineHeight: 1.7 }

function SpecTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div style={specWrapStyle}>
      <table style={specTableStyle}>
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
              <td style={specKeyStyle}>{k}</td>
              <td style={specValStyle}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function NewHomesInBirminghamPost() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsJsonLd) }}
      />
      <Navbar />
      <ArticleLayout
        category="Area Guide"
        title={TITLE}
        meta={`${DATE_LABEL}  ·  6 min read`}
        image={IMAGE}
        imageAlt={IMAGE_ALT}
        signoff={`Vale and Mercer Team  ·  ${DATE_LABEL}`}
      >
        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Where Birmingham&rsquo;s Business Core Meets a Place To Call Home</h2>
          <p style={pStyle}>Steelhouse Lane offers great developments in the heart of Birmingham, perfect for every individual.</p>
          <p style={pStyle}>The 42-44 Steelhouse Lane is a boutique block of 59 contemporary one- and two-bed apartments, due for completion in September 2027. Just along the street, there is 5 Steelhouse Ln, a period-style courtyard conversion of 70 studios, one-beds and two-beds. Both the properties put you within a few minutes&rsquo; walk of Snow Hill Station, the Colmore Business District and Aston University. Their prime location is exactly what makes them so desirable.</p>
          <p style={pStyle}>So, if you&rsquo;re searching for new homes in Birmingham, then our properties will just be the right fit. Pick the style that suits you, whether that&rsquo;s a modern boutique building or a characterful conversion with a landscaped courtyard.</p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Property Information</h2>
          <p style={pStyle}>We have two developments on Steelhouse Lane, dedicated to offering a wide range of new homes in Birmingham. Here are the key facts for each one.</p>

          <h3 style={h3Style}>42-44 Steelhouse Lane</h3>
          <SpecTable rows={[
            ['Total units', '59'],
            ['Apartment types', '1 bed and 2 bed'],
            ['Tenure', 'Share of Freehold'],
            ['Completion', 'September 2027'],
            ['Payment structure', '£5,000 reservation fee. 10% deposit on exchange (less the reservation fee). A further 5% in March 2027, with the remaining balance due on completion.'],
            ['Warranty', 'ICW'],
          ]} />

          <h3 style={h3Style}>5 Steelhouse Ln</h3>
          <SpecTable rows={[
            ['Total units', '70'],
            ['Building', 'Period-style courtyard apartments created within former Barristers’ chambers, across five floors'],
            ['Setting', 'Steelhouse Lane Conservation Area, in the Snow Hill and Colmore business districts'],
          ]} />
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Why Buyers Look Here First</h2>
          <p style={pStyle}>Our projects sit on the same street, but each has its own character. This is exactly what sets them apart from other buildings in the city.</p>
          <p style={pStyle}>We work to offer you something different, and this is what you need to know about us:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>59 modern apartments at 42-44 Steelhouse Lane</li>
            <li style={liStyle}>Historic courtyard apartments at 5 Steelhouse Lane in a former legal office</li>
            <li style={liStyle}>A classic stone building featuring a landscaped courtyard and outdoor terraces</li>
            <li style={liStyle}>Conveniently located between the Snow Hill and Colmore business districts</li>
          </ul>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Shared Spaces and Facilities</h2>
          <p style={pStyle}>Day-to-day convenience is extremely important. It is just as important as the postcode and you must always consider this when choosing homes in Birmingham.</p>
          <p style={pStyle}>Well, with our project you can expect:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Spacious co-working space for working away from the kitchen table</li>
            <li style={liStyle}>Secure storage area for bike</li>
            <li style={liStyle}>Central courtyard with terraces</li>
            <li style={liStyle}>Keypad-controlled communal entrance with video intercom to each apartment</li>
            <li style={liStyle}>Complete CCTV monitoring of building entrances</li>
          </ul>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Getting Around</h2>
          <p style={pStyle}>Steelhouse Lane is in the heart of the city, so getting around the area is easy, and most of what you need is within a short walk.</p>
          <p style={pStyle}>Here&rsquo;s what your daily travel will look like:</p>

          <h3 style={h3Style}>On Foot:</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Aston University: 3 minutes</li>
            <li style={liStyle}>Snow Hill Station, Colmore Business District and HS2 / Curzon Street: 4 minutes each</li>
            <li style={liStyle}>Gun Quarter: 7 minutes</li>
            <li style={liStyle}>Moor Street Station: 8 minutes</li>
            <li style={liStyle}>Jewellery Quarter: 10 minutes</li>
            <li style={liStyle}>New Street Station and the Bullring: 12 minutes each</li>
          </ul>

          <h3 style={h3Style}>By Rail:</h3>
          <p style={pStyle}>Snow Hill is the closest station, located 4 minutes on foot. Moor Street and New Street are within 8 and 12 minutes. This gives you easy access to regional and national services.</p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Finish &amp; fittings</h2>
          <p style={pStyle}>These new homes in Birmingham are designed for a premium feel. Our properties are finished to a high standard and fitted with the details that make your everyday life easier.</p>
          <p style={pStyle}>These are the specifications of our 5 Steelhouse Ln.</p>

          <h3 style={h3Style}>Kitchens</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Fitted floor and wall units with square-edge laminate worktops</li>
            <li style={liStyle}>Electric cooker, hob and extractor</li>
            <li style={liStyle}>Built-in fridge/freezer</li>
            <li style={liStyle}>Integrated dishwasher and washer/dryer for every apartment</li>
            <li style={liStyle}>Under-cupboard LED lighting</li>
          </ul>

          <h3 style={h3Style}>Bathrooms</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Villeroy &amp; Boch sanitaryware and brassware</li>
            <li style={liStyle}>Mains pressure hot water</li>
            <li style={liStyle}>Shower tray and screen in one-beds, with an added bath in two-beds</li>
            <li style={liStyle}>Ceramic tiling, with part-tiled walls in wet areas</li>
            <li style={liStyle}>Recessed LED spotlights</li>
          </ul>

          <h3 style={h3Style}>Heating, Comfort &amp; Safety</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Smart, Wi-Fi-controlled electric heating</li>
            <li style={liStyle}>Fresh air ventilation system in every unit</li>
            <li style={liStyle}>Full fire sprinkler system, plus smoke and heat alarms</li>
            <li style={liStyle}>Soundproofed floors, walls, and upgraded noise-reducing windows</li>
          </ul>

          <h3 style={h3Style}>Interiors &amp; Connectivity</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Carpet in bedrooms and luxury vinyl tile throughout the rest of the property</li>
            <li style={liStyle}>Modern stainless steel hardware and USB-enabled sockets</li>
            <li style={liStyle}>TV and Freeview connections in the living room and bedroom</li>
            <li style={liStyle}>High-speed fiber internet ready in the living room</li>
          </ul>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>How buying works</h2>
          <p style={pStyle}>Many of our buyers choose new homes in Birmingham as rental investments, and that&rsquo;s actually quite a great choice. The properties are extremely sought after and the buying process is quite easy. Here&rsquo;s what the process looks like:</p>
          <ol style={stepListStyle}>
            <li style={liStyle}><strong>Step 1 - Reserve:</strong> Choose your apartment and secure it with a reservation fee.</li>
            <li style={liStyle}><strong>Step 2 - Legal review:</strong> Hire an independent solicitor to review your contract and guide you to exchange.</li>
            <li style={liStyle}><strong>Step 3 - Staged payments:</strong> Get in touch with us to know how our staged payment works.</li>
            <li style={liStyle}><strong>Step 4 - Completion:</strong> You do not have to pay the full amount at once. Pay in stages, with the remaining balance at completion, then arrange letting through our team.</li>
          </ol>
          <p style={pStyle}>Get in touch, and we&rsquo;ll go through availability and pricing with you.</p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Frequently asked questions</h2>
          <p style={pStyle}>Do you still have questions about our property? Then here are our most frequently asked questions.</p>
          {faqs.map(([q, a], i) => (
            <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '22px 24px', marginBottom: 16, border: '0.5px solid var(--border)' }}>
              <h3 style={{ fontSize: 17, color: 'var(--text)', marginBottom: 8, fontWeight: 600 }}>{q}</h3>
              <p style={{ ...pStyle, marginBottom: 0, fontSize: 14.5, lineHeight: 1.8 }}>{a}</p>
            </div>
          ))}
        </Reveal>
      </ArticleLayout>
      <Footer />
    </>
  )
}
