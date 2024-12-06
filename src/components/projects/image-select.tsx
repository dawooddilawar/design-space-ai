// src/components/projects/image-select.tsx
"use client";

import { useEffect, useState } from "react";
import { ImageGrid } from "@/components/dashboard/image-grid";

interface ImageSelectProps {
  selectedImages: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function ImageSelect({ selectedImages, onSelectionChange }: ImageSelectProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading images...</div>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No images available. Upload some images first.
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