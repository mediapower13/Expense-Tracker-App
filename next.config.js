/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Set to true during development if you want to ignore type errors
    // Set to false for production to catch all type errors
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
