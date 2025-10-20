import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export interface SettingsMap {
  [key: string]: unknown;
}

// Server-side: Fetch all settings with caching
export const getSettings = unstable_cache(
  async (): Promise<SettingsMap> => {
    try {
      await connectDB();
      const settings = await Settings.find({}).lean();

      const settingsMap: SettingsMap = {};
      settings.forEach((setting: { key: string; value: unknown }) => {
        settingsMap[setting.key] = setting.value;
      });

      return settingsMap;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return {};
    }
  },
  ["app-settings"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["settings"],
  }
);

// Server-side: Get a specific setting value
export async function getSetting<T = unknown>(
  key: string,
  defaultValue?: T
): Promise<T> {
  const settings = await getSettings();
  return (settings[key] as T) ?? (defaultValue as T);
}

// Server-side: Get settings by category
export async function getSettingsByCategory(
  category: string
): Promise<SettingsMap> {
  try {
    await connectDB();
    const settings = await Settings.find({ category }).lean();

    const settingsMap: SettingsMap = {};
    settings.forEach((setting: { key: string; value: unknown }) => {
      settingsMap[setting.key] = setting.value;
    });

    return settingsMap;
  } catch (error) {
    console.error(`Error fetching settings for category ${category}:`, error);
    return {};
  }
}

// Helper: Get typed setting value
export function getSettingValue<T = unknown>(
  settings: SettingsMap,
  key: string,
  defaultValue?: T
): T {
  return (settings[key] as T) ?? (defaultValue as T);
}
