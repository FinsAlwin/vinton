import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  getCurrentUser,
  extractBearerToken,
  verifyAccessToken,
} from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Check for bearer token in header (for external API access)
    const authHeader = request.headers.get("authorization");
    let currentUser = null;

    if (authHeader) {
      const token = extractBearerToken(authHeader);
      if (token) {
        currentUser = await verifyAccessToken(token);
      }
    } else {
      // Check cookie-based auth
      currentUser = await getCurrentUser();
    }

    if (!currentUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(currentUser.userId).select(
      "-password -refreshTokens"
    );
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get current user error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
