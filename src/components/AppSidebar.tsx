"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const isWiki = pathname === "/wiki" || pathname.startsWith("/wiki/");

  if (isWiki) {
    return <WikiSidebar />;
  }

  return <Sidebar />;
}
