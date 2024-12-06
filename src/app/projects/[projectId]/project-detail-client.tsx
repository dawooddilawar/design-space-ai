// src/app/projects/[projectId]/project-detail-client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageGrid } from "@/components/dashboard/image-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Edit, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailClientProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    images: Array<{
      id: string;
      originalUrl: string;
      processedUrl: string | null;
      status: string;
      createdAt: Date;
    }>;
  };
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleAddImages = () => {
    // TODO: Implement add images functionality
    toast({
      title: "Coming Soon",
      description: "Adding images to existing projects will be available soon.",
    });
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/share`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to generate share link");

      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);

      toast({
        title: "Success",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate share link",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddImages}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Images
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename Project</DropdownMenuItem>
              <DropdownMenuItem>Edit Description</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Created {formatDistance(new Date(project.createdAt), new Date(), { addSuffix: true })}
          </p>
        </CardHeader>
        <CardContent>
          <ImageGrid images={project.images} />
        </CardContent>
      </Card>
    </div>
  );
}