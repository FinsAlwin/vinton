"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  ChevronLeft,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/admin/ui/button";
import { Switch } from "@/components/admin/ui/switch";
import { useTheme } from "@/components/admin/theme-provider";
import { useState, useEffect } from "react";

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
    icon: Image,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
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
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Properly detect if dark mode is active (handles system theme)
  useEffect(() => {
    const checkDarkMode = () => {
      if (theme === "dark") {
        setIsDark(true);
      } else if (theme === "light") {
        setIsDark(false);
      } else {
        // system theme
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };

    checkDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300",
          // Solid opaque backgrounds for both light and dark modes
          "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
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
          <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
            {!collapsed && (
              <Link
                href="/admin"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Vinton Admin
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(collapsed && "mx-auto")}
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
          <nav className="flex-1 space-y-1 p-2">
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {!collapsed ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Theme
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isDark ? "Dark" : "Light"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Sun
                    className={cn(
                      "h-4 w-4",
                      !isDark ? "text-blue-600" : "text-gray-400"
                    )}
                  />
                  <Switch
                    checked={isDark}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                  <Moon
                    className={cn(
                      "h-4 w-4",
                      isDark ? "text-blue-500" : "text-gray-400"
                    )}
                  />
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
                className="w-full"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
