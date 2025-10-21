import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { logContentChange } from "@/lib/logger";
import type { ApiResponse } from "@/types";

// GET - Get single content item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
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

    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { type, id } = await params;

    await connectDB();

    const content = await Content.findOne({ _id: id, contentType: type })
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
    console.error("Get content error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update content item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
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

    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { type, id } = await params;
    const body = await request.json();

    await connectDB();

    const content = await Content.findOne({ _id: id, contentType: type });

    if (!content) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // Update slug if title changed
    if (body.title && body.title !== content.title) {
      let newSlug = slugify(body.title);
      const existingContent = await Content.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (existingContent) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      body.slug = newSlug;
    }

    // Update fields
    Object.assign(content, body);
    await content.save();

    // Log content update
    await logContentChange(
      request,
      "UPDATE_CONTENT",
      { userId: currentUser.userId, email: currentUser.email },
      id,
      type,
      content.title,
      200,
      {
        slug: content.slug,
        status: content.status,
        updatedFields: Object.keys(body),
      }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Content updated successfully",
        data: {
          ...content.toObject(),
          _id: content._id.toString(),
          media: (content.media as Array<{ toString: () => string }>).map((m) =>
            m.toString()
          ),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update content error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
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

    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { type, id } = await params;

    await connectDB();

    const content = await Content.findOneAndDelete({
      _id: id,
      contentType: type,
    });

    if (!content) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // Log content deletion
    await logContentChange(
      request,
      "DELETE_CONTENT",
      { userId: currentUser.userId, email: currentUser.email },
      id,
      type,
      content.title,
      200,
      {
        slug: content.slug,
      }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Content deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete content error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
