'use client'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { AREA_MAPS } from '@/components/areaMaps'

// The neighbourhoods we actually operate in — the same five that the /let
// listings group by (see lib/properties.ts area fields: "E14 · Millwall",
// "E14 · Cubitt Town", "E16 · Canning Town", Canary Wharf, Royal Docks).
// Each gets its own desaturated, premium panel colour that complements the
// cream/ink/gold palette, a photo (matched by filename), and a line-art map
// fragment generated from REAL OpenStreetMap street geometry (see areaMaps.ts
// and AreaGraphic).
type Area = { name: string; slug: string; color: string; image: string }

const AREAS: Area[] = [
  { name: 'Canary Wharf', slug: 'canary-wharf', color: '#33424E', image: '/images/areas/canary-wharf.jpg' },  // deep slate navy
  { name: 'Millwall',     slug: 'millwall',     color: '#586A54', image: '/images/areas/millwall.webp' },     // muted sage
  { name: 'Cubitt Town',  slug: 'cubitt-town',  color: '#8C5B44', image: '/images/areas/cubitt-town.jpg' },   // desaturated terracotta
  { name: 'Canning Town', slug: 'canning-town', color: '#3A3530', image: '/images/areas/canning-town.jpeg' }, // warm charcoal
  { name: 'Royal Docks',  slug: 'royal-docks',  color: '#6A6642', image: '/images/areas/royal-docks.jpeg' },  // muted olive
]

// One quiet line, in our own voice, reinforcing local knowledge.
const TAGLINE = 'Where we know every street.'

const CYCLE_MS = 2800

// A single COMPACT module (photo tile + colour panel side by side) that
// auto-cycles through all five areas in place — no longer five full-height
// scrolling rows. Both tiles crossfade to the next area together on a timer;
// auto-advance pauses on hover and after manual navigation, and is disabled
// entirely for prefers-reduced-motion (dots still work). All five layers are
// stacked and opacity-crossfaded, so the colour changes with the content.
export default function AreasWeCover() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (reduce || hovered) return
    // `active` is in the dep list so the interval restarts on every advance —
    // which also means a manual dot click resets the countdown (pause-then-
    // resume) rather than jumping again a fraction of a second later.
    const id = window.setInterval(() => setActive(a => (a + 1) % AREAS.length), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduce, hovered, active])

  return (
    // No top padding here: the preceding (transparent) featured section
    // already contributes its full var(--section-y) bottom padding, so adding
    // another full section-y on top stacked into an oversized gap above this
    // compact module. Bottom padding stays for the normal gap to the next
    // section.
    <section style={{ background: 'transparent', padding: '0 0 var(--section-y)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 var(--gutter)' }}>
        <Reveal y={24} amount={0.3}>
          <div style={{ marginBottom: 'clamp(26px, 3.5vw, 40px)' }}>
            <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Our neighbourhoods</p>
            <h2 style={{ color: 'var(--text)' }}>
              Areas we <span style={{ color: '#A0845C', fontStyle: 'italic' }}>cover</span>
            </h2>
          </div>
        </Reveal>

        <Reveal y={24} amount={0.2}>
          <style>{`
            .vm-areas-stage { display: flex; flex-direction: column; gap: 16px; }
            .vm-areas-tile { position: relative; flex: 1 1 50%; height: 230px; border-radius: var(--radius-lg); overflow: hidden; }
            .vm-areas-layer { position: absolute; inset: 0; transition: opacity 560ms var(--ease-out-soft); }
            @media (min-width: 760px) {
              .vm-areas-stage { flex-direction: row; gap: clamp(24px, 3vw, 44px); }
              .vm-areas-tile { height: clamp(240px, 26vw, 296px); }
            }
          `}</style>

          <div
            className="vm-areas-stage"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Photo tile — five crossfading layers. */}
            <div className="vm-areas-tile">
              {AREAS.map((area, i) => (
                <div key={area.slug} className="vm-areas-layer" aria-hidden={i !== active} style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}>
                  <AreaPhoto image={area.image} />
                </div>
              ))}
            </div>

            {/* Colour panel tile — five crossfading layers (colour + content). */}
            <div className="vm-areas-tile">
              {AREAS.map((area, i) => (
                <div key={area.slug} className="vm-areas-layer" aria-hidden={i !== active} style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}>
                  <AreaPanel area={area} />
                </div>
              ))}
            </div>
          </div>

          {/* Manual navigation — one dot per area, matching the site's dot
              indicators. Clicking jumps directly and resets the timer. */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
            {AREAS.map((area, i) => (
              <button
                key={area.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${area.name}`}
                aria-current={i === active}
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  padding: 0,
                  border: 'none',
                  borderRadius: 999,
                  cursor: 'pointer',
                  background: i === active ? '#A0845C' : 'var(--border-strong)',
                  transition: 'width 0.4s var(--ease-out-soft), background 0.4s var(--ease-out-soft)',
                }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Photo side — a real photo drops in at /images/areas/[slug].[ext]     */
/* (matched by filename). Until then a clean solid-ink placeholder      */
/* shows (no broken-image icon, no layout shift).                       */
/* ------------------------------------------------------------------ */

function AreaPhoto({ image }: { image: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#28231C', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div aria-hidden style={{ width: 56, height: 56, borderRadius: 4, border: '1px solid rgba(242,239,233,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(160,132,92,0.6)' }} />
      </div>
      {!failed && (
        <img
          src={image}
          alt=""
          aria-hidden
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Colour panel side — area name (small caps, gold tick), the real      */
/* street-map fragment centred, and the tagline in light italic serif.  */
/* ------------------------------------------------------------------ */

function AreaPanel({ area }: { area: Area }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: area.color, color: '#F2EFE9', display: 'flex', flexDirection: 'column', padding: 'clamp(20px, 2.6vw, 34px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span aria-hidden style={{ width: 22, height: 1, background: '#A0845C', flexShrink: 0 }} />
        <span style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.92)' }}>
          {area.name}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 0' }}>
        <AreaGraphic slug={area.slug} name={area.name} />
      </div>

      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(242,239,233,0.82)' }}>
        {TAGLINE}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Street-map fragment — REAL OpenStreetMap road geometry for the area, */
/* projected and simplified into SVG paths at author time (see          */
/* components/areaMaps.ts, generated from the Overpass API). Thin light  */
/* strokes so it reads as a minimal map, but every line position/angle   */
/* is the actual street layout, not artistic invention.                 */
/* ------------------------------------------------------------------ */

function AreaGraphic({ slug, name }: { slug: string; name: string }) {
  const map = AREA_MAPS[slug]
  if (!map) return null
  return (
    <svg
      viewBox={map.viewBox}
      width="100%"
      style={{ maxWidth: 190, height: 'auto', display: 'block' }}
      fill="none"
      stroke="rgba(242,239,233,0.72)"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`Street map of ${name}`}
    >
      {map.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
