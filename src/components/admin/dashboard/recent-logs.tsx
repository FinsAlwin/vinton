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

const actionBadgeClass: Record<string, string> = {
  CREATE_CONTENT: "admin-badge-success",
  UPDATE_CONTENT: "admin-badge-info",
  DELETE_CONTENT: "admin-badge-danger",
  DELETE_MEDIA: "admin-badge-danger",
  UPLOAD_MEDIA: "bg-purple-500/10 text-purple-500",
  UPDATE_SETTINGS: "admin-badge-warning",
  LOGIN_SUCCESS: "admin-badge-success",
  LOGIN_FAILED: "admin-badge-danger",
  LOGOUT: "bg-gray-500/10 text-gray-500",
  REGISTER_USER: "admin-badge-info",
  ERROR: "admin-badge-danger",
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg admin-text flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <Link href="/admin/logs">
          <Button variant="outline" size="sm" className="admin-border">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="h-12 w-12 admin-text-muted mx-auto mb-3" />
            <p className="admin-text-muted">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y admin-border">
            {logs.map((log) => {
              const Icon = actionIcons[log.action] || Activity;
              const iconColor = actionColors[log.action] || "admin-text-muted";
              const badgeClass =
                actionBadgeClass[log.action] || "bg-gray-500/10 text-gray-500";

              return (
                <div
                  key={log._id}
                  className="flex items-start gap-3 p-4 hover:bg-gray-500/5 admin-transition"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-gray-500/10",
                      iconColor
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={cn("text-xs", badgeClass)}>
                        {formatActionText(log.action)}
                      </Badge>
                      <span className="text-xs admin-text-muted">
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm admin-text">
                      <span className="font-medium">
                        {log.email || "System"}
                      </span>
                      {" • "}
                      <span className="admin-text-secondary capitalize">
                        {log.resource}
                      </span>
                    </p>
                    {log.ipAddress && (
                      <p className="text-xs admin-text-muted mt-1">
                        IP: {log.ipAddress}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5",
                      log.statusCode >= 200 && log.statusCode < 300
                        ? "bg-green-500"
                        : "bg-red-500"
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
