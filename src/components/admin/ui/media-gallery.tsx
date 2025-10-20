"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { MediaPicker } from "@/components/admin/ui/media-picker";
import { Plus, X } from "lucide-react";

interface MediaItem {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size?: number;
  width?: number;
  height?: number;
}

interface MediaGalleryProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export function MediaGallery({ media, onChange }: MediaGalleryProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = (selected: MediaItem | MediaItem[]) => {
    const newMedia = Array.isArray(selected) ? selected : [selected];
    onChange([...media, ...newMedia]);
  };

  const handleRemove = (id: string) => {
    onChange(media.filter((item) => item._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <Card key={item._id} className="relative overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {item.mimeType.startsWith("image/") ? (
                <Image
                  src={item.url}
                  alt={item.originalName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-sm text-muted-foreground">
                    {item.mimeType.split("/")[1].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => handleRemove(item._id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Card>
        ))}

        {/* Add Button */}
        <Card
          className="aspect-square flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors border-dashed"
          onClick={() => setPickerOpen(true)}
        >
          <div className="text-center">
            <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Media</span>
          </div>
        </Card>
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
        multiple={true}
      />
    </div>
  );
}
