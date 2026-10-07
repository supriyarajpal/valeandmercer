// Server-side rate-limit guard for the site's enquiry forms.
//
// WHY THIS EXISTS SEPARATELY FROM THE SUBMISSION: the actual lead still POSTs
// to Web3Forms from the BROWSER — Web3Forms' free tier rejects server-side
// submissions (HTTP 403, Pro-plan required), so we cannot move the submit
// itself behind a Route Handler (see lib/web3forms.ts). Instead this endpoint
// is a lightweight gate the client must clear BEFORE it submits, so "more than
// 3 submissions from one IP in 10 minutes" is enforced on the server rather
// than in client JS a bot can skip.
//
// STORAGE: an in-memory sliding window keyed by IP. On Vercel Fluid Compute a
// warm instance keeps this Map across requests, so burst spam from a single IP
// is caught. It is deliberately best-effort, NOT a distributed store — traffic
// spread across cold/parallel instances could exceed the limit. For hard,
// cross-instance guarantees swap `hits` for a shared store (e.g. Upstash Redis
// via the Vercel Marketplace); the window/limit logic below stays identical.

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_IN_WINDOW = 3 // allow 3 within the window; block the 4th+

// ip -> ascending submission timestamps (pruned to the current window)
const hits = new Map<string, number[]>()
let lastSweep = Date.now()

function clientIp(req: Request): string {
  // Vercel sets x-forwarded-for (client first) and x-real-ip. Fall back to a
  // constant so a missing header fails CLOSED onto one shared bucket rather
  // than handing every request its own unlimited key.
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

// Drop IPs whose timestamps have all aged out, so the Map can't grow without
// bound. Runs at most once per window.
function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return
  lastSweep = now
  for (const [ip, times] of hits) {
    const fresh = times.filter(t => now - t < WINDOW_MS)
    if (fresh.length === 0) hits.delete(ip)
    else hits.set(ip, fresh)
  }
}

export async function POST(req: Request) {
  const now = Date.now()
  sweep(now)

  const ip = clientIp(req)
  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS)

  if (recent.length >= MAX_IN_WINDOW) {
    hits.set(ip, recent) // persist the pruned list
    return Response.json(
      { ok: false, error: 'Too many submissions. Please try again in a few minutes.' },
      { status: 429 },
    )
  }

  recent.push(now)
  hits.set(ip, recent)
  return Response.json({ ok: true })
}
