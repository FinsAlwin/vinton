import { getSettings, getSettingValue } from "@/lib/settings";
import Image from "next/image";

export default async function MaintenancePage() {
  const settings = await getSettings();
  const siteName = getSettingValue<string>(settings, "site_name", "Vinton CMS");
  const siteLogo = getSettingValue<string>(settings, "site_logo");

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {siteLogo && (
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32">
              <Image
                src={siteLogo}
                alt={siteName}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4 text-foreground">{siteName}</h1>
        <div className="mb-6">
          <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Under Maintenance
          </h2>
          <p className="text-muted-foreground">
            We&apos;re currently performing scheduled maintenance. We&apos;ll be
            back online shortly. Thank you for your patience!
          </p>
        </div>
      </div>
    </div>
  );
}
