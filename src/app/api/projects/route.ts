// src/app/api/projects/route.ts
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { projects, images } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, imageIds } = body;

    // Validate input
    if (!name || name.length < 1) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create project
    const [project] = await db.insert(projects)
      .values({
        name,
        description,
        userId: session.user.id,
      })
      .returning();

    // If there are images to assign, update them
    if (Array.isArray(imageIds) && imageIds.length > 0) {
      await db.update(images)
        .set({ projectId: project.id })
        .where(
          and(
            eq(images.userId, session.user.id),
            inArray(images.id, imageIds)
          )
        );
    }

    // Fetch the project with its images
    const projectWithImages = await db.query.projects.findFirst({
      where: eq(projects.id, project.id),
      with: {
        images: true,
      },
    });

    return NextResponse.json(projectWithImages);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}