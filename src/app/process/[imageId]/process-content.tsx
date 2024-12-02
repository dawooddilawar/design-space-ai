"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { StatusCard } from "@/components/processing/status-card";
import { StyleGrid } from "@/components/styles/style-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Style } from "@/lib/styles/constants";

interface ProcessContentProps {
  imageId: string;
}

export default function ProcessContent({ imageId }: ProcessContentProps) {
  const router = useRouter();
  const [image, setImage] = useState<{ originalUrl: string; processedUrl?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/upload/${imageId}`);
        const data = await response.json();
        setImage(data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [imageId]);

  const handleStyleSelect = async (style: Style) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: imageId,
          styleId: style.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      setImage((prev) => prev ? { ...prev, processedUrl: data.processedUrl } : null);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={image.originalUrl}
                alt="Original"
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {image.processedUrl ? (
          <Card>
            <CardHeader>
              <CardTitle>Processed Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={image.processedUrl}
                  alt="Processed"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        ) : isProcessing ? (
          <StatusCard
            imageId={imageId}
            onComplete={(processedUrl) =>
              setImage((prev) => prev ? { ...prev, processedUrl } : null)
            }
          />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Style</CardTitle>
        </CardHeader>
        <CardContent>
          <StyleGrid
            imageId={imageId}
            onStyleSelect={handleStyleSelect}
            isProcessing={isProcessing}
          />
        </CardContent>
      </Card>
    </div>
  );
}