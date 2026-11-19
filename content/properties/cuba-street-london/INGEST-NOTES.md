# 25 Cuba (Canary Wharf) - ingestion notes

Status: **PUBLISHED under a PROVISIONAL title.** `name`, `displayName` and
`address` are all set to "Cuba Street, London" (house style, cf.
`store-street-manchester` -> "Store Street, Manchester"), so
`developmentIsPublished()` returns true and the development has a `/buy` card and
a static `/buy/cuba-street-london` page. The title is PROVISIONAL: the brochure
confirms the street (Cuba Street) but gives no building number or postcode and
disclaims "25 Cuba" as a marketing name only (see Address below). Revisit the
title once the developer confirms the approved postal address.

Slug `cuba-street-london` (folder renamed from the earlier provisional
`25-cuba-canary-wharf`).

## Source documents (content/properties/cuba-street-london/)

- `brochure.pdf` (27 MB) - main marketing brochure (images extracted).
- `25 Cuba Factsheet (UK).pdf` - UK factsheet, carries the DETAILS / purchase
  procedure page used for the figures below.
- `25 cuba factsheet.pdf` - second factsheet (same data, different layout).

Extracted text lives in `content/properties/extracted/25-cuba-canary-wharf*.txt`.

## 1. Address - title PROVISIONAL (published on the street name only)

The brochure does NOT state an approved postal street address. Its own
disclaimer: "25 Cuba is a marketing name only and will not necessarily form
part of the approved postal address."

What the brochure DOES establish: the building is on **Cuba Street, Isle of
Dogs, London E14** (rising from the new Cuba Street Gardens, adjacent to Manilla
Street), in the **London Borough of Tower Hamlets**, by Canary Wharf.

We did NOT use 76 Marsh Wall (sales gallery) or 161 Marsh Wall (Ballymore
office) - neither is the building address.

Published title, following house style (cf. `store-street-manchester`,
published as "Store Street, Manchester" with no postal number): **"Cuba Street,
London"** (set on `name`, `displayName` and `address`). Revisit once the
developer confirms the approved postal address (building number/postcode); at
that point update the title and, if the street itself changes, the slug.

## 2. Known data merged into data.json (source: agent email, confirmed)

| Fact | Value | Brochure cross-check |
| --- | --- | --- |
| Studio price | from £425,000 | not priced in brochure (no conflict) |
| 1 bed price | from £560,000 | not priced in brochure |
| 2 bed price | from £790,000 | not priced in brochure |
| 3 bed price | from £885,000 | not priced in brochure |
| Service charge | £7.53 psf pa | MATCHES brochure |
| Ground rent | none | MATCHES brochure ("No ground rent payable") |
| Tenure | 999 year leasehold | MATCHES brochure |
| Payment: exchange | 5% within 35 days of reservation | MATCHES brochure |
| Payment: 12 months | 5% | MATCHES brochure |
| Payment: 24 months | 5% | MATCHES brochure |
| Payment: completion | 85% balance | MATCHES brochure |

## 3. Conflicts flagged (recorded, not silently resolved)

1. **Completion date.** Email: Q4 2029 to Q1 2030. Brochure factsheet: Q3 2029
   to Q1 2030. Handled like Fountain Court / Leeds: both values recorded,
   `data.json` keeps the brochure value, and `cuba-street-london` is added to
   `SUPPRESS_COMPLETION` in `lib/developmentDisplay.ts` so the date is hidden on
   the page (and stripped from the client payload) until the developer confirms.

2. **Reservation-fee boundary (minor).** Email: £10,000 "at or above" £1.5M.
   Brochure: £10,000 "for apartments over £1.5m". These differ only at exactly
   £1.5M (email -> £10k, brochure -> £5k). `data.json` records the brochure
   wording. Chase the developer for the exact boundary.

## 4. Fields with no render slot (data captured, not yet displayed)

`serviceCharge`, `groundRent` and `reservationFee` are stored in `data.json`
but the current `/buy` detail page (PropertyInformation in
`components/DevelopmentDetail.tsx`) has no rows for them - it only renders
completion, total units, payment structure and warranty, plus tenure as a badge.
To surface these three, add rows to PropertyInformation.

## Rules applied

- No development/developer name rendered: no `name`/`displayName` set; the
  marketing names "25 Cuba" and "Cuba Street Gardens" are kept out of all copy;
  `developer` is stored but stripped from the client payload by the server page.
- No floor-plan section: `floorplans` omitted (floor plans removed site-wide).
- No brochure download: not added (the server page force-nulls it anyway).
- Price bands used (not "Register your interest"), since real prices exist.
- No em-dashes in any authored copy.
- Agent-only password-protected gallery link and its password are NOT referenced
  or embedded anywhere (per Ballymore's email).

## Assets discovered

- 224 raster images extracted from `brochure.pdf` into
  `content/properties/extracted/25-cuba-canary-wharf/` (CGIs, plans, text-page
  scans mixed together - NOT reviewed or published).
- No gallery published yet (dev is held). When it goes live, run the
  extract-gallery -> review -> publish-gallery pipeline and order the gallery
  interior-first, exterior-last per the standing rule.
- No video supplied (source was three PDFs only); no `public/videos/cuba-street-london.mp4`.
