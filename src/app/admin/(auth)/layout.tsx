import { ThemeProvider } from "@/components/admin/theme-provider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vinton-admin-theme">
      {children}
    </ThemeProvider>
  );
}
