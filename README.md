# Vale & Mercer

The website for **Vale & Mercer Ltd** — a London residential agency handling lettings, new homes and student lets across prime central and east London. The site is editorial in tone, image-led, and built as a cinematic journey rather than a stack of pages.

> *"London, handled with care."*

---

## Stack

| | |
|---|---|
| Framework | Next.js **16.2.6** (App Router, Turbopack) |
| Runtime | React **19.2.4** |
| Language | TypeScript |
| Styling | Tailwind CSS **v4** + CSS variables |
| Motion | Framer Motion **v12** |
| Smooth scroll | Lenis **v1.3.23** |
| Email | Resend (server-side, for `/api/contact` and `/api/valuation`) |
| Fonts | Cormorant Garamond + DM Sans, self-hosted via `next/font/google` |

No GSAP. No external animation runtime. The travel-through-a-place feel comes from the framer-motion `useScroll` / `useTransform` primitives layered on top of a global Lenis instance.

---

## Design philosophy

The homepage is built around three core ideas:

### 1. Travelling, not scrolling
Sections aren't slides that pop in — they're **layers in 3D space** the user moves through. A 4-layer depth system runs per section:

| Layer | Speed | Used for |
|---|---|---|
| **L0** | 0.15× | Background image / sky — barely moves |
| **L1** | 0.35× | Atmospheric overlays, gradients, fog |
| **L2** | 0.60× | Foreground content — rises faster than the world |
| **L3** | 1.00× | UI chrome that sticks to the scroll |

The differential between layers is what creates the parallax illusion.

### 2. Atmosphere
A fixed full-viewport layer behind every section blends through the brand palette (`#EFECE6` bone → `#28231C` deep brown → `#A0845C` gold → bone) as the user scrolls. Sections sit on top with transparent backgrounds so the "air" of the page changes color with the journey.

Implementation is compositor-only — solid layers crossfading via `opacity`, never animated `background-color`.

### 3. Cinematic entry
On first paint, a **split-curtain** (two dark panels meeting at center, with the wordmark + drawn gold hairline + tagline between them) parts vertically over ~1.5s to reveal the hero. On client-side navigation back to the homepage, the curtain is skipped and the hero entrance is snappy (~100ms). This is gated by a `FirstLoadContext` exposed from `MotionProvider`.

A subtle SVG film-grain overlay (z-9999, opacity 0.04, `mix-blend-mode: multiply`) sits over the whole site to make it feel physical rather than digital.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Cinematic homepage |
| `/about` | Brand story + principles + CTA card |
| `/let`, `/sell`, `/buy`, `/rent` | Service pages |
| `/valuations` | Book a free valuation (form → `/api/valuation`) |
| `/register` | Property alerts signup (form → `/api/contact`) |
| `/blog` | Journal index |
| `/blog/london-property-market-2025` | Long-form article |
| `/blog/guide-to-buying-in-chelsea` | Long-form article |
| `/blog/student-lettings-london-guide` | Long-form article |
| `/fees`, `/terms`, `/privacy`, `/cookies`, `/complaints` | Policy pages |
| `/admin` | Internal admin route |

---

## Project structure

```
/app                       App Router routes
  /page.tsx                Homepage composition
  /layout.tsx              Root layout, font loading, MotionProvider mount
  /globals.css             Design tokens + typography rhythm
  /<route>/page.tsx        One file per route
  /api/contact/route.ts    Resend-backed contact form handler
  /api/valuation/route.ts  Resend-backed valuation form handler

/components
  MotionProvider.tsx       Lenis + curtain + atmosphere + grain mount
  AtmosphereLayer.tsx      Global palette wash driven by scroll
  GrainOverlay.tsx         Fixed SVG film-grain texture
  useDepthParallax.ts      4-layer depth hook + useIsMobile

  Hero.tsx                 100vh, depth-layered, line-mask reveal
  FeaturedProperties.tsx   "Passing storefronts" — per-card perspective
  BuyingSection.tsx        Clip-path image expand + inner pan
  ValuationStrip.tsx       The still point — large headline + Ken Burns
  AboutStrip.tsx           Service cards with arc entrance
  BlogSection.tsx          Editorial blog cards
  Testimonials.tsx         Draggable framer-motion carousel
  GetInTouch.tsx           Arrival sequence — headline arrives last
  Footer.tsx               Slow rise (0.98 → 1.0 scale)

  Navbar.tsx               Transparent → solid on scroll, animated mobile menu
  Reveal.tsx               Reveal + Stagger + StaggerItem primitives
  PageHero.tsx             Shared interior-page hero pattern
  ArrowButton.tsx          4-variant CTA with slide-fill hover
  ArticleLayout.tsx        Shared blog article layout
```

Notes:
- Only `/app/*` is served. There are legacy duplicates at the repo root (`Hero.tsx`, `Navbar.tsx`, etc., and folder-level pages like `/valuations`, `/about`) — these are **not routed** by the App Router and can be ignored or deleted.

---

## Running locally

```bash
npm install
npm run dev
# → http://localhost:3000 (or 3002 if 3000 is taken)
```

Other scripts:

```bash
npm run build   # production build (Turbopack)
npm run start   # serve the production build
npm run lint    # eslint
```

The forms require these env vars in `.env.local`:

```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=info@valeandmercer.co.uk
```

Without them the forms return 500; the UI handles this and shows an error state.

---

## Color & typography

Palette (locked — see `globals.css`):

| Token | Hex |
|---|---|
| `--c-bg` (bone) | `#EFECE6` |
| `--c-bg-dark` (deep brown) | `#28231C` |
| `--c-ink` | `#28231C` |
| `--c-muted` | `#6B6258` |
| `--c-line` / `--c-line-soft` | `#DDD7CC` / `#C8C0B4` |
| `--c-gold` | `#A0845C` |

Typography rhythm:
- Headings: Cormorant Garamond 300, letter-spacing `-0.02em`
- Body: DM Sans 400, line-height 1.7
- Eyebrows: 10–12px, letter-spacing `0.28em`, uppercase, gold
- Section padding: `var(--section-y)` = `clamp(64px, 9vw, 120px)`

---

## Performance

- `will-change` is set per element and per property, only on elements actively animating
- All non-hero images use `loading="lazy"`
- Atmosphere layer + grain are compositor-only (no per-frame paint)
- The Ken Burns on `ValuationStrip` is a CSS keyframe animation — no scroll dependency, no JS loop
- Lenis is tuned to `lerp 0.085` / `duration 1.35` for a heavier scroll feel without overshooting
- `prefers-reduced-motion` is honoured everywhere — parallax disables, Ken Burns stops, masks resolve to identity

---

## Where the journey is choreographed

If you want to tune the cinematic feel, the dials are concentrated in two files:

- **`components/MotionProvider.tsx`** — curtain hold/exit timings, Lenis options, FirstLoad gating
- **`components/AtmosphereLayer.tsx`** — palette wash keyframes against scroll progress

Per-section entrance choreography lives inside each component (`Hero.tsx`, `BuyingSection.tsx`, etc.) — search for `ENTER_DELAY`, `delay:`, and `viewport={{ amount: ... }}`.

---

## Legal

The footer carries the registered office, Company No, ICO No, AML supervision, Client Money Protection statement, and links to `/privacy`, `/cookies`, `/complaints`, `/terms` — all required for UK lettings regulation compliance.

Vale and Mercer Ltd. Company No: 17212434. Registered in England and Wales.
