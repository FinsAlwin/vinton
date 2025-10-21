"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { FileText, Plus, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";

interface ContentItem {
  _id: string;
  title: string;
  status: "draft" | "published";
  updatedAt: Date | string;
  contentType: string;
}

interface ContentType {
  name: string;
  label: string;
  icon?: string;
  description?: string;
}

interface AllContentTabsProps {
  contentByType: Record<string, ContentItem[]>;
  contentTypes: ContentType[];
  className?: string;
}

export function AllContentTabs({
  contentByType,
  contentTypes,
  className,
}: AllContentTabsProps) {
  const [activeTab, setActiveTab] = useState(contentTypes[0]?.name || "");

  const activeContent = contentByType[activeTab] || [];
  const activeType = contentTypes.find((ct) => ct.name === activeTab);

  return (
    <Card hover="lift" className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold admin-text flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Recent Content
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Tabs */}
        <div className="px-4 mb-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {contentTypes.map((contentType) => (
              <button
                key={contentType.name}
                onClick={() => setActiveTab(contentType.name)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === contentType.name
                    ? "bg-[hsl(var(--admin-primary))] text-white"
                    : "text-[hsl(var(--admin-text-secondary))] hover:bg-[hsl(var(--admin-hover))] hover:text-[hsl(var(--admin-text-primary))]"
                }`}
              >
                {contentType.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="border-t border-[hsl(var(--admin-border))]">
          {activeContent.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-8 w-8 admin-text-muted mx-auto mb-2" />
              <p className="text-sm admin-text-muted mb-3">
                No {activeType?.label.toLowerCase()} yet
              </p>
              <Link href={`/admin/content/${activeTab}/new`}>
                <Button size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Create First
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y admin-border">
              {activeContent.map((item) => (
                <Link
                  key={item._id}
                  href={`/admin/content/${activeTab}/edit/${item._id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[hsl(var(--admin-hover))]/50 admin-transition group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium admin-text truncate group-hover:text-[hsl(var(--admin-primary))] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] admin-text-muted mt-0.5">
                        {formatDate(item.updatedAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "published" ? "success" : "warning"
                      }
                      className="text-[10px] px-2 py-0 shrink-0"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </Link>
              ))}
              {activeContent.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 bg-[hsl(var(--admin-body))]/50">
                  <Link href={`/admin/content/${activeTab}`}>
                    <span className="text-xs text-[hsl(var(--admin-primary))] hover:underline">
                      View All {activeType?.label}
                    </span>
                  </Link>
                  <Link href={`/admin/content/${activeTab}/new`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2 text-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary))]/10"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      New
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
