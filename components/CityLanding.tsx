import CityHomes from '@/components/CityHomes'
import CityClose from '@/components/CityClose'
import { UK_MAP, CITY_PINS, type CityLanding as CityLandingData } from '@/lib/cityLanding'

// Premium city landing page for /new-homes/<city>. Native scroll only: every
// entrance is a CSS scroll-driven animation inside @supports (animation-timeline),
// so unsupported browsers simply show the content; prefers-reduced-motion is
// static. No framer-motion, no JS scroll listeners. The hero is the only priority
// image and the only image loaded before scroll; Around cards and property photos
// are lazy. All copy comes from data.json; the H1, homes heading and enquiry
// heading are templated from the city name.
//
// Seamless page colour: a single fixed layer (.vm-bg) sits behind everything and
// drifts through the deep-brown palette with page scroll (a registered <color>
// animated on scroll(root)): espresso at the hero, through umber and walnut, a
// mocha warm-glow at the numerals, and back to espresso, with no section edges.
// The page is all dark brown in BOTH themes (the dark theme tokens are forced on
// .vm-city), so text is always ivory. Every section background is transparent;
// text uses --page-fg / --page-muted / --page-gold.

const INK = '#28231C'
const GOLD = '#A0845C'
const CREAM = '#F2EFE9'

const HERO_SIZES = '100vw'
const AROUND_SIZES = '(max-width: 720px) 90vw, 30vw'

function srcSet(base: string): string {
  return [640, 1080, 1920].map(w => `${base}-${w}.webp ${w}w`).join(', ')
}

export default function CityLanding({ data }: { data: CityLandingData }) {
  const { name, slug, hero, copy, around, cards, devCount, showFilters } = data
  // Hero and closing headlines are authored per city (the city word renders
  // gold italic); the hero falls back to the templated phrase when none is set.
  const heroHeading = copy.h1 ?? `Find Your Place in ${name}.`
  // Gallery is city imagery only (never property photos), capped at 24.
  const cityGallery = [hero, ...around.map(a => a.image)].filter(Boolean).map(img => `${img!.base}-1920.webp`).slice(0, 24)

  return (
    <main className="vm-city">
      {/* Two fixed full-viewport layers behind the page: the scroll-driven deep
          brown colour, and a faint gold radial glow that peaks at the numerals
          (and sits behind the map card) for depth (see CSS). */}
      <div className="vm-bg" aria-hidden />
      <div className="vm-glow" aria-hidden />

      {/* 1, Hero: the photo and its scrim share one masked wrapper so the lower
          third dissolves into the page background instead of ending on an edge.
          The heading and CTA are siblings outside the mask, so they stay solid. */}
      <section style={{ position: 'relative', height: '100svh', minHeight: 520, overflow: 'hidden' }}>
        <div className="vm-hero-media">
          {hero ? (
            <div className="vm-hero-par" style={{ position: 'absolute', inset: '-6% 0' }}>
              <img
                className="vm-hero-img"
                src={`${hero.base}-1920.webp`}
                srcSet={srcSet(hero.base)}
                sizes={HERO_SIZES}
                alt={`${name} skyline`}
                /* the one priority image */
                fetchPriority="high"
                decoding="async"
                /* hero copy sits over the photo, so dim this copy of the image
                   (the /buy gateway card uses the same file at full brightness) */
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.7)' }}
              />
            </div>
          ) : (
            // Missing hero: ink with a slow gold radial glow.
            <div className="vm-hero-glow" aria-hidden style={{ position: 'absolute', inset: 0, background: INK }} />
          )}
          {/* Warm brown multiply tint so the photo sits in the dark palette. */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(42,33,26,0.25)', mixBlendMode: 'multiply' }} />
          {/* Scrim: a deep-brown wash, strongest through the headline band for
              legible white copy (no light overlay anywhere). */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,19,13,0.55) 0%, rgba(26,19,13,0.16) 32%, rgba(26,19,13,0.34) 58%, rgba(26,19,13,0.2) 76%, rgba(26,19,13,0) 100%)' }} />
          {/* Bottom melt: the lower 42% fades to solid espresso (the exact page
              background colour) so the photo dissolves into the page, no seam. */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 58%, var(--p-espresso) 92%, var(--p-espresso) 100%)' }} />
        </div>

        {/* Content shares the navbar's geometry (var(--gutter) outer, maxWidth
            1280 inner), so the H1 left edge lines up with the Vale and Mercer
            logo. The headline is white on all cities for contrast on the photo. */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 var(--gutter)', paddingBottom: 'clamp(56px, 11vh, 120px)' }}>
          <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(34px, 5vw, 64px)', lineHeight: 1.06, letterSpacing: '-0.015em', maxWidth: 14 + 'ch' }}>
              <GoldWords text={heroHeading} city={name} animate accent="#FFFFFF" />
            </h1>
            {copy.intro && (
              <p className="vm-hero-sub" style={{ marginTop: 22, maxWidth: 560, fontSize: 'clamp(15px, 1.8vw, 18px)', lineHeight: 1.75, color: 'rgba(255,255,255,0.86)' }}>{copy.intro}</p>
            )}
            {copy.cta && (
              <a className="vm-hero-sub btn-press" href="#homes" style={{ marginTop: 30, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK, background: GOLD, border: `1px solid ${GOLD}`, padding: '15px 28px', borderRadius: 'var(--radius-pill)', textDecoration: 'none' }}>
                {copy.cta}<span aria-hidden>{'→'}</span>
              </a>
            )}
          </div>
        </div>

        <div aria-hidden className="vm-hero-sub" style={{ position: 'absolute', left: '50%', bottom: 'clamp(16px, 3vh, 30px)', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Scroll</span>
          <span className="vm-cue-line" style={{ display: 'block', width: 1, height: 30, background: `linear-gradient(to bottom, rgba(160,132,92,0) 0%, ${GOLD} 100%)` }} />
        </div>
      </section>

      {/* 2, About + UK map (map always shows; the three lines show when present) */}
      <section style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(36px, 6vw, 80px)', alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            {(copy.about ?? []).map((line, i) => (
              <p key={i} className="vm-about-line" style={{ ['--i' as string]: i, margin: 0, fontSize: 'clamp(17px, 2.1vw, 23px)', lineHeight: 1.6, color: 'var(--page-fg)', fontFamily: 'var(--font-serif)', fontWeight: 300 }}>{line}</p>
            ))}
          </div>
          <UkMapCard slug={slug} name={name} />
        </div>
      </section>

      {/* 3, Around <street> (omitted when no card image exists) */}
      {around.length > 0 && (
        <section style={{ padding: '0 var(--gutter) var(--section-y)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            {copy.around?.heading && <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(26px, 3.4vw, 42px)', color: 'var(--page-fg)', marginBottom: 28 }}>{copy.around.heading}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: 20 }}>
              {around.map((c, i) => (
                <article key={c.place} className="vm-around-card" style={{ ['--i' as string]: i, position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: INK }}>
                  <img className="vm-around-img" src={`${c.image.base}-1080.webp`} srcSet={srcSet(c.image.base)} sizes={AROUND_SIZES} alt={c.place} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,17,14,0.85) 0%, rgba(20,17,14,0.1) 55%)' }} />
                  <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, color: CREAM }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 300, lineHeight: 1.2 }}>{c.place}</div>
                    {c.note && <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5, color: 'rgba(242,239,233,0.82)' }}>{c.note}</div>}
                    {typeof c.minutes === 'number' && <div style={{ marginTop: 6, color: GOLD, fontSize: 12.5, letterSpacing: '0.04em' }}>{c.minutes} min {copy.around?.label ?? 'on foot'}</div>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4, Why choose <city>: the numerals section. The page colour reaches its
          mocha warm-glow here (see the scroll journey in CSS); the band fill is
          gone (the fixed layer provides the colour), and the gold and text use
          --page-gold / --page-fg. */}
      {copy.why?.items && copy.why.items.length > 0 && (
        <section className="vm-numerals" style={{ padding: 'var(--section-y) var(--gutter)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            {copy.why.heading && <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(26px, 3.4vw, 42px)', color: 'var(--page-fg)', marginBottom: copy.why.label ? 10 : 40 }}>{copy.why.heading}</h2>}
            {copy.why.label && <p style={{ margin: '0 0 40px', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--page-gold)' }}>{copy.why.label}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'clamp(28px, 4vw, 56px)' }}>
              {copy.why.items.map((it, i) => {
                // Gold numeral only where the line states a journey time in
                // minutes, so a street or road name that merely contains digits
                // (e.g. the M60) does not sprout a spurious figure.
                const num = (it.text.match(/(\d+)\s*min/) || [])[1]
                return (
                  <div key={it.title} className="vm-why-col" style={{ ['--i' as string]: i }}>
                    {num && <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--page-gold)', fontSize: 'clamp(46px, 6vw, 72px)', lineHeight: 1 }}>{num}<span style={{ fontSize: 16, marginLeft: 6 }}>min</span></div>}
                    <h3 style={{ margin: '16px 0 8px', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--page-gold)' }}>{it.title}</h3>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'var(--page-muted)' }}>{it.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5, Homes (shared ListingTile grid, street + city titles) */}
      <CityHomes city={name} cards={cards} devCount={devCount} showFilters={showFilters} />

      {/* 6, Final heading (city word gold italic), omitted when none is set */}
      {copy.finalHeading && (
        <section style={{ padding: 'var(--section-y) var(--gutter) 0', textAlign: 'center' }}>
          <h2 className="vm-final" style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(30px, 5vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.015em', color: 'var(--page-fg)' }}>
            <GoldWords text={copy.finalHeading} city={name} accent="var(--page-gold)" />
          </h2>
        </section>
      )}

      {/* 7, Enquiry + lazy gallery lightbox (city imagery only) */}
      <CityClose city={name} galleryImages={cityGallery} />

      <style>{CSS}</style>
    </main>
  )
}

/* ---------- Headline with the city word in gold italic ---------- */
// Splits a headline into words and renders the word matching the city name in
// gold italic. `animate` opts into the hero's sequential word rise (the closing
// heading reveals as a block instead, so it is static here).
function GoldWords({ text, city, animate = false, accent = GOLD }: { text: string; city: string; animate?: boolean; accent?: string }) {
  const words = text.split(/\s+/).filter(Boolean)
  const key = city.trim().toLowerCase()
  return (
    <>
      {words.map((w, i) => {
        const isCity = w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').toLowerCase() === key
        const tone = isCity ? { color: accent, fontStyle: 'italic' as const } : {}
        return animate ? (
          <span key={i} className="vm-word" style={{ ['--i' as string]: i, display: 'inline-block', marginRight: '0.28em', ...tone }}>{w}</span>
        ) : (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.28em', ...tone }}>{w}</span>
        )
      })}
    </>
  )
}

/* ---------- UK map card (inline SVG so the outline can draw itself) ---------- */

function UkMapCard({ slug, name }: { slug: string; name: string }) {
  const pin = CITY_PINS[slug]
  return (
    <div className="vm-map-card" style={{ justifySelf: 'center', width: 'min(100%, 380px)', aspectRatio: '1 / 1', borderRadius: 28, background: '#1F1812', border: '1px solid rgba(160,132,92,0.4)', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox={UK_MAP.viewBox} width="100%" height="100%" style={{ display: 'block', padding: '12%' }} role="img" aria-label={`${name} on a map of Great Britain`}>
        {UK_MAP.path && <path className="vm-uk-path" pathLength={1} d={UK_MAP.path} fill="none" stroke="rgba(160,132,92,0.6)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
        {pin && (
          <g className="vm-pin" style={{ transformOrigin: `${pin.x}px ${pin.y}px` }}>
            <circle className="vm-ripple vm-ripple-1" cx={pin.x} cy={pin.y} r={6} fill="none" stroke={GOLD} strokeWidth={1.5} />
            <circle className="vm-ripple vm-ripple-2" cx={pin.x} cy={pin.y} r={6} fill="none" stroke={GOLD} strokeWidth={1.5} />
            <circle cx={pin.x} cy={pin.y} r={5.5} fill={GOLD} />
            <text x={pin.x + 12} y={pin.y + 4} fill={CREAM} fontSize={15} fontFamily="var(--font-serif)">{name}</text>
          </g>
        )}
      </svg>
    </div>
  )
}

const CSS = `
/* ---- Scroll-driven page colour: an all-dark brown journey ----------------
   These pages stay in the deep-brown family in BOTH themes: no ivory, cream,
   linen or white background anywhere. The fixed .vm-bg layer drifts with page
   scroll: espresso at the hero, umber through About, walnut toward the
   numerals, a mocha warm-glow at the numerals centre (~33%), then back down to
   espresso by the enquiry. A faint gold radial glow (.vm-glow) rides the same
   timeline behind the map card and numerals. Text is always ivory, gold always
   bright, so contrast holds (walnut/mocha are the tightest stops). */
@property --vm-bg { syntax: '<color>'; inherits: true; initial-value: #2A211A; }

.vm-city {
  position: relative;
  /* Own stacking context above the site's global AtmosphereLayer (a fixed
     var(--surface) fill at z-index -1): the .vm-bg / .vm-glow layers below use
     negative z WITHIN this context, so they sit above the AtmosphereLayer but
     behind the page content, and the light site background never shows. */
  z-index: 0;
  background: transparent;
  /* Deep-brown palette (used everywhere on these pages, both themes). */
  --p-espresso: #2A211A;     /* base + hero fade target */
  --p-umber: #3A2C20;
  --p-walnut: #4B3826;
  --p-mocha: #5C4330;        /* lightest background allowed; the numerals glow */
  --p-gold: #A0845C;
  --p-gold-bright: #C9A56F;
  --vm-bg: var(--p-espresso);
  --page-fg: #F5F0E8;                                   /* ivory text */
  --page-muted: color-mix(in oklch, #F5F0E8 68%, transparent);
  --page-gold: var(--p-gold-bright);
  /* Force the dark theme tokens on these pages so the untouched enquiry form,
     filter chips and gallery button stay dark in light mode too: the page is
     identical in both themes and never shows a light background. */
  --surface: var(--p-espresso);
  --surface-2: #332519;
  --surface-3: #3A2C20;
  --text: #F5F0E8;
  --text-muted: color-mix(in oklch, #F5F0E8 68%, transparent);
  --text-faint: color-mix(in oklch, #F5F0E8 48%, transparent);
  --border: rgba(245,240,232,0.14);
  --border-strong: rgba(245,240,232,0.24);
  color-scheme: dark;
}

.vm-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background: var(--vm-bg);
}
/* Faint gold radial glow for depth behind the map card and numerals; its
   opacity rides the timeline, peaking at the numerals (the mocha moment). */
.vm-glow {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(62% 48% at 50% 40%, rgba(201,165,111,0.08), rgba(201,165,111,0) 72%);
  opacity: 0;
}

/* Fallback without scroll-driven animations: a static espresso -> walnut ->
   espresso vertical gradient (all dark). */
@supports not (animation-timeline: scroll()) {
  .vm-bg { background: linear-gradient(to bottom, var(--p-espresso) 0%, var(--p-walnut) 45%, var(--p-espresso) 100%); }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .vm-city { animation: vmBg both; animation-timeline: scroll(root); animation-timing-function: ease-in-out; }
    .vm-glow { animation: vmGoldGlow both; animation-timeline: scroll(root); animation-timing-function: ease-in-out; }
  }
}

/* The brown journey, keyed to the real section positions (page scroll): espresso
   hero -> umber About -> walnut -> mocha at the numerals centre (~33%) -> walnut
   -> umber Homes -> espresso enquiry. Smooth eases, no steps, held plateaus. */
@keyframes vmBg {
  0%, 8%    { --vm-bg: var(--p-espresso); }
  18%       { --vm-bg: var(--p-umber); }
  27%       { --vm-bg: var(--p-walnut); }
  33%       { --vm-bg: var(--p-mocha); }
  42%       { --vm-bg: var(--p-walnut); }
  53%       { --vm-bg: var(--p-umber); }
  68%, 100% { --vm-bg: var(--p-espresso); }
}
/* Gold glow behind the map card + numerals (page ~15-45%), peaking at ~33%. */
@keyframes vmGoldGlow { 0%, 12% { opacity: 0 } 22% { opacity: 0.7 } 33% { opacity: 1 } 44% { opacity: 0.5 } 56%, 100% { opacity: 0 } }

/* Map card: keep its ink look, lifted to #1F1812 with a faint light border so it
   separates from the walnut and mocha stops (the page is always dark). */
.vm-map-card { box-shadow: inset 0 0 0 1px rgba(245,240,232,0.10); }

/* Reduced motion: no scroll coupling, a flat static espresso page, no glow. */
@media (prefers-reduced-motion: reduce) {
  .vm-bg { background: var(--p-espresso); }
  .vm-glow { opacity: 0; }
}

/* ---- Hero: a warm brown multiply tint sits the photo in the palette; a solid
   espresso gradient paints over the lower 40% (so even the photo's light haze
   melts to espresso), ending on exactly the page background colour, no seam. */
.vm-hero-media {
  position: absolute;
  inset: 0;
  isolation: isolate;
}

/* Hero load motion (settle + sequential word rise), scroll parallax, cue. */
@media (prefers-reduced-motion: no-preference) {
  .vm-hero-img { animation: vmSettle 1.9s var(--ease-out-soft) both; }
  .vm-word { opacity: 0; animation: vmUp 0.8s var(--ease-out-soft) both; animation-delay: calc(var(--i) * 0.11s); }
  .vm-hero-sub { opacity: 0; animation: vmUp 0.9s var(--ease-out-soft) both; animation-delay: 0.75s; }
  .vm-cue-line { transform-origin: top; animation: vmCue 2.4s var(--ease-out-soft) infinite; }
  .vm-hero-glow { animation: vmGlow 6s ease-in-out infinite; }
  .vm-ripple-1 { animation: vmRipple 3s var(--ease-out-soft) infinite; }
  .vm-ripple-2 { animation: vmRipple 3s var(--ease-out-soft) 1.5s infinite; }
  @supports (animation-timeline: scroll()) {
    .vm-hero-par { animation: vmPar linear both; animation-timeline: scroll(root); }
  }
  @supports (animation-timeline: view()) {
    .vm-about-line { opacity: 0; animation: vmUp 0.9s var(--ease-out-soft) both; animation-timeline: view(); animation-range: entry 0% entry 30%; animation-delay: calc(var(--i) * 0.12s); }
    .vm-around-card { opacity: 0; animation: vmUp 0.8s var(--ease-out-soft) both; animation-timeline: view(); animation-range: entry 0% entry 26%; animation-delay: calc(var(--i) * 0.08s); }
    .vm-why-col { opacity: 0; animation: vmUp 0.8s var(--ease-out-soft) both; animation-timeline: view(); animation-range: entry 0% entry 30%; animation-delay: calc(var(--i) * 0.08s); }
    .vm-final { opacity: 0; animation: vmUp 0.9s var(--ease-out-soft) both; animation-timeline: view(); animation-range: entry 0% entry 34%; }
    .vm-uk-path { stroke-dashoffset: 1; animation: vmDraw linear both; animation-timeline: view(); animation-range: entry 6% entry 56%; }
    .vm-pin { opacity: 0; animation: vmPin 0.6s var(--ease-out-soft) both; animation-timeline: view(); animation-range: entry 40% entry 62%; }
  }
}
.vm-around-img { transition: transform 0.6s var(--ease-out-soft); }
@media (hover: hover) and (pointer: fine) { .vm-around-card:hover .vm-around-img { transform: scale(1.06); } }
@keyframes vmSettle { from { transform: scale(1.08) } to { transform: scale(1) } }
@keyframes vmUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
@keyframes vmCue { 0%,100% { transform: scaleY(0.4); opacity: 0.5 } 50% { transform: scaleY(1); opacity: 1 } }
@keyframes vmPar { from { transform: translateY(0) } to { transform: translateY(-7%) } }
@keyframes vmDraw { to { stroke-dashoffset: 0 } }
@keyframes vmPin { from { opacity: 0; transform: translateY(-14px) } to { opacity: 1; transform: none } }
@keyframes vmRipple { from { r: 6px; opacity: 0.7 } to { r: 22px; opacity: 0 } }
@keyframes vmGlow { 0%,100% { background: radial-gradient(60% 55% at 50% 42%, rgba(160,132,92,0.22), rgba(40,35,28,0) 70%), ${INK} } 50% { background: radial-gradient(66% 60% at 50% 42%, rgba(160,132,92,0.38), rgba(40,35,28,0) 72%), ${INK} } }
`
