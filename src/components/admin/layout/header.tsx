"use client";

import { LogOut, User, Bell, Search } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { ThemeToggle } from "@/components/admin/ui/theme-toggle";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  user?: {
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between admin-border border-b px-4 sm:px-6 lg:px-6 shadow-md">
      <div className="lg:hidden w-12">
        {/* Spacer for mobile menu button */}
      </div>

      {/* Search Bar - Desktop */}
      <div className="flex-1 flex items-center gap-3 max-w-md">
        <div className="relative w-full hidden md:block">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 admin-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg admin-card admin-border border admin-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          /> */}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search Button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden admin-text-secondary hover:admin-text"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="relative admin-text-secondary hover:admin-text"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button> */}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full admin-text-secondary hover:admin-text ml-2"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 admin-card admin-border"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none admin-text">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none admin-text-muted capitalize">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="admin-border" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer admin-text hover:bg-red-500/10 hover:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
