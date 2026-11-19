import Link from 'next/link'
import { getCityCards } from '@/lib/cityLanding'

// Gateway cards at the top of /buy: one wide landscape card per city that has a
// /new-homes page, ordered most-developments first (see getCityCards). Server
// Component (reads the per-city hero at build time). All motion is CSS only, no
// JS scroll code, and honours prefers-reduced-motion. The image is the city
// hero (640/1080 WebP), never a property photo; a missing file falls back to an
// ink and gold radial glow. The whole card links to /new-homes/<city>.

const INK = '#28231C'
const GOLD = '#A0845C'

function srcSet(base: string): string {
  return [640, 1080].map(w => `${base}-${w}.webp ${w}w`).join(', ')
}

export default function BuyCityCards() {
  const cities = getCityCards()
  if (cities.length === 0) return null

  return (
    <section aria-label="New homes by city" style={{ display: 'grid', gap: 'clamp(14px, 2vw, 22px)', margin: 'clamp(32px, 5vw, 56px) auto 0', width: '100%', maxWidth: 900 }}>
      {cities.map((c, i) => (
        <Link key={c.slug} href={`/new-homes/${c.slug}`} className="vm-citycard" style={{ textDecoration: 'none' }}>
          <div className="vm-citycard-media">
            {c.hero ? (
              <img
                className="vm-citycard-img"
                src={`${c.hero.base}-1080.webp`}
                srcSet={srcSet(c.hero.base)}
                sizes="(max-width: 860px) 100vw, 45vw"
                alt={`${c.name} skyline`}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            ) : (
              <div className="vm-citycard-glow" aria-hidden />
            )}
          </div>
          <div className="vm-citycard-body">
            <div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(26px, 3vw, 40px)', lineHeight: 1.05, letterSpacing: '-0.015em', color: 'var(--text)' }}>{c.name}</h2>
              <p style={{ margin: '14px 0 0', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{c.devCount} {c.devCount === 1 ? 'development' : 'developments'}</p>
              {c.fromPrice && <p style={{ margin: '10px 0 0', fontSize: 14, letterSpacing: '0.02em', color: GOLD }}>From {c.fromPrice}</p>}
            </div>
            <span className="vm-citycard-arrow" aria-hidden style={{ marginTop: 28, color: GOLD, fontSize: 22, lineHeight: 1 }}>{'→'}</span>
          </div>
        </Link>
      ))}
      <style>{CSS}</style>
    </section>
  )
}

const CSS = `
.vm-citycard {
  display: grid;
  grid-template-columns: minmax(0, 44%) 1fr;
  align-items: stretch;
  background: var(--surface-2);
  border: 0.5px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  min-height: clamp(180px, 20vw, 260px);
}
.vm-citycard-media { position: relative; overflow: hidden; background: ${INK}; }
.vm-citycard-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.vm-citycard-glow { position: absolute; inset: 0; background: radial-gradient(62% 72% at 42% 40%, rgba(160,132,92,0.30), rgba(40,35,28,0) 70%), ${INK}; }
.vm-citycard-body { display: flex; flex-direction: column; justify-content: space-between; padding: clamp(22px, 2.6vw, 38px); }
.vm-citycard-img, .vm-citycard-arrow { transition: transform 0.9s var(--ease-out-soft); }
.vm-citycard-arrow { display: inline-block; }
@media (hover: hover) and (pointer: fine) {
  .vm-citycard:hover .vm-citycard-img { transform: scale(1.06); }
  .vm-citycard:hover .vm-citycard-arrow { transform: translateX(8px); transition-duration: 0.5s; }
}
@media (max-width: 860px) {
  .vm-citycard { grid-template-columns: 1fr; min-height: 0; }
  .vm-citycard-media { aspect-ratio: 16 / 10; }
}
@media (prefers-reduced-motion: reduce) {
  .vm-citycard-img, .vm-citycard-arrow { transition: none; }
  .vm-citycard:hover .vm-citycard-img, .vm-citycard:hover .vm-citycard-arrow { transform: none; }
}
`
