// Titles and publish-visibility for the New Homes pages.
//
// A development's public title is resolved in three tiers:
//   1. an editorial `displayName` (data.json override), used verbatim — e.g.
//      "LS11 Leeds City Park";
//   2. otherwise its street address + city + unit type — e.g.
//      "8-10 Burton Street, Manchester · 1 bed apartments";
//   3. otherwise its own `name` (e.g. "St. George's Terrace") for a development
//      that has neither an override nor a street address.
// Only a development with NONE of the three (no displayName, no address, no
// name — in practice a nameless stub) is excluded from the site.
//
// Pure functions of the Development record, so this module is safe to import
// from both Server and Client Components.
//
// Titles are computed from the FULL development record (including unitMix) even
// where the unit-mix table is display-suppressed elsewhere (e.g. Fountain
// Court), because only the per-type COUNT is disputed there, not which bedroom
// types exist.

import type { Development } from './developments'

export function developmentHasAddress(dev: Development): boolean {
  return !!(dev.address && dev.address.trim())
}

function displayNameOf(dev: Development): string | null {
  return dev.displayName && dev.displayName.trim() ? dev.displayName.trim() : null
}

// A development is published (gets a card and a detail page) when it has any
// resolvable title: an editorial displayName, a street address, or at least its
// own name. This replaces the old address-only gate so developments named by
// hand — or carrying only their brochure name — still appear on the site.
export function developmentIsPublished(dev: Development): boolean {
  return !!(displayNameOf(dev) || developmentHasAddress(dev) || (dev.name && dev.name.trim()))
}

// Bedroom count from a unit-mix row's type label, or null if it isn't a
// bedroom-typed unit. Handles "Studio", "1 bed", "2 Bedroom", "1-Bed",
// "1B-2P", "3-bed cluster", etc.
function bedsFromType(type?: string): number | null {
  if (!type) return null
  const t = type.toLowerCase()
  if (t.includes('studio')) return 0
  const m = t.match(/(\d+)\s*(?:-|\s)?\s*(?:bed|bedroom)/) || t.match(/^(\d+)\s*b\b/) || t.match(/^(\d+)b[-\s]/)
  return m ? parseInt(m[1], 10) : null
}

// The "unit type" phrase, e.g. "1 bed apartments", "studio–3 bed apartments",
// or "apartments, duplexes & penthouses" — or NULL when the unitMix carries no
// usable type/bedroom data (e.g. only raw sizes). Callers that need to OMIT the
// field when empty (the listing card) use this directly; callers that need a
// guaranteed string (the combined page title) use developmentUnitSummary below.
export function developmentUnitTypes(dev: Development): string | null {
  const rows = Array.isArray(dev.unitMix) ? dev.unitMix : []
  const beds = rows.map(r => bedsFromType(r.type)).filter((n): n is number => n != null)
  if (beds.length > 0) {
    const min = Math.min(...beds)
    const max = Math.max(...beds)
    if (min === max) return `${min === 0 ? 'studio' : `${min} bed`} apartments`
    if (min === 0) return `studio–${max} bed apartments`
    return `${min}–${max} bed apartments`
  }
  // Non-bedroom unit types (e.g. Apartments / Duplexes / Penthouses).
  const types = [...new Set(rows.map(r => r.type).filter((t): t is string => !!t).map(t => t.toLowerCase()))]
  if (types.length === 1) return types[0]
  if (types.length > 1) return `${types.slice(0, -1).join(', ')} & ${types[types.length - 1]}`
  return null
}

// Same as developmentUnitTypes but with a generic fallback, for the combined
// page title (which must always render a phrase).
export function developmentUnitSummary(dev: Development): string {
  return developmentUnitTypes(dev) ?? 'apartments'
}

// Address + city (city appended only when the address doesn't already include
// it, so we never print "…, Derby, Derby").
export function developmentAddressLine(dev: Development): string | null {
  if (!developmentHasAddress(dev)) return null
  let line = dev.address!.trim()
  const city = dev.locality?.split(',').map(s => s.trim()).filter(Boolean).pop()
  if (city && !line.toLowerCase().includes(city.toLowerCase())) line += `, ${city}`
  return line
}

// The card / heading title (no unit-type suffix): the editorial displayName,
// else street + city, else the development's own name. Always a string for any
// published development.
export function developmentHeading(dev: Development): string {
  return displayNameOf(dev) ?? developmentAddressLine(dev) ?? dev.name ?? dev.slug
}

// Full public title used for the detail-page H1, metadata and breadcrumb.
// A displayName is used verbatim (it already reads as a complete title);
// otherwise "street, city · unit type", or the plain name when there is no
// address. Always a string for any published development.
export function developmentTitle(dev: Development): string {
  const custom = displayNameOf(dev)
  if (custom) return custom
  const addr = developmentAddressLine(dev)
  if (addr) return `${addr} · ${developmentUnitSummary(dev)}`
  return dev.name ?? dev.slug
}
