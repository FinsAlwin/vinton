"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ActivityItem {
  id: string;
  title: string;
  type: string;
  status: "published" | "draft" | "pending" | "archived";
  date: string;
  author?: string;
}

interface ActivityTableProps {
  items: ActivityItem[];
  title?: string;
  className?: string;
}

const statusStyles = {
  published: "admin-badge-success",
  draft: "admin-badge-warning",
  pending: "admin-badge-info",
  archived: "bg-gray-500/10 text-gray-500",
};

export function ActivityTable({
  items,
  title = "Recent Activity",
  className,
}: ActivityTableProps) {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.status === filter);

  return (
    <Card hover="lift" className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg admin-text">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              filter === "all"
                ? "admin-primary-bg text-white"
                : "admin-text-secondary hover:bg-gray-500/10"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("published")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              filter === "published"
                ? "admin-primary-bg text-white"
                : "admin-text-secondary hover:bg-gray-500/10"
            )}
          >
            Published
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              filter === "draft"
                ? "admin-primary-bg text-white"
                : "admin-text-secondary hover:bg-gray-500/10"
            )}
          >
            Draft
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="h-12 w-12 admin-text-muted mx-auto mb-3" />
            <p className="admin-text-muted">No items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b admin-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider hidden md:table-cell">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y admin-border">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-500/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium admin-text">
                          {item.title}
                        </span>
                        <span className="text-xs admin-text-muted md:hidden mt-1">
                          {item.type} • {item.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm admin-text-secondary">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm admin-text-muted">
                        {item.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={cn("capitalize", statusStyles[item.status])}
                      >
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
