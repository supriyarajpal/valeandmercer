// Display-layer rules for the new-homes detail pages, shared by BOTH the server
// page (app/buy/[slug]/page.tsx) and the client detail component
// (components/DevelopmentDetail.tsx). Kept in a plain module — no 'use client',
// no filesystem access — so importing it from a Server Component gives the real
// value (importing a runtime value out of a 'use client' module instead yields a
// client-reference proxy, which is why this lives here).

// Developments whose unit-mix breakdown is suppressed at the display layer.
// FOUNTAIN COURT: its unit split is disputed between two sources — the brochure/
// investor deck (8 studios / 40 one-bed / 22 two-bed) vs. the floor-plan
// schedule (4 / 41 / 2 / 23 incl. a "one bed + study" type). Until the developer
// confirms which split is current we render ONLY the agreed headline count
// (totalUnits → "70 apartments") and hide the per-type breakdown. data.json is
// left intact; the server page also strips unitMix from the prop for these slugs
// so the disputed figures aren't shipped in the hydration payload either.
export const SUPPRESS_UNITMIX = new Set<string>(['fountain-court-birmingham'])

// Developments whose COMPLETION date is suppressed at the display layer because
// their source documents disagree on it. Same approach as SUPPRESS_UNITMIX:
// data.json keeps the primary (brochure) value intact, but the field is hidden
// on the page — and stripped from the server→client payload — rather than
// silently shipping a disputed date. Both figures are recorded here for the
// record:
//   • aire-gardens-leeds — Q2 2028 (brochure) vs Q1 2028 (investor deck + spec sheet)
//   • elizabeth-house-staines — March 2026 (brochure) vs September 2026 (factsheet)
// Remove a slug here once the developer confirms the true completion date.
export const SUPPRESS_COMPLETION = new Set<string>([
  'aire-gardens-leeds',
  'elizabeth-house-staines',
])
