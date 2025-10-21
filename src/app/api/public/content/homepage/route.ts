import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const homepage = await Content.findOne({
      contentType: "homepage",
      status: "published",
    })
      .select("-__v")
      .lean();

    if (!homepage) {
      return NextResponse.json(
        {
          success: false,
          error: "Homepage content not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: homepage,
    });
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch homepage content",
      },
      { status: 500 }
    );
  }
}
