// The cities that have a /new-homes/<city> page. A development joins a city page
// purely by the city in its address (see lib/cityLanding.ts), so this list only
// controls which routes exist, never which developments appear. Used by the city
// page, the sitemap, and the /buy city-links row.

export interface CityPage {
  slug: string
  name: string
}

export const CITY_PAGES: CityPage[] = [
  { slug: 'birmingham', name: 'Birmingham' },
  { slug: 'london', name: 'London' },
  { slug: 'manchester', name: 'Manchester' },
]

export function getCityBySlug(slug: string): CityPage | undefined {
  return CITY_PAGES.find(c => c.slug === slug)
}
