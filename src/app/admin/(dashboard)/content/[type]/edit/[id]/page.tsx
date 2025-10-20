"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContentItem } from "@/hooks/useSWR";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { FeaturedImagePicker } from "@/components/admin/ui/featured-image-picker";
import { MediaGallery } from "@/components/admin/ui/media-gallery";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/ui/use-toast";

export default function EditContentPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { content, isLoading: contentLoading } = useContentItem(type, id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft" as "draft" | "published",
    fields: [] as Array<{ key: string; value: unknown; type: string }>,
    metadata: {
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [] as string[],
      featuredImage: "",
    },
    media: [] as Array<{
      _id: string;
      url: string;
      originalName: string;
      mimeType: string;
    }>,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        description: content.description || "",
        status: content.status || "draft",
        fields: content.fields || [],
        metadata: {
          seoTitle: content.metadata?.seoTitle || "",
          seoDescription: content.metadata?.seoDescription || "",
          seoKeywords: content.metadata?.seoKeywords || [],
          featuredImage: content.metadata?.featuredImage || "",
        },
        media: content.media || [],
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract media IDs for API
      const payload = {
        ...formData,
        media: formData.media.map((m) => m._id),
      };

      const response = await fetch(`/api/content/${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Update failed",
          description: data.error || "Failed to update content",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Success!",
        description: "Content updated successfully",
        variant: "success",
      });
      router.push(`/admin/content/${type}`);
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while updating content",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Content not found</p>
      </div>
    );
  }

  const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/content/${type}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit {capitalizeType}</h1>
          <p className="text-muted-foreground">
            Update the content details below
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Status: {formData.status}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setFormData({ ...formData, status: "draft" })}
            >
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFormData({ ...formData, status: "published" })}
            >
              Published
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleSubmit} disabled={loading || !formData.title}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <FeaturedImagePicker
              imageUrl={formData.metadata.featuredImage}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  metadata: {
                    ...formData.metadata,
                    featuredImage: url,
                  },
                })
              }
            />
          </CardContent>
        </Card>

        {/* Media Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Media Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaGallery
              media={formData.media}
              onChange={(media) => setFormData({ ...formData, media })}
            />
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.metadata.seoTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      seoTitle: e.target.value,
                    },
                  })
                }
                placeholder="SEO title for search engines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.metadata.seoDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      seoDescription: e.target.value,
                    },
                  })
                }
                placeholder="SEO description for search engines"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
