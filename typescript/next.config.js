/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      unstable_skipTurbopack: true,
    },
  },
}

module.exports = nextConfig
