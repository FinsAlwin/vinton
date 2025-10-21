"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  ScrollText,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/admin/ui/button";
import { useState, useEffect } from "react";
import { useSetting } from "@/hooks/useSettings";
import Image from "next/image";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const defaultMenuItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Logs",
    href: "/admin/logs",
    icon: ScrollText,
  },
];

interface AdminSidebarProps {
  items?: SidebarItem[];
  initialCollapsed?: boolean;
}

export function AdminSidebar({
  items = defaultMenuItems,
  initialCollapsed = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const siteLogo = useSetting<string>("site_logo");
  const siteName = useSetting<string>("site_name", "Vinton");

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg admin-card-bg admin-border border shadow-lg hover:opacity-80 admin-text transition-opacity"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen admin-sidebar-bg admin-border border-r transition-all duration-300",
          "shadow-xl lg:shadow-none",
          // Desktop (always visible, width changes based on collapsed state)
          collapsed ? "lg:w-16" : "lg:w-64",
          // Mobile (hidden by default, slides in when mobileOpen is true)
          "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-between admin-border border-b px-4">
            {!collapsed && (
              <Link
                href="/admin"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {siteLogo && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={siteLogo}
                      alt={siteName || "Admin"}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="text-xl font-bold admin-text">
                  {siteName || "Vinton"}
                </span>
              </Link>
            )}
            {collapsed && siteLogo && (
              <Link
                href="/admin"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <div className="relative w-8 h-8">
                  <Image
                    src={siteLogo}
                    alt={siteName || "Admin"}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "admin-text-secondary hover:admin-text hidden lg:flex",
                collapsed && !siteLogo && "mx-auto"
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  collapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto admin-scrollbar">
            {items.map((item) => {
              // Fix active tab detection to handle exact match for /admin
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin" // Dashboard: exact match only
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/"); // Others: exact or sub-paths
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "admin-sidebar-link",
                    isActive && "admin-sidebar-link-active",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                  aria-label={item.title}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
