import type { MetadataRoute } from 'next'

const SITE_URL = 'https://valeandmercer.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: '/',                                          priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about',                                     priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/let',                                       priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/sell',                                      priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/buy',                                       priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/rent',                                      priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/register',                                  priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/valuations',                                priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/fees',                                      priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog',                                      priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/blog/london-property-market-2025',          priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/blog/guide-to-buying-in-chelsea',           priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/blog/student-lettings-london-guide',        priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/privacy',                                   priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/cookies',                                   priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/complaints',                                priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms',                                     priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: SITE_URL + path,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
