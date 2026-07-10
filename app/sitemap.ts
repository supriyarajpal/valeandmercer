import type { MetadataRoute } from 'next'
import { getLiveProperties } from '@/lib/properties'

const SITE_URL = 'https://valeandmercer.co.uk'

// If you add a new blog article (a new directory under /app/blog/<slug>),
// add it to BLOG_POSTS below with its real publication date. Sitemap
// lastModified is used by Google to gauge freshness — do not fake it.
const BLOG_POSTS: Array<{ slug: string; published: string }> = [
  { slug: 'landlord-checklist-preparing-to-let', published: '2026-07-08' },
  { slug: 'local-guide-renting-canary-wharf',    published: '2026-07-08' },
  { slug: 'london-rental-market-2026',           published: '2026-07-08' },
  { slug: 'renters-rights-act-london-2026',      published: '2026-07-08' },
  { slug: 'london-property-market-2025',         published: '2025-05-01' },
  { slug: 'guide-to-buying-in-chelsea',          published: '2025-04-01' },
  { slug: 'student-lettings-london-guide',       published: '2025-03-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL + '/',           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: SITE_URL + '/about',      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: SITE_URL + '/let',        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: SITE_URL + '/sell',       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: SITE_URL + '/buy',        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: SITE_URL + '/valuations', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: SITE_URL + '/fees',       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: SITE_URL + '/register',          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: SITE_URL + '/student-lettings', lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: SITE_URL + '/blog',       lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: SITE_URL + '/privacy',    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: SITE_URL + '/cookies',    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: SITE_URL + '/complaints', lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: SITE_URL + '/terms',      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map(({ slug, published }) => ({
    url: SITE_URL + '/blog/' + slug,
    lastModified: new Date(published),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  // Live property detail pages (draft records are noindex, so excluded).
  const propertyRoutes: MetadataRoute.Sitemap = getLiveProperties().map(p => ({
    url: SITE_URL + '/property/' + p.slug,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes]
}
