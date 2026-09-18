import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'
import { Reveal } from '@/components/Reveal'

const SITE_URL = 'https://valeandmercer.co.uk'
const SLUG = '/blog/how-to-value-property-before-selling'
const IMAGE = '/Screenshot 2026-09-18 at 7.03.15 PM.png'
const IMAGE_ALT = 'Property Valuation'
const DATE_PUBLISHED = '2026-08-27'
const TITLE = 'How to Value Your Property Before Putting It on the Market'
const DESCRIPTION = 'Understand how to value your property before selling, including key factors, valuation methods, and steps to help you set a realistic asking price.'

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
      name: 'How long is a property valuation valid for in London?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Estate agent appraisals reflect current market conditions and stay relevant for roughly three to six months, while RICS formal valuations usually last three months.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I renovate my London property right before getting a valuation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Focus on essential structural repairs and decluttering. Major expensive renovations rarely yield a full return on investment compared to simple presentation fixes before selling.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between an asking price and a valuation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A valuation establishes the actual estimated market value based on evidence, whereas an asking price is a strategic marketing figure chosen to attract buyers.',
      },
    },
    {
      '@type': 'Question',
      name: "How does a property's Energy Performance Certificate (EPC) impact its valuation?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Higher EPC ratings boost valuation appeal as buyers increasingly prioritise energy efficiency, lower running utility costs, and potential green mortgage benefits when bidding.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I challenge a low mortgage lender valuation if it impacts my sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can request a revaluation by providing your lender with strong evidence of recent, directly comparable sales within a half-mile radius.',
      },
    },
  ],
}

const tableWrapStyle: React.CSSProperties = {
  overflowX: 'auto',
  margin: '28px 0 36px',
  borderRadius: 'var(--radius-md)',
  border: '0.5px solid var(--border)',
}
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13.5px',
}
const thStyle: React.CSSProperties = {
  padding: '12px 14px',
  textAlign: 'left',
  background: 'var(--surface-3)',
  color: 'var(--text)',
  fontWeight: 600,
  borderBottom: '1px solid var(--border)',
  fontSize: '12px',
  letterSpacing: '0.04em',
}
const tdStyle: React.CSSProperties = {
  padding: '12px 14px',
  color: 'var(--text-muted)',
  borderBottom: '0.5px solid var(--border)',
  verticalAlign: 'top',
  lineHeight: 1.7,
  fontSize: '13.5px',
}
const calloutStyle: React.CSSProperties = {
  background: 'var(--surface-2)',
  borderLeft: '3px solid #A0845C',
  padding: '22px 24px',
  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
  margin: '28px 0',
}
const h2Style: React.CSSProperties = {
  color: 'var(--text)',
  marginTop: 48,
  marginBottom: 16,
  fontSize: 28,
  lineHeight: 1.25,
}
const pStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.95,
  color: 'var(--text)',
  opacity: 0.82,
  marginBottom: 20,
}
const liStyle: React.CSSProperties = {
  fontSize: 15.5,
  lineHeight: 1.85,
  color: 'var(--text)',
  opacity: 0.82,
  marginBottom: 10,
}

export default function HowToValuePropertyPost() {
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
        category="Sales Advice"
        title="How to Value Your Property Before Putting It on the Market"
        meta="27 August 2026  ·  7 min read"
        image={IMAGE}
        imageAlt={IMAGE_ALT}
        signoff="Vale and Mercer Team  ·  27 August 2026"
      >
        <Reveal y={24} amount={0.25}>
          <div style={{ ...calloutStyle, background: 'var(--surface-2)', borderLeft: '3px solid #A0845C' }}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 10 }}>
              Key Takeaways
            </p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={liStyle}><strong>Compare multiple agent appraisals:</strong> Invite two to three local agents and cross-examine their valuations against actual sold property data</li>
              <li style={liStyle}><strong>Select the right valuation type:</strong> Use free agent appraisals for listing, but choose certified RICS surveys for legal or tax matters</li>
              <li style={liStyle}><strong>Factor in key value drivers:</strong> Critical structural elements like lease length under 80 years impact price far more than minor decor updates</li>
            </ul>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <p style={pStyle}>
            Pricing a London home isn't easy; it can go wrong at any time. If you underprice it, you lose money; if you overprice it, it sits unsold and goes stale on portals. Apart from proper pricing strategies, you will need a local guide, not just a listings agent.
          </p>
          <p style={pStyle}>
            This blog will tell you how to get a property valuation before selling your property. Learn the routes to secure a reliable number, the current London pricing context, and what a valuation is actually used for.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Why Get a Property Valuation Before You Sell It</h2>
          <p style={pStyle}>
            Learning how to get a property valuation that actually reflects the current London market is the single biggest factor in how quickly your home sells and for how much. It never works with just hopeful guesses.
          </p>
          <p style={pStyle}>
            A valuation isn't just a headline price; it sets the asking price, informs mortgage borrowing power for the seller's next purchase, and feeds into Stamp Duty and tax calculations.
          </p>
          <p style={pStyle}>
            Most overpriced London homes are markedly less likely to sell within a normal marketing period, so accuracy protects both timeline and final price.
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Types of Property Valuation Available in London</h2>
          <p style={pStyle}>
            There are 4 routes you, as a seller, can take: fast online estimates, estate agent appraisals, formal RICS Red Book surveys, and mortgage lender valuations. But it depends on whether you need quick selling advice or legally defensible evidence.
          </p>
          <p style={pStyle}>
            For example, if you are asking &ldquo;how can I get a valuation on my house&rdquo; to prepare for a sale, an estate agent appraisal is the standard choice. Agents visit in person, assess the home's condition, and benchmark it against recent local comparable sales to recommend an asking price.
          </p>
          <p style={pStyle}>
            For legal, tax, or formal lending requirements (such as probate, divorce, or Capital Gains Tax), a RICS Chartered Surveyor must conduct a formal Red Book valuation.
          </p>
          <p style={pStyle}>
            Meanwhile, automated online estimates provide a quick baseline, and lender valuations exist strictly to assess risk for mortgage approval. Different valuations exist for different purposes, so selling advice is different from legal/lending evidence.
          </p>

          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            Table 1: Types of Property Valuations
          </p>
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Valuation Type</th>
                  <th style={thStyle}>Typical Cost (Subject to Change)</th>
                  <th style={thStyle}>Turnaround</th>
                  <th style={thStyle}>Best For</th>
                  <th style={thStyle}>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Online instant estimate', 'Free', 'Under 5 minutes', 'A rough ballpark before speaking to anyone', 'Low; algorithm-based, no site visit'],
                  ['Estate agent market appraisal', 'Free (no obligation)', 'Same day to 2-3 days', 'Sellers ready to price and list', 'Good; based on local comparables and buyer demand'],
                  ['RICS Chartered Surveyor valuation', '£200-£600+', '1-2 weeks', 'Probate, divorce, tax, or formal lending evidence', 'High; independently certified, legally defensible'],
                  ['Mortgage lender valuation', 'Often included in application fee', 'Arranged by lender, 1-3 weeks', 'Confirming a figure for a mortgage offer', "Conservative; protects the lender's risk, not the seller"],
                ].map(([vt, tc, ta, bf, ac], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--text)' }}>{vt}</td>
                    <td style={{ ...tdStyle, color: '#A0845C' }}>{tc}</td>
                    <td style={tdStyle}>{ta}</td>
                    <td style={tdStyle}>{bf}</td>
                    <td style={tdStyle}>{ac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 8 }}>
              Pro Tip
            </p>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: 15 }}>
              Book two or three estate-agent appraisals rather than one. Compare the evidence each agent brings, not just the headline figure; the highest number isn't automatically the most accurate.
            </p>
          </div>

          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 8 }}>
              Beware of &ldquo;Buying the Listing&rdquo;
            </p>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: 15 }}>
              Some estate agents deliberately inflate their valuation by 5% to 10% simply to win your instruction over local competitors. After 4 to 6 weeks on portal listings with zero viewings, they will pressure you to reduce the price. If one agent's figure is significantly higher than the rest, demand recent, directly comparable sold evidence before signing.
            </p>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>How to Find Out What Your Property Is Worth, Step by Step</h2>
          <p style={pStyle}>
            Determining an accurate market value requires an evidence-based approach rather than guesswork.
          </p>
          <p style={pStyle}>
            If you are asking &ldquo;how can I find out what my property is worth,&rdquo; following a clear, sequential process ensures you price your home competitively while protecting your equity. Here's what you should do:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}>Start by researching recent sale prices on HM Land Registry and portal sold filters for similar properties within a half-mile radius</li>
            <li style={liStyle}>Use an online valuation tool to establish a broad initial range</li>
            <li style={liStyle}>Next, invite two to three local estate agents to conduct in-person appraisals</li>
            <li style={liStyle}>Cross-examine their proposed figures against the comparable sales data they provide</li>
            <li style={liStyle}>Finally, determine whether a formal RICS survey is required for legal or tax purposes</li>
          </ul>

          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            Table 2: Steps to Find Your Property's Worth
          </p>
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Step</th>
                  <th style={thStyle}>What It Involves</th>
                  <th style={thStyle}>Time Needed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1. Check sold prices nearby', "Search HM Land Registry and portal 'sold' filters for comparable properties within 0.5 miles, sold in the last 6-12 months", '15-30 minutes'],
                  ['2. Run an online estimate', 'Use a portal valuation tool for a rough starting range; treat it as a ballpark, not a figure to list at', '5 minutes'],
                  ['3. Book 2-3 agent appraisals', 'Invite local agents to visit, assess condition and location, and explain the evidence behind their figure', '1 hour per visit'],
                  ['4. Compare and question the evidence', "Ask each agent for comparable sales, not just an opinion; query any figure that's an outlier", '30-60 minutes'],
                  ['5. Commission a RICS survey if needed', 'For probate, divorce, tax or lending matters requiring a formally evidenced figure', '1-2 weeks'],
                ].map(([step, involves, time], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--text)' }}>{step}</td>
                    <td style={tdStyle}>{involves}</td>
                    <td style={{ ...tdStyle, color: '#A0845C' }}>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 8 }}>
              Use Case
            </p>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: 15 }}>
              A Shoreditch two-bed flat owner ran an online estimate, then booked three local agents. Two figures aligned within £15,000; the third was £40,000 higher with no comparable evidence, so it was discounted.
            </p>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Pre-Valuation Preparation Checklist</h2>
          <p style={pStyle}>
            Before agents arrive for an in-person appraisal, assemble these documents to ensure you get the most accurate valuation possible:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            <li style={liStyle}><strong>Leasehold Details (Flats):</strong> Exact years remaining on the lease, current annual ground rent, and your latest service charge statement.</li>
            <li style={liStyle}><strong>Floor Plan &amp; EPC:</strong> An existing floor plan (if available) and your current Energy Performance Certificate (EPC) rating.</li>
            <li style={liStyle}><strong>Capital Improvements Log:</strong> Invoices or receipts for major upgrades made in the last 5 years (e.g., new boiler, roof repairs, double glazing, kitchen refit).</li>
            <li style={liStyle}><strong>Planning Certificates:</strong> Copies of planning permissions or building control sign-offs for any loft conversions, extensions, or structural alterations.</li>
          </ul>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Questions You Must Ask Each Estate Agent During Their Visit</h2>
          <p style={pStyle}>
            Don't just accept an agent's headline number, test their valuation logic with these five direct questions:
          </p>
          <ol style={{ paddingLeft: 20, marginBottom: 28 }}>
            <li style={liStyle}>
              <strong>Can you show me 3 properties within 0.5 miles sold in the last 3 months that justify this asking price?</strong><br />
              This verifies real sold evidence vs. optimistic guessing.
            </li>
            <li style={liStyle}>
              <strong>What is your recommended listing price versus the realistic achieved completion price?</strong><br />
              Helps you calculate your actual downstream budget.
            </li>
            <li style={liStyle}>
              <strong>What is your standard sole-agency tie-in period and notice window?</strong><br />
              Never agree to a tie-in period longer than 4 to 6 weeks.
            </li>
            <li style={liStyle}>
              <strong>What specific marketing channels will you use to reach active buyers beyond Rightmove and Zoopla?</strong><br />
              Tests proactive buyer outreach.
            </li>
            <li style={liStyle}>
              <strong>What low-cost cosmetic fixes would yield the highest return before we take photos?</strong><br />
              Tests their local market expertise.
            </li>
          </ol>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>London Market Context: What Is Your Property Actually Worth Right Now?</h2>
          <p style={pStyle}>
            How much is a flat in London? Well, London flat prices vary largely by borough, and the London-wide average is only a starting reference point, not a substitute for a local comparable.
          </p>

          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            Table 3: Average Pricing
          </p>
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Borough</th>
                  <th style={thStyle}>Average Flat Price *</th>
                  <th style={thStyle}>Market Note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Kensington & Chelsea', '£1.2m+', "London's most expensive borough; prices have fallen sharply from 2023 peaks"],
                  ['City of Westminster', '£854,000 in June 2026 (provisional)', 'Still prime-central pricing despite the correction; down 25.4% from June 2025'],
                  ['Hammersmith & Fulham', '~£575,000', 'Down from almost £700,000 at recent peak'],
                  ['London average (all boroughs)', '~£431,000-£440,000', 'Fell roughly since the start of 2023'],
                  ['Barking & Dagenham', '~£228,998-£340,000', 'One of the most affordable boroughs for first-time buyers'],
                  ['Bexley/Havering', '~£390,000-£400,000', 'Affordable outer-London options with lower Stamp Duty exposure'],
                ].map(([b, p, note], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--text)' }}>{b}</td>
                    <td style={{ ...tdStyle, color: '#A0845C' }}>{p}</td>
                    <td style={tdStyle}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--text-faint)', marginTop: -20, marginBottom: 28 }}>
            *Prices are overall averages and will differ based on the individual properties and owner-specified factors*
          </p>

          <p style={{ ...pStyle, padding: '16px 20px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
            Also read our other blog:{' '}
            <Link
              href="/blog/landlord-checklist-preparing-to-let"
              className="link-underline"
              style={{ color: '#A0845C', fontWeight: 500 }}
            >
              Getting your property ready to let: a landlord's checklist
            </Link>
          </p>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>What Influences Your Valuation</h2>
          <p style={pStyle}>
            Know the structural factors that actually influence a London property valuation, not just kerb-appeal tips. For example, lease length for flats is the most underrated factor, where a lease under 80 years can meaningfully reduce value and trigger costly extension conversations.
          </p>
          <p style={pStyle}>
            Here are some of them that largely affect your home's selling price.
          </p>

          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            Table 4: Factors Affecting Property Valuation
          </p>
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Factor</th>
                  <th style={thStyle}>Why It Matters in London</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Lease length (flats)', 'A lease under 80 years reduces value and can deter buyers and mortgage lenders; above 90 years is ideal *'],
                  ['Comparable sales evidence', 'Agents benchmark against similar sold properties within roughly 0.5 miles in the last 6-12 months'],
                  ['Condition & presentation', 'Minor repairs and decluttering matter more than costly renovations for the appraisal itself'],
                  ['Local transport & schools', 'Proximity to strong transport links and schools consistently outweighs postcode averages'],
                  ['Market timing', 'Spring and autumn are traditionally the busiest, and often strongest-priced, selling windows in London'],
                ].map(([factor, why], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--text)', width: '32%' }}>{factor}</td>
                    <td style={tdStyle}>{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--text-faint)', marginTop: -20, marginBottom: 28 }}>
            *In UK leasehold law, the critical legal threshold is 80 years, below which &ldquo;marriage value&rdquo; becomes payable upon extension, significantly raising extension costs.*
          </p>

          <p style={pStyle}>
            If you are selling a London flat, remaining lease length heavily impacts buyer mortgage eligibility and market value:
          </p>

          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            Table 5: London Leasehold Decision Matrix
          </p>
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Remaining Lease Length</th>
                  <th style={thStyle}>Mortgageability Status</th>
                  <th style={thStyle}>Recommended Seller Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['90+ Years', 'Unaffected / Prime Market', 'Safe to list immediately at full market value.'],
                  ['80-85 Years', 'Approaching Legal Threshold', 'Consider extending before it drops below 80 years, or price competitively to offset buyer extension costs.'],
                  ['Under 80 Years', 'High Risk ("Marriage Value" applies)', 'Lenders require larger buyer deposits. Commission a formal RICS lease extension valuation before pricing to avoid transaction collapse.'],
                ].map(([length, status, action], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--text)' }}>{length}</td>
                    <td style={{ ...tdStyle, color: '#A0845C' }}>{status}</td>
                    <td style={tdStyle}>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>After the Valuation: Your Next Move</h2>
          <p style={pStyle}>
            Securing a professional valuation provides essential clarity for your broader relocation strategy. Once a confirmed valuation establishes your accurate equity baseline, asking &ldquo;how can I buy a house in London&rdquo; becomes a structured financial query regarding borrowing capacity.
          </p>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8, fontWeight: 600 }}>
              1. Synthesise and Filter the Valuations
            </h3>
            <p style={pStyle}>
              Discard outliers and focus on median data. Review all 3 agent appraisals side by side. Cross-reference each proposed asking price against HM Land Registry sold data from the last 6 months, and discard any figure that lacks supporting evidence.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8, fontWeight: 600 }}>
              2. Establish Your Reserve and Target Asking Price
            </h3>
            <p style={pStyle}>
              Set your Target Selling Price (realistic market value) and your Asking Price (strategic marketing figure to generate buyer activity). Determine your absolute bottom &ldquo;walk-away&rdquo; threshold based on your next mortgage requirements.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8, fontWeight: 600 }}>
              3. Negotiate Contract Terms &amp; Fee Structures
            </h3>
            <p style={pStyle}>
              Compare agent commission rates (typically 1% to 1.5% + VAT in London). Ensure your agreement specifies a sole-agency period of no more than 4 to 6 weeks with a 14-day notice period.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8, fontWeight: 600 }}>
              4. Execute High-ROI Prep &amp; Photography
            </h3>
            <p style={pStyle}>
              Complete minor touch-ups, deep cleaning, and decluttering highlighted during your agent appraisals before bringing in professional photographers.
            </p>
          </div>

          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 8 }}>
              Reality Check
            </p>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: 15 }}>
              A fresh coat of paint won't lift your valuation on its own. Valuers weigh square footage, location, and comparable sales far more heavily than cosmetic staging; spend on repairs before decor.
            </p>
          </div>

          <p style={pStyle}>
            Make sure you are able to leverage the valuation data immediately, aligning the sale of an existing asset with the targeted acquisition or rental of your next residence in parallel.
          </p>

          <div style={calloutStyle}>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0845C', fontWeight: 600, marginBottom: 8 }}>
              Use Case
            </p>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: 15 }}>
              A Croydon homeowner used their agent valuation to confirm mortgage borrowing power, then began searching how can i buy a house in London within their new budget the same week, running both processes side by side.
            </p>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>Conclusion</h2>
          <p style={pStyle}>
            A reliable valuation is a process, not a single phone call. To get the proper valuation, you will need to get an online estimate to sense-check, two or three agent appraisals for evidence, and a RICS survey only where legally required.
          </p>

          <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', margin: '36px 0', textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 12, fontWeight: 400 }}>
              Planning to Sell Your Property? Our Agents at Vale and Mercer Will Get You a Proper Valuation!
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto 24px' }}>
              If you are thinking of selling your home and you have not priced it yet, we can help you do that. Contact us today to book a valuation for your property! Also, get notified about the new listings every time we feature one.
            </p>
            <Link
              href="/valuations"
              className="link-underline"
              style={{
                display: 'inline-block',
                background: '#A0845C',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Book a Valuation
            </Link>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.25}>
          <h2 style={h2Style}>FAQs</h2>
          {[
            ['How long is a property valuation valid for in London?', 'Estate agent appraisals reflect current market conditions and stay relevant for roughly three to six months, while RICS formal valuations usually last three months.'],
            ['Should I renovate my London property right before getting a valuation?', 'Focus on essential structural repairs and decluttering. Major expensive renovations rarely yield a full return on investment compared to simple presentation fixes before selling.'],
            ['What is the difference between an asking price and a valuation?', 'A valuation establishes the actual estimated market value based on evidence, whereas an asking price is a strategic marketing figure chosen to attract buyers.'],
            ["How does a property's Energy Performance Certificate (EPC) impact its valuation?", 'Higher EPC ratings boost valuation appeal as buyers increasingly prioritise energy efficiency, lower running utility costs, and potential green mortgage benefits when bidding.'],
            ['Can I challenge a low mortgage lender valuation if it impacts my sale?', 'Yes, you can request a revaluation by providing your lender with strong evidence of recent, directly comparable sales within a half-mile radius.'],
          ].map(([q, a], i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-md)',
                padding: '22px 24px',
                marginBottom: 16,
                border: '0.5px solid var(--border)',
              }}
            >
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
