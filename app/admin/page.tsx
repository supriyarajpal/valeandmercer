import { notFound } from 'next/navigation'
import AdminClient from './AdminClient'

// Server-side gate: in production /admin returns 404 unless ENABLE_ADMIN
// is explicitly set to 'true' in the deployment environment. This keeps
// the (currently non-functional) admin generator and its client-side
// password out of the public surface area without removing the file.
//
// To use locally: add `ENABLE_ADMIN=true` to .env.local then `npm run dev`.
// To enable in production: set ENABLE_ADMIN=true in Vercel env vars.
export default function AdminPage() {
  if (process.env.ENABLE_ADMIN !== 'true') {
    notFound()
  }
  return <AdminClient />
}
