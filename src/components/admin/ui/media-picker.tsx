"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { useToast } from "@/components/admin/ui/use-toast";
import { Search, Upload, Check } from "lucide-react";

interface MediaItem {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaItem | MediaItem[]) => void;
  multiple?: boolean;
}

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
}: MediaPickerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
      });

      const response = await fetch(`/api/media?${params}`);
      const data = await response.json();

      if (data.success) {
        setMedia(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
      toast({
        title: "Error",
        description: "Failed to load media",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && activeTab === "browse") {
      fetchMedia();
    }
  }, [open, activeTab, page, search]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success!",
          description: "File uploaded successfully",
          variant: "success",
        });

        // Switch to browse tab and refresh
        setActiveTab("browse");
        setPage(1);
        fetchMedia();
      } else {
        const error = await response.json();
        toast({
          title: "Upload failed",
          description: error.error || "Failed to upload file",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Upload failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const toggleSelection = (item: MediaItem) => {
    if (!multiple) {
      onSelect(item);
      onOpenChange(false);
      return;
    }

    const newSelected = new Set(selectedIds);
    if (newSelected.has(item._id)) {
      newSelected.delete(item._id);
    } else {
      newSelected.add(item._id);
    }
    setSelectedIds(newSelected);
  };

  const handleAddSelected = () => {
    const selectedMedia = media.filter((item) => selectedIds.has(item._id));
    onSelect(selectedMedia);
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setSearch("");
    setPage(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {multiple ? "Select Media" : "Select Image"}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "browse"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            Browse
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "upload"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "browse" ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Media Grid */}
              {loading ? (
                <div className="text-center py-12">Loading...</div>
              ) : media.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No media files found
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((item) => {
                    const isSelected = selectedIds.has(item._id);
                    return (
                      <div
                        key={item._id}
                        className={`relative aspect-square cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                          isSelected
                            ? "border-primary ring-2 ring-primary"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                        onClick={() => toggleSelection(item)}
                      >
                        {item.mimeType.startsWith("image/") ? (
                          <Image
                            src={item.url}
                            alt={item.originalName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-muted">
                            <span className="text-sm text-muted-foreground">
                              {item.mimeType.split("/")[1].toUpperCase()}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-2">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-full max-w-md p-8 border-2 border-dashed rounded-lg text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Upload a file</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to select a file
                </p>
                <label htmlFor="media-upload">
                  <Button disabled={uploading} asChild>
                    <span className="cursor-pointer">
                      {uploading ? "Uploading..." : "Select File"}
                    </span>
                  </Button>
                  <input
                    id="media-upload"
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {multiple && activeTab === "browse" && (
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={selectedIds.size === 0}
              >
                Add Selected
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
