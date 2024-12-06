import { formatDistance } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";

interface ImageMetadataProps {
  style: string;
  roomType: string;
  createdAt: Date;
}

export function ImageMetadata({ style, roomType, createdAt }: ImageMetadataProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Style</dt>
            <dd className="text-sm">{style}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Room Type</dt>
            <dd className="text-sm">{roomType}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Processed</dt>
            <dd className="text-sm">{formatDistance(createdAt, new Date(), { addSuffix: true })}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}