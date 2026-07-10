// Extended Property model. `listingType` is the sale/lettings kind (was
// called `status` in the pre-Phase-22 model); `status` is now the workflow
// state (live vs draft), which gates whether the record appears in listing
// grids. Draft records still get an SSG detail page so a preview URL exists,
// but are excluded from the /let listings grid and homepage feature strip until
// their compliance data (EPC + council tax) is confirmed.

export type ListingType        = 'To Let' | 'For Sale'
export type PublicationStatus  = 'live' | 'draft'
export type NearbyKind         = 'Tube' | 'School'

export type NearbyPoint = {
  name: string
  distance: string
  kind: NearbyKind
}

export type IncomeRequirements = {
  rentPM: string
  ukIncome: string
  ukGuarantor: string
  foreignGuarantor: string
  adverseCredit: string
}

export type Compliance = {
  epc: string
  councilTax: string
}

export type Coordinates = {
  lat: number
  lng: number
}

export type Property = {
  id: string
  slug: string
  listingType: ListingType
  status: PublicationStatus
  ref: string
  title: string
  rent: string
  rentPW: string
  beds: number
  baths: number
  area: string
  available: string
  holdingDeposit: string
  securityDeposit: string
  sqft: number | null
  floor: string | null
  epc: string
  tags: string[]
  headline: string
  description: string
  amenities: string
  keyFeatures: string[]
  compliance?: Compliance
  location: string
  nearby: NearbyPoint[]
  income: IncomeRequirements
  // `image` is the hero/first frame; `gallery` is every subsequent frame.
  // PHOTO ORDER CONVENTION — order images (hero first, then gallery) by
  // room in this fixed sequence so every property reads consistently:
  //   1. Living room  2. Kitchen  3. Bedroom  4. Bathroom/washroom
  //   5. Any other shots (private balcony/terrace, views, internal halls)
  //   6. Communal / building amenities (lobby, gym, pool, exterior)
  //   7. Floor plan — ALWAYS last
  // Skip any category a property doesn't have; keep the rest in order.
  // (PropertyHeroCarousel also force-pushes floor-plan filenames last as a
  // safety net, but the array itself should already follow this order.)
  image: string
  gallery?: string[]
  teaser?: string
  featured?: boolean
  // Approximate street-level coordinates for the /let listings map. Not the
  // exact door — coarse enough to feel appropriate for a rental listing.
  coordinates?: Coordinates
}

// Property-page enquiry contact. Consumed only by the property detail
// page / PropertyEnquiryActions — do NOT reuse for site-wide contact
// surfaces (footer, /about, etc.), which still route through
// info@valeandmercer.co.uk. Personal name intentionally omitted from
// the sidebar UI; role label ("Lettings · Vale and Mercer") carries
// the human context instead.
export const AGENT_CONTACT = {
  email: 'enquire@valeandmercer.co.uk',
} as const

export const RENT_TERMS = {
  paymentOptions: 'Pay monthly.',
  validID: 'Required.',
  rightToRent: 'Required.',
  proofOfIncome: 'Required.',
} as const

// href="#" placeholders — swap in real hosted PDFs when the client provides them.
export const RENT_GUIDES = [
  { label: 'How to Rent Guide', href: '#' },
  { label: "Renters' Rights Act Information Sheet", href: '#' },
] as const

const PLACEHOLDER_IMAGE = '/images/property-placeholder.svg'

export const properties: Property[] = [
  // PUBLISHED per client override on 2026-07-08. Compliance data (EPC
  // rating + council tax band) still outstanding — revisit with the
  // landlord and fill in the `compliance` block once confirmed.
  {
    id: '33403',
    slug: 'lawn-house-close-1bed',
    coordinates: { lat: 51.497, lng: -0.008 },
    listingType: 'To Let',
    status: 'live',
    ref: '33403',
    title: 'Lawn House Close',
    rent: '£2,860pcm',
    rentPW: '£660pw',
    beds: 1,
    baths: 1,
    area: 'E14 · Cubitt Town',
    available: '13 August',
    holdingDeposit: '£660',
    securityDeposit: '£3,300',
    sqft: null,
    floor: null,
    epc: '—',
    tags: [
      'Furnished', '1 bed', '1 bath', 'Great View', 'Modern', 'High Ceilings',
      'Big Windows', 'Open Plan Kitchen', 'Terrace', 'Concierge', 'Dishwasher',
      'Freezer', 'Dryer', 'Washer', 'Elevator', '24hr Security', 'New Build',
    ],
    headline: '1-Bedroom Flat to Rent in Canary Wharf | Lawn House Close, London | Available 13th of August',
    description: "This newly built 1-bedroom, 1-bathroom flat is available to rent in Lawn House Close, Canary Wharf. The property offers a modern living environment in one of London's most sought-after neighbourhoods. The flat is currently fully furnished. The landlord is not flexible regarding furniture arrangements. It features large windows that bring in excellent natural light, high ceilings, and an open-plan kitchen fitted with integrated appliances and a washer/dryer.",
    amenities: 'The property benefits from a private terrace, offering residents outdoor space and has a stunning view of Canary Wharf and the Dock. Building facilities include a lift, a concierge, and 24-hour security.',
    keyFeatures: [
      'Brand new apartment',
      'Underfloor heating throughout',
      'Open-plan kitchen with integrated dishwasher and oven/hob/freezer',
    ],
    location: 'Situated on a well-connected d, the flat is just moments from Crossharbour DLR and Canary Wharf Tube Station. Canary Wharf is well served by bus routes and road links, making it an ideal base for commuters and young professionals.',
    nearby: [
      { name: 'Canary Wharf',                       distance: '0.4 miles', kind: 'Tube' },
      { name: 'North Greenwich',                    distance: '0.7 miles', kind: 'Tube' },
      { name: 'Mulberry Wood Wharf',                distance: '0.2 miles', kind: 'School' },
      { name: 'River House Montessori School',      distance: '0.3 miles', kind: 'School' },
      { name: 'Cubitt Town Junior & Infant School', distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,860',
      ukIncome: '£85,800pa',
      ukGuarantor: '£102,960pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Order: living(2) · kitchen(7) · bedroom(8) · bath(6) · other(3,4,WA) · communal(5)
    image: '/images/lawn-house-close-2860/2.jpeg',
    gallery: [
      '/images/lawn-house-close-2860/7.jpeg',
      '/images/lawn-house-close-2860/8.jpeg',
      '/images/lawn-house-close-2860/6.jpeg',
      '/images/lawn-house-close-2860/3.jpeg',
      '/images/lawn-house-close-2860/4.jpeg',
      '/images/lawn-house-close-2860/WhatsApp%20Image%202026-07-09%20at%2000.12.10.jpeg',
      '/images/lawn-house-close-2860/5.jpeg',
    ],
    teaser: 'Brand new 1-bed in Canary Wharf with a private terrace, stunning Dock views and underfloor heating throughout.',
    featured: true,
  },
  // PUBLISHED per client override on 2026-07-08. Compliance data (EPC
  // rating + council tax band) still outstanding — revisit with the
  // landlord and fill in the `compliance` block once confirmed.
  {
    id: '33406',
    slug: 'marsh-wall-studio-2400',
    coordinates: { lat: 51.498, lng: -0.0175 },
    listingType: 'To Let',
    status: 'live',
    ref: '33406',
    title: 'Marsh Wall',
    rent: '£2,400pcm',
    rentPW: '£554pw',
    beds: 0,
    baths: 1,
    area: 'E14 · Cubitt Town',
    available: '20 August',
    holdingDeposit: '£554',
    securityDeposit: '£2,769',
    sqft: 429,
    floor: '42nd floor',
    epc: '—',
    tags: [
      'Furnished', 'Studio', '1 bath', '42nd floor', 'Concierge', 'Gym',
      'Elevator', 'Modern', 'Ample Storage', 'Big Windows', 'Pool', 'Great View',
    ],
    headline: 'Studio flat to rent in Isle of Dogs | Marsh Wall, London | Available 20th of July',
    description: "This well-presented studio flat is available to rent in Marsh Wall, Isle of Dogs. The property offers a modern living environment in one of London's most sought-after neighbourhoods. The studio flat is currently fully furnished. The landlord is not flexible regarding furniture arrangements. It features large windows that bring in excellent natural light, generous built-in storage, and an open-plan kitchen fitted with integrated appliances.",
    amenities: 'Open-plan kitchen with integrated appliances, 24-hour concierge service, lift, private swimming pool, private cinema, residence lounge, residence gym.',
    keyFeatures: [],
    location: 'Situated on a well-connected central road, the flat is just moments from South Quay Station. Isle of Dogs is well served by the local bus routes and excellent cycle lanes, making it an ideal base for commuters, young professionals, and students.',
    nearby: [
      { name: 'Canary Wharf',                  distance: '0.3 miles', kind: 'Tube' },
      { name: 'North Greenwich',               distance: '0.8 miles', kind: 'Tube' },
      { name: 'River House Montessori School', distance: '0.2 miles', kind: 'School' },
      { name: 'Mulberry Wood Wharf',           distance: '0.3 miles', kind: 'School' },
      { name: 'South Quay College',            distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,400',
      ukIncome: '£72,000pa',
      ukGuarantor: '£86,400pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    image: PLACEHOLDER_IMAGE,
  },
  // PUBLISHED per client override on 2026-07-08. Compliance data (EPC
  // rating + council tax band) still outstanding — revisit with the
  // landlord and fill in the `compliance` block once confirmed.
  {
    id: '33416',
    slug: 'marsh-wall-studio-2700',
    coordinates: { lat: 51.4975, lng: -0.018 },
    listingType: 'To Let',
    status: 'live',
    ref: '33416',
    title: 'Marsh Wall',
    rent: '£2,700pcm',
    rentPW: '£623pw',
    beds: 0,
    baths: 1,
    area: 'E14 · Millwall',
    available: '8 July',
    holdingDeposit: '£623',
    securityDeposit: '£3,115',
    sqft: 561,
    floor: '49th floor',
    epc: '—',
    tags: [
      'Furnished', 'Studio', '1 bath', '49th floor', 'Open Plan Kitchen',
      'Big Windows', 'Modern', 'High Ceilings', 'Ample Storage', 'Elevator',
      'Concierge', 'Gym', 'Great View', '24hr Security',
    ],
    headline: 'Studio Flat to Rent in Canary Wharf | Marsh Wall, London | Available 8th of July | 561 sq. ft. | 49th Floor',
    description: "This well-presented studio flat is available to rent in Marsh Wall, Canary Wharf. The property offers a modern living environment in one of London's most sought-after neighbourhoods. The flat is currently fully furnished. The landlord is not flexible regarding furniture arrangements. It features large windows that bring in excellent natural light, high ceilings, generous built-in storage, and an open-plan kitchen fitted with integrated appliances.",
    amenities: "Building facilities include a lift access, 24-hour concierge/security, residents' lobby, state-of-the-art gym, private cinema, media rooms, residents' lounge, private dining rooms, virtual golf, pool/billiards areas, games room, tropical sky gardens, children's play area, landscaped communal spaces and London's highest private roof terrace.",
    keyFeatures: [
      'Air conditioning, a rare and valuable feature in London',
      'Open-plan/Separate eat-in kitchen with integrated oven/hob',
      'Student-friendly',
      'Level 27 Panoramic Sky Gardens',
      "Level 56 residents' lounge and gym",
      'Level 75 Sky Terrace',
    ],
    location: 'Situated on a well-connected central road, the flat is just moments from Canada Water and North Greenwich tube stations. Canary Wharf is well served by an extensive network of 24-hour bus routes and excellent local cycling infrastructure, making it an ideal base for commuters, young professionals and students.',
    nearby: [
      { name: 'Canary Wharf',                  distance: '0.3 miles', kind: 'Tube' },
      { name: 'South Quay College',            distance: '0.3 miles', kind: 'School' },
      { name: 'Seven Mills Primary School',    distance: '0.3 miles', kind: 'School' },
      { name: 'River House Montessori School', distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,700',
      ukIncome: '£81,000pa',
      ukGuarantor: '£97,200pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: '33238',
    slug: 'marsh-wall-1bed-3000',
    coordinates: { lat: 51.4978, lng: -0.0178 },
    listingType: 'To Let',
    status: 'live',
    ref: '33238',
    title: 'Marsh Wall',
    rent: '£3,000pcm',
    rentPW: '£692pw',
    beds: 1,
    baths: 1,
    area: 'E14 · Millwall',
    available: '21 July',
    holdingDeposit: '£692',
    securityDeposit: '£3,462',
    sqft: 611,
    floor: '13th floor',
    epc: 'B',
    tags: [
      'Furnished', '1 bed', '1 bath', '13th floor', 'Concierge', 'Big Windows',
      'Ample Storage', 'High Ceilings', 'Modern', 'Open Plan Kitchen',
      'Elevator', 'Gym', 'Great View', 'Washer', 'Dryer', 'Freezer', 'Terrace',
      'Dishwasher', 'Pool',
    ],
    headline: '1-Bedroom flat to rent in Canary Wharf | Marsh Wall, London. Available 21st of July | 611 sq. ft. | 13th floor | EPC: B | Council Tax Band: E',
    description: "This well-presented 1-bedroom, 1-bathroom flat is available to rent on Marsh Wall in Canary Wharf. Occupying 611 sq. ft. across the 13th floor, the property offers a modern living environment in one of London's most sought-after neighbourhoods. The flat is currently fully furnished. The landlord is not flexible regarding furniture arrangements. It features large windows bringing in excellent natural light and generous built-in storage, and the open-plan kitchen is fitted with integrated appliances.",
    amenities: "Open-plan kitchen with integrated appliances, 24-hour concierge and security service, The Quay Club residents' lounge, fully equipped gymnasium and fitness studios, 20-metre swimming pool, spa facilities including sauna and steam room, private cinema room, business lounge and meeting suites, landscaped communal gardens and terraces, secure entry system and lift access.",
    keyFeatures: [],
    compliance: {
      epc: 'B',
      councilTax: 'Band E, Tower Hamlets Council',
    },
    location: 'Situated on a well-connected central road, the flat is just moments from South Quay DLR Station, with easy access to shops, parks and restaurants. Canary Wharf is well served by bus routes and road links, making it an ideal base for commuters, families and young professionals.',
    nearby: [],
    income: {
      rentPM: '£3,000',
      ukIncome: '£90,000pa',
      ukGuarantor: '£108,000pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: '31871',
    slug: 'marsh-wall-2bed-4050',
    coordinates: { lat: 51.4982, lng: -0.0172 },
    listingType: 'To Let',
    status: 'live',
    ref: '31871',
    title: 'Marsh Wall',
    rent: '£4,050pcm',
    rentPW: '£935pw',
    beds: 2,
    baths: 2,
    area: 'E14 · Cubitt Town',
    available: '21 August',
    holdingDeposit: '£935',
    securityDeposit: '£4,673',
    sqft: 842,
    floor: '18th floor',
    epc: 'B',
    tags: [
      'Furnished', '2 beds', '2 baths', '18th floor', 'Modern', 'Big Windows',
      'Terrace', 'Washer', 'Elevator', 'Concierge', 'Ample Storage',
      'Air Conditioning', 'Dishwasher', 'Dryer', 'Gym', 'Great View', 'Freezer',
      'Open Plan Kitchen', '24hr Security',
    ],
    headline: '2-Bedroom Flat to Rent in Canary Wharf | Marsh Wall, London',
    description: 'Presenting a flat to rent in Canary Wharf. The property is on Marsh Wall and comprises 2 bedrooms and 2 bathrooms. Available from the 21st of August, covering 842 sq. ft. in living space and situated on the 18th floor, this modern property comes with big windows and ample storage. The property also benefits from a private balcony. Residents can further enjoy a gym in the building, as well as secure facilities.',
    amenities: 'Air conditioning, a rare feature in London. Open plan kitchen with dishwasher. Freezer. Washer. Lift. Concierge.',
    keyFeatures: [],
    compliance: {
      epc: 'B',
      councilTax: 'Band F',
    },
    location: 'Located only moments away from Canary Wharf Underground.',
    nearby: [
      { name: 'Canary Wharf',                       distance: '0.3 miles', kind: 'Tube' },
      { name: 'North Greenwich',                    distance: '0.8 miles', kind: 'Tube' },
      { name: 'River House Montessori School',      distance: '0.2 miles', kind: 'School' },
      { name: 'Mulberry Wood Wharf',                distance: '0.2 miles', kind: 'School' },
      { name: 'Cubitt Town Junior & Infant School', distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£4,050',
      ukIncome: '£121,500pa',
      ukGuarantor: '£145,800pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    image: PLACEHOLDER_IMAGE,
  },
  // PUBLISHED per client override on 2026-07-08. Compliance data (EPC
  // rating + council tax band) still outstanding — revisit with the
  // landlord and fill in the `compliance` block once confirmed.
  {
    id: '33405',
    slug: 'marsh-wall-3bed-5958',
    coordinates: { lat: 51.4976, lng: -0.0182 },
    listingType: 'To Let',
    status: 'live',
    ref: '33405',
    title: 'Marsh Wall',
    rent: '£5,958pcm',
    rentPW: '£1,375pw',
    beds: 3,
    baths: 3,
    area: 'E14 · Millwall',
    available: '20 August',
    holdingDeposit: '£1,375',
    securityDeposit: '£6,875',
    sqft: null,
    floor: null,
    epc: '—',
    tags: [
      'Furnished', '3 beds', '3 baths', 'Concierge', 'Modern', 'Pool',
      'Great View', 'Gym', 'Open Plan Kitchen', 'Air Conditioning',
      'Big Windows', 'High Ceilings', 'Elevator', 'Ample Storage',
    ],
    headline: '3-Bedroom Flat to Rent in Canary Wharf | Marsh Wall, London | Available 20th of August',
    description: "This well-presented 3-bedroom, 3-bathroom flat is available to rent in Marsh Wall, Canary Wharf. The property offers a modern living environment in one of London's most sought-after neighbourhoods. The flat is currently fully furnished. The landlord is not flexible regarding furniture arrangements. It features large windows that bring in excellent natural light, high ceilings, generous built-in storage, and an open-plan kitchen fitted with integrated appliances.",
    amenities: "Building facilities include a lift access, a gym, swimming pool and a concierge, board rooms, a screening room, bars, cafe, onsite restaurants, as well as London's highest communal garden and access to the Residents' Club Lounge on the 56th floor.",
    keyFeatures: [
      'Underfloor heating & comfort cooling',
      'Open-plan kitchen with integrated appliances',
      'High floor with an excellent view',
    ],
    location: 'Situated on a well-connected central road, the flat is just moments from South Quay DLR and Canary Wharf stations, with easy access to the world-class shopping malls, premium waterside dining, and vibrant bars of the Canary Wharf estate, alongside the local cafes and amenities along Marsh Wall. It is also very close to the peaceful waterfront walking paths along South Dock and the unique rooftop gardens at Crossrail Place. Canary Wharf is well served by bus routes and road links, making it an ideal base for commuters and young professionals.',
    nearby: [
      { name: 'Canary Wharf',                  distance: '0.2 miles', kind: 'Tube' },
      { name: 'North Greenwich',               distance: '0.9 miles', kind: 'Tube' },
      { name: 'River House Montessori School', distance: '0.1 miles', kind: 'School' },
      { name: 'South Quay College',            distance: '0.2 miles', kind: 'School' },
      { name: 'Mulberry Wood Wharf',           distance: '0.3 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£5,958',
      ukIncome: '£178,740pa',
      ukGuarantor: '£214,488pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Order: living(15,2) · kitchen(10,3,4,5) · bedroom(13,16) · bath(12,8) · other(7) · communal(1,11,6,9) · floorplan(14)
    image: '/images/marsh-wall-5958/15.jpeg',
    gallery: [
      '/images/marsh-wall-5958/2.jpeg',
      '/images/marsh-wall-5958/10.jpeg',
      '/images/marsh-wall-5958/3.jpeg',
      '/images/marsh-wall-5958/4.jpeg',
      '/images/marsh-wall-5958/5.jpeg',
      '/images/marsh-wall-5958/13.jpeg',
      '/images/marsh-wall-5958/16.jpeg',
      '/images/marsh-wall-5958/12.jpeg',
      '/images/marsh-wall-5958/8.jpeg',
      '/images/marsh-wall-5958/7.jpeg',
      '/images/marsh-wall-5958/1.jpeg',
      '/images/marsh-wall-5958/11.jpeg',
      '/images/marsh-wall-5958/6.jpeg',
      '/images/marsh-wall-5958/9.jpeg',
      '/images/marsh-wall-5958/14.jpeg',
    ],
    teaser: 'Fully furnished 3-bed in Canary Wharf with high ceilings, a pool, gym and access to London\'s highest communal garden.',
    featured: true,
  },
  {
    id: '33396',
    slug: 'pan-peninsula-square-studio',
    coordinates: { lat: 51.494, lng: -0.019 },
    listingType: 'To Let',
    status: 'live',
    ref: '33396',
    title: 'Pan Peninsula Square',
    rent: '£2,000pcm',
    rentPW: '£462pw',
    beds: 0,
    baths: 1,
    area: 'E14 · Millwall',
    available: '25 July',
    holdingDeposit: '£462',
    securityDeposit: '£2,308',
    sqft: 323,
    floor: null,
    epc: 'B',
    tags: [
      'Flexible', 'Studio', '1 bath', 'Big Windows', 'Concierge', 'Elevator',
      'Washer', 'Great View', 'Modern', 'Open Plan Kitchen', 'Ample Storage',
      'Terrace', 'Freezer', 'Air Conditioning', 'Gym', 'Pool',
    ],
    headline: 'Studio flat to rent in Canary Wharf | Marsh Wall, London | Available 25th July | 323 sq. ft. | EPC: B | Council Tax Band: E',
    description: "This well-presented Studio flat is available to rent on Marsh Wall in Canary Wharf. Occupying 323 sq. ft. The property offers a modern living environment in one of London's most sought-after neighbourhoods. The flat is currently fully furnished. The landlord is not flexible regarding furniture arrangements. It features large windows bringing in excellent natural light, high ceilings, generous built-in storage, and the open-plan kitchen is fitted with fully integrated appliances.",
    amenities: 'Air conditioning, a rare and valuable feature in London. Open-plan kitchen with integrated appliances. Private balcony. 24-hour concierge. Gym, pool, spa, cinema. Sky Lounge & Cocktail Bar. High floor with a great view. Private cinema. Business lounge and workspaces.',
    keyFeatures: [],
    compliance: {
      epc: 'B',
      councilTax: 'Band E, Tower Hamlets Council',
    },
    location: 'Situated on a well-connected central road, the flat is just moments from South Quay DLR station and Canary Wharf Tube Station, with easy access to shops, parks, and restaurants. Canary Wharf is well served by bus routes and road links, making it an ideal base for families and young professionals.',
    nearby: [
      { name: 'Canary Wharf',                  distance: '0.2 miles', kind: 'Tube' },
      { name: 'North Greenwich',               distance: '1.0 miles', kind: 'Tube' },
      { name: 'River House Montessori School', distance: '0.1 miles', kind: 'School' },
      { name: 'South Quay College',            distance: '0.2 miles', kind: 'School' },
      { name: 'Seven Mills Primary School',    distance: '0.3 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,000',
      ukIncome: '£60,000pa',
      ukGuarantor: '£72,000pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: '30967',
    slug: 'westferry-circus-4078',
    coordinates: { lat: 51.5075, lng: -0.0235 },
    listingType: 'To Let',
    status: 'live',
    ref: '30967',
    title: 'Westferry Circus',
    rent: '£4,078pcm',
    rentPW: '£941pw',
    beds: 2,
    baths: 2,
    area: 'E14 · Canary Wharf',
    available: 'now',
    holdingDeposit: '£941',
    securityDeposit: '£4,705',
    sqft: 966,
    floor: '3rd floor',
    epc: 'B',
    tags: [
      'Flexible', '2 beds', '2 baths', '3rd floor', 'Air Conditioning',
      'Modern', 'Concierge', 'Fibre Eligible', 'Elevator', 'Great View',
      '24hr Security', 'Gym', 'Parking', 'Terrace', 'Big Windows',
      'Ample Storage', 'Freezer', 'Dishwasher', 'Dryer', 'Washer',
    ],
    headline: 'Presenting a spacious flat to rent in Canary Wharf, Westferry Circus',
    description: 'Presenting a spacious flat to rent in Canary Wharf. The property is on Westferry Circus and comprises 2 bedrooms and 2 bathrooms. Available now, covering 966 sq. ft. in living space and situated on the sixth floor with a lift, this modern property comes with big windows, ample storage, and a private balcony with views of the impressive Canary Wharf skyline. Residents further benefit from a gym (Free Virgin Active Gym membership)/spa, porter facilities, 24-hour security, and a cinema room.',
    amenities: 'Air conditioning, a rare feature in London. Fully fitted kitchen. Dishwasher. Freezer. Washer/Dryer. Wooden flooring. Superfast Broadband. Communal garden. Parking/Private riverside gardens are available.',
    keyFeatures: [],
    compliance: {
      epc: 'B',
      councilTax: 'Band E',
    },
    location: 'Located only moments away from Canary Wharf station, the Docklands, and many restaurants and amenities.',
    nearby: [
      { name: 'Canary Wharf',                                     distance: '0.5 miles', kind: 'Tube' },
      { name: 'Tower Hamlets Opportunity Group',                  distance: '0.1 miles', kind: 'School' },
      { name: 'The Cyril Jackson Primary School',                 distance: '0.2 miles', kind: 'School' },
      { name: 'Our Lady and St Joseph Catholic Primary School',   distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£4,078',
      ukIncome: '£122,340pa',
      ukGuarantor: '£146,808pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Order: living(1,19,3,4) · kitchen(15) · bedroom(12,14,17,7) · bath(5,9) · other(16) · communal(10,18,2,6,8) · floorplan(11)
    image: '/images/westferry-circus-4078/1.jpeg',
    gallery: [
      '/images/westferry-circus-4078/19.jpeg',
      '/images/westferry-circus-4078/3.jpeg',
      '/images/westferry-circus-4078/4.jpeg',
      '/images/westferry-circus-4078/15.jpeg',
      '/images/westferry-circus-4078/12.jpeg',
      '/images/westferry-circus-4078/14.jpeg',
      '/images/westferry-circus-4078/17.jpeg',
      '/images/westferry-circus-4078/7.jpeg',
      '/images/westferry-circus-4078/5.jpeg',
      '/images/westferry-circus-4078/9.jpeg',
      '/images/westferry-circus-4078/16.jpeg',
      '/images/westferry-circus-4078/10.jpeg',
      '/images/westferry-circus-4078/18.jpeg',
      '/images/westferry-circus-4078/2.jpeg',
      '/images/westferry-circus-4078/6.jpeg',
      '/images/westferry-circus-4078/8.jpeg',
      '/images/westferry-circus-4078/11.jpeg',
    ],
    teaser: 'Spacious 2-bed, 966 sq. ft. on the 3rd floor with a private balcony and Canary Wharf skyline views.',
    featured: true,
  },
  {
    id: '30968',
    slug: 'westferry-circus-4160',
    coordinates: { lat: 51.5073, lng: -0.0233 },
    listingType: 'To Let',
    status: 'live',
    ref: '30968',
    title: 'Westferry Circus',
    rent: '£4,160pcm',
    rentPW: '£960pw',
    beds: 2,
    baths: 2,
    area: 'E14 · Canary Wharf',
    available: 'now',
    holdingDeposit: '£960',
    securityDeposit: '£4,800',
    sqft: 966,
    floor: '10th floor',
    epc: 'C',
    tags: [
      'Flexible', '2 beds', '2 baths', '10th floor', 'Air Conditioning',
      'Fibre Eligible', '24hr Security', 'Gym', 'Elevator', 'Parking',
      'Terrace', 'Great View', 'Modern', 'Freezer', 'Dishwasher', 'Dryer',
      'Washer', 'Big Windows', 'Ample Storage', 'Concierge',
    ],
    headline: 'Presenting a spacious flat to rent in Canary Wharf, Westferry Circus',
    description: 'Presenting a spacious flat to rent in Canary Wharf. The property is on Westferry Circus and comprises 2 bedrooms and 2 bathrooms. Available now, covering 966 sq. ft. of living space and situated on the tenth floor with a lift, this modern property comes with big windows, ample storage, and a private balcony with views of the impressive Canary Wharf skyline. Residents further benefit from a gym (Free Virgin Active Gym membership), spa, porter facilities, 24-hour security, and a cinema room.',
    amenities: 'Air conditioning, a rare feature in London. Fully fitted kitchen. Dishwasher. Freezer. Washer/Dryer. Wooden flooring. Superfast Broadband. Communal garden. Parking/Private riverside gardens are available. Note that the EPC is due to be renewed; the previous EPC rating is C.',
    keyFeatures: [],
    compliance: {
      epc: 'C',
      councilTax: 'Band E',
    },
    location: 'Located only moments away from Canary Wharf station, the Docklands, and many restaurants and amenities.',
    nearby: [
      { name: 'Canary Wharf',                                     distance: '0.5 miles', kind: 'Tube' },
      { name: 'Tower Hamlets Opportunity Group',                  distance: '0.1 miles', kind: 'School' },
      { name: 'The Cyril Jackson Primary School',                 distance: '0.2 miles', kind: 'School' },
      { name: 'Our Lady and St Joseph Catholic Primary School',   distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£4,160',
      ukIncome: '£124,800pa',
      ukGuarantor: '£149,760pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // This listing's supplied photos are all building/communal + one
    // skyline view; no interior room shots. Order: other/view(5) · communal(1,2,3,4)
    image: '/images/westferry-circus-4160/westferry-circus-4160-5.jpeg',
    gallery: [
      '/images/westferry-circus-4160/westferry-circus-4160-1.jpeg',
      '/images/westferry-circus-4160/westferry-circus-4160-2.jpeg',
      '/images/westferry-circus-4160/westferry-circus-4160-3.jpeg',
      '/images/westferry-circus-4160/westferry-circus-4160-4.jpeg',
    ],
    teaser: '2-bed on the 10th floor, 966 sq. ft. with air conditioning, a private balcony and sweeping Canary Wharf views.',
    featured: true,
  },
  {
    id: '31039',
    slug: 'westferry-circus-4377',
    coordinates: { lat: 51.5077, lng: -0.0237 },
    listingType: 'To Let',
    status: 'live',
    ref: '31039',
    title: 'Westferry Circus',
    rent: '£4,377pcm',
    rentPW: '£1,010pw',
    beds: 2,
    baths: 2,
    area: 'E14 · Canary Wharf',
    available: 'now',
    holdingDeposit: '£1,010',
    securityDeposit: '£5,050',
    sqft: 971,
    floor: '10th floor',
    epc: 'C',
    tags: [
      'Flexible', '2 beds', '2 baths', '10th floor', 'Concierge', 'HMO Licence',
      '24hr Security', 'Air Conditioning', 'Gym', 'Elevator', 'Parking',
      'Fibre Eligible', 'Modern', 'Big Windows', 'Terrace', 'Great View',
      'Freezer', 'Dishwasher', 'Dryer', 'Washer', 'Ample Storage',
    ],
    headline: 'Presenting a luxurious, interior-designed flat to rent in Canary Wharf, Westferry Circus',
    description: 'Presenting a luxurious, interior-designed flat to rent in Canary Wharf. The property is on Westferry Circus and comprises 2 bedrooms and 2 bathrooms. Available now, covering 971 sq. ft. in living space and situated on the tenth floor with a lift, this modern property comes with big windows, ample storage, and a private balcony with views of the impressive Canary Wharf skyline. Residents further benefit from a gym, spa, porter facilities, 24-hour security, and a cinema room.',
    amenities: 'Air conditioning, a rare feature in London. Fully fitted kitchen. Dishwasher. Freezer. Washer/Dryer. Wooden flooring. Superfast Broadband. Communal garden. Parking/Private riverside gardens are available.',
    keyFeatures: [],
    compliance: {
      epc: 'C',
      councilTax: 'Band E',
    },
    location: 'Located only moments away from Canary Wharf station, the Docklands, and many restaurants and amenities.',
    nearby: [
      { name: 'Canary Wharf',                                     distance: '0.5 miles', kind: 'Tube' },
      { name: 'Tower Hamlets Opportunity Group',                  distance: '0.1 miles', kind: 'School' },
      { name: 'The Cyril Jackson Primary School',                 distance: '0.2 miles', kind: 'School' },
      { name: 'Our Lady and St Joseph Catholic Primary School',   distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£4,377',
      ukIncome: '£131,310pa',
      ukGuarantor: '£157,572pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Order: living(18,19,28,6) · kitchen(12,9) · bedroom(1,11,14,2,5,8) · bath(10) · other(16,29,7) · communal(13,15,17,20-27,3) · floorplan(4)
    image: '/images/westferry-circus-4377/18.jpeg',
    gallery: [
      '/images/westferry-circus-4377/19.jpeg',
      '/images/westferry-circus-4377/28.jpeg',
      '/images/westferry-circus-4377/6.jpeg',
      '/images/westferry-circus-4377/12.jpeg',
      '/images/westferry-circus-4377/9.jpeg',
      '/images/westferry-circus-4377/1.jpeg',
      '/images/westferry-circus-4377/11.jpeg',
      '/images/westferry-circus-4377/14.jpeg',
      '/images/westferry-circus-4377/2.jpeg',
      '/images/westferry-circus-4377/5.jpeg',
      '/images/westferry-circus-4377/8.jpeg',
      '/images/westferry-circus-4377/10.jpeg',
      '/images/westferry-circus-4377/16.jpeg',
      '/images/westferry-circus-4377/29.jpeg',
      '/images/westferry-circus-4377/7.jpeg',
      '/images/westferry-circus-4377/13.jpeg',
      '/images/westferry-circus-4377/15.jpeg',
      '/images/westferry-circus-4377/17.jpeg',
      '/images/westferry-circus-4377/20.jpeg',
      '/images/westferry-circus-4377/21.jpeg',
      '/images/westferry-circus-4377/22.jpeg',
      '/images/westferry-circus-4377/23.jpeg',
      '/images/westferry-circus-4377/24.jpeg',
      '/images/westferry-circus-4377/25.jpeg',
      '/images/westferry-circus-4377/26.jpeg',
      '/images/westferry-circus-4377/27.jpeg',
      '/images/westferry-circus-4377/3.jpeg',
      '/images/westferry-circus-4377/4.jpeg',
    ],
    teaser: 'Luxurious interior-designed 2-bed on the 10th floor with a private balcony and panoramic Canary Wharf skyline views.',
    featured: true,
  },
  // Added per client 2026-07-11. Photos to be uploaded to
  // public/images/bywell-place-1bed/ in the standard room order:
  // Order: living(1) · kitchen(2) · bedroom(3). No floor plan supplied.
  {
    id: '30717',
    slug: 'bywell-place-1bed',
    coordinates: { lat: 51.5145, lng: 0.0083 },
    listingType: 'To Let',
    status: 'live',
    ref: '30717',
    title: 'Bywell Place',
    rent: '£2,579pcm',
    rentPW: '£595pw',
    beds: 1,
    baths: 1,
    area: 'E16 · Canning Town',
    available: '15 September',
    holdingDeposit: '£595',
    securityDeposit: '£2,976',
    sqft: 563,
    floor: '5th floor',
    epc: 'B',
    tags: [
      'Furnished', 'New Build', 'Ample Storage', 'Big Windows', 'High Ceilings',
      'Modern', 'Terrace', 'Open Plan Kitchen', 'Dishwasher', 'Freezer', 'Dryer',
      'Washer', 'Elevator',
    ],
    headline: '1-Bedroom Flat to Rent in Canning Town | Bywell Place, London | Available 15th September | 563 sq. ft. | 5th Floor | EPC: B | Council Tax Band: B',
    description: 'This newly-built 1-bedroom flat is available to rent in Canning Town on Bywell Place. Occupying 563 sq. ft. on the fifth floor, the modern property benefits from big windows that draw in plenty of natural light, high ceilings and generous built-in storage. It comes with a private balcony and an open-plan kitchen fitted with integrated appliances, and sits just moments from Canning Town Tube station.',
    amenities: 'Open-plan kitchen with integrated appliances including a dishwasher, freezer and washer/dryer. Private balcony. Lift access.',
    keyFeatures: [
      'Brand new build',
      'Private balcony',
      'Open-plan kitchen with integrated dishwasher, freezer and washer/dryer',
    ],
    compliance: {
      epc: 'B',
      councilTax: 'Band B',
    },
    location: 'Situated on a well-connected road, the flat is just moments from Canning Town Tube station. Canning Town is well served by bus routes, the Jubilee line and the DLR, making it an ideal base for commuters and young professionals.',
    nearby: [
      { name: 'Plaistow',                   distance: '1.0 miles', kind: 'Tube' },
      { name: 'Rokeby School',              distance: '0.2 miles', kind: 'School' },
      { name: "St Luke's Primary School",   distance: '0.3 miles', kind: 'School' },
      { name: 'Keir Hardie Primary School', distance: '0.4 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,579',
      ukIncome: '£77,370pa',
      ukGuarantor: '£92,844pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Photos displayed in the exact uploaded numeric order (1..20); the
    // carousel keeps this sequence (no filename matches the floor-plan regex).
    image: '/images/bywell-place-1bed/1.jpeg',
    gallery: [
      '/images/bywell-place-1bed/2.jpeg',
      '/images/bywell-place-1bed/3.jpeg',
      '/images/bywell-place-1bed/4.jpeg',
      '/images/bywell-place-1bed/5.jpeg',
      '/images/bywell-place-1bed/6.jpeg',
      '/images/bywell-place-1bed/7.jpeg',
      '/images/bywell-place-1bed/8.jpeg',
      '/images/bywell-place-1bed/9.jpeg',
      '/images/bywell-place-1bed/10.jpeg',
      '/images/bywell-place-1bed/11.jpeg',
      '/images/bywell-place-1bed/12.jpeg',
      '/images/bywell-place-1bed/13.jpeg',
      '/images/bywell-place-1bed/14.jpeg',
      '/images/bywell-place-1bed/15.jpeg',
      '/images/bywell-place-1bed/16.jpeg',
      '/images/bywell-place-1bed/17.jpeg',
      '/images/bywell-place-1bed/18.jpeg',
      '/images/bywell-place-1bed/19.jpeg',
      '/images/bywell-place-1bed/20.jpeg',
    ],
  },
  // Added per client 2026-07-11. Photos to be uploaded to
  // public/images/silvertown-square-2bed/ in the standard room order:
  // Order: living(1) · kitchen(2,3) · bedroom(4,5) · bath(6) · communal/dining(7) · floor plan(8, last).
  {
    id: '30752',
    slug: 'silvertown-square-2bed',
    coordinates: { lat: 51.5025, lng: 0.0365 },
    listingType: 'To Let',
    status: 'live',
    ref: '30752',
    title: 'Silvertown Square',
    rent: '£3,000pcm',
    rentPW: '£692pw',
    beds: 2,
    baths: 2,
    area: 'E16 · Royal Docks',
    available: '2 September',
    holdingDeposit: '£692',
    securityDeposit: '£3,462',
    sqft: 786,
    floor: null,
    epc: 'B',
    tags: [
      'Furnished', 'Dishwasher', 'Dryer', 'Freezer', 'Modern', 'Student Friendly',
      'Washer', 'Elevator', 'HMO Licence', 'Terrace', 'Big Windows',
      'Ample Storage', 'High Ceilings', 'Open Plan Kitchen',
    ],
    headline: '2-Bedroom Flat to Rent in Royal Docks | Silvertown Square, London | Available 2nd September | 786 sq. ft. | EPC: B | Council Tax Band: B',
    description: 'This well-presented 2-bedroom, 2-bathroom flat is available to rent in the Royal Docks on Silvertown Square. Occupying 786 sq. ft., the modern property benefits from big windows, high ceilings and generous built-in storage. It comes with a private balcony and a fully fitted open-plan kitchen with integrated appliances, and sits just moments from Canning Town Underground station.',
    amenities: 'Fully fitted open-plan kitchen with integrated dishwasher, freezer and washer/dryer. Private balcony. Lift access. HMO licence in place — student-friendly.',
    keyFeatures: [
      'Private balcony',
      'HMO licence — student-friendly',
      'Open-plan kitchen with integrated dishwasher, freezer and washer/dryer',
    ],
    compliance: {
      epc: 'B',
      councilTax: 'Band B',
    },
    location: 'Situated in the Royal Docks, the flat is just moments from Canning Town Underground station. The area is well served by bus routes, the DLR, the Jubilee line and the Elizabeth line, making it an ideal base for commuters, young professionals and students.',
    nearby: [
      { name: 'North Greenwich',            distance: '0.8 miles', kind: 'Tube' },
      { name: "St Luke's Primary School",   distance: '0.1 miles', kind: 'School' },
      { name: 'Faraday School',             distance: '0.3 miles', kind: 'School' },
      { name: 'Hallsville Primary School',  distance: '0.3 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£3,000',
      ukIncome: '£90,000pa',
      ukGuarantor: '£108,000pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Photos displayed in the exact uploaded numeric order (1..13); the
    // carousel keeps this sequence (no filename matches the floor-plan regex).
    image: '/images/silvertown-square-2bed/1.jpeg',
    gallery: [
      '/images/silvertown-square-2bed/2.jpeg',
      '/images/silvertown-square-2bed/3.jpeg',
      '/images/silvertown-square-2bed/4.jpeg',
      '/images/silvertown-square-2bed/5.jpeg',
      '/images/silvertown-square-2bed/6.jpeg',
      '/images/silvertown-square-2bed/7.jpeg',
      '/images/silvertown-square-2bed/8.jpeg',
      '/images/silvertown-square-2bed/9.jpeg',
      '/images/silvertown-square-2bed/10.jpeg',
      '/images/silvertown-square-2bed/11.jpeg',
      '/images/silvertown-square-2bed/12.jpeg',
      '/images/silvertown-square-2bed/13.jpeg',
    ],
  },
]

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find(p => p.slug === slug)
}

// generateStaticParams uses this — draft pages still get an SSG detail
// page so an internal preview URL exists, they're just hidden from the
// public listing grid via `getLiveProperties()` below.
export function getAllPropertySlugs(): string[] {
  return properties.map(p => p.slug)
}

// Public-facing surfaces (rent grid, homepage featured) filter through
// this so draft records without confirmed EPC + council tax band never
// appear in a browsable list.
export function getLiveProperties(): Property[] {
  return properties.filter(p => p.status === 'live')
}
