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
    <div className="flex min-h-screen admin-body-bg admin-transition">
      <ClientSidebar />
      <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-300">
        <ClientHeader
          user={{
            email: currentUser.email,
            role: currentUser.role,
          }}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto admin-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
