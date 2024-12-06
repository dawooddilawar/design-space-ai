// src/app/gallery/page.tsx
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/lucia";
import { getGalleryImages } from "./gallery-actions";
import { GalleryClient } from "./gallery-client";
import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { projects } from "@/lib/db/schema";

// Define supported room types
export const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Bathroom",
  "Office",
] as const;

async function getUserProjects(userId: string) {
  return await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: desc(projects.createdAt),
  });
}

export default async function GalleryPage({
                                            searchParams,
                                          }: {
  searchParams: { status?: string; roomType?: string };
}) {
  const sessionId = cookies().get(auth.sessionCookieName)?.value;
  const session = await auth.validateSession(sessionId);

  const [images, projects] = await Promise.all([
    getGalleryImages(session.user.id, searchParams),
    getUserProjects(session.user.id),
  ]);

  return (
    <GalleryClient
      images={images}
      projects={projects}
      currentFilters={{
        status: searchParams.status,
        roomType: searchParams.roomType,
      }}
      roomTypes={ROOM_TYPES}
    />
  );
}