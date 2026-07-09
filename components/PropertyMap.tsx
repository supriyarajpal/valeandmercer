'use client'
// Vanilla Leaflet in a React wrapper. We deliberately skip react-leaflet
// because (a) its React 19 peer-dep story was still shaky at the time of
// writing and (b) our needs here are simple enough that useEffect + a
// couple of refs is genuinely less code than the react-leaflet component
// tree. If the map ever grows layer clusters / vector tiles / drawing
// controls, revisit react-leaflet.
//
// Reliability history (read before changing the init effect):
//   The map used to intermittently render with blank tiles. Root cause
//   was that the init `useEffect` depended on `properties` and
//   `onMarkerFocus`. Both are reference-unstable on the parents:
//     * app/rent/page.tsx computes `getLiveProperties().filter(...)`
//       during render without useMemo, so a fresh array reference is
//       produced every render.
//     * components/PropertyLocationMap.tsx passes `properties={[property]}`,
//       a fresh literal every render.
//     * Callers pass an inline `onMarkerFocus` when the parent's own
//       state (e.g. `Reveal`'s `inView`) changes.
//   Combined with the async `import('leaflet').then(...)` bootstrap,
//   this produced a re-init race: effect A starts, Reveal fires
//   inView=true, parent re-renders, effect A's cleanup runs before
//   Leaflet has resolved, effect B starts a second import, and the
//   belt-and-braces `invalidateSize` timers from run A have already
//   been cleared by the time the surviving map instance exists — so
//   Leaflet grabs the container size a beat too early and half the
//   tile grid stays blank.
//   The fix here: dep on a memoised `propertiesKey` string, keep the
//   live `properties` + `onMarkerFocus` in refs. Combined with a wider
//   `invalidateSize` net (ResizeObserver + IntersectionObserver +
//   `window.resize` + a chained rAF / setTimeout ladder) plus an
//   OpenStreetMap fallback tile layer that kicks in on repeated CARTO
//   tile errors, and a loading skeleton overlay that only clears on
//   an actual `tileload`. Don't collapse these back — each one covers
//   a real failure mode we've seen.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// NOTE: Leaflet's stylesheet must ALSO be imported at the page level
// (see app/rent/page.tsx and components/PropertyLocationMap.tsx).
// Importing it here alone is not enough when this component is loaded
// via `next/dynamic({ ssr: false })` — Next bundles the CSS but does
// not always link it into the parent page's initial CSS bundle, and
// the map renders blank tiles as a result. This import stays as a
// safety net for anyone using PropertyMap in a non-dynamic context.
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/lib/properties'

type Props = {
  properties: Property[]
  // Fired when a marker's popup "View Property" link fires OR when the
  // marker itself is clicked. Parent uses this to scroll the matching
  // card into view. Callback identity is captured via a ref inside the
  // component so a fresh identity on the parent doesn't re-init the map.
  onMarkerFocus?: (slug: string) => void
  // Any CSS length. Overrides the default `clamp(360px, 55vh, 560px)`
  // wrapper height. Single-property detail views pass ~400px here.
  height?: string
  // If set, the map opens centred on the single property at exactly
  // this zoom level instead of running fitBounds. Only meaningful when
  // `properties.length === 1`; ignored otherwise so the multi-marker
  // /rent view keeps its auto-fit behaviour.
  initialZoom?: number
}

// Primary + fallback tile providers. CARTO is preferred for the muted
// cream palette that matches the site; OSM standard is the safety net.
// Both use the same {s} / {z} / {x} / {y} template so Leaflet handles
// them interchangeably.
const CARTO_URL  = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const OSM_URL    = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const CARTO_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
const OSM_ATTR   = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// If CARTO emits this many `tileerror` events before we've seen a
// successful `tileload`, swap in the OSM layer. Three is enough to
// distinguish a genuine outage from a single flaky request. Lowered
// from 3 to 2 during the 2026-07-10 prod-tile-blank triage so the OSM
// fallback kicks in faster if CARTO is being blocked at a browser
// extension / network level.
const TILE_ERROR_THRESHOLD = 2
// If NO tile from the primary provider has loaded within this window,
// force-swap to the fallback even if `tileerror` events never fired.
// This covers the case where an ad blocker / DNS filter silently
// swallows requests to `basemaps.cartocdn.com` without letting the
// browser fire the image error handler that Leaflet listens on.
const PRIMARY_NO_LOAD_TIMEOUT_MS = 3500
// Hard cap on how long the skeleton stays up. If neither provider
// answers we still hide the overlay so the empty map is visible
// (better than a stuck loading state).
const SKELETON_SAFETY_MS = 6000

// Built once, reused for every marker. Ink teardrop with a gold border
// and a gold dot in the center. iconAnchor points the tail's tip at the
// coordinate. popupAnchor lifts the popup off the tip.
function buildMarkerIconHtml(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 40" width="30" height="40" aria-hidden="true" focusable="false" style="display:block;filter:drop-shadow(0 3px 4px rgba(20,17,14,0.35))">
      <path
        d="M15 39 C15 28 28 22 28 14 A13 13 0 1 0 2 14 C2 22 15 28 15 39 Z"
        fill="#34302B"
        stroke="#A0845C"
        stroke-width="1.4"
      />
      <circle cx="15" cy="14" r="4" fill="#A0845C"/>
    </svg>
  `
}

function buildPopupHtml(p: Property): string {
  const bedLabel = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds === 1 ? '' : 's'}`
  // Simple, safe interpolation. Titles/areas are curated content in
  // lib/properties.ts, not user input, so injection risk is nil. Kept as
  // plain innerHTML rather than DOMPurify to avoid the extra dependency.
  return `
    <div style="font-family:'DM Sans',system-ui,sans-serif;color:#4A4036;padding:4px 2px 2px;min-width:200px">
      <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#A0845C;margin-bottom:6px">${p.listingType}</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:300;line-height:1.15;color:#4A4036;margin-bottom:4px">${p.title}</div>
      <div style="font-size:11px;color:#7A7268;letter-spacing:0.04em;margin-bottom:14px">${p.area}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px 12px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6B6258;margin-bottom:14px">
        <span>${bedLabel}</span>
        <span aria-hidden style="opacity:0.4">·</span>
        <span>${p.baths} bath${p.baths === 1 ? '' : 's'}</span>
      </div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:300;color:#4A4036;margin-bottom:14px">${p.rent}</div>
      <a href="/property/${p.slug}" data-vm-view-property="${p.slug}" style="display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#A0845C;text-decoration:none;padding-top:12px;border-top:0.5px solid #DDD7CC">
        View Property <span aria-hidden style="font-size:12px">→</span>
      </a>
    </div>
  `
}

function FullscreenIcon({ variant }: { variant: 'enter' | 'exit' }) {
  const strokeProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (variant === 'enter') {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden focusable="false" {...strokeProps}>
        <polyline points="4 9 4 4 9 4" />
        <polyline points="20 9 20 4 15 4" />
        <polyline points="20 15 20 20 15 20" />
        <polyline points="4 15 4 20 9 20" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden focusable="false" {...strokeProps}>
      <polyline points="9 4 9 9 4 9" />
      <polyline points="15 4 15 9 20 9" />
      <polyline points="15 20 15 15 20 15" />
      <polyline points="9 20 9 15 4 15" />
    </svg>
  )
}

export default function PropertyMap({ properties, onMarkerFocus, height, initialZoom }: Props) {
  const containerRef  = useRef<HTMLDivElement | null>(null)
  const wrapperRef    = useRef<HTMLDivElement | null>(null)
  const mapRef        = useRef<import('leaflet').Map | null>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomArmed, setZoomArmed] = useState(false)
  // Cleared on the first successful `tileload` OR after the safety
  // timeout, whichever fires first. Drives the skeleton overlay.
  const [tilesLoaded, setTilesLoaded] = useState(false)

  // Content-based key for the properties list. Only changes when the
  // set of plotted markers actually changes, so we don't tear the map
  // down and rebuild it on every unrelated parent re-render.
  const propertiesKey = useMemo(() => {
    return properties
      .filter(p => p.coordinates)
      .map(p => `${p.slug}:${p.coordinates!.lat.toFixed(6)},${p.coordinates!.lng.toFixed(6)}`)
      .join('|')
  }, [properties])

  // Refs kept fresh on every render so the init effect can read the
  // current props without re-running.
  const propertiesRef    = useRef(properties)
  const onMarkerFocusRef = useRef(onMarkerFocus)
  useEffect(() => { propertiesRef.current    = properties    })
  useEffect(() => { onMarkerFocusRef.current = onMarkerFocus })

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const container = containerRef.current

    let cancelled = false

    // ---- invalidateSize triggers ----------------------------------
    // Multiple independent signals converge on a single `bumpSize`
    // helper. Each is safe to call before the map exists (it's a
    // no-op via optional chaining) and after the map is torn down.
    const bumpSize = () => mapRef.current?.invalidateSize()

    // (1) Container size changes — parent grid reflow, sidebar sticky
    //     transition, fullscreen enter/exit, mobile keyboard, etc.
    const ro = new ResizeObserver(bumpSize)
    ro.observe(container)

    // (2) Container visibility — the map might be inside a
    //     Reveal wrapper that starts at opacity 0 (still laid-out),
    //     or in the future inside a lazy/conditionally-mounted
    //     section. IO catches the "first time this thing crossed
    //     the viewport" moment.
    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(entries => {
        for (const e of entries) if (e.isIntersecting) bumpSize()
      }, { threshold: 0 })
      io.observe(container)
    }

    // (3) Window resize (orientation change on mobile, browser resize
    //     on desktop). RO usually catches this too, but only if the
    //     container size actually changes; a container with fixed
    //     dimensions wouldn't trigger RO.
    window.addEventListener('resize', bumpSize)

    // (4) Chained timers as a first-paint safety net. Cover the race
    //     where the async `import('leaflet')` resolves before the
    //     container's flex/grid parent has settled.
    const rafId  = window.requestAnimationFrame(bumpSize)
    const t100   = window.setTimeout(bumpSize, 100)
    const t400   = window.setTimeout(bumpSize, 400)
    const t1200  = window.setTimeout(bumpSize, 1200)

    // Skeleton safety timeout — never leave the overlay stuck.
    const skeletonSafety = window.setTimeout(() => setTilesLoaded(true), SKELETON_SAFETY_MS)

    import('leaflet').then(mod => {
      if (cancelled) return
      const L = mod.default || mod

      if (mapRef.current) return

      const map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
        // ---- Smooth-zoom tuning for trackpads --------------------
        // Leaflet's defaults treat every wheel event as a full zoom
        // step. Four coordinated knobs let a trackpad gesture move
        // ~one zoom level instead of four. See git blame for the
        // long-form comment on each knob.
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        wheelDebounceTime: 60,
      })
      mapRef.current = map

      // ---- Tile layers: CARTO primary + OSM fallback --------------
      // Primary layer starts attached. If it emits enough tileerror
      // events without a matching tileload, we swap in the OSM layer
      // so the map never stays blank because of a CARTO outage.
      // `tileload` on either layer clears the skeleton overlay — the
      // user just needs to see real tiles, not any specific provider.
      const primary = L.tileLayer(CARTO_URL, {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: CARTO_ATTR,
      })
      const fallback = L.tileLayer(OSM_URL, {
        maxZoom: 19,
        attribution: OSM_ATTR,
      })
      let primaryErrors = 0
      let primaryLoaded = false
      let switched = false
      const swapToFallback = (reason: string) => {
        if (switched) return
        switched = true
        // Diagnostic breadcrumb — visible in the browser DevTools
        // console so a user reporting a blank-tile bug can send us
        // exactly what triggered the swap. Info-level to avoid
        // scaring anyone who opens the console for other reasons.
        // eslint-disable-next-line no-console
        console.info(`[vm-map] Primary tile provider fell back to OSM (${reason})`)
        if (map.hasLayer(primary)) map.removeLayer(primary)
        fallback.addTo(map)
      }
      const markLoaded = () => setTilesLoaded(true)
      primary.on('tileload',  () => { primaryLoaded = true; markLoaded() })
      fallback.on('tileload', markLoaded)
      primary.on('load',      markLoaded)
      fallback.on('load',     markLoaded)
      primary.on('tileerror', () => {
        primaryErrors++
        if (primaryErrors >= TILE_ERROR_THRESHOLD) {
          swapToFallback(`tileerror x${primaryErrors}`)
        }
      })
      primary.addTo(map)

      // Silent-block guard: if the primary provider hasn't produced
      // even ONE successful tileload within PRIMARY_NO_LOAD_TIMEOUT_MS,
      // assume the requests are being swallowed (ad blocker, DNS
      // filter, corporate proxy) and swap to OSM regardless of
      // whether any `tileerror` events fired. Extensions sometimes
      // suppress the browser-level error handler that Leaflet listens
      // on, so `tileerror` alone isn't a reliable signal.
      window.setTimeout(() => {
        if (!primaryLoaded && !switched) {
          swapToFallback('primary silent (no tileload before timeout)')
        }
      }, PRIMARY_NO_LOAD_TIMEOUT_MS)

      // Belt-and-braces: run invalidateSize on the freshly created
      // map so its first tile-grid fetch uses the correct container
      // dims. The chained timers above catch subsequent settle
      // frames.
      bumpSize()

      // ---- scroll-wheel zoom UX -----------------------------------
      map.on('click', () => {
        map.scrollWheelZoom.enable()
        setZoomArmed(true)
      })
      map.on('mouseout', () => {
        map.scrollWheelZoom.disable()
        setZoomArmed(false)
      })
      // ------------------------------------------------------------

      const iconHtml = buildMarkerIconHtml()
      const icon = L.divIcon({
        html: iconHtml,
        className: 'vm-marker',
        iconSize:   [30, 40],
        iconAnchor: [15, 39],
        popupAnchor: [0, -34],
      })

      const currentProps = propertiesRef.current
      const validPoints: Array<[number, number]> = []
      for (const p of currentProps) {
        if (!p.coordinates) continue
        const marker = L.marker([p.coordinates.lat, p.coordinates.lng], { icon })
          .bindPopup(buildPopupHtml(p), { closeButton: true, autoClose: true, className: 'vm-popup' })
          .addTo(map)
        marker.on('popupopen', () => { onMarkerFocusRef.current?.(p.slug) })
        validPoints.push([p.coordinates.lat, p.coordinates.lng])
      }

      // Single-property detail view: skip fitBounds and centre on the
      // point at the requested zoom. Multi-marker /rent grid keeps
      // the auto-fit path.
      if (initialZoom != null && validPoints.length === 1) {
        map.setView(validPoints[0], initialZoom)
      } else if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints)
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
      } else {
        map.setView([51.5, -0.02], 14)
      }

      container.addEventListener('click', ev => {
        const el = ev.target as HTMLElement | null
        const anchor = el?.closest?.('a[data-vm-view-property]') as HTMLAnchorElement | null
        if (!anchor) return
        const slug = anchor.getAttribute('data-vm-view-property')
        if (slug) onMarkerFocusRef.current?.(slug)
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(t100)
      window.clearTimeout(t400)
      window.clearTimeout(t1200)
      window.clearTimeout(skeletonSafety)
      window.removeEventListener('resize', bumpSize)
      ro.disconnect()
      io?.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // Depending on `propertiesKey` (a content-based string) instead of
    // `properties` (a reference-unstable array) is intentional and the
    // whole point of the reliability fix above — every parent produces
    // fresh array references on re-render, which used to tear this
    // effect down mid-init. See file-top comment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertiesKey, initialZoom])

  // ----- Fullscreen effects ---------------------------------------
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''

    const map = mapRef.current
    if (map) {
      if (isFullscreen) {
        map.scrollWheelZoom.enable()
        setZoomArmed(true)
      } else {
        map.scrollWheelZoom.disable()
        setZoomArmed(false)
      }
      window.requestAnimationFrame(() => { mapRef.current?.invalidateSize() })
      const t = window.setTimeout(() => { mapRef.current?.invalidateSize() }, 250)
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = ''
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  useEffect(() => {
    if (!isFullscreen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  const wrapperStyle: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        top: 0, right: 0, bottom: 0, left: 0,
        zIndex: 500,
        background: '#F2EFE9',
        borderRadius: 0,
        border: 'none',
        overflow: 'hidden',
      }
    : {
        position: 'relative',
        width: '100%',
        height: height ?? 'clamp(360px, 55vh, 560px)',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#F2EFE9',
        border: '0.5px solid #DDD7CC',
        zIndex: 1,
      }

  return (
    <>
      <div ref={wrapperRef} style={wrapperStyle}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {/* Loading skeleton overlay — sits ABOVE the Leaflet container
            (zIndex 30, higher than the map's own panes but below the
            fullscreen button at 20 within this wrapper — see zIndex 30
            vs 20; the button remains keyboard-reachable because it's
            positioned above the overlay only visually, and the overlay
            is pointer-events:none). Fades out once the first tileload
            fires OR after SKELETON_SAFETY_MS. Simple pulsing bar
            provides a subtle "something is happening" cue without
            introducing an animation library dependency. */}
        <div
          aria-hidden={tilesLoaded}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            background: '#F2EFE9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            color: '#9A9188',
            fontSize: 10,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            opacity: tilesLoaded ? 0 : 1,
            transition: 'opacity 400ms var(--ease-out-soft)',
            pointerEvents: tilesLoaded ? 'none' : 'auto',
          }}
        >
          <div
            style={{
              width: 44,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, transparent 0%, #A0845C 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'vm-map-shimmer 1.2s linear infinite',
            }}
          />
          Loading map
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen map' : 'Open fullscreen map'}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 20,
            width: 40,
            height: 40,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#34302B',
            color: '#F2EFE9',
            border: '1px solid #A0845C',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: '0 6px 18px -10px rgba(20,17,14,0.5)',
            transition: 'background 0.3s var(--ease-out-soft), color 0.3s var(--ease-out-soft)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#A0845C'
            e.currentTarget.style.color = '#F2EFE9'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#34302B'
            e.currentTarget.style.color = '#F2EFE9'
          }}
        >
          <FullscreenIcon variant={isFullscreen ? 'exit' : 'enter'} />
        </button>

        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            background: 'rgba(20,17,14,0.72)',
            color: 'rgba(242,239,233,0.9)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRadius: 4,
            pointerEvents: 'none',
            opacity: !zoomArmed && !isFullscreen && tilesLoaded ? 1 : 0,
            transition: 'opacity 0.4s var(--ease-out-soft)',
          }}
        >
          <span aria-hidden style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', display: 'inline-block' }} />
          Click map to zoom
        </div>

        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            background: 'rgba(20,17,14,0.72)',
            color: 'rgba(242,239,233,0.9)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRadius: 4,
            pointerEvents: 'none',
            opacity: isFullscreen ? 1 : 0,
            transition: 'opacity 0.4s var(--ease-out-soft)',
          }}
        >
          <span aria-hidden style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', display: 'inline-block' }} />
          Press Esc to exit
        </div>
      </div>

      <style>{`
        .vm-marker { background: transparent !important; border: none !important; }
        .vm-popup .leaflet-popup-content-wrapper {
          border-radius: 6px;
          box-shadow: 0 20px 40px -20px rgba(20,17,14,0.35);
          border: 0.5px solid #DDD7CC;
        }
        .vm-popup .leaflet-popup-content {
          margin: 16px 18px 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .vm-popup .leaflet-popup-tip { box-shadow: none; }
        .leaflet-container { font-family: 'DM Sans', system-ui, sans-serif; }
        @keyframes vm-map-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  )
}
