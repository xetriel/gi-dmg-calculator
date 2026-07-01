"use client";
import { useState } from "react";
import type { CharacterConfig, StatField } from "@/data/registry/types";

// Excel-style stat panel. Fields are generated entirely from the registry;
// values are wired to local React state only (no damage engine yet).
const GROUPS: { key: StatField["group"]; label: string }[] = [
  { key: "base", label: "Base Stats" },
  { key: "combat", label: "Combat Stats" },
  { key: "advanced", label: "Advanced Stats" },
  { key: "defense", label: "Enemy & Defense" },
];

export function CharacterCalculator({ config }: { config: CharacterConfig }) {
  const [values, setValues] = useState<Record<string, number>>({});
  const set = (k: string, v: number) => setValues(s => ({ ...s, [k]: v }));

  return (
    <div className="max-w-3xl">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">{config.name}</h1>
        <p className="text-sm text-gray-500">
          {config.rarity}★ · {config.element} · {config.weapon} · scales off {config.scalingSource.toUpperCase()} ·
          ascension stat: {config.ascensionStat.label} (max {config.ascensionStat.maxValue}%)
        </p>
      </header>

      {GROUPS.map(group => {
        const fields = config.stats.filter(f => f.group === group.key);
        if (fields.length === 0) return null;
        return (
          <section key={group.key} className="mb-4">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">{group.label}</h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {fields.map(f => (
                <label key={f.key} className="flex items-center justify-between gap-3 rounded border p-2">
                  <span className="text-sm">{f.label}</span>
                  {f.hasBaseAndFlat ? (
                    <span className="flex items-center gap-1">
                      <input className="w-20 border px-1" type="number" placeholder="Base"
                        onChange={e => set(`${f.key}.base`, +e.target.value)} />
                      <span className="text-gray-400">+</span>
                      <input className="w-20 border px-1" type="number" placeholder="Flat"
                        onChange={e => set(`${f.key}.flat`, +e.target.value)} />
                      <span className="w-16 text-right text-sm tabular-nums text-gray-600">
                        = {(values[`${f.key}.base`] || 0) + (values[`${f.key}.flat`] || 0)}
                      </span>
                    </span>
                  ) : (
                    <input className="w-24 border px-1" type="number"
                      onChange={e => set(f.key, +e.target.value)} />
                  )}
                </label>
              ))}
            </div>
          </section>
        );
      })}

      {config.talents.map(g => (
        <section key={g.name} className="mt-4">
          <h2 className="font-medium">{g.name}</h2>
          <ul className="mt-1 grid grid-cols-2 gap-1 text-sm text-gray-600">
            {g.hits.map(h => <li key={h} className="rounded bg-gray-50 px-2 py-1">{h} (%)</li>)}
          </ul>
        </section>
      ))}

      {config.mechanics?.length ? (
        <section className="mt-4">
          <h2 className="font-medium">Special mechanics</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {config.mechanics.map(m => <li key={m}>{m}</li>)}
          </ul>
        </section>
      ) : null}

      {config.panels?.length ? (
        <section className="mt-4">
          <h2 className="font-medium">Panels</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {config.panels.map(p => <li key={p}>{p}</li>)}
          </ul>
        </section>
      ) : null}

      {config.notes?.length ? (
        <section className="mt-4">
          <h2 className="font-medium">Notes</h2>
          <ul className="list-disc pl-5 text-sm text-gray-500">
            {config.notes.map(n => <li key={n}>{n}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
