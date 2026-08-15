#!/usr/bin/env node
//
// ingest-floorplans.js — repeatable floor-plan ingestion.
//
// Workflow: drop floor-plan images into a property folder named
//   floorplan_image_1.png, floorplan_image_2.png, …   (or floorplans_image_N.*)
// then run:  node scripts/ingest-floorplans.js
//
// For each content/properties/<slug>/ that has such files at its root, they are
// treated as that property's COMPLETE floor-plan set and:
//   1. sorted by trailing number,
//   2. MOVED to content/properties/<slug>/images/floorplans/floorplan-N.<ext>
//      (renumbered 1..N; the original extension is preserved — lossless),
//   3. PUBLISHED to public/images/developments/<slug>/floorplans/ — ONLY public/
//      is web-served, so this is what the site actually loads,
//   4. written into that property's data.json as the "floorplans" array.
// A property with no floorplan_image_* files at its root is left untouched.
// Re-running replaces a property's set only when new root files are present.
//
// IMPORTANT: after ingesting, REBUILD (`npm run build`) or RESTART the dev
// server. Development records are read from disk once at build / server start
// (lib/developments.ts), so a running server will NOT pick up data.json edits
// on its own.
//
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const CONTENT = path.join(ROOT, 'content', 'properties')
const PUBLIC = path.join(ROOT, 'public', 'images', 'developments')

const RE = /^floorplans?_image_(\d+)\.(png|jpe?g|webp)$/i
const trailing = f => { const m = f.match(RE); return m ? parseInt(m[1], 10) : 0 }
const clearDir = dir => { if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) fs.rmSync(path.join(dir, f), { force: true }) }

let touched = 0
for (const slug of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, slug)
  if (slug === 'extracted' || !fs.statSync(dir).isDirectory()) continue

  const found = fs.readdirSync(dir).filter(f => RE.test(f)).sort((a, b) => trailing(a) - trailing(b))
  if (found.length === 0) continue // nothing new dropped here — leave as-is

  const srcDir = path.join(dir, 'images', 'floorplans')
  const pubDir = path.join(PUBLIC, slug, 'floorplans')
  clearDir(srcDir); clearDir(pubDir)
  fs.mkdirSync(srcDir, { recursive: true })
  fs.mkdirSync(pubDir, { recursive: true })

  const publicPaths = []
  found.forEach((f, i) => {
    const ext = path.extname(f).toLowerCase()
    const name = `floorplan-${i + 1}${ext}`
    const moved = path.join(srcDir, name)
    fs.renameSync(path.join(dir, f), moved)         // move source out of the folder root
    fs.copyFileSync(moved, path.join(pubDir, name)) // publish a served copy
    publicPaths.push(`/images/developments/${slug}/floorplans/${name}`)
  })

  // Set data.json "floorplans" (minimal-diff: replace existing, else insert
  // before "gallery", else before the final brace).
  const djPath = path.join(dir, 'data.json')
  let raw = fs.readFileSync(djPath, 'utf8')
  JSON.parse(raw)
  const body = publicPaths.map(p => `    ${JSON.stringify(p)}`).join(',\n')
  const snippet = `"floorplans": [\n${body}\n  ]`
  if (/^[ \t]*"floorplans"\s*:/m.test(raw)) {
    raw = raw.replace(/"floorplans"\s*:\s*\[[\s\S]*?\]/, snippet)
  } else if (/^([ \t]*)"gallery"\s*:/m.test(raw)) {
    raw = raw.replace(/^([ \t]*)"gallery"\s*:/m, `$1${snippet},\n$1"gallery":`)
  } else {
    const i = raw.lastIndexOf('}')
    raw = `${raw.slice(0, i).replace(/\s+$/, '')},\n  ${snippet}\n${raw.slice(i)}`
  }
  JSON.parse(raw)
  fs.writeFileSync(djPath, raw)
  console.log(`  ${slug}: ingested ${found.length} floor plan(s)`)
  touched++
}
console.log(touched
  ? `Done — ${touched} propert${touched === 1 ? 'y' : 'ies'} updated. Now run \`npm run build\` (or restart the dev server) to see them.`
  : 'No new floorplan_image_* / floorplans_image_* files found at any property root — nothing to ingest (existing floor plans are unchanged).')
