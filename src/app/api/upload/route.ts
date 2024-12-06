export const runtime = 'nodejs'

// src/app/api/upload/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { auth } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { images } from '@/lib/db/schema';
import { uploadFile } from '@/lib/storage/minio';

export async function POST(request: Request) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await auth.validateSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate image dimensions
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height ||
      metadata.width < 1024 || metadata.height < 1024) {
      return NextResponse.json({
        error: 'Image must be at least 1024x1024 pixels'
      }, { status: 400 });
    }

    // Generate unique filename
    const fileName = `${uuidv4()}${file.name.substring(file.name.lastIndexOf('.'))}`;

    // Upload to MinIO
    const fileUrl = await uploadFile(buffer, fileName, file.type);

    // Save to database
    const imageRecord = await db.insert(images).values({
      userId: session.user?.id,
      originalUrl: fileUrl,
      status: 'pending'
    }).returning().execute();

    return NextResponse.json({
      id: imageRecord[0].id,
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}