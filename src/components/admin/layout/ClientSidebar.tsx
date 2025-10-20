"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./sidebar").then((m) => m.AdminSidebar), {
  ssr: false,
  loading: () => <div className="w-64" />,
});

export default Sidebar;
