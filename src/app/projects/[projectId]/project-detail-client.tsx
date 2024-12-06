// src/app/projects/[projectId]/project-detail-client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageGrid } from "@/components/dashboard/image-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Edit, Trash2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageSelect } from "@/components/projects/image-select";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDetailClientProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    images: Array<{
      id: string;
      originalUrl: string;
      processedUrl: string | null;
      status: string;
      createdAt: string;
    }>;
  };
}

export function ProjectDetailClient({ project: initialProject }: ProjectDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState(initialProject);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddImagesDialogOpen, setIsAddImagesDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || "",
  });

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update project");

      const updatedProject = await response.json();
      setProject(updatedProject);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      router.push("/projects");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project",
      });
    }
  };

  const handleAddImages = async () => {
    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one image",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageIds: [...project.images.map(img => img.id), ...selectedImages]
        }),
      });

      if (!response.ok) throw new Error("Failed to add images");

      const updatedProject = await response.json();
      setProject(updatedProject);
      setIsAddImagesDialogOpen(false);
      setSelectedImages([]);
      toast({
        title: "Success",
        description: "Images added successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add images",
      });
    } finally {
      setIsLoading(false);
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
          <Button variant="outline" onClick={() => setIsAddImagesDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Images
          </Button>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Images Dialog */}
      <Dialog open={isAddImagesDialogOpen} onOpenChange={setIsAddImagesDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Images</DialogTitle>
            <DialogDescription>
              Select images to add to this project.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <ImageSelect
              selectedImages={selectedImages}
              onSelectionChange={setSelectedImages}
              excludeImageIds={project.images.map(img => img.id)}
            />
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleAddImages} disabled={isLoading || selectedImages.length === 0}>
              {isLoading ? "Adding..." : "Add Selected Images"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}