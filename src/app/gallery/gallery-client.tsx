"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGrid } from "@/components/dashboard/image-grid";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { useToast } from "@/hooks/use-toast";

interface GalleryClientProps {
  images: Array<{
    id: string;
    originalUrl: string;
    processedUrl?: string;
    status: string;
    createdAt: Date;
    roomType?: string;
    projectId?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
  }>;
  currentFilters: {
    status?: string;
    roomType?: string;
  };
  roomTypes: readonly string[];
}

export function GalleryClient({ images, currentFilters, roomTypes, projects }: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleProjectCreate = () => {
    // Refresh the page to get updated projects list
    router.refresh();
  };

  const handleProjectAssign = async (projectId: string) => {
    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select images to assign",
      });
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: selectedImages }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign images to project");
      }

      toast({
        title: "Success",
        description: "Images assigned to project successfully",
      });

      setSelectedImages([]);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign images",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {selectedImages.length > 0 && (
            <Select onValueChange={handleProjectAssign}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Assign to project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <ProjectDialog onProjectCreated={handleProjectCreate} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Select
              value={currentFilters.status ?? "all"}
              onValueChange={(value) => {
                const query = createQueryString(
                  "status",
                  value === "all" ? null : value
                );
                router.push(`/gallery?${query}`);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={currentFilters.roomType ?? "all"}
              onValueChange={(value) => {
                const query = createQueryString(
                  "roomType",
                  value === "all" ? null : value
                );
                router.push(`/gallery?${query}`);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Grid */}
          <ImageGrid
            images={images}
            selectable
            selectedImages={selectedImages}
            onSelectionChange={setSelectedImages}
          />
        </CardContent>
      </Card>
    </div>
  );
}