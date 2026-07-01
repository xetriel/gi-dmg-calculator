"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHARACTERS } from "@/data/registry/characters";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 shrink-0 border-r border-gray-200 dark:border-zinc-800 p-3 space-y-1 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm h-full overflow-y-auto">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Character Calculators</p>
      {CHARACTERS.map(c => {
        const href = `/characters/${c.id}`;
        const isActive = pathname === href;
        return (
          <Link
            key={c.id}
            href={href}
            className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-zinc-200/70 text-black dark:bg-zinc-800 dark:text-white font-semibold shadow-xs"
                : "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
            }`}
          >
            <span>{c.name}</span>
            <span
              className={`text-xs transition-colors duration-200 ${
                isActive
                  ? "text-zinc-600 dark:text-zinc-300"
                  : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
              }`}
            >
              {c.element} · {c.weapon}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

