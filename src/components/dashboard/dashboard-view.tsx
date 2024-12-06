"use client";

// src/components/dashboard/dashboard-view.tsx
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageGrid } from "@/components/dashboard/image-grid";
import { Plus, Images } from "lucide-react";
import Link from "next/link";

interface DashboardViewProps {
  recentImages: any[]; // We'll type this properly later
}

export function DashboardView({ recentImages }: DashboardViewProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleUploadComplete = (image: { id: string; url: string }) => {
    router.push(`/process/${image.id}`);
    toast({
      title: "Upload Complete",
      description: "Your image has been uploaded successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid gap-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>
                Upload a photo of your interior space to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadDropzone onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Images */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Images</CardTitle>
              <CardDescription>Your recently processed images</CardDescription>
            </div>
            <Link href="/gallery">
              <Button variant="outline" size="sm">
                <Images className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ImageGrid images={recentImages} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}