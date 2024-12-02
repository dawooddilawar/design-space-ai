import { Suspense } from "react";

import { Card } from "@/components/ui/card";

import ProcessContent from "./process-content";

interface ProcessPageProps {
  params: {
    imageId: string;
  };
}

export default function ProcessPage({ params }: ProcessPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8">
          <Card className="p-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
    >
      <ProcessContent imageId={params.imageId} />
    </Suspense>
  );
}
