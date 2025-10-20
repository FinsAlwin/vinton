"use client";

import { useState } from "react";
import Image from "next/image";
import { useMedia } from "@/hooks/useSWR";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card } from "@/components/admin/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Upload, Trash2, Search, Grid3x3, List, Copy } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function MediaLibraryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const { media, pagination, isLoading, mutate } = useMedia({
    page,
    limit: 20,
    search,
  });

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
        mutate();
      } else {
        const error = await response.json();
        alert(error.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/media/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
        setDeleteDialog({ open: false, id: null });
      } else {
        const error = await response.json();
        alert(error.error || "Delete failed");
      }
    } catch {
      alert("Delete failed");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your uploaded files and images
          </p>
        </div>
        <label htmlFor="file-upload">
          <Button disabled={uploading} asChild>
            <span className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload File"}
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
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
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : media.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No media files yet</p>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(
            (item: {
              _id: string;
              url: string;
              originalName: string;
              mimeType: string;
              size: number;
              createdAt: string | Date;
            }) => (
              <Card key={item._id} className="overflow-hidden">
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
                <div className="p-3 space-y-2">
                  <p
                    className="text-sm font-medium truncate"
                    title={item.originalName}
                  >
                    {item.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyUrl(item.url)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({ open: true, id: item._id })
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {media.map(
              (item: {
                _id: string;
                url: string;
                originalName: string;
                filename: string;
                mimeType: string;
                size: number;
                createdAt: string | Date;
              }) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50"
                >
                  <div className="w-16 h-16 relative bg-muted rounded overflow-hidden shrink-0">
                    {item.mimeType.startsWith("image/") ? (
                      <Image
                        src={item.url}
                        alt={item.originalName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-xs text-muted-foreground">
                          {item.mimeType.split("/")[1].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.originalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {(item.size / 1024).toFixed(1)} KB •{" "}
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyUrl(item.url)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({ open: true, id: item._id })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
