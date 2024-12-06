// src/app/api/process/[projectId]/status/route.ts
export const runtime = 'nodejs'

import { eq } from "drizzle-orm";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const image = await db.query.images.findFirst({
      where: eq(images.id, params.imageId),
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (image.userId !== session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      status: image.status,
      processedUrl: image.processedUrl,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}