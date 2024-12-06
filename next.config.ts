import type { NextConfig } from "next";

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.designspaceai.dawood.design',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;
