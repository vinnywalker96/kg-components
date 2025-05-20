/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['m.media-amazon.com', 'images.unsplash.com', 'mantech.co.za'],
  },
}

module.exports = nextConfig

