import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Media from "@/models/Media";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import { deleteFromS3 } from "@/lib/s3";
import { logMediaChange } from "@/lib/logger";
import type { ApiResponse } from "@/types";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await connectDB();

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    // Delete from S3
    try {
      await deleteFromS3(media.s3Key);
    } catch (error) {
      console.error("Error deleting from S3:", error);
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    // Log media deletion
    await logMediaChange(
      request,
      "DELETE_MEDIA",
      { userId: currentUser.userId, email: currentUser.email },
      id,
      media.originalName,
      200,
      {
        s3Key: media.s3Key,
        size: media.size,
        mimeType: media.mimeType,
      }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Media deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete media error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await connectDB();

    const media = await Media.findById(id)
      .populate("uploadedBy", "email")
      .lean();
    if (!media) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          ...media,
          _id: media._id.toString(),
          uploadedBy: (
            media.uploadedBy as unknown as
              | { _id: { toString: () => string }; email: string }
              | undefined
          )?._id
            ? {
                id: (
                  media.uploadedBy as unknown as {
                    _id: { toString: () => string };
                    email: string;
                  }
                )._id.toString(),
                email: (
                  media.uploadedBy as unknown as {
                    _id: { toString: () => string };
                    email: string;
                  }
                ).email,
              }
            : null,
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
