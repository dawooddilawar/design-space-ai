"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PRESET_STYLES, STYLE_CATEGORIES, type Style } from "@/lib/styles/constants";
import { cn } from "@/lib/utils";

interface StyleGridProps {
  imageId: string;
  onStyleSelect: (style: Style) => void;
  isProcessing: boolean;
}

export function StyleGrid({ imageId, onStyleSelect, isProcessing }: StyleGridProps) {
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>(STYLE_CATEGORIES[0]);

  const handleStyleSelect = async (style: Style) => {
    try {
      setSelectedStyle(style);
      onStyleSelect(style);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process image. Please try again.",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue={STYLE_CATEGORIES[0]} onValueChange={setActiveCategory}>
        <TabsList className="w-full h-auto flex-wrap">
          {STYLE_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-1 min-w-[120px]"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {STYLE_CATEGORIES.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRESET_STYLES.filter(style => style.category === category).map((style) => (
                <Card
                  key={style.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    selectedStyle?.id === style.id && "border-primary ring-2 ring-primary"
                  )}
                  onClick={() => handleStyleSelect(style)}
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">{style.name}</CardTitle>
                    <CardDescription>{style.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {style.thumbnailUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        {/* Add thumbnail image here once available */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button
          disabled={!selectedStyle || isProcessing}
          onClick={() => selectedStyle && handleStyleSelect(selectedStyle)}
        >
          {isProcessing ? "Processing..." : "Apply Style"}
        </Button>
      </div>
    </div>
  );
}