"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { MediaPicker } from "@/components/admin/ui/media-picker";
import { ImageIcon, X } from "lucide-react";

interface MediaItem {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size?: number;
  width?: number;
  height?: number;
}

interface FeaturedImagePickerProps {
  imageUrl?: string;
  onChange: (url: string) => void;
}

export function FeaturedImagePicker({
  imageUrl,
  onChange,
}: FeaturedImagePickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = (selected: MediaItem | MediaItem[]) => {
    const item = Array.isArray(selected) ? selected[0] : selected;
    onChange(item.url);
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="flex items-start gap-4">
          <Card className="relative overflow-hidden w-64 shrink-0">
            <div className="aspect-video relative bg-muted">
              <Image
                src={imageUrl}
                alt="Featured image"
                fill
                className="object-cover"
              />
            </div>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPickerOpen(true)}>
              Change Image
            </Button>
            <Button variant="destructive" size="icon" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Card
          className="h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors border-dashed"
          onClick={() => setPickerOpen(true)}
        >
          <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Select Featured Image
          </span>
        </Card>
      )}

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
        multiple={false}
      />
    </div>
  );
}
