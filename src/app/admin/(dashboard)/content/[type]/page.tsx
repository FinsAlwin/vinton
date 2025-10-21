"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContent } from "@/hooks/useSWR";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Badge } from "@/components/admin/ui/badge";
import { Card } from "@/components/admin/ui/card";
import { ConfirmDeleteDialog } from "@/components/admin/ui/confirm-delete-dialog";
import { useToast } from "@/components/admin/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  FileText,
  LayoutGrid,
  List,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ViewMode = "list" | "grid";

export default function ContentListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<"" | "draft" | "published">(
    ""
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
    title: string;
  }>({ open: false, id: null, title: "" });

  const { content, pagination, isLoading, mutate } = useContent(type, {
    page,
    limit: 20,
    search,
    status: statusFilter || undefined,
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/content/${type}/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
        setDeleteDialog({ open: false, id: null, title: "" });
        toast({
          title: "Deleted",
          description: "Content deleted successfully.",
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

  const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold admin-text mb-2">
            {capitalizeType}
          </h1>
          <p className="admin-text-secondary">Manage your {type} content</p>
        </div>
        <Link href={`/admin/content/${type}/new`}>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 admin-text-muted" />
            <Input
              placeholder="Search content..."
              className="pl-9 admin-card admin-border admin-text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="admin-border">
                Status: {statusFilter || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="admin-card admin-border">
              <DropdownMenuItem
                onClick={() => setStatusFilter("")}
                className="admin-text"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("published")}
                className="admin-text"
              >
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("draft")}
                className="admin-text"
              >
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex gap-1 p-1 bg-[hsl(var(--admin-body))] border border-[hsl(var(--admin-border))] rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-[hsl(var(--admin-primary))] text-white hover:bg-[hsl(var(--admin-primary-hover))]"
                  : "text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-hover))]"
              }
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-[hsl(var(--admin-primary))] text-white hover:bg-[hsl(var(--admin-primary-hover))]"
                  : "text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-hover))]"
              }
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Content List */}
      {isLoading ? (
        <Card className="p-12">
          <div className="text-center admin-text-secondary">Loading...</div>
        </Card>
      ) : content.length === 0 ? (
        <Card hover="lift" className="p-12 text-center">
          <p className="admin-text-muted mb-4">No content yet</p>
          <Link href={`/admin/content/${type}/new`}>
            <Button>Create Your First {capitalizeType}</Button>
          </Link>
        </Card>
      ) : viewMode === "list" ? (
        <Card hover="lift">
          <div className="divide-y admin-border">
            {content.map(
              (item: {
                _id: string;
                title: string;
                description?: string;
                status: "draft" | "published";
                createdAt: string | Date;
                updatedAt: string | Date;
                metadata?: {
                  featuredImage?: string;
                };
              }) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 sm:p-6 hover:bg-[hsl(var(--admin-hover))]/50 admin-transition"
                >
                  {/* Featured Image */}
                  <div className="shrink-0">
                    {item.metadata?.featuredImage ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-body))]">
                        <Image
                          src={item.metadata.featuredImage}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-body))] flex items-center justify-center">
                        <FileText className="h-8 w-8 text-[hsl(var(--admin-text-muted))]" />
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-semibold text-[hsl(var(--admin-text-primary))] text-base">
                        {item.title}
                      </h3>
                      <Badge
                        variant={
                          item.status === "published" ? "success" : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[hsl(var(--admin-text-secondary))] line-clamp-2 mb-2">
                      {item.description || "No description"}
                    </p>
                    <p className="text-xs text-[hsl(var(--admin-text-muted))]">
                      Created {formatDate(item.createdAt)} • Updated{" "}
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[hsl(var(--admin-text-secondary))] hover:bg-[hsl(var(--admin-hover))] hover:text-[hsl(var(--admin-text-primary))]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="admin-card admin-border"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/content/${type}/edit/${item._id}`
                            )
                          }
                          className="admin-text hover:bg-[hsl(var(--admin-hover))] cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: item._id,
                              title: item.title,
                            })
                          }
                          className="text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map(
            (item: {
              _id: string;
              title: string;
              description?: string;
              status: "draft" | "published";
              createdAt: string | Date;
              updatedAt: string | Date;
              metadata?: {
                featuredImage?: string;
              };
            }) => (
              <Card
                key={item._id}
                hover="lift"
                className="overflow-hidden flex flex-col"
              >
                {/* Featured Image */}
                <div className="relative aspect-video bg-[hsl(var(--admin-body))]">
                  {item.metadata?.featuredImage ? (
                    <Image
                      src={item.metadata.featuredImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border-b-2 border-dashed border-[hsl(var(--admin-border))]">
                      <FileText className="h-16 w-16 text-[hsl(var(--admin-text-muted))]" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={
                        item.status === "published" ? "success" : "warning"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-[hsl(var(--admin-text-primary))] text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--admin-text-secondary))] line-clamp-3 mb-4 flex-1">
                    {item.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--admin-border))]">
                    <p className="text-xs text-[hsl(var(--admin-text-muted))]">
                      {formatDate(item.updatedAt)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(var(--admin-text-secondary))] hover:bg-[hsl(var(--admin-hover))] hover:text-[hsl(var(--admin-text-primary))] h-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="admin-card admin-border"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/content/${type}/edit/${item._id}`
                            )
                          }
                          className="admin-text hover:bg-[hsl(var(--admin-hover))] cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: item._id,
                              title: item.title,
                            })
                          }
                          className="text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
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
        onOpenChange={(open) => setDeleteDialog({ open, id: null, title: "" })}
        resourceName={`"${deleteDialog.title}"`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
