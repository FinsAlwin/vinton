import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ApiResponse } from "@/types";

// GET - List content by type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
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

    const { type } = await params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query: Record<string, unknown> = { contentType: type };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const [content, total] = await Promise.all([
      Content.find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(query),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: (
          content as unknown as Array<
            Record<string, unknown> & {
              _id: { toString: () => string };
              media: Array<{ toString: () => string }>;
            }
          >
        ).map((c) => ({
          ...c,
          _id: c._id.toString(),
          media: c.media.map((m) => m.toString()),
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
    console.error("Get content error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
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

    const { type } = await params;
    const body = await request.json();

    const { title, description, fields, status, metadata, media } = body;

    if (!title) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate unique slug
    let slug = slugify(title);
    const existingContent = await Content.findOne({ slug });
    if (existingContent) {
      slug = `${slug}-${Date.now()}`;
    }

    const content = await Content.create({
      contentType: type,
      title,
      slug,
      description,
      fields: fields || [],
      status: status || "draft",
      metadata: {
        ...metadata,
        author: currentUser.email,
      },
      media: media || [],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Content created successfully",
        data: {
          ...content.toObject(),
          _id: content._id.toString(),
          media: (content.media as Array<{ toString: () => string }>).map((m) =>
            m.toString()
          ),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create content error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
