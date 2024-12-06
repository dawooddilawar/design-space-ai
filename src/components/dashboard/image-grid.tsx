// src/components/dashboard/image-grid.tsx
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ImageGridProps {
  images: Array<{
    id: string;
    originalUrl: string;
    processedUrl?: string;
    status: string;
    createdAt: Date;
    roomType?: string;
    projectId?: string;
  }>;
  selectable?: boolean;
  selectedImages?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function ImageGrid({
                            images,
                            selectable = false,
                            selectedImages = [],
                            onSelectionChange,
                          }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images yet. Upload your first image to get started.
      </div>
    );
  }

  const handleImageSelect = (imageId: string) => {
    if (!onSelectionChange) return;

    const newSelection = selectedImages.includes(imageId)
      ? selectedImages.filter(id => id !== imageId)
      : [...selectedImages, imageId];

    onSelectionChange(newSelection);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card
          key={image.id}
          className="overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer group"
        >
          <div className="relative aspect-video">
            {selectable && (
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onCheckedChange={() => handleImageSelect(image.id)}
                  className="bg-white/90 data-[state=checked]:bg-primary"
                />
              </div>
            )}
            <Link href={`/process/${image.id}`}>
              <Image
                src={image.processedUrl || image.originalUrl}
                alt=""
                fill
                className="object-cover"
              />
            </Link>
            <div className="absolute top-2 right-2">
              <Badge variant={image.status === "completed" ? "default" : "secondary"}>
                {image.status}
              </Badge>
            </div>
          </div>
          <CardContent className="p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {image.roomType || "Room"}
              </span>
              <span className="text-muted-foreground">
                {formatDistance(new Date(image.createdAt), new Date(), { addSuffix: true })}
              </span>
            </div>
            {image.projectId && (
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  In Project
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}