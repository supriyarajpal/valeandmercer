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

// A single gallery frame plus the room/area it shows. `label` drives the
// bottom-left caption in the hero carousel (PropertyHeroCarousel) once the
// gallery is opened — e.g. "Bedroom", "Kitchen". Omit it for shots that
// don't cleanly fit one category (hallways-mid-shot, detail crops) rather
// than guessing; the caption simply doesn't render for that frame.
export type GalleryPhoto = {
  src: string
  label?: string
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
  // Caption for the hero frame itself (`image`), same vocabulary as
  // GalleryPhoto['label'].
  imageLabel?: string
  gallery?: GalleryPhoto[]
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
  email: 'enquiry@valeandmercer.co.uk',
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
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/marsh-wall-5958/2.jpeg', label: 'Living Room' },
      { src: '/images/marsh-wall-5958/10.jpeg', label: 'Kitchen' },
      { src: '/images/marsh-wall-5958/3.jpeg', label: 'Kitchen' },
      { src: '/images/marsh-wall-5958/4.jpeg', label: 'Kitchen' },
      { src: '/images/marsh-wall-5958/5.jpeg', label: 'Kitchen' },
      { src: '/images/marsh-wall-5958/13.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-5958/16.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-5958/12.jpeg', label: 'Bathroom' },
      { src: '/images/marsh-wall-5958/8.jpeg', label: 'Bathroom' },
      { src: '/images/marsh-wall-5958/7.jpeg' },
      { src: '/images/marsh-wall-5958/1.jpeg', label: 'Communal Area' },
      { src: '/images/marsh-wall-5958/11.jpeg', label: 'Communal Area' },
      { src: '/images/marsh-wall-5958/6.jpeg', label: 'Communal Area' },
      { src: '/images/marsh-wall-5958/9.jpeg', label: 'Communal Area' },
      { src: '/images/marsh-wall-5958/14.jpeg', label: 'Floor Plan' },
    ],
    teaser: 'Fully furnished 3-bed in Canary Wharf with high ceilings, a pool, gym and access to London\'s highest communal garden.',
    featured: true,
  },
  // Added per client 2026-07-16. SEPARATE unit from the 3-bed marsh-wall-3bed-5958
  // above — same street (Marsh Wall), different building/locality. The structured
  // header locality is E14 · Cubitt Town (authoritative), even though the body copy
  // loosely refers to Canary Wharf. Room order below is verified against the actual
  // uploaded photos, not the source filenames (the folder had 11 "bedroom*" files
  // for a 2-bed — all confirmed genuine bedroom angles by eye). One photo (31.jpeg,
  // originally "communal area.jpeg") is the local DLR/Underground station, not a
  // building communal area, so its label is intentionally omitted.
  {
    id: '31871',
    slug: 'marsh-wall-2bed-4050',
    coordinates: { lat: 51.4988, lng: -0.0166 },
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
      'Furnished', '2 beds', '2 baths', '18th floor', 'Modern', 'Air Conditioning',
      'Big Windows', 'Terrace', 'Great View', 'Concierge', '24hr Security', 'Gym',
      'Elevator', 'Ample Storage', 'Open Plan Kitchen', 'Washer', 'Dryer',
      'Dishwasher', 'Freezer',
    ],
    headline: '2-Bedroom Flat to Rent in Cubitt Town | Marsh Wall, London | Available 21st August | 842 sq. ft. | 18th Floor | EPC: B | Council Tax Band: F',
    description: 'This well-presented 2-bedroom, 2-bathroom flat is available to rent on Marsh Wall, moments from Canary Wharf. Occupying 842 sq. ft. on the 18th floor, the modern property benefits from big windows that draw in plenty of natural light, generous built-in storage and a private balcony with far-reaching views. It comes with air conditioning — a rare feature in London — and an open-plan kitchen fitted with integrated appliances including a dishwasher, freezer and washer/dryer. Residents further benefit from a gym, concierge, lift access and 24-hour secure facilities, and the flat sits just moments from Canary Wharf Underground station.',
    amenities: 'Air conditioning, a rare feature in London. Open-plan kitchen with integrated appliances including a dishwasher, freezer and washer/dryer. Private balcony/terrace. Lift access. Gym, concierge and 24-hour security.',
    keyFeatures: [
      'Private balcony with far-reaching views',
      'Air conditioning — a rare feature in London',
      'Open-plan kitchen with integrated dishwasher, freezer and washer/dryer',
    ],
    compliance: {
      epc: 'B',
      councilTax: 'Band F',
    },
    location: 'Situated on Marsh Wall on the Isle of Dogs, the flat is just moments from Canary Wharf Underground station, with easy access to the world-class shopping, waterside dining and bars of the Canary Wharf estate. The area is well served by the Jubilee line, the DLR and the Elizabeth line, making it an ideal base for commuters and young professionals.',
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
    // Order: living(1,2,3) · dining(4,5) · kitchen(6,7) · bedroom(8-18) ·
    // bath(19-22) · balcony(23,24) · view(25) · hallway(26,27) ·
    // communal(28) · exterior(29,30) · station-unlabelled(31) · floorplan(32)
    image: '/images/marsh-wall-2bed-4050/1.jpeg',
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/marsh-wall-2bed-4050/2.jpeg', label: 'Living Room' },
      { src: '/images/marsh-wall-2bed-4050/3.jpeg', label: 'Living Room' },
      { src: '/images/marsh-wall-2bed-4050/4.jpeg', label: 'Dining Area' },
      { src: '/images/marsh-wall-2bed-4050/5.jpeg', label: 'Dining Area' },
      { src: '/images/marsh-wall-2bed-4050/6.jpeg', label: 'Kitchen' },
      { src: '/images/marsh-wall-2bed-4050/7.jpeg', label: 'Kitchen' },
      { src: '/images/marsh-wall-2bed-4050/8.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/9.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/10.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/11.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/12.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/13.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/14.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/15.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/16.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/17.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/18.jpeg', label: 'Bedroom' },
      { src: '/images/marsh-wall-2bed-4050/19.jpeg', label: 'Bathroom' },
      { src: '/images/marsh-wall-2bed-4050/20.jpeg', label: 'Bathroom' },
      { src: '/images/marsh-wall-2bed-4050/21.jpeg', label: 'Bathroom' },
      { src: '/images/marsh-wall-2bed-4050/22.jpeg', label: 'Bathroom' },
      { src: '/images/marsh-wall-2bed-4050/23.jpeg', label: 'Balcony' },
      { src: '/images/marsh-wall-2bed-4050/24.jpeg', label: 'Balcony' },
      { src: '/images/marsh-wall-2bed-4050/25.jpeg', label: 'View' },
      { src: '/images/marsh-wall-2bed-4050/26.jpeg', label: 'Hallway' },
      { src: '/images/marsh-wall-2bed-4050/27.jpeg', label: 'Hallway' },
      { src: '/images/marsh-wall-2bed-4050/28.jpeg', label: 'Communal Area' },
      { src: '/images/marsh-wall-2bed-4050/29.jpeg', label: 'Building Exterior' },
      { src: '/images/marsh-wall-2bed-4050/30.jpeg', label: 'Building Exterior' },
      { src: '/images/marsh-wall-2bed-4050/31.jpeg' },
      { src: '/images/marsh-wall-2bed-4050/32.jpeg', label: 'Floor Plan' },
    ],
    teaser: 'Furnished 2-bed on the 18th floor with air conditioning, a private terrace and far-reaching Canary Wharf views.',
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
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/westferry-circus-4078/19.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4078/3.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4078/4.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4078/15.jpeg', label: 'Kitchen' },
      { src: '/images/westferry-circus-4078/12.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4078/14.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4078/17.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4078/7.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4078/5.jpeg', label: 'Bathroom' },
      { src: '/images/westferry-circus-4078/9.jpeg', label: 'Bathroom' },
      { src: '/images/westferry-circus-4078/16.jpeg' },
      { src: '/images/westferry-circus-4078/10.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4078/18.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4078/2.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4078/6.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4078/8.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4078/11.jpeg', label: 'Floor Plan' },
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
    // 21 more photos (interior rooms + building) were sitting in
    // public/images/westferry-circus-4160/ under garbled/duplicate-avoidance
    // filenames (WhatsApp exports, "next 3.jpeg", etc.) and were never wired
    // into the gallery. Renamed to westferry-circus-4160-6..26.jpeg and
    // added below; every label here (including 1-5) is transcribed from
    // actually viewing the photo, not guessed. #2 was previously mislabelled
    // "Communal Area" — it's actually the riverside walk, moved into View.
    // Order: living(6,7,8,9,10) · kitchen(11) · bedroom(12,13) · bath(14,15) ·
    // hallway(16,17) · view(18,2,19,20) · exterior(21,22) · communal(1,3,4,23-26)
    image: '/images/westferry-circus-4160/westferry-circus-4160-5.jpeg',
    imageLabel: 'View',
    gallery: [
      { src: '/images/westferry-circus-4160/westferry-circus-4160-6.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-7.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-8.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-9.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-10.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-11.jpeg', label: 'Kitchen' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-12.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-13.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-14.jpeg', label: 'Bathroom' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-15.jpeg', label: 'Bathroom' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-16.jpeg', label: 'Hallway' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-17.jpeg', label: 'Hallway' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-18.jpeg', label: 'View' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-2.jpeg', label: 'View' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-19.jpeg', label: 'View' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-20.jpeg', label: 'View' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-21.jpeg', label: 'Building Exterior' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-22.jpeg', label: 'Building Exterior' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-1.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-3.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-4.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-23.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-24.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-25.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4160/westferry-circus-4160-26.jpeg', label: 'Communal Area' },
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
    // Order below is verified against the actual photos, not the earlier
    // "Order: ..." comment, which turned out badly scrambled on re-check
    // (e.g. it called 6.jpeg "living" — it's the floor plan; it called
    // 4.jpeg the floor plan — it's a balcony shot; several "communal"
    // entries were actually bedrooms/exteriors/a view). #13, #21 and #23
    // are the same building-exterior photo uploaded three times; #17 and
    // #25 are the same cinema-room shot twice — kept as-is since the
    // duplicates were already in the source upload, not introduced here.
    // Order: living(18,19,8,3) · kitchen(12) · bedroom(1,2,7,11,14) ·
    // bath(10) · balcony(4,16) · hallway(9) · view(20,27) ·
    // exterior(13,15,21,23) · communal(5,17,22,24,25,26,28,29) · floorplan(6)
    image: '/images/westferry-circus-4377/18.jpeg',
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/westferry-circus-4377/19.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4377/8.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4377/3.jpeg', label: 'Living Room' },
      { src: '/images/westferry-circus-4377/12.jpeg', label: 'Kitchen' },
      { src: '/images/westferry-circus-4377/1.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4377/2.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4377/7.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4377/11.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4377/14.jpeg', label: 'Bedroom' },
      { src: '/images/westferry-circus-4377/10.jpeg', label: 'Bathroom' },
      { src: '/images/westferry-circus-4377/4.jpeg', label: 'Balcony' },
      { src: '/images/westferry-circus-4377/16.jpeg', label: 'Balcony' },
      { src: '/images/westferry-circus-4377/9.jpeg', label: 'Hallway' },
      { src: '/images/westferry-circus-4377/20.jpeg', label: 'View' },
      { src: '/images/westferry-circus-4377/27.jpeg', label: 'View' },
      { src: '/images/westferry-circus-4377/13.jpeg', label: 'Building Exterior' },
      { src: '/images/westferry-circus-4377/15.jpeg', label: 'Building Exterior' },
      { src: '/images/westferry-circus-4377/21.jpeg', label: 'Building Exterior' },
      { src: '/images/westferry-circus-4377/23.jpeg', label: 'Building Exterior' },
      { src: '/images/westferry-circus-4377/5.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/17.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/22.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/24.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/25.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/26.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/28.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/29.jpeg', label: 'Communal Area' },
      { src: '/images/westferry-circus-4377/6.jpeg', label: 'Floor Plan' },
    ],
    teaser: 'Luxurious interior-designed 2-bed on the 10th floor with a private balcony and panoramic Canary Wharf skyline views.',
    featured: true,
  },
  // Added per client 2026-07-11. Room order below is verified against the
  // actual uploaded photos (not the original pre-upload plan, which
  // turned out stale from image 4 onward — e.g. it claimed no floor plan
  // was supplied, but 14.jpeg is one).
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
    // carousel keeps this sequence. Labels below are transcribed from
    // actually viewing each photo.
    image: '/images/bywell-place-1bed/1.jpeg',
    imageLabel: 'Building Exterior',
    gallery: [
      { src: '/images/bywell-place-1bed/2.jpeg', label: 'Living Room' },
      { src: '/images/bywell-place-1bed/3.jpeg', label: 'Bedroom' },
      { src: '/images/bywell-place-1bed/4.jpeg', label: 'Living Room' },
      { src: '/images/bywell-place-1bed/5.jpeg', label: 'Bathroom' },
      { src: '/images/bywell-place-1bed/6.jpeg', label: 'Bathroom' },
      { src: '/images/bywell-place-1bed/7.jpeg', label: 'Hallway' },
      { src: '/images/bywell-place-1bed/8.jpeg', label: 'Living Room' },
      { src: '/images/bywell-place-1bed/9.jpeg', label: 'Bathroom' },
      { src: '/images/bywell-place-1bed/10.jpeg', label: 'Kitchen' },
      { src: '/images/bywell-place-1bed/11.jpeg', label: 'Balcony' },
      { src: '/images/bywell-place-1bed/12.jpeg', label: 'Bedroom' },
      { src: '/images/bywell-place-1bed/13.jpeg', label: 'Bedroom' },
      { src: '/images/bywell-place-1bed/14.jpeg', label: 'Floor Plan' },
      { src: '/images/bywell-place-1bed/15.jpeg', label: 'Living Room' },
      { src: '/images/bywell-place-1bed/16.jpeg', label: 'Living Room' },
      { src: '/images/bywell-place-1bed/17.jpeg', label: 'Hallway' },
      { src: '/images/bywell-place-1bed/18.jpeg', label: 'Bedroom' },
      { src: '/images/bywell-place-1bed/19.jpeg', label: 'Hallway' },
      { src: '/images/bywell-place-1bed/20.jpeg', label: 'Kitchen' },
    ],
  },
  // Added per client 2026-07-11. Room order below is verified against the
  // actual uploaded photos (not the original pre-upload plan, which
  // turned out stale from image 3 onward — e.g. it placed the floor plan
  // at 8, but it's actually 9).
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
    // carousel keeps this sequence. Labels below are transcribed from
    // actually viewing each photo.
    image: '/images/silvertown-square-2bed/1.jpeg',
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/silvertown-square-2bed/2.jpeg', label: 'Kitchen' },
      { src: '/images/silvertown-square-2bed/3.jpeg', label: 'Bedroom' },
      { src: '/images/silvertown-square-2bed/4.jpeg', label: 'Dining Area' },
      { src: '/images/silvertown-square-2bed/5.jpeg', label: 'Kitchen' },
      { src: '/images/silvertown-square-2bed/6.jpeg', label: 'Bedroom' },
      { src: '/images/silvertown-square-2bed/7.jpeg', label: 'Bathroom' },
      { src: '/images/silvertown-square-2bed/8.jpeg', label: 'Bathroom' },
      { src: '/images/silvertown-square-2bed/9.jpeg', label: 'Floor Plan' },
      { src: '/images/silvertown-square-2bed/10.jpeg', label: 'Living Room' },
      { src: '/images/silvertown-square-2bed/11.jpeg', label: 'Bathroom' },
      { src: '/images/silvertown-square-2bed/12.jpeg', label: 'Kitchen' },
      { src: '/images/silvertown-square-2bed/13.jpeg', label: 'Bedroom' },
    ],
  },
  // Added per client 2026-07-17. Ref 32743. Locality is E14 · Blackwall
  // (authoritative structured header), forming its own neighbourhood group on
  // /let; the body copy loosely refers to Poplar (adjacent E14). Size not
  // supplied in the source, so sqft is intentionally left null (not guessed).
  // Deposits follow the site-wide convention — holding = 1 week's rent (£577),
  // security = 5 weeks' rent (£2,885). Photo order verified against the actual
  // uploaded folder: living → kitchen → bedroom → bathroom → hallway →
  // building exterior; no floor plan supplied.
  {
    id: '32743',
    slug: 'newport-avenue-2bed-2500',
    coordinates: { lat: 51.5094, lng: 0.001 },
    listingType: 'To Let',
    status: 'live',
    ref: '32743',
    title: 'Newport Avenue',
    rent: '£2,500pcm',
    rentPW: '£577pw',
    beds: 2,
    baths: 2,
    area: 'E14 · Blackwall',
    available: 'now',
    holdingDeposit: '£577',
    securityDeposit: '£2,885',
    sqft: null,
    floor: null,
    epc: 'C',
    tags: [
      'Furnished', 'Parking', 'Washer', 'Big Windows', 'Ample Storage',
      'Concierge', 'Modern', 'Freezer',
    ],
    headline: '2-Bedroom Flat to Rent in Blackwall | Newport Avenue, London | Available Now | EPC: C | Council Tax Band: F',
    description: '2-bed, 2-bath flat to rent in Poplar on Newport Avenue. Modern living environment, large windows, high ceilings, generous built-in storage, open-plan kitchen with integrated appliances. Concierge, parking available. Moments from Westferry DLR, Canary Wharf Jubilee Line, and the Elizabeth Line.',
    amenities: 'Open-plan kitchen with integrated appliances including a washer and freezer. Large windows and high ceilings with generous built-in storage. Concierge. Parking available.',
    keyFeatures: [
      'Large windows and high ceilings with generous built-in storage',
      'Open-plan kitchen with integrated appliances',
      'Concierge and parking available',
    ],
    compliance: {
      epc: 'C',
      councilTax: 'Band F',
    },
    location: 'Situated on Newport Avenue in Blackwall, the flat is moments from Westferry DLR, with the Canary Wharf Jubilee line and the Elizabeth line close by. The area is well served by the DLR and road links, making it an ideal base for commuters and young professionals.',
    nearby: [
      { name: 'North Greenwich',         distance: '0.6 miles', kind: 'Tube' },
      { name: 'Canary Wharf',            distance: '0.8 miles', kind: 'Tube' },
      { name: 'Woolmore Primary School', distance: '0.3 miles', kind: 'School' },
      { name: 'Culloden Primary School', distance: '0.4 miles', kind: 'School' },
      { name: 'Faraday School',          distance: '0.5 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,500',
      ukIncome: '£75,000pa',
      ukGuarantor: '£90,000pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Order: living(1,2) · kitchen(3,4) · bedroom(5-9) · bath(10,11,12) ·
    // hallway(13) · building exterior(14). No floor plan supplied.
    image: '/images/newport-avenue-2bed-2500/1.jpeg',
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/newport-avenue-2bed-2500/2.jpeg', label: 'Living Room' },
      { src: '/images/newport-avenue-2bed-2500/3.jpeg', label: 'Kitchen' },
      { src: '/images/newport-avenue-2bed-2500/4.jpeg', label: 'Kitchen' },
      { src: '/images/newport-avenue-2bed-2500/5.jpeg', label: 'Bedroom' },
      { src: '/images/newport-avenue-2bed-2500/6.jpeg', label: 'Bedroom' },
      { src: '/images/newport-avenue-2bed-2500/7.jpeg', label: 'Bedroom' },
      { src: '/images/newport-avenue-2bed-2500/8.jpeg', label: 'Bedroom' },
      { src: '/images/newport-avenue-2bed-2500/9.jpeg', label: 'Bedroom' },
      { src: '/images/newport-avenue-2bed-2500/10.jpeg', label: 'Bathroom' },
      { src: '/images/newport-avenue-2bed-2500/11.jpeg', label: 'Bathroom' },
      { src: '/images/newport-avenue-2bed-2500/12.jpeg', label: 'Bathroom' },
      { src: '/images/newport-avenue-2bed-2500/13.jpeg', label: 'Hallway' },
      { src: '/images/newport-avenue-2bed-2500/14.jpeg', label: 'Building Exterior' },
    ],
    teaser: 'Furnished 2-bed in Blackwall with large windows, high ceilings, concierge and parking — moments from Westferry DLR and Canary Wharf.',
  },
  // Added per client 2026-07-17. Ref 30678. Locality is E16 · Canning Town
  // (Canning Town South ward) — the same neighbourhood group as Bywell Place
  // on /let, so both list together under one "Canning Town" heading (the
  // grouping key is the segment after "·"). The source header didn't print a
  // locality name, but Custom House/Canning Town South is confirmed by the
  // Jude Street, E16 geocode. Security deposit was garbled in the source brief;
  // derived from the site-wide convention (5 weeks' rent = £3,400; holding =
  // 1 week = £680, as supplied). The uploaded folder DOES include a floor plan
  // (contradicting the pre-upload note of "no floor plan") — placed last per
  // convention. One exterior shot in the folder was an exact duplicate and
  // was dropped.
  {
    id: '30678',
    slug: 'jude-street-2bed-2947',
    coordinates: { lat: 51.5116, lng: 0.0128 },
    listingType: 'To Let',
    status: 'live',
    ref: '30678',
    title: 'Jude Street',
    rent: '£2,947pcm',
    rentPW: '£680pw',
    beds: 2,
    baths: 2,
    area: 'E16 · Canning Town',
    available: '26 September',
    holdingDeposit: '£680',
    securityDeposit: '£3,400',
    sqft: 712,
    floor: '3rd floor',
    epc: 'C',
    tags: [
      'Furnished', '3rd Floor', 'Concierge', 'Elevator', 'Terrace',
      'Open Plan Kitchen', 'Dishwasher', 'Freezer', 'Washer', 'Big Windows',
      'Ample Storage',
    ],
    headline: '2-Bedroom Flat to Rent in Canning Town | Jude Street, London | Available 26th September | 712 sq. ft. | 3rd Floor | EPC: C | Council Tax Band: C',
    description: 'Flat to rent in Canning Town South on Jude Street, 2 bed, 2 bath, 712 sq ft, third floor. Big windows, ample storage, private balcony, abundant natural light. Open-plan kitchen with dishwasher, freezer, washer, lift, concierge. Moments from Canning Town, North Greenwich, and Canary Wharf tube stations.',
    amenities: 'Open-plan kitchen with integrated dishwasher, freezer and washer. Private balcony/terrace. Lift access. Concierge. Big windows and generous built-in storage.',
    keyFeatures: [
      'Private balcony with abundant natural light',
      'Open-plan kitchen with integrated dishwasher, freezer and washer',
      'Lift access and concierge',
    ],
    compliance: {
      epc: 'C',
      councilTax: 'Band C',
    },
    location: 'Situated on Jude Street in Canning Town South, the flat is moments from Canning Town station, with North Greenwich and Canary Wharf close by. The area is well served by the Jubilee line, the DLR and the Elizabeth line, making it an ideal base for commuters and young professionals.',
    nearby: [
      { name: 'North Greenwich',            distance: '0.9 miles', kind: 'Tube' },
      { name: "St Luke's Primary School",   distance: '0.1 miles', kind: 'School' },
      { name: 'Hallsville Primary School',  distance: '0.3 miles', kind: 'School' },
      { name: 'Faraday School',             distance: '0.3 miles', kind: 'School' },
    ],
    income: {
      rentPM: '£2,947',
      ukIncome: '£88,410pa',
      ukGuarantor: '£106,092pa',
      foreignGuarantor: 'Not considered',
      adverseCredit: 'No active CCJ',
    },
    // Order verified against the actual uploaded photos:
    // living(1,2,3) · kitchen(4) · bedroom(5,6) · bath(7,8,9) · balcony(10) ·
    // view(11) · hallway(12) · building exterior(13,14) · floor plan(15, last).
    image: '/images/jude-street-2bed-2947/1.jpeg',
    imageLabel: 'Living Room',
    gallery: [
      { src: '/images/jude-street-2bed-2947/2.jpeg', label: 'Living Room' },
      { src: '/images/jude-street-2bed-2947/3.jpeg', label: 'Living Room' },
      { src: '/images/jude-street-2bed-2947/4.jpeg', label: 'Kitchen' },
      { src: '/images/jude-street-2bed-2947/5.jpeg', label: 'Bedroom' },
      { src: '/images/jude-street-2bed-2947/6.jpeg', label: 'Bedroom' },
      { src: '/images/jude-street-2bed-2947/7.jpeg', label: 'Bathroom' },
      { src: '/images/jude-street-2bed-2947/8.jpeg', label: 'Bathroom' },
      { src: '/images/jude-street-2bed-2947/9.jpeg', label: 'Bathroom' },
      { src: '/images/jude-street-2bed-2947/10.jpeg', label: 'Balcony' },
      { src: '/images/jude-street-2bed-2947/11.jpeg', label: 'View' },
      { src: '/images/jude-street-2bed-2947/12.jpeg', label: 'Hallway' },
      { src: '/images/jude-street-2bed-2947/13.jpeg', label: 'Building Exterior' },
      { src: '/images/jude-street-2bed-2947/14.jpeg', label: 'Building Exterior' },
      { src: '/images/jude-street-2bed-2947/15.jpeg', label: 'Floor Plan' },
    ],
    teaser: 'Furnished 2-bed on the third floor with a private balcony, open-plan kitchen, lift and concierge — moments from Canning Town station.',
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
