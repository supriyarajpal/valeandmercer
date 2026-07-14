'use client'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useIsMobile } from '@/components/useDepthParallax'
import type { Listing } from '@/components/FeaturedProperties'

// Each pinned card owns this much card+gap footprint (in vw) — the shared
// row is translated by exactly one STEP per card so every card lands dead
// centre in turn. Kept in vw (not clamped to px) so the translateX math
// stays exact at any viewport width.
const CARD_WIDTH_VW = 58
const GAP_VW = 4
const STEP_VW = CARD_WIDTH_VW + GAP_VW
// Scroll distance "owned" by each card while the section is pinned. Lower
// = snappier/faster feeling scroll-jack, higher = slower, gentler and more
// deliberate. This is the primary "distance per scroll input" dampener:
// giving each card MORE vertical scroll distance means one wheel tick /
// trackpad swipe advances the row a SMALLER horizontal fraction, so motion
// reads as a controlled glide rather than a hard yank. 140vh lands in the
// premium/Apple-product-page range without feeling like it drags.
const VH_PER_CARD = 140
// Height of the pinned frame itself. A full `100vh` sticky child leaves a
// huge band of empty space above/below the (fixed 480px) card AND — since
// a sticky child must fully scroll past its own height once it unpins —
// turns that same band into a dead, nothing-happening scroll after the
// last card settles, right before the stats section. Sizing the frame to
// its actual content instead collapses both problems at once.
//
// The frame sticks BELOW the fixed navbar (top: var(--nav-total-height),
// see the sticky div below), so its height must fill exactly the
// remaining visible viewport (100vh - nav height) — not a flat vh
// fraction of the FULL viewport — or the frame falls short of the
// visible area and leaves unclaimed space beneath it that the frame's
// own vertical centering can't see, making the centred card+dots read
// as sitting too high with all the slack pooling at the bottom.
const PIN_FRAME_HEIGHT = 'clamp(560px, calc(100vh - var(--nav-total-height, 150px)), 1200px)'

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Raw scroll progress maps linearly to horizontal position, which spends
// most of the gesture in the visually "half-cut-off" middle of a
// card-to-card transition and only lands centred for a single instant —
// the "cards sit off to one side" complaint. Re-timing progress through
// an ease-in-out curve PER SEGMENT (card i -> card i+1) makes each card
// linger near its centred position at both ends of its segment and move
// through the middle faster, so centred reads as the resting state
// rather than a blink-and-you-miss-it instant. Same curve also softens
// the very first segment's start — the pin-engage handoff eases in
// instead of horizontal motion snapping to 1:1 with scroll immediately.
function buildEasedProgressCurve(count: number): { points: number[]; values: number[] } {
  const segments = Math.max(count - 1, 1)
  const SUBDIVISIONS = 8
  const points: number[] = [0]
  const values: number[] = [0]
  for (let seg = 0; seg < segments; seg++) {
    for (let s = 1; s <= SUBDIVISIONS; s++) {
      const localT = s / SUBDIVISIONS
      points.push((seg + localT) / segments)
      values.push((seg + easeInOutCubic(localT)) / segments)
    }
  }
  return { points, values }
}

export default function PropertyShowcase({ listings }: { listings: Listing[] }) {
  const isMobile = useIsMobile()
  const reduce = useReducedMotion()

  // Scroll-jacking is a desktop, motion-tolerant technique — long pinned
  // sections are notoriously janky on touch (address-bar collapse, 100vh
  // quirks, momentum scroll fighting a sticky pin) and actively harmful
  // for prefers-reduced-motion visitors. Both fall back to a plain
  // horizontally swipeable, scroll-snapped row: native touch scrolling,
  // zero JS-driven transforms, same cards and copy.
  if (isMobile || reduce || listings.length <= 1) return <SwipeRow listings={listings} />
  return <ScrollJackRow listings={listings} />
}

/* ------------------------------------------------------------------ */
/* Desktop: pinned section, scroll progress drives horizontal position */
/* ------------------------------------------------------------------ */

function ScrollJackRow({ listings }: { listings: Listing[] }) {
  const count = listings.length
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Progress 0→1 across the whole pinned wrapper. Because this uses
  // `position: sticky` (not a manual wheel-event/preventDefault trap),
  // normal page scroll resumes automatically the instant the wrapper's
  // bottom edge passes the viewport — no escape-hatch logic needed, no
  // risk of getting stuck.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  // Re-timed progress (see buildEasedProgressCurve) — everything that
  // depends on "which card is focused" (position, scale, opacity, dots)
  // reads from this instead of the raw scroll fraction, so they all
  // settle into the centred state together rather than one catching up
  // to another.
  const curve = useMemo(() => buildEasedProgressCurve(count), [count])
  const easedProgress = useTransform(scrollYProgress, curve.points, curve.values)
  // Wheel/trackpad scroll delivers position in discrete, often large,
  // jumps — mapped straight to x that reads as an aggressive jolt per
  // tick. This spring is the momentum/inertia layer: framer-motion re-
  // integrates it every frame (its own rAF loop), so each frame the
  // rendered position eases toward the latest scroll target rather than
  // snapping to it 1:1 — exactly the "lerp target toward input each frame"
  // behaviour, done by a proper critically-tuned integrator.
  //
  // Tuned softer and OVERDAMPED vs the old tight/snappy spring (was
  // stiffness 420 / damping 42): the lower stiffness lengthens the glide,
  // and damping kept above the critical point (2·√(stiffness·mass) ≈ 17
  // here) guarantees zero overshoot/bounce, so every card settle is a
  // smooth cubic-style ease-OUT deceleration into its centred rest — not
  // a mechanical linear track and not a springy wobble. Still short enough
  // (a few frames) that it never feels floaty or laggy behind the finger.
  const smoothProgress = useSpring(easedProgress, { stiffness: 130, damping: 34, mass: 0.55 })
  const x = useTransform(smoothProgress, [0, 1], ['0vw', `-${(count - 1) * STEP_VW}vw`])

  // Settle-in cue, tied to the RAW (un-eased) progress so it's pinned to
  // the true instant the sticky pin engages: the frame arrives at very
  // slightly less than full scale/opacity and eases up to 1 over the
  // first few percent of scroll, reading as "locking into place" rather
  // than the page just freezing mid-scroll.
  const settleScale = useTransform(scrollYProgress, [0, 0.035], [0.975, 1])
  const settleOpacity = useTransform(scrollYProgress, [0, 0.02], [0.9, 1])

  return (
    <section ref={wrapperRef} style={{ position: 'relative', height: `calc(${(count - 1) * VH_PER_CARD}vh + ${PIN_FRAME_HEIGHT})` }}>
      <motion.div
        style={{
          position: 'sticky',
          // Sticking at top:0 pins the frame's box starting BEHIND the
          // fixed navbar (which sits on top via z-index, not in flow) —
          // `alignItems: center` then centres the card within that full
          // box, including the chunk hidden behind the nav, so the card
          // reads as sitting too high with extra dead space below it.
          // Offsetting by the navbar's real measured height means the
          // frame's box IS the visible area below the nav, so centring
          // is centring in what the visitor can actually see.
          top: 'var(--nav-total-height, 0px)',
          height: PIN_FRAME_HEIGHT,
          overflow: 'hidden',
          display: 'flex',
          // Column, not row: the card row and the progress dots are now
          // two stacked normal-flow children, so justifyContent: center
          // centres the CARD+DOTS CLUSTER as one unit — equal space above
          // and below the whole group — instead of centering the card
          // alone and leaving the dots hanging off its bottom edge via
          // absolute positioning, which skewed the visible balance.
          // alignItems stays at its default (stretch), NOT 'center' — the
          // card row's content is far wider than the viewport (it holds
          // every card side by side; the `x` transform is what positions
          // it), so cross-axis centering a flex item that wide would
          // fight the transform. Stretching to full width is a no-op for
          // that row (its vw-based children ignore the box width anyway)
          // and lets the dots row centre its own (narrower) content via
          // its own justifyContent instead.
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 28,
          scale: settleScale,
          opacity: settleOpacity,
          willChange: 'transform, opacity',
          // Soft edge fade instead of a hard clip, so the next/previous
          // card peeking in at the sides tapers into the background
          // rather than reading as a stray, disconnected card fragment.
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            gap: `${GAP_VW}vw`,
            x,
            paddingLeft: `${(100 - CARD_WIDTH_VW) / 2}vw`,
            willChange: 'transform',
          }}
        >
          {listings.map((item, i) => (
            <ShowcaseCard key={item.href} item={item} index={i} count={count} scrollYProgress={smoothProgress} />
          ))}
        </motion.div>

        <ProgressDots count={count} scrollYProgress={smoothProgress} />
      </motion.div>
    </section>
  )
}

// Breakpoints for a card's own focus window: it scales/fades up as global
// progress approaches its centre point (index / (count-1)), and back down
// past it. The first card starts already in focus (nothing precedes it to
// slide in from) and the last card ends in focus (nothing follows) — both
// handled by only including the breakpoints that fall inside [0, 1].
function focusBreakpoints(index: number, count: number, near: number, far: number) {
  const center = count > 1 ? index / (count - 1) : 0
  const span = count > 1 ? 1 / (count - 1) : 1
  const left = center - span
  const right = center + span
  const points: number[] = []
  const nears: number[] = []
  if (left >= 0) { points.push(left); nears.push(far) }
  points.push(center); nears.push(near)
  if (right <= 1) { points.push(right); nears.push(far) }
  return { points, values: nears }
}

function ShowcaseCard({
  item, index, count, scrollYProgress,
}: {
  item: Listing
  index: number
  count: number
  scrollYProgress: MotionValue<number>
}) {
  const scaleBp = focusBreakpoints(index, count, 1, 0.86)
  const opacityBp = focusBreakpoints(index, count, 1, 0.4)
  const scale = useTransform(scrollYProgress, scaleBp.points, scaleBp.values)
  const opacity = useTransform(scrollYProgress, opacityBp.points, opacityBp.values)

  return (
    <motion.div
      style={{
        flex: `0 0 ${CARD_WIDTH_VW}vw`,
        height: 480,
        scale,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <ShowcaseCardInner item={item} />
    </motion.div>
  )
}

function ProgressDots({ count, scrollYProgress }: { count: number; scrollYProgress: MotionValue<number> }) {
  return (
    <div
      aria-hidden
      style={{
        // Normal-flow row now (see the parent frame's flexDirection:
        // column) — sits directly under the card with a fixed gap rather
        // than being pinned to the frame's bottom edge, so the frame's
        // justifyContent: center balances card+dots together. The parent
        // stretches this row to full width (see its alignItems comment),
        // so justifyContent here re-centres the dots within that width.
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} count={count} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  )
}

function Dot({ index, count, scrollYProgress }: { index: number; count: number; scrollYProgress: MotionValue<number> }) {
  const widthBp = focusBreakpoints(index, count, 22, 8)
  // Higher inactive-opacity floor (0.75, was 0.45) so the dots read clearly
  // against the light page background — at 0.45 the inactive dots all but
  // vanished on cream. The soft dark drop-shadow below adds definition on
  // light and is invisible on the dark theme, so it's safe in both.
  const opacityBp = focusBreakpoints(index, count, 1, 0.75)
  const width = useTransform(scrollYProgress, widthBp.points, widthBp.values)
  const opacity = useTransform(scrollYProgress, opacityBp.points, opacityBp.values)

  return (
    <motion.span
      style={{ width, height: 8, borderRadius: 999, background: '#A0845C', opacity, display: 'inline-block', boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Mobile / reduced-motion: native horizontal swipe, scroll-snapped    */
/* ------------------------------------------------------------------ */

function SwipeRow({ listings }: { listings: Listing[] }) {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        entries => { if (entries[0]?.isIntersecting) setActive(i) },
        { threshold: 0.6 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [listings.length])

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        .vm-showcase-scroller::-webkit-scrollbar { display: none; }
        .vm-showcase-scroller { scrollbar-width: none; }
      `}</style>
      <div
        className="vm-showcase-scroller"
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '4px var(--gutter) 8px',
        }}
      >
        {listings.map((item, i) => (
          <div
            key={item.href}
            ref={el => { itemRefs.current[i] = el }}
            style={{ flex: '0 0 84%', maxWidth: 420, height: 440, scrollSnapAlign: 'center' }}
          >
            <ShowcaseCardInner item={item} />
          </div>
        ))}
      </div>
      {listings.length > 1 && (
        <div aria-hidden style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {listings.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === active ? 22 : 7,
                height: 7,
                borderRadius: 999,
                background: i === active ? '#A0845C' : 'var(--border-strong)',
                transition: 'width 0.3s var(--ease-out-soft), background 0.3s var(--ease-out-soft)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared card visual — same content/copy and design language as the   */
/* previous grid's StorefrontCard (glass hover sheen, gold badge,      */
/* rounded corners), reused by both the pinned and swipe variants.     */
/* ------------------------------------------------------------------ */

function ShowcaseCardInner({ item }: { item: Listing }) {
  if (item.variant === 'cta') return <ViewAllCardInner item={item} />
  return (
    <Link
      href={item.href}
      className="card-lift"
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: '100%',
        background: '#34302B',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(52,48,43,0.04), 0 30px 60px -24px rgba(40,35,28,0.5)',
      }}
      onMouseEnter={e => {
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const glass = e.currentTarget.querySelector<HTMLSpanElement>('[data-glass]')
        if (img) img.style.transform = 'scale(1.06)'
        if (arrow) arrow.style.transform = 'translateX(6px)'
        if (glass) glass.style.opacity = '1'
      }}
      onMouseLeave={e => {
        const img = e.currentTarget.querySelector<HTMLImageElement>('img')
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        const glass = e.currentTarget.querySelector<HTMLSpanElement>('[data-glass]')
        if (img) img.style.transform = 'scale(1)'
        if (arrow) arrow.style.transform = 'translateX(0)'
        if (glass) glass.style.opacity = '0'
      }}
    >
      <img
        src={item.image}
        alt={item.area + ' property listing'}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-out-soft)', willChange: 'transform' }}
      />
      {/* Legibility scrim — a full-image PURE-BLACK gradient (not the warm
          ink used before, which barely darkened warm/wood-tone photos). It
          covers the ENTIRE image, heaviest at the top (title/description)
          and bottom (meta/CTA) but never lighter than ~0.30 anywhere, so
          near-white text keeps real contrast wherever it lands — including
          the worst case, Marsh Wall's warm wood shelving behind the title.
          Black drops luminance far more per unit of opacity than a tinted
          scrim, which is what actually makes the text pop here. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.58) 26%, rgba(0,0,0,0.38) 48%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.72) 100%)',
        }}
      />
      <span
        data-glass
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0,
          background: 'linear-gradient(135deg, rgba(160,132,92,0.20) 0%, rgba(242,239,233,0.06) 45%, rgba(40,35,28,0.10) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(242,239,233,0.18), inset 0 0 0 1px rgba(160,132,92,0.24)',
          transition: 'opacity var(--dur-slow) var(--ease-apple)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, padding: '36px 32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', background: '#A0845C', color: '#F2EFE9', padding: '6px 14px', borderRadius: 'var(--radius-pill)', marginBottom: 24 }}>
            {item.label}
          </span>
          <h3 style={{ color: '#F2EFE9', marginBottom: 14, fontSize: 'clamp(20px, 2.4vw, 26px)', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}>
            {item.area}
          </h3>
          <p style={{ fontSize: 12.5, lineHeight: 1.8, color: 'rgba(242,239,233,0.94)', maxWidth: 340, textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}>
            {item.desc}
          </p>
        </div>
        <div>
          {item.meta && (
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.9)', marginBottom: 16, textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}>
              {item.meta}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24, borderTop: '0.5px solid rgba(242,239,233,0.18)' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0845C', textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}>{item.ctaLabel ?? 'Register Interest'}</span>
            <span data-arrow style={{ color: '#A0845C', fontSize: 14, transition: 'transform 0.4s var(--ease-out-soft)' }} aria-hidden>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Terminal "view all listings" card (item.variant === 'cta'). Same outer
// footprint, radius, lift and shadow as a property card so it reads as the
// natural next step in the row — but no photo: a solid ink panel with the
// brand gold glow, and a centred pill button matching the site's button
// system (rounded --radius-pill, gold solid, hover fill + arrow nudge like
// the contact SubmitButton / nav pill). Links to the full /let grid.
function ViewAllCardInner({ item }: { item: Listing }) {
  return (
    <Link
      href={item.href}
      className="card-lift"
      aria-label={item.ctaLabel ?? item.area}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        padding: '36px 40px',
        background: '#28231C',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(52,48,43,0.04), 0 30px 60px -24px rgba(40,35,28,0.5)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        if (fill) fill.style.transform = 'translateX(0)'
        if (arrow) arrow.style.transform = 'translateX(6px)'
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        const arrow = e.currentTarget.querySelector<HTMLSpanElement>('[data-arrow]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        if (arrow) arrow.style.transform = 'translateX(0)'
      }}
    >
      {/* Decorative gold corner glow so the panel reads on-brand rather
          than as a flat rectangle. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(50% 60% at 100% 0%, rgba(160,132,92,0.18), transparent 70%), radial-gradient(46% 56% at 0% 100%, rgba(160,132,92,0.12), transparent 72%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, maxWidth: 380 }}>
        <span className="eyebrow" style={{ color: '#A0845C' }}>Our Listings</span>
        <h3 style={{ color: '#F2EFE9', fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2 }}>
          {item.area}
        </h3>
        <p style={{ fontSize: 12.5, lineHeight: 1.8, color: 'rgba(242,239,233,0.72)' }}>
          {item.desc}
        </p>
        <span
          className="btn-press"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            overflow: 'hidden',
            marginTop: 6,
            background: '#A0845C',
            color: '#F2EFE9',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '16px 28px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: '#8A6E48', transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-apple)', zIndex: 0 }} />
          <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {item.ctaLabel ?? 'View all listings'}
            <span data-arrow aria-hidden style={{ fontSize: 14, transition: 'transform 0.4s var(--ease-out-soft)' }}>→</span>
          </span>
        </span>
      </div>
    </Link>
  )
}
