import { getLiveProperties } from '@/lib/properties'

// Every number here is derived directly from lib/properties.ts at call
// time — nothing hardcoded, nothing invented. Consumed by StatsStrip
// (kinetic counters) and NavTicker (rotating status line) so the two
// features can never show inconsistent figures.

export type PropertyStats = {
  totalLive: number
  avgRentPCM: number | null
  totalRentRollPCM: number | null
  neighbourhoods: string[]
  postcodes: string[]
}

function parseRentPCM(rent: string): number | null {
  // Rent strings are formatted like "£4,078pcm" (see lib/properties.ts).
  const match = rent.match(/([\d,]+)/)
  if (!match) return null
  const value = Number(match[1].replace(/,/g, ''))
  return Number.isFinite(value) ? value : null
}

// "E14 · Cubitt Town" -> { postcode: 'E14', neighbourhood: 'Cubitt Town' }
function splitArea(area: string): { postcode: string; neighbourhood: string } {
  const [postcode, neighbourhood] = area.split('·').map(s => s.trim())
  return { postcode: postcode ?? area, neighbourhood: neighbourhood ?? '' }
}

export function getPropertyStats(): PropertyStats {
  const live = getLiveProperties()

  const rents = live.map(p => parseRentPCM(p.rent)).filter((n): n is number => n != null)
  const avgRentPCM = rents.length > 0
    ? Math.round(rents.reduce((sum, n) => sum + n, 0) / rents.length)
    : null
  // Sum, not average — only meaningful once every live listing has a
  // parseable rent, otherwise it would understate the real portfolio.
  const totalRentRollPCM = rents.length > 0 && rents.length === live.length
    ? rents.reduce((sum, n) => sum + n, 0)
    : null

  const neighbourhoods = Array.from(
    new Set(live.map(p => splitArea(p.area).neighbourhood).filter(Boolean)),
  )
  const postcodes = Array.from(
    new Set(live.map(p => splitArea(p.area).postcode).filter(Boolean)),
  )

  return {
    totalLive: live.length,
    avgRentPCM,
    totalRentRollPCM,
    neighbourhoods,
    postcodes,
  }
}
