"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./header").then((m) => m.AdminHeader), {
  ssr: false,
  loading: () => <div className="h-16" />,
});

export default Header;
