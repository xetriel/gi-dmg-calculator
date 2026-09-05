"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNavTabs() {
  const pathname = usePathname();
  const isWiki = pathname === "/wiki" || pathname.startsWith("/wiki/");
  const isCalculator = !isWiki;

  return (
    <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner select-none">
      <Link
        href="/"
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
          isCalculator
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700/80 font-bold"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        <span className="text-amber-500">⚡</span>
        <span>Calculator</span>
      </Link>

      <Link
        href="/wiki"
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
          isWiki
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700/80 font-bold"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        <span className="text-amber-500">📖</span>
        <span>Wiki</span>
      </Link>
    </div>
  );
}
