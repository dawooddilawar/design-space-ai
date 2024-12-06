// src/app/projects/page.tsx
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ProjectsClient } from './projects-client';

async function getProjects(userId: string) {
  return await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    with: {
      images: true,
    },
    orderBy: [desc(projects.createdAt)],
  });
}

export default async function ProjectsPage() {
  const sessionId = cookies().get(auth.sessionCookieName)?.value;
  const session = await auth.validateSession(sessionId);
  const projectsList = await getProjects(session.user.id);

  return <ProjectsClient projects={projectsList} />;
}