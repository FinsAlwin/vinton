import { ThemeProvider } from "@/components/admin/theme-provider";
import ClientSidebar from "@/components/admin/layout/ClientSidebar";
import ClientHeader from "@/components/admin/layout/ClientHeader";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Middleware already handles auth check, but we need user data
  if (!currentUser) {
    return null; // This should never happen due to middleware
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vinton-admin-theme">
      <div className="flex min-h-screen bg-background">
        <ClientSidebar />
        <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-300">
          <ClientHeader
            user={{
              email: currentUser.email,
              role: currentUser.role,
            }}
          />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
