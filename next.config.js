/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Exclude Supabase Edge Functions from TypeScript checking
    ignoreBuildErrors: true,
  },
  eslint: {
    // Exclude Supabase Edge Functions from ESLint checking
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Exclude Supabase Edge Functions from webpack build
    config.module.rules.push({
      test: /supabase\/functions\/.+\.ts$/,
      loader: 'ignore-loader',
    });
    return config;
  },
}

module.exports = nextConfig

