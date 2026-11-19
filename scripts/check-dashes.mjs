#!/usr/bin/env node
// Guard against em / en / figure dashes and the horizontal bar (and their
// escaped or HTML-entity forms) anywhere in source copy, data, metadata, alt
// text and generated strings. See CLAUDE.md "Punctuation". Wired as `prebuild`,
// so `next build` (and any Vercel deploy) fails if one is reintroduced.
//
// Allowed instead: a comma, a full stop, "to", or a plain hyphen. Numeric
// ranges and address numbers use a plain hyphen.
//
// This file deliberately contains none of the banned literals: every pattern is
// assembled from code points at runtime, so the guard never flags itself.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

// Figure dash, en dash, em dash, horizontal bar.
const CODE_POINTS = [0x2012, 0x2013, 0x2014, 0x2015]

const patterns = []
// 1. The literal characters.
patterns.push({
  label: 'literal dash char',
  re: new RegExp('[' + CODE_POINTS.map((c) => String.fromCodePoint(c)).join('') + ']'),
})
// 2. Backslash-u escape sequences in text (e.g. the six characters \ u 2 0 1 4).
for (const cp of CODE_POINTS) {
  const hex = cp.toString(16).toUpperCase().padStart(4, '0')
  patterns.push({ label: 'unicode escape u' + hex, re: new RegExp('\\\\u' + hex, 'i') })
}
// 3. Decimal HTML entities (&#NNNN;).
for (const cp of CODE_POINTS) {
  patterns.push({ label: 'decimal entity ' + cp, re: new RegExp('&#' + cp + ';') })
}
// 4. Hex HTML entities (&#xXXXX;).
for (const cp of CODE_POINTS) {
  patterns.push({ label: 'hex entity ' + cp.toString(16), re: new RegExp('&#x' + cp.toString(16) + ';', 'i') })
}
// 5. Named HTML entities. Split so the literal never appears in this file.
patterns.push({ label: 'named entity mdash', re: new RegExp('&m' + 'dash;') })
patterns.push({ label: 'named entity ndash', re: new RegExp('&n' + 'dash;') })

// Source roots and the extensions scanned in each. content/ is limited to data
// and docs; public/ to text assets (never binary images).
const CODE_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.scss', '.md', '.mdx', '.json', '.svg', '.txt', '.html', '.xml']
const ROOTS = [
  { dir: 'app', exts: CODE_EXTS },
  { dir: 'components', exts: CODE_EXTS },
  { dir: 'lib', exts: CODE_EXTS },
  { dir: 'scripts', exts: CODE_EXTS },
  { dir: 'content', exts: ['.json', '.md', '.mdx'] },
  { dir: 'public', exts: ['.svg', '.txt', '.xml', '.json', '.webmanifest', '.html', '.csv'] },
]
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out', 'build', 'dist', 'coverage'])

function walk(dir, exts, acc) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return // root does not exist, nothing to scan
  }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, exts, acc)
    } else if (exts.includes(extname(e.name).toLowerCase())) {
      acc.push(p)
    }
  }
}

const files = []
for (const { dir, exts } of ROOTS) walk(dir, exts, files)

const hits = []
for (const file of files) {
  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    for (const { label, re } of patterns) {
      const m = re.exec(lines[i])
      if (m) {
        hits.push({ file, line: i + 1, col: m.index + 1, label, snippet: lines[i].trim().slice(0, 160) })
      }
    }
  }
}

if (hits.length > 0) {
  console.error(`check-dashes: found ${hits.length} banned dash occurrence(s):\n`)
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}:${h.col}  [${h.label}]  ${h.snippet}`)
  }
  console.error('\nReplace with a comma, full stop, "to", or a plain hyphen (ranges/addresses use a plain hyphen).')
  process.exit(1)
}

console.log(`check-dashes: clean (${files.length} files scanned, no em/en/figure dashes or entities).`)
