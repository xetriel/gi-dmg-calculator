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
              className="flex items-center justify-between rounded border p-3 hover:bg-gray-100">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-gray-400">{c.element} · {c.weapon}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
