import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Media from "@/models/Media";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import { uploadToS3, generateS3Key } from "@/lib/s3";
import type { ApiResponse } from "@/types";
import sharp from "sharp";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    if (file.type.startsWith("image/")) {
      try {
        const metadata = await sharp(buffer).metadata();
        width = metadata.width;
        height = metadata.height;
      } catch (error) {
        console.error("Error reading image metadata:", error);
      }
    }

    // Generate S3 key and upload
    const s3Key = generateS3Key(file.name);
    const url = await uploadToS3({
      key: s3Key,
      body: buffer,
      contentType: file.type,
    });

    await connectDB();

    // Create media record in database
    const media = await Media.create({
      filename: s3Key.split("/").pop(),
      originalName: file.name,
      s3Key,
      url,
      size: file.size,
      mimeType: file.type,
      width,
      height,
      uploadedBy: currentUser.userId,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "File uploaded successfully",
        data: {
          id: media._id.toString(),
          filename: media.filename,
          url: media.url,
          size: media.size,
          mimeType: media.mimeType,
          width: media.width,
          height: media.height,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
