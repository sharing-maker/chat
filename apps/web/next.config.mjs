import path from "path";
import { fileURLToPath } from "url";
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@droppii-org/chat-sdk': path.resolve(__dirname, '../../packages/chat-sdk/src'),
      'src': path.resolve(__dirname, '../../packages/chat-sdk/src'),
    };
    return config;
  }
}

export default nextConfig
