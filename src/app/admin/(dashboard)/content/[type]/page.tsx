"use client";

import { useState, use } from "react";
import Link from "next/link";
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
import { Plus, Search, MoreVertical, Trash2, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{capitalizeType}</h1>
          <p className="text-muted-foreground">Manage your {type} content</p>
        </div>
        <Link href={`/admin/content/${type}/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Status: {statusFilter || "All"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("published")}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
              Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : content.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No content yet</p>
          <Link href={`/admin/content/${type}/new`}>
            <Button className="mt-4">Create Your First {capitalizeType}</Button>
          </Link>
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {content.map(
              (item: {
                _id: string;
                title: string;
                description?: string;
                status: "draft" | "published";
                createdAt: string | Date;
                updatedAt: string | Date;
              }) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <Badge
                        variant={
                          item.status === "published" ? "success" : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {formatDate(item.createdAt)} • Updated{" "}
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/content/${type}/edit/${item._id}`)
                        }
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
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null, title: "" })}
        resourceName={`"${deleteDialog.title}"`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
