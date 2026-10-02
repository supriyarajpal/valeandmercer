import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'
import { Reveal } from '@/components/Reveal'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/london-new-homes-e14-docklands-2026'
const IMAGE = '/Jubilee Park Canary Wharf.jpg'
const IMAGE_ALT = 'Jubilee Park in Canary Wharf, E14'
const DATE_PUBLISHED = '2026-09-02'
const TITLE = 'New Homes in London: E14 & Docklands Buyer Guide 2026'
const DESCRIPTION = 'Find the ideal location for a new home in London with this 2026 guide to E14 and Docklands, covering connectivity, amenities and local appeal.'

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

const faqsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "How do flood risk and environmental factors impact a location's long-term value in the UK?",
      acceptedAnswer: { '@type': 'Answer', text: 'High flood risk increases home insurance premiums and mortgage friction, which can suppress resale value and deter prospective buyers.' },
    },
    {
      '@type': 'Question',
      name: 'What role do council tax bands play when evaluating the affordability of a new location?',
      acceptedAnswer: { '@type': 'Answer', text: 'Council tax bands vary significantly by local authority, adding unexpected recurring annual costs that impact your overall household budget.' },
    },
    {
      '@type': 'Question',
      name: 'How does mobile network coverage and broadband speed affect modern UK home choices?',
      acceptedAnswer: { '@type': 'Answer', text: 'Poor gigabit broadband or weak 5G coverage directly harms remote working feasibility, lowering property appeal for modern professional buyers.' },
    },
    {
      '@type': 'Question',
      name: 'Why should buyers check local conservation area restrictions before making an offer?',
      acceptedAnswer: { '@type': 'Answer', text: 'Conservation status limits exterior alterations, window replacements, and extensions, restricting how you can modify or add value to the property.' },
    },
    {
      '@type': 'Question',
      name: 'How do nearby prospective planning permissions affect existing residential street values?',
      acceptedAnswer: { '@type': 'Answer', text: 'Approved planning for high-density builds can obstruct views, increase local road congestion, and place additional pressure on existing amenities.' },
    },
  ],
}

const tableWrapStyle: React.CSSProperties = {
  overflowX: 'auto',
  margin: '28px 0 36px',
  borderRadius: 'var(--radius-md)',
  border: '0.5px solid var(--border)',
}
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }
const thStyle: React.CSSProperties = {
  padding: '12px 14px', textAlign: 'left', background: 'var(--surface-3)', color: 'var(--text)',
  fontWeight: 600, borderBottom: '1px solid var(--border)', fontSize: '12px', letterSpacing: '0.04em',
}
const tdStyle: React.CSSProperties = {
  padding: '12px 14px', color: 'var(--text-muted)', borderBottom: '0.5px solid var(--border)',
  verticalAlign: 'top', lineHeight: 1.7, fontSize: '13.5px',
}
const calloutStyle: React.CSSProperties = {
  background: 'var(--surface-2)', borderLeft: '3px solid #A0845C', padding: '22px 24px',
  borderRadius: '0 var(--radius-md) var(--radius-md) 0', margin: '28px 0',
}
const h2Style: React.CSSProperties = { color: 'var(--text)', marginTop: 48, marginBottom: 16, fontSize: 28, lineHeight: 1.25 }
const subheadStyle: React.CSSProperties = { color: 'var(--text)', marginTop: 28, marginBottom: 10, fontSize: 18, fontWeight: 600, lineHeight: 1.4 }
const pStyle: React.CSSProperties = { fontSize: 16, lineHeight: 1.95, color: 'var(--text)', opacity: 0.82, marginBottom: 20 }
const leadStyle: React.CSSProperties = { ...pStyle, fontSize: 18, opacity: 0.9 }
const liStyle: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.85, color: 'var(--text)', opacity: 0.82, marginBottom: 10 }
const tableLabelStyle: React.CSSProperties = { fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }
const noteStyle: React.CSSProperties = { fontSize: 12.5, fontStyle: 'italic', color: 'var(--text-faint)', marginTop: -20, marginBottom: 28 }

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={tableWrapStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
              {row.map((cell, j) => (
                <td key={j} style={j === 0 ? { ...tdStyle, fontWeight: 500, color: 'var(--text)' } : tdStyle}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={calloutStyle}>
      <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 8 }}>{label}</p>
      <p style={{ ...pStyle, marginBottom: 0, fontSize: 15 }}>{children}</p>
    </div>
  )
}

export default function E14DocklandsBuyerGuidePost() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsJsonLd) }} />
      <Navbar />
      <ArticleLayout
        category="Area Guide"
        title="How to Choose the Right Location for a New Home in London: 2026 E14 & Docklands Buyer Guide"
        meta="2 September 2026  ·  9 min read"
        image={IMAGE}
        imageAlt={IMAGE_ALT}
        signoff="Vale and Mercer Team  ·  2 September 2026"
      >
        <Reveal y={24} amount={0.25}>
          <p style={leadStyle}>
            Choosing a home based purely on layout often leads to nightmare commutes, missed school catchments, and weak resale value. Focus first on transport, safety, local amenities, and regeneration plans to secure a location that supports your lifestyle and long-term investment.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 10 }}>Key Takeaways</p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={liStyle}><strong>Location Permanence:</strong> Cosmetic interior flaws can be renovated, but a property&rsquo;s postcode permanently dictates daily commute times, school admissions, and resale liquidity. <strong>Peak-Hour Auditing:</strong> Always evaluate transit links, traffic congestion, and noise levels across three distinct windows: weekday morning rush hour, weekday evening, and weekend afternoon.</li>
              <li style={liStyle}><strong>Valuation Drivers:</strong> Floor level, aspect views, remaining lease length (minimum 80+ years), and building service charges impact property valuation far more than raw square footage.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <p style={pStyle}>
            Choosing where to live matters just as much as choosing what type of property to live in. A beautifully designed apartment loses its appeal fast if the commute is unbearable, the local school is oversubscribed, or resale demand in the area stalls.
          </p>
          <p style={pStyle}>
            If you are planning your next move, the location decisions ripple into daily life, long-term finances, and how easily a property can be sold or let in the future. This blog will present the practical factors, transport, safety, amenity, and growth potential, which makes a location better than others.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Your 3-Step Action Plan to Start Your Search</h2>
          <ol style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}><strong>Set Your Transport Boundary:</strong> Define your maximum door-to-office transit time (e.g., 30 minutes) and eliminate any postcode requiring more than 1 interchange.</li>
            <li style={liStyle}><strong>Download Local Planning &amp; Crime Reports:</strong> Review street-level data on Police.uk and upcoming developments on the local council planning portal.</li>
            <li style={liStyle}><strong>Book an In-Person Neighbourhood Walk:</strong> Spend 2 hours walking your target sub-area during peak rush hour before booking interior property viewings.</li>
          </ol>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Why Does Location Outweigh the Property Itself?</h2>
          <p style={pStyle}>
            A kitchen can be renovated, a garden can be landscaped, and a bathroom can be replaced. However, the postcode a home sits in is permanent. That&rsquo;s why estate agents repeat the phrase &ldquo;location, location, location&rdquo;.
          </p>
          <p style={pStyle}>
            This is because it directly shapes commute time, school access, resale demand, and daily quality of life. For example, homes within easy reach of a well-connected train station can easily command a higher price premium compared to less accessible properties nearby.
          </p>
          <p style={pStyle}>
            Use this quick-reference table to narrow down your area search based on your primary life stage, commute requirements, and budget:
          </p>
          <p style={tableLabelStyle}>Table 1: Which Location Suits Your Profile?</p>
          <Table
            headers={['Buyer Profile', 'Recommended Sub-Area (E14 & Environs)', 'Target Property Type', 'Primary Trade-Off']}
            rows={[
              ['Finance / Tech Corporate Professional', 'Wood Wharf / Canada Square', 'High-rise BTR or modern 1-bed flat', 'High premium per sq. ft. & higher service charges'],
              ['Budget-Conscious First-Time Buyer', 'Poplar / Blackwall', '1 or 2-bed flat in established blocks', 'Older aesthetic; fewer high-end concierge amenities'],
              ['Growing Family', 'Isle of Dogs (South) / Mudchute', '2-3 bed maisonette or terraced house', 'Slightly longer walk to the Elizabeth Line'],
              ['City-Fringe Commuter', 'Limehouse', 'Canal-side conversion or period flat', 'Higher competition for limited period stock'],
            ]}
          />
          <p style={pStyle}>
            If you are comparing a new home in the UK against your current address, the surrounding area, not just the floorplan, should be the first filter applied, long before viewings begin.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>How Do Transport Links and Commutes Impact UK Home Values?</h2>
          <p style={pStyle}>
            The frequency of services, walking distance to the nearest station, and access to major road networks all affect daily commute, convenience, and long-term resale appeal. The table below breaks down how different transport factors typically influence buyer demand and pricing.
          </p>
          <p style={tableLabelStyle}>Table 2: Transport Factors and Buyer Demand</p>
          <Table
            headers={['Transport factor', 'Typical impact on buyer demand', 'What to check']}
            rows={[
              ['Walking distance to station (under 10 min)', 'Consistently raises resale value and rental demand', 'Time the walk yourself at rush hour, not just on a map'],
              ['Train frequency at peak hours', 'Fewer than 4 trains/hour can deter commuter buyers', 'Check off-peak and weekend timetables too'],
              ['Road and motorway access', 'Valued by families and anyone driving for work', 'Check congestion charge zones and parking restrictions'],
              ['Cycle lanes and bus routes', 'Increasingly important for younger buyers and renters', 'Look for dedicated, segregated cycle infrastructure'],
            ]}
          />
          <h3 style={subheadStyle}>Real-World Commute Audit: The True Door-to-Desk Formula</h3>
          <p style={pStyle}>
            Never trust map distances or off-peak travel apps. Calculate your actual annual commuting strain using this 3-step formula:
          </p>
          <ol style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}><strong>Peak Platform Wait Time:</strong> Add 8 minutes to any DLR or Underground route calculation to account for peak-hour platform congestion and missed trains between 08:15 and 08:45.</li>
            <li style={liStyle}><strong>Weather-Impacted Walking Radius:</strong> Measure walking time from the station at 4 km/h (slush/rain pace) rather than standard 5 km/h walking speed. If a walk exceeds 12 minutes in heavy rain, factor in a £60-£100/month bus or cycle-hire budget.</li>
            <li style={liStyle}><strong>Annual Zone-Boundary Differential:</strong> Crossing from Zone 2 to Zone 3 can add over £350/year to an adult TfL Travelcard. Always verify whether your target station sits on a zone boundary before offering.</li>
          </ol>
          <Callout label="Tip">
            Visit your shortlisted area at three different times: a weekday morning rush, a weekday evening, and a weekend afternoon. Traffic, noise, and footfall shift dramatically across these windows; a street that feels perfect on Sunday can feel v different on Monday at 8am. Never rely solely on mapping applications or estate agent brochures. Check active routes directly on the TfL Elizabeth Line Travel Guide or National Rail Enquiries.
          </Callout>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Which Local Amenities and Safety Metrics Matter Most Before Buying?</h2>
          <p style={pStyle}>
            School catchment zones, healthcare access, and street-level safety dictate long-term quality of life and family resale demand.
          </p>
          <p style={pStyle}>Run through this pre-offer verification checklist:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}><strong>School Catchment Status:</strong> Check recent inspection performance on the Ofsted Official Register.</li>
            <li style={liStyle}><strong>Hyper-Local Safety Data:</strong> Audit street-specific incident rates via Police.uk Crime Data.</li>
            <li style={liStyle}><strong>Primary Care Infrastructure:</strong> Confirm capacity at local GP surgeries and urgent care units.</li>
            <li style={liStyle}><strong>Planning Pipeline:</strong> Search the Tower Hamlets Planning Portal for prospective multi-storey developments that could obstruct light or increase street parking congestion.</li>
          </ul>
          <h3 style={subheadStyle}>The 15-Minute Field Audit: What to Check During an In-Person Viewing</h3>
          <p style={pStyle}>
            Do not rely solely on online listings or agent claims. Perform these five physical checks during your 15-minute viewing slot:
          </p>
          <h4 style={{ ...subheadStyle, fontSize: 16 }}>Run the Indoor Mobile Signal Test</h4>
          <p style={pStyle}>
            Walk into the centre of the living space and interior bathrooms with your mobile phone. High-rise cladding and energy-efficient double glazing can cut indoor 4G/5G signals completely, requiring expensive Wi-Fi calling setups.
          </p>
          <h4 style={{ ...subheadStyle, fontSize: 16 }}>Audit Street-Level Noise &amp; Acoustic Sealing</h4>
          <p style={pStyle}>
            Open balcony doors or windows for 30 seconds to establish baseline ambient noise, then seal them. Listen specifically for low-frequency rumble from nearby DLR tracks, delivery loading bays, or active construction sites (e.g., Wood Wharf or South Quay phases).
          </p>
          <h4 style={{ ...subheadStyle, fontSize: 16 }}>Execute the Water &amp; Lift Efficiency Test</h4>
          <p style={pStyle}>
            If viewing on floor 10 or higher, turn on the kitchen and bathroom taps simultaneously to check booster pump pressure. On your way out, check how many working lifts serve the building, fewer than 2 working high-speed lifts per 80 units leads to 10-minute delays during morning rush hours.
          </p>
          <h4 style={{ ...subheadStyle, fontSize: 16 }}>Inspect the Micro-Neighbourhood at 10:00 PM</h4>
          <p style={pStyle}>
            Return to the street at night on a Thursday or Friday. Check street lighting, commercial bin storage cleanliness, and foot-traffic noise levels from nearby pubs or late-night venues.
          </p>
          <h4 style={{ ...subheadStyle, fontSize: 16 }}>Interview Local Shopkeepers</h4>
          <p style={pStyle}>
            Step into the nearest independent newsagent or coffee shop and ask: &ldquo;How has street parking and delivery access been over the past six months?&rdquo; Local business owners provide unfiltered truth about neighbourhood safety and road congestion.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>How Location Feeds Into Property Valuation</h2>
          <p style={pStyle}>
            Whether it&rsquo;s a property valuation in Canary Wharf or anywhere else in London, location is always the biggest driver, followed by condition, size, and interior specification. Here&rsquo;s how valuation drivers affect the price of your property.
          </p>
          <p style={tableLabelStyle}>Table 3: Valuation Drivers Tied to Location</p>
          <Table
            headers={['Valuation driver', 'How it affects price', 'Buyer/seller action']}
            rows={[
              ['Transport links and travel zone', 'Proximity to stations (Elizabeth line, Jubilee line) adds a measurable premium', 'Compare travel times, not just straight-line distance'],
              ['Floor level and aspect', 'Higher floors and river/dock views command higher per-sq-ft pricing in towers', 'Ask for comparable sales on the same floor band'],
              ['Building reputation and service charge', 'Well-managed developments with reasonable charges hold value better', 'Request the last two years of service charge accounts'],
              ['Lease length', 'Leases under 80 years can reduce mortgageability and value*', 'Check the remaining lease term before making an offer'],
              ['Local amenities and regeneration', 'Active regeneration (new retail, transport upgrades) often speeds up growth', 'Check council and TfL infrastructure plans'],
            ]}
          />
          <p style={noteStyle}>
            *Leases under 80 years historically trigger marriage value and mortgage restrictions; check remaining lease terms and post-2024 reform implications before offering.*
          </p>
          <Callout label="Use Case">
            A buyer comparing two similar one-bed flats near Canary Wharf found a £40,000 valuation gap explained almost entirely by floor level and view, one overlooked the dock, the other faced a service yar. The higher floor also let faster.
          </Callout>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Canary Wharf &amp; Docklands Streets: A Case Study in New-Build Locations</h2>
          <p style={pStyle}>
            Once purely a financial district, Canary Wharf has grown into a residential neighbourhood with parks, riverside walks, schools, and a retail centre. This made it a genuine option for anyone searching for a new home in the UK who wants strong transport links without sacrificing lifestyle amenities.
          </p>
          <p style={pStyle}>
            Buyers browsing flats for sale in Canary Wharf will notice significant price variation even within a few hundred metres, driven by factors like floor, aspect, building age, and proximity to the Elizabeth line versus the DLR.
          </p>
          <p style={tableLabelStyle}>Table 4: New-Build vs. Established Docklands Streets</p>
          <Table
            headers={['Factor', 'New-build developments (e.g. Wood Wharf)', 'Established Docklands streets']}
            rows={[
              ['Price per sq ft', 'Typically higher, reflecting new specification and amenities', 'Often lower, more room for value-add renovation'],
              ['Service charges', 'Higher, due to concierge, gym and pool facilities', 'Generally lower, fewer shared amenities'],
              ['Build quality and warranty', 'NHBC or equivalent 10-year warranty included', 'Depends on age; may need a survey for older wear'],
              ['Construction noise', 'Possible ongoing works nearby during growth phases', 'Typically settled, established streetscape'],
              ['Resale liquidity', 'Strong demand from professionals and investors', 'Varies more by specific street and building'],
            ]}
          />
          <Callout label="Caution">
            A low asking price near an active construction zone can be tempting, but ongoing building work often means years of noise, dust, and site traffic. Always ask developers for the full build-out timeline before committing, especially in multi-phase regeneration areas.
          </Callout>
          <p style={{ ...pStyle, padding: '16px 20px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
            Are you an investor purchasing a property to let out immediately? Review our step-by-step guide on{' '}
            <Link href="/blog/landlord-checklist-preparing-to-let" className="link-underline" style={{ color: '#A0845C', fontWeight: 500 }}>
              getting your property ready to let
            </Link>{' '}
            for London landlords to ensure full legal compliance prior to tenant placement.
          </p>
          <Callout label="Use Case">
            A family compared a smaller flat five minutes from an &lsquo;Outstanding&rsquo;-rated primary school against a larger new-build with a 45-minute school run, and chose the shorter commute, proof that catchment area can outweigh square footage for family buyers.
          </Callout>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Conclusion</h2>
          <p style={pStyle}>
            The right home is never about square footage or finishes, it&rsquo;s about whether the surrounding area supports how you actually want to live, commute, and grow into the future. Weighing transport, safety, amenities, and valuation trends before falling for a property helps avoid costly compromises later.
          </p>

          <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', margin: '36px 0', textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 12, fontWeight: 400 }}>
              Not Sure Where to Begin Your New Home Browsing in the UK?
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto 24px' }}>
              At Vale and Mercer, our local specialists can walk you through current listings, realistic price comparisons, and the neighbourhood details that never quite make it into an online listing. Get in touch to start your search with confidence!
            </p>
            <Link
              href="/buy"
              className="link-underline"
              style={{ display: 'inline-block', background: '#A0845C', color: '#fff', padding: '12px 28px', borderRadius: 'var(--radius-sm)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}
            >
              Start Your Search
            </Link>
          </div>

          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px', margin: '28px 0' }}>
            <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-faint)', lineHeight: 1.8, marginBottom: 0 }}>
              <strong>Legal &amp; Financial Disclaimer:</strong> Property valuations, leasehold regulations, and local planning frameworks change over time. This guide is provided for general informational purposes only and does not constitute formal legal, financial, or structural surveying advice under UK property law. Always consult a qualified solicitor and an RICS-accredited surveyor before exchanging contracts.
            </p>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>FAQs</h2>
          {[
            ["How do flood risk and environmental factors impact a location's long-term value in the UK?", 'High flood risk increases home insurance premiums and mortgage friction, which can suppress resale value and deter prospective buyers.'],
            ['What role do council tax bands play when evaluating the affordability of a new location?', 'Council tax bands vary significantly by local authority, adding unexpected recurring annual costs that impact your overall household budget.'],
            ['How does mobile network coverage and broadband speed affect modern UK home choices?', 'Poor gigabit broadband or weak 5G coverage directly harms remote working feasibility, lowering property appeal for modern professional buyers.'],
            ['Why should buyers check local conservation area restrictions before making an offer?', 'Conservation status limits exterior alterations, window replacements, and extensions, restricting how you can modify or add value to the property.'],
            ['How do nearby prospective planning permissions affect existing residential street values?', 'Approved planning for high-density builds can obstruct views, increase local road congestion, and place additional pressure on existing amenities.'],
          ].map(([q, a], i) => (
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
