// Hero data helpers for /buy detail pages:
// - Left: Street name or city exception ("Leeds", "Nottingham"). Never the developer or development name.
// - Right: Unit types with starting prices or "Register your interest" where unpriced.
// - Curated image sequences: exterior, living, kitchen, bedroom, bathroom/communal.

import type { Development } from './developments'

export const HERO_STREET_NAMES: Record<string, string> = {
  'leeds': 'Leeds',
  'burton-on-trent': 'New Street',
  'london-rd-staines': 'London Road',
  '5-steelhouse-ln-birmingham': 'Steelhouse Lane',
  'nottingham': 'Nottingham',
  '31-castleward-blvd-derby': 'Castleward Boulevard',
  'great-ducie-street-manchester': 'Great Ducie Street',
  'store-street-manchester': 'Store Street',
  '42-44-steelhouse-lane-birmingham': 'Steelhouse Lane',
  'mill-street-york': 'Mill Street',
  'dutton-street-manchester': 'Dutton Street',
}

export function getHeroStreetName(slug: string, dev?: Development): string {
  if (HERO_STREET_NAMES[slug]) {
    return HERO_STREET_NAMES[slug]
  }
  if (dev?.address) {
    // Extract first component of address (before first comma)
    const street = dev.address.split(',')[0]?.trim()
    // Strip leading street numbers like "56-60 "
    return street.replace(/^\d+([–-]\d+)?\s+/, '')
  }
  return dev?.locality || 'New Homes'
}

export function getHeroPricingLines(slug: string, dev?: Development): string[] {
  if (slug === 'london-rd-staines') {
    return [
      '1 bed apartments from £282,316',
      '2 bed apartments from £403,670',
      '3 bed apartments from £500,000',
    ]
  }

  if (slug === 'nottingham') {
    return ['Student living quarters from £99,995']
  }

  if (slug === 'leeds') {
    return ['1 bed apartments', 'Register your interest']
  }

  if (slug === 'burton-on-trent') {
    return ['1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === '5-steelhouse-ln-birmingham') {
    return ['Studio, 1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === '31-castleward-blvd-derby') {
    return ['Studio, 1, 2 & 3 bed apartments', 'Register your interest']
  }

  if (slug === 'great-ducie-street-manchester') {
    return ['1, 2 & 3 bed apartments', 'Register your interest']
  }

  if (slug === 'store-street-manchester') {
    return ['1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === '42-44-steelhouse-lane-birmingham') {
    return ['1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === 'mill-street-york') {
    return ['1, 2 & 3 bed apartments', 'Register your interest']
  }

  if (slug === 'dutton-street-manchester') {
    return ['Apartments, duplexes & penthouses', 'Register your interest']
  }

  // Fallback for any future development
  return [dev?.price || 'Register your interest']
}

// Curated 5-photo sequences per development matching:
// exterior -> living room -> kitchen -> bedroom -> bathroom / communal
export const CURATED_HERO_SLIDES: Record<string, string[]> = {
  'leeds': [
    '/images/developments/leeds/4.jpg',
    '/images/developments/leeds/number1.png',
    '/images/developments/leeds/2.jpg',
    '/images/developments/leeds/3.jpg',
    '/images/developments/leeds/1.jpg',
  ],
  'burton-on-trent': [
    '/images/developments/burton-on-trent/1.jpg',
    '/images/developments/burton-on-trent/number2.png',
    '/images/developments/burton-on-trent/3.jpg',
    '/images/developments/burton-on-trent/4.jpg',
    '/images/developments/burton-on-trent/6.jpg',
  ],
  'london-rd-staines': [
    '/images/developments/london-rd-staines/1.jpg',
    '/images/developments/london-rd-staines/number3.png',
    '/images/developments/london-rd-staines/5.jpg',
    '/images/developments/london-rd-staines/6.jpg',
    '/images/developments/london-rd-staines/7.jpg',
  ],
  '5-steelhouse-ln-birmingham': [
    '/images/developments/5-steelhouse-ln-birmingham/1.jpg',
    '/images/developments/5-steelhouse-ln-birmingham/number4.png',
    '/images/developments/5-steelhouse-ln-birmingham/9.jpg',
    '/images/developments/5-steelhouse-ln-birmingham/5.jpg',
    '/images/developments/5-steelhouse-ln-birmingham/12.jpg',
  ],
  'nottingham': [
    '/images/developments/nottingham/1.jpg',
    '/images/developments/nottingham/5.jpg',
    '/images/developments/nottingham/8.jpg',
    '/images/developments/nottingham/9.jpg',
    '/images/developments/nottingham/13.jpg',
  ],
  '31-castleward-blvd-derby': [
    '/images/developments/31-castleward-blvd-derby/1.jpg',
    '/images/developments/31-castleward-blvd-derby/7.jpg',
    '/images/developments/31-castleward-blvd-derby/13.jpg',
    '/images/developments/31-castleward-blvd-derby/8.jpg',
    '/images/developments/31-castleward-blvd-derby/10.jpg',
  ],
  'great-ducie-street-manchester': [
    '/images/developments/great-ducie-street-manchester/3.jpg',
    '/images/developments/great-ducie-street-manchester/5.jpg',
    '/images/developments/great-ducie-street-manchester/7.jpg',
    '/images/developments/great-ducie-street-manchester/8.jpg',
    '/images/developments/great-ducie-street-manchester/number7.png',
  ],
  'store-street-manchester': [
    '/images/developments/store-street-manchester/1.jpg',
    '/images/developments/store-street-manchester/number8.png',
    '/images/developments/store-street-manchester/4.jpg',
    '/images/developments/store-street-manchester/5.jpg',
    '/images/developments/store-street-manchester/3.jpg',
  ],
  '42-44-steelhouse-lane-birmingham': [
    '/images/developments/42-44-steelhouse-lane-birmingham/1.jpg',
    '/images/developments/42-44-steelhouse-lane-birmingham/3.jpg',
    '/images/developments/42-44-steelhouse-lane-birmingham/9.jpg',
    '/images/developments/42-44-steelhouse-lane-birmingham/5.jpg',
    '/images/developments/42-44-steelhouse-lane-birmingham/2.jpg',
  ],
  'mill-street-york': [
    '/images/developments/mill-street-york/1.jpg',
    '/images/developments/mill-street-york/5.jpg',
    '/images/developments/mill-street-york/4.jpg',
    '/images/developments/mill-street-york/6.jpg',
    '/images/developments/mill-street-york/7.jpg',
  ],
  'dutton-street-manchester': [
    '/images/developments/dutton-street-manchester/number10.jpeg',
    '/images/developments/dutton-street-manchester/2.jpg',
    '/images/developments/dutton-street-manchester/5.jpg',
    '/images/developments/dutton-street-manchester/8.jpg',
    '/images/developments/dutton-street-manchester/12.jpg',
  ],
}

export function getHeroSlideImages(slug: string, fallbackImages: string[]): string[] {
  if (CURATED_HERO_SLIDES[slug] && CURATED_HERO_SLIDES[slug].length > 0) {
    return CURATED_HERO_SLIDES[slug]
  }
  return fallbackImages.slice(0, 5)
}
