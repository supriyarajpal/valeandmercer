'use client'
import { Reveal } from '@/components/Reveal'

// The development's description as PLAIN flowing text — no images inside the copy.
// Sits in a fixed, left-aligned ~65ch column. (Photos live in the gallery
// carousel near the top of the page, not in the description.)
const COLUMN = '65ch'

export default function DevelopmentStory({ headline, text, eyebrow = 'Overview' }: { headline?: string; text?: string; eyebrow?: string }) {
  if (!text || !text.trim()) return null

  return (
    <Reveal y={24} amount={0.15}>
      <section style={{ marginTop: 40, borderTop: '0.5px solid var(--border)', paddingTop: 42 }}>
        <div style={{ maxWidth: COLUMN }}>
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>{eyebrow}</p>
          {headline && <h2 style={{ color: 'var(--text)', fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2, marginBottom: 26 }}>{headline}</h2>}
          <p style={{ fontSize: 15.5, lineHeight: 1.95, color: 'var(--text)', opacity: 0.86 }}>{text.trim()}</p>
        </div>
      </section>
    </Reveal>
  )
}
