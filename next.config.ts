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
      // Elizabeth House / Staines was removed from /buy entirely. Its current
      // slug (london-rd-staines) and its original slug (elizabeth-house-staines)
      // both now redirect to the /buy listing instead of a deleted page, so
      // neither legacy URL 404s or points at a broken link.
      {
        source: '/buy/elizabeth-house-staines',
        destination: '/buy',
        permanent: true,
      },
      {
        source: '/buy/london-rd-staines',
        destination: '/buy',
        permanent: true,
      },
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
      // The legal pages were republished at fuller, more descriptive routes
      // carrying the current document versions (Privacy Notice v2.1, Cookie
      // Policy v1.2, Terms of Use v1.1). The former short routes permanently
      // redirect to the new canonical URLs so existing links, bookmarks, and
      // indexed results resolve to the live versions instead of the older pages.
      {
        source: '/privacy',
        destination: '/privacy-notice',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/cookie-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/website-terms-of-use',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
