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
        destination: 'http://127.0.0.1:8545/:path*', // Hardhat node - используем IP вместо localhost
      },
    ];
  },
}

export default nextConfig
