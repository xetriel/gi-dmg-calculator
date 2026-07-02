import Link from "next/link";
import { CHARACTERS } from "@/data/registry/characters";

export default function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Character Calculators</h1>
      <p className="mt-1 text-sm text-gray-500">
        Pick a character from the sidebar to open its stat panel. Talent percentages and
        base-stat tables are loaded from extracted data in a later phase.
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CHARACTERS.map(c => (
          <li key={c.id}>
            <Link href={`/characters/${c.id}`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 dark:border-zinc-800 p-3 bg-white/50 dark:bg-zinc-900/30 hover:bg-gray-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white transition-all duration-200 shadow-xs">
              <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{c.name}</span>
              <span className="text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">{c.element} · {c.weapon}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
