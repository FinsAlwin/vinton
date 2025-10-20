import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (category) {
      query.category = category;
    }

    const settings = await Settings.find(query).lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: settings.map(
          (
            s: Record<string, unknown> & { _id: { toString: () => string } }
          ) => ({
            ...s,
            _id: s._id.toString(),
          })
        ),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = (await request.json()) as {
      key?: string;
      value?: unknown;
      category?: string;
      description?: string;
    };
    const { key, value, category, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Key and value are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert setting
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value, category, description },
      { upsert: true, new: true }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Setting saved successfully",
        data: {
          ...setting.toObject(),
          _id: setting._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
