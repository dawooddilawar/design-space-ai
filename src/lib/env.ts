// src/lib/env.ts
import { z } from 'zod';


const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  LUCIA_AUTH_SECRET: z.string().min(1, "LUCIA_AUTH_SECRET is required"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MINIO_ENDPOINT: z.string().min(1),
  MINIO_PORT: z.string().transform(Number),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_PUBLIC_URL: z.string().min(1),
  REPLICATE_API_TOKEN: z.string().min(1),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error.errors);
  process.exit(1);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  LUCIA_AUTH_SECRET: process.env.LUCIA_AUTH_SECRET!,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_PUBLIC_URL: process.env.MINIO_PUBLIC_URL,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
};