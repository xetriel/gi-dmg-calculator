import Link from "next/link";
import { CHARACTERS } from "@/data/registry/characters";

export function Sidebar() {
  return (
    <nav className="w-60 shrink-0 border-r p-3 space-y-1">
      <p className="px-2 text-xs uppercase tracking-wide text-gray-500">Character Calculators</p>
      {CHARACTERS.map(c => (
        <Link key={c.id} href={`/characters/${c.id}`}
          className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100">
          <span>{c.name}</span>
          <span className="text-xs text-gray-400">{c.element} · {c.weapon}</span>
        </Link>
      ))}
    </nav>
  );
}
