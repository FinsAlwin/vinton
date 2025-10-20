import { getSettings, getSettingValue } from "@/lib/settings";
import Image from "next/image";
import Footer from "@/components/frontend/footer";
import MaintenanceWrapper from "@/components/frontend/maintenance-wrapper";

export default async function HomePage() {
  const settings = await getSettings();
  const siteName = getSettingValue<string>(settings, "site_name", "Vinton");
  const siteTagline = getSettingValue<string>(
    settings,
    "site_tagline",
    "Coming Soon"
  );
  const siteLogo = getSettingValue<string>(settings, "site_logo");

  return (
    <MaintenanceWrapper>
      <div className="min-h-screen w-full bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-foreground text-center max-w-2xl">
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
            <h1 className="text-5xl font-bold mb-4">{siteName}</h1>
            <p className="text-xl text-muted-foreground">{siteTagline}</p>
          </div>
        </div>
        <Footer />
      </div>
    </MaintenanceWrapper>
  );
}
