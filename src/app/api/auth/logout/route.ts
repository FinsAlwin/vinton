import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { clearAuthCookies, getRefreshToken, getCurrentUser } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    const currentUser = await getCurrentUser();

    if (refreshToken && currentUser) {
      await connectDB();

      // Remove refresh token from database
      await User.findByIdAndUpdate(currentUser.userId, {
        $pull: { refreshTokens: refreshToken },
      });
    }

    // Clear cookies
    await clearAuthCookies();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
