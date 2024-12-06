// src/app/projects/projects-client.tsx
"use client";

import { ProjectDialog } from "@/components/projects/project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface ProjectsClientProps {
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    images: Array<{
      id: string;
      originalUrl: string;
      processedUrl: string | null;
    }>;
  }>;
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const router = useRouter();

  const handleProjectCreated = () => {
    router.refresh();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <ProjectDialog onProjectCreated={handleProjectCreated} />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to organize your designs
          </p>
          <ProjectDialog onProjectCreated={handleProjectCreated}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </ProjectDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}