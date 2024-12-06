// src/components/projects/project-card.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    images: Array<{
      id: string;
      originalUrl: string;
      processedUrl: string | null;
    }>;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {project.images.length > 0 ? (
          <div className="relative aspect-video rounded-md overflow-hidden">
            <Image
              src={project.images[0].processedUrl || project.images[0].originalUrl}
              alt={project.name}
              fill
              className="object-cover"
            />
            {project.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                +{project.images.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-video rounded-md bg-muted flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {project.description && (
          <p className="text-muted-foreground mt-4 text-sm line-clamp-2">
            {project.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {project.images.length} {project.images.length === 1 ? 'image' : 'images'}
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline" size="sm">
            View Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}