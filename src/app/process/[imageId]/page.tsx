// src/app/process/[projectId]/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { StatusCard } from "@/components/processing/status-card";
import { BeforeAfterView } from "@/components/results/before-after-view";
import { ImageActions } from "@/components/results/image-actions";
import { ImageMetadata } from "@/components/results/image-metadata";
import { StyleGrid } from "@/components/styles/style-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Style } from "@/lib/styles/constants";

const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Bathroom",
  "Office",
] as const;

interface ProcessPageProps {
  params: {
    imageId: string;
  };
}

export default function ProcessPage({ params }: ProcessPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [image, setImage] = useState<{
    id: string;
    originalUrl: string;
    processedUrl?: string;
    styleId?: string;
    roomType?: string;
    createdAt: Date;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchImage = useCallback(async () => {
    try {
      const response = await fetch(`/api/upload/${params.imageId}`);
      const data = await response.json();
      setImage({
        ...data,
        createdAt: new Date(data.createdAt)
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load image"
      });
    }
  }, [params.imageId, toast]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const handleStyleSelect = useCallback(async (style: Style) => {
    if (!image?.roomType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a room type first"
      });
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: params.imageId,
          styleId: style.id,
          roomType: image.roomType
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      setImage((prev) =>
        prev ? {
          ...prev,
          processedUrl: data.processedUrl,
          styleId: style.id
        } : null
      );
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process image"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [image?.roomType, params.imageId, toast]);

  const handleRoomTypeChange = useCallback((type: string) => {
    setImage((prev) => prev ? { ...prev, roomType: type } : null);
  }, []);

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {image.processedUrl && (
          <ImageActions imageId={params.imageId} imageUrl={image.processedUrl} />
        )}
      </div>

      {/* Room Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={image.roomType}
            onValueChange={handleRoomTypeChange}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Image Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {image.processedUrl ? (
            <>
              <BeforeAfterView
                beforeUrl={image.originalUrl}
                afterUrl={image.processedUrl}
              />
              <div className="mt-4">
                <ImageMetadata
                  style={image.styleId || "None"}
                  roomType={image.roomType || "Not selected"}
                  createdAt={image.createdAt}
                />
              </div>
            </>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={image.originalUrl}
                alt="Original"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Style Selection */}
      {image.roomType && (
        <Card>
          <CardHeader>
            <CardTitle>Select Style</CardTitle>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <StatusCard
                imageId={params.imageId}
                onComplete={(processedUrl) =>
                  setImage((prev) => prev ? { ...prev, processedUrl } : null)
                }
              />
            ) : (
              <StyleGrid
                imageId={params.imageId}
                onStyleSelect={handleStyleSelect}
                isProcessing={isProcessing}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}