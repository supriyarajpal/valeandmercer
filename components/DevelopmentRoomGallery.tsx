'use client'
import { Reveal } from '@/components/Reveal'

export type Room = {
  image: string
  roomLabel: string
  description: string
}

// Alternating editorial room gallery. Each row pairs ONE image with ONE text
// block, and the pair swaps sides every row (image-left/text-right, then
// image-right/text-left, …). Generic — pass any array of rooms; nothing about
// room types is hardcoded, so it works the moment gallery images are tagged by
// room (see Part B). Rows have generous vertical rhythm and reveal in on scroll
// with the site's existing slow soft easing; collapses to a single column on
// narrow screens.
export default function DevelopmentRoomGallery({ rooms, eyebrow = 'Room by room' }: { rooms: Room[]; eyebrow?: string }) {
  if (!rooms || rooms.length === 0) return null
  return (
    <section style={{ background: 'var(--surface)', padding: 'clamp(56px, 8vw, 112px) var(--gutter)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal y={18} amount={0.2}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 'clamp(32px, 5vw, 64px)' }}>{eyebrow}</p>
        </Reveal>

        <div style={{ display: 'grid', gap: 'clamp(56px, 8vw, 112px)' }}>
          {rooms.map((room, i) => (
            <Reveal key={i} y={28} amount={0.15}>
              <div className="vm-room-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center' }}>
                <div className="img-zoom" style={{ order: i % 2 === 1 ? 2 : 1, overflow: 'hidden', borderRadius: 'var(--radius-md)', aspectRatio: '4 / 3', border: '1px solid var(--border)', background: 'var(--surface-3)' }}>
                  <img src={room.image} alt={room.roomLabel} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
                  <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>{room.roomLabel}</p>
                  <p style={{ fontSize: 15.5, lineHeight: 1.95, color: 'var(--text)', opacity: 0.85, maxWidth: 460 }}>{room.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Single column on narrow screens (image always above its text). */}
      <style>{`@media (max-width: 760px){ .vm-room-row{ grid-template-columns: 1fr !important; } .vm-room-row > *{ order: 0 !important; } }`}</style>
    </section>
  )
}
