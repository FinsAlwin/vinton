import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import type { ApiResponse } from "@/types";

// List of public settings keys (safe to expose to frontend)
const PUBLIC_SETTINGS_KEYS = [
  "site_name",
  "site_tagline",
  "site_logo",
  "site_favicon",
  "contact_email",
  "contact_phone",
  "contact_address",
  "social_facebook",
  "social_twitter",
  "social_instagram",
  "social_linkedin",
  "social_youtube",
  "social_github",
  "seo_default_title",
  "seo_default_description",
  "seo_default_keywords",
  "seo_default_og_image",
  "seo_google_analytics_id",
];

// GET - Get public settings (NO AUTH REQUIRED)
// Excludes sensitive settings like SMTP credentials, maintenance mode, etc.
export async function GET() {
  try {
    const allSettings = await getSettings();

    // Filter to only include public settings
    const publicSettings: Record<string, unknown> = {};
    PUBLIC_SETTINGS_KEYS.forEach((key) => {
      if (allSettings[key] !== undefined) {
        publicSettings[key] = allSettings[key];
      }
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: publicSettings,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get public settings error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
