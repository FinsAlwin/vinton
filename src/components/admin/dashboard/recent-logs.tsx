"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  FileText,
  Upload,
  Trash2,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  AlertCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

interface LogItem {
  _id: string;
  email?: string;
  action: string;
  resource: string;
  timestamp: Date | string;
  statusCode: number;
  ipAddress?: string;
}

interface RecentLogsProps {
  logs: LogItem[];
  className?: string;
}

const actionIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  CREATE_CONTENT: FileText,
  UPDATE_CONTENT: FileText,
  DELETE_CONTENT: Trash2,
  UPLOAD_MEDIA: Upload,
  DELETE_MEDIA: Trash2,
  UPDATE_SETTINGS: Settings,
  LOGIN_SUCCESS: LogIn,
  LOGIN_FAILED: LogIn,
  LOGOUT: LogOut,
  REGISTER_USER: UserPlus,
  ERROR: AlertCircle,
};

const actionColors: Record<string, string> = {
  CREATE_CONTENT: "text-green-500",
  UPDATE_CONTENT: "text-blue-500",
  DELETE_CONTENT: "text-red-500",
  DELETE_MEDIA: "text-red-500",
  UPLOAD_MEDIA: "text-purple-500",
  UPDATE_SETTINGS: "text-orange-500",
  LOGIN_SUCCESS: "text-green-500",
  LOGIN_FAILED: "text-red-500",
  LOGOUT: "text-gray-500",
  REGISTER_USER: "text-blue-500",
  ERROR: "text-red-500",
};

const actionBadgeVariant: Record<
  string,
  "success" | "warning" | "destructive" | "info" | "secondary"
> = {
  CREATE_CONTENT: "success",
  UPDATE_CONTENT: "info",
  DELETE_CONTENT: "destructive",
  DELETE_MEDIA: "destructive",
  UPLOAD_MEDIA: "info",
  UPDATE_SETTINGS: "warning",
  LOGIN_SUCCESS: "success",
  LOGIN_FAILED: "destructive",
  LOGOUT: "secondary",
  REGISTER_USER: "info",
  ERROR: "destructive",
};

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function formatActionText(action: string): string {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RecentLogs({ logs, className }: RecentLogsProps) {
  return (
    <Card hover="lift" className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-bold admin-text flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
        <Link href="/admin/logs">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2 text-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary))]/10"
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="p-6 text-center">
            <Activity className="h-8 w-8 admin-text-muted mx-auto mb-2" />
            <p className="text-sm admin-text-muted">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y admin-border">
            {logs.map((log) => {
              const Icon = actionIcons[log.action] || Activity;
              const iconColor = actionColors[log.action] || "admin-text-muted";
              const badgeVariant =
                actionBadgeVariant[log.action] || "secondary";

              return (
                <div
                  key={log._id}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[hsl(var(--admin-hover))]/50 admin-transition group"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--admin-body))] shrink-0",
                      iconColor
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge
                        variant={badgeVariant}
                        className="text-[10px] px-2 py-0"
                      >
                        {formatActionText(log.action)}
                      </Badge>
                      <span className="text-[10px] admin-text-muted">
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs admin-text truncate">
                      <span className="font-medium">
                        {log.email || "System"}
                      </span>
                      <span className="admin-text-muted"> • </span>
                      <span className="admin-text-secondary capitalize">
                        {log.resource}
                      </span>
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      log.statusCode >= 200 && log.statusCode < 300
                        ? "bg-[hsl(var(--admin-success))]"
                        : "bg-[hsl(var(--admin-danger))]"
                    )}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
