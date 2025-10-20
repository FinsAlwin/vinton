import useSWR from "swr";

interface SettingsMap {
  [key: string]: unknown;
}

const fetcher = async (url: string): Promise<SettingsMap> => {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch settings");
  }

  const settingsMap: SettingsMap = {};
  data.data.forEach((setting: { key: string; value: unknown }) => {
    settingsMap[setting.key] = setting.value;
  });

  return settingsMap;
};

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<SettingsMap>(
    "/api/settings",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    settings: data || {},
    isLoading,
    error,
    mutate,
  };
}

export function useSetting<T = unknown>(
  key: string,
  defaultValue?: T
): T | undefined {
  const { settings } = useSettings();
  return (settings[key] as T) ?? defaultValue;
}
