#!/usr/bin/env node
// Convert city-landing source images into responsive WebP.
//
//   content/city-images/<city>/<name>.{jpg,jpeg,png}
//        ->  public/images/cities/<city>/<name>-{640,1080,1920}.webp
//
// content/city-images/ is gitignored (originals + credits.md); the committed
// output is the WebP under public/images/cities/. Hero is just another image
// here; the page decides priority. Re-run after adding or changing originals;
// it is idempotent and only (re)writes what is missing or newer.
//
// Output is full brightness. The /buy gateway card shows the image on its own
// (no text over it), so it needs no dim; the city-page hero, which carries the
// headline over the photo, dims its own copy in CSS (filter: brightness on
// .vm-hero-img). Keeping the file bright lets both surfaces share one asset.
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const SRC_ROOT = 'content/city-images'
const OUT_ROOT = 'public/images/cities'
const WIDTHS = [640, 1080, 1920]
const SRC_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])

if (!existsSync(SRC_ROOT)) {
  console.log(`build-city-images: no ${SRC_ROOT}/ (nothing to convert).`)
  process.exit(0)
}

let cities = 0
let written = 0
let skipped = 0

for (const city of readdirSync(SRC_ROOT)) {
  const cityDir = join(SRC_ROOT, city)
  if (!statSync(cityDir).isDirectory()) continue
  const files = readdirSync(cityDir).filter(f => SRC_EXT.has(extname(f).toLowerCase()))
  if (files.length === 0) continue
  cities++
  const outDir = join(OUT_ROOT, city)
  mkdirSync(outDir, { recursive: true })

  for (const file of files) {
    const src = join(cityDir, file)
    const name = basename(file, extname(file))
    const srcMtime = statSync(src).mtimeMs
    for (const w of WIDTHS) {
      const out = join(outDir, `${name}-${w}.webp`)
      if (existsSync(out) && statSync(out).mtimeMs >= srcMtime) { skipped++; continue }
      // only downscale; quality 78 is a good premium/size tradeoff for WebP
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out)
      written++
      console.log(`  ${city}/${name}-${w}.webp`)
    }
  }
}

console.log(`build-city-images: ${cities} city folder(s), ${written} written, ${skipped} up-to-date.`)
