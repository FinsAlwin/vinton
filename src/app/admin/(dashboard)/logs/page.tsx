"use client";

import { useState } from "react";
import { Card } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Badge } from "@/components/admin/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { useLogs } from "@/hooks/useLogs";
import {
  Search,
  FileText,
  Upload,
  Trash2,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  AlertCircle,
  Activity,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@/types";

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

function formatActionText(action: string): string {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { logs, pagination, isLoading } = useLogs({
    page,
    limit: 50,
    search,
    action: actionFilter,
    resource: resourceFilter,
  });

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold admin-text mb-2">System Logs</h1>
        <p className="admin-text-secondary">
          Monitor all system activities and changes
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 admin-text-muted" />
              <Input
                placeholder="Search by email, resource, or path..."
                className="pl-9 admin-card admin-border admin-text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Action Filter */}
            <select
              className="px-3 py-2 rounded-md admin-card admin-border admin-text text-sm min-w-[200px]"
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Actions</option>
              <option value="CREATE_CONTENT">Create Content</option>
              <option value="UPDATE_CONTENT">Update Content</option>
              <option value="DELETE_CONTENT">Delete Content</option>
              <option value="UPLOAD_MEDIA">Upload Media</option>
              <option value="DELETE_MEDIA">Delete Media</option>
              <option value="UPDATE_SETTINGS">Update Settings</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILED">Login Failed</option>
              <option value="LOGOUT">Logout</option>
            </select>

            {/* Resource Filter */}
            <select
              className="px-3 py-2 rounded-md admin-card admin-border admin-text text-sm min-w-[180px]"
              value={resourceFilter}
              onChange={(e) => {
                setResourceFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Resources</option>
              <option value="content">Content</option>
              <option value="media">Media</option>
              <option value="settings">Settings</option>
              <option value="auth">Authentication</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(search || actionFilter || resourceFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setActionFilter("");
                setResourceFilter("");
                setPage(1);
              }}
              className="admin-border w-full sm:w-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Logs Table */}
      {isLoading ? (
        <Card className="p-12">
          <div className="text-center admin-text-secondary">
            Loading logs...
          </div>
        </Card>
      ) : logs.length === 0 ? (
        <Card hover="lift" className="p-12 text-center">
          <Activity className="h-16 w-16 admin-text-muted mx-auto mb-4" />
          <p className="admin-text-muted text-lg">No logs found</p>
          <p className="admin-text-muted text-sm mt-2">
            Try adjusting your filters or search query
          </p>
        </Card>
      ) : (
        <Card hover="lift">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b admin-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider hidden md:table-cell">
                    Resource
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider hidden lg:table-cell">
                    IP Address
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium admin-text-secondary uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y admin-border">
                {logs.map((log) => {
                  const Icon = actionIcons[log.action] || Activity;
                  const iconColor =
                    actionColors[log.action] || "admin-text-muted";
                  const badgeVariant =
                    actionBadgeVariant[log.action] || "secondary";

                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-[hsl(var(--admin-hover))]/50 admin-transition"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm admin-text">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs admin-text-muted">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium admin-text truncate max-w-[150px]">
                          {log.email || log.user?.email || "System"}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", iconColor)} />
                          <Badge variant={badgeVariant}>
                            {formatActionText(log.action)}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className="text-sm admin-text-secondary capitalize">
                          {log.resource}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs admin-text-muted font-mono">
                          {log.ipAddress || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Badge
                          variant={
                            log.statusCode >= 200 && log.statusCode < 300
                              ? "success"
                              : "destructive"
                          }
                        >
                          {log.statusCode}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                          className="admin-text-secondary"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            Page {page} of {pagination.totalPages} ({pagination.total} total)
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

      {/* Log Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="admin-card admin-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="admin-text">Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs admin-text-muted mb-1">Timestamp</p>
                  <p className="text-sm admin-text">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs admin-text-muted mb-1">User</p>
                  <p className="text-sm admin-text">
                    {selectedLog.email || selectedLog.user?.email || "System"}
                  </p>
                </div>
                <div>
                  <p className="text-xs admin-text-muted mb-1">Action</p>
                  <Badge
                    variant={
                      actionBadgeVariant[selectedLog.action] || "secondary"
                    }
                  >
                    {formatActionText(selectedLog.action)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs admin-text-muted mb-1">Resource</p>
                  <p className="text-sm admin-text capitalize">
                    {selectedLog.resource}
                  </p>
                </div>
                <div>
                  <p className="text-xs admin-text-muted mb-1">Method</p>
                  <p className="text-sm admin-text font-mono">
                    {selectedLog.method}
                  </p>
                </div>
                <div>
                  <p className="text-xs admin-text-muted mb-1">Status Code</p>
                  <Badge
                    variant={
                      selectedLog.statusCode >= 200 &&
                      selectedLog.statusCode < 300
                        ? "success"
                        : "destructive"
                    }
                  >
                    {selectedLog.statusCode}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs admin-text-muted mb-1">IP Address</p>
                  <p className="text-sm admin-text font-mono">
                    {selectedLog.ipAddress || "N/A"}
                  </p>
                </div>
                {selectedLog.resourceId && (
                  <div>
                    <p className="text-xs admin-text-muted mb-1">Resource ID</p>
                    <p className="text-xs admin-text font-mono truncate">
                      {selectedLog.resourceId}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs admin-text-muted mb-1">Path</p>
                <p className="text-sm admin-text font-mono break-all">
                  {selectedLog.path}
                </p>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <p className="text-xs admin-text-muted mb-1">User Agent</p>
                  <p className="text-xs admin-text-secondary break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}

              {selectedLog.details &&
                Object.keys(selectedLog.details).length > 0 && (
                  <div>
                    <p className="text-xs admin-text-muted mb-2">
                      Additional Details
                    </p>
                    <pre className="admin-card p-4 rounded-lg text-xs admin-text overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      JSON.stringify(selectedLog, null, 2)
                    )
                  }
                  className="admin-border"
                >
                  Copy JSON
                </Button>
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
