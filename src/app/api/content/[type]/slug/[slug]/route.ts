import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import type { ApiResponse } from "@/types";

// GET - Get content by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
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

    // For slug-based access, allow public access or authenticated access
    const { type, slug } = await params;

    await connectDB();

    const query: Record<string, unknown> = { contentType: type, slug };

    // If not authenticated, only return published content
    if (!currentUser) {
      query.status = "published";
    }

    const content = await Content.findOne(query).populate("media").lean();

    if (!content) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          ...content,
          _id: content._id.toString(),
          media: (
            content.media as unknown as Array<
              Record<string, unknown> & {
                _id: { toString: () => string };
                uploadedBy?: { toString: () => string };
              }
            >
          ).map((m) => ({
            ...m,
            _id: m._id.toString(),
            uploadedBy: m.uploadedBy?.toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get content by slug error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
