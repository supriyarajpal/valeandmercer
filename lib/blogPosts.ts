// Single source of truth for blog posts, consumed by BOTH the blog index
// (app/blog/page.tsx) and the homepage "Insight and advice" section
// (components/BlogSection.tsx). Add a new post to this array and it appears in
// both places automatically — no homepage edit is ever required.
//
// Pure data, no filesystem access, so it is safe to import into Client
// Components (both consumers are 'use client').

export interface BlogPost {
  slug: string
  category: string
  title: string
  excerpt: string
  /** Human month label, e.g. "September 2026". Drives the newest-first sort. */
  date: string
  image: string
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

// "September 2026" -> a sortable integer (year*12 + monthIndex). Anything it
// cannot parse sorts oldest (0) so malformed dates never jump to the top.
export function blogDateValue(date: string): number {
  const parts = date.trim().toLowerCase().split(/\s+/)
  if (parts.length < 2) return 0
  const mi = MONTHS.indexOf(parts[0])
  const year = parseInt(parts[1], 10)
  if (mi < 0 || Number.isNaN(year)) return 0
  return year * 12 + mi
}

// Maintained roughly newest-first by hand; the exported list is sorted below so
// order never depends on insertion position.
const POSTS: BlogPost[] = [
  { slug: 'renting-out-property-east-london-landlord-guide', category: 'For Landlords', title: "Renting Out Property in East London - A Landlord's Guide", excerpt: 'Learn how to rent out property in East London, including letting agent fees, rental valuations, tenant demand and key considerations for Canary Wharf landlords.', date: 'September 2026', image: '/Royal Victoria Dock cable car.jpeg' },
  { slug: 'london-new-homes-e14-docklands-2026', category: 'Area Guide', title: 'New Homes in London: E14 & Docklands Buyer Guide 2026', excerpt: 'Find the ideal location for a new home in London with this 2026 guide to E14 and Docklands, covering connectivity, amenities and local appeal.', date: 'September 2026', image: '/Jubilee Park Canary Wharf.jpg' },
  { slug: 'choosing-new-build-home-canary-wharf-2026', category: 'Sales Advice', title: 'Choosing the Right New-Build Home in Canary Wharf in 2026', excerpt: 'Planning to buy a new-build home in Canary Wharf? Learn what to consider, including location, transport links, amenities, pricing, developers, and long-term value.', date: 'September 2026', image: '/Island Gardens Greenwich foot tunnel.jpg' },
  { slug: 'guide-to-renting-near-canary-wharf', category: 'Area Guide', title: 'Renting Near Canary Wharf in 2026: A Complete Area Guide', excerpt: 'A complete 2026 guide to renting near Canary Wharf, covering apartment costs, popular areas, transport, amenities and essential factors for renters.', date: 'September 2026', image: '/Crossrail Place roof garden.jpg' },
  { slug: 'how-to-value-property-before-selling', category: 'Sales Advice', title: 'How to Value Your Property Before Putting It on the Market', excerpt: 'Understand how to value your property before selling, including key factors, valuation methods, and steps to help you set a realistic asking price.', date: 'August 2026', image: '/Screenshot 2026-09-18 at 7.03.15 PM.png' },
  { slug: 'tips-for-buying-flats-in-canary-wharf', category: 'Area Guide', title: 'Buying Flats in Canary Wharf: What Buyers Need to Know', excerpt: 'Find the right flat in Canary Wharf by understanding the key factors buyers should consider, including location, transport, amenities, property type, and value.', date: 'August 2026', image: '/ What Buyers Need to Know.png' },
  { slug: 'canary-wharf-high-rise-vs-riverside-rents-valuations', category: 'Market Insight', title: 'How Amenities Affect Canary Wharf Property Rents and Values', excerpt: "See how amenities and lifestyle features influence rents and property valuations in Canary Wharf's high-rise and riverside residential developments.", date: 'August 2026', image: '/Westferry Road Millwall.jpg' },
  { slug: 'sustainable-new-homes-canary-wharf-investment', category: 'Sales Advice', title: 'Why Sustainable New Homes Make Canary Wharf a Smart Investment', excerpt: 'Learn why sustainable new homes in the UK are becoming a smarter investment and how luxury flats for sale in Canary Wharf combine comfort, value and efficiency.', date: 'August 2026', image: '/Mudchute Park Isle of Dogs.jpeg' },
  { slug: 'sustainable-features-new-homes-uk-canary-wharf', category: 'Sales Advice', title: '6 Sustainable Features to Expect in New Homes in the UK', excerpt: 'Learn about 6 sustainable features in new homes in the UK and why energy efficiency, smart design and lower running costs make Canary Wharf flats a smart buy.', date: 'August 2026', image: '/Millwall Park Isle of Dogs.webp' },
  { slug: 'canary-wharf-rental-value', category: 'For Landlords', title: 'Property Valuation Canary Wharf: Corporate Rental Rates', excerpt: 'Learn why corporate tenants pay premium rates for flats to rent in Canary Wharf and how location, amenities, flexibility and presentation can increase rental value.', date: 'August 2026', image: '/newport avenue.jpeg' },
  { slug: 'property-for-sale-royal-docks', category: 'Area Guide', title: 'Property for Sale in Royal Docks: A Waterfront Living Guide', excerpt: 'Learn what buyers and landlords need to know about property for sale in Royal Docks, including waterfront living, rental potential and key considerations.', date: 'August 2026', image: '/Royal Victoria Dock cable car.jpeg' },
  { slug: 'landlord-checklist-preparing-to-let', category: 'For Landlords', title: "Getting your property ready to let: a landlord's checklist", excerpt: 'A practical checklist for landlords preparing a rental. Photography, staging, compliance paperwork, honest pricing, and what a good agent should be doing.', date: 'July 2026', image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=1400&q=85' },
  { slug: 'london-rental-market-2026', category: 'Market Insight', title: "London's rental market in 2026: what's actually happening to rents", excerpt: 'A calm, data-led look at London rents in mid-2026. UK average, London growth versus other regions, supply, and time-to-let.', date: 'July 2026', image: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=1400&q=85' },
  { slug: 'local-guide-renting-canary-wharf', category: 'Area Guide', title: "A local's guide to renting in Canary Wharf", excerpt: 'What the area actually feels like. Transport links, resident profile, riverside walks, and the newer high-rises that fill our current lettings shortlist.', date: 'July 2026', image: 'https://images.unsplash.com/photo-1664624447750-39756899f4a7?w=1400&q=85' },
  { slug: 'renters-rights-act-london-2026', category: 'Regulation', title: "What the Renters' Rights Act means for London tenants and landlords in 2026", excerpt: 'In force since 1 May 2026. What changed for bidding, rent increases, and how homes are advertised. Practical guidance for both sides.', date: 'July 2026', image: 'https://images.unsplash.com/photo-1510265236892-329bfd7de7a1?w=1400&q=85' },
  { slug: 'london-property-market-2025', category: 'Market Insight', title: 'The London property market in 2026', excerpt: 'Supply is up, rates have settled a little, and buyers are moving again. Here is what we are seeing.', date: 'May 2026', image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1400&q=85' },
  { slug: 'student-lettings-london-guide', category: 'Student Living', title: 'Renting in London as a student', excerpt: 'No jargon, no hidden fees. Everything you need to find a good home near your university and avoid the common pitfalls.', date: 'March 2026', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=85' },
]

// Newest first. Array.prototype.sort is stable (ES2019+), so posts sharing a
// month keep their source-array order.
export const BLOG_POSTS: BlogPost[] = [...POSTS].sort(
  (a, b) => blogDateValue(b.date) - blogDateValue(a.date),
)
