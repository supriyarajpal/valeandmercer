'use client'
// Vanilla Leaflet in a React wrapper. We deliberately skip react-leaflet
// because (a) its React 19 peer-dep story was still shaky at the time of
// writing and (b) our needs here are simple enough that useEffect + a
// couple of refs is genuinely less code than the react-leaflet component
// tree. If the map ever grows layer clusters / vector tiles / drawing
// controls, revisit react-leaflet.

import { useCallback, useEffect, useRef, useState } from 'react'
// NOTE: Leaflet's stylesheet must ALSO be imported at the page level
// (see app/rent/page.tsx). Importing it here alone is not enough when
// this component is loaded via `next/dynamic({ ssr: false })` — Next
// bundles the CSS but does not always link it into the parent page's
// initial CSS bundle, and the map renders blank tiles as a result.
// This import stays as a safety net for anyone using PropertyMap in a
// non-dynamic context.
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/lib/properties'

type Props = {
  properties: Property[]
  // Fired when a marker's popup "View Property" link fires OR when the
  // marker itself is clicked. Parent uses this to scroll the matching
  // card into view.
  onMarkerFocus?: (slug: string) => void
}

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

// SVG icon for the fullscreen toggle. `variant` picks enter (arrows out
// from corners) or exit (arrows in). Rendered inline so the button
// styling matches without any icon-font dependency.
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

export default function PropertyMap({ properties, onMarkerFocus }: Props) {
  const containerRef  = useRef<HTMLDivElement | null>(null)
  const wrapperRef    = useRef<HTMLDivElement | null>(null)
  const mapRef        = useRef<import('leaflet').Map | null>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  // Tracks whether scroll-wheel zoom is currently armed. Starts off so the
  // page can be scrolled past the map freely; click on the map arms it,
  // moving the cursor off the map disarms it. Used to render the small
  // "Click to zoom" hint badge.
  const [zoomArmed, setZoomArmed] = useState(false)

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const container = containerRef.current

    let cancelled = false

    // Primary defence against tile-blanking: any container size change
    // triggers invalidateSize on the live map instance. Covers the four
    // states the map has to survive:
    //   (1) initial paint — the async `import('leaflet')` can resolve
    //       before the flex/grid parent has settled its dimensions
    //   (2) fullscreen enter (fixed inset:0)
    //   (3) fullscreen exit (back to clamp height)
    //   (4) window / device rotation resize
    // Observer stays alive for the map's lifetime.
    const ro = new ResizeObserver(() => {
      mapRef.current?.invalidateSize()
    })
    ro.observe(container)

    import('leaflet').then(mod => {
      if (cancelled) return
      const L = mod.default || mod

      if (mapRef.current) return

      const map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: false,   // armed on click, disarmed on mouseout
        attributionControl: true,
        // ---- Smooth-zoom tuning for trackpads --------------------
        // Leaflet's defaults treat every wheel event as a full zoom
        // step, which is fine for a scroll wheel that emits one big
        // event per notch but terrible for trackpads, which emit many
        // small events per gesture and jump three or four zoom levels
        // per swipe. Four coordinated knobs fix this:
        //
        //   zoomSnap: 0.25          allow the zoom level to settle at
        //                           fractional values instead of only
        //                           whole integers, so the map lands
        //                           smoothly wherever the gesture ends
        //   zoomDelta: 0.5          each +/- button press or key press
        //                           moves half a level, matching the
        //                           finer snap grid
        //   wheelPxPerZoomLevel:120 require 120px of accumulated wheel
        //                           delta per level (default is 60);
        //                           this is the main knob — doubling
        //                           it makes trackpad gestures gentle
        //   wheelDebounceTime: 60   coalesce rapid trackpad events
        //                           into a smoother running total
        //                           (default is 40)
        //
        // Mouse-wheel notches on a physical wheel still emit ~120px
        // per notch on most systems, so one notch ≈ one zoom level —
        // that's what a mouse user expects. Trackpads accumulate the
        // same 120px over many small events, so a gentle swipe zooms
        // ~one level, not four.
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        wheelDebounceTime: 60,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map)

      // Belt-and-braces size sync. See the ResizeObserver at the top of
      // this useEffect for the primary defence; these two fire once at
      // init to catch the "async import resolved while container was
      // still 0-sized" case that leaves the tile layer with an empty
      // grid to fetch on first paint.
      window.requestAnimationFrame(() => {
        mapRef.current?.invalidateSize()
      })
      window.setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 300)

      // ---- scroll-wheel zoom UX -----------------------------------
      // Click inside the map arms scroll-wheel zoom, so subsequent
      // scroll/trackpad gestures zoom the map instead of the page.
      // When the cursor leaves the map area we disarm it, restoring
      // page scroll. This is the pattern that Google Maps embeds use.
      // Touch pinch-zoom (`touchZoom`) is on by default in Leaflet and
      // is unaffected by scrollWheelZoom, so mobile users always have
      // pinch available without arming anything.
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

      const validPoints: Array<[number, number]> = []
      for (const p of properties) {
        if (!p.coordinates) continue
        const marker = L.marker([p.coordinates.lat, p.coordinates.lng], { icon })
          .bindPopup(buildPopupHtml(p), { closeButton: true, autoClose: true, className: 'vm-popup' })
          .addTo(map)
        marker.on('popupopen', () => { onMarkerFocus?.(p.slug) })
        validPoints.push([p.coordinates.lat, p.coordinates.lng])
      }

      if (validPoints.length > 0) {
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
        if (slug) onMarkerFocus?.(slug)
      })
    })

    return () => {
      cancelled = true
      ro.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [properties, onMarkerFocus])

  // ----- Fullscreen effects ---------------------------------------
  //
  // 1. Body scroll lock while fullscreen. Restored on exit and on
  //    unmount.
  // 2. Fullscreen entry auto-arms scroll-wheel zoom (the user is
  //    clearly in "interact" mode). Exit disarms it again so returning
  //    to the page scroll works normally.
  // 3. Two invalidateSize calls after each toggle: one on the next
  //    animation frame (covers the "container just resized" case) and
  //    one on a 250ms timeout (covers the case where a CSS transition
  //    is still settling). Tiles re-request against the new pixel
  //    dimensions after each call.
  // ----------------------------------------------------------------
  useEffect(() => {
    // Simple assignment / empty-string restore. The previous version
    // captured `prevOverflow` on every effect run, which meant once
    // we set 'hidden' for fullscreen, subsequent runs captured 'hidden'
    // as the "previous" state and body-scroll stayed locked forever.
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
      // The ResizeObserver in the init effect will fire on the size
      // change too, but these explicit calls also cover the case
      // where the container size is animated over a CSS transition
      // that briefly settles at intermediate values.
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

  // Esc key exits fullscreen. Listener only mounts while fullscreen so
  // there's no idle overhead.
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
        zIndex: 500,   // above Navbar (100), below Cookiebot overlays
        background: '#F2EFE9',
        borderRadius: 0,
        border: 'none',
        overflow: 'hidden',
      }
    : {
        position: 'relative',
        width: '100%',
        height: 'clamp(360px, 55vh, 560px)',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#F2EFE9',
        border: '0.5px solid #DDD7CC',
        zIndex: 1,
      }

  return (
    <>
      <div ref={wrapperRef} style={wrapperStyle}>
        {/* Explicit 100%/100% (not `position: absolute; inset: 0`).
            The absolute+inset variant sometimes returned a zero
            clientWidth at the moment the async `import('leaflet')`
            resolved, leaving Leaflet with an empty tile grid to fetch
            on first paint (see Phase 34). Width/height 100% resolves
            directly against the wrapper's known clamp dimensions and
            is stable at layout time. */}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {/* Fullscreen toggle. Top-right corner. Small, gold-on-ink,
            matches the ArrowButton `gold` variant visually. Kept as a
            sibling of the map container so its clicks don't reach the
            Leaflet map's event listeners. */}
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

        {/* "Click to zoom" hint. Only shown when scroll-wheel zoom is
            not armed AND we're not in fullscreen (in fullscreen the
            zoom is already armed). Positioned bottom-left so it does
            not compete with the fullscreen button or the CARTO
            attribution. Fades on state change via CSS transition. */}
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
            opacity: !zoomArmed && !isFullscreen ? 1 : 0,
            transition: 'opacity 0.4s var(--ease-out-soft)',
          }}
        >
          <span aria-hidden style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', display: 'inline-block' }} />
          Click map to zoom
        </div>

        {/* Fullscreen "press Esc" hint. Only shown while fullscreen. */}
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

      {/* Global Leaflet skin overrides. Plain <style> (not styled-jsx)
          to stay consistent with the rest of the codebase's inline-
          style pattern. */}
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
      `}</style>
    </>
  )
}
