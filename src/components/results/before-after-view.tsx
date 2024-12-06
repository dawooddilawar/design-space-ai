// src/components/results/before-after-view.tsx
"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";

interface BeforeAfterViewProps {
  beforeUrl: string;
  afterUrl: string;
}

export function BeforeAfterView({ beforeUrl, afterUrl }: BeforeAfterViewProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <img
          src={beforeUrl}
          alt="Before"
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={afterUrl}
          alt="After"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-x-0 bottom-4">
        <Slider
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          min={0}
          max={100}
          step={1}
          className="w-2/3 mx-auto bg-white/50 rounded-lg"
        />
      </div>
    </div>
  );
}