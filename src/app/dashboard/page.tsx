// src/app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
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
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Interior Image</CardTitle>
            <CardDescription>
              Upload a photo of your interior space to get started.
              Supported formats: JPG, PNG. Maximum file size: 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropzone onUploadComplete={handleUploadComplete} />
          </CardContent>
        </Card>

        {/*{uploadedImages.length > 0 && (*/}
        {/*  <Card>*/}
        {/*    <CardHeader>*/}
        {/*      <CardTitle>Uploaded Images</CardTitle>*/}
        {/*      <CardDescription>*/}
        {/*        Your recently uploaded images*/}
        {/*      </CardDescription>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">*/}
        {/*        {uploadedImages.map((image, index) => (*/}
        {/*          <div*/}
        {/*            key={`${image.id}-${index}`}*/}
        {/*            className="relative aspect-square w-full overflow-hidden rounded-lg border"*/}
        {/*          >*/}
        {/*            /!* eslint-disable-next-line @next/next/no-img-element *!/*/}
        {/*            <img*/}
        {/*              src={image.url}*/}
        {/*              alt={`Uploaded image ${index + 1}`}*/}
        {/*              className="object-cover w-full h-full"*/}
        {/*            />*/}
        {/*          </div>*/}
        {/*        ))}*/}
        {/*      </div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*)}*/}
      </div>
    </div>
  );
}