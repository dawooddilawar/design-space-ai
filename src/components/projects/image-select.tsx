// src/components/projects/image-select.tsx
"use client";

import { useEffect, useState } from "react";
import { ImageGrid } from "@/components/dashboard/image-grid";
import { useToast } from "@/hooks/use-toast";

interface ImageSelectProps {
  selectedImages: string[];
  onSelectionChange: (ids: string[]) => void;
  excludeImageIds?: string[];
}

export function ImageSelect({
                              selectedImages,
                              onSelectionChange,
                              excludeImageIds = []
                            }: ImageSelectProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();

        // Filter out excluded images
        const filteredImages = data.filter((img: { id: string }) =>
          !excludeImageIds.includes(img.id)
        );

        setImages(filteredImages);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load images",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [toast, excludeImageIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {excludeImageIds.length > 0
          ? "No more images available to add"
          : "No images available. Upload some images first."}
      </div>
    );
  }

  return (
    <ImageGrid
      images={images}
      selectable
      selectedImages={selectedImages}
      onSelectionChange={onSelectionChange}
    />
  );
}