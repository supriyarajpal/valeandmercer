'use client'
import { useState } from 'react'
import DevelopmentLightbox from '@/components/DevelopmentLightbox'
import CityEnquiry from '@/components/CityEnquiry'

// Close: the existing enquiry form (spam protections intact) plus a View gallery
// button that opens the shared lightbox. The gallery is CITY imagery only (hero
// and the Around frames), never property photos, and loads only when opened. The
// button is omitted when the city has no images yet.

const INK = '#28231C'
const GOLD = '#A0845C'
const CREAM = '#F2EFE9'

export default function CityClose({ city, galleryImages }: { city: string; galleryImages: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <section style={{ background: 'var(--surface)' }}>
      {galleryImages.length > 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--section-y) var(--gutter) 0' }}>
          <button
            type="button" onClick={() => setOpen(true)} className="btn-press"
            aria-label={`View gallery, ${galleryImages.length} photos`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'zoom-in', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: CREAM, background: INK, border: `1px solid ${GOLD}`, padding: '14px 26px', borderRadius: 'var(--radius-pill)' }}
          >
            <span>View gallery</span><span style={{ opacity: 0.6 }}>· {galleryImages.length}</span>
          </button>
        </div>
      )}

      <CityEnquiry city={city} />

      {open && galleryImages.length > 0 && (
        <DevelopmentLightbox images={galleryImages} name={`${city} gallery`} startIndex={0} onClose={() => setOpen(false)} />
      )}
    </section>
  )
}
