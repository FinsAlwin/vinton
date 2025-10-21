import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import type { ApiResponse } from "@/types";

// GET - Get single public content item by slug (NO AUTH REQUIRED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;

    await connectDB();

    // ONLY PUBLISHED CONTENT
    const content = await Content.findOne({
      contentType: type,
      slug: slug,
      status: "published", // Only show published content publicly
    })
      .populate("media")
      .lean();

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
    console.error("Get public content by slug error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
