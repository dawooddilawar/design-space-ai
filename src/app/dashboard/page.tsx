// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { DashboardView } from "@/components/dashboard/dashboard-view.tsx";
import { images } from "@/lib/db/schema";

async function getRecentImages(userId: string) {
  return await db.query.images.findMany({
    where: eq(images.userId, userId),
    orderBy: desc(images.createdAt),
    limit: 8,
  });
}

export default async function DashboardPage() {
  const sessionId = cookies().get(auth.sessionCookieName)?.value;
  const session = await auth.validateSession(sessionId);
  const recentImages = await getRecentImages(session.user.id);

  return <DashboardView recentImages={recentImages} />;
}