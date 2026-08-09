// Sales / new-homes developments, ingested from brochure PDFs by
// scripts/extract-brochures.sh and hand-verified into one data.json per
// development under content/properties/<slug>/data.json.
//
// This is deliberately SEPARATE from the lettings model in lib/properties.ts.
// A sales development carries developer / tenure / completion / unit-mix /
// payment-structure / warranty data that a rental listing never has, so it gets
// its own type and its own build-time loader rather than being forced into the
// lettings `Property` shape.
//
// Server-only: this module reads the filesystem at build time (SSG), the same
// way a Server Component would read from a database or ORM. Do not import it
// into a Client Component.

import fs from 'node:fs'
import path from 'node:path'

/** One row of the unit mix / availability table. Every field is optional
 *  because brochures state wildly different subsets; the index signature keeps
 *  any extra column a brochure supplies without losing type-safety on the
 *  common ones. */
export interface UnitMixRow {
  type?: string
  beds?: number | string
  size?: string
  price?: string
  availability?: string
  [key: string]: unknown
}

/** A titled block of specification bullet points (e.g. "Kitchens", "Bathrooms"). */
export interface SpecSection {
  heading: string
  items: string[]
}

export interface NearestStation {
  name: string
  distance?: string
  time?: string
}

/**
 * A single sales development.
 *
 * Only `slug` (derived from the folder name) is guaranteed. Every content field
 * is optional by design: the ingestion pipeline OMITS any field the brochure
 * does not explicitly state — nothing is inferred, estimated, or back-filled —
 * so consumers must treat all content fields as possibly-absent.
 */
export interface Development {
  slug: string
  name?: string
  address?: string
  postcode?: string
  locality?: string
  price?: string
  tenure?: string
  developer?: string
  completion?: string
  totalUnits?: number | string
  sizeRange?: string
  unitMix?: UnitMixRow[]
  paymentStructure?: string
  warranty?: string
  headline?: string
  description?: string
  highlightedFeatures?: string[]
  developmentAmenities?: string[]
  specification?: SpecSection[]
  nearestStation?: NearestStation
  locationNotes?: string
  // Published gallery image paths (e.g. "/images/developments/<slug>/1.png"),
  // written by scripts/publish-gallery.sh. When present this is the authoritative
  // ordered gallery for the /buy pages; otherwise they fall back to whatever is
  // in the asset manifest (lib/developmentAssets.generated.json).
  gallery?: string[]
}

const PROPERTIES_DIR = path.join(process.cwd(), 'content', 'properties')

function loadDevelopments(): Development[] {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(PROPERTIES_DIR, { withFileTypes: true })
  } catch {
    // content/properties/ absent (e.g. nothing ingested yet) — no developments.
    return []
  }

  const developments: Development[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'extracted') continue // our extraction output, not a development

    const dataPath = path.join(PROPERTIES_DIR, entry.name, 'data.json')
    let raw: string
    try {
      raw = fs.readFileSync(dataPath, 'utf8')
    } catch {
      continue // folder has no data.json yet — awaiting structuring, not an error
    }

    const parsed = JSON.parse(raw) as Omit<Development, 'slug'>
    developments.push({ slug: entry.name, ...parsed })
  }

  developments.sort((a, b) => (a.name ?? a.slug).localeCompare(b.name ?? b.slug))
  return developments
}

export const developments: Development[] = loadDevelopments()

export function getDevelopmentBySlug(slug: string): Development | undefined {
  return developments.find(d => d.slug === slug)
}

export function getAllDevelopmentSlugs(): string[] {
  return developments.map(d => d.slug)
}
