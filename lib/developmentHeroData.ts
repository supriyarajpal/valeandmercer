// Hero data helpers for /buy detail pages:
// - Left: Street name or city exception ("Leeds", "Nottingham"). Never the developer or development name.
// - Right: Unit types with starting prices or "Register your interest" where unpriced.
// - Curated image sequences: exterior, living, kitchen, bedroom, bathroom/communal.

import type { Development } from './developments'

export const HERO_STREET_NAMES: Record<string, string> = {
  'aire-gardens-leeds': 'Leeds',
  'crown-works-burton': 'New Street',
  'elizabeth-house-staines': 'London Road',
  'fountain-court-birmingham': 'Steelhouse Lane',
  'graduation-house-nottingham': 'Nottingham',
  'mulberry-house-derby': 'Castleward Boulevard',
  'one-victoria-manchester': 'Great Ducie Street',
  'piccadilly-wharf-manchester': 'Store Street',
  'priors-gate-birmingham': 'Steelhouse Lane',
  'st-georges-terrace-york': 'Mill Street',
  'waterhouse-gardens-manchester': 'Dutton Street',
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
  if (slug === 'elizabeth-house-staines') {
    return [
      '1 bed apartments from £282,316',
      '2 bed apartments from £403,670',
      '3 bed apartments from £500,000',
    ]
  }

  if (slug === 'graduation-house-nottingham') {
    return ['Student living quarters from £99,995']
  }

  if (slug === 'aire-gardens-leeds') {
    return ['1 bed apartments', 'Register your interest']
  }

  if (slug === 'crown-works-burton') {
    return ['1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === 'fountain-court-birmingham') {
    return ['Studio, 1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === 'mulberry-house-derby') {
    return ['Studio, 1, 2 & 3 bed apartments', 'Register your interest']
  }

  if (slug === 'one-victoria-manchester') {
    return ['1, 2 & 3 bed apartments', 'Register your interest']
  }

  if (slug === 'piccadilly-wharf-manchester') {
    return ['1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === 'priors-gate-birmingham') {
    return ['1 & 2 bed apartments', 'Register your interest']
  }

  if (slug === 'st-georges-terrace-york') {
    return ['1, 2 & 3 bed apartments', 'Register your interest']
  }

  if (slug === 'waterhouse-gardens-manchester') {
    return ['Apartments, duplexes & penthouses', 'Register your interest']
  }

  // Fallback for any future development
  return [dev?.price || 'Register your interest']
}

// Curated 5-photo sequences per development matching:
// exterior -> living room -> kitchen -> bedroom -> bathroom / communal
export const CURATED_HERO_SLIDES: Record<string, string[]> = {
  'aire-gardens-leeds': [
    '/images/developments/aire-gardens-leeds/4.jpg',
    '/images/developments/aire-gardens-leeds/number1.png',
    '/images/developments/aire-gardens-leeds/2.jpg',
    '/images/developments/aire-gardens-leeds/3.jpg',
    '/images/developments/aire-gardens-leeds/1.jpg',
  ],
  'crown-works-burton': [
    '/images/developments/crown-works-burton/1.jpg',
    '/images/developments/crown-works-burton/number2.png',
    '/images/developments/crown-works-burton/3.jpg',
    '/images/developments/crown-works-burton/4.jpg',
    '/images/developments/crown-works-burton/6.jpg',
  ],
  'elizabeth-house-staines': [
    '/images/developments/elizabeth-house-staines/1.jpg',
    '/images/developments/elizabeth-house-staines/number3.png',
    '/images/developments/elizabeth-house-staines/5.jpg',
    '/images/developments/elizabeth-house-staines/6.jpg',
    '/images/developments/elizabeth-house-staines/7.jpg',
  ],
  'fountain-court-birmingham': [
    '/images/developments/fountain-court-birmingham/1.jpg',
    '/images/developments/fountain-court-birmingham/number4.png',
    '/images/developments/fountain-court-birmingham/9.jpg',
    '/images/developments/fountain-court-birmingham/5.jpg',
    '/images/developments/fountain-court-birmingham/12.jpg',
  ],
  'graduation-house-nottingham': [
    '/images/developments/graduation-house-nottingham/1.jpg',
    '/images/developments/graduation-house-nottingham/5.jpg',
    '/images/developments/graduation-house-nottingham/8.jpg',
    '/images/developments/graduation-house-nottingham/9.jpg',
    '/images/developments/graduation-house-nottingham/13.jpg',
  ],
  'mulberry-house-derby': [
    '/images/developments/mulberry-house-derby/1.jpg',
    '/images/developments/mulberry-house-derby/7.jpg',
    '/images/developments/mulberry-house-derby/13.jpg',
    '/images/developments/mulberry-house-derby/8.jpg',
    '/images/developments/mulberry-house-derby/10.jpg',
  ],
  'one-victoria-manchester': [
    '/images/developments/one-victoria-manchester/3.jpg',
    '/images/developments/one-victoria-manchester/5.jpg',
    '/images/developments/one-victoria-manchester/7.jpg',
    '/images/developments/one-victoria-manchester/8.jpg',
    '/images/developments/one-victoria-manchester/number7.png',
  ],
  'piccadilly-wharf-manchester': [
    '/images/developments/piccadilly-wharf-manchester/1.jpg',
    '/images/developments/piccadilly-wharf-manchester/number8.png',
    '/images/developments/piccadilly-wharf-manchester/4.jpg',
    '/images/developments/piccadilly-wharf-manchester/5.jpg',
    '/images/developments/piccadilly-wharf-manchester/3.jpg',
  ],
  'priors-gate-birmingham': [
    '/images/developments/priors-gate-birmingham/1.jpg',
    '/images/developments/priors-gate-birmingham/3.jpg',
    '/images/developments/priors-gate-birmingham/9.jpg',
    '/images/developments/priors-gate-birmingham/5.jpg',
    '/images/developments/priors-gate-birmingham/2.jpg',
  ],
  'st-georges-terrace-york': [
    '/images/developments/st-georges-terrace-york/1.jpg',
    '/images/developments/st-georges-terrace-york/5.jpg',
    '/images/developments/st-georges-terrace-york/4.jpg',
    '/images/developments/st-georges-terrace-york/6.jpg',
    '/images/developments/st-georges-terrace-york/7.jpg',
  ],
  'waterhouse-gardens-manchester': [
    '/images/developments/waterhouse-gardens-manchester/number10.jpeg',
    '/images/developments/waterhouse-gardens-manchester/2.jpg',
    '/images/developments/waterhouse-gardens-manchester/5.jpg',
    '/images/developments/waterhouse-gardens-manchester/8.jpg',
    '/images/developments/waterhouse-gardens-manchester/12.jpg',
  ],
}

export function getHeroSlideImages(slug: string, fallbackImages: string[]): string[] {
  if (CURATED_HERO_SLIDES[slug] && CURATED_HERO_SLIDES[slug].length > 0) {
    return CURATED_HERO_SLIDES[slug]
  }
  return fallbackImages.slice(0, 5)
}
