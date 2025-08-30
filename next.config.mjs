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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfills for browser environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        global: false,
        process: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
      
      // Add global polyfill plugin
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'global': 'globalThis',
        })
      );
      
      // Add polyfill for global object
      config.plugins.push(
        new (require('webpack')).ProvidePlugin({
          global: 'globalThis',
          process: 'process/browser',
        })
      );
    }
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8545/:path*', // Hardhat node
      },
    ];
  },
}

export default nextConfig
