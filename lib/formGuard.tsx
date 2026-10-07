'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// Shared anti-spam protections for every Web3Forms enquiry form on the site
// (homepage contact, /register, /valuations, new-homes enquiry). Submission
// itself stays client-side against Web3Forms (free-tier requirement); this hook
// layers the three invisible checks on top:
//
//   1. HONEYPOT    — a hidden, off-screen "website" input no real user fills.
//   2. RATE LIMIT  — delegated to the server guard at /api/forms/guard.
//   3. MIN TIME    — submissions completed in under 3s are treated as bots.
//
// Protections 1 and 3 run here so a tripped bot gets a silent fake-success
// (the caller sets status 'sent' without ever POSTing the lead). Protection 2
// is the one that MUST be server-side, so it lives behind the Route Handler.

export type GuardVerdict =
  | 'ok' // genuine-looking submission — proceed to Web3Forms
  | 'spam' // honeypot filled or submitted too fast — caller should fake success silently
  | 'rate-limited' // server guard blocked this IP — caller should show a generic error

// Shortest time a human plausibly needs to complete any of our multi-field
// forms. Bots fill and submit near-instantly.
const MIN_FILL_MS = 3000
const GUARD_ENDPOINT = '/api/forms/guard'

export function useFormGuard() {
  const [honeypot, setHoneypot] = useState('')
  // When the form mounted = when it became fillable. Set in an effect (not
  // during render) so it stays pure, and because mount is the moment the form
  // is actually interactive on the client.
  const renderedAt = useRef<number | null>(null)
  useEffect(() => {
    renderedAt.current = Date.now()
  }, [])

  const precheck = useCallback(
    async (formType: string): Promise<GuardVerdict> => {
      // 1 — honeypot: any value means a field invisible to humans got filled.
      if (honeypot.trim() !== '') return 'spam'
      // 3 — minimum time-on-form. A null timestamp means the mount effect has
      // not run yet (i.e. essentially t=0), which is also too fast.
      const started = renderedAt.current
      if (started === null || Date.now() - started < MIN_FILL_MS) return 'spam'
      // 2 — server-side rate limit. Fail OPEN on any network/guard error so a
      // guard outage never silently drops a genuine lead; Web3Forms remains the
      // source of truth for delivery.
      try {
        const res = await fetch(GUARD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formType }),
        })
        if (res.status === 429) return 'rate-limited'
      } catch {
        /* network error reaching the guard — fail open */
      }
      return 'ok'
    },
    [honeypot],
  )

  // Hidden off-screen field. position:absolute off-screen (NOT display:none,
  // which some bots skip) + aria-hidden + tabIndex -1 keep it out of sight,
  // out of the tab order, and out of the accessibility tree for real users.
  const honeypotField = (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <label>
        Company (leave blank)
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
        />
      </label>
    </div>
  )

  return { honeypotField, precheck }
}
