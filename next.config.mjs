/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
  output: 'standalone',
  trailingSlash: true,
  staticPageGenerationTimeout: 0,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Simple polyfills for browser environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        global: false,
        process: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://rpc.ankr.com/anvil/:path*', // Публичный Anvil RPC
      },
    ];
  },
}

export default nextConfig
