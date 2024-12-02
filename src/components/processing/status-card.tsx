"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatusCardProps {
  imageId: string;
  onComplete?: (processedUrl: string) => void;
}

export function StatusCard({ imageId, onComplete }: StatusCardProps) {
  const [status, setStatus] = useState<string>("processing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/process/${imageId}/status`);
        const data = await response.json();

        setStatus(data.status);

        if (data.status === "completed" && onComplete) {
          onComplete(data.processedUrl);
        } else if (data.status === "processing") {
          setProgress((prev) => Math.min(prev + 10, 90));
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [imageId, onComplete]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground capitalize">
          Status: {status}
        </p>
      </CardContent>
    </Card>
  );
}