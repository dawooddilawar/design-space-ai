// src/app/api/projects/[projectId]/route.ts
export const runtime = 'nodejs'

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { projects, images } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if project exists and belongs to user
    const existingProject = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, params.projectId),
        eq(projects.userId, session.user.id)
      ),
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, imageIds } = body;

    // Update project
    const [updatedProject] = await db.update(projects)
      .set({
        name: name ?? existingProject.name,
        description: description ?? existingProject.description,
      })
      .where(eq(projects.id, params.projectId))
      .returning();

    // Handle image assignments if provided
    if (Array.isArray(imageIds)) {
      // First, remove all images from this project
      await db.update(images)
        .set({ projectId: null })
        .where(
          and(
            eq(images.userId, session.user.id),
            eq(images.projectId, params.projectId)
          )
        );

      // Then, assign the new images if any
      if (imageIds.length > 0) {
        await db.update(images)
          .set({ projectId: params.projectId })
          .where(
            and(
              eq(images.userId, session.user.id),
              inArray(images.id, imageIds)
            )
          );
      }
    }

    // Fetch updated project with images
    const projectWithImages = await db.query.projects.findFirst({
      where: eq(projects.id, params.projectId),
      with: {
        images: true,
      },
    });

    return NextResponse.json(projectWithImages);
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if project exists and belongs to user
    const existingProject = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, params.projectId),
        eq(projects.userId, session.user.id)
      ),
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Remove project references from images
    await db.update(images)
      .set({ projectId: null })
      .where(eq(images.projectId, params.projectId));

    // Delete the project
    await db.delete(projects)
      .where(eq(projects.id, params.projectId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const sessionId = await cookies().get(auth.sessionCookieName)?.value;
    const session = await auth.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, params.projectId),
        eq(projects.userId, session.user?.id)
      ),
      with: {
        images: true,
      },
    });



    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}