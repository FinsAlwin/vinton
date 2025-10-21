"use client";

import { useState } from "react";
import Image from "next/image";
import { useMedia } from "@/hooks/useSWR";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card } from "@/components/admin/ui/card";
import { ConfirmDeleteDialog } from "@/components/admin/ui/confirm-delete-dialog";
import { useToast } from "@/components/admin/ui/use-toast";
import { Upload, Trash2, Search, Grid3x3, List, Copy } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function MediaLibraryPage() {
  const { toast } = useToast();
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
        toast({
          title: "Success!",
          description: "File uploaded successfully",
          variant: "success",
        });
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

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/media/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
        setDeleteDialog({ open: false, id: null });
        toast({
          title: "Deleted",
          description: "Media deleted successfully.",
          variant: "success",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Delete failed",
          description: error.error || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Delete failed",
        description: "Network error.",
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold admin-text mb-2">Media Library</h1>
          <p className="admin-text-secondary">
            Manage your uploaded files and images
          </p>
        </div>
        <label htmlFor="file-upload">
          <Button disabled={uploading} asChild className="w-full sm:w-auto">
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
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 admin-text-muted" />
            <Input
              placeholder="Search media..."
              className="pl-9 admin-card admin-border admin-text"
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
              className={viewMode === "grid" ? "" : "admin-border"}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "" : "admin-border"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Media Grid/List */}
      {isLoading ? (
        <Card className="p-12">
          <div className="text-center admin-text-secondary">Loading...</div>
        </Card>
      ) : media.length === 0 ? (
        <Card hover="lift" className="p-12 text-center">
          <p className="admin-text-muted">No media files yet</p>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {media.map(
            (item: {
              _id: string;
              url: string;
              originalName: string;
              mimeType: string;
              size: number;
              createdAt: string | Date;
            }) => (
              <Card key={item._id} hover="lift" className="overflow-hidden">
                <div className="aspect-square relative bg-gray-500/10">
                  {item.mimeType.startsWith("image/") ? (
                    <Image
                      src={item.url}
                      alt={item.originalName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-sm font-medium admin-text-muted">
                        {item.mimeType.split("/")[1].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <p
                    className="text-sm font-medium admin-text truncate"
                    title={item.originalName}
                  >
                    {item.originalName}
                  </p>
                  <p className="text-xs admin-text-muted">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 admin-border"
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
        <Card hover="lift">
          <div className="divide-y admin-border">
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
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-500/5 admin-transition"
                >
                  <div className="w-16 h-16 relative bg-gray-500/10 rounded-lg overflow-hidden shrink-0">
                    {item.mimeType.startsWith("image/") ? (
                      <Image
                        src={item.url}
                        alt={item.originalName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-xs font-medium admin-text-muted">
                          {item.mimeType.split("/")[1].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium admin-text truncate">
                      {item.originalName}
                    </p>
                    <p className="text-sm admin-text-secondary mt-1">
                      {(item.size / 1024).toFixed(1)} KB •{" "}
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyUrl(item.url)}
                      className="flex-1 sm:flex-initial admin-border"
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
            className="admin-border"
          >
            Previous
          </Button>
          <span className="text-sm admin-text-muted">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="admin-border"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
        resourceName="this file"
        onConfirm={handleDelete}
      />
    </div>
  );
}
