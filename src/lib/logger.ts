import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";

interface LogParams {
  user?: { userId: string; email: string };
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  path: string;
  statusCode: number;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  duration?: number;
}

/**
 * Extract client IP address from request headers
 */
export function getClientIP(request: NextRequest): string {
  // Try various headers for IP (handles proxies and load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback to a placeholder (Next.js doesn't expose socket in Edge runtime)
  return "unknown";
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}

/**
 * Create a log entry in the database
 * Non-blocking - errors won't affect the main request
 */
export async function createLog(params: LogParams): Promise<void> {
  try {
    await connectDB();

    const logEntry = new ActivityLog({
      user: params.user?.userId || undefined,
      email: params.user?.email || undefined,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      method: params.method,
      path: params.path,
      statusCode: params.statusCode,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      details: params.details,
      duration: params.duration,
      timestamp: new Date(),
    });

    await logEntry.save();
  } catch (error) {
    // Log to console but don't throw - logging failures shouldn't break the app
    console.error("Failed to create activity log:", error);
  }
}

/**
 * Log API call with automatic IP and user agent extraction
 */
export async function logApiCall(
  request: NextRequest,
  params: Omit<LogParams, "ipAddress" | "userAgent">
): Promise<void> {
  const ipAddress = getClientIP(request);
  const userAgent = getUserAgent(request);

  return createLog({
    ...params,
    ipAddress,
    userAgent,
  });
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  request: NextRequest,
  action: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT" | "REGISTER_USER",
  email: string,
  details?: Record<string, unknown>
): Promise<void> {
  return logApiCall(request, {
    action,
    resource: "auth",
    method: request.method,
    path: new URL(request.url).pathname,
    statusCode: action === "LOGIN_FAILED" ? 401 : 200,
    user: action !== "LOGIN_FAILED" ? { userId: "", email } : undefined,
    details,
  });
}

/**
 * Log content changes (CREATE, UPDATE, DELETE)
 */
export async function logContentChange(
  request: NextRequest,
  action: "CREATE_CONTENT" | "UPDATE_CONTENT" | "DELETE_CONTENT",
  user: { userId: string; email: string },
  contentId: string,
  contentType: string,
  title: string,
  statusCode: number,
  details?: Record<string, unknown>
): Promise<void> {
  return logApiCall(request, {
    user,
    action,
    resource: "content",
    resourceId: contentId,
    method: request.method,
    path: new URL(request.url).pathname,
    statusCode,
    details: {
      contentType,
      title,
      ...details,
    },
  });
}

/**
 * Log media operations
 */
export async function logMediaChange(
  request: NextRequest,
  action: "UPLOAD_MEDIA" | "DELETE_MEDIA",
  user: { userId: string; email: string },
  mediaId: string,
  filename: string,
  statusCode: number,
  details?: Record<string, unknown>
): Promise<void> {
  return logApiCall(request, {
    user,
    action,
    resource: "media",
    resourceId: mediaId,
    method: request.method,
    path: new URL(request.url).pathname,
    statusCode,
    details: {
      filename,
      ...details,
    },
  });
}

/**
 * Log settings changes
 */
export async function logSettingsChange(
  request: NextRequest,
  user: { userId: string; email: string },
  settingKey: string,
  category: string,
  statusCode: number,
  details?: Record<string, unknown>
): Promise<void> {
  return logApiCall(request, {
    user,
    action: "UPDATE_SETTINGS",
    resource: "settings",
    resourceId: settingKey,
    method: request.method,
    path: new URL(request.url).pathname,
    statusCode,
    details: {
      key: settingKey,
      category,
      ...details,
    },
  });
}

/**
 * Log system errors
 */
export async function logError(
  request: NextRequest,
  error: Error | string,
  user?: { userId: string; email: string },
  statusCode = 500
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  return logApiCall(request, {
    user,
    action: "ERROR",
    resource: "system",
    method: request.method,
    path: new URL(request.url).pathname,
    statusCode,
    details: {
      error: errorMessage,
      stack: errorStack,
    },
  });
}
