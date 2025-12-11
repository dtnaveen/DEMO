/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  turbopack: {
    // Empty config to silence the error - webpack config will be ignored
  },
  // Handle service worker requests
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Suppress WebSocket HMR warnings in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress WebSocket connection errors for HMR
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        {
          module: /node_modules/,
          message: /WebSocket connection.*_next\/webpack-hmr/,
        },
        {
          message: /WebSocket/,
        },
      ];
    }
    return config;
  },
  // Disable HMR overlay for WebSocket errors
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
