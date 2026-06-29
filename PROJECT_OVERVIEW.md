# Vale and Mercer — Project Overview

Audit + change log for `/Users/devasyesachdeva12/Downloads/vale-and-mercer-source/`, the source for **valeandmercer.co.uk** (London residential agency: lettings, new homes, student lets). All citations are repo-relative.

> **Update history**
> - **Original audit** — read-only deep-dive of the codebase as it stood.
> - **2026-06-29 rework** — fixed iPad Safari/render-blank issues, repointed form emails, fixed register-form bug, gated `/admin` behind a build flag, removed em-dashes from visitor copy, fixed UK-English typos, and shipped a full SEO layer (per-page metadata, sitemap, robots, OG/Twitter, JSON-LD). See section 10 for the change log.

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

### Outstanding items not addressed in this rework
- Resend `from` address is still the sandbox `onboarding@resend.dev`. Verify the domain in Resend and switch to e.g. `noreply@valeandmercer.co.uk`.
- Email-body HTML injection risk: both routes still interpolate user input directly. Add HTML-escaping or switch to a templating helper.
- Branded `og-image.jpg` not yet present.
- The repo-root leftover duplicate tree is still present (README acknowledges; out of scope for this rework).
- Google Analytics is still referenced in policy copy but no GA tag is loaded. Either wire up GA4 (gated by Cookiebot consent) or remove the policy references.
- `lib/properties.ts` is still dead code; `public/images/` is still empty.
- `/buy` page content still says "To Let" cards under a nav label "New Homes" — needs a content decision.
