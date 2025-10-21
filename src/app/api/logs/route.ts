import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Auth check - only authenticated admins can view logs
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const action = searchParams.get("action") || "";
    const resource = searchParams.get("resource") || "";
    const userId = searchParams.get("userId") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { path: { $regex: search, $options: "i" } },
        { resource: { $regex: search, $options: "i" } },
      ];
    }

    if (action) {
      query.action = action;
    }

    if (resource) {
      query.resource = resource;
    }

    if (userId) {
      query.user = userId;
    }

    if (startDate || endDate) {
      const timestampQuery: Record<string, Date> = {};
      if (startDate) {
        timestampQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        timestampQuery.$lte = new Date(endDate);
      }
      query.timestamp = timestampQuery;
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "email role")
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: logs.map((log) => ({
          ...log,
          _id: log._id.toString(),
          user: log.user
            ? {
                _id: (
                  log.user as unknown as {
                    _id: { toString: () => string };
                    email: string;
                  }
                )._id.toString(),
                email: (log.user as unknown as { email: string }).email,
              }
            : undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get logs error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
