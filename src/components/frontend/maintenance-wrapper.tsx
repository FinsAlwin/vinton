"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetting } from "@/hooks/useSettings";

export default function MaintenanceWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const maintenanceMode = useSetting<boolean>("maintenance_mode", false);

  useEffect(() => {
    // Only redirect if maintenance mode is enabled
    // This runs client-side, so it won't block the initial page load
    if (maintenanceMode) {
      router.push("/maintenance");
    }
  }, [maintenanceMode, router]);

  return <>{children}</>;
}
