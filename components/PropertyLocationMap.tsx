'use client'

// Client wrapper around `PropertyMap` for the property detail sidebar.
// Exists for two reasons:
//   1. `next/dynamic({ ssr: false })` can only be called from a client
//      component (`app/property/[slug]/page.tsx` is an async server
//      component). This file provides that client entry point.
//   2. Leaflet's stylesheet must be linked into the parent page's
//      initial CSS bundle. Importing it here — from a real client
//      component that the server page renders — keeps the CSS pinned to
//      the property route's bundle the same way `app/rent/page.tsx`
//      does for the grid map.

import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import type { Property } from '@/lib/properties'

const MAP_HEIGHT = '400px'

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: MAP_HEIGHT,
        borderRadius: 12,
        background: '#F2EFE9',
        border: '0.5px solid #DDD7CC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9A9188',
        fontSize: 11,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}
    >
      Loading map
    </div>
  ),
})

export default function PropertyLocationMap({ property }: { property: Property }) {
  // Guard: without coordinates there's nothing to plot. The parent
  // (`PropertySidebar`) already skips rendering this in that case, but
  // keep the check here so the component is safe to drop in anywhere.
  if (!property.coordinates) return null

  return (
    <div>
      <PropertyMap
        properties={[property]}
        height={MAP_HEIGHT}
        initialZoom={15}
      />
      <p
        style={{
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#9A9188',
          marginTop: 12,
        }}
      >
        Marker location is indicative to the street, not the door.
      </p>
    </div>
  )
}
