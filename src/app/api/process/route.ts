export const runtime = 'nodejs'

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { images } from '@/lib/db/schema';
import { processImage } from '@/lib/replicate/process-image';
import { uploadFile } from '@/lib/storage/minio';
import { PRESET_STYLES } from '@/lib/styles/constants';


export async function POST(request: Request) {
  try {
    // Validate session
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageId, styleId } = body;

    // Validate inputs
    if (!imageId || !styleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get image record
    const image = await db.query.images.findFirst({
      where: eq(images.id, imageId)
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    if (image.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find style
    const style = PRESET_STYLES.find(s => s.id === styleId);
    if (!style) {
      return NextResponse.json({ error: 'Style not found' }, { status: 404 });
    }

    // Update status
    await db.update(images)
      .set({ status: 'processing' })
      .where(eq(images.id, imageId))
      .execute();

    // Process image
    const processedUrls = await processImage(image.originalUrl, style);
    console.log("processedUrls", processedUrls )

    if (!processedUrls) {
      throw new Error('No output received from processing');
    }

    // Download the processed image and upload to MinIO
    const response = await fetch(processedUrls);
    console.log("response", response);
    const buffer = Buffer.from(await response.arrayBuffer());
    const processedUrl = await uploadFile(
      buffer,
      `processed/${imageId}.png`,
      'image/png'
    );


    // Update image record
    await db.update(images)
      .set({
        processedUrl,
        styleId,
        status: 'completed'
      })
      .where(eq(images.id, imageId))
      .execute();

    return NextResponse.json({
      id: imageId,
      processedUrl
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}