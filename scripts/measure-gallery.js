#!/usr/bin/env node
//
// measure-gallery.js — bake gallery image aspect ratios into a manifest.
//
// The /buy masonry (components/DevelopmentGallery.tsx) needs each image's real
// aspect ratio to size tiles and pick 1- vs 2-column spans. Measuring in the
// browser via onLoad is unreliable (lazy images, cached images that never re-
// fire load), so we read the dimensions from disk at build time and write them
// to lib/galleryImageDims.generated.json as { "<public path>": aspectRatio }.
//
// Run after adding/removing development images:  node scripts/measure-gallery.js
//
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DEV_IMG_DIR = path.join(ROOT, 'public', 'images', 'developments')
const OUT = path.join(ROOT, 'lib', 'galleryImageDims.generated.json')

// Minimal, dependency-free dimension reader for PNG and JPEG (the only formats
// used by the galleries). Returns { w, h } or null.
function dimsOf(buf) {
  // PNG: 8-byte signature, IHDR width@16 height@20 (big-endian).
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  }
  // JPEG: scan segments for a Start-Of-Frame marker.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off++; continue }
      const marker = buf[off + 1]
      const isSOF = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (isSOF) return { h: buf.readUInt16BE(off + 5), w: buf.readUInt16BE(off + 7) }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { off += 2; continue }
      const len = buf.readUInt16BE(off + 2)
      if (len < 2) break
      off += 2 + len
    }
  }
  return null
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(png|jpe?g)$/i.test(name)) out.push(p)
  }
  return out
}

const map = {}
let ok = 0, bad = 0
if (fs.existsSync(DEV_IMG_DIR)) {
  for (const file of walk(DEV_IMG_DIR)) {
    const buf = fs.readFileSync(file)
    const d = dimsOf(buf)
    if (!d || !d.w || !d.h) { bad++; continue }
    const publicPath = '/images/developments/' + path.relative(DEV_IMG_DIR, file).split(path.sep).join('/')
    map[publicPath] = +(d.w / d.h).toFixed(3)
    ok++
  }
}
// Stable key order for clean diffs.
const sorted = Object.fromEntries(Object.keys(map).sort().map(k => [k, map[k]]))
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n')
console.log(`Measured ${ok} image(s)${bad ? `, ${bad} unreadable` : ''} → ${path.relative(ROOT, OUT)}`)
