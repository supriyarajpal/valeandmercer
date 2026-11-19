@AGENTS.md

# Standing rules

Keep these in mind on every change. They override defaults.

## Punctuation
- No em dashes or en dashes anywhere: copy, data, metadata, alt text, generated strings. Use a comma, a full stop, "to", or a plain hyphen. Numeric ranges and address numbers use a plain hyphen. `scripts/check-dashes.mjs` runs on `prebuild` and fails the build on any hit.

## Brand and copy
- Always "Vale and Mercer", never "Vale &".
- Do not change site copy unless asked.
- Raghav's phone number is never displayed.

## /buy (new homes)
- Never render development or developer names: titles are street + city, slugs match.
- No floor plans, no brochure download links.
- Gallery order is interior first, exterior last.

## Design
- Palette: `#EFECE6` (surface), `#28231C` (ink), `#A0845C` (gold).
- Slow easing, no scroll-jacking, no blur backdrops.

## Git
- Push as supriyarajpal to github.com/supriyarajpal/valeandmercer.
- Merge feature branches into production; do not commit straight to it unless asked.
- Never commit content/properties binaries (PDFs, raw images, video, zips).
