"use client";
import { useState } from "react";
import type { CharacterConfig, ReactionType, StatField } from "@/data/registry/types";
import { computeHit, availableReactions, type HitResult } from "@/lib/engine/damage";
import { validate, resolveStats, hitId, type RawInputs } from "@/lib/engine/validation";

// Excel-style stat panel wired to the pure damage engine.
// Fill every field, pick a reaction (where available), then Calculate to see
// each talent hit's Non-Crit / CRIT / Average damage.
const GROUPS: { key: StatField["group"]; label: string }[] = [
  { key: "base", label: "Base Stats" },
  { key: "combat", label: "Combat Stats" },
  { key: "advanced", label: "Advanced Stats" },
  { key: "defense", label: "Enemy & Defense" },
];

const REACTION_LABEL: Record<ReactionType, string> = {
  none: "None",
  vaporize: "Vaporize",
  melt: "Melt",
};

const fmt = (n: number) => Math.round(n).toLocaleString();

export function CharacterCalculator({ config }: { config: CharacterConfig }) {
  const [stats, setStats] = useState<Record<string, string>>({});
  const [hits, setHits] = useState<Record<string, string>>({});
  const [reaction, setReaction] = useState<ReactionType>("none");
  const [reactionBonus, setReactionBonus] = useState<string>("");
  const [results, setResults] = useState<Record<string, HitResult> | null>(null);
  const [attempted, setAttempted] = useState(false);

  const reactionOptions = availableReactions(config.element);
  const raw: RawInputs = { stats, hits, reaction, reactionBonus };
  const validation = validate(config, raw);

  // Editing anything invalidates the last calculation so stale numbers never linger.
  const setStat = (id: string, v: string) => { setStats(s => ({ ...s, [id]: v })); setResults(null); };
  const setHit = (id: string, v: string) => { setHits(s => ({ ...s, [id]: v })); setResults(null); };

  const err = (id: string) => (attempted ? validation.errors[id] : undefined);
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""}`;

  function onCalculate() {
    setAttempted(true);
    if (!validation.ok) { setResults(null); return; }
    const s = resolveStats(raw);
    const out: Record<string, HitResult> = {};
    config.talents.forEach((g, gi) =>
      g.hits.forEach((h, hi) => {
        const id = hitId(gi, hi);
        out[id] = computeHit(s, {
          multiplier: Number(hits[id]),
          scaling: h.scaling,
          element: config.element,
          reaction,
          reactionBonusPct: Number(reactionBonus || 0),
        });
      }),
    );
    setResults(out);
  }

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
              {fields.map(f => {
                const baseErr = err(`${f.key}.base`) || err(`${f.key}.flat`);
                const singleErr = err(f.key);
                return (
                  <label key={f.key} className="flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-2.5 shadow-xs transition-colors">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</span>
                      {f.hasBaseAndFlat ? (
                        <span className="flex items-center gap-1">
                          <input className={inputCls(`${f.key}.base`, "w-20")} type="number" placeholder="Base"
                            value={stats[`${f.key}.base`] ?? ""}
                            onChange={e => setStat(`${f.key}.base`, e.target.value)} />
                          <span className="text-gray-400 dark:text-gray-500">+</span>
                          <input className={inputCls(`${f.key}.flat`, "w-20")} type="number" placeholder="Flat"
                            value={stats[`${f.key}.flat`] ?? ""}
                            onChange={e => setStat(`${f.key}.flat`, e.target.value)} />
                          <span className="w-16 text-right text-sm tabular-nums text-gray-600 dark:text-gray-400 font-medium">
                            = {(Number(stats[`${f.key}.base`]) || 0) + (Number(stats[`${f.key}.flat`]) || 0)}
                          </span>
                        </span>
                      ) : (
                        <input className={inputCls(f.key, "w-24")} type="number"
                          value={stats[f.key] ?? ""}
                          onChange={e => setStat(f.key, e.target.value)} />
                      )}
                    </span>
                    {(f.hasBaseAndFlat ? baseErr : singleErr) ? (
                      <span className="text-xs text-red-600">{f.hasBaseAndFlat ? baseErr : singleErr}</span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="mb-4">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Reaction</h2>
        {reactionOptions.length > 1 ? (
          <div className="flex flex-wrap items-center gap-3">
            <select className="border px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" value={reaction}
              onChange={e => { setReaction(e.target.value as ReactionType); setResults(null); }}>
              {reactionOptions.map(r => (
                <option key={r} value={r} className="bg-white dark:bg-zinc-800 text-black dark:text-white">
                  {REACTION_LABEL[r]}
                </option>
              ))}
            </select>
            {reaction !== "none" ? (
              <label className="flex items-center gap-2 text-sm">
                Reaction Bonus %
                <input className={inputCls("reactionBonus", "w-24")} type="number"
                  value={reactionBonus}
                  onChange={e => { setReactionBonus(e.target.value); setResults(null); }} />
                {err("reactionBonus") ? <span className="text-xs text-red-600">{err("reactionBonus")}</span> : null}
              </label>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No amplifying reaction available for {config.element}.</p>
        )}
      </section>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onCalculate}
          className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm cursor-pointer">
          Calculate
        </button>
        {attempted && !validation.ok ? (
          <span className="text-sm text-red-600">
            {Object.keys(validation.errors).length} field(s) need attention before calculating.
          </span>
        ) : null}
        {results ? <span className="text-sm text-green-700">Calculated.</span> : null}
      </div>
      {validation.general.map(g => (
        <p key={g} className="mb-2 text-sm text-amber-600">{g}</p>
      ))}

      {config.talents.map((g, gi) => (
        <section key={g.name} className="mt-4">
          <h2 className="font-medium">{g.name}</h2>
          <table className="mt-1 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="py-1 font-normal">Hit</th>
                <th className="py-1 font-normal">Multiplier %</th>
                {results ? (
                  <>
                    <th className="py-1 pl-4 text-right font-normal">Non-Crit</th>
                    <th className="py-1 pl-4 text-right font-normal">CRIT</th>
                    <th className="py-1 pl-4 text-right font-normal">Average</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {g.hits.map((h, hi) => {
                const id = hitId(gi, hi);
                const res = results?.[id];
                return (
                  <tr key={id} className="border-t border-gray-200 dark:border-zinc-800">
                    <td className="py-1 pr-2 text-gray-700 dark:text-gray-300">
                      {h.name} <span className="text-xs text-gray-400 dark:text-gray-500">({h.scaling.toUpperCase()})</span>
                    </td>
                    <td className="py-1 pr-2">
                      <input className={inputCls(id, "w-24")} type="number" placeholder="%"
                        value={hits[id] ?? ""} onChange={e => setHit(id, e.target.value)} />
                      {err(id) ? <span className="ml-2 text-xs text-red-600">{err(id)}</span> : null}
                    </td>
                    {results ? (
                      <>
                        <td className="py-1 pl-4 text-right tabular-nums">{res ? fmt(res.nonCrit) : "—"}</td>
                        <td className="py-1 pl-4 text-right tabular-nums">{res ? fmt(res.crit) : "—"}</td>
                        <td className="py-1 pl-4 text-right tabular-nums font-medium">{res ? fmt(res.avg) : "—"}</td>
                      </>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
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
