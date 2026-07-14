// Shared Web3Forms submission helper for the site's forms (homepage
// contact, /register, /valuations).
//
// MUST run client-side. Web3Forms' FREE tier only accepts submissions from
// a browser — a server-side POST is rejected with HTTP 403 "This method is
// not allowed. Use our API in client side ... (Pro plan is required)". So
// these forms fetch Web3Forms directly from the browser; do NOT move this
// behind a Route Handler unless the account is upgraded to Pro and the
// server IP is allow-listed.
//
// The access key is NOT a secret — Web3Forms access keys are public routing
// IDs and their own docs put the key straight into the client HTML. We read
// NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY when it's present (so it can be rotated
// via env without a code change) but fall back to the literal below.
//
// WHY THE HARDCODED FALLBACK MATTERS: the production "Something went wrong."
// bug was this env var being absent from Vercel at BUILD time. NEXT_PUBLIC_
// vars are inlined into the client bundle at build time, so a missing var
// shipped `undefined` to the browser and the submit handler bailed before
// making any request. Because the key is public anyway, hardcoding a
// fallback removes that entire failure mode — the form works whether or not
// the Vercel env var is set.
//
// ROTATION WARNING: if this key is ever rotated (e.g. for security), update
// this hardcoded fallback TOO, not just the Vercel env var — otherwise the
// old key below silently keeps handling requests and the rotation only
// appears to have taken effect.
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '65ce5771-a969-4c9b-bb58-15b4f89cb3ed'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

// Posts the given fields to Web3Forms (the access key is added here) and
// resolves true only on a genuine success response. Throws on network
// failure so callers can distinguish "rejected" from "couldn't reach".
export async function submitToWeb3Forms(fields: Record<string, unknown>): Promise<boolean> {
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...fields }),
  })
  const result = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null
  if (res.ok && result?.success) return true
  // eslint-disable-next-line no-console
  console.error('Web3Forms rejected the submission', { status: res.status, body: result })
  return false
}
