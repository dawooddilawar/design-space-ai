"use client";

import { Download, Share2, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ImageActionsProps {
  imageId: string;
  imageUrl: string;
}

export function ImageActions({ imageId, imageUrl }: ImageActionsProps) {
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (quality: 'high' | 'web') => {
    try {
      const response = await fetch(`/api/images/${imageId}/download?quality=${quality}&watermark=${includeWatermark}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interior-ai-${quality}${includeWatermark ? '-watermark' : ''}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download image"
      });
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/images/${imageId}/share`, {
        method: 'POST'
      });
      const { shareUrl } = await response.json();

      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate share link"
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="watermark"
          checked={includeWatermark}
          onCheckedChange={setIncludeWatermark}
        />
        <Label htmlFor="watermark">Include Watermark</Label>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleDownload('high')}>
            High Resolution
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload('web')}>
            Web Optimized
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
}