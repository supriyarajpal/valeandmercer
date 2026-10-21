import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'
import { Reveal } from '@/components/Reveal'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/guide-to-renting-near-canary-wharf'
const IMAGE = '/Crossrail Place roof garden.jpg'
const IMAGE_ALT = 'The roof garden at Crossrail Place, Canary Wharf'
const DATE_PUBLISHED = '2026-09-02'
const TITLE = 'Renting Near Canary Wharf in 2026: A Complete Area Guide'
const DESCRIPTION = 'A complete 2026 guide to renting near Canary Wharf, covering apartment costs, popular areas, transport, amenities and essential factors for renters.'

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
      name: 'Are utilities and council tax included in the monthly rent price in Canary Wharf?',
      acceptedAnswer: { '@type': 'Answer', text: 'Standard rents exclude utilities and council tax. However, select Build-to-Rent schemes in Wood Wharf include high-speed Wi-Fi or gym access within headline prices.' },
    },
    {
      '@type': 'Question',
      name: 'What local amenities and green spaces are available for families living in Canary Wharf?',
      acceptedAnswer: { '@type': 'Answer', text: 'Residents enjoy Jubilee Park, Harbour Quay Gardens, over 16 acres of open space, waterfront boardwalks, roof gardens, and modern indoor shopping malls.' },
    },
    {
      '@type': 'Question',
      name: 'How noisy is Canary Wharf during evenings and weekends compared to central London?',
      acceptedAnswer: { '@type': 'Answer', text: 'Unlike midtown commercial hubs, Canary Wharf remains exceptionally quiet and secure on weekends, offering peaceful dockside walks while maintaining open restaurants and shops.' },
    },
    {
      '@type': 'Question',
      name: 'Can I keep pets in rental apartments across Canary Wharf developments?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most dedicated Build-to-Rent developments are pet-friendly, and UK renting laws prohibit landlords from unreasonably withholding consent for domestic pets.' },
    },
    {
      '@type': 'Question',
      name: 'What parking options exist for rental residents who own a personal vehicle?',
      acceptedAnswer: { '@type': 'Answer', text: 'On-site underground parking is available in high-rise towers for an extra monthly fee, though low-emission public transport is generally preferred.' },
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

export default function GuideToRentingNearCanaryWharfPost() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsJsonLd) }} />
      <Navbar />
      <ArticleLayout
        category="Area Guide"
        title="A Complete Guide to Renting Near Canary Wharf in 2026: Apartment Costs, Popular Areas and Key Factors"
        meta="2 September 2026  ·  9 min read"
        image={IMAGE}
        imageAlt={IMAGE_ALT}
        signoff="Vale and Mercer Team  ·  2 September 2026"
      >
        <Reveal y={24} amount={0.25}>
          <p style={leadStyle}>
            Finding a flat near Canary Wharf often means high rents, hidden service charges, and fast-moving stock. By exploring neighbouring sub-areas, understanding statutory deposit caps, and negotiating outside peak seasons, renters can secure high-quality apartments while staying strictly within budget.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 10 }}>Key Takeaways</p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={liStyle}><strong>Prime Location and Connectivity:</strong> Canary Wharf provides high-spec residential living with fast Elizabeth Line connections to central London and direct access to top amenities.</li>
              <li style={liStyle}><strong>Varied Pricing Across Sub-Areas:</strong> Rent ranges from £1,700 for studios to over £4,800 for three-beds, with budget-friendly options in nearby Poplar and Limehouse.</li>
              <li style={liStyle}><strong>Essential Tenant Preparation:</strong> Fast-moving stock requires advance referencing setup, awareness of statutory deposit caps, and accounting for all occupancy costs.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <p style={pStyle}>
            Canary Wharf is London&rsquo;s second-largest financial district that has developed into a full residential neighbourhood; it&rsquo;s not just an office estate anymore. While some people buy permanent homes, others also consider rentals.
          </p>
          <p style={pStyle}>
            The Elizabeth Line and the Wood Wharf regeneration can be seen as key drivers of rising rental demand in Canary Wharf. This blog will explain what rent actually costs, which nearby areas suit different renters, and what to check before signing.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Why Renters Are Choosing Canary Wharf</h2>
          <p style={pStyle}>
            Canary Wharf is known to be one of London&rsquo;s safest areas to live, as reported by both police and locals. With a lot of shops on the doorstep, exhibitions and public art, over 16 acres of green spaces and accessibility, Canary Wharf is a place that suits every lifestyle.
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Zero or short commute for Wharf-based workers; the Elizabeth Line cuts the journey to Paddington to around 17 minutes. This is a benefit for students and working people.</li>
            <li style={liStyle}>Riverside setting, malls, gyms, and concierge services concentrated in the newer towers for families and roommates alike.</li>
            <li style={liStyle}>Growing family infrastructure is also a credibility point; e.g., Mulberry Wood Wharf Primary School in Wood Wharf (which is suitable for families with young children).</li>
          </ul>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>How Much Is the Rent in Apartments Near Canary Wharf?</h2>
          <p style={pStyle}>
            Your rent can be anything between £1,700 and £4,800. If you are unsure about how much is the rent in apartments near Canary Wharf, the table below shows the typical rates of different property types.
          </p>
          <p style={pStyle}>
            The price range, moreover, depends on multiple factors like the floor height, river view, concierge/gym provision, and whether it is a new-build or older stock.
          </p>
          <p style={tableLabelStyle}>Table 1: Average Monthly Rent Near Canary Wharf by Property Type</p>
          <Table
            headers={['Property Type', 'Typical Monthly Rent', 'Notes']}
            rows={[
              ['Studio', '£1,700-£2,700', 'Best-value entry point; smaller developments off the main estate'],
              ['1-Bedroom Flat', '£2,400 average; up to £3,800 in prime towers', 'Most in-demand size among single professionals'],
              ['2-Bedroom Flat', '£3,200-£3,900', 'Popular with sharers and couples'],
              ['3-Bedroom Flat', '£4,200-£4,800', 'Limited stock; mostly Wood Wharf/riverside new-builds'],
              ['2-Bed House (Isle of Dogs/Poplar)', '£2,900-£3,200', 'For renters wanting a garden or extra space'],
            ]}
          />
          <Callout label="Tip">
            Rents near Canary Wharf typically soften slightly from November to January as corporate relocations slow down. If your move date is flexible, negotiating outside the March-September peak season can shave several percentage points off the asking rent on comparable flats.
          </Callout>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>The True Monthly Cost of Occupancy (Beyond Base Rent)</h2>
          <p style={pStyle}>
            Headline rent only accounts for around 70% of your actual monthly housing spend in E14. High-rise towers and district energy networks introduce unique overheads you must budget for:
          </p>
          <p style={tableLabelStyle}>Table 2: Occupancy cost breakdown near Canary Wharf</p>
          <Table
            headers={['Monthly Expense Category', 'Average E14 Cost', 'Key Factor / Watch-Out']}
            rows={[
              ['Tower Hamlets Council Tax', '£130-£220/mo', 'Most 1 and 2-bed flats fall into Band D (£1,626/yr) or Band E (£1,987/yr).'],
              ['District Heating Network (HIU)', '£90-£180/mo', 'Many high-rises use un-regulated heat networks (e.g., Switch2, E.ON). Ask for peak winter bill history.'],
              ['Hyperfast Broadband (FTTP)', '£30-£50/mo', 'Check if the block is locked to single providers like Hyperoptic or Community Fibre.'],
              ['Underground Parking Space', '£150-£300/mo', 'Rarely included in headline rent; requires a separate license agreement.'],
              ['Water and General Utilities', '£40-£70/mo', 'Individually metered via Thames Water.'],
            ]}
          />
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Popular Areas to Rent Near Canary Wharf</h2>
          <p style={pStyle}>
            There are numerous areas in Canary Wharf that you can consider for your rental apartment. But first, if you want to know how to get a flat in Canary Wharf, here is a checklist that you can consider:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Register with agencies covering off-market and build-to-rent stock</li>
            <li style={liStyle}>Keep ID/income proof/references ready in advance</li>
            <li style={liStyle}>Be prepared to view and offer within days since well-priced flats let quickly</li>
          </ul>
          <p style={pStyle}>Now, the following are a few sub-areas that you can try checking out to rent an apartment.</p>
          <p style={tableLabelStyle}>Table 3: Popular Areas Near Canary Wharf Compared</p>
          <Table
            headers={['Area', 'Commute to Canary Wharf', 'Rent Level', 'Best For']}
            rows={[
              ['Wood Wharf / Canada Square', '0-5 mins (on estate)', 'Highest', 'Zero-commute professionals wanting concierge living'],
              ['South Quay and Crossharbour', '5-10 mins (DLR)', 'High', 'Quieter towers, build-to-rent schemes'],
              ['Isle of Dogs (wider)', '5-15 mins', 'Mid-High', 'Parks, families, mixed housing stock'],
              ['Poplar', '10-15 mins (DLR)', 'Mid', 'Value-conscious renters, traditional streets'],
              ['Limehouse', '10-20 mins (DLR/Overground)', 'Mid', 'Canal-side conversions, City-fringe commuters'],
              ['Blackwall', '5-10 mins (DLR)', 'Mid-High', 'New-build river-view flats'],
            ]}
          />
          <p style={pStyle}>Furthermore, as a renter, you should know the following legal aspects:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Holding deposit capped at one week&rsquo;s rent</li>
            <li style={liStyle}>Security deposit capped at five weeks&rsquo; rent (for annual rent under £50,000)</li>
          </ul>
          <p style={pStyle}>
            These prices are bound to change based on your property type and location, the features and amenities they offer, and what you need additionally.
          </p>
          <Callout label="Use Case">
            A junior analyst starting at a Canary Wharf bank wants a five-minute walk to work and gym access. Wood Wharf or Canada Square one-beds fit best, paying a premium for zero commute, concierge security, and on-site dining after long trading-desk hours.
          </Callout>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Key Factors to Weigh Before You Rent</h2>
          <p style={pStyle}>Here are the factors that you should weigh before you rent an apartment in Canary Wharf:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}><strong>Transport:</strong> Compare Elizabeth Line, Jubilee Line, and DLR journey times from each sub-area</li>
            <li style={liStyle}><strong>Building type:</strong> New-build build-to-rent vs converted/older stock, a trade-off between amenities and service charge exposure</li>
            <li style={liStyle}><strong>Tenancy terms under the Renters&rsquo; Rights Act 2025:</strong> The Act has been effective from May 2026 with the shift from fixed-term ASTs to periodic (rolling) tenancies, notice period changes, and deposit caps</li>
            <li style={liStyle}><strong>Total cost of occupancy:</strong> Rent + service charge (if payable by tenant) + council tax band + parking, not just headline rent</li>
            <li style={liStyle}><strong>Lifestyle fit:</strong> Malls, gyms, riverside walks for professionals; parks and school catchments for families.</li>
          </ul>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Renters&rsquo; Rights and Legal Protections in E14 (Tower Hamlets)</h2>
          <p style={pStyle}>
            Under the Renters&rsquo; Rights Act (enacted May 2026), private renting across Canary Wharf and the wider London Borough of Tower Hamlets is governed by strict statutory tenant protections:
          </p>
          <h3 style={subheadStyle}>End of No-Fault Evictions (Section 21 Abolished)</h3>
          <p style={pStyle}>
            All tenancies automatically operate as open-ended, rolling periodic tenancies. Landlords can no longer evict tenants without specific statutory grounds under Section 8 (such as serious rent arrears or proven intent to sell/move in).
          </p>
          <h3 style={subheadStyle}>1-Month Upfront Rent Cap</h3>
          <p style={pStyle}>
            Landlords and letting agents are legally forbidden from asking for or accepting more than 1 month&rsquo;s rent in advance. Demands for 6 or 12 months&rsquo; rent upfront are strictly illegal, and no rent can be collected until the agreement is fully signed.
          </p>
          <h3 style={subheadStyle}>Bidding Wars Outlawed</h3>
          <p style={pStyle}>
            Agents and landlords are prohibited from accepting or soliciting offers higher than the advertised listing price.
          </p>
          <h3 style={subheadStyle}>Statutory Deposit Caps</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
            <li style={liStyle}><strong>Holding Deposit:</strong> Capped at a maximum of 1 week&rsquo;s rent.</li>
            <li style={liStyle}><strong>Security Deposit:</strong> Capped at 5 weeks&rsquo; rent for properties where annual rent is under £50,000 (or 6 weeks if annual rent exceeds £50,000).</li>
          </ul>
          <p style={pStyle}>
            Deposits must be registered in a government-backed protection scheme (TDS, DPS, or MyDeposits) within 30 days of receipt.
          </p>
          <h3 style={subheadStyle}>Controlled Rent Increases</h3>
          <p style={pStyle}>
            Rent rises can only happen once per year via a formal Section 13 notice with 2 months&rsquo; advance warning. Tenants have the legal right to challenge unfair increases at a First-tier Tribunal if they exceed prevailing local market rates.
          </p>
          <h3 style={subheadStyle}>Right to Request Pets</h3>
          <p style={pStyle}>
            Landlords must consider pet requests on a case-by-case basis and cannot unreasonably refuse them.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>The 10-Minute E14 Apartment Viewing Audit</h2>
          <p style={pStyle}>
            Before submitting a holding deposit (capped at 1 week&rsquo;s rent by law), run through these physical checks during your viewing:
          </p>
          <h3 style={subheadStyle}>Mobile Signal Test</h3>
          <p style={pStyle}>
            Step into the centre of the living room and bathroom with your phone. Cladding and energy-efficient double glazing in modern high-rises can block 4G/5G signals completely.
          </p>
          <h3 style={subheadStyle}>Acoustic Sealing Check</h3>
          <p style={pStyle}>
            Open and close the balcony doors/windows. Check if heavy construction noise from nearby development sites (e.g., ongoing Wood Wharf or South Quay phases) penetrates the glazing.
          </p>
          <h3 style={subheadStyle}>Lift-to-Unit Ratio</h3>
          <p style={pStyle}>
            If viewing above floor 15, count the working lifts. Buildings with fewer than 3 high-speed lifts per 100 apartments lead to 5-10 minute commute delays during 08:00-09:00 peak hours.
          </p>
          <h3 style={subheadStyle}>Water Pressure and Hot Water Delay</h3>
          <p style={pStyle}>
            Turn on the shower and kitchen taps simultaneously to check pressure, particularly on floors 20 and above.
          </p>
          <h3 style={subheadStyle}>Cladding and Fire Safety Status</h3>
          <p style={pStyle}>
            For towers over 18 metres, ask the agent to confirm the building has an up-to-date EWS1 form (External Wall System Fire Review) with an A1, A2, or B1 rating.
          </p>
          <Callout label="Use Case">
            A couple relocating with a toddler wants outdoor space without losing DLR access. A two-bedroom house or ground-floor flat in Poplar or the wider Isle of Dogs balances park proximity, school catchments, and rent roughly 15-20% below Wood Wharf equivalents.
          </Callout>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Renting vs. Buying Near Canary Wharf</h2>
          <p style={pStyle}>
            To understand the difference and make your decision, you should know the answers to the following:
          </p>
          <h3 style={subheadStyle}>How much is a flat in Canary Wharf to buy?</h3>
          <p style={pStyle}>
            Purchase prices for flats typically range from £350,000 for entry-level studios to over £600,000 for two-bedroom units, while premium penthouses exceed £1,000,000. Buyers must factor in significant service charges alongside traditional upfront costs.
          </p>
          <h3 style={subheadStyle}>Are Canary Wharf flats selling?</h3>
          <p style={pStyle}>
            Yes, the market maintains steady transaction activity. New-build pipelines like Wood Wharf and One Park Drive see consistent movement, propelled by a healthy mix of owner-occupier demand and yield-seeking investors.
          </p>
          <h3 style={subheadStyle}>Is it a good idea to buy a flat in Canary Wharf?</h3>
          <p style={pStyle}>
            It depends entirely on your time horizon and local certainty. Renting first offers a lower-risk way to test the commute, amenities, and lifestyle before committing capital.
          </p>
          <p style={pStyle}>
            Check the table below to understand the differences between renting and buying an apartment in Canary Wharf based on specific factors.
          </p>
          <p style={tableLabelStyle}>Table 4: Renting vs Buying a Flat Near Canary Wharf</p>
          <Table
            headers={['Factor', 'Renting', 'Buying']}
            rows={[
              ['Upfront cost', "5 weeks' deposit + first month's rent", '5-15% deposit + stamp duty + legal fees'],
              ['Monthly outgoing', 'Fixed rent (sometimes incl. some bills)', 'Mortgage + service charge + ground rent'],
              ['Flexibility', 'Can move on notice after the initial period', 'Tied in until resale'],
              ['Market exposure', 'None, landlord bears price risk', 'Exposed to local price and yield movements'],
              ['Best suited to', 'Testing the area, short-to-medium-term work moves', 'Longer-term commitment, investors seeking yield'],
            ]}
          />
          <Callout label="Caution">
            New-build towers near Canary Wharf often carry service charges of £3,000-£6,000+ a year included in rent or mortgage costs as they are payable by the landlords. Always ask for the last two years&rsquo; service charge accounts before committing, since costs can rise sharply year on year in newer developments.
          </Callout>
          <p style={{ ...pStyle, padding: '16px 20px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
            Thinking about buying instead? Read our guide on{' '}
            <Link href="/blog/tips-for-buying-flats-in-canary-wharf" className="link-underline" style={{ color: '#A0845C', fontWeight: 500 }}>
              Buying Flats in Canary Wharf: What Buyers Need to Know
            </Link>.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Conclusion</h2>
          <p style={pStyle}>
            Canary Wharf is good for renters who compare sub-areas and decide quickly on well-priced stock. Rather than blindly trusting your agent, or taking whatever you are shown, match with your budget, your location preferences, the amenities you need, and the home&rsquo;s features before you sign the rental papers.
          </p>

          <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', margin: '36px 0', textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 12, fontWeight: 400 }}>
              Planning to Rent an Apartment in Canary Wharf? We Can Help You Find One!
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto 24px' }}>
              At Vale and Mercer, our local team will assist you in finding your choice of rental home in Canary Wharf. Contact us today to start the search!
            </p>
            <Link
              href="/let"
              className="link-underline"
              style={{ display: 'inline-block', background: '#A0845C', color: '#fff', padding: '12px 28px', borderRadius: 'var(--radius-sm)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}
            >
              Talk to Our Lettings Team
            </Link>
          </div>

          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px', margin: '28px 0' }}>
            <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-faint)', lineHeight: 1.8, marginBottom: 0 }}>
              <strong>Legal and Financial Disclaimer:</strong> Rental rates, council tax bands, and tenancy regulations are subject to market shifts. This guide is for informational purposes only and does not constitute formal legal advice under the Housing Act or Renters&rsquo; Rights Act.
            </p>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>FAQs</h2>
          {[
            ['Are utilities and council tax included in the monthly rent price in Canary Wharf?', 'Standard rents exclude utilities and council tax. However, select Build-to-Rent schemes in Wood Wharf include high-speed Wi-Fi or gym access within headline prices.'],
            ['What local amenities and green spaces are available for families living in Canary Wharf?', 'Residents enjoy Jubilee Park, Harbour Quay Gardens, over 16 acres of open space, waterfront boardwalks, roof gardens, and modern indoor shopping malls.'],
            ['How noisy is Canary Wharf during evenings and weekends compared to central London?', 'Unlike midtown commercial hubs, Canary Wharf remains exceptionally quiet and secure on weekends, offering peaceful dockside walks while maintaining open restaurants and shops.'],
            ['Can I keep pets in rental apartments across Canary Wharf developments?', 'Most dedicated Build-to-Rent developments are pet-friendly, and UK renting laws prohibit landlords from unreasonably withholding consent for domestic pets.'],
            ['What parking options exist for rental residents who own a personal vehicle?', 'On-site underground parking is available in high-rise towers for an extra monthly fee, though low-emission public transport is generally preferred.'],
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
