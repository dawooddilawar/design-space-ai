import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',           // For local MinIO server
      '127.0.0.1',          // Alternative localhost
      process.env.MINIO_ENDPOINT, // For production MinIO server
    ],
  },
};

export default nextConfig;
