// rex-dry-run.ts, reconnaissance only.
//
// Logs into Rex and prints the RAW JSON for the first 5 published listings to
// the console. That's it. This exists so we can see Rex's real field names and
// data shape BEFORE writing any mapping code.
//
//   • Reads REX_EMAIL / REX_PASSWORD (and optional REX_API_BASE) from .env.
//     .env is NOT committed, put real credentials there, never in this file.
//   • Prints to stdout ONLY.
//   • Does NOT write to data.json. Does NOT touch any existing property.
//     Read-only against our codebase; it only reads from Rex.
//
// Run it (tsx handles the .ts + the import; npx fetches it if not installed):
//
//   npx tsx scripts/rex-dry-run.ts
//
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { RexClient, RexApiError, getRexBaseUrl } from '../lib/rex/client'

// Tiny .env loader so we don't pull in a dependency. Parses KEY=VALUE lines
// from the repo-root .env into process.env WITHOUT overwriting anything already
// set in the real environment (so `REX_EMAIL=... npx tsx ...` still wins).
function loadDotEnv(): void {
  let raw: string
  try {
    raw = readFileSync(join(process.cwd(), '.env'), 'utf8')
  } catch {
    return // no .env file, rely on the real environment
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    // Strip a single layer of surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

async function main(): Promise<void> {
  loadDotEnv()

  const email = process.env.REX_EMAIL
  const password = process.env.REX_PASSWORD
  if (!email || !password) {
    console.error(
      'Missing REX_EMAIL and/or REX_PASSWORD.\n' +
        'Copy .env.example to .env and fill them in (see .env.example).',
    )
    process.exit(1)
  }

  const client = new RexClient()
  console.error(`→ Rex base URL: ${getRexBaseUrl()}`)
  console.error(`→ Logging in as ${email} …`)
  await client.login(email, password)
  console.error('→ Authenticated. Fetching first 5 published listings …\n')

  // Ask Rex for just the first 5. `limit` is the documented top-level param;
  // if the real response ignores it we'll see that here, which is the point.
  const listings = await client.searchPublishedListings({ limit: 5 })

  // Raw dump. This is the whole deliverable: the real shape, unmapped.
  console.log(JSON.stringify(listings, null, 2))
}

main().catch((err) => {
  if (err instanceof RexApiError) {
    console.error(`\nRex API error (HTTP ${err.status}): ${err.message}`)
    console.error(err.body)
  } else {
    console.error('\nDry run failed:', err)
  }
  process.exit(1)
})
