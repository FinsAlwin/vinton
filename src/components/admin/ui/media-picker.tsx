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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        await response.json();
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
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[hsl(var(--admin-text-primary))]">
            {multiple ? "Select Media" : "Select Image"}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[hsl(var(--admin-border))]">
          <button
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === "browse"
                ? "text-[hsl(var(--admin-primary))]"
                : "text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-secondary))]"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            Browse
            {activeTab === "browse" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--admin-primary))]" />
            )}
          </button>
          <button
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === "upload"
                ? "text-[hsl(var(--admin-primary))]"
                : "text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-secondary))]"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload
            {activeTab === "upload" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--admin-primary))]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === "browse" ? (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--admin-text-muted))]" />
                <Input
                  placeholder="Search media..."
                  className="pl-10 bg-[hsl(var(--admin-body))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))] placeholder:text-[hsl(var(--admin-text-muted))] focus:border-[hsl(var(--admin-primary))] focus:ring-[hsl(var(--admin-primary))]"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Media Grid */}
              {loading ? (
                <div className="text-center py-16 text-[hsl(var(--admin-text-muted))]">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--admin-primary))]"></div>
                  <p className="mt-4">Loading...</p>
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--admin-text-muted))]" />
                  <p className="text-[hsl(var(--admin-text-muted))]">
                    No media files found
                  </p>
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
                            ? "border-[hsl(var(--admin-primary))] ring-2 ring-[hsl(var(--admin-primary))] shadow-lg"
                            : "border-[hsl(var(--admin-border))] hover:border-[hsl(var(--admin-primary))] hover:shadow-md"
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
                          <div className="flex items-center justify-center h-full bg-[hsl(var(--admin-body))]">
                            <span className="text-sm text-[hsl(var(--admin-text-muted))]">
                              {item.mimeType.split("/")[1].toUpperCase()}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[hsl(var(--admin-primary))]/20 flex items-center justify-center">
                            <div className="bg-[hsl(var(--admin-primary))] rounded-full p-2 shadow-lg">
                              <Check className="h-5 w-5 text-white" />
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
                <div className="flex items-center justify-center gap-3 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-[hsl(var(--admin-body))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-hover))] hover:border-[hsl(var(--admin-primary))] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-[hsl(var(--admin-text-secondary))] min-w-[100px] text-center">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-[hsl(var(--admin-body))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-hover))] hover:border-[hsl(var(--admin-primary))] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-full max-w-md p-10 border-2 border-dashed border-[hsl(var(--admin-border))] rounded-xl text-center bg-[hsl(var(--admin-body))]/50 hover:border-[hsl(var(--admin-primary))]/50 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--admin-primary))]/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-[hsl(var(--admin-primary))]" />
                </div>
                <p className="text-lg font-semibold mb-2 text-[hsl(var(--admin-text-primary))]">
                  Upload a file
                </p>
                <p className="text-sm text-[hsl(var(--admin-text-muted))] mb-6">
                  Drag and drop or click to select a file from your computer
                </p>
                <label htmlFor="media-upload">
                  <Button
                    disabled={uploading}
                    asChild
                    className="bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-hover))] text-white"
                  >
                    <span className="cursor-pointer">
                      {uploading ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        "Select File"
                      )}
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
          <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--admin-border))]">
            <span className="text-sm text-[hsl(var(--admin-text-secondary))] font-medium">
              {selectedIds.size} {selectedIds.size === 1 ? "item" : "items"}{" "}
              selected
            </span>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-transparent border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-hover))] hover:border-[hsl(var(--admin-primary))]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={selectedIds.size === 0}
                className="bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-hover))] text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
