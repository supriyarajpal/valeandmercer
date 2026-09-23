import type { NextConfig } from 'next'

// New-homes (/buy) developments were re-slugged from their development name to
// their displayed street/city title. Each old URL keeps working via a permanent
// (308) redirect to the new one, so existing bookmarks, shared links, and
// already-indexed search results still resolve instead of 404ing. The sitemap
// lists only the NEW URLs (see app/sitemap.ts) to avoid duplicate-content
// signals — these redirects are just a safety net for the old paths.
const BUY_SLUG_REDIRECTS: Array<[oldSlug: string, newSlug: string]> = [
  ['aire-gardens-leeds',            'leeds'],
  ['crown-works-burton',            'burton-on-trent'],
  ['elizabeth-house-staines',       'london-rd-staines'],
  ['fountain-court-birmingham',     '5-steelhouse-ln-birmingham'],
  ['graduation-house-nottingham',   'nottingham'],
  ['mulberry-house-derby',          '31-castleward-blvd-derby'],
  ['one-victoria-manchester',       'great-ducie-street-manchester'],
  ['piccadilly-wharf-manchester',   'store-street-manchester'],
  ['priors-gate-birmingham',        '42-44-steelhouse-lane-birmingham'],
  ['st-georges-terrace-york',       'mill-street-york'],
  ['waterhouse-gardens-manchester', 'dutton-street-manchester'],
]

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...BUY_SLUG_REDIRECTS.map(([oldSlug, newSlug]) => ({
        source: `/buy/${oldSlug}`,
        destination: `/buy/${newSlug}`,
        permanent: true,
      })),
      // The Rentals route (/rent) was merged into the Lettings page (/let).
      // Permanent redirect preserves any external links, bookmarks, or
      // stale search-engine results so they never hit a 404.
      {
        source: '/rent',
        destination: '/let',
        permanent: true,
      },
      // The Student Lettings page was renamed to Sales (/student-lettings →
      // /sales). Permanent redirect preserves external links, bookmarks, and
      // stale search-engine results so they never hit a 404.
      {
        source: '/student-lettings',
        destination: '/sales',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
