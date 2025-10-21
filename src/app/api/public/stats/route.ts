import { NextResponse } from "next/server";
import { calculateStatistics } from "@/lib/statistics";
import type { ApiResponse } from "@/types";

// GET - Get site statistics (NO AUTH REQUIRED)
export async function GET() {
  try {
    const stats = await calculateStatistics();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get statistics error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
