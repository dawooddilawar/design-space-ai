// src/components/gallery/gallery-view.tsx
"use client";

import { useCallback } from "react";
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
import { ROOM_TYPES } from "@/app/gallery/page";

interface GalleryViewProps {
  images: Array<{
    id: string;
    originalUrl: string;
    processedUrl?: string;
    status: string;
    createdAt: Date;
    roomType?: string;
  }>;
  currentFilters: {
    status?: string;
    roomType?: string;
  };
}

export function GalleryView({ images, currentFilters }: GalleryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
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
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Grid */}
          <ImageGrid images={images} />
        </CardContent>
      </Card>
    </div>
  );
}