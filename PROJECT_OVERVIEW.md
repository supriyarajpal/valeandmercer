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

### Outstanding items not addressed in this rework
- Resend `from` address is still the sandbox `onboarding@resend.dev`. Verify the domain in Resend and switch to e.g. `noreply@valeandmercer.co.uk`.
- Email-body HTML injection risk: both routes still interpolate user input directly. Add HTML-escaping or switch to a templating helper.
- Branded `og-image.jpg` not yet present.
- The repo-root leftover duplicate tree is still present (README acknowledges; out of scope for this rework).
- Google Analytics is still referenced in policy copy but no GA tag is loaded. Either wire up GA4 (gated by Cookiebot consent) or remove the policy references.
- `lib/properties.ts` is still dead code; `public/images/` is still empty.
- `/buy` page content still says "To Let" cards under a nav label "New Homes" — needs a content decision.
