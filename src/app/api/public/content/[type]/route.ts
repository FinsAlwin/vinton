import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import type { ApiResponse } from "@/types";

// GET - List public content by type (NO AUTH REQUIRED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    await connectDB();

    // Build query - ONLY PUBLISHED CONTENT
    const query: Record<string, unknown> = {
      contentType: type,
      status: "published", // Only show published content publicly
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter (for portfolio)
    if (category) {
      query["fields.key"] = "category";
      query["fields.value"] = category;
    }

    // Featured filter (for services, testimonials)
    if (featured) {
      query["fields"] = {
        $elemMatch: {
          key: { $in: ["featured_homepage", "featured_on_homepage"] },
          value: true,
        },
      };
    }

    const [content, total] = await Promise.all([
      Content.find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .populate("media")
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
              media: Array<
                { toString: () => string } | Record<string, unknown>
              >;
            }
          >
        ).map((c) => ({
          ...c,
          _id: c._id.toString(),
          media: c.media.map((m) =>
            typeof m === "object" && m !== null && "_id" in m
              ? {
                  ...(m as Record<string, unknown>),
                  _id: (
                    m as { _id: { toString: () => string } }
                  )._id.toString(),
                }
              : typeof m === "object" && "toString" in m
              ? (m as { toString: () => string }).toString()
              : m
          ),
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
    console.error("Get public content error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
