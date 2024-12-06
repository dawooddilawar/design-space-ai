// src/app/projects/[projectId]/page.tsx
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./project-detail-client";

async function getProject(projectId: string, userId: string) {
  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ),
    with: {
      images: true,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

export default async function ProjectDetailPage({
                                                  params,
                                                }: {
  params: { projectId: string };
}) {
  const sessionId = cookies().get(auth.sessionCookieName)?.value;
  const session = await auth.validateSession(sessionId);

  const project = await getProject(params.projectId, session.user.id);

  return <ProjectDetailClient project={project} />;
}