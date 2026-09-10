#!/usr/bin/env node
/**
 * Downscale + recompress oversized published gallery images in place.
 *
 * The gallery publish pipeline copies full-resolution source photos (often
 * 5000–8000px, 10–30MB CGIs) straight into public/images/developments. Served
 * raw via <img>, those multi-MB files make the /buy galleries render slowly.
 * This pass caps the long edge at MAX_EDGE and re-encodes at QUALITY so each
 * photo drops to a few hundred KB with no visible loss at display or fullscreen
 * size. Originals remain untouched under content/properties/<slug>/… so the
 * public copies can always be regenerated (or restored with `git checkout`).
 *
 * Idempotent: images already within budget are skipped. Only downscales — never
 * upscales. Floor-plan drawings are left alone (line/text art we don't want to
 * touch); only downscaled if truly huge.
 *
 * Usage:
 *   node scripts/optimize-images.js            # optimize
 *   node scripts/optimize-images.js --dry-run  # report what would change
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..', 'public', 'images', 'developments')
const MAX_EDGE = 2560          // cap the long edge (covers fullscreen on retina)
const QUALITY = 82             // mozjpeg quality — crisp, small
const SIZE_BUDGET = 1_500_000  // recompress anything above ~1.5MB even if narrow
const DRY = process.argv.includes('--dry-run')

const isImg = f => /\.(jpe?g|png|webp)$/i.test(f)
const isFloorplan = p => /floorplan/i.test(p)

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (entry.isFile() && isImg(entry.name)) out.push(p)
  }
  return out
}

async function main() {
  if (!fs.existsSync(ROOT)) { console.error('No such dir:', ROOT); process.exit(1) }
  const files = walk(ROOT)
  let touched = 0, before = 0, after = 0
  for (const file of files) {
    const bytes = fs.statSync(file).size
    const meta = await sharp(file).metadata()
    const longEdge = Math.max(meta.width || 0, meta.height || 0)
    // Floor plans: only shrink if enormous; otherwise leave the drawing as-is.
    const edgeCap = isFloorplan(file) ? 3200 : MAX_EDGE
    const needsResize = longEdge > edgeCap
    const needsRecompress = bytes > SIZE_BUDGET
    if (!needsResize && !needsRecompress) continue

    const rel = path.relative(path.join(__dirname, '..'), file)
    if (DRY) {
      console.log(`would optimize  ${(bytes / 1048576).toFixed(1)}MB  ${meta.width}x${meta.height}  ${rel}`)
      before += bytes
      touched++
      continue
    }

    const ext = path.extname(file).toLowerCase()
    let pipe = sharp(file).rotate() // respect EXIF orientation before stripping it
    if (needsResize) pipe = pipe.resize({ width: edgeCap, height: edgeCap, fit: 'inside', withoutEnlargement: true })
    // PNG: lossless re-encode only (no palette quantization — many of these are
    // photographic CGIs saved as PNG and would band badly at 256 colours). The
    // "only write if smaller" guard below means a PNG that can't shrink is left
    // untouched. JPEGs get mozjpeg at QUALITY; that's where the real savings are.
    if (ext === '.png') pipe = pipe.png({ compressionLevel: 9 })
    else if (ext === '.webp') pipe = pipe.webp({ quality: QUALITY })
    else pipe = pipe.jpeg({ quality: QUALITY, mozjpeg: true })

    const buf = await pipe.toBuffer()
    // Only write if we actually saved space (guards against re-encode bloat).
    if (buf.length < bytes) {
      fs.writeFileSync(file, buf)
      after += buf.length
      before += bytes
      touched++
      console.log(`optimized  ${(bytes / 1048576).toFixed(1)}MB → ${(buf.length / 1048576).toFixed(2)}MB  ${rel}`)
    }
  }
  const note = DRY ? '(dry run)' : ''
  console.log(`\n${touched} image(s) ${DRY ? 'would be' : ''} optimized ${note}`)
  if (!DRY && touched) {
    console.log(`total: ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB  (saved ${((before - after) / 1048576).toFixed(1)}MB)`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
