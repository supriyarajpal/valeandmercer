// Resolved public asset paths for each sales development, keyed by slug.
//
// The manifest (developmentAssets.generated.json) is produced by the asset
// pipeline that copies content/properties/<slug>/images → public and renders
// floor-plan previews (see scripts / the build report). It is plain JSON, so
// this module is safe to import from BOTH Server and Client Components — unlike
// lib/developments.ts, which reads the filesystem and is server-only.
//
// To refresh it after adding/removing development images or brochures, re-run
// the asset copy + manifest steps; nothing here reads the filesystem at runtime.

import manifest from './developmentAssets.generated.json'

export type DevelopmentAssets = {
  /** Numbered gallery photos in order (1.jpg, 2.jpg, …). May be empty. */
  images: string[]
  /** Rendered floor-plan preview, or null when no floor-plan source existed. */
  floorplan: string | null
  /** Downloadable brochure PDF, or null when none was supplied. */
  brochure: string | null
}

const MAP = manifest as Record<string, DevelopmentAssets>
const EMPTY: DevelopmentAssets = { images: [], floorplan: null, brochure: null }

// Shared SVG shown on cards for a development that has no photographs yet —
// the same placeholder the lettings side uses, so the two grids read alike.
export const DEVELOPMENT_PLACEHOLDER = '/images/property-placeholder.svg'

export function getDevelopmentAssets(slug: string): DevelopmentAssets {
  return MAP[slug] ?? EMPTY
}

// Card hero: the first real photo, else the shared placeholder. A floor plan is
// deliberately NOT used as a card photo (it belongs in the Floorplan tab), so a
// photo-less development reads as "images to come" rather than showing a plan.
export function developmentHeroImage(slug: string): string {
  return getDevelopmentAssets(slug).images[0] ?? DEVELOPMENT_PLACEHOLDER
}

export function developmentHasPhotos(slug: string): boolean {
  return getDevelopmentAssets(slug).images.length > 0
}
