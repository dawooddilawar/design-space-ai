// src/lib/storage/minio.ts
import { Client } from 'minio';

import { env } from '@/lib/env';

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: parseInt(env.MINIO_PORT),
  useSSL: env.NODE_ENV === 'production',
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY
});

const BUCKET_NAME = 'design-space-ai';

// Ensure bucket exists
export async function ensureBucket() {
  const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
  if (!bucketExists) {
    await minioClient.makeBucket(BUCKET_NAME);
    // Set bucket policy to allow public read
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
        }
      ]
    };
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
  }
}

export async function uploadFile(buffer: Buffer, fileName: string, contentType: string) {
  await ensureBucket();
  await minioClient.putObject(BUCKET_NAME, fileName, buffer, {
    'Content-Type': contentType
  });
  return `${env.MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`;
}

export async function deleteFile(fileName: string) {
  await minioClient.removeObject(BUCKET_NAME, fileName);
}