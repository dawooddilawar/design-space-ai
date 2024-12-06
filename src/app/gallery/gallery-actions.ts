// src/app/gallery/gallery-actions.ts
"use server";

import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function getGalleryImages(
  userId: string,
  filters: {
    status?: string;
    roomType?: string;
  }
) {
  let query = eq(images.userId, userId);

  if (filters.status) {
    query = and(query, eq(images.status, filters.status));
  }

  if (filters.roomType) {
    query = and(query, eq(images.roomType, filters.roomType));
  }

  return await db.query.images.findMany({
    where: query,
    orderBy: desc(images.createdAt),
  });
}