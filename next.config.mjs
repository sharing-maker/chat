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
  webpack: {
    resolve: {
      fallback: {
        path: false,
        crypto: false,
      },
    },
  },
}

export default nextConfig
