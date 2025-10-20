import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster, ToasterProvider } from "@/components/admin/ui/toast";
import { getSettings, getSettingValue } from "@/lib/settings";
import GoogleAnalytics from "@/components/frontend/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const siteName = getSettingValue<string>(settings, "site_name", "Vinton CMS");
  const seoTitle = getSettingValue<string>(
    settings,
    "seo_default_title",
    siteName
  );
  const seoDescription = getSettingValue<string>(
    settings,
    "seo_default_description",
    "A modern content management system"
  );
  const ogImage = getSettingValue<string>(settings, "seo_default_og_image");
  const favicon = getSettingValue<string>(settings, "site_favicon");

  return {
    title: {
      default: seoTitle,
      template: `%s | ${siteName}`,
    },
    description: seoDescription,
    icons: favicon
      ? {
          icon: favicon,
          shortcut: favicon,
          apple: favicon,
        }
      : undefined,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      siteName: siteName,
      type: "website",
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const analyticsId = getSettingValue<string>(
    settings,
    "seo_google_analytics_id"
  );
  const searchConsoleCode = getSettingValue<string>(
    settings,
    "seo_google_search_console"
  );

  return (
    <html lang="en" className="dark">
      <head>
        {searchConsoleCode && (
          <meta
            name="google-site-verification"
            content={searchConsoleCode.replace(/<\/?[^>]+(>|$)/g, "")}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToasterProvider>
          {children}
          <Toaster />
        </ToasterProvider>
        {analyticsId && <GoogleAnalytics measurementId={analyticsId} />}
      </body>
    </html>
  );
}
