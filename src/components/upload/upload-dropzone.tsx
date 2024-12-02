"use client";

import { Upload, Image as ImageIcon, Camera } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/utils/upload";


interface UploadDropzoneProps {
  onUploadComplete: (data: { id: string; url: string }) => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);

      // Show preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload file
      const response = await uploadFile(file, (progress) => {
        setProgress(progress);
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      onUploadComplete(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium">
              {isDragActive ? "Drop the image here" : "Drag & drop image here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select file
            </p>
          </div>
          {!uploading && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Select File
              </Button>
              <Button variant="outline" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = handleChange;
                input.click();
              }}>
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {preview && !uploading && (
        <div className="mt-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}