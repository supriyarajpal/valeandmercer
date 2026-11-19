// Data layer for the city landing pages (/new-homes/<city>). Server-only (reads
// the filesystem at build time). City imagery comes only from the converted
// WebP under public/images/cities/<city>/ (originals + credits live in the
// gitignored content/city-images/, converted by scripts/build-city-images.mjs).
// A missing image means the hero falls back to an ink glow and an Around card is
// skipped. Property photos appear only inside the shared listing cards. No prose
// is authored here: copy comes from content/city-pages/<city>.json; the H1,
// homes heading and enquiry heading are templated from the city name.

import fs from 'node:fs'
import path from 'node:path'
import { developments, type Development } from './developments'
import { developmentIsPublished, developmentHeading, developmentUnitTypes } from './developmentTitle'
import { getDevelopmentAssets, developmentHeroImage, developmentHasPhotos } from './developmentAssets'
import { CITY_PAGES } from './cityPages'
import type { DevelopmentCardData } from '@/components/DevelopmentsListing'

export const CITY_IMAGE_WIDTHS = [640, 1080, 1920] as const

export interface CityImage { base: string } // + "-<w>.webp"
// A neighbourhood card: a name, one optional descriptive line, an optional
// minutes badge (only Birmingham states minutes; London/Manchester state a
// line). The card renders only when its image exists.
export interface CityAroundItem { place: string; note?: string; minutes?: number; image: CityImage }
export interface CityWhyItem { title: string; text: string }
export interface CityCopy {
  h1?: string                    // hero headline; the city word is rendered gold italic
  intro?: string
  cta?: string
  about?: string[]
  around?: { heading?: string; label?: string; items?: Array<{ place: string; note?: string; minutes?: number }> }
  why?: { heading?: string; label?: string; items?: CityWhyItem[] }
  finalHeading?: string          // closing headline above the enquiry; city word gold italic
}
export interface CityLanding {
  slug: string
  name: string
  hero: CityImage | null          // null falls back to the ink glow
  copy: CityCopy
  around: CityAroundItem[]         // only items whose image exists
  cards: DevelopmentCardData[]
  devCount: number
  showFilters: boolean            // bedroom/type chips only at 6+ developments
}

// Pin positions in the uk.svg coordinate space (see public/maps/uk.svg viewBox).
export const CITY_PINS: Record<string, { x: number; y: number }> = {
  birmingham: { x: 206, y: 410 },
  london: { x: 320, y: 482 },
  manchester: { x: 188, y: 350 },
}

function loadUkMap(): { viewBox: string; path: string } {
  try {
    const svg = fs.readFileSync(path.join(process.cwd(), 'public', 'maps', 'uk.svg'), 'utf8')
    const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 420 560'
    const d = svg.match(/\sd="([^"]+)"/)?.[1] ?? ''
    return { viewBox, path: d }
  } catch {
    return { viewBox: '0 0 420 560', path: '' }
  }
}
export const UK_MAP = loadUkMap()

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function imageIfExists(slug: string, name: string): CityImage | null {
  const probe = path.join(process.cwd(), 'public', 'images', 'cities', slug, `${name}-${CITY_IMAGE_WIDTHS[0]}.webp`)
  return fs.existsSync(probe) ? { base: `/images/cities/${slug}/${name}` } : null
}

function cityOf(dev: Development): string {
  return (dev.locality || '').split(',').map(s => s.trim()).filter(Boolean).pop() || ''
}

export function getCityDevelopments(cityName: string): Development[] {
  const want = cityName.trim().toLowerCase()
  return developments.filter(d => developmentIsPublished(d) && cityOf(d).toLowerCase() === want)
}

// Whether a development's city has its own /new-homes page. Derived from the
// CITY_PAGES registry (never a hardcoded slug): such a development is listed on
// its city page and therefore MOVED OFF the /buy grid. A development whose city
// has no page keeps its /buy card. Both surfaces link to the same /buy/<slug>.
const CITY_PAGE_NAMES = new Set(CITY_PAGES.map(c => c.name.trim().toLowerCase()))
export function developmentHasCityPage(dev: Development): boolean {
  return CITY_PAGE_NAMES.has(cityOf(dev).toLowerCase())
}

// A gateway card for the top of /buy: one per city that has a page. The "From"
// price is the lowest pound figure stated across that city's developments (so a
// "Register your interest" development contributes nothing); null when none
// states a figure, in which case the card shows no price.
export interface CityCardData {
  slug: string
  name: string
  devCount: number
  fromPrice: string | null   // e.g. "£425,000"
  hero: CityImage | null     // city hero; null falls back to the ink/gold glow
}

function lowestPrice(devs: Development[]): string | null {
  const amounts: number[] = []
  for (const d of devs) {
    const p = typeof d.price === 'string' ? d.price : ''
    for (const m of p.match(/£\s?[\d,]+/g) ?? []) {
      const n = parseInt(m.replace(/[^\d]/g, ''), 10)
      if (Number.isFinite(n) && n > 0) amounts.push(n)
    }
  }
  if (amounts.length === 0) return null
  return '£' + Math.min(...amounts).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// One card per city page, ordered by development count (most first) then by
// name. Derived entirely from the registry and the per-city development set, so
// adding a city page here needs no change on /buy.
export function getCityCards(): CityCardData[] {
  return CITY_PAGES
    .map(c => {
      const devs = getCityDevelopments(c.name)
      return { slug: c.slug, name: c.name, devCount: devs.length, fromPrice: lowestPrice(devs), hero: imageIfExists(c.slug, 'hero') }
    })
    .sort((a, b) => b.devCount - a.devCount || a.name.localeCompare(b.name))
}

function buildCards(devs: Development[]): DevelopmentCardData[] {
  return devs.map(dev => {
    const base = getDevelopmentAssets(dev.slug)
    const gallery = dev.gallery && dev.gallery.length > 0 ? dev.gallery : base.images
    return {
      slug: dev.slug,
      title: developmentHeading(dev),
      unitSummary: developmentUnitTypes(dev) ?? undefined,
      price: dev.price,
      heroImage: gallery[0] ?? developmentHeroImage(dev.slug),
      hasPhotos: gallery.length > 0 || developmentHasPhotos(dev.slug),
      images: gallery,
    }
  })
}

export function loadCityCopy(slug: string): CityCopy {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'city-pages', slug + '.json'), 'utf8')) as CityCopy
  } catch {
    return {}
  }
}

export function buildCityLanding(slug: string, name: string): CityLanding {
  const copy = loadCityCopy(slug)
  const devs = getCityDevelopments(name)
  const around: CityAroundItem[] = (copy.around?.items ?? [])
    .map(it => { const image = imageIfExists(slug, slugify(it.place)); return image ? { ...it, image } : null })
    .filter((c): c is CityAroundItem => c !== null)

  return {
    slug,
    name,
    hero: imageIfExists(slug, 'hero'),
    copy,
    around,
    cards: buildCards(devs),
    devCount: devs.length,
    showFilters: devs.length >= 6,
  }
}
