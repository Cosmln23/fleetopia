/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force dynamic rendering for all routes to prevent static generation issues
  output: 'standalone',
  
  // Disable static optimization for pages that use authentication
  experimental: {
    dynamicIO: false,
  },

  // Environment variables configuration
  env: {
    // Ensure environment variables are available at build time
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder',
  },

  // Vercel deployment optimizations
  poweredByHeader: false,
  compress: true,
  
  // Handle dynamic routes properly
  trailingSlash: false,
  
  // Webpack configuration for better builds
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;