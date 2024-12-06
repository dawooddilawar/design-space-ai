// src/app/api/images/route.ts
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userImages = await db.query.images.findMany({
      where: eq(images.userId, session.user.id),
      orderBy: [desc(images.createdAt)],
    });

    return NextResponse.json(userImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}