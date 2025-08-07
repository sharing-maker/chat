/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@droppii-org/chat-sdk"],
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
