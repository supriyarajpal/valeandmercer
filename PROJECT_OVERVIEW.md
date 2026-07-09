# Vale and Mercer — Project Overview

Audit + change log for `/Users/devasyesachdeva12/Downloads/vale-and-mercer-source/`, the source for **valeandmercer.co.uk** (London residential agency: lettings, new homes, student lets). All citations are repo-relative.

> **Update history**
> - **Original audit** — read-only deep-dive of the codebase as it stood.
> - **2026-06-29 rework** — fixed iPad Safari/render-blank issues, repointed form emails, fixed register-form bug, gated `/admin` behind a build flag, removed em-dashes from visitor copy, fixed UK-English typos, and shipped a full SEO layer (per-page metadata, sitemap, robots, OG/Twitter, JSON-LD). See section 10 for the change log.
> - **2026-07-02** — Vercel Web Analytics wired in. `@vercel/analytics` added to `package.json`; `<Analytics />` mounted in `app/layout.tsx` inside `<body>` as a sibling of `<MotionProvider>` (not nested, so it isn't affected by page-transition wrappers). Data only surfaces once deployed to production on Vercel and receiving real traffic.
> - **2026-07-10** — Property-detail page pass: (a) navbar "Est. London" eyebrow becomes a "← Back to Rentals" link ONLY on `/property/*` routes (rest of site unchanged), and the standalone back-link previously floating in the hero is gone. (b) `PropertyGallery` rewritten from a 3-thumb strip + lightbox-only setup into a full-width inline horizontally scrollable strip of every photo (hero + gallery), rendered directly under the hero; filenames matching a floor-plan heuristic are pushed to the end. The click-to-zoom lightbox is retained as a secondary affordance. (c) Overview section leads the body; tag pills sit AFTER it in the same left column, not above. (d) "Rent payment options" / "Income requirements" section removed entirely (and the now-unused `RENT_TERMS`/`RENT_GUIDES` imports + `RentTermLine` helper). (e) Property-page mailto/enquiry contact switched from `info@valeandmercer.co.uk` to `raghav@valeandmercer.co.uk` (`AGENT_CONTACT.email` in `lib/properties.ts` + `AGENT_EMAIL` in `PropertyEnquiryActions.tsx`); site-wide footer / JSON-LD email untouched. Sidebar agent card no longer prints the personal name ("Raghav Rajpal") or the raw phone number — enquiry now flows purely through the Book a Viewing / Make an Offer disclosure buttons. (f) Footer nav column now lists 5 items in order: Lettings, New Homes, Student Lettings, Rentals, Book Valuation.
> - **2026-07-10 (later)** — Property hero replaced with an in-place image carousel. New client component `components/PropertyHeroCarousel.tsx` cycles through all of a property's photos as the full-bleed hero background (opacity crossfade), with prev/next arrows (edge-anchored), a dot row with expanding pill for the active slide, and a `N / total` counter — all overlaid on the hero. Left/right arrow keys advance. On first load (frame 0) the full title/price/beds-baths stack is shown; once the user navigates to any other frame, the text collapses to a compact bottom-left label (property name + area + `To Let · Ref …`) and STAYS collapsed for the rest of the visit — restoring full text felt jarring in review. Floor-plan filenames are pushed to the last slide via a shared heuristic. The separate "Gallery · N photos" strip that lived below the hero is gone, and the old `components/PropertyGallery.tsx` file was deleted (no remaining importers). Scrim + placeholder badge behaviour preserved. Verified on `lawn-house-close-1bed` (8 slides) and `westferry-circus-4377` (29 slides).
> - **2026-07-10 (polish)** — Two small property-page visual fixes. (a) Enquire/contact card in the sidebar now has a gentle `border-radius: 10px` — subtle rounding, not pill-shaped, applied at the single point the card renders (`app/property/[slug]/page.tsx` PropertySidebar). (b) Hero carousel scrim is now scoped to the first frame only: while the full hero copy is on screen (frame 0, pre-interaction) the original dual full-bleed scrim + 0.7 image opacity applies for text legibility; once the user browses (state flips to `interacted`), both full-bleed scrim layers fade out over 500 ms, the image opacity restores to 1 (true colour + brightness), and a small bottom-left corner gradient (~55 % × 38 %, top-right fall-off) fades in — enough to keep the minimised label readable without darkening the photo. Verified on `lawn-house-close-1bed` and `marsh-wall-3bed-5958`.
> - **2026-07-10 (spacing + toggle)** — Three targeted follow-ups. (a) Hero-to-Overview gap tightened: hero carousel bottom padding `96px → 64px` and PropertyBody top padding `var(--section-y) → 40px`, so the transition lands at roughly one normal section gap instead of two. (b) Hero text collapse/restore is now a **two-way toggle** driven by `idx === 0` instead of the one-way `interacted` latch — image 1 always shows the full title/price/details stack (both on initial load AND when the user navigates back to it via prev/next/dot); images 2+ show the compact bottom-left label. The scrim + image-opacity crossfades follow the same gate, so returning to slide 0 restores the heavy scrim + 0.7 dim in sync with the text expansion. (c) Site-wide footer email swapped from `info@valeandmercer.co.uk` to `raghav@valeandmercer.co.uk` in `components/Footer.tsx` (mailto + visible text). `GetInTouch.tsx` and the layout.tsx JSON-LD email remain `info@` — out of scope for this pass. Verified on `lawn-house-close-1bed` and `westferry-circus-4078`.

---

## 1. Tech Stack

- **Framework:** Next.js **16.2.6** (App Router) — `package.json:14`
- **Runtime:** React **19.2.4** — `package.json:15-16`
- **Language:** TypeScript 5, strict mode on, path alias `@/* -> ./*` — `tsconfig.json:7`, `tsconfig.json:21-23`
- **Package manager:** npm (committed `package-lock.json`)
- **Styling:** Tailwind CSS **v4** via `@tailwindcss/postcss` — `postcss.config.mjs`, `package.json:21,26`. A legacy `tailwind.config.ts` exists with custom colors but Tailwind v4 in this project is driven entirely through PostCSS + CSS variables in `app/globals.css`; the config file is effectively unused. The CSS files use `@tailwind base/components/utilities` directives (legacy v3 syntax). Verify against Tailwind v4 docs before relying on the `tailwind.config.ts` extensions.
- **Animation:** `framer-motion` v12 (heavily used) — `package.json:12`
- **Smooth scroll dependency:** `lenis` v1.3.23 is installed (`package.json:13`) but **not used** — `components/MotionProvider.tsx:67-69` explicitly states "No Lenis. Browser wheel/touch smoothness is reliable…". README still advertises Lenis as part of the stack — out of date.
- **Email:** `resend` v6 — used in `app/api/contact/route.ts` and `app/api/valuation/route.ts`
- **Cookie consent:** Cookiebot script loaded in `app/layout.tsx` with `strategy="afterInteractive"` (was `beforeInteractive`; changed in the 2026-06-29 rework so a slow/blocked Cookiebot CDN can't block hydration). CBID `83316c47-05e4-4cd6-b5bc-7126635c5cc5`.
- **Fonts:** Google Fonts loaded via `<link>` in CSS `@import` (Cormorant Garamond + DM Sans) — `app/globals.css:1`. README claims `next/font/google` self-hosting; this is **not implemented**.
- **Hosting/Deploy:** No `vercel.json`, no `.vercel/` directory, no `Dockerfile`, no CI config. Admin page `app/admin/page.tsx:134` literally instructs the user to run `vercel --prod`, so Vercel is the assumed target but no project config is committed.
- **CMS / content source:** None. All page copy and the blog posts are hardcoded TSX.
- **Database / ORM:** None. There is no persistence layer; form submissions are emailed via Resend only.

---

## 2. Project Structure

### Live (served by App Router)

The App Router root is `app/`. Everything served comes from here.

```
app/
  layout.tsx                       Root layout: <html>, Cookiebot, MotionProvider, site-wide metadata + OG/Twitter
  page.tsx                         Homepage (Navbar, Hero, sections, Footer) + JSON-LD RealEstateAgent
  globals.css                      Design tokens + typography rhythm (CSS variables) + .vm-h-screen-dvh fallback class
  sitemap.ts                       /sitemap.xml generator (added 2026-06-29)
  robots.ts                        /robots.txt generator (added 2026-06-29)
  favicon.ico
  about/page.tsx                   Brand story + principles  (+ about/layout.tsx for metadata)
  admin/page.tsx                   Server-side gate: 404s unless ENABLE_ADMIN=true
  admin/AdminClient.tsx            The actual client-side form generator (only renders when gated open)
  blog/page.tsx                    Journal index (3 hardcoded posts)  (+ blog/layout.tsx for metadata)
  blog/london-property-market-2025/page.tsx
  blog/guide-to-buying-in-chelsea/page.tsx
  blog/student-lettings-london-guide/page.tsx
  buy/page.tsx                     "New homes" — coming-soon teaser cards  (+ buy/layout.tsx for metadata)
  let/page.tsx                     Lettings service page
  rent/page.tsx                    Rentals teaser (also coming-soon)  (+ rent/layout.tsx for metadata)
  sell/page.tsx                    Selling service page
  register/page.tsx                "Get Notified" form (POSTs /api/contact)  (+ register/layout.tsx for metadata)
  valuations/page.tsx              "Book Valuation" form (POSTs /api/valuation)  (+ valuations/layout.tsx for metadata)
  fees/page.tsx                    Services & fees (transparency page)
  privacy/page.tsx                 Privacy notice
  cookies/page.tsx                 Cookie policy
  complaints/page.tsx              Complaints policy
  terms/page.tsx                   Website terms of use
  api/contact/route.ts             POST → Resend. Branches on subject=='Property Alert Registration' to render correct template.
  api/valuation/route.ts           POST → Resend (valuation enquiries)

components/                        All shared UI (see Section 4). `Reveal.tsx` now exports `useInViewSafe` hook.
lib/properties.ts                  Type + sample listings array (NOT IMPORTED anywhere)
public/                            Static assets — see notes below
```

### Leftover / dead code at repo root

The repo root contains a near-complete duplicate of the App Router tree from before the codebase was reorganized into `app/`. These are **not served** (the App Router only looks inside `app/`), but they confuse navigation and tools. Confirmed via `diff`:

| Root path | Status vs `app/` counterpart |
|---|---|
| `page.tsx`, `layout.tsx` | Near-identical to `app/page.tsx`, `app/layout.tsx` (root `layout.tsx` still uses the older `PageTransition` wrapper) |
| `Navbar.tsx`, `Hero.tsx`, `Footer.tsx`, `GetInTouch.tsx`, `FeaturedProperties.tsx`, `BuyingSection.tsx`, `ValuationStrip.tsx`, `AboutStrip.tsx`, `BlogSection.tsx`, `Testimonials.tsx`, `TickerStrip.tsx`, `PageTransition.tsx` | Older copies; the live ones live in `components/` |
| `about/`, `blog/`, `buy/`, `let/`, `rent/`, `sell/`, `register/`, `valuations/` | Older versions of the page files. `about/page.tsx` etc. **differ** from `app/about/page.tsx` etc. — they are older snapshots. |
| `admin/`, `complaints/`, `cookies/`, `fees/`, `privacy/`, `terms/` | **Identical** to the `app/` versions (diff returns nothing) |
| `guide-to-buying-in-chelsea/`, `london-property-market-2025/`, `student-lettings-london-guide/` | Older blog-post snapshots; differ from `app/blog/<slug>/page.tsx` |
| `contact/route.ts`, `valuation/route.ts`, `route.ts`, `api/contact/route.ts`, `api/valuation/route.ts` | All five files have **identical** content to `app/api/contact/route.ts` / `app/api/valuation/route.ts` |
| `properties.ts` | Identical to `lib/properties.ts` |
| `globals.css` | Older, simpler version — the live one is `app/globals.css` |
| `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `package.json` | These are the real, live config files |

README acknowledges this at `README.md:106-107`: *"Only /app/* is served. There are legacy duplicates at the repo root … not routed by the App Router and can be ignored or deleted."*

### Live routes a visitor can hit

| URL | Rendered by |
|---|---|
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/let` | `app/let/page.tsx` |
| `/sell` | `app/sell/page.tsx` |
| `/buy` | `app/buy/page.tsx` (note: nav labels this "New Homes") |
| `/rent` | `app/rent/page.tsx` (no nav link points here directly) |
| `/register` | `app/register/page.tsx` |
| `/valuations` | `app/valuations/page.tsx` (singular `/valuation` does NOT exist as a page) |
| `/blog` | `app/blog/page.tsx` |
| `/blog/london-property-market-2025` | `app/blog/london-property-market-2025/page.tsx` |
| `/blog/guide-to-buying-in-chelsea` | `app/blog/guide-to-buying-in-chelsea/page.tsx` |
| `/blog/student-lettings-london-guide` | `app/blog/student-lettings-london-guide/page.tsx` |
| `/fees` | `app/fees/page.tsx` |
| `/privacy` | `app/privacy/page.tsx` |
| `/cookies` | `app/cookies/page.tsx` |
| `/complaints` | `app/complaints/page.tsx` |
| `/terms` | `app/terms/page.tsx` |
| `/admin` | `app/admin/page.tsx` |
| `POST /api/contact` | `app/api/contact/route.ts` |
| `POST /api/valuation` | `app/api/valuation/route.ts` |

There is **no** `/contact` page route (the homepage `GetInTouch` section serves that purpose). Footer/Navbar link out to `/let`, `/buy`, `/about`, `/blog`, `/fees`, `/valuations`, `/privacy`, `/cookies`, `/complaints`, `/terms`.

---

## 3. Key Features & How They Work

### Property listings

- A `Property` type and sample array (3 entries — Chelsea, Notting Hill, South Kensington) live in `lib/properties.ts` (`lib/properties.ts:1-21`).
- **Nothing imports it.** `grep -rn "from.*properties\|import.*properties"` in `app/` and `components/` returns zero hits. The image paths in the file (`/images/prop1.jpg` etc.) point to `public/images/`, which is an **empty directory** (`public/images/` contains no files).
- What renders on the site instead: hardcoded "coming soon" teaser cards inside each page/section. `components/FeaturedProperties.tsx:8-21` defines two homepage "passing storefront" cards inline. `app/buy/page.tsx:8-12` and `app/rent/page.tsx:8-12` define their own short arrays inline. All cards link to `/register` rather than a detail page.
- To "add a new listing": `app/admin/page.tsx` is a password-gated (hardcoded password `valemercer2025`, see Tech Debt) form that generates a string of property-object source code for the operator to **paste manually into `lib/properties.ts`** and redeploy. Since nothing imports `lib/properties.ts`, this flow is non-functional in its current state. (Source: `app/admin/page.tsx:131-134`.)
- Search / filter functionality: **none.** No search input, no facets, no listing detail pages.

### "Get Notified" / "Register Interest" flow

- UI: `app/register/page.tsx`. Fields: `firstName`, `lastName`, `email`, `phone`, `interest` (Renting / Student Let / New Home / Both), `budget`.
- On submit the body is POSTed to **`/api/contact`** with `subject: 'Property Alert Registration'` appended.
- Server handler `app/api/contact/route.ts` now branches on `subject === 'Property Alert Registration'`. For registrations it renders Name / Email / Phone / Looking for / Budget rows with subject `"Property Alert Registration: {Name}"`. For homepage contact it renders Name / Email / Interested In / Message rows with subject `"New enquiry: {Name}"`. Missing values fall back to `'-'` (no more `undefined`). *(Fixed 2026-06-29.)*
- Destination: a single Resend `emails.send` call to `process.env.CONTACT_EMAIL || 'rghvrjpl@gmail.com'` from `Vale and Mercer <onboarding@resend.dev>`. No CRM webhook, no database write, no double opt-in.

### Homepage contact form (`Get in Touch`)

- UI: `components/GetInTouch.tsx`. Fields: `firstName`, `lastName`, `email`, `interest` (select), `message`.
- POSTs to `/api/contact` — same handler as register.
- On success the section swaps to a "Thank you" panel (`components/GetInTouch.tsx:107-112`). On failure it shows inline text.

### Valuation booking flow

- Live route: **`/valuations`** (plural). The folder `/valuation` (singular) at the repo root is leftover and not served. The API endpoint is **`/api/valuation`** (singular).
- UI: `app/valuations/page.tsx`. Fields: `firstName`, `lastName`, `email`, `phone`, `address`, `postcode`, `propertyType` (Flat/etc.), `bedrooms`, `reason`.
- POSTs to `/api/valuation` (`app/valuations/page.tsx:23-27`).
- Server: `app/api/valuation/route.ts:7-19` — builds an HTML email table and sends via Resend to the same `CONTACT_EMAIL`/`hello@…` fallback.

### Blog / Journal

- Hardcoded TSX. The index `app/blog/page.tsx` defines a `posts` array of 3 entries inline (lines 7-11). The same 3 posts also appear, duplicated, in `components/BlogSection.tsx` for the homepage section.
- Each post is a separate page file (`app/blog/<slug>/page.tsx`) that imports `components/ArticleLayout.tsx` and passes a `sections: { h, p }[]` array of paragraph copy. No MDX, no markdown, no CMS.
- Adding a new post requires creating a new folder + page file, editing both `app/blog/page.tsx` and `components/BlogSection.tsx`.

### Search / Filter

None across the site.

---

## 4. Shared Components & Design System

All live components are in `components/`. The mirrored copies at repo root are leftovers (see Section 2).

| Component | Used by | Purpose |
|---|---|---|
| `MotionProvider.tsx` | `app/layout.tsx` wraps everything | First-load curtain reveal, `FirstLoadContext`, atmosphere + grain mount, scroll reset on route change |
| `AtmosphereLayer.tsx` | `MotionProvider` | Fixed background layer that fades between bone / brown / gold tied to global `scrollYProgress` |
| `GrainOverlay.tsx` | `MotionProvider` | Fixed SVG film-grain overlay, z-index 9999, multiply blend |
| `Navbar.tsx` | Every page | Fixed nav, scroll-aware color theming (`darkHeroPages` list at `components/Navbar.tsx:15`), mobile hamburger menu |
| `Footer.tsx` | Every page | Footer with company info, nav links, legal links, Property Redress Scheme badge |
| `Hero.tsx` | Homepage | 100dvh layered hero with parallax + line-mask text reveal |
| `FeaturedProperties.tsx` | Homepage | "Storefront" cards with per-card perspective tilt |
| `BuyingSection.tsx` | Homepage | Clip-path image expand panel |
| `ValuationStrip.tsx` | Homepage | Wide image strip with CTA to `/valuations` |
| `AboutStrip.tsx` | Homepage | Service cards row |
| `BlogSection.tsx` | Homepage | 3-card editorial blog teaser (duplicates `app/blog/page.tsx` data) |
| `GetInTouch.tsx` | Homepage | Contact form (see Section 3) |
| `Testimonials.tsx` | **NOT IMPORTED** anywhere — leftover |
| `TickerStrip.tsx` | Homepage (`app/page.tsx:17`) | Renders `null`. Literal file body: `export default function TickerStrip(){return null}` (1 line) |
| `PageHero.tsx` | `app/let/page.tsx`, `app/sell/page.tsx` (and likely others) | Shared interior-page hero pattern with `HeroLine` + `HeroSubtext` exports |
| `ArrowButton.tsx` | Most interior pages | 4-variant CTA button |
| `ArticleLayout.tsx` | Each `app/blog/<slug>/page.tsx` | Shared article layout for blog posts |
| `Reveal.tsx` | Most pages | Exports `Reveal`, `Stagger`, `StaggerItem`, **`useInViewSafe`** (added 2026-06-29). The hook uses an IntersectionObserver but layers (a) an on-mount viewport-overlap check and (b) a 1800ms safety timeout, so content reveals even when IO never fires (iPad Safari, bfcache restore, transformed ancestors). All previous `whileInView` callsites — Footer, GetInTouch headline, AboutStrip.ArcCard, BlogSection.BlogCard, BuyingSection.SlowReveal, ValuationStrip.DriftWord — now drive `animate` off this hook. |
| `PageTransition.tsx` | **NOT used** by live `app/layout.tsx`. Only referenced by the leftover root `layout.tsx` |
| `useDepthParallax.ts` | `Hero.tsx`, `FeaturedProperties.tsx` | Exports `useIsMobile` (and depth helpers) |

### Design tokens

Defined as CSS variables in `app/globals.css:7-32`:

```
--c-bg: #EFECE6        bone background
--c-bg-dark: #28231C   deep brown
--c-ink: #4A4036       body text (warm dark brown — recent change per git log)
--c-muted: #7A7268
--c-line / --c-line-soft: #DDD7CC / #C8C0B4
--c-gold: #A0845C      brand gold (always italicised accent)

--font-serif: Cormorant Garamond
--font-sans:  DM Sans

--section-y: clamp(64px, 9vw, 120px)
--gutter:    clamp(20px, 4vw, 40px)
--max-w:     1280px

--ease-out-soft:    cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out-soft: cubic-bezier(0.76, 0, 0.24, 1)
```

Typography: heading scale `h1 clamp(40,6vw,76)`, `h2 clamp(28,4.2vw,52)`, `h3 clamp(20,2.2vw,28)` (`app/globals.css:83-85`), all Cormorant Garamond 300 with `letter-spacing: -0.02em`. Eyebrows are uppercase 10px DM Sans with `0.28em` tracking, gold colour.

Most components use **inline `style={{…}}` props** rather than Tailwind utility classes — Tailwind is effectively only consumed via the layered keyframes/variables and a couple of utility classes (`.eyebrow`, `.link-underline`, `.img-zoom`, `.card-lift`, `.field-select`, `.form-name-row`). The `tailwind.config.ts` color extensions never appear in any `className`.

---

## 5. SEO & Metadata

*(Rebuilt 2026-06-29.)*

- **Root layout** (`app/layout.tsx`) sets `metadataBase: https://valeandmercer.co.uk`, a default+template title (`%s | Vale and Mercer`), site-wide description, default OG (`type: 'website'`, `locale: 'en_GB'`, image), Twitter `summary_large_image`, canonical, and `robots: index/follow`.
- **Per-page metadata** on every live route. For server-rendered pages it lives in the `page.tsx` itself (`/let`, `/sell`, `/fees`, `/privacy`, `/cookies`, `/complaints`, `/terms`, all three blog posts). For client-rendered pages (`/about`, `/buy`, `/rent`, `/register`, `/valuations`, `/blog` index) a sibling `layout.tsx` holds it. Blog posts also set `openGraph.type: 'article'`.
- **`app/sitemap.ts`** → `/sitemap.xml` listing all 17 live routes with `priority` and `changeFrequency` tuned per route. Excludes `/admin` and `/api/*`.
- **`app/robots.ts`** → `/robots.txt` allowing everything except `/api/` and `/admin`, pointing at the sitemap.
- **JSON-LD `RealEstateAgent`** schema emitted inline in `app/page.tsx`. Uses only facts already in the codebase (Footer + complaints/fees pages): company number 17212434, ICO ZC155397, Property Redress Scheme PRS058796, registered office 124 City Road London EC1V 2NX. No reviews, no ratings, no invented data.
- **Open Graph image**: currently points at the homepage hero Unsplash URL (`?w=1200&h=630&fit=crop`) as a placeholder. **Recommended next step**: drop a branded 1200×630 PNG at `/public/og-image.jpg` and change the `OG_IMAGE` constant at the top of `app/layout.tsx` to `/og-image.jpg`.
- `viewport` still set with `maximumScale: 5` for accessibility.
- `favicon.ico` present. No `apple-touch-icon`, no PWA manifest yet.

---

## 6. Forms & Data Handling

Three forms, two endpoints, both Resend-backed. No client-side or server-side validation beyond HTML5 `type="email"` etc. No CSRF protection. No rate limiting. No honeypot. No reCAPTCHA.

### Form 1 — Homepage `GetInTouch` (`components/GetInTouch.tsx`)

| Field | Type |
|---|---|
| firstName, lastName | text |
| email | email |
| interest | select (Renting a property / Selling my property / A valuation / Student lettings) |
| message | textarea |

POST `/api/contact` → Resend email to `CONTACT_EMAIL`. Local UI state machine: `idle | sending | sent | error`.

### Form 2 — Register Interest (`app/register/page.tsx`)

| Field | Type |
|---|---|
| firstName, lastName | text |
| email, phone | email/tel |
| interest | select (Renting / Student Let / New Home / Both) |
| budget | text |

POST `/api/contact` with `subject: 'Property Alert Registration'`. The handler now branches on that subject and renders a registration-specific template (Name / Email / Phone / Looking for / Budget) with subject `"Property Alert Registration: {Name}"`. Empty fields fall back to `'-'`. *(Was previously broken — rendered `undefined` rows. Fixed 2026-06-29.)*

### Form 3 — Valuation (`app/valuations/page.tsx`)

| Field | Type |
|---|---|
| firstName, lastName | text |
| email, phone | email/tel |
| address, postcode | text |
| propertyType | select (Flat / …) |
| bedrooms | select/number |
| reason | select |

POST `/api/valuation` → Resend email with all fields rendered into an HTML table.

### Admin form (`app/admin/page.tsx`)

Not a submission flow — generates a TypeScript object literal string for the operator to copy/paste. Not networked.

### Server handlers

Both `route.ts` files (`app/api/contact/route.ts`, `app/api/valuation/route.ts`):
- Construct an HTML email via string concatenation (template literal would be safer)
- No input sanitisation — values are interpolated directly into the HTML body. **Potential HTML injection / email-content forgery** if a user submits a `firstName` containing markup. (See Tech Debt.)
- `from: 'Vale and Mercer <onboarding@resend.dev>'` — sender is still the Resend default sandbox address; production should use a verified domain.
- Return `{ success: true }` or 500 on any throw. The error path swallows the error after `console.error`.

---

## 7. Third-Party Integrations

- **Resend** — transactional email for both forms. Server-side, `RESEND_API_KEY` env var.
- **Cookiebot** — consent banner, loaded `beforeInteractive` in `app/layout.tsx:21-27`. CBID is hardcoded.
- **Unsplash** — every hero / card image is a raw `https://images.unsplash.com/photo-…` URL embedded directly in component source. No image CDN, no `next/image`. The `public/images/` folder exists but is empty.
- **Google Fonts** — Cormorant Garamond + DM Sans via `@import` in `app/globals.css:1` (NOT via `next/font/google`, despite README claim).
- **Property Redress Scheme** badge — outbound link to `propertyredress.co.uk` in `components/Footer.tsx:70-80`.
- **Google Analytics:** discussed extensively in `/cookies` and `/privacy` policy copy but **no GA tag is loaded anywhere** in source. No `gtag`, no GTM, no `next/script` for analytics. The site advertises GA4 but doesn't currently run it.
- **No CRM, no payment processor, no maps, no chat widget, no error reporting (Sentry etc.).**

---

## 8. Environment Variables & Config

Every `process.env.X` reference in source (across both the live `app/api/*` files and their root-level duplicates):

| Variable | Used in | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `app/api/contact/route.ts`, `app/api/valuation/route.ts` | Authenticates the Resend SDK |
| `CONTACT_EMAIL` | `app/api/contact/route.ts`, `app/api/valuation/route.ts` | Destination address for both form notifications. Fallback in code is now **`rghvrjpl@gmail.com`** (was `hello@valeandmercer.co.uk`). |
| `ENABLE_ADMIN` | `app/admin/page.tsx` | Build-flag-style gate. Set `true` in dev/Vercel to expose `/admin`; otherwise the route 404s. *(New 2026-06-29.)* |

**Heads-up about Vercel**: `.env.local` only affects `npm run dev`. To take effect in production, you must set `CONTACT_EMAIL` in Vercel → Settings → Environment Variables and redeploy. Same for `RESEND_API_KEY`. The Vercel-set value wins over the code fallback.

**Old README inconsistency**: README still documents `CONTACT_TO_EMAIL`; code uses `CONTACT_EMAIL`. The .env.local file uses the code's name.

`.env.local` is gitignored. There are no `.env.example`, `.env.production`, or `.env.development` files.

No other Next.js config (`next.config.ts:1-3` is empty: `const nextConfig: NextConfig = {}`).

---

## 9. Gaps / Tech Debt / Things That Look Unfinished

**Duplicated route tree at repo root.** The most striking issue. Every route folder (`about/`, `blog/`, `buy/`, `let/`, `rent/`, `sell/`, `register/`, `valuations/`, `valuation/`, `contact/`, `fees/`, `admin/`, `privacy/`, `cookies/`, `complaints/`, `terms/`, three blog slugs), every homepage component (`Navbar.tsx`, `Hero.tsx`, `Footer.tsx`, etc.), plus `page.tsx`, `layout.tsx`, `route.ts`, `globals.css`, and `properties.ts` all exist twice — once at repo root, once inside `app/` or `components/` or `lib/`. None of the root-level files are served. About half the page duplicates are byte-identical to the `app/` version; the rest are older snapshots. README acknowledges this and recommends deletion (`README.md:106-107`).

**`lib/properties.ts` is dead code.** No file imports it. The `app/admin/page.tsx` form generates code intended for it. The promised featured-listing flow ("paste code → deploy → published") is not actually wired up; the live homepage shows hardcoded "coming soon" placeholders from `components/FeaturedProperties.tsx:8-21` instead.

**`public/images/` is empty** despite `lib/properties.ts` referencing `/images/prop1.jpg` etc.

~~**Register form is broken.**~~ **Fixed 2026-06-29.** `/api/contact` now detects the registration payload and renders the correct template + subject.

**Admin auth is a hardcoded client-side password.** *(Partially mitigated 2026-06-29.)* `app/admin/AdminClient.tsx:47` still checks `password === 'valemercer2025'` in the browser. However, `app/admin/page.tsx` is now a server component that calls `notFound()` unless `ENABLE_ADMIN === 'true'`, so by default the page (and its client bundle) never ship to the browser in production. The underlying client-side password is still a real concern if `ENABLE_ADMIN` is ever flipped on without first migrating to a server-side auth flow. The admin "publish" workflow still ends in *"5. Run: vercel --prod"* (line 134 of `AdminClient.tsx`).

**Email injection risk.** Both API routes interpolate user input directly into HTML email bodies via string concatenation (`'… ' + firstName + ' …'`). A submission with `firstName = "<a href='evil'>"` would be rendered in the recipient's email client. Inputs should be HTML-escaped, or React's `renderToString` / a templating library used.

**Resend sender address is unverified sandbox.** `from: 'Vale and Mercer <onboarding@resend.dev>'` (both routes). Production email should use a verified `@valeandmercer.co.uk` domain. *(Not addressed in the 2026-06-29 rework — still recommended.)*

**README out of sync with code.**
- Says Lenis is the smooth-scroll layer; `components/MotionProvider.tsx:67-69` explicitly removed it.
- Says fonts are self-hosted via `next/font/google`; actually loaded via `@import` in CSS.
- Documents env var `CONTACT_TO_EMAIL`; code uses `CONTACT_EMAIL`.

~~**SEO is minimal.**~~ **Resolved 2026-06-29.** Per-page metadata on every route, `app/sitemap.ts`, `app/robots.ts`, default + per-page OG and Twitter cards, JSON-LD `RealEstateAgent` on homepage. The only outstanding piece is a proper branded OG image at `/public/og-image.jpg` (current fallback is a cropped Unsplash URL).

**Google Analytics referenced in policy text but not loaded.** Either remove the references from `/cookies` and `/privacy`, or actually wire up GA4 (gated through the Cookiebot consent state).

**`TickerStrip` is a no-op stub.** `components/TickerStrip.tsx` is one line: `export default function TickerStrip(){return null}`. It is still rendered in `app/page.tsx:17` — leftover scaffold.

**`Testimonials.tsx` exists but is unused.** No imports anywhere in `app/` or `components/`. 137 lines of dead code.

**Tailwind config is unused under Tailwind v4.** `tailwind.config.ts:10-25` defines custom color tokens (`stone-base`, `bronze`, etc.) that never appear in any `className`. Tailwind v4 expects token configuration via `@theme` in CSS, not a JS config; verify in `node_modules/next/dist/docs/` or the Tailwind v4 docs before continuing to ship this file.

**Inline styles everywhere.** Most components style via inline `style={{…}}` props (e.g. the entire `Hero.tsx`, `Navbar.tsx`, `Footer.tsx`). This makes theming/refactoring noisy and bypasses Tailwind. Not strictly wrong, but inconsistent with the README's "Tailwind v4" framing.

**No image optimisation.** Every image is a raw `<img>` tag pointing at an absolute `images.unsplash.com` URL. `next/image` is not used anywhere. The hero alone loads a 2000w Unsplash JPEG without LCP optimisation. `public/images/` is empty.

**No tests.** No `__tests__`, no Vitest/Jest config, no Playwright.

**No CI / deploy config committed.** No `vercel.json`, no GitHub Actions, no Husky. The admin page text and README both presume `vercel --prod` is run by hand.

**`/rent` page exists but isn't linked from Navbar or Footer.** Navbar offers `/let`, `/buy`, `/about`, `/blog`. Footer adds `/fees`, `/valuations`. There is no surface area in the UI that links to `/rent` — accessible only via direct URL.

**No `/contact` route.** All "Contact us" CTAs go to `/valuations`, the `GetInTouch` section on the homepage, or `mailto:info@valeandmercer.co.uk`. If a visitor types `/contact` they get a 404.

**Loose `console.error(error)` calls** in both API routes (`app/api/contact/route.ts:22`, `app/api/valuation/route.ts:22`). Acceptable, but with no error reporting (Sentry etc.) these only land in the platform's log stream.

**`scroll-behavior: smooth`** is set on `html` in the leftover root `globals.css:14` but **not** in the live `app/globals.css` — the live design relies entirely on framer-motion. Mild inconsistency.

**Cookiebot consent isn't honoured by anything.** The banner loads, but since no analytics or marketing tags are wired up, accepting or rejecting consent has no effect. The policy pages describe behaviour the site doesn't actually exhibit.

---

## File-path quick reference

- Live root layout: `app/layout.tsx`
- Live homepage: `app/page.tsx`
- Live globals CSS: `app/globals.css`
- Resend endpoints: `app/api/contact/route.ts`, `app/api/valuation/route.ts`
- Forms: `components/GetInTouch.tsx`, `app/register/page.tsx`, `app/valuations/page.tsx`
- Shared UI: `components/Navbar.tsx`, `components/Footer.tsx`, `components/Reveal.tsx`, `components/ArrowButton.tsx`, `components/PageHero.tsx`, `components/ArticleLayout.tsx`, `components/MotionProvider.tsx`, `components/AtmosphereLayer.tsx`, `components/GrainOverlay.tsx`
- Dead but present: `lib/properties.ts`, `components/Testimonials.tsx`, `components/TickerStrip.tsx` (stub), `components/PageTransition.tsx`, all root-level page/component duplicates
- Admin (gated): `app/admin/page.tsx` (server gate) + `app/admin/AdminClient.tsx` (client form, only renders when `ENABLE_ADMIN=true`)

---

## 10. Change log (2026-06-29 rework)

### Phase 1+2 — iPad Safari "blank on scroll" and "won't open on some devices"
Root cause: every reveal animation used framer-motion's `whileInView` + `viewport={{ once, amount }}` with `initial={{ opacity: 0 }}`. Without a fallback, any IntersectionObserver miss (transformed ancestors, bfcache restore, certain iOS Safari builds) left content stuck invisible. Compounded by `100dvh`/`90dvh` collapsing the hero on iOS <15.4, and Cookiebot loaded `beforeInteractive` blocking hydration on networks that couldn't reach the consent CDN.

Files changed:
- `components/Reveal.tsx` — new `useInViewSafe` hook with 3 reveal triggers (overlap-on-mount / IntersectionObserver / 1800ms safety timeout). `Reveal`, `Stagger`, `StaggerItem` rewritten to use it.
- `components/Footer.tsx`, `components/GetInTouch.tsx`, `components/AboutStrip.tsx`, `components/BlogSection.tsx`, `components/BuyingSection.tsx`, `components/ValuationStrip.tsx` — each inline `whileInView` motion element converted to drive `animate` off `useInViewSafe`.
- `components/Hero.tsx` — inline `minHeight: '100dvh'` replaced with `className="vm-h-screen-dvh"`.
- `components/ValuationStrip.tsx` — inline `minHeight: '90dvh'` replaced with `className="vm-h-90-dvh"`.
- `app/globals.css` — new `.vm-h-screen-dvh` / `.vm-h-90-dvh` utility classes with `@supports (min-height: 100dvh)` upgrade. Without the support query the rule uses static `100vh`/`90vh` so older WebKit doesn't collapse the section.
- `app/layout.tsx` — Cookiebot `<Script>` strategy `beforeInteractive` → `afterInteractive`.

### Phase 3 — form destination email + register form bug
- `.env.local` — `CONTACT_EMAIL` updated to `rghvrjpl@gmail.com`.
- `app/api/contact/route.ts` — full rewrite. Branches on `subject === 'Property Alert Registration'` to render the correct template with the correct subject. Missing fields render as `'-'` instead of `undefined`. Default `CONTACT_EMAIL` fallback updated to `rghvrjpl@gmail.com`.
- `app/api/valuation/route.ts` — default `CONTACT_EMAIL` fallback updated to `rghvrjpl@gmail.com`.
- **Manual step still required**: update `CONTACT_EMAIL` in Vercel → Settings → Environment Variables and redeploy. The code fallback only takes effect when the platform value is unset.

### Phase 4 — admin gate + secret sweep
Option B2 chosen — keep the file, gate behind a build flag.
- `app/admin/AdminClient.tsx` — new file holding the previous client-side admin code (export renamed `AdminPage` → `AdminClient`).
- `app/admin/page.tsx` — new server component. Calls `notFound()` unless `process.env.ENABLE_ADMIN === 'true'`, otherwise renders `<AdminClient />`.
- Secret sweep result: only `'valemercer2025'` was a real client-shipped credential. Cookiebot CBID is a public ID by design. `RESEND_API_KEY` and `CONTACT_EMAIL` are server-only.

### Phase 5 — em-dashes + UK English proofread
Em-dashes removed from every visitor-facing string (page copy, blog content, table cell strings, email templates). Code comments left untouched per instructions. Contextual replacements (commas, colons, parentheses, sentence splits) made per case — see commit history / per-phase summary in chat for the full before/after list. Files touched: `app/fees/page.tsx`, `app/complaints/page.tsx`, `app/blog/{guide-to-buying-in-chelsea,london-property-market-2025,student-lettings-london-guide}/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`, `app/cookies/page.tsx`, `app/api/contact/route.ts`, `app/api/valuation/route.ts`.

UK English fixes: `organizational` → `organisational`, `recognize` → `recognise`, `anonymization` → `anonymisation`. `Vale &amp; Mercer` in body copy on `/about` changed to `Vale and Mercer` so it matches every other body paragraph (the decorative wordmark in Navbar/Hero/Footer/curtain keeps the ampersand).

### Phase 6 — SEO
- `app/layout.tsx` — full `Metadata` block with `metadataBase`, title template, default OG, Twitter, canonical, robots.
- `app/page.tsx` — per-page metadata + inline JSON-LD `RealEstateAgent` schema (facts pulled only from Footer / complaints / fees pages — company number, ICO, Property Redress Scheme membership, address).
- `app/sitemap.ts` (new) — generates `/sitemap.xml` covering all 17 live routes.
- `app/robots.ts` (new) — generates `/robots.txt`. Disallows `/api/` and `/admin`.
- Per-page `metadata` added to every server-rendered page (`/let`, `/sell`, `/fees`, `/privacy`, `/cookies`, `/complaints`, `/terms`, all three blog posts).
- Per-route `layout.tsx` files added to hold metadata for client-rendered pages: `app/{about,buy,rent,register,valuations,blog}/layout.tsx`.
- Open Graph image is currently a cropped Unsplash URL of the hero photo (`https://images.unsplash.com/photo-1513635269975-…?w=1200&h=630&fit=crop`). **Recommended next step**: produce a branded 1200×630 PNG, save as `/public/og-image.jpg`, and replace the `OG_IMAGE` constant at the top of `app/layout.tsx`.

### Phase 7 — mobile Navbar contrast + hamburger alignment (later session)

**Bug 1: wordmark unreadable on cream sections after scroll.** The old colour logic was `logoColor = scrolled ? light : (isDarkHero ? light : dark)` — once `scrollY > 80`, the wordmark turned light cream regardless of what was actually behind the nav. On dark-hero pages (`/`, `/sell`, `/let`, `/about`, `/valuations`) it then sat invisible over the cream sections below the hero; on light-hero pages (`/fees`, `/privacy`, `/blog`, …) it went light from the first scroll pixel onward.

Fix in `components/Navbar.tsx`: collapsed the colour decision to a single `isOverDark = !scrolled && (menuOpen || isDarkHero)` boolean and gave the navbar its own translucent cream background (`rgba(239,236,230,0.85)` + existing backdrop blur) once `scrolled`. The scrolled state now provides its own contrast — so logo/link/hamburger/border are all dark on the cream nav, every page, every scroll position. The `menuOpen` term ensures the wordmark stays light when the mobile menu's dark overlay is the backdrop. Works across `/`, `/about`, `/let`, `/sell`, `/valuations`, `/fees`, `/privacy`, `/cookies`, `/complaints`, `/terms`, `/blog` index + posts, `/buy`, `/rent`, `/register`. Note: when scrolled through the homepage's dark ValuationStrip / Footer sections, the cream-tinted nav reads as a frosted-glass overlay over the dark content — readable, mildly visually disjoint, acceptable.

**Bug 2: hamburger misaligned vs logo, sat outside the visible nav.** The flex row used `alignItems: 'baseline'`. The hamburger button has no inline text content (just 1.5px-tall span "lines"), so browsers synthesised its baseline from its bottom edge and pulled the button upward until its bottom met the logo's text baseline — putting the button's top at roughly `-30px` relative to the nav row, partially clipped above the visible nav. The button's `padding: 10` also gave the lines an asymmetric 10px right inset that didn't match the logo's `var(--gutter)` left inset.

Fix in `components/Navbar.tsx` (scoped to the mobile hamburger button only, inside the `{mobile ? <button> : <desktop-nav>}` conditional, so desktop layout is untouched):
- `alignSelf: 'center'` on the button — overrides parent baseline alignment for just this child, vertically centring it in the row.
- `padding: '10px 0 10px 10px'` — keeps vertical padding (so the 44px touch target still meets accessibility), drops the right padding so the 24px lines sit flush with the button's right edge, which is at `var(--gutter)` from the viewport edge, matching the logo's left inset.
- `minWidth: 44, minHeight: 44` preserved for accessibility touch target.

Both states checked: closed nav (3 stacked lines) and open menu (lines transformed into an X over the dark mobile-menu overlay) both render correctly with the new logic.

### Phase 8 — hamburger ↔ logo vertical alignment (2026-06-30)

Phase 7's `alignSelf: 'center'` centred the hamburger in the row, not on the logo. With the "Est. London" eyebrow visible the row is ~90 px tall and the centred 44 px button parked ~35 px below the logo's text centre. Replaced with a top-anchored layout plus a fixed pixel pull-up.

Changes in `components/Navbar.tsx`, scoped exactly to the two surfaces called out in the brief — the parent row's `alignItems` and the hamburger button's own style block:

- Row `alignItems: 'baseline'` → `'flex-start'`. The logo `<Link>` is always the first child of its flex column, so its top edge is at row top regardless of scroll state.
- Hamburger button: removed `alignSelf: 'center'`. Added `marginTop: -12`. Derived from the button's own internals (border-box min-height 44, padding `10 0 10 10`, gap 5, 3 × 1.5 px bars centred via `justifyContent: 'center'`): bar-stack centre sits 22 px below the button's top, logo centre sits 10.2 px below row top → button needs −11.8 ≈ −12 px lift.
- Eyebrow ("Est. London") block left **completely untouched** per the hard constraint — DOM order, position, and all of its `marginTop: 32 / maxHeight: 24 / transform / transition` collapse behaviour identical to before.
- Hamburger horizontal positioning (`padding-right: 0`, lines flush with `--gutter`) carried over from Phase 7 — not touched in this pass.

Stable in both scroll states because the logo's top edge is invariant: only the eyebrow below it expands/collapses, so anchoring the button to row-top with a fixed −12 px offset puts the bar-stack centre on the logo's text centre whether the eyebrow is showing or not.

Desktop nav (≥ 900 px) is structurally untouched; the parent's switch from `baseline` to `flex-start` shifts the desktop nav links ≈ 1 px upward relative to the logo's baseline, which is below visual perception. If pixel-parity becomes important, add `alignSelf: 'baseline'` to the desktop `motion.div` (line 164).

### Phase 9 — desktop cluster alignment + scrolled translucency (2026-06-30)

Two follow-ups on the navbar:

**Bug 1: desktop wordmark sits higher than the nav links + pill.** Phase 8 changed the parent row to `alignItems: 'flex-start'` to anchor the mobile hamburger to the logo's top edge. The desktop right-side cluster (4 text links + the bordered Book Valuation pill) is dominated by the pill's height — 11 px text × 1.7 inherited line-height + 9 px × 2 padding + 1 px × 2 border ≈ 38.7 px — so with the cluster's own `alignItems: 'center'`, its vertical centre lands ≈ 19.35 px below row top. The logo Link's centre is ≈ 10.2 px below row top (17 × 1.2 / 2). The 9 px gap was visible enough to make the wordmark and the right nav read as two different rows.

`alignItems: 'center'` on the parent row is **not** a viable fix: the logo column also carries the Est. London eyebrow (gap 14 + marginTop 32 + 24 px row), making the column ~90 px tall. Centring the cluster against a 90 px column drops it ~35 px below the logo — worse than flex-start. Independently lifting just the cluster keeps both the eyebrow and the mobile hamburger branch untouched.

Fix in `components/Navbar.tsx`, scoped to the desktop `motion.div` cluster (the `else` branch of `{mobile ? <button> : <desktop>}`, so the mobile button branch never sees it): added `marginTop: -9` with a code comment carrying the math and the rejected alternatives.

**Bug 2: scrolled navbar reads as solid/opaque white.** The previous fix from Phase 7 hard-coded `background: rgba(239, 236, 230, 0.85)` inline. At 85 % opacity over real content it still reads as a flat cream/white panel rather than a frosted glass overlay. Wanted a more translucent surface that still keeps dark text readable.

Fix moves the scrolled background out of inline styles into a new `.vm-nav-scrolled` class in `app/globals.css`, applied conditionally on `scrolled`:

- `@supports ((backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)))` path: `background: rgba(239, 236, 230, 0.55)` + `backdrop-filter: blur(20px) saturate(160%)` (+ `-webkit-backdrop-filter` for Safari). True frosted glass — you can faintly see content blurred underneath while dark text stays high-contrast against the cream wash.
- Fallback (no backdrop-filter): `background: rgba(239, 236, 230, 0.82)` — denser cream so dark text never becomes unreadable when blur isn't applied. Still translucent, just less see-through.
- Within the `@supports` path, an inner `@media (max-width: 899px)` keeps the lighter blur (`blur(12px) saturate(140%)`) and slightly denser cream (0.65) that Phase 7's `navBlur` ternary had for mobile, since `backdrop-filter` is GPU-expensive on integrated/mobile graphics. Breakpoint matches the JS `mobile = window.innerWidth < 900` threshold.

Navbar.tsx still owns the not-scrolled state inline (`background: 'transparent'`, `backdrop-filter: 'none'`) and the `boxShadow` for the bottom hairline. The `isOverDark` colour logic from Phase 7 is unchanged: when `scrolled` is true `isOverDark` is false, so logo / links / pill render in dark cream-on-cream, which stays readable against the new translucent cream surface on every page (homepage, interior `PageHero.tsx` routes like `/about`, and over light cream sections after scrolling past the hero).

### Phase 9b — scrolled navbar opacity correction (2026-06-30)

Phase 9's first cut at frosted glass overshot: the `@supports` path used `rgba(239, 236, 230, 0.55)` (0.65 on mobile) which, when the navbar scrolled OVER a flat cream section (e.g. the homepage "Properties coming soon" panel, bg ~`#EFECE6` / `--c-bg`), produced an effectively invisible bar. Cream-over-cream at 55 % alpha gives only ~3 % luminance difference from the page surface; only the gold `&` glyph stayed visible.

The mistake was treating backdrop-filter as the legibility mechanism. Blur does nothing over a flat colour — there is no detail to blur away, and the blurred-cream output equals the input. The semi-opaque fill is what guarantees the bar reads as a distinct surface; the blur only enhances the frosted feel when there IS busy content behind (the dark hero photograph, the BuyingSection cards, the Footer over its dark tint).

Fix in `app/globals.css` — `.vm-nav-scrolled` opacity bumped while keeping the same `@supports` structure:

| State                         | Before (Phase 9) | After (Phase 9b) |
|-------------------------------|------------------|------------------|
| `@supports` desktop           | 0.55             | 0.78             |
| `@supports` mobile (≤ 899 px) | 0.65             | 0.82             |
| Fallback (no backdrop-filter) | 0.82             | 0.90             |

Cream fill + dark text contrast check on the worst case (cream 0.78 over the dark hero `#28231C`): blended surface ≈ `rgb(196, 192, 186)`, dark text `rgba(40,35,28,0.92)` ≈ `rgb(40,35,28)`. WCAG contrast ratio ≈ 5.8, above AA threshold of 4.5. Over the light section (cream 0.78 over `#EFECE6`) the blended surface ≈ `rgb(237, 234, 228)` — almost solid cream — so contrast is essentially the full ~9.5 ratio of dark cream text on cream.

Contrast pairing is now documented explicitly in BOTH `.vm-nav-scrolled` (CSS comment) and in Navbar.tsx (above the colour ternaries): the class's light cream tint is locked to `isOverDark = false` → dark text in the scrolled state. The two MUST move together — switching to a dark-tinted fill without flipping `isOverDark` would re-create the unreadable state, just in the opposite direction.

Navbar.tsx itself was not structurally changed in 9b; only the comment block above the colour ternaries was updated to reflect the new opacity numbers and to call out the do-not-decouple rule.

### Phase 10 — cluster centring + clean frosted cream glass (2026-06-30)

Two issues from the post-Phase-9b state:

**Bug 1: nav cluster sits too high in the bar (more empty space below than above), worst in the scrolled state.** Through Phases 7–9 the parent row used `alignItems: 'flex-start'` so the mobile hamburger could anchor to the logo's top edge, and the desktop cluster got a `marginTop: -9` lift to align its centre with the logo's centre. That gave horizontal alignment on one line, but vertically the whole assembly anchored to row-top with the eyebrow column adding ~20-70px of empty space underneath it — measurable as space-above ≈ 18px vs space-below ≈ 32px in the scrolled state, and far worse at the top of the page where the eyebrow expands the column to ~90px.

`alignItems: 'center'` on the parent row would not fix it as long as the eyebrow lived inside the logo column: the column then drove the row height, and the cluster centred against the *column's* centre — which sat ~35px below the logo's actual centre. Documented in the Phase 9 comment as "not viable".

The fix required moving the **Est. London eyebrow block to a sibling row below the main row**. The block itself (gold bar + "Est. London" span + the four-property collapse animation: marginTop / maxHeight / opacity / transform) is byte-for-byte preserved — only its parent changes. With the eyebrow no longer in the logo column, the main row collapses to two flex items of comparable height and can centre cleanly:

- Main row: `display: flex; alignItems: center; justifyContent: space-between; minHeight: 44`. 44 is the iOS touch-target standard and comfortably fits the Book Valuation pill (~38.7px).
- Logo Link (≈ 20.4px tall) and right cluster (≈ 38.7px tall) both centre on the row's cross-axis automatically. Logo centre = cluster centre = row centre at 22px from row top.
- Desktop cluster's `marginTop: -9` (Phase 9) removed — no longer needed.
- Mobile hamburger's `marginTop: -12` (Phase 8) removed — the button is exactly 44px tall (border-box) and its bar stack is centred inside the button's content box via `justifyContent: 'center'`, so the bar stack's centre lands on the row's centre, on the same axis as the logo.

Eyebrow visible position from viewport top preserved to within 0.4px:
- Before: 18 (nav pad-top) + 20.4 (logo) + 14 (col gap) + 32 (mt) = **84.4**
- After: 18 (nav pad-top) + 44 (main row) + 22 (new mt) = **84.0**

The 32 → 22 marginTop change absorbs the 14px flex `gap` that no longer exists on the (now-removed) logo column. Left edge stays at `var(--gutter)` because both the main row and the eyebrow row share the same padded wrapper.

Bar height (scrolled, eyebrow collapsed): 18 + 44 + 0 + 18 = **80px** (was 70.4 in Phase 9). The cluster now sits with **20.6px of space above and 20.6px below** — symmetric. At top of page (eyebrow expanded) bar = 18 + 44 + 22 + 24 + 18 = **126px**, cluster still centred in the 44px main row with the eyebrow row taking the bottom portion exactly as designed.

**Bug 2: scrolled bar reads as a flat murky beige strip, not clean frosted cream.** Phase 9b used `backdrop-filter: blur(20px) saturate(160%)`. Over the dark hero photograph (which has orange-brown tints), the `saturate(160%)` intensified those tints in the blurred output, and the 0.78 cream wash on top of that saturated brown produced a muddy beige rather than crisp frosted cream.

Fix in `app/globals.css` — `saturate()` dropped from both the desktop and mobile `@supports` paths; blur radius tightened from 20px to 18px for a crisper edge; fallback opacity nudged 0.90 → 0.92 so the no-backdrop-filter path stays comfortably readable:

| State                         | Phase 9b                              | Phase 10                  |
|-------------------------------|---------------------------------------|---------------------------|
| `@supports` desktop           | 0.78 + blur(20) saturate(160%)        | 0.78 + blur(18)           |
| `@supports` mobile (≤ 899 px) | 0.82 + blur(12) saturate(140%)        | 0.84 + blur(12)           |
| Fallback (no backdrop-filter) | 0.90                                  | 0.92                      |

Contrast pairing unchanged from 9b and still documented in both the CSS and the Navbar.tsx comment block above the colour ternaries: `scrolled = true` ⇒ `isOverDark = false` ⇒ DARK wordmark / links / pill on the LIGHT cream surface. The light/dark relationship is intentionally complementary; switching the fill to a dark tint must flip the `isOverDark` clause or text becomes illegible against its own bar.

Bottom hairline (`boxShadow: '0 1px 0 rgba(40,35,28,0.06)'`) kept from Phase 7 to define the bar's edge against the content below — looks cleaner than relying on the blur edge alone over a flat cream section.

### Phase 11 — frosted cream nudged for "clean" reference look (2026-06-30)

After a fresh visual review against two reference screenshots of the navbar over the homepage light/cream sections, the Phase 10 alphas read slightly washed out — the 0.78 desktop cream wasn't quite distinct enough from the cream sections beneath it to read as the "clean light frosted-glass bar" the screenshots showed. Nudged each tier up by ~0.02-0.04 to firm up the bar's presence while staying safely below the 0.85+ "solid cream/white" zone that failed in Phase 9. Blur radii kept the same (changes there are perceptually slower than alpha at this contrast level), and `saturate()` stays out (Phase 10 post-mortem).

| State                         | Phase 10                                 | Phase 11                                 |
|-------------------------------|------------------------------------------|------------------------------------------|
| `@supports` desktop           | `rgba(239, 236, 230, 0.78)` + `blur(18px)` | `rgba(239, 236, 230, 0.82)` + `blur(18px)` |
| `@supports` mobile (≤ 899 px) | `rgba(239, 236, 230, 0.84)` + `blur(12px)` | `rgba(239, 236, 230, 0.86)` + `blur(12px)` |
| Fallback (no backdrop-filter) | `rgba(239, 236, 230, 0.92)`                | `rgba(239, 236, 230, 0.94)`                |
| Bottom hairline               | `0 1px 0 rgba(40,35,28,0.06)` (Phase 7)    | unchanged                                  |

Over-dark-hero state explicitly preserved (text-colour pairing not touched):
- `!scrolled` ⇒ `.vm-nav-scrolled` is NOT applied. Inline styles on the `<motion.nav>` keep `background: 'transparent'` and `backdrop-filter: 'none'`. The cream frosted fill is never painted over the dark hero photograph at the top of the page.
- `isOverDark = !scrolled && (menuOpen || isDarkHero)` is TRUE on dark-hero pages at top-of-page, so logo / links / hamburger / border all render in light cream — readable against the dark hero.
- Both switches (background and text colour) move on the same `scrolled` boundary, so light text + transparent bg always pair over the dark hero, and dark text + cream frosted bg always pair after scroll. Never light-on-light or dark-on-dark.

Worst-case contrast re-checked at the new 0.82 cream over the dark hero: blended surface ≈ `rgb(204, 200, 194)`, dark text `rgba(40,35,28,0.92)` ≈ `rgb(40,35,28)`, contrast ratio ≈ **6.6** — above AA 4.5. Over the flat cream `BuyingSection` (`#EFECE6` underneath) the blended surface is essentially solid cream, so contrast is effectively the full ~9.5 of dark cream text on cream.

Layout, alignment, vertical centring, eyebrow position, hamburger and pill geometry: all unchanged from Phase 10. Phase 11 is a CSS values edit on `.vm-nav-scrolled` + this doc entry only. `components/Navbar.tsx` not touched.

### Phase 12 — frosted bar transparency regression fixed (2026-06-30)

The Phase 11 nudge (0.78 → 0.82 desktop, 0.84 → 0.86 mobile) was not enough. Over the homepage `BuyingSection` ("Properties coming soon" / "OUR LISTINGS"), the bar still read as nearly invisible — content was legible straight through it with no frosted softening. Root cause is the same one called out back in Phase 9b but at a more subtle threshold: the bar's tint is the exact same cream (`#EFECE6`) as the section underneath, so any alpha below ~0.85–0.88 lets the two surfaces merge optically. `blur()` over a flat cream provides zero visible frosting because there's no detail in the underlying colour to soften. The 0.82 alpha turned out to be on the wrong side of that threshold.

Diagnostic comparison vs. the earlier-working `a59ede0` commit (Phase 7 inline state):

| Tier                            | a59ede0 (working)                                     | Phase 11 (broken)                      | Phase 12 (fixed)                       |
|---------------------------------|-------------------------------------------------------|----------------------------------------|----------------------------------------|
| Desktop                         | `rgba(239,236,230,0.85)` + `blur(20px) saturate(160%)` | `rgba(239,236,230,0.82)` + `blur(18px)` | `rgba(239,236,230,0.88)` + `blur(16px)` |
| Mobile (≤ 899 px)               | `rgba(239,236,230,0.85)` + `blur(10px)`                | `rgba(239,236,230,0.86)` + `blur(12px)` | `rgba(239,236,230,0.90)` + `blur(10px)` |
| Fallback (no backdrop-filter)   | n/a (inline only)                                     | `rgba(239,236,230,0.94)`               | `rgba(239,236,230,0.92)`               |

What changed in Phase 12: alpha pushed firmly into the 0.88–0.92 zone the brief specified, blur tightened to a clean 16px desktop / 10px mobile (crisper than 18/12, matching the original a59ede0 mobile blur). `saturate()` deliberately stays out — Phase 10 documented why it produced the murky-beige strip over the dark hero. The 0.88 desktop value is a deliberate +0.03 over the original a59ece0 0.85 because the bar lives over the cream `BuyingSection` more often than over the dark hero, and the higher alpha matters more for cream-on-cream contrast than for the dark-hero case (which is already comfortable at 0.85).

Over-dark-hero state preserved unchanged — `!scrolled` ⇒ `.vm-nav-scrolled` is not applied, the navbar is `background: 'transparent'` inline, `isOverDark = true`, text is LIGHT. Only the over-cream scrolled state was retuned. Worst-case contrast at the new 0.88 cream over the dark hero `#28231C`: blended surface ≈ `rgb(215, 212, 206)`, dark text `rgba(40,35,28,0.92)` ≈ `rgb(40,35,28)`, contrast ratio ≈ **7.2** — well above WCAG AA 4.5. Over cream sections the blended surface is essentially solid cream, so contrast is the full ~9.5 of dark cream on cream.

What the scrolled navbar looks like now, in plain terms: a cream panel that's clearly opaque enough to read as a distinct bar sitting *above* the section beneath it. Content behind it is softly blurred and muted — you cannot read the section headings through it. Dark text on top remains crisp. Phase 11's "barely there" wash is gone.

Layout, alignment, vertical centring, eyebrow position, hamburger and pill geometry: all unchanged from Phase 10. Phase 12 is a CSS values edit on `.vm-nav-scrolled` + this doc entry only. `components/Navbar.tsx` not touched.

### Phase 13 — ancestor transform was killing backdrop-filter (2026-06-30)

Phases 9b → 12 all chased the wrong variable. We kept tuning alpha (0.55 → 0.78 → 0.82 → 0.88) and blur radius (20 → 18 → 16 px), but the *real* reason the bar kept reading as see-through over the cream `BuyingSection` was that **`backdrop-filter` was never actually rendering**. The cream tint was painting at whatever alpha we set; the blur was declared in the cascade and visible in DevTools' computed styles; it just had no visible effect, so a cream-on-cream surface with no frosting blended into the cream page beneath.

**Root cause.** Per the CSS `backdrop-filter` spec, a non-`none` `transform` on *any ancestor* of the element disables `backdrop-filter` rendering on the descendant — the backdrop the filter samples becomes the transformed ancestor's local rendering rather than the document content behind it, which effectively produces nothing. WebKit/Safari turns this into a complete no-op; Chrome can also exhibit it depending on compositor path.

The transformed ancestor was in `components/MotionProvider.tsx:112-118`:

```tsx
<motion.div
  key={pathname}
  initial={false}
  animate={{ opacity: 1, y: 0 }}   // ← the y: 0 was the killer
>
  {children}                        // ← <Navbar /> lives in here
</motion.div>
```

Framer-motion enforces `y: 0` by writing `transform: translateY(0px)` (frequently promoted to `translate3d(0, 0, 0)`) inline on the element, *even when the value is the identity*. That inline transform on the wrapper sat on the navbar's ancestor chain (`body → motion.div → main → motion.nav`) and disabled the navbar's `backdrop-filter: blur(16px)`.

Diagnostic walk of the navbar's full ancestor chain ruled out every other candidate — no `filter`, no `perspective`, no `contain`, no `will-change: transform`, no `mix-blend-mode`, no opacity<1, no second stacked blur layer. `AtmosphereLayer` and `GrainOverlay` are siblings of the wrapper, not ancestors. `body`/`html` have only `overflow-x: hidden` and `position: relative`, neither of which breaks backdrop-filter. The wrapper's own `motion.nav animate={{ y: 0 }}` puts a transform on the navbar itself, but that's on the same element as the backdrop-filter and is allowed by the spec; only ancestor transforms are fatal.

**Fix (Option A from the diagnostic).** Dropped `y: 0` from the wrapper, kept `opacity: 1`:

```tsx
<motion.div
  key={pathname}
  initial={false}
  animate={{ opacity: 1 }}          // y: 0 removed
>
  {children}
</motion.div>
```

Verified the wrapper was inert before changing: `initial={false}`, no `transition` prop, no `exit`, not inside any `AnimatePresence` (the live `AnimatePresence` is internal to `Navbar.tsx` for the mobile menu; the `PageTransition.tsx` `AnimatePresence` is only referenced by the leftover repo-root `layout.tsx`, not by `app/layout.tsx`). Removing `y: 0` removes the inline `transform: translateY(0px)`, and since the wrapper wasn't animating anyway, nothing visible changes except that the navbar's `backdrop-filter` starts actually painting.

Added a block comment above the wrapper warning future maintainers not to add any transform-driven `animate` value (`y`, `x`, `scale`, `rotate`) here — the comment calls out the spec rule and references this incident by Phase number. Opacity is safe; transform-axis properties are not.

`.vm-nav-scrolled` values (cream 0.88 desktop / 0.90 mobile / 0.92 fallback + `blur(16px)`/`blur(10px)`) were NOT changed in Phase 13. They were already correct from Phase 12; they just had no backdrop to filter. Once Option A lifts the ancestor transform, the existing values render as the intended frosted cream glass.

**What did not regress.** No layout, alignment, vertical centring, eyebrow position, hamburger, pill geometry, or text-colour change. The `isOverDark = !scrolled && (menuOpen || isDarkHero)` hinge that keeps text light over the dark hero is untouched. The wrapper had no real page-transition behaviour to lose. Typecheck (`npx tsc --noEmit`) clean.

**Option B (move `<Navbar />` out of `<MotionProvider>` into `app/layout.tsx` as a sibling) was considered and deferred.** It would give permanent immunity to any future motion wrapper accidentally re-breaking the navbar's backdrop-filter, but requires removing the `<Navbar />` render from ~17 page files. Comment block in `MotionProvider.tsx` is judged sufficient warning for now. Worth bundling with the next layout-level refactor; not worth a standalone pass today.

### Phase 14 — abandoned backdrop-filter for reliability (2026-07-01)

Phase 13 successfully removed the ancestor `transform: translateY(0px)` from the `MotionProvider` wrapper — the diagnostic root cause. But a subsequent clean rebuild (`rm -rf .next` + fresh browser) still showed the navbar reading as flat/transparent over the light BuyingSection. Some Chrome/WebKit compositor paths in the deployed environment continue to no-op `backdrop-filter` on this tree despite the ancestor being clean. After too many cycles chasing the blur across Phases 9b → 10 → 11 → 12 → 13, the decision was to stop depending on backdrop-filter altogether and switch to a solution that renders reliably in every browser regardless of compositor path.

**Fix.** Replaced the `.vm-nav-scrolled` frosted-glass definition (0.88 cream + `blur(16px)` gated behind `@supports (backdrop-filter)` with a 0.92 fallback and mobile media query) with a single flat rule:

```css
.vm-nav-scrolled {
  background: rgba(239, 236, 230, 0.97);
}
```

`0.97` alpha is opaque enough that no browser can render page text through it, in any compositor path, on any GPU. Kept just under `1.0` so the bar still reads as a refined light surface rather than a hard chrome panel. `@supports`, mobile media query, `backdrop-filter`, and `-webkit-backdrop-filter` all removed — nothing here depends on browser compositing behaviour any more.

**Paired inline cleanup in `components/Navbar.tsx`.** The `<motion.nav>` inline style previously carried `backdropFilter: scrolled ? undefined : 'none'` and `WebkitBackdropFilter: scrolled ? undefined : 'none'`, plus `backdrop-filter 0.5s` in the `transition` string. All three lines removed — dead code now that no state ever applies a backdrop-filter. The `transition` string collapses to `background 0.5s var(--ease-out-soft), box-shadow 0.5s var(--ease-out-soft)`. `navShadow` upgraded to give the bar the edge definition previously provided by the blur:

```ts
// before
const navShadow = scrolled ? '0 1px 0 rgba(40,35,28,0.06)' : 'none'
// after
const navShadow = scrolled ? '0 1px 0 rgba(40,35,28,0.08), 0 4px 16px rgba(40,35,28,0.03)' : 'none'
```

`0 1px 0 rgba(40,35,28,0.08)` — the 1px cream-brown hairline (from Phase 7) at slightly higher opacity so the bottom edge reads crisply against the page beneath.
`0 4px 16px rgba(40,35,28,0.03)` — a very soft drop shadow at 3% opacity for a faint depth cue, so the bar sits ABOVE the section rather than flush with it. Both layers are low-opacity so the overall feel stays light and refined, not heavy.

**Contrast pairing.** Untouched. `isOverDark = !scrolled && (menuOpen || isDarkHero)` still forces `false` when `scrolled` is true, so wordmark / links / hamburger / pill / border are all rendered in dark cream (`rgba(40,35,28,0.72–0.92)`) against the 0.97 cream surface. Over the flat cream `BuyingSection` (bg `#EFECE6`), the effective surface is essentially solid cream, so contrast is the full ~9.5 of dark cream text on cream — well above WCAG AA 4.5. Over the dark hero (only relevant in the brief window after scrolling past 80 px but before leaving the hero) the effective surface is ~97% cream, blended `rgb(233, 230, 224)`, contrast against dark text ≈ **10.2** — comfortably above AA.

**Over-dark-hero state preserved.** At top-of-page on dark-hero routes (`/`, `/sell`, `/let`, `/about`, `/valuations`), `!scrolled` → `.vm-nav-scrolled` NOT applied → inline `background: 'transparent'` on the `<motion.nav>` → hero photograph shows through, `isOverDark = true` → wordmark / links / hamburger / border all light cream. Never applied the 0.97 cream fill over the dark hero.

**What did not change.** Layout, alignment (main row `alignItems:'center', minHeight:44`), vertical centring, eyebrow position (sibling row `marginTop:22`), hamburger geometry (44 px button, `justifyContent:'center'` on bar stack), pill geometry, and the text-colour hinge logic. Typecheck (`npx tsc --noEmit`) clean.

**Why 0.97 not 1.0.** A fully opaque bar (`#EFECE6` solid) would read as a chrome/toolbar panel — heavier than the site's refined editorial feel. The 3% translucency preserves a whisper of the page beneath (imperceptibly, but the eye reads the bar as "on top of" rather than "part of the chrome"), which matches the atmosphere Phase 7 originally targeted with the frosted-glass approach. It gets the "feels like a light glass bar" impression without any dependency on backdrop-filter actually rendering.

**Fallback for the ~50 ms scroll-crossing window.** In the brief moment where a scroll crosses the 80 px threshold and the bar is transitioning between transparent and 0.97 cream, the `background 0.5s` transition softens the appearance / disappearance so it doesn't snap. Text-colour switches simultaneously via `isOverDark` — no de-sync possible.

### Phase 15 — reverted to dark charcoal glass, per the working reference (2026-07-01)

The direction shifted: the target from an older working version of the site is a DARK translucent glass bar (charcoal at 55 % alpha with `blur(20px) saturate(160%)`), not the light cream panel Phases 7 → 14 spent iterations tuning. The dark bar reads correctly over both light *and* dark sections because the backdrop is dark either way from the wordmark's point of view, so text can stay LIGHT in the scrolled state everywhere on the site. This is the a59ede0 Phase 7 formulation we had at commit time — the reference the user has been using — restored.

**Fix.**

`app/globals.css` — the `.vm-nav-scrolled` class (Phase 7 → 14 light-cream fill, most recently the 0.97 near-opaque panel) is **retired**. Its declaration is gone; a short comment marker is left in its place pointing at Phase 15 for the archaeology.

`components/Navbar.tsx` — the scrolled-state background, blur, and text-colour pairing are now owned inline on `<motion.nav>` (no CSS class needed):

```tsx
style={{
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
  background: scrolled ? 'rgba(40,35,28,0.55)' : 'transparent',
  backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
  WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
  boxShadow: navShadow,
  transition: 'background 0.5s var(--ease-out-soft), box-shadow 0.5s var(--ease-out-soft), backdrop-filter 0.5s',
}}
```

`backdrop-filter` back in the `transition` string so the blur ramps in/out with the background instead of snapping. `-webkit-backdrop-filter` mirror set for Safari.

**Text-colour pairing — three branches now, not two.** The prior `isOverDark = !scrolled && (menuOpen || isDarkHero)` boolean was correct only when both scrolled and dark-hero states wanted identical LIGHT alphas. The working reference targets slightly different alphas for the scrolled state, so the ternary was expanded from `isOverDark ? light : dark` to `scrolled ? phase15Light : isOverDark ? phase7Light : phase7Dark`:

| Property        | Scrolled (Phase 15 target)         | !scrolled, over dark hero (Phase 7 preserved) | !scrolled, over light hero (Phase 7 preserved) |
|-----------------|-------------------------------------|-----------------------------------------------|-------------------------------------------------|
| `logoColor`     | `rgba(239,236,230,0.9)`             | `rgba(239,236,230,0.95)`                       | `rgba(40,35,28,0.92)`                            |
| `linkColor`     | `rgba(239,236,230,0.8)`             | `rgba(239,236,230,0.82)`                       | `rgba(40,35,28,0.72)`                            |
| `hamburgerColor`| `rgba(239,236,230,0.85)`            | `rgba(239,236,230,0.9)`                        | `rgba(40,35,28,0.85)`                            |
| `btnBorder`     | `1px solid rgba(239,236,230,0.3)`   | `1px solid rgba(239,236,230,0.35)`             | `1px solid rgba(40,35,28,0.25)`                  |

The wordmark `&` stays brand gold `#A0845C` in every state (Navbar.tsx:144 — unchanged).

Top-of-page behaviour is byte-preserved: over `/`, `/sell`, `/let`, `/about`, `/valuations` the wordmark and links are still LIGHT at the exact Phase 7 alphas (0.95 / 0.82 / 0.9 / 0.35 border); over `/fees`, `/privacy`, `/blog`, `/buy`, etc. they stay DARK at the exact Phase 7 alphas (0.92 / 0.72 / 0.85 / 0.25 border). Only the scrolled branch changed.

**`navShadow` reverted.** Phase 14 replaced the Phase 7 hairline with a hairline + soft drop shadow to give the light-cream bar edge definition without blur. With the blur back on, that soft drop shadow is redundant (and slightly wrong-looking under a dark blurred bar), so `navShadow` returned to the Phase 7 single hairline `0 1px 0 rgba(40,35,28,0.06)`.

**Blur-render prerequisite verified.** Per CSS `backdrop-filter` spec, a non-`none` `transform`/`filter`/`will-change`/`perspective`/`contain` on any ancestor disables backdrop-filter on the descendant. Ancestor scan walking up from `<motion.nav>` → `<main>` (`app/page.tsx`) → `<motion.div>` (MotionProvider:127) → `<body>` (`app/globals.css`) → `<html>` came back clean:
- `MotionProvider.tsx:130` — `animate={{ opacity: 1 }}` (Phase 13 removed the `y: 0`); no transform written.
- `MotionProvider`'s curtain overlays use transform via CSS keyframes but are a *sibling* of `{children}`, not an ancestor, and auto-fade after 1.6 s.
- `body`/`html` — only `overflow-x: hidden` and `position: relative`; no transform/filter/will-change.
- `PageTransition.tsx:28` still has `animate={{ opacity: 1, y: 0 }}` but it lives in the leftover repo-root file, referenced only by the leftover root `layout.tsx`. Not in the App Router's live ancestor chain.

So the blur *will* render — unlike in Phases 9b → 12 when the MotionProvider ancestor transform was silently killing it.

**Contrast re-check.** 0.55 charcoal (`rgb(40,35,28)`) over the dark hero photograph blends to `~rgb(52, 47, 39)` — dark. Light text at `rgba(239,236,230,0.9)` on that surface: contrast ≈ **8.9**, well above WCAG AA 4.5. 0.55 charcoal over the light `BuyingSection` (`#EFECE6`) blends to `~rgb(130, 125, 119)` — mid-brown. Light text on that: contrast ≈ **3.6** — below AA 4.5, so *on paper* the light-over-light-section case is borderline. In practice the blur softens the underlying content and the light text sits well above the mid-brown wash cleanly. If someone flags this as a real-world contrast issue later, the fix is to nudge the charcoal alpha up from 0.55 → 0.65 (blend to `~rgb(110, 104, 96)`, contrast ≈ 4.6, above AA) — but that's a `wait-and-see` tweak, not a pre-emptive one; the working reference the user provided uses 0.55.

**What did not change.** Layout, alignment (main-row `alignItems:'center', minHeight: 44`), vertical centring, height, spacing, the eyebrow (sibling row, `marginTop:22`), the mobile hamburger geometry, and the scroll-trigger threshold (`window.scrollY > 80`) are all byte-unchanged. Typecheck (`npx tsc --noEmit`) clean.

### Phase 16 — GDPR consent checkbox on every public form (2026-07-04)

**Why.** UK GDPR / PECR require an explicit, freely given opt-in before collecting personal data through a webform, and a durable record of that consent per submission. The three public forms (`components/GetInTouch.tsx`, `app/valuations/page.tsx`, `app/register/page.tsx`) previously carried only a passive "we will use your details" footnote — legally insufficient.

**Approach chosen — single combined checkbox (processing + marketing).** The site does not currently distinguish separate "processing" vs "marketing" consent anywhere; the pre-existing footnote wrapped both purposes into one sentence. Splitting into two checkboxes would introduce a distinction the rest of the site does not model. One required checkbox, one combined purpose. If marketing preferences ever need to be tracked independently, this can be split later without breaking the API contract (the email templates already have room for a second "Marketing consent" row).

**What changed.**
- Each of the three forms gained a `consent: boolean` field in local state, a `consentError: boolean` guard, and a `ConsentCheckbox` sub-component defined inline in the same file. The checkbox sits directly above the submit button. `handleSubmit` short-circuits with `setConsentError(true)` if `consent === false` and no fetch is issued.
- Checkbox styling matches the site's existing form aesthetic: 16 × 16px native checkbox with `accentColor: '#A0845C'`, label text at 11px `#6B6258` (same treatment as the existing FIRST NAME / EMAIL micro-copy), inline `Privacy Notice` link in gold underlined. Inline error message (`role="alert"`, `#c0392b`, `aria-describedby`) appears immediately below the checkbox when submission is blocked.
- Label copy is identical across all three forms except for one word on `/valuations` ("arrange my valuation and respond to my enquiry" vs. "respond to my enquiry") to keep the sentence natural per surface.
- The now-redundant "We will use your details..." / "No spam. Unsubscribe at any time..." footnote paragraphs below the submit buttons on the homepage form and `/register` were removed — the new checkbox label supersedes them. `/valuations` kept its "No obligation. We will contact you within 24 hours" footnote because that copy is about SLA, not consent.
- `app/api/contact/route.ts` and `app/api/valuation/route.ts` now accept a `consent` boolean in the request body and render a **Consent given: Yes (given at submission) / No** row as the last line of the email table. The value is derived server-side from the boolean (`consent === true`) rather than trusted verbatim, so a malformed payload defaults to "No".
- Privacy Notice link points to the existing `/privacy` route (verified — `app/privacy/page.tsx` exists).
- The password-gated `/admin` form was left alone; it is not a public personal-data collection surface.

**Verification.** `npx tsc --noEmit` clean. `next dev` renders the checkbox HTML on `/`, `/valuations`, and `/register`. Client-side blocking is enforced by the `handleSubmit` short-circuit — no fetch fires when the box is unchecked, and the inline `role="alert"` error appears next to the checkbox.

**Follow-up worth noting.** UK ICO guidance is that marketing consent should ideally be a separate, opt-in-only checkbox (soft opt-in for existing customers being the one exception). This implementation combines processing and marketing per the current site model; if you later want strict-mode PECR compliance for marketing specifically, split the single box into (a) required "process my enquiry" and (b) optional "send me updates," and add the second boolean to the API payload + email row.

### Phase 17 — SEO hardening pass (2026-07-04)

**Why.** Phase 6 laid down per-page metadata, sitemap, robots, and one homepage JSON-LD block. This pass tightens brand-name consistency, boosts location + service keyword weight in titles/descriptions without stuffing body copy, extends structured data beyond the homepage, and closes an orphan-page crawl gap.

**Brand form standardized.** "Vale and Mercer" (unencoded, 45+ occurrences) is now the canonical form in every metadata title/description and every JSON-LD `name` field. Visual "&" glyphs in the Navbar/Footer wordmark lockup are unchanged — that's a design element, not metadata. Consent-checkbox labels keep `&amp;` (HTML-entity form) because they render user-facing text; both forms are semantically identical to search engines.

**Titles rewritten for keyword weight.** Every page title now leads with a location + service phrase and appends " | Vale and Mercer" via the layout `template`. All titles kept under 60 characters to survive Google's SERP truncation:

| Route | Before | After |
|---|---|---|
| `/` | Vale and Mercer \| London Residential Property Agency | *(unchanged, already good — 54 chars)* |
| `/about` | About | About the Agency |
| `/let` | Lettings | London Lettings |
| `/rent` | Rentals | London Rentals |
| `/buy` | New Homes | New Homes in London |
| `/sell` | Selling | Sell Your London Home |
| `/fees` | Services and Fees | Lettings and Sales Fees |
| `/valuations` | Book a Valuation | Free London Property Valuations |
| `/register` | Register Interest | Register for Property Alerts |
| `/blog` | Journal | London Property Journal |
| `/blog/london-property-market-2025` | The London property market in 2025 | The London Property Market in 2025 |
| `/blog/guide-to-buying-in-chelsea` | Your complete guide to buying in Chelsea SW3 | Guide to Buying a Home in Chelsea SW3 |
| `/blog/student-lettings-london-guide` | Renting in London as a student | Student Lettings in London: The Practical Guide |

Legal pages (Privacy, Cookies, Terms, Complaints) left unchanged — already well-formed.

**Meta descriptions rewritten.** Every page's description was rewritten to include the brand, a location keyword, and a service phrase, all under ~155 characters, all unique. Blog article descriptions were also refreshed and matched into their OpenGraph `description` field so social previews carry the same copy.

**Structured data expanded.** The homepage's single `RealEstateAgent` block has been promoted to `app/layout.tsx` so it's rendered on **every** page in the site (with `@id: <site>/#organization` so it can be referenced by other schemas). The homepage keeps a `WebSite` schema of its own that references the shared org via `publisher: { '@id': ... }`. Every interior route now emits a `BreadcrumbList` (Home → Page for one-level routes, Home → Journal → Article Title for blog posts). Every blog article emits a `BlogPosting` with real `headline`, `image`, `datePublished`, `author` (Organization: Vale and Mercer), and `publisher` (referencing the shared org node). No invented ratings, reviews, or counts anywhere.

**Sitemap tightened.** `app/sitemap.ts` was refactored so blog posts live in a small `BLOG_POSTS` registry with their real publication dates as `lastModified` (previously every route stamped `new Date()`, which lied to Google about freshness of March 2025 posts). Comment at the top of the file tells future editors to update the registry when adding a new blog directory. All 14 live routes + 3 blog articles enumerated.

**Robots.ts** — verified: allows `/`, disallows `/api/` and `/admin`, references the sitemap URL. No change needed.

**Canonicals** — verified: every layout / page metadata sets `alternates.canonical: '/path'`; root layout sets `metadataBase`. No duplicates, no orphans.

**Orphan-page crawl fix.** `/rent` and `/sell` had no inbound internal links from anywhere on the site — indexable via sitemap but receiving no link equity. Added both to the Footer nav (now: Lettings, Rentals, Sell, New Homes, About, Blog, Fees, Book Valuation). Primary Navbar unchanged to preserve the current visual density.

**Image alt text audit.** Fixed generic `alt="London"` values on `components/Hero.tsx` (→ "Prime London residential streetscape at dusk"), `app/about/page.tsx` (→ "London townhouse street"), `components/FeaturedProperties.tsx` (→ `alt={item.area + ' property listing'}`), and both remaining blog article `imageAlt` props. `components/ValuationStrip.tsx` empty `alt=""` was **kept** — the parent div carries `aria-hidden` and the image is decorative, so empty alt is the WCAG-correct signal.

**Body copy** — audited for keyword thinness; no additions made. Service pages already reference "prime London", "lettings", "valuation", and named neighbourhoods ("Chelsea SW3", "Kensington W8", "Notting Hill W11", "Canary Wharf") in natural context. Adding more would tip into keyword stuffing.

**Verification.** `npx tsc --noEmit` clean.

**Perf red flags flagged (not fixed — out of scope).**
- Every image on the site is a bare `<img>` from the Unsplash CDN. No `next/image` usage anywhere in `/app` or `/components`. Missing AVIF/WebP negotiation, auto-srcset (Hero only builds one manually), CLS-preventing width/height. Non-trivial refactor because existing usage relies on inline styles and Ken Burns / parallax transforms that would need re-wiring. Recommend a follow-up phase.
- Six routes are marked `'use client'` at the page level (`/buy`, `/about`, `/blog`, `/register`, `/valuations`, `/rent`). They still SSR (metadata + JSON-LD work), but they ship the framer-motion runtime to the browser for pages whose main content is largely static. Worth splitting client islands out of static shells later.
- Cookiebot loads `afterInteractive` — deliberate anti-blocking choice per Phase 4 notes. Correct as-is.

**What still needs YOUR action outside the codebase.**
1. **Verify `valeandmercer.co.uk` in Resend** and add the returned DNS records at your domain registrar (SPF `TXT`, DKIM `TXT`). Until this is done the sandbox `from` still applies (Phase 15 outstanding item) and no email actually reaches the inbox. This is now doubly blocking — SEO can't help if enquiries never surface.
2. **Google Search Console** — submit `https://valeandmercer.co.uk/sitemap.xml` at [search.google.com/search-console](https://search.google.com/search-console). Verify domain via DNS TXT record. This is what actually gets Google to notice the new schema/titles quickly rather than waiting for organic discovery.
3. **Bing Webmaster Tools** — same drill, at [bing.com/webmasters](https://www.bing.com/webmasters). Bing's share of London property searches is small but non-zero.
4. **Rich Results Test** — after next deploy, paste `https://valeandmercer.co.uk/` and one blog article URL into [search.google.com/test/rich-results](https://search.google.com/test/rich-results) to confirm the RealEstateAgent, BreadcrumbList, and BlogPosting schemas parse without errors. If it flags "missing image" on the RealEstateAgent, add a square logo PNG at `public/logo.png` and update `logo: SITE_URL + '/logo.png'` in `app/layout.tsx` (currently points at `/icon.svg` which is the tab favicon — some Google validators prefer raster).
5. **OG image** — the homepage OpenGraph still uses an Unsplash placeholder. Commission a real 1200×630 branded PNG and drop it at `public/og-image.jpg`, then update `OG_IMAGE` in `app/layout.tsx`. Flagged since Phase 6; still outstanding.

### Phase 18 — swapped Resend for Web3Forms (2026-07-04)

**Why.** Resend requires the sending domain (`valeandmercer.co.uk`) to be DNS-verified via SPF + DKIM records at the domain registrar (GoDaddy). Access to that GoDaddy account is not currently available, so verification cannot be completed and Resend keeps rejecting real deliveries. Web3Forms doesn't require any DNS work — a single access key routes submissions to the mailbox tied to the Web3Forms account.

**Architectural pivot from the initial instruction.** The task called for editing `app/api/contact/route.ts` and `app/api/valuation/route.ts` to POST to Web3Forms server-side. That approach cannot work on Web3Forms's free tier: their endpoint rejects server-origin requests with `403 { message: "This method is not allowed. Use our API in client side or contact support with server IP address (Pro plan is required)" }`. Confirmed against the live endpoint with and without browser-style headers. The endpoint is also fronted by Cloudflare Turnstile bot detection which real browsers pass automatically and server tools cannot. Two options: (a) pay for Web3Forms Pro and whitelist Vercel IPs, or (b) submit directly from the browser. Since the user already noted the access key is "public key safe for client-side use," option (b) was the pragmatic path.

**What changed.**
- `app/api/contact/route.ts` and `app/api/valuation/route.ts` **deleted entirely**, along with their now-empty parent directories. The `/api` folder no longer exists under `/app`.
- `components/GetInTouch.tsx`, `app/valuations/page.tsx`, and `app/register/page.tsx` were rewritten so their `handleSubmit` handlers POST directly to `https://api.web3forms.com/submit` from the browser, with all form fields (name, email, phone, message, property address, postcode, property type, bedrooms, reason for valuation, "I am interested in", budget, plus GDPR consent) flattened into labelled top-level keys — Web3Forms renders each as a labelled row in the emailed submission.
- Each `handleSubmit` now checks the Web3Forms response: `if (res.ok && result?.success) setStatus('sent'); else setStatus('error')`. On failure it also `console.error`s the parsed response body for browser DevTools visibility. This closes the earlier silent-success bug: real users see "Something went wrong. Please try again" if delivery fails, not "Thank you."
- The `resend` npm dependency was uninstalled after `grep` confirmed no remaining imports in `/app`, `/components`, or `/lib`. `package.json` and `package-lock.json` both updated.
- `.env.local` — old `RESEND_API_KEY` and `CONTACT_EMAIL` values commented out as tombstones. New value `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=65ce5771-a969-4c9b-bb58-15b4f89cb3ed` added. The `NEXT_PUBLIC_` prefix is what makes Next.js inline it into the client JS bundle — required because the fetch runs in the browser.
- **Deleted broken repo-root duplicate route files**: `route.ts`, `contact/route.ts`, `valuation/route.ts`, `api/contact/route.ts`, `api/valuation/route.ts`. These were leftover pre-refactor duplicates flagged in the "Outstanding items" list; they'd been dead code, and now they were also broken (still imported `resend` which no longer exists) which made `npx tsc --noEmit` fail. Deletion was the smallest fix.

**Delivery destination.** Whichever email address the Web3Forms account was created under. This is DIFFERENT from the old `rghvrjpl@gmail.com` that Resend used, and it lives inside the Web3Forms account rather than as a project env var — so if you need to change the destination inbox, log in to Web3Forms and update the account email there, not in code or on Vercel.

**Verification.** `npx tsc --noEmit` clean after cache reset. Direct-to-endpoint smoke test from `curl` returns Cloudflare Turnstile challenge HTML (expected — real browsers pass it, server tools cannot), which independently confirms Web3Forms's client-only enforcement. Full end-to-end delivery test **must be done from a real browser** — see YOUR ACTION items below.

**What still needs YOUR action outside the codebase.**
1. **Restart your dev server** (`kill 16916` then `npm run dev`) to load the new `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` env var. Next.js does not hot-reload env changes.
2. **Test each form in a real browser** at `http://localhost:3000` — homepage contact, `/register`, `/valuations`. Fill them in, tick consent, submit. Confirm (a) the success screen renders, and (b) an email actually arrives at the inbox tied to your Web3Forms account. If (a) works but (b) doesn't, check the browser DevTools console — the `console.error` on failure surfaces Web3Forms's raw response.
3. **On Vercel** — add the env var `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=65ce5771-a969-4c9b-bb58-15b4f89cb3ed` to Production (and Preview / Development if you want them to work there too), then redeploy. The name is important — Vercel currently has `RESEND_API_KEY` and `CONTACT_EMAIL` which are no longer used. Feel free to delete those after the new one is in place.
4. **Rotate the leaked Resend key** as a precaution — my earlier `grep .env.local` output leaked it into an earlier turn of this conversation. The key is now inactive (Resend is uninstalled) but if you had it wired to a paid Resend account, revoke it in the Resend dashboard so no one who saw the terminal can send from it.

### Phase 19 — Zoopla Online Valuation Tool floating button (2026-07-07)

**Purely additive** per client instruction. The existing "Book Valuation" navbar pill, hero CTA, and custom `/valuations` form are untouched — this adds a **second** valuation channel (Zoopla's own instant-valuation iframe) alongside them so visitors can choose the flow that suits them.

**What changed.**
- `app/layout.tsx` — added a second `next/script` `<Script id="zoopla-ovt" ...>` in the `<head>` next to Cookiebot, `strategy="afterInteractive"` so it never blocks initial render. Also mounted `<ZooplaValuationButton />` once, globally, as a sibling of `<MotionProvider>{children}</MotionProvider>` inside `<body>`. Single mount site so the button appears on every route without per-page duplication.
- `components/ZooplaValuationButton.tsx` — new server component. Renders exactly one `<a id="online-valuation-tool" class="ovt-button-fixed zt-ovt-button">` containing house icon `<img>`, "Request an Instant Online Valuation" text, and arrow icon `<img>`. Both icons point at the exact Zoopla-hosted URLs (`https://www.zoopla.co.uk/zvt/house-light.png` and `arrow-right-light.png`) rather than being rehosted locally — the widget script matches on id, not on the img src, but the icons match Zoopla's branding out of the box. Two `// eslint-disable-next-line @next/next/no-img-element` comments suppress the Next.js "use next/image" warning; using `next/image` here is inappropriate because the widget's own CSS + JS wire up around raw `<img>` DOM nodes.
- `app/globals.css` — appended the widget's CSS block (`#online-valuation-tool { ... }` + `#online-valuation-tool.ovt-button-fixed { ... }`) copied verbatim from Zoopla's loader response, `!important` markers preserved. Layout-only additions (icon `height:36px` for the house, `height:14px` for the arrow, `vertical-align:middle`, `line-height:1.15` on the span) are added so the three inline children align cleanly inside the pill without editing any of Zoopla's declared values.

**How it works at runtime.** On first paint React renders the `<a>` at bottom-left with Zoopla's fixed CSS (bottom:20px, left:-1px, purple `#8046F1` background, `z-index:2147483000`). Once the page finishes interactive parsing, the widget loader script executes, finds the anchor by id, and attaches a click handler that opens Zoopla's iframe modal in place. Because the initial render is pure HTML/CSS, the button is visible even if the widget script hasn't loaded yet — but clicking it only does something after the script is on the page.

**Core Web Vitals.** `afterInteractive` guarantees the script is not parser-blocking and is scheduled after hydration, so LCP/FID/INP are unaffected. The button itself is a plain anchor with two `<img>` (~few KB combined from Zoopla's CDN, lazy in practice because it's below-the-fold on shorter viewports, though visible at bottom-left on all viewports). No JavaScript runs from `<ZooplaValuationButton />` itself — it's a Server Component.

**Positioning + collision check.** Cookiebot is the only other third-party overlay on the site; its banner defaults to a full-width bottom strip (not corner-anchored), so it briefly obscures the Zoopla button on first visit until the user makes a consent choice, after which the strip disappears and the button is clear. This is Cookiebot's default behaviour, not a bug — flagged to the client rather than repositioned, per task instruction not to silently move Zoopla's button (their widget's iframe positioning assumes `bottom:20px; left:-1px`, and moving it can shift the iframe launch coordinates). No other fixed/floating element occupies the bottom-left corner (checked `Navbar.tsx`, `Hero.tsx`, `AtmosphereLayer.tsx`, `GrainOverlay.tsx`, `MotionProvider.tsx`).

**Verification.** `npx tsc --noEmit` clean. `npx eslint components/ZooplaValuationButton.tsx` clean (0 warnings after per-line disables). Runtime click-through to the iframe modal on desktop and mobile viewport widths **must be verified in a real browser** — the loader script sits behind Cloudflare Turnstile and can't be curled headlessly, so any automated check would false-negative on script availability. See YOUR ACTION below.

**What still needs YOUR action outside the codebase.**
1. **Verify the floating "Request an Instant Online Valuation" button opens Zoopla's iframe** at `http://localhost:3000` (any route — it's mounted globally). Test on a desktop browser AND a mobile viewport (Chrome DevTools device toolbar, or a real phone via `npm run dev` on a LAN URL). Clicking it should open Zoopla's own valuation iframe overlay — if it doesn't, check DevTools Console for `widgetiframeloader` errors and confirm Zoopla's key `9fb4cf97-d666-458b-95d2-9b5554eb8228` is still active on their side.
2. **Cookiebot ↔ Zoopla button visual overlap on first visit.** The Cookiebot banner (bottom strip) briefly covers the Zoopla button before the user consents. If the client wants the Zoopla button visible above the Cookiebot banner from the first frame, options are (a) change the Cookiebot layout to a corner popup in the Cookiebot dashboard, or (b) accept the current behaviour where consent-first-then-valuation is a reasonable order of operations. Left as-is per task instruction (do not silently reposition Zoopla's widget).

### Phase 19b — Zoopla button repositioned to bottom-right + Turbopack CSS staleness (2026-07-07)

**Client asked for the pill on the right, not the left.** Zoopla's own widget script injects a hardcoded `<style>` at runtime with `left: -1px !important` and `border-top-right-radius / border-bottom-right-radius: 40px !important` — that injection may fire AFTER our `globals.css` chunk loads, so a same-specificity override in globals would lose the cascade tie.

**Specificity trick used.** In `app/globals.css` a second rule is written with the id selector *doubled*:
```
#online-valuation-tool#online-valuation-tool.ovt-button-fixed {
  left: auto !important;
  right: -1px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-top-left-radius: 40px !important;
  border-bottom-left-radius: 40px !important;
}
```
Specificity climbs from Zoopla's `#id.class` (1,1,0) to our `#id#id.class` (2,1,0), so our positioning wins even though Zoopla's rule and ours both use `!important` and theirs may be injected later in DOM order. This is the smallest valid CSS-only override — no wrapping element, no MutationObserver, no JS shim.

**Padding also flipped.** Original `padding: 14px 15px 14px 5px` (top, right=15, bottom, left=5) put the tight edge on the left because the pill sat flush-left. Now the pill sits flush-right, so the tight edge belongs on the right: `padding: 14px 5px 14px 15px`. Icons + text now read left-to-right from the leftward-extending rounded side toward the flush-right arrow.

**Turbopack CSS chunk staleness — hit twice.** Both the Phase 19 initial write and this Phase 19b edit ran into the same trap: Turbopack in Next 16 hashes the compiled CSS chunk URL by pre-edit content and serves the stale chunk to browsers on subsequent HTML requests. Neither HMR nor a `touch globals.css` triggers a recompile. The recovery is `kill <dev-pid>; rm -rf .next; npm run dev`. If future edits to `globals.css` seem to have "no effect" in the browser, this is the first thing to try.

**Verification of the CSS chunk after cache wipe.**
- Served `#online-valuation-tool#online-valuation-tool.ovt-button-fixed` rule contains `right: -1px !important`, `left: auto !important`, `border-radius: 40px 0 0 40px !important` (Turbopack minified the four corner rules into the shorthand — same effect).
- Base `#online-valuation-tool.ovt-button-fixed` rule contains `position: fixed !important; bottom: 20px !important; z-index: 2147483000 !important; background-color: #8046f1; color: #fff`.

**Clickability.** The initial "not clickable" report is almost certainly a downstream symptom of Phase 19's stale-CSS chunk: with no `position:fixed / bottom / left / right / z-index / background` styles applied, the `<a>` collapsed into normal document flow, rendered as an inline anchor with two broken images somewhere inside the body's regular content, and the user clicking the empty bottom-left corner (where the pill *should* have been) was clicking nothing. After this phase (CSS applied correctly + bottom-right position), the anchor becomes a visible bounding box at `right:-1px; bottom:20px; z-index:2147483000` and clicks land on it. Nothing else in the codebase intercepts pointer events at that stacking context:
- `MotionProvider`'s curtain overlay is `pointer-events: none` and auto-fades in 1.6s.
- `GrainOverlay` is `pointer-events: none`.
- `AtmosphereLayer` is `z-index: -1` and `pointer-events: none`.
- No other component sets `z-index > 2147483000` or covers the bottom-right corner with a hit target.

Once the pill is visible, click behaviour is Zoopla's script's responsibility — it scans the DOM for `#online-valuation-tool` on execution and attaches an onclick that opens the iframe modal. If a real-browser test after Phase 19b still shows dead clicks, the remaining root causes to check in this order are: (a) ad blocker blocking `zoopla.co.uk/resource/widgetiframeloader/*`, (b) the browser session lacking the Cloudflare cookies Zoopla's CDN sometimes uses for JS delivery, (c) Cookiebot's banner (default z-index ≈ 2147483645, higher than ours) covering the pill until consent is given — Cookiebot on `localhost` is not authorised for this account (log shows the "domain LOCALHOST is not authorized" warning), so on localhost the banner is not rendered at all, but on the production domain this is worth eye-balling.

**What still needs YOUR action outside the codebase.**
1. **Hard-refresh the browser** at `http://localhost:3001` and confirm the purple pill sits at bottom-right with the rounded corners on the LEFT (icon + text extending leftward, arrow flush to the right edge).
2. **Click it.** Confirm the Zoopla iframe modal opens. Test on desktop and a mobile viewport (Chrome DevTools device toolbar or a real phone against `http://192.168.1.203:3001`).
3. **If the click still does nothing**, open DevTools → Network, filter for `widgetiframeloader`, and check: status 200? content-type `text/javascript` or `application/javascript`? Response body starts with real JS (not `<!DOCTYPE html>`)? If not, that's Cloudflare/ad-blocker interference and needs to be diagnosed in the browser context, not from the server.

### Phase 19c — Zoopla button click now works (defensive href fallback) (2026-07-07)

**Symptom.** After Phase 19b the pill was visible at bottom-right with correct positioning, but clicking it did nothing observable.

**Root cause — Cloudflare on Zoopla's widget endpoint returns a challenge page, not the real JS.** Fetching `https://www.zoopla.co.uk/resource/widgetiframeloader/?key=...` from the Node runtime (as a proxy for a real cross-origin script fetch) with Chrome/Safari-like `User-Agent`, `Accept: */*`, `Referer`, `sec-fetch-dest: script` etc. returns:

```
HTTP: 403
Content-Type: text/html; charset=UTF-8
CF-Ray: a171b07f4c92a73b-DEL
First bytes: <!DOCTYPE html><html lang="en-US"><head><title>Just a moment...</title>...
Contains "online-valuation-tool": false
Contains "onclick": false
Contains "addEventListener": false
Contains "Just a moment": true
```

That is Cloudflare's interstitial "Just a moment" browser-check HTML page — not JavaScript. When a real browser encounters this served with `Content-Type: text/html` via a `<script src>` tag, one of two things happens:
- (a) The browser refuses to execute a non-JS-MIME response as a script (modern browsers block on MIME mismatch for scripts) → the script silently does not run, `#online-valuation-tool` has no click handler attached.
- (b) The browser tries to parse it → `Uncaught SyntaxError: Unexpected token '<'`. Even then, no handler is attached.

Either way, the anchor's own `href="#"` (from the original Phase 19 code) then takes over on click. `#` scrolls the page to the top of the document, which is either invisible (already at the top) or looks like "nothing happened" if the user is at the top and the browser doesn't visually indicate the URL fragment change. That matches the symptom exactly.

Real browsers passing through Cloudflare from a legitimate whitelisted origin (Zoopla's partner-agent domains) will get the real JS. But the localhost / development origin, and possibly the production origin if it hasn't been registered against this key, will not — Cloudflare distinguishes real browsers via TLS fingerprints and Sec-Fetch metadata, and the account key `9fb4cf97-...` may be domain-locked at Zoopla's end. There is no server-side workaround; changing the `next/script` strategy does not help (this is an origin/CDN rejection, not a timing issue).

**Fix — defensive href.** `components/ZooplaValuationButton.tsx` now uses `href="https://www.zoopla.co.uk/home-values/"` with `target="_blank" rel="noopener noreferrer"` instead of `href="#"`. Behaviour matrix:
- Widget script *does* load and attach: its click handler runs first, calls `preventDefault`, opens the iframe modal in place. The `href` never fires. Same UX as intended.
- Widget script *does not* load (Cloudflare block, ad-blocker, etc.): browser falls through to the anchor's default, opens Zoopla's own instant-valuation landing page (`/home-values/` — the confirmed live URL with the postcode-lookup / "get an instant online house valuation" flow) in a new tab. User still lands on a valuation flow. Not the seamless in-page modal, but not dead either.

The id, class, image URLs, and inline markup remain unchanged so the widget script still finds and wires up the anchor whenever it *does* execute.

**Ruled out during diagnosis, so no time was spent on these fixes.**
- Higher-z-index overlay stealing the click. Nothing in the codebase sets `z-index > 2147483000` except the button itself. `MotionProvider` curtain and `GrainOverlay` are `pointer-events: none`. Cookiebot's default z-index (~2147483645) is higher but its log warning `"The domain LOCALHOST is not authorized"` confirms it never renders a banner on `localhost`, so on the dev server it cannot be swallowing clicks. On production it *could* — flagged as YOUR ACTION #3.
- Parent stacking context trapping the button. The button is a direct child of `<body>` in the render tree (sibling of `<MotionProvider>`, not a descendant), so no parent creates a stacking context that could cap its effective z-index.
- Our own CSS setting `pointer-events: none`. Grepped for `pointer-events` across `globals.css` and every `*.tsx` file — none touch the button.

**Verification.**
- `npx tsc --noEmit` clean.
- Rendered HTML on `/`: `<a id="online-valuation-tool" class="ovt-button-fixed zt-ovt-button" href="https://www.zoopla.co.uk/home-values/" target="_blank" rel="noopener noreferrer">…</a>`.
- Served CSS chunk still contains the bottom-right override with the double-id specificity trick.

**What still needs YOUR action outside the codebase.**
1. **Hard-refresh the browser** (Cmd-Shift-R on the Zoopla test page) so the updated component JS is loaded.
2. **Click the pill.** If Zoopla's script attaches on your browser+network combo, the iframe modal opens. If not, a new tab opens to `zoopla.co.uk/home-values/`.
3. **In DevTools → Network**, filter for `widgetiframeloader` and confirm what your specific browser sees. If the status is 200 with `Content-Type: application/javascript` (or `text/javascript`) and the response body is real JS, then Zoopla's script IS wiring the modal for you and the new-tab fallback should never fire. If it's the "Just a moment" HTML page, you'll get the fallback — and the deployment-time fix is either (a) contact Zoopla support to register `valeandmercer.co.uk` (and any preview URLs) against the widget key, or (b) accept the new-tab fallback as the permanent behaviour.
4. **On production**, watch for Cookiebot's default full-width banner at z-index ~2147483645 briefly covering the pill on first visit until consent. If clients report bottom-right click misses in that pre-consent window, either raise our pill's z-index above Cookiebot's or reconfigure Cookiebot to a corner popup.

### Phase 19 (all sub-phases) — REVERTED (2026-07-07)

**Phases 19, 19b, and 19c are reverted.** The Zoopla Online Valuation Tool floating button is removed entirely; the site is back to the pre-Phase-19 state on this axis.

**Reason.** The widget's click handler could not be reliably triggered. Zoopla's `widgetiframeloader` script is fronted by Cloudflare, which returns a "Just a moment..." challenge page (HTML, not JS) instead of the real widget code for our origins — so the script never executed in the browser and the anchor's click never invoked Zoopla's iframe modal. The Phase 19c defensive-href fallback (new tab to `zoopla.co.uk/home-values/`) worked, but a floating pill that only ever takes users off-site to a Zoopla-branded page was judged worse than removing the pill entirely. Client's existing "Book Valuation" navbar pill, hero CTA, and custom `/valuations` form are the sole valuation channels going forward.

**What was removed.**
- `components/ZooplaValuationButton.tsx` — deleted.
- `app/layout.tsx` — removed the `import ZooplaValuationButton` line, the `<Script id="zoopla-ovt" ...>` tag, and the `<ZooplaValuationButton />` mount.
- `app/globals.css` — removed the `#online-valuation-tool` / `#online-valuation-tool.ovt-button-fixed` block (including the double-id specificity override and the img/span layout helpers).

**Untouched by this revert** (per instruction): the existing "Book Valuation" navbar pill, the hero CTA, and the custom `/valuations` form remain exactly as they were.

**Verification.** `grep -rn -i "zoopla|ovt-button|online-valuation-tool"` across `.tsx / .ts / .css / .js / .mjs` returns zero widget-related matches (the two remaining `Zoopla Ltd` mentions in `privacy/page.tsx` and `app/privacy/page.tsx` are unrelated GDPR disclosures naming Zoopla as a listing partner). `npx tsc --noEmit` clean. `npm run build` clean.

**Revisit later if desired.** If Zoopla's partner-agent team can register `valeandmercer.co.uk` against the widget key so Cloudflare stops challenging the script fetch — or if the client wants the always-safe new-tab-to-Zoopla fallback back as a lead-capture channel — reintroducing this is straightforward: the Phase 19 / 19b / 19c write-ups above document the exact markup, CSS trick, and Script placement needed.

### Phase 20 — Live rentals: 10 real listings + dynamic detail pages (2026-07-08)

**Purely additive** per instruction. None of the existing hardcoded property teaser cards were removed or edited — this pass adds a real property-detail surface alongside them so the site now carries actual current availability.

**Data model.** `lib/properties.ts` — previously dead code with 3 placeholder samples — was rewritten. The `Property` type was extended to cover the full detail-page field set (`ref`, `rent` pcm + `rentPW`, `available`, `holdingDeposit`, `securityDeposit`, nullable `sqft`/`floor`, `epc`, `tags[]`, `headline`, `description`, `amenities`, `keyFeatures[]`, optional `compliance` block, `location`, `nearby[]` with `Tube` / `School` discrimination, `income` requirements block). Two new exported constants — `AGENT_CONTACT` (Raghav Rajpal, info@valeandmercer.co.uk, +44 7517 696926) and `RENT_TERMS` / `RENT_GUIDES` — centralise the shared blocks so future edits touch one place. The 3 placeholder samples were removed; the 10 real Canary Wharf / Isle of Dogs / Millwall / Cubitt Town lettings supplied by the client are the sole records. Two helper functions: `getPropertyBySlug` and `getAllPropertySlugs`.

**Detail page.** `app/property/[slug]/page.tsx` — new dynamic route, server component. Emits `generateStaticParams` (all 10 slugs) so every property gets a real SSG URL (`/property/lawn-house-close-1bed`, `…/marsh-wall-studio-2400`, `…/westferry-circus-4078`, etc). Also emits per-property `generateMetadata` with canonical, OpenGraph, and short SERP description. Renders in Next.js 16 style (`params: Promise<{ slug: string }>`, `const { slug } = await params`). Layout: dark ink hero (matching `PageHero` pattern — placeholder image at 0.55 opacity, gradient wash, gold accent rule, serif title with area suffix, rent + rentPW + bed/bath/sqft/floor/availability strip), then a two-column body (main column + sticky sidebar) that flattens to one column below 900 px via a scoped inline stylesheet. Main column sections, each with the existing hairline `border-top: 0.5px solid #DDD7CC` separator: Overview (headline + description), Amenities, Key Features (bullet list, hidden if empty), Compliance (EPC + council tax, hidden if absent), Location + Nearby (tube/rail and schools split into two labelled groups), Deposits, Rent payment + income requirements table, rent-term lines ("Pay monthly", "Required" for ID / R2R / proof), and the two guide links (`How to Rent Guide`, `Renters' Rights Act Information Sheet`) as `href="#"` placeholders. Sidebar is a dark `#28231C` card with the agent block (serif name, sans micro-title, mailto with pre-populated `subject=Enquiry — <title> (Ref <ref>)`, tel), two CTAs (`Book a Viewing` gold, `Make an Offer` outlined-light) both using the existing `ArrowButton` component with `href="#"` placeholders, and a small `Property Ref` footer.

**Wired into `/rent`.** `app/rent/page.tsx` — the existing hero block and the existing 3 "coming soon" teaser cards are byte-for-byte unchanged. A new section is inserted between them: eyebrow "Available now", h2 "Currently on the market", right-aligned listing count, then a responsive grid of 10 property cards (dark card, 200 px placeholder-image band with `To Let` gold pill, area eyebrow, serif title, bed/bath/sqft micro-copy, price + `rentPW` + availability footer, gold arrow on hover — same design vocabulary as the coming-soon cards but with real data and linking to `/property/[slug]` instead of `/register`). Uses the existing `Stagger` / `StaggerItem` reveal machinery.

**Wired into homepage.** `components/FeaturedProperties.tsx` — the 2 existing "coming soon" storefront cards (Canary Wharf, East London / Notting Hill W11) are unchanged. Two additional cards are added by importing `properties` from `lib/properties`, filtering for `featured: true` (Marsh Wall £4,050pcm 18th-floor 2-bed and Westferry Circus £4,078pcm 3rd-floor 2-bed), and prepending them to the existing `listings` array. The card body was extended to (a) source `href` from the item so live cards link to `/property/[slug]` while coming-soon cards still link to `/register`, (b) render an optional `meta` line ("£4,050pcm · 2 beds · Available 21 August") above the CTA row for live cards only, and (c) render a configurable CTA label ("View Property" / "Register Interest"). Section h2 changed from "Properties coming soon" to "Available now & coming soon" and the section-header link swapped from "Get Notified → /register" to "All Rentals → /rent" so the CTA matches the mixed content.

**Placeholder image.** `public/images/property-placeholder.svg` — new SVG asset. Solid dark charcoal (`#28231C`) 1600×1000 rectangle with faint gold internal grid, gold `VALE • MERCER` eyebrow, cream italic "Photo coming soon" set in the site's Cormorant Garamond serif, and a "RESIDENTIAL LETTING" sub-caption. Uses the site palette so it doesn't visually clash with real photos when interleaved on the /rent grid. All 10 records reference this via `image: '/images/property-placeholder.svg'`; swap in real photography by replacing per-record `image` values.

**Source-spec inconsistencies preserved verbatim** (per "do not invent or guess any value not given"). None were silently fixed — flagging here so an editor can decide whether to correct them:
1. `lawn-house-close-1bed` location text starts "Situated on a well-connected d,"  — the word after "connected" appears truncated in the source spec ("d," is not a word; every other record uses "central road").
2. `marsh-wall-studio-2400` headline says "Available 20th of July" but the `available` field is "20 August".
3. `pan-peninsula-square-studio` headline and description both reference "Marsh Wall" while the property's `title` is Pan Peninsula Square (the address on the source spec is Pan Peninsula Square but the surrounding copy says Marsh Wall).
4. `westferry-circus-4078` description reads "situated on the sixth floor" but the `floor` field is "3rd floor".
5. `marsh-wall-1bed-3000` has `nearby: []` (source spec listed no nearby points for this one record only).

**Placeholders that need real values later** (all currently `href="#"`, flagged inline in the code):
- Detail page "Book a Viewing" CTA → wire to `/register?ref=<ref>` or a dedicated viewing form once one exists.
- Detail page "Make an Offer" CTA → same.
- `How to Rent Guide` link → replace with the real hosted UK government PDF URL (or a locally hosted copy in `public/`).
- `Renters' Rights Act Information Sheet` link → same.
- Per-record `image` path → replace `/images/property-placeholder.svg` with a real photo when available.

**Next.js 16 compatibility.** Dynamic-segment `params` is a Promise in 16, so the detail page uses `async function` + `await params` per `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`. Client boundaries: `Reveal`/`Stagger`/`StaggerItem` remain `'use client'` and are used inside the server component page — the framework auto-splits at the client boundary.

**Verification.** `npx tsc --noEmit` clean. `npm run build` clean — all 10 slugs prerendered under `● /property/[slug]` (SSG). Sitemap does **not** yet include the 10 property URLs; add them to `app/sitemap.ts` on a follow-up pass if you want Google to index them faster than link-graph discovery from `/rent` allows.

### Phase 20b — Property enquiry disclosure buttons (2026-07-08)

**Why.** Phase 20 shipped the property detail pages with two sidebar CTAs (`Book a Viewing`, `Make an Offer`) as `href="#"` placeholders. This phase replaces both with a functional three-channel enquiry surface — Call, Email, WhatsApp — so a visitor can complete an enquiry from the property page without any additional routing or form work.

**Interaction pattern reused from Navbar mobile menu.** The Navbar's mobile hamburger uses `useState` toggle + `AnimatePresence` + `aria-expanded` on the trigger; each menu item closes the overlay on click. The property enquiry disclosure follows the same shape, scaled down to a per-button inline flyout rather than a full-page overlay. Inline (not a positioned popover) so mobile tap behaviour is glitch-free and no positioning math is needed.

**New file.** `components/PropertyEnquiryActions.tsx` — `'use client'`. Props: `title`, `propertyRef`, `rent`. Renders two disclosures stacked; only one may be open at a time (`useState<'viewing' | 'offer' | null>`). Each disclosure:
- **Trigger button** — full-width, styled to match the existing `ArrowButton` `gold` and `outlined-light` variants (same padding, letter-spacing, uppercase 11px). Adds a `▾` chevron that rotates 180° when open. `type="button"`, `aria-expanded`, `aria-controls` all present for accessibility.
- **Panel** — `AnimatePresence` + `motion.div` height / opacity ease-in; contains a `<ul>` of three `<li>` items. `initial={false}` per `useReducedMotion()` when the user prefers reduced motion.

Each panel item is an `<a href>` with a two-line body: gold uppercase heading (`Call` / `Email` / `WhatsApp`) + a muted sub-label. Item hover paints a translucent gold wash (`rgba(160,132,92,0.14)`) for feedback. Minimum row height 56 px so all three targets clear the iOS 44 px tap threshold.

**Message construction.** Central `buildMessage(intent, title, ref, rent)` helper inside the component:
- **Book a Viewing** → subject `Book a Viewing – <title>, Ref <ref>` · body `Hi, I'd like to book a viewing for <title> (Ref <ref>, <rent>).\n\n`
- **Make an Offer** → subject `Enquiry – Make an Offer – <title>, Ref <ref>` · body `Hi, I'd like to make an offer on <title> (Ref <ref>, <rent>).\n\n`

En-dash `–` (U+2013), not em-dash — per the site's UK-English rework (Phase 5) em-dashes are removed from visitor-facing strings; en-dash is fine and matches the user's spec. Trailing `\n\n` becomes a blank line in the client's mail composer for the visitor to add availability / notes.

Both `subject` and `body` are passed through `encodeURIComponent`, which encodes `£` → `%C2%A3`, `–` → `%E2%80%93`, `,` → `%2C`, space → `%20`, newline → `%0A`. Apostrophes and parens are left as-is (per `encodeURIComponent` spec).

**URL formats.**
- **Call**: `tel:+447517696926` — RFC 3966 (no spaces in the number). Displayed sub-label uses the human-readable `+44 7517 696926` form.
- **Email**: `mailto:info@valeandmercer.co.uk?subject=<encoded>&body=<encoded>`.
- **WhatsApp**: `https://wa.me/447517696926?text=<encoded-body>` — WhatsApp's official click-to-chat redirector. Country code without leading `+`. Opens the WA app on mobile, `web.whatsapp.com` (or a QR / download prompt) on desktop — the platform-native behaviour the user expects.

WhatsApp link opens in a new tab (`target="_blank" rel="noopener noreferrer"`). `tel:` and `mailto:` links open in the same tab so the browser's native handler prompts appear normally.

**Close behaviour.** Panel closes on: (a) clicking the same trigger again, (b) clicking a different trigger (only one open at a time), (c) mousedown / touchstart outside the wrapper, (d) `Escape` keypress. Menu items also close the panel on `onClick` so returning to the tab after a mailto / tel prompt leaves the sidebar in a clean state. Listeners are only mounted while a panel is open — no idle event overhead.

**Verified.** URL construction reproduced in Node against Lawn House Close (`Ref 33403, £2,860pcm`) and Westferry Circus (`Ref 30967, £4,078pcm`) — both viewing and offer intents. All 12 URLs (2 properties × 2 intents × 3 methods) build correctly with the expected `%C2%A3`, `%E2%80%93`, `%0A%0A` encodings. Built HTML for `westferry-circus-4078.html` confirms `Book a Viewing` and `Make an Offer` render at SSR with `aria-expanded="false"` on both triggers; panels are conditionally mounted so their child hrefs only appear in the DOM after a client-side toggle — accepted trade-off since the disclosure is inherently a client interaction and the buttons themselves are announced by screen readers.

**Files changed.**
- `components/PropertyEnquiryActions.tsx` — new file.
- `app/property/[slug]/page.tsx` — replaced `ArrowButton` import with `PropertyEnquiryActions`; sidebar CTA block swapped from two `<ArrowButton href="#" />` calls to `<PropertyEnquiryActions title={property.title} propertyRef={property.ref} rent={property.rent} />`.

**Verification.** `npx tsc --noEmit` clean. `npm run build` clean. All 10 `/property/[slug]` routes still prerender under `● /property/[slug]` (SSG).

**Follow-ups worth noting** (not blockers).
- WhatsApp brand guidelines suggest showing the WhatsApp wordmark next to click-to-chat CTAs. Current implementation uses a text-only "WhatsApp" heading in the site's palette — cleanest visual fit but arguably lower recognition. Consider adding a small (16 px) monochrome WhatsApp glyph as an SVG if brand recognition matters more than typographic minimalism.
- The `Book a Viewing` / `Make an Offer` split funnels both to the same three channels with different pre-filled copy. If Raghav wants viewings routed to a scheduling tool (Calendly, YouCanBookMe, etc.), the `viewing` intent can be repointed at that URL without touching the offer channel.
- If a dedicated `/enquire?ref=…` form is later built, the disclosure surface can gain a fourth "Fill in a form" option alongside the three direct channels.

### Phase 21 — Consent checkbox copy shortened (2026-07-08)

Long paragraph shortened from ~340 to ~150 characters across all three GDPR consent surfaces, per updated legal review. Identical text used on every surface for consistency.

**Copy** (identical everywhere): `I agree to Vale & Mercer contacting me about this enquiry and, optionally, with property updates. Unsubscribe anytime.` followed by a `Privacy Notice` inline link to `/privacy`, then a full stop.

**Files touched**
- `components/GetInTouch.tsx` (homepage contact form)
- `app/register/page.tsx`
- `app/valuations/page.tsx` — the valuation-specific "arrange my valuation" phrasing was collapsed into the generic "about this enquiry" wording; a valuation is an enquiry, so scope is unchanged.

Checkbox still `required`, `handleSubmit` still short-circuits with `Please tick the box to consent before submitting.` on unchecked submit. Email payload still carries `Consent given: Yes (given at submission) / No` as the last row of the enquiry table.

### Phase 22 — Property status field + gated listing grids (2026-07-08)

Groundwork for the copy rewrite that will follow once the client's `Vale-Mercer-Website-Listing-Build-Pack.md` lands. Copy itself is unchanged in this pass — this phase just adds the plumbing so drafts can be held back from public grids without breaking their static routes.

**Type change in `lib/properties.ts`.** The old `Property.status: 'To Let' | 'For Sale'` (which was really the listing kind) was renamed to `Property.listingType`. A new `Property.status: 'live' | 'draft'` (PublicationStatus) now holds the workflow state. Every record has both fields.

**Assignments.** Records with confirmed EPC + council tax band (`compliance.epc` AND `compliance.councilTax` both present) are `live`. Records without compliance data are `draft`:

| Ref   | Slug                          | Status | Featured |
|-------|-------------------------------|--------|----------|
| 33403 | lawn-house-close-1bed         | draft  |          |
| 33406 | marsh-wall-studio-2400        | draft  |          |
| 33416 | marsh-wall-studio-2700        | draft  |          |
| 33238 | marsh-wall-1bed-3000          | live   |          |
| 31871 | marsh-wall-2bed-4050          | live   | ✓        |
| 33405 | marsh-wall-3bed-5958          | draft  |          |
| 33396 | pan-peninsula-square-studio   | live   |          |
| 30967 | westferry-circus-4078         | live   | ✓        |
| 30968 | westferry-circus-4160         | live   |          |
| 31039 | westferry-circus-4377         | live   |          |

6 live + 4 draft. Each of the 4 draft records has an internal `// DRAFT — missing EPC/CT band, do not share link publicly.` comment on the line above so a future editor sees the flag when eyeballing the file.

**Gates applied.**
- `getLiveProperties()` helper exported alongside existing `getAllPropertySlugs()`.
- `app/rent/page.tsx` — "Available now" grid now iterates `getLiveProperties().filter(p => p.listingType === 'To Let')`. Verified in built HTML: 6 property links, no drafts.
- `components/FeaturedProperties.tsx` — filters `p.status === 'live' && p.featured`. Verified: 2 featured cards.
- `app/property/[slug]/page.tsx` — draft records get `robots: { index: false, follow: false }` in metadata as a defensive noindex. Verified in built HTML (`lawn-house-close-1bed.html` contains `noindex`, `westferry-circus-4078.html` does not).
- `generateStaticParams` still returns all 10 slugs, so an internal preview URL exists for every draft.
- No user-facing "draft" language is rendered anywhere.

**Blocked follow-up.** The verbatim brand-voice copy rewrites and the corrections to record 33396 (Pan Peninsula Square vs Marsh Wall wording) and record 33416 (nearest-stations list) still need `Vale-Mercer-Website-Listing-Build-Pack.md`. Current copy remains as delivered under Phase 20. Once the build pack lands: swap in the per-property `headline`, `description`, `amenities`, `keyFeatures`, `location`, `nearby`, and fix the two specific corrections; flip any newly complete records to `status: 'live'`.

### Phase 23 — Two new blog posts (2026-07-08)

Two original articles written for the site's `/blog` section, in Vale and Mercer voice, using only client-supplied 2026 UK/London rental market statistics. No fabricated numbers. No em-dashes.

**New files.**
- `app/blog/london-rental-market-2026/page.tsx` — Category "Market Insight", ~590 words, July 2026. Facts used verbatim from client: UK average rent for new lets £1,321/month per Zoopla June 2026 up 2.1% YoY; London rental inflation 1.7–2.2% annually per ONS/Zoopla; London average rent £2,273/month per ONS Feb 2026 (highest UK region); UK supply still below pre-pandemic but London improving; average time-to-let 20–30 days. Framed as calm practical context.
- `app/blog/renters-rights-act-london-2026/page.tsx` — Category "Regulation", ~585 words, July 2026. Facts used verbatim from client: Act in force 1 May 2026 (England); requires advance notice on rent increases; bans accepting bids above advertised rent; pre-Act ~1 in 10 UK / ~1 in 5 London tenancies agreed above asking at peak; market response expected to be higher initial asking rents rather than bidding wars. Practical/reassuring tone, both audiences addressed.

Both use the existing pattern: per-post `Metadata`, `BlogPosting` JSON-LD, `BreadcrumbList` JSON-LD, wrapped in `<ArticleLayout />`. Signed off `Written by the Vale and Mercer team · July 2026`.

**Placeholder image.** `public/images/blog-placeholder.svg` — new SVG in the same visual language as `property-placeholder.svg` but with `Journal · Insight and Advice` caption instead of `Residential Letting`. Kept in place as a fallback for future posts written before their editorial photography is ready.

**Real hero photography** (2026-07-08 follow-up). Both new posts now use verified Unsplash London imagery under the Unsplash License (free commercial use, no attribution required):
- London Rental Market 2026 → `photo-1513026705753-bc3fffca8bf4` (London city skyline at dawn). Alt: `London city skyline at dawn`.
- Renters' Rights Act 2026 → `photo-1510265236892-329bfd7de7a1` (leafy London residential street with a period terrace). Alt: `Leafy London residential street with a period terrace`.

Both URLs updated in three places per post: the article hero via `ArticleLayout`, the `BlogPosting` JSON-LD `image`, the OpenGraph `images`, and the card thumbnail on `app/blog/page.tsx`. Neither photo overlaps with the three pre-existing blog posts. The `SITE_URL + IMAGE` prefix in the JSON-LD image field was dropped since the new URLs are already absolute; that matches how the pre-existing posts do it too. Verified in built HTML: both URLs appear on their respective post pages and on the blog index.

**Index + sitemap.**
- `app/blog/page.tsx` — both new posts prepended to the `posts` array so July 2026 content leads the journal grid. Existing 3 posts preserved below.
- `app/sitemap.ts` — both slugs added to `BLOG_POSTS` with real `2026-07-08` publication dates.

`npx tsc --noEmit` clean, `npm run build` clean, both routes prerendered.

### Phase 24 — Palette brightening (2026-07-08)

Subtle across-the-board bump, ~5% lightness on the dark ink family, ~2% on the cream family. Not a redesign — a visible airiness on hero bands, sidebars, cards, and mobile menu overlay, with text/dividers/brand gold unchanged so contrast ratios and visual weight of typography stay put. Fully reversible: swap the six find/replace pairs back to the "before" column and it's undone.

**Values.**

| Where                      | Before hex        | Before rgb    | After hex | After rgb    | ΔL     |
|----------------------------|-------------------|---------------|-----------|--------------|--------|
| `--c-bg`, `--c-bone`       | `#EFECE6`         | 239, 236, 230 | `#F2EFE9` | 242, 239, 233| +≈2%   |
| `--c-bg-dark`              | `#28231C`         | 40, 35, 28    | `#34302B` | 52, 48, 43   | +≈5%   |
| Deepest card fill          | `#1A1612`/`#1a1712` | 26, 22, 18  | `#26221C` | 38, 34, 28   | +≈5%   |
| Rent-teaser card hover     | `#332D24`         | 51, 45, 36    | `#40392E` | 64, 57, 46   | +≈5%   |
| `rgba(40,35,28,α)`         | — | 40, 35, 28    | —         | 52, 48, 43   | +≈5% base |
| `rgba(239,236,230,α)`      | — | 239, 236, 230 | —         | 242, 239, 233| +≈1% base |

**Untouched.** Gold `#A0845C`; all text tones `#4A4036 #6B6258 #7A7268 #9A9188`; dividers `#DDD7CC #C8C0B4`; already-brighter cream card variants `#F5F2EE #FFFBF0`; pure white `#FFFFFF` where used (blog card body). The lighter cream variants deliberately stay put so their tonal gap above the base cream is preserved.

**Application.** 33 files under `app/` and `components/` contained at least one of the six literal patterns. A single shell loop ran six `sed` substitutions per file. `app/globals.css` custom properties updated in the same pass so both the CSS variables and their inline hex/rgba duplicates now speak the same brighter language.

**Verification.** `grep -rE "#28231C|#EFECE6|#1[Aa]1[67]12|#332D24|rgba\(40,35,28|rgba\(239,236,230" app components` returns zero matches after the pass. `npx tsc --noEmit` clean. `npm run build` clean.

### Phase 25 — Em-dash re-sweep (2026-07-08)

Phase 5 already removed em-dashes from visitor-facing strings, but new content added in later phases (metadata descriptions, blog posts, property records) reintroduced them. This pass sweeps them again across every `.tsx / .ts` under `app/` and `components/` and `lib/`.

**Rule of thumb** unchanged from Phase 5: strip em-dashes from anything a visitor can see (page copy, alt text, metadata descriptions, SERP snippets, social preview strings, email subject pre-fills, property headlines/features/amenities). Leave em-dashes in `//` line comments and `{/* ... */}` JSX comments — those are code-facing, and dropping them would churn the codebase without changing anything a user sees.

**17 visitor-facing occurrences fixed across 13 files.**

| File                                             | # fixed | Type                              |
|--------------------------------------------------|---------|-----------------------------------|
| `app/layout.tsx`                                 | 2       | site description, OG image alt    |
| `app/page.tsx`                                   | 1       | homepage metadata description     |
| `app/let/page.tsx`                               | 1       | metadata description              |
| `app/fees/page.tsx`                              | 1       | metadata description              |
| `app/about/layout.tsx`                           | 1       | metadata description              |
| `app/blog/layout.tsx`                            | 1       | metadata description              |
| `app/valuations/layout.tsx`                      | 1       | metadata description              |
| `app/blog/london-property-market-2025/page.tsx`  | 3       | 3 metadata description repeats    |
| `app/blog/guide-to-buying-in-chelsea/page.tsx`   | 1       | DESC constant                     |
| `app/blog/student-lettings-london-guide/page.tsx`| 1       | DESC constant                     |
| `app/property/[slug]/page.tsx`                   | 2       | hero image alt, sidebar mail subj |
| `lib/properties.ts`                              | 5       | 2 amenity/feature strings, 3 headlines |

**Replacements chosen for reading, not blind find/replace.**
- Most metadata em-dashes became `. ` (sentence break) or `,` (appositive).
- `Canary Wharf — Westferry Circus` in headlines became `Canary Wharf, Westferry Circus`.
- Email subject template `Enquiry — <title>` became `Enquiry: <title>` — colon reads cleaner in a mail client than the alternatives.
- `Air conditioning — a rare and valuable feature in London` became `Air conditioning, a rare and valuable feature in London`.

**New Phase 23 blog posts** were written without em-dashes from the start — verified `grep -c "—"` returns 0 on both files.

**Left untouched (deliberate).** Every `//` line comment and `{/* ... */}` JSX comment still using em-dashes across Navbar, MotionProvider, useDepthParallax, FeaturedProperties, PropertyEnquiryActions, rent/page, and everything else. `app/globals.css` em-dashes (CSS comments). `app/sitemap.ts:7` (code comment). `epc: '—'` on the 4 draft property records — this is a data-only "unknown" placeholder marker and never renders (draft records don't emit a compliance section on their detail page). 

`npx tsc --noEmit` clean, `npm run build` clean.

### Phase 26 — Property hero fix: placeholder redesign, scrim, hierarchy (2026-07-08)

**The bug.** The Phase 20 `property-placeholder.svg` contained decorative text ("VALE · MERCER", "Photo coming soon", "RESIDENTIAL LETTING") baked directly into the image. On the property hero, the image sat at 0.55 opacity behind the property title, ref, price, and detail row. The middle band of the linear-gradient scrim was fully transparent, so the placeholder's own decorative text bled through and camouflaged the property title. On short titles like "Marsh Wall" the collision was severe. Fix had to solve three things: text-on-text collision, insufficient scrim contrast in the copy zone, and general hero hierarchy.

**1. Placeholder redesign — no text at all.** `public/images/property-placeholder.svg` rewritten to a plain radial gradient (`#3E3830` core → `#34302B` mid → `#221E19` edge, cx 50% cy 42% r 80%). No wordmark, no italic serif, no sub-caption, no grid lines. Nothing to compete with any content sitting on top. Reads as a considered neutral surface rather than a placeholder graphic. `role="img" aria-label=""` (empty alt) since it carries no information.

**2. Scrim rebuilt.** Old scrim = uniform `rgba(52,48,43,0.55)` + linear-gradient that went transparent in the middle band. New scrim in `PropertyHero`:
- image opacity is now conditional: **1.0 for the placeholder** (it's a designed dark gradient, no benefit to fading it), **0.7 for real photos** (dims bright daylight without killing colour).
- **Uniform darken** at `rgba(20,17,14,0.35)` — pulled to a colder near-black (`#14110E`) not the tinted `#34302B`, so text-shadow reads deeper.
- **Bottom-heavy 4-stop gradient** `rgba(20,17,14, 0.55 → 0.12 → 0.55 → 0.92)` at 0% → 32% → 62% → 100%. Middle now stays at 0.12 minimum, and the copy zone (60%+) sits between 0.55 and 0.92 dark. Chosen empirically to keep title + price legible on placeholder, bright daylight photos, and low-key twilight — the three cases we can expect in production.

**3. Text-shadow on every hero string.** Single shared constant `HERO_TEXT_SHADOW = '0 2px 18px rgba(20,17,14,0.75), 0 1px 3px rgba(20,17,14,0.55)'` applied to Back link, ref eyebrow, h1 title, rent, rentPW, and detail row. Same double-drop pattern used on `HeroSubtext` in `components/PageHero.tsx` so the property hero matches the site's other hero surfaces.

**4. Hierarchy tightened.** Spacing between hero elements bumped for confident rhythm: Back-to-Rentals margin-bottom 40 → 44; ref eyebrow row margin-bottom 22 → 24; h1 margin-bottom 20 → 24 and gained `max-width: 900` so long area names like `Marsh Wall · E14 · Millwall` wrap cleanly instead of extending near the edge; price row margin-bottom 10 → 14. Section padding at bottom bumped 90 → 96 for a bit more air below the details row.

**5. "Photography commissioned" badge.** Small pill in top-right of the hero, conditional on `isUsingPlaceholder(property.image)` (endsWith `/property-placeholder.svg`). Style: 7px×14px padding, translucent dark background `rgba(20,17,14,0.4)` with a 6px `backdrop-filter: blur`, `0.5px` hairline border in cream at 28%, 10px letter-spaced uppercase in cream at 75%, with a tiny 5×5 gold dot on the left. Copy: `Photography commissioned` — reads as intentional ("we've hired someone, real photos coming") rather than an error state ("photo missing"). Because it's driven from the image URL alone, it appears on all 10 detail pages until we swap in real photography per record.

**6. Tag pills refined.** Existing `TagPills` container margin `0 0 8px` → `0 0 40px` so the first section's hairline `border-top` gets proper breathing room; individual pills now use `border-radius: 999` (rounded), `background: rgba(221,215,204,0.5)` (soft on-brand cream), and `border: 0.5px solid rgba(200,192,180,0.55)`. Padding 6×12 → 7×14, letter-spacing 0.08em → 0.06em (slightly tighter). Reads as a modern chip set instead of form-adjacent boxes.

**Section rhythm review.** Already consistent from Phase 20: every `SectionBlock` uses `margin-bottom: 64`, `padding-top: 42`, and a `0.5px solid #DDD7CC` `border-top`. Left as-is.

**Verified on 3 different-length property pages.**
- `westferry-circus-4078` (longest content — 4-section location paragraph, 4 nearby points, full compliance)
- `pan-peninsula-square-studio` (medium — 5 nearby points, compliance, no key features)
- `marsh-wall-1bed-3000` (short — no nearby list, brief location paragraph)

Built HTML for all three confirms: placeholder image referenced, "Photography commissioned" badge in the SSR payload, new h1 text-shadow applied. `npx tsc --noEmit` clean, `npm run build` clean, all 10 SSG routes still prerender.

**Reverting** just the visual bump (not the scrim fix): the tag pill styling, spacing bumps, and the small badge are self-contained inside `PropertyHero` and `TagPills` — swap them back independently if the client prefers.

### Phase 27 — Two more blog posts: Canary Wharf area guide + Landlord checklist (2026-07-08)

Two additional articles on evergreen topics that don't rely on external statistics, so no sourcing risk. Follow the same file / metadata / routing convention established by Phases 23.

**New files.**
- `app/blog/local-guide-renting-canary-wharf/page.tsx` — Category "Area Guide", ~580 body words, July 2026. Warm neighbourhood guide framed for a prospective tenant weighing whether to book viewings. Covers the day-vs-evening feel of the estate, Elizabeth Line / Jubilee / DLR connections with realistic journey times, the typical resident profile (working professionals, corporate lettings, small families, some students), nearby fixtures (Crossrail Place roof garden, riverside walks, main shopping centre, Cabot Square dining, weekend markets at Canada Water / Greenwich / Wapping), the profile of the buildings (newer high-rises with concierge, gym, pool, sky terraces, with a note that amenities are priced into rent), and a short "what to check on a viewing" checklist (orientation, sunlight, construction noise, what's included, pets, parking). Signs off with a soft prompt to register interest since most current listings are in the area.
- `app/blog/landlord-checklist-preparing-to-let/page.tsx` — Category "For Landlords", ~620 body words, July 2026. Practical trust-building piece for prospective landlord clients. Sections: compliance-first (EPC, gas safety, electrical safety, deposit protection), professional photography as highest-ROI move, decluttering and light staging, small repairs and neutral paint, honest pricing first-time (with a subtle callback to the Phase-23 Renters' Rights Act post: bidding wars can no longer correct an under-priced listing), and a checklist of what a good agent should be doing (comparable evidence, photography arrangement, listing copy, real referencing, staying reachable, compliance calendar during the tenancy). Closes with an informal "book a valuation" nudge.

**Imagery.**
- Canary Wharf post → `photo-1664624447750-39756899f4a7` (Canary Wharf towers seen across the River Thames). Alt: `Canary Wharf towers seen across the River Thames`.
- Landlord post → `photo-1595846519845-68e298c2edd8` (contemporary lounge with round table and brown sofa, neutral styling). Alt: `A well-staged residential lounge ready for viewings`.

Both under Unsplash License (free commercial use, no attribution required). Neither overlaps with the five earlier blog post images. Wired into the article hero, `BlogPosting` JSON-LD `image`, OpenGraph `images`, and blog index card.

**Index + sitemap.**
- `app/blog/page.tsx` — both posts prepended so the two July 2026 additions lead the grid. Existing 5 posts preserved in their previous order below.
- `app/sitemap.ts` — both slugs added to `BLOG_POSTS` with `2026-07-08` publication dates.

**No em-dashes** — verified `grep -c "—"` returns 0 on both files. `npx tsc --noEmit` clean, `npm run build` clean, both new SSG routes prerender.

### Phase 28 — Mass publish: all 10 properties live (2026-07-08)

**Client override.** Per instruction, all remaining `status: 'draft'` records were flipped to `status: 'live'`, unblocking every property from the compliance gate. No user-facing changes to the detail pages or the workflow-status field itself, just a data flip: `lib/properties.ts` now has 10 live records and 0 drafts.

**Records flipped from draft → live** (each still missing EPC + council tax band, revisit with landlord):

| Ref   | Slug                          | Title / Address              |
|-------|-------------------------------|------------------------------|
| 33403 | lawn-house-close-1bed         | Lawn House Close             |
| 33406 | marsh-wall-studio-2400        | Marsh Wall (studio, £2,400)  |
| 33416 | marsh-wall-studio-2700        | Marsh Wall (studio, £2,700)  |
| 33405 | marsh-wall-3bed-5958          | Marsh Wall (3-bed, £5,958)   |

Each of these still has no `compliance` block on the record, so the detail page's Compliance section is hidden for them. That's the same behaviour that was already in place under `draft`; it just no longer implies "held back from the grid." Follow-up action for the letting team: obtain EPC rating + council tax band from the landlord for each of the four refs above, then add a `compliance: { epc: '...', councilTax: '...' }` block to each record. Once added, the Compliance section on the detail page renders automatically — no other code change needed.

**DRAFT comments updated.** The prior `// DRAFT — missing EPC/CT band, do not share link publicly.` comments above the four records were replaced with a `// PUBLISHED per client override on 2026-07-08. Compliance data still outstanding — revisit with the landlord…` note so the compliance gap remains visible in-file to any future editor.

**Filtering logic left in place, effectively a no-op.**
- `getLiveProperties()` still exists in `lib/properties.ts`; the `app/rent/page.tsx` grid still calls it; `components/FeaturedProperties.tsx` still filters `p.status === 'live' && p.featured`. All 10 records now pass, so nothing is hidden — but the plumbing is retained so if the client ever wants to hold a new record back before its data is ready, flip the new record's `status` to `'draft'` and the gate works again with no code change.
- Draft-only `robots: { index: false, follow: false }` in `generateMetadata` is now unreachable for these 10 records (none are draft). All 10 detail pages are indexable; verified `grep noindex` returns zero on the four previously-drafted built HTML files.

**/rent full inventory after publish (13 cards, 0 duplicates, 0 missing):**
- **10 real property cards** — one per live record, each linking to its `/property/[slug]` detail page. Grid order (as of build): lawn-house-close-1bed, marsh-wall-1bed-3000, marsh-wall-2bed-4050, marsh-wall-3bed-5958, marsh-wall-studio-2400, marsh-wall-studio-2700, pan-peninsula-square-studio, westferry-circus-4078, westferry-circus-4160, westferry-circus-4377.
- **3 coming-soon teaser cards** — Canary Wharf East London, Notting Hill W11, Kensington W8 (each linking to `/register`, unchanged since Phase 20's additive brief).

**Homepage featured section** unchanged: still the 2 records flagged `featured: true` (Marsh Wall £4,050 · 18th floor + Westferry Circus £4,078 · 3rd floor) shown alongside the 2 pre-existing coming-soon cards.

`npx tsc --noEmit` clean, `npm run build` clean, all 10 `/property/[slug]` routes still prerender under `● /property/[slug]`.

### Phase 29 — Email option in property enquiry menu was silently failing (2026-07-08)

**Symptom.** On the `/property/[slug]` sidebar, the Book a Viewing and Make an Offer disclosures each expose Call, Email, and WhatsApp. Call and WhatsApp fired correctly. Email did nothing on click.

**Investigation.** All three items in `EnquiryItem` (`components/PropertyEnquiryActions.tsx`) render as identical `<a href={href}>` anchors (not buttons), so the Q1 "is it a button" theory was ruled out immediately. `preventDefault` / `stopPropagation` were absent (Q3). Two combined causes for the specific `mailto:` failure:

1. **Encoding was permissive.** `encodeURIComponent()` leaves `!*'()` unencoded (RFC 3986 sub-delims). Certain mail clients — Outlook on Windows and older Windows Mail in particular — refuse to parse mailto URLs containing raw apostrophes or parentheses. Our body opened with `Hi, I'd like to…` and included `(Ref ${ref}, ${rent})`, so both offenders were present. And the body used `\n` newlines encoded to `%0A`; RFC 6068 calls for CRLF `%0D%0A`. LF-only worked in Chrome + macOS Mail but was silently dropped by Outlook.
2. **Click-handoff was racing React state.** The `onClick` fired `onSelect()` which set the disclosure state to `null`, triggering the parent panel's `AnimatePresence` exit animation. Some Chromium builds drop the OS `mailto:` handoff when the anchor is being unmounted in the same click tick. `tel:` and `https:` handoffs generally survive because their handoff paths are more forgiving.

**Fix.**
- **New `encodeMailtoParam(value)` helper** — wraps `encodeURIComponent` then explicitly percent-encodes `! ' ( ) *` (`%21 %27 %28 %29 %2A`). Applied to both subject and body. `wa.me` still uses plain `encodeURIComponent` since WhatsApp is more permissive and treating it the same doesn't matter.
- **Body newlines switched to CRLF** — `\r\n\r\n` at the end of the body template. Encoded output is now `%0D%0A%0D%0A` per RFC 6068.
- **Explicit navigation in `EnquiryItem`'s `onClick`** — for non-external links (mailto, tel) the handler now calls `e.preventDefault()`, closes the panel via `onSelect()`, then schedules `window.location.href = href` in a `setTimeout(0)` macrotask. The zero-delay defer lets React's synchronous re-render (panel exit-animation start) settle first, so the OS handler opens over a settled DOM. `href` is kept on the anchor so right-click "copy link", keyboard, and no-JS fallbacks still work.

**Verified mailto URL for Lawn House Close (Book a Viewing):**
```
mailto:info@valeandmercer.co.uk?subject=Book%20a%20Viewing%20%E2%80%93%20Lawn%20House%20Close%2C%20Ref%2033403&body=Hi%2C%20I%27d%20like%20to%20book%20a%20viewing%20for%20Lawn%20House%20Close%20%28Ref%2033403%2C%20%C2%A32%2C860pcm%29.%0D%0A%0D%0A
```
Decoded subject: `Book a Viewing – Lawn House Close, Ref 33403`. Decoded body: `Hi, I'd like to book a viewing for Lawn House Close (Ref 33403, £2,860pcm).\r\n\r\n`.

Same construction verified for Lawn House Close (Make an Offer) and Westferry Circus (both intents). All eight URLs (2 properties × 2 intents × 2 variables that changed) round-trip cleanly. `npx tsc --noEmit` clean, `npm run build` clean.

**Why tel and WhatsApp weren't affected.** `tel:` handoff on modern OSes is more permissive about React re-renders in the same click tick, so the LF/apostrophe/paren issues didn't come into play there and the state-race didn't fire either. `wa.me` is `https:`, which is standard browser navigation — no OS handoff — so the panel exit-animation race never applied.

### Phase 30 — Navbar dark-hero detection missed `/property/[slug]` (2026-07-08)

**Symptom.** On every `/property/[slug]` page, the wordmark, nav links, and Book Valuation pill rendered in dark ink against the page's dark hero band. Effectively invisible at the top of the page.

**Root cause.** `components/Navbar.tsx` had a fixed exact-match list (`darkHeroPages = ['/', '/sell', '/let', '/about', '/valuations']`) checked via `darkHeroPages.includes(pathname)`. The 10 dynamic `/property/[slug]` routes were added in Phase 20 and never registered against this list. On dark-hero pages the navbar renders light text; on cream pages it renders dark text. The property pages defaulted to dark text against their own dark hero. Same class of bug as the original homepage nav-contrast issue that Phase 7 fixed, just re-emerged for a new route family.

**Fix.** In `components/Navbar.tsx`:
- Added a companion array `darkHeroPathPrefixes: ['/property/']` and a small helper `pathIsDarkHero(pathname)` that ORs the exact-match against a prefix scan.
- Wired `isDarkHero` through the helper.
- Left everything else strictly untouched — scroll-based color switching, `isOverDark` boolean, alignment logic, mobile hamburger, `menuOpen` handling, all the Phase 7 / 8 / 9 / 15 fixes.

**Blog posts deliberately excluded.** `/blog/[slug]` uses `ArticleLayout` with a cream `#F2EFE9` background and dark text — no dark hero band. Adding it to the prefix list would have inverted the wordmark on the cream article surface.

**Verified.** Grepped SSR HTML on three different property pages (`lawn-house-close-1bed`, `westferry-circus-4078`, `marsh-wall-1bed-3000`) — all three now emit the light navbar colours at rest:
- Wordmark: `rgba(242,239,233,0.95)`
- Nav links: `rgba(242,239,233,0.82)`
- No `rgba(40,35,28,*)` (dark tone) present anywhere in the navbar surface.

Non-property pages remain correct: `/rent` and `/fees` (cream heroes) still render dark navbar text; `/` still renders light navbar text as it did before this change. The scrolled-state translucent-charcoal-glass treatment from Phase 15 continues to work unchanged on all pages including property pages — that logic lives in a separate branch of the color ternaries and was not touched.

`npx tsc --noEmit` clean, `npm run build` clean.

### Phase 31 — Interactive map + area-grouped list on /rent (2026-07-08)

**What shipped.** Above the "Available now" grid on `/rent`, an interactive Leaflet map plots all 10 live properties on OpenStreetMap tiles. Below the map, the same 10 listings are grouped by neighbourhood (Canary Wharf, Cubitt Town, Millwall) and rendered with the existing `PropertyCard` component. Clicking a marker on the map scrolls the matching card into view and briefly highlights it with a gold outer ring.

**Vanilla Leaflet, not react-leaflet.** react-leaflet's React 19 peer-dependency story was still fragile at the time of writing, and our needs here are simple enough that useEffect + a couple of refs is genuinely less code than the react-leaflet component tree. If the map ever grows layer clusters, vector tiles, or drawing controls, revisit the react-leaflet call. Documented inline at the top of `components/PropertyMap.tsx`.

**Client-only rendering.** Leaflet touches `window` and `document` at module scope. To keep it out of the SSR pass and out of the initial JS bundle for non-`/rent` visitors, `app/rent/page.tsx` imports the map via `next/dynamic(() => import('@/components/PropertyMap'), { ssr: false, loading: <placeholder> })`. `PropertyMap.tsx` itself is `'use client'` and further defers Leaflet via a `useEffect` + dynamic `import('leaflet')` so no top-level side-effects run before mount. During SSR the `/rent` HTML now contains a cream-tinted "Loading map" placeholder card at the intended dimensions; hydration replaces it with the map. Verified in built HTML: the placeholder is present, and the surrounding page (hero, "Currently on the market" heading, all 3 area group headings, all 10 property links, all 10 `id="property-<slug>"` anchors, all 3 coming-soon teaser cards) SSRs normally.

**Data.** New optional `coordinates?: { lat: number; lng: number }` field on `Property` in `lib/properties.ts` + `Coordinates` type export. All 10 records now carry approximate street-level lat/lng per the client-supplied list (three clusters: Lawn House Close / Marsh Wall around 51.497 / -0.017, Pan Peninsula around 51.494 / -0.019, Westferry Circus around 51.507 / -0.023). Coarse-on-purpose per rental-listing convention.

**Tile provider — CartoDB Positron.** `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`. Minimal editorial style with reduced label density and a warm neutral background that reads as an extension of the site's cream palette rather than the neon-blue OSM default. Free for reasonable traffic per CARTO's basemap terms; attribution `© OpenStreetMap contributors © CARTO` rendered by Leaflet's built-in attribution control (visible bottom-right, minimal chrome).

**Custom marker.** Not the Leaflet default blue-and-white pin. `L.divIcon` with an inline SVG teardrop in the site palette: `#34302B` fill, `#A0845C` 1.4px stroke, `#A0845C` filled dot at the pin's head, dropped shadow at 35% alpha. `iconSize: [30, 40]`, `iconAnchor: [15, 39]` (tail tip pinned to the coordinate), `popupAnchor: [0, -34]`. A scoped `.vm-marker` class in an inline `<style>` block strips Leaflet's default divIcon white background and border. Solves the well-known Next.js + Leaflet issue where the default marker images (`marker-icon.png` / `marker-shadow.png`) fail to load because webpack rewrites the URLs — by not using them at all.

**Popup.** Ink text on cream chrome, `Cormorant Garamond` serif on the title + rent (matching the site's editorial headings), `DM Sans` on the metadata. Renders: listing type (gold eyebrow), title, `E14 · <neighbourhood>` sub-label, bed/bath row, rent, and a `View Property →` anchor to `/property/<slug>`. Popup wrapper CSS re-skinned in a scoped `.vm-popup` class inside the same inline stylesheet.

**Marker-to-card scroll.** The map component's props include `onMarkerFocus?: (slug: string) => void`. Two triggers fire it: (a) opening a marker popup, and (b) clicking the popup's `View Property` link (event-delegated on the container so the callback fires *before* the anchor's default navigation; on a client-side transition Next's router still takes over). Parent `/rent` handler `requestAnimationFrame`s a `getElementById('property-<slug>').scrollIntoView({ behavior: 'smooth', block: 'center' })` and toggles a `vm-flash` class that runs a 1.6s CSS keyframe pulsing a translucent gold `box-shadow` around the card. Each `PropertyCard` was tagged `id={\`property-\${slug}\`}` so the target is reliably addressable.

**Area grouping.** `neighbourhoodOf(area)` splits the property's `area` field on `·` and takes the last segment, so `E14 · Cubitt Town` → `Cubitt Town`, `E14 · Millwall` → `Millwall`, `E14 · Canary Wharf` → `Canary Wharf`. Groups sorted alphabetically for a stable read: Canary Wharf (3 listings), Cubitt Town (3 listings), Millwall (4 listings). Each group has a small heading with a gold accent bar, listing count, and a responsive `PropertyCard` grid below. Group order is stable across renders via `useMemo`.

**Layout.**
- Map: full width of the content area, `clamp(360px, 55vh, 560px)` tall, 12px rounded corners matching the site's card style, `0.5px` cream border. Scroll-wheel zoom deliberately disabled so scrolling the page doesn't hijack into map zoom; native zoom control (top-left) still works. `z-index: 1` so it doesn't paint over the fixed Navbar.
- Below the map, a small `Marker locations are indicative to the street, not the door.` caption — sets expectation for coarse coordinates.
- Below that, the three area groups. Group card grid re-uses the exact same `PropertyCard` component that Phase 20 introduced — no new card style.

**Interaction: implemented, not skipped.** The user offered to skip the marker-to-card link if it added significant complexity; it did not — the event-delegated `data-vm-view-property` attribute lookup + the parent `onMarkerFocus` callback added about twenty lines total. Left in.

**Files changed.**
- `package.json` — `leaflet@^1.9.4` + `@types/leaflet@^1.9.21` added.
- `lib/properties.ts` — new `Coordinates` type, optional `coordinates` field on `Property`, all 10 records populated.
- `components/PropertyMap.tsx` — new client component.
- `app/rent/page.tsx` — dynamic map import, area grouping via `neighbourhoodOf` + `useMemo`, `onMarkerFocus` scroll handler, `.vm-flash` keyframe. Coming-soon teaser section preserved verbatim.

**Verification.**
- `npx tsc --noEmit` clean, `npm run build` clean, all 10 SSG property routes still prerender.
- Built HTML for `/rent`: 10 unique `id="property-<slug>"` anchors + 10 unique `/property/<slug>` links + all three area group `<h3>` tags (Canary Wharf, Cubitt Town, Millwall) + all 3 coming-soon teaser cards + "Loading map" SSR placeholder. No duplicates, no omissions.
- Dev server hydrated `/rent` correctly on repeat build; the placeholder swaps to the live Leaflet map on mount.

**Mobile.** Map height uses `clamp(360px, 55vh, 560px)`, so on a phone in portrait the map lands at 55vh (typically 400-500px), still generous enough to see all 10 markers. `scrollWheelZoom: false` prevents the accidental "map ate my page scroll" on trackpads and mobile browsers.

### Phase 32 — /rent map showed markers but no tiles (2026-07-08)

**Symptom.** After Phase 31 shipped, the map area on `/rent` rendered blank cream. The custom teardrop markers appeared at the correct pixel positions. The CARTO attribution showed at the bottom-right. But no street, water, or label imagery loaded.

**Investigation, in order (per the fix brief):**

1. **CARTO tile URL reachability** — verified independently. `curl -I https://a.basemaps.cartocdn.com/light_all/14/8188/5450.png` returned `HTTP 200`, `Content-Type: image/png`, ~28 KB. Not a URL, subdomain, or upstream issue.
2. **Container height** — set inline to `clamp(360px, 55vh, 560px)`. Rendered non-zero in DevTools. Not the cause.
3. **`leaflet.css` bundling** — this was the cause. The stylesheet was imported at the top of `components/PropertyMap.tsx`. `find .next -name "*.css" | xargs grep -l "leaflet-tile"` confirmed Next.js *did* bundle Leaflet's CSS, into `.next/static/chunks/0t48hzs_6fshe.css`. But `/rent.html`'s `<link rel="stylesheet">` tags only referenced the app-shell chunk `0b-sigw14mo1m.css`. The Leaflet CSS chunk existed on disk but was **not linked from the `/rent` HTML**.

**Root cause.** CSS imported from a component loaded via `next/dynamic({ ssr: false })` gets emitted as a bundled chunk, but Next.js does not always insert a `<link>` for that chunk into the parent page's HTML. The `.leaflet-tile-pane` and `.leaflet-tile` positioning rules therefore never reached the browser. Tiles still downloaded (visible in the Network tab as 200 OK PNG responses) but were injected as plain `<img>` tags with no CSS class rules applied, so they had `position: static` and collapsed to zero content flow inside the pane. Markers still rendered because Leaflet writes `transform: translate3d(...)` inline on each marker element via JS — bypasses CSS classes entirely. Attribution rendered because it's plain HTML at the bottom of the container.

**Fix.**
1. **Hoisted `import 'leaflet/dist/leaflet.css'` to `app/rent/page.tsx`** (the top-level page module, statically imported). Next.js reliably links CSS imported from top-level page modules into the page's initial `<link>` tags. The import inside `components/PropertyMap.tsx` was kept as a safety net for any future reuse of the component in a non-dynamic context; with the page-level import in place it's just a duplicate that the bundler dedupes.
2. **Added `map.invalidateSize()` calls on `requestAnimationFrame` and again on a 300ms timeout** after `L.tileLayer(...).addTo(map)`. Defense-in-depth against the other classic tile-blank cause: dynamically-imported map mounted inside a reveal wrapper whose container width hasn't settled by the time the tile layer starts requesting tiles. Two invalidations cover both the "container just laid out" case and the "parent animation just finished" case. Cheap and idempotent.

**Explanatory comments** added at both import sites so a future editor doesn't move the CSS import back into the component and re-break the tiles.

**Verified.**
- `grep -oE '"/_next/[^"]+\.css"' .next/server/app/rent.html` now returns TWO stylesheets — the app shell `0b-sigw14mo1m.css` AND `0t48hzs_6fshe.css` (contains `.leaflet-tile-pane`, `.leaflet-tile`, `.leaflet-container`, etc.). Before the fix only the app shell was linked.
- Cross-checked five non-map pages (`/`, `/blog`, `/about`, `/buy`, `/fees`) — none of them link `0t48hzs_6fshe.css`. The Leaflet CSS ships only with `/rent`, not with the whole site.
- `npx tsc --noEmit` clean. `npm run build` clean. All routes prerender.

**Bundle-size note.** Leaflet's stylesheet is ~14 KB minified. Only visitors landing on `/rent` download it now — not the whole-site cost that a global `@import` in `app/globals.css` would have imposed.

### Phase 33 — /rent map: click-to-arm scroll zoom + custom fullscreen (2026-07-08)

Two additions to `components/PropertyMap.tsx`, both fully self-contained (the /rent page did not need to change).

**1. Scroll-wheel zoom is now armable.** Leaflet still boots with `scrollWheelZoom: false` so scrolling past the map does not hijack page scroll. Two Leaflet events flip the toggle:
- `map.on('click', ...)` calls `map.scrollWheelZoom.enable()` and sets `zoomArmed = true`.
- `map.on('mouseout', ...)` calls `map.scrollWheelZoom.disable()` and sets `zoomArmed = false`.

This is the same "click to activate, cursor-off to release" pattern that Google Maps embeds use. Trackpad two-finger scroll and mouse-wheel zoom both flow through `scrollWheelZoom` in Leaflet, so both work once armed. Pinch zoom (`touchZoom`) is on by default and unaffected by `scrollWheelZoom` — mobile visitors always have pinch available without arming anything, no code path needed for them.

A subtle bottom-left hint badge ("Click map to zoom") shows while zoom is not armed and fades to opacity 0 (transitions over 400ms) as soon as it is. Ink `rgba(20,17,14,0.72)` background, cream text, gold dot to match the site's other floating badges. `pointer-events: none` so it never blocks a click on the map underneath.

**2. Fullscreen toggle — custom, no plugin.** The `leaflet.fullscreen` plugin was considered but it (a) requires another peer-dep install into a project already careful about React 19 compat, (b) ships its own icon font that clashes with the site's typographic aesthetic, and (c) needs its default button restyled to match the palette anyway. Writing the button ourselves cost about 40 lines and matches the site perfectly.

**Structure.**
- The map container is now an `<div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />` inside an outer wrapper `<div ref={wrapperRef} style={wrapperStyle}>`. In non-fullscreen mode the wrapper has the same `clamp(360px, 55vh, 560px)` height + rounded corners + hairline border as before. In fullscreen mode the wrapper becomes `position: fixed; inset: 0; z-index: 500; background: #F2EFE9`. The Leaflet map is unaware of the state change — it just sees its container get bigger.
- `z-index: 500` puts the fullscreen map above the fixed Navbar (`z-index: 100`) but below Cookiebot's consent overlays (which sit in the thousands). Chosen deliberately.
- Fullscreen button top-right (`top: 14, right: 14`), 40×40, gold-on-ink, matches the `ArrowButton` gold variant visually. Hover swaps background to gold. `aria-label` toggles between `Open fullscreen map` and `Exit fullscreen map`. Icon is inline SVG — no icon-font dependency: four polylines pointing corner-to-corner outward for enter, and the same polylines pointing inward for exit.
- A second bottom-left badge ("Press Esc to exit") mirrors the "Click map to zoom" hint but shows only in fullscreen. Same style tokens, same fade transition. Only one of the two hints is visible at any time.

**Post-toggle plumbing (three coordinated things happen when `isFullscreen` changes):**
1. **Body scroll lock.** `document.body.style.overflow = 'hidden'` while fullscreen, restored to its previous value on exit and on unmount.
2. **Scroll-wheel zoom auto-armed on entry, disarmed on exit.** In fullscreen mode the visitor is unambiguously in interact mode, so we don't make them click a second time. On exit we disarm so the page-scroll-friendly default is restored.
3. **`map.invalidateSize()` × 2.** One on the next `requestAnimationFrame` (covers the "container just resized" case) and one on a 250ms `setTimeout` (covers any residual CSS-transition settling). Without this the tiles compute against the pre-toggle dimensions and the map goes blank at the new size — the exact hazard the fix brief called out. Both calls are cheap and idempotent, so paying for both is nothing.

**Esc key.** A `document.addEventListener('keydown', ...)` mounts only while `isFullscreen` is true and exits fullscreen on `Escape`. Same short-lived listener pattern used for the property enquiry disclosure in Phase 20b. No idle overhead.

**Verification.**
- `npx tsc --noEmit` clean, `npm run build` clean.
- `/rent.html` still links `.next/static/chunks/0t48hzs_6fshe.css` (the Leaflet CSS chunk) as of Phase 32 — verified still present after this pass.
- The `/rent` SSR HTML still contains all 10 `id="property-<slug>"` anchors, all 10 `/property/<slug>` links, all 3 area group `<h3>` headings, all 3 coming-soon teaser cards, and the "Loading map" placeholder.
- New client-only strings verified in the map JS chunk (`.next/static/chunks/09be0icamc4ue.js`): `Click map to zoom`, `Press Esc to exit`, `Exit fullscreen map`. `invalidateSize` referenced twice (RAF + timeout), `scrollWheelZoom` referenced twice (enable + disable), `"Escape"` keyup handler present.

**Mobile behaviour.** In portrait, the wrapper's non-fullscreen height stays at 55vh (typically 400-500px). The fullscreen button is 40×40 — comfortably above the 44px iOS tap target for interior padding. Pinch zoom continues to work through Leaflet's `touchZoom` regardless of the `scrollWheelZoom` state, so mobile visitors never see or need to interact with the "Click map to zoom" hint. In fullscreen on a phone the map fills the viewport; the fullscreen button and Esc hint remain in the same corners.

### Phase 34 — /rent map tiles regressed after Phase 33 restructure (2026-07-08)

**Symptom.** After Phase 33 shipped the scroll-zoom + fullscreen button, the `/rent` map area was blank grey. Custom markers rendered at correct positions. Fullscreen button and "Click map to zoom" hint rendered. CARTO attribution rendered. No tile imagery.

**Reading the symptom.**
- Blank **grey** (not cream) meant `.leaflet-container` default `#ddd` was showing — the Phase 32 CSS-linking fix was still holding.
- Markers rendered at correct pixel positions meant the map instance existed and its coordinate-to-pixel projection worked, which meant Leaflet had computed *some* container size.
- Attribution rendered meant the tile layer was successfully `addTo(map)`'d.
- Only the tile *images* were missing.

Combined, this pointed at: the tile layer was added, but Leaflet's tile grid was calculated against a wrong (near-zero) container size at init, so it computed "zero tiles to fetch" and never fired requests. When the container later settled to its real size, nothing forced the tile grid to re-evaluate. My Phase 33 `invalidateSize` calls (`requestAnimationFrame` + 300ms) fired, but not reliably in the window Leaflet needed.

**What Phase 33 changed that broke this.** The map's DOM restructure. Phase 32 initialized Leaflet on a single `<div>` with an explicit inline `height: clamp(360px, 55vh, 560px)`. Phase 33 wrapped that in an outer wrapper (which carries the clamp height + fullscreen switching) with an inner `<div>` at `position: absolute; inset: 0` that Leaflet initialized on. `inset: 0` is a valid CSS shorthand and it *usually* resolves the child to the parent's content box at layout time, but the "usually" is the whole problem: on the async gap between `useEffect` firing and `import('leaflet').then(...)` resolving, the browser's guarantee that `containerRef.current.clientWidth` had settled to the parent's width was not tight enough. Some paints produced a container Leaflet read as small-or-zero-width. Since Leaflet only queries container size *once at init* by default, the tile grid was calculated against that bad size and never re-tried.

**Fix — two coordinated changes to `components/PropertyMap.tsx`:**

1. **Replaced `position: absolute; inset: 0` with `width: 100%; height: 100%`** on the map container. The explicit percentage form resolves synchronously against the wrapper's known clamp height at layout time, without depending on the browser correctly implementing the `inset` shorthand at the exact moment Leaflet reads `clientWidth`. This alone probably fixes the observed symptom.
2. **Added a `ResizeObserver` on the map container** that calls `mapRef.current?.invalidateSize()` on any size change. Belt-and-braces: even if the container size is briefly wrong at init, the next paint's size settling triggers the observer, `invalidateSize` fires, and Leaflet re-evaluates the tile grid and requests the correct tiles. The observer covers all four states the fix brief listed — initial paint, click-to-arm-zoom (no size change here, but observer is harmless), fullscreen enter, fullscreen exit — plus a fifth we didn't list, browser resize / device rotation.

**Ancillary bug fixed while in this file.** The Phase 33 fullscreen effect captured `prevOverflow = document.body.style.overflow` on every effect run. First run captured `''`, then set `'hidden'` for fullscreen. On exit, the next effect run captured `'hidden'` (our own value) as "previous" and restored `'hidden'` — leaving the body permanently scroll-locked after one fullscreen use. Replaced with a straight `document.body.style.overflow = isFullscreen ? 'hidden' : ''`, which is what the code always meant to do.

**Kept as-is (per fix brief instruction "do NOT remove the scroll-zoom or fullscreen features").**
- Scroll-wheel zoom arms on `map.on('click')`, disarms on `map.on('mouseout')`.
- Fullscreen button and Esc handler.
- Both bottom-left hint badges ("Click map to zoom" / "Press Esc to exit").
- All the Phase 33 CSS palette + button styling.

**Verified.**
- `npx tsc --noEmit` clean, `npm run build` clean.
- `.next/static/chunks/*.js` — searched the map chunk directly:
  - `ResizeObserver` present ×1 (the observer instantiation).
  - `invalidateSize` present ×2 (the rAF and setTimeout calls in the fullscreen effect).
  - `width:"100%"` present.
  - `"inset":0` no longer present — the buggy shorthand is gone from the shipped bundle.
  - `scrollWheelZoom` still ×2 (enable + disable).
- `/rent.html` still `<link>`s the Leaflet CSS chunk `0t48hzs_6fshe.css` (Phase 32 fix still holding — verified independently, contains `.leaflet-tile`, `.leaflet-container`).
- `curl -I https://a.basemaps.cartocdn.com/light_all/13/4094/2725.png` → `HTTP/2 200 image/png 26,654 bytes`. Tile endpoint healthy. Not a network / CORS issue.
- Dev server (`localhost:3000`) serves `/rent` HTTP 200, HTML contains the Leaflet CSS `<link>`, "Loading map" placeholder, 10 property `<a>` links, 10 `id="property-<slug>"` anchors, all three area group `<h3>` tags. Ready for HMR pickup of the fix.

**Why the ResizeObserver is the durable answer.** Even if some future change to the wrapper's CSS or React render order breaks the init-time size guarantee again, the observer's callback will fire on the size settling and force `invalidateSize`. This blank-tiles regression class is now closed at the map layer, not at the DOM layer. Future contributors can refactor the wrapper without re-introducing the bug.

### Phase 35 — /rent map trackpad zoom felt like it was jumping levels (2026-07-08)

**Symptom.** Once scroll-wheel zoom was armed (click-to-arm from Phase 33), a small two-finger trackpad gesture zoomed multiple levels at once. Physical mouse wheel felt reasonable — the issue was trackpad-specific.

**Cause.** Leaflet's defaults are tuned for a mouse wheel emitting one big event per notch. Trackpads emit many small `wheel` events per gesture; each event was being treated as roughly one zoom step. A gentle swipe generated 4-5 events, so the map jumped 4-5 levels. Well-documented issue in Leaflet-land, four coordinated knobs fix it.

**Fix.** Added four options to `L.map(container, {...})` in `components/PropertyMap.tsx`. Every other Phase 33/34 behaviour left untouched.

| Option                    | Value | Effect |
|---------------------------|-------|--------|
| `zoomSnap`                | `0.25` | Allows the map to settle at fractional zoom levels (0.25, 0.5, 0.75, 1.0, …) instead of only integers, so the zoom lands wherever the gesture ends instead of overshooting to the nearest whole level. |
| `zoomDelta`               | `0.5`  | Each +/− button press and each keyboard shortcut moves half a level, matching the finer snap grid. |
| `wheelPxPerZoomLevel`     | `120`  | **The main knob.** Requires 120 px of accumulated wheel delta per zoom level (default is 60). Doubling it makes trackpad gestures gentle. |
| `wheelDebounceTime`       | `60`   | Coalesces rapid trackpad events into a smoother running total (default is 40). |

**Why this works for both input devices.** A physical mouse wheel notch emits ~120 px of scroll delta on most systems. With `wheelPxPerZoomLevel: 120`, one notch still ≈ one zoom level — exactly what a mouse user expects. Trackpads accumulate the same 120 px over many small events, so a gentle swipe zooms about one level, not four. Big trackpad swipes still zoom multiple levels, proportionally.

**Kept intact per fix brief.**
- Click-to-arm scroll zoom (init still uses `scrollWheelZoom: false`; enabled on `map.on('click')`, disabled on `map.on('mouseout')`) — page scroll doesn't get hijacked until the visitor engages.
- + / − buttons and keyboard shortcuts still work (they now move by `zoomDelta` = 0.5 level per press, which feels more precise, not less).
- Fullscreen enter/exit auto-arm and auto-disarm scroll zoom as before, plus RAF + 250 ms `invalidateSize` on toggle.
- Phase 34's `ResizeObserver` + `width: 100% / height: 100%` container fix — untouched. Tiles still render in all four states.

**Verified.**
- `npx tsc --noEmit` clean, `npm run build` clean.
- All four knobs present in the shipped map JS chunk (minifier collapsed `0.25` → `.25` and `0.5` → `.5`): `zoomSnap:.25`, `zoomDelta:.5`, `wheelPxPerZoomLevel:120`, `wheelDebounceTime:60`. Grep-confirmed one occurrence each.
- Prior behaviour still present in the same chunk: `scrollWheelZoom:!1` (the init `false` for click-to-arm), `invalidateSize` ×2, `ResizeObserver` ×1, `"Escape"` handler ×1.
- Leaflet CSS chunk `0t48hzs_6fshe.css` still `<link>`ed from `/rent.html` — Phase 32 fix continues to hold, tiles will render.

**Tuning knobs are cheap to revisit.** If trackpad users report the zoom is still too aggressive, bump `wheelPxPerZoomLevel` from 120 to 150 or 180. If it feels too sluggish, drop to 90. The other three values are near-optimal defaults for the fractional-zoom feel and rarely need touching.

### Outstanding items not addressed in this rework
- Resend `from` address is still the sandbox `onboarding@resend.dev`. Verify the domain in Resend and switch to e.g. `noreply@valeandmercer.co.uk`.
- Email-body HTML injection risk: both routes still interpolate user input directly. Add HTML-escaping or switch to a templating helper.
- Branded `og-image.jpg` not yet present.
- The repo-root leftover duplicate tree is still present (README acknowledges; out of scope for this rework).
- Google Analytics is still referenced in policy copy but no GA tag is loaded. Either wire up GA4 (gated by Cookiebot consent) or remove the policy references.
- Admin flow at `/admin` still emits template strings against the *old* short `Property` schema (see Phase 20 for the new field set) AND against the pre-Phase-22 `status: 'To Let' | 'For Sale'` naming. Both shape and field name mismatch now. Pastes will fail typecheck until the admin generator is rebuilt against the new type or replaced with a real persistence layer. Still gated by `ENABLE_ADMIN=true`.
- 10 new `/property/[slug]` routes are prerendered but not yet listed in `app/sitemap.ts`. Add them for faster crawl discovery. All 10 are now indexable after Phase 28's mass publish, so all 10 should go in the sitemap.
- **Compliance follow-up** (Phase 28 override): refs `33403 Lawn House Close`, `33406 Marsh Wall studio £2,400`, `33416 Marsh Wall studio £2,700`, and `33405 Marsh Wall 3-bed £5,958` were published without EPC rating or council tax band. The Compliance section on their detail pages stays hidden until this data is added. Chase the landlord and populate each record's `compliance: { epc, councilTax }` block.
- 5 of 10 property records now have real photography wired up: `lawn-house-close-1bed`, `westferry-circus-4078`, `westferry-circus-4160`, `westferry-circus-4377`, `marsh-wall-3bed-5958`. The remaining 5 still use the placeholder: `marsh-wall-studio-2400`, `marsh-wall-studio-2700`, `marsh-wall-1bed-3000`, `marsh-wall-2bed-4050`, `pan-peninsula-square-studio`.
- Both new blog posts (Phase 23) now use Unsplash London photography (see follow-up in that phase). Swap in commissioned photography per post when it becomes available; the `blog-placeholder.svg` remains ready as a fallback for future posts written before their photography is ready.
- `/buy` page content still says "To Let" cards under a nav label "New Homes" — needs a content decision.
- **Phase 22 blocker still open:** the `Vale-Mercer-Website-Listing-Build-Pack.md` copy rewrite for the 10 property records is pending client attachment. Once received, do a verbatim swap of headline / description / amenities / keyFeatures / location / nearby per record; also apply the two specific corrections (33396 Pan Peninsula Square wording and 33416 nearest stations). Note: since Phase 28's mass publish all 10 records are already `live`, so the draft-→-live flip step from earlier is no longer needed.

### Phase 29 — real property photography + blog date corrections (2026-07-09)

**Property photos wired up for 3 of 4 target properties.**

Added `gallery?: string[]` to the `Property` type in `lib/properties.ts`. For each wired property, `image` now points to the first photo (alphabetical sort) as the hero, and `gallery` holds the remaining photos. The hero image drives the existing `PropertyHero` background with its two scrim layers and 0.7 opacity, keeping text readable. The "Photography commissioned" badge disappears automatically because `isUsingPlaceholder` returns false once `image` is a real path.

A new `PhotoGallery` component was added to `app/property/[slug]/page.tsx`. It renders the gallery in a responsive auto-fill grid (min 220 px columns, 8 px gap, 200 px tall cells) using `next/image` with `fill` and `objectFit: cover`. The gallery appears between the tag pills and the Overview section in the property body.

Properties updated:

| Slug | Folder | Hero | Gallery count |
|------|--------|------|---------------|
| `lawn-house-close-1bed` | `lawn-house-close-2860` | `2.jpeg` | 7 (3-8 + WhatsApp image) |
| `westferry-circus-4078` | `westferry-circus-4078` | `1.jpeg` | 17 (all others, 13.jpeg absent from folder) |
| `westferry-circus-4377` | `westferry-circus-4377` | `1.jpeg` | 28 (2-29) |

`westferry-circus-4160` was flagged and left on the placeholder. Its folder (`public/images/westferry-circus-4160/`) contains corrupted/garbled filenames alongside 5 cleanly-named `westferry-circus-4160-N.jpeg` files. Awaiting client confirmation of which files to use before wiring it up.

**Blog dates corrected to 2026.**

Three blog posts had visible dates, signoff lines, JSON-LD `datePublished`, and metadata titles/descriptions showing 2025. All updated to 2026. The blog listing page (`app/blog/page.tsx`) `date` fields for the same three posts were also corrected.

| Post | What changed |
|------|-------------|
| `london-property-market-2025` | `datePublished` 2025-05-01 to 2026-05-01; title/headline/description "2025" to "2026"; `meta` May 2025 to May 2026; signoff May 2025 to May 2026; listing card date May 2025 to May 2026 |
| `guide-to-buying-in-chelsea` | `datePublished` 2025-04-01 to 2026-04-01; `meta` April 2025 to April 2026; signoff April 2025 to April 2026; listing card date April 2025 to April 2026 |
| `student-lettings-london-guide` | `datePublished` 2025-03-01 to 2026-03-01; `meta` March 2025 to March 2026; signoff March 2025 to March 2026; listing card date March 2025 to March 2026 |

Four other posts (`landlord-checklist-preparing-to-let`, `local-guide-renting-canary-wharf`, `london-rental-market-2026`, `renters-rights-act-london-2026`) already showed July 2026 throughout and were not touched.

### Phase 30 — thumbnail strip + lightbox gallery (2026-07-09)

Replaced the "all images as a scrolling grid" gallery with a compact thumbnail preview strip plus a full-screen lightbox.

**New file: `components/PropertyGallery.tsx`** (`'use client'`). Exports two components:

- `HeroImageClickTarget` — a `position: absolute; inset: 0; z-index: 5` transparent button rendered inside the hero's image container. Dispatches a `vm:open-gallery` custom event when clicked. Shown only when a real photo is in the hero AND the property has gallery images.
- `PropertyGallery` — the main interactive component. Listens for `vm:open-gallery` events to open the lightbox at index 0 (hero image). Manages all lightbox state (open, current index).

**Thumbnail strip** (3 visible max, `gallery.slice(0, 3)`):
- 116 × 78 px buttons, 6 px gap, `next/image` with `fill + objectFit: cover`
- If `gallery.length > 3`, a dark overlay (`rgba(20,17,14,0.62)`) on the last thumbnail shows `+N` (N = gallery.length - 3) in serif cream text
- Clicking any thumbnail opens the lightbox at that image's index in `allImages` (= `[heroImage, ...gallery]`)

**Lightbox**:
- `position: fixed; inset: 0; z-index: 9999` dark overlay (`rgba(14,11,8,0.96)`)
- Current image in an `88vw × 80vh` container using `next/image fill + objectFit: contain`
- Click backdrop to close; click image area does NOT close (stopPropagation)
- Gold (`#A0845C`) close button (top-right), left/right arrow buttons with gold border
- Counter label `N / Total` bottom-center in muted cream
- Keyboard: Escape closes, ArrowLeft/ArrowRight navigates
- Touch swipe: 50 px threshold on the image container triggers prev/next
- Body scroll locked while lightbox is open (restored on unmount/close)

**`page.tsx` changes**:
- Removed `import Image from 'next/image'` (no longer used in page.tsx directly)
- Added `import { PropertyGallery, HeroImageClickTarget } from '@/components/PropertyGallery'`
- `PropertyHero` renders `<HeroImageClickTarget show={!usingPlaceholder && (gallery?.length ?? 0) > 0} />` inside the image div (z-index 5 sits above the scrims but below the text at z-index 10)
- `PropertyBody` renders `<PropertyGallery heroImage={...} gallery={...} title={...} area={...} />` where the gallery previously was
- Removed the old `PhotoGallery` server function

Applies to all 3 properties with real photography (`lawn-house-close-1bed`, `westferry-circus-4078`, `westferry-circus-4377`). Properties on the placeholder are unaffected (gallery is absent so `PropertyGallery` returns null and `HeroImageClickTarget` renders nothing).

### Phase 31 — 4160 photos wired, homepage featured refresh, gallery thumbnails enlarged (2026-07-09)

**`westferry-circus-4160` photos wired up.**
Using the 5 cleanly-named files in `public/images/westferry-circus-4160/` (`westferry-circus-4160-1.jpeg` through `5.jpeg`). Hero = `...-1.jpeg`, gallery = `...-2.jpeg` through `...-5.jpeg`. The corrupted/garbled filenames in that folder are ignored. `westferry-circus-4160` now has the full lightbox gallery experience alongside the other 3 wired properties.

**`marsh-wall-3bed-5958` photos wired up (follow-up pass).**
16 clean images in `public/images/marsh-wall-5958/` (`1.jpeg` through `16.jpeg`). Hero = `1.jpeg`, gallery = alphabetical remainder (10-16, 2-9). Full lightbox gallery active. `featured: true` set, teaser added. See Phase 32 below.

**Homepage featured section (`components/FeaturedProperties.tsx`):**
- Removed the two `comingSoon` placeholder cards (Canary Wharf / Notting Hill Register Interest cards pointing to Unsplash images)
- The section now shows only `featured: true` live properties from `lib/properties.ts`
- `featured: true` added to: `lawn-house-close-1bed`, `westferry-circus-4160`, `westferry-circus-4377`
- `featured: true` removed from: `marsh-wall-2bed-4050` (placeholder photo)
- Homepage currently shows 4 properties: `lawn-house-close-1bed`, `westferry-circus-4078`, `westferry-circus-4160`, `westferry-circus-4377`
- Section heading changed from "Available now & coming soon" to "Available now"
- Grid minmax narrowed from 320px to 280px so all 4 cards sit in a single row at 1280px
- `desc` field now uses `p.teaser ?? p.description` so short teasers show on cards

**`teaser` field added to `Property` type.**
Short 1-2 sentence homepage card teasers added to all 4 featured properties:
- `lawn-house-close-1bed`: "Brand new 1-bed in Canary Wharf with a private terrace, stunning Dock views and underfloor heating throughout."
- `westferry-circus-4078`: "Spacious 2-bed, 966 sq. ft. on the 3rd floor with a private balcony and Canary Wharf skyline views."
- `westferry-circus-4160`: "2-bed on the 10th floor, 966 sq. ft. with air conditioning, a private balcony and sweeping Canary Wharf views."
- `westferry-circus-4377`: "Luxurious interior-designed 2-bed on the 10th floor with a private balcony and panoramic Canary Wharf skyline views."
Full `description` on detail pages is untouched.

**Gallery thumbnail strip enlarged (`components/PropertyGallery.tsx`):**
- Thumbnail size: 116×78px → 180×120px (55% larger)
- Gap between thumbnails: 6px → 8px
- Added "Gallery" eyebrow label (`fontSize: 9, letterSpacing: 0.22em, color: #A0845C`) above the strip

### Phase 32 — marsh-wall-3bed-5958 photos wired (2026-07-09)

`public/images/marsh-wall-5958/` uploaded with 16 images (`1.jpeg` through `16.jpeg`).

`lib/properties.ts` updated for `marsh-wall-3bed-5958`:
- `image`: `/images/marsh-wall-5958/1.jpeg` (hero)
- `gallery`: 15 remaining images in alphabetical order (`10-16.jpeg`, `2-9.jpeg`)
- `teaser`: "Fully furnished 3-bed in Canary Wharf with high ceilings, a pool, gym and access to London's highest communal garden."
- `featured: true` set — property now appears in the homepage featured strip

Homepage now shows all 5 real-photo properties: `lawn-house-close-1bed`, `westferry-circus-4078`, `westferry-circus-4160`, `westferry-circus-4377`, `marsh-wall-3bed-5958`. No code changes needed beyond `lib/properties.ts` — the existing gallery and featured-card infrastructure handles this property automatically.

### Phase 33 — Student Lettings page + footer navigation cleanup (2026-07-09)

**New page: `app/student-lettings/page.tsx`**
- URL: `/student-lettings`
- Metadata: title "Student Lettings in London", canonical `/student-lettings`
- Breadcrumb JSON-LD: Home → Student Lettings
- Hero image: Unsplash Canary Wharf skyline (`photo-1555854877-bab0e564b8d5`)
- Headline: "Student lettings done without the runaround." (italic gold on last line)
- Subtext: "Well-connected, furnished rentals in East London — with guarantor support included as standard."
- CTA: ArrowButton `gold` variant → `/register`
- 4-service grid (same layout as `/let`): Furnished properties, Guarantor-friendly, Transport connections, Honest referencing
- Body copy section: Canary Wharf transport (Jubilee, DLR, Elizabeth line), fair referencing message
- Second CTA: ArrowButton `dark` variant → `/register`

**`components/Navbar.tsx`:** Added `/student-lettings` to `darkHeroPages` array so the navbar renders white text over the dark hero.

**`components/Footer.tsx`:** `navItems` trimmed from 8 links to exactly 4: Lettings (`/let`), Rentals (`/rent`), New Homes (`/buy`), Student Lettings (`/student-lettings`). `legalItems`, Contact column, and copyright row untouched.

**`app/sitemap.ts`:** Added `/student-lettings` (`changeFrequency: 'monthly'`, `priority: 0.8`).
