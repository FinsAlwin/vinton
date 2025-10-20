import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Media from "@/models/Media";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get("authorization");
    let currentUser = null;

    if (authHeader) {
      const token = extractBearerToken(authHeader);
      if (token) {
        currentUser = await verifyAccessToken(token);
      }
    } else {
      currentUser = await getCurrentUser();
    }

    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const mimeType = searchParams.get("mimeType") || "";

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: "i" } },
        { originalName: { $regex: search, $options: "i" } },
      ];
    }
    if (mimeType) {
      query.mimeType = { $regex: `^${mimeType}`, $options: "i" };
    }

    const [media, total] = await Promise.all([
      Media.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("uploadedBy", "email")
        .lean(),
      Media.countDocuments(query),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: (
          media as unknown as Array<
            Record<string, unknown> & {
              _id: { toString: () => string };
              uploadedBy?: { _id: { toString: () => string }; email: string };
            }
          >
        ).map((m) => ({
          ...m,
          _id: m._id.toString(),
          uploadedBy: m.uploadedBy?._id
            ? {
                id: m.uploadedBy._id.toString(),
                email: m.uploadedBy.email,
              }
            : null,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get media error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
