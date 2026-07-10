import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Rentals route (/rent) was merged into the Lettings page (/let).
      // Permanent redirect preserves any external links, bookmarks, or
      // stale search-engine results so they never hit a 404.
      {
        source: '/rent',
        destination: '/let',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
