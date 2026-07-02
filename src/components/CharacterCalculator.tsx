"use client";
import { useState } from "react";
import type { CharacterConfig, ReactionType, StatField, ConstellationEffect, MechanicDef } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { computeHit, availableReactions, scalingTotal, type HitResult, type DamageStats } from "@/lib/engine/damage";
import { validate, resolveStats, resolveHitMultipliers, effectiveTalentLevels, hitId, toNum, type RawInputs } from "@/lib/engine/validation";
import { resolveMechanics, type PerHitMods } from "@/lib/engine/mechanics";
import { transformativeDamage, TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL, type TransformativeType } from "@/lib/engine/transformative";
import { indirectLunarDamage, LUNAR_BY_ELEMENT, LUNAR_LABEL, type LunarType, type LunarResult } from "@/lib/engine/lunar";

// Excel-style stat panel wired to the pure damage engine.
// Fill every field, pick a talent level (where data exists) or type a multiplier,
// choose a reaction — every hit's Non-Crit / CRIT / Average damage recomputes live
// on each change (no Calculate button).
const GROUPS: { key: StatField["group"]; label: string }[] = [
  { key: "base", label: "Base Stats" },
  { key: "combat", label: "Combat Stats" },
  { key: "advanced", label: "Advanced Stats" },
  { key: "defense", label: "Target Stats" },
];

const REACTION_LABEL: Record<ReactionType, string> = {
  none: "None",
  vaporize: "Vaporize",
  melt: "Melt",
  aggravate: "Aggravate",
};

// Fixed locale: results now render during SSR too, and the server's locale can
// differ from the browser's (e.g. "2.047" vs "2,047" → hydration mismatch).
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const selectCls = "border px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";

interface ReactionExtras {
  transformative: { type: TransformativeType; dmg: number }[];
  lunar: { type: LunarType; res: LunarResult }[];
  notes: string[]; // computed mechanic lines (Paramita ATK, Masque flat DMG, heals, …)
}

interface CalcInstance {
  id: string;
  stats: Record<string, string>;
  hits: Record<string, string>;
  levels: Record<string, string>;
  mechanicInputs: Record<string, string>; // MechanicDef.id -> raw value ("1"/"0" for toggles)
  reaction: ReactionType;
  reactionBonus: string;
  reactionPanelBonus: string; // Reaction Bonus % applied to the transformative/lunar panel
  lunarBaseBonus: string;     // Lunar Reaction Base DMG Bonus % (Moonsign passives)
  constellationLevel: number;
}

// Results derived from an instance's inputs on every render (no stored results).
interface ComputedInstance {
  validation: ReturnType<typeof validate>;
  results: Record<string, HitResult> | null; // null while inputs are invalid
  extras: ReactionExtras | null;
}

// Collect all active constellation effects up to the given level.
function activeEffects(config: CharacterConfig, level: number): ConstellationEffect[] {
  if (!config.constellations) return [];
  return config.constellations
    .filter(c => c.level <= level)
    .flatMap(c => c.effects);
}

// Compute flat DMG bonus for a specific hit key from constellation effects.
function constellationFlatBonus(
  effects: ConstellationEffect[],
  hitKey: string,
  stats: DamageStats,
): number {
  let bonus = 0;
  for (const e of effects) {
    if (e.type === "flat_dmg_bonus" && e.affectedHitKeys?.includes(hitKey)) {
      const base = e.bonusScaling ? scalingTotal(stats, e.bonusScaling) : 0;
      bonus += base * (e.bonusPercent ?? 0) / 100;
    }
  }
  return bonus;
}

// Compute stat bonuses from constellation effects.
function constellationStatBonuses(effects: ConstellationEffect[]): Record<string, number> {
  const bonuses: Record<string, number> = {};
  for (const e of effects) {
    if (e.type === "stat_bonus" && e.statKey) {
      bonuses[e.statKey] = (bonuses[e.statKey] ?? 0) + (e.statValue ?? 0);
    }
  }
  return bonuses;
}

const initialStats = {
  "hp.base": "0",
  "hp.percent": "0",
  "hp.flat": "15000",
  "atk.base": "0",
  "atk.percent": "0",
  "atk.flat": "1500",
  "def.base": "0",
  "def.percent": "0",
  "def.flat": "800",
  "critRate": "70",
  "critDmg": "140",
  "dmgBonus": "46.6",
  "em": "0",
  "energyRecharge": "100",
  "healingBonus": "0",
  "dmgReduction": "0",
  "enemyRes": "10",
  "levelChar": "90",
  "levelEnemy": "100",
  "defReduction": "0",
  "defIgnore": "0",
};

export function CharacterCalculator({ config, scaling }: { config: CharacterConfig; scaling: TalentScalingData }) {
  const createInitialInstance = (id: string): CalcInstance => {
    const initLevels: Record<string, string> = {};
    for (const g of config.talents) {
      const s = scaling[g.type];
      if (s && s.levels.length) initLevels[g.type] = String(s.levels[s.levels.length - 1]);
    }
    const initMechanics: Record<string, string> = {};
    for (const m of config.mechanicDefs ?? []) {
      initMechanics[m.id] = String(m.defaultValue ?? 0);
    }
    return {
      id,
      stats: { ...initialStats },
      hits: {},
      levels: initLevels,
      mechanicInputs: initMechanics,
      reaction: "none",
      reactionBonus: "",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };
  };

  const [instances, setInstances] = useState<CalcInstance[]>(() => [
    createInitialInstance("1")
  ]);
  const [benchmarkId, setBenchmarkId] = useState<string | null>(null);
  const [nextId, setNextId] = useState(2);
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  const addInstance = () => {
    if (instances.length >= 3) return;
    const last = instances[instances.length - 1];
    const newInst: CalcInstance = {
      id: String(nextId),
      stats: { ...last.stats },
      hits: { ...last.hits },
      levels: { ...last.levels },
      mechanicInputs: { ...last.mechanicInputs },
      reaction: last.reaction,
      reactionBonus: last.reactionBonus,
      reactionPanelBonus: last.reactionPanelBonus,
      lunarBaseBonus: last.lunarBaseBonus,
      constellationLevel: last.constellationLevel,
    };
    setInstances(s => [...s, newInst]);
    setNextId(n => n + 1);
  };

  const removeInstance = (id: string) => {
    if (instances.length <= 1) return;
    setInstances(s => s.filter(inst => inst.id !== id));
    if (benchmarkId === id) {
      setBenchmarkId(null);
    }
  };

  const updateInstance = (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => {
    setInstances(prev =>
      prev.map(inst => {
        if (inst.id !== id) return inst;
        return {
          ...inst,
          ...updater(inst),
        };
      })
    );
  };

  const setMechanic = (instId: string, mechId: string, v: string) => {
    updateInstance(instId, inst => ({
      mechanicInputs: { ...inst.mechanicInputs, [mechId]: v },
    }));
  };

  const setStat = (instId: string, statId: string, v: string) => {
    updateInstance(instId, inst => ({
      stats: { ...inst.stats, [statId]: v },
    }));
  };

  const setHit = (instId: string, hitId: string, v: string) => {
    updateInstance(instId, inst => ({
      hits: { ...inst.hits, [hitId]: v },
    }));
  };

  const setLevel = (instId: string, type: string, v: string) => {
    updateInstance(instId, inst => ({
      levels: { ...inst.levels, [type]: v },
    }));
  };

  const setReaction = (instId: string, r: ReactionType) => {
    updateInstance(instId, () => ({
      reaction: r,
    }));
  };

  const setReactionBonus = (instId: string, v: string) => {
    updateInstance(instId, () => ({
      reactionBonus: v,
    }));
  };

  const activeBenchmarkId = benchmarkId || instances[0]?.id;

  const renderPct = (currentVal: number, benchmarkVal: number | undefined) => {
    if (instances.length < 2) return null;
    if (benchmarkVal === undefined || benchmarkVal === 0) return null;
    const pct = (currentVal / benchmarkVal) * 100;
    
    let colorClass = "text-gray-400 dark:text-zinc-500";
    if (pct < 99.95) {
      colorClass = "text-red-500 dark:text-red-400 font-semibold";
    } else if (pct > 100.05) {
      colorClass = "text-green-500 dark:text-green-400 font-semibold";
    }
    
    return (
      <span className={`text-[10px] leading-none ${colorClass}`}>
        {pct.toFixed(1)}%
      </span>
    );
  };

  // Derive all outputs from an instance's inputs — runs on every render, so results
  // update immediately on any change. Returns null results while inputs are invalid.
  function computeInstance(inst: CalcInstance): ComputedInstance {
    const raw: RawInputs = { stats: inst.stats, hits: inst.hits, reaction: inst.reaction, reactionBonus: inst.reactionBonus };
    const resolved = resolveHitMultipliers(config, scaling, inst.levels, inst.hits, inst.constellationLevel);
    const validation = validate(config, raw, resolved);
    if (!validation.ok) {
      return { validation, results: null, extras: null };
    }
    const s = resolveStats(raw);

    // Character mechanics (Masque/BoL, Paramita, Draconic stacks, Dark-Shattering, …)
    // computed from the pre-delta stats, then merged with constellation effects.
    const mechInputs: Record<string, number> = {};
    for (const m of config.mechanicDefs ?? []) {
      mechInputs[m.id] = toNum(inst.mechanicInputs[m.id]) ?? 0;
    }
    const mech = resolveMechanics(config, {
      stats: s,
      baseAtk: toNum(inst.stats["atk.base"]) ?? 0,
      constellationLevel: inst.constellationLevel,
      talentLevels: effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel),
      scaling,
      inputs: mechInputs,
    });

    // Apply stat deltas: mechanics first, then generic constellation stat bonuses.
    for (const [key, val] of Object.entries(mech.statDeltas)) {
      if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
    }
    const effects = activeEffects(config, inst.constellationLevel);
    const statBonuses = constellationStatBonuses(effects);
    for (const [key, val] of Object.entries(statBonuses)) {
      if (key in s) (s as unknown as Record<string, number>)[key] += val;
    }

    const healingBonus = toNum(inst.stats["healingBonus"]) ?? 0;
    const out: Record<string, HitResult> = {};
    config.talents.forEach((g, gi) =>
      g.hits.forEach((h, hi) => {
        const id = hitId(gi, hi);
        const mult = resolved[id] ?? 0;
        if (h.kind === "heal") {
          // Healing rows: mult% × stat × (1 + Healing Bonus). No crit.
          const heal = (mult / 100) * scalingTotal(s, h.scaling) * (1 + healingBonus / 100);
          out[id] = { nonCrit: heal, crit: heal, avg: heal };
          return;
        }
        const mods: PerHitMods = mech.perHit[h.key] ?? {};
        const flatBonus = constellationFlatBonus(effects, h.key, s) + (mods.flatDmgBonus ?? 0);
        out[id] = computeHit(s, {
          multiplier: mult,
          scaling: h.scaling,
          element: config.element,
          reaction: inst.reaction,
          reactionBonusPct: Number(inst.reactionBonus || 0),
          flatDmgBonus: flatBonus || undefined,
          baseDmgMultiplier: mods.baseDmgMultiplier,
          critDmgBonusPct: mods.critDmgBonusPct,
          critRateBonusPct: mods.critRateBonusPct,
          bonusDmgPct: mods.bonusDmgPct,
        });
      }),
    );

    // Standalone reaction outputs (transformative + indirect lunar) from final stats.
    const panelBonus = toNum(inst.reactionPanelBonus) ?? 0;
    const lunarBase = toNum(inst.lunarBaseBonus) ?? 0;
    const extras: ReactionExtras = {
      transformative: TRANSFORMATIVE_BY_ELEMENT[config.element].map(type => ({
        type,
        dmg: transformativeDamage(type, s.levelChar, s.em, s.enemyRes, panelBonus),
      })),
      lunar: LUNAR_BY_ELEMENT[config.element].map(type => ({
        type,
        res: indirectLunarDamage(type, s, lunarBase, panelBonus),
      })),
      notes: mech.notes,
    };

    return { validation, results: out, extras };
  }

  // Computed once per render for all setups (benchmark comparisons read from here too).
  const computedById = new Map(instances.map(i => [i.id, computeInstance(i)]));

  return (
    <div className="flex flex-col h-full w-full">
      <header className="mb-6 shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">{config.name}</h1>
          <p
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 cursor-pointer select-none transition-colors"
            title="Click to toggle special mechanics, panels, and notes"
          >
            <span>
              {config.rarity}★ · {config.element} · {config.weapon} · scales off {config.scalingSource.toUpperCase()} ·
              ascension stat: {config.ascensionStat.label} (max {config.ascensionStat.maxValue}%)
            </span>
            <span className={`inline-block transform transition-transform duration-200 text-gray-400 dark:text-zinc-500 font-mono text-xs ${showExtraInfo ? "rotate-180" : ""}`}>
              ▼
            </span>
          </p>
        </div>
        <button
          onClick={addInstance}
          disabled={instances.length >= 3}
          className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          + Add Setup ({instances.length}/3)
        </button>
      </header>

      {/* Special Mechanics, Panels, Notes at page level */}
      {showExtraInfo && (config.mechanics?.length || config.panels?.length || config.notes?.length) ? (
        <div className="mb-6 shrink-0 flex flex-wrap gap-8 border-b border-gray-200 dark:border-zinc-800 pb-4 text-xs">
          {config.mechanics?.length ? (
            <div>
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 text-[10px]">Special Mechanics</h3>
              <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-0.5">
                {config.mechanics.map(m => <li key={m}>{m}</li>)}
              </ul>
            </div>
          ) : null}
          {config.panels?.length ? (
            <div>
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 text-[10px]">Panels</h3>
              <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-0.5">
                {config.panels.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ) : null}
          {config.notes?.length ? (
            <div>
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 text-[10px]">Notes</h3>
              <ul className="list-disc pl-4 text-gray-500 dark:text-gray-400 space-y-0.5">
                {config.notes.map(n => <li key={n}>{n}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Wiki Talent Descriptions at page level */}
      {showExtraInfo && config.wikiTalents?.length ? (
        <div className="mb-6 shrink-0 border-b border-gray-200 dark:border-zinc-800 pb-6 text-xs max-w-4xl">
          <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 text-[10px]">Wiki Talent Descriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/40 dark:bg-zinc-950/20 border border-gray-150 dark:border-zinc-850 p-5 rounded-xl shadow-2xs">
            {config.wikiTalents.map(t => (
              <div key={t.name} className="space-y-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                  <span>{t.name}</span>
                  <span className="text-[9px] bg-zinc-200 dark:bg-zinc-300 text-black dark:text-zinc-950 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                    {t.type}
                  </span>
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 items-start">
          {instances.map((inst, index) => {
            const reactionOptions = availableReactions(config.element);
            const { validation, results, extras } = computedById.get(inst.id)!;
            const benchmarkResults = computedById.get(activeBenchmarkId)?.results;

            const err = (id: string) => validation.errors[id];
            const inputCls = (id: string, w: string) =>
              `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""}`;

            const baseBenchmarkInst = activeBenchmarkId === inst.id;

            return (
              <div
                key={inst.id}
                className={`w-[420px] shrink-0 border rounded-xl p-5 shadow-xs flex flex-col transition-all bg-white/50 dark:bg-zinc-900/30 ${
                  baseBenchmarkInst
                    ? "border-zinc-400 dark:border-zinc-500 ring-1 ring-zinc-400 dark:ring-zinc-500 bg-white/80 dark:bg-zinc-900/40"
                    : "border-gray-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Setup {index + 1}</span>
                    {baseBenchmarkInst && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                        Benchmark
                      </span>
                    )}
                  </div>
                  {instances.length > 1 && (
                    <button
                      onClick={() => removeInstance(inst.id)}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Constellation selector */}
                {config.constellations?.length ? (
                  <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Constellation</h2>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4, 5, 6].map(lvl => {
                        const active = inst.constellationLevel >= lvl;
                        const isInfo = lvl > 0 && config.constellations!.find(c => c.level === lvl)?.effects.every(e => e.type === "informational");
                        return (
                          <button
                            key={lvl}
                            onClick={() => updateInstance(inst.id, () => ({ constellationLevel: inst.constellationLevel === lvl ? lvl - 1 : lvl }))}
                            title={lvl === 0 ? "No constellation" : `C${lvl}: ${config.constellations!.find(c => c.level === lvl)?.name ?? ""}`}
                            className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer transition-all border ${
                              active
                                ? isInfo
                                  ? "bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 border-zinc-400 dark:border-zinc-500"
                                  : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                                : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                            }`}
                          >
                            C{lvl}
                          </button>
                        );
                      })}
                    </div>
                    {inst.constellationLevel > 0 && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 leading-snug">
                        {config.constellations!.filter(c => c.level <= inst.constellationLevel).map(c =>
                          <span key={c.level} className="block">
                            <span className="font-semibold">C{c.level}</span>: {c.name} — {c.description}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ) : null}

                {/* Character mechanics (registry-driven controls; math in engine/mechanics.ts) */}
                {config.mechanicDefs?.length ? (
                  <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Mechanics</h2>
                    <div className="space-y-2">
                      {config.mechanicDefs.map((m: MechanicDef) => {
                        const val = inst.mechanicInputs[m.id] ?? "0";
                        return (
                          <div key={m.id} className="flex items-center justify-between gap-3" title={m.hint}>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{m.label}</span>
                            {m.control === "toggle" ? (
                              <input type="checkbox" className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                                checked={Number(val) > 0}
                                onChange={e => setMechanic(inst.id, m.id, e.target.checked ? "1" : "0")} />
                            ) : m.control === "stacks" ? (
                              <div className="flex gap-1">
                                {Array.from({ length: (m.max ?? 3) + 1 }, (_, i) => (
                                  <button key={i}
                                    onClick={() => setMechanic(inst.id, m.id, String(i))}
                                    className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer transition-all border ${
                                      Number(val) === i
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                                        : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                                    }`}>
                                    {i}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <input className={inputCls(`mech.${m.id}`, "w-20")} type="number" min={0} max={m.max}
                                value={val} onChange={e => setMechanic(inst.id, m.id, e.target.value)} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {GROUPS.map(group => {
                  const fields = config.stats.filter(f => f.group === group.key);
                  if (fields.length === 0) return null;
                  return (
                    <section key={group.key} className="mb-4">
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{group.label}</h2>
                      <div className="grid grid-cols-1 gap-2">
                        {fields.map(f => {
                          const baseErr = err(`${f.key}.base`) || err(`${f.key}.flat`) || err(`${f.key}.percent`);
                          const singleErr = err(f.key);
                          return (
                            <label key={f.key} className="flex flex-col gap-1 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors">
                              <span className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</span>
                                {f.hasBaseAndFlat ? (
                                  <span className="flex items-center gap-1">
                                    <input className={inputCls(`${f.key}.base`, "w-16")} type="number" placeholder="Base"
                                      value={inst.stats[`${f.key}.base`] ?? ""}
                                      onChange={e => setStat(inst.id, `${f.key}.base`, e.target.value)} />
                                    <span className="text-gray-400 dark:text-gray-500">+</span>
                                    <div className="relative">
                                      <input className={inputCls(`${f.key}.percent`, "w-16 pr-4")} type="number" placeholder="%"
                                        value={inst.stats[`${f.key}.percent`] ?? ""}
                                        onChange={e => setStat(inst.id, `${f.key}.percent`, e.target.value)} />
                                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none">%</span>
                                    </div>
                                    <span className="text-gray-400 dark:text-gray-500">+</span>
                                    <input className={inputCls(`${f.key}.flat`, "w-16")} type="number" placeholder="Flat"
                                      value={inst.stats[`${f.key}.flat`] ?? ""}
                                      onChange={e => setStat(inst.id, `${f.key}.flat`, e.target.value)} />
                                  </span>
                                ) : (
                                  <input className={inputCls(f.key, "w-24")} type="number"
                                    value={inst.stats[f.key] ?? ""}
                                    onChange={e => setStat(inst.id, f.key, e.target.value)} />
                                )}
                              </span>
                              {f.hasBaseAndFlat ? (() => {
                                const base = Number(inst.stats[`${f.key}.base`]) || 0;
                                const pct = Number(inst.stats[`${f.key}.percent`]) || 0;
                                const flat = Number(inst.stats[`${f.key}.flat`]) || 0;
                                const increment = Math.round(base * (pct / 100));
                                const total = base + increment + flat;
                                return (
                                  <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800/50 p-1.5 rounded border border-gray-200 dark:border-zinc-700/50 mt-1 select-none flex justify-between">
                                    <span>{base} (Base) + {increment} ({pct}%) + {flat} (Flat)</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">= {total} (Total)</span>
                                  </div>
                                );
                              })() : null}
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
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Reaction</h2>
                  {reactionOptions.length > 1 ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <select className={selectCls} value={inst.reaction}
                        onChange={e => setReaction(inst.id, e.target.value as ReactionType)}>
                        {reactionOptions.map(r => (
                          <option key={r} value={r} className="bg-white dark:bg-zinc-800 text-black dark:text-white">
                            {REACTION_LABEL[r]}
                          </option>
                        ))}
                      </select>
                      {inst.reaction !== "none" ? (
                        <label className="flex items-center gap-2 text-sm">
                          Reaction Bonus %
                          <input className={inputCls("reactionBonus", "w-24")} type="number"
                            value={inst.reactionBonus}
                            onChange={e => setReactionBonus(inst.id, e.target.value)} />
                          {err("reactionBonus") ? <span className="text-xs text-red-600">{err("reactionBonus")}</span> : null}
                        </label>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No hit-attached reaction available for {config.element}.</p>
                  )}
                </section>

                {instances.length > 1 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setBenchmarkId(inst.id)}
                      disabled={baseBenchmarkInst}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-sm ${
                        baseBenchmarkInst
                          ? "bg-gray-100 text-gray-400 dark:bg-zinc-800/40 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-850"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      }`}
                    >
                      Compare This
                    </button>
                  </div>
                )}

                {!validation.ok && (
                  <span className="text-xs text-red-600 block mb-3">
                    {Object.keys(validation.errors).length} field(s) need attention.
                  </span>
                )}

                {extras?.notes.length ? (
                  <div className="mb-3 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5">
                    {extras.notes.map(n => (
                      <p key={n} className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">• {n}</p>
                    ))}
                  </div>
                ) : null}

                {validation.general.map(g => (
                  <p key={g} className="mb-2 text-xs text-amber-600">{g}</p>
                ))}

                {config.talents.map((g, gi) => {
                  const s = scaling[g.type];
                  const selLevel = s ? Number(inst.levels[g.type]) : NaN;
                  return (
                    <section key={g.name} className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-1">
                        <h3 className="font-semibold text-sm">{g.name}</h3>
                        {s && s.levels.length ? (
                          <label className="flex items-center gap-1.5 text-xs text-gray-500">
                            Lv.
                            <select className="border border-gray-250 dark:border-zinc-700 rounded px-1.5 py-0.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white" value={inst.levels[g.type] ?? ""}
                              onChange={e => setLevel(inst.id, g.type, e.target.value)}>
                              {s.levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </label>
                        ) : null}
                      </div>
                      <table className="mt-1 w-full text-xs">
                        <thead>
                          <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                            <th className="py-1.5 font-normal">Hit</th>
                            <th className="py-1.5 font-normal text-right">Mult %</th>
                            {results ? (
                              <>
                                <th className="py-1.5 pr-1 text-right font-normal">Non-Crit</th>
                                <th className="py-1.5 pr-1 text-right font-normal">CRIT</th>
                                <th className="py-1.5 text-right font-normal">Avg</th>
                              </>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody>
                          {g.hits.map((h, hi) => {
                            const id = hitId(gi, hi);
                            const res = results?.[id];
                            const levelVal = s && selLevel ? s.byLevel[selLevel]?.[h.key] : undefined;
                            const isHeal = h.kind === "heal";
                            return (
                              <tr key={id} className={`border-t border-gray-100 dark:border-zinc-800/60 ${isHeal ? "bg-emerald-50/40 dark:bg-emerald-950/10" : ""}`}>
                                <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">
                                  {h.name} <span className="text-[10px] text-gray-400 dark:text-gray-500">({isHeal ? "HEAL" : h.scaling.toUpperCase()})</span>
                                </td>
                                <td className="py-1.5 text-right font-mono text-gray-600 dark:text-gray-400">
                                  {levelVal != null ? (
                                    <span title={`Talent Lv. ${selLevel}`}>{levelVal}</span>
                                  ) : (
                                    <input className={inputCls(id, "w-16 text-right")} type="number" placeholder="%"
                                      value={inst.hits[id] ?? ""} onChange={e => setHit(inst.id, id, e.target.value)} />
                                  )}
                                </td>
                                {results ? (
                                  isHeal ? (
                                    <td colSpan={3} className="py-1.5 text-right tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">
                                      {res ? (
                                        <div className="flex flex-col items-end">
                                          <span>+{fmt(res.nonCrit)} HP</span>
                                          {renderPct(res.nonCrit, benchmarkResults?.[id]?.nonCrit)}
                                        </div>
                                      ) : "—"}
                                    </td>
                                  ) : (
                                  <>
                                    <td className="py-1.5 pr-1 text-right tabular-nums">
                                      {res ? (
                                        <div className="flex flex-col items-end">
                                          <span>{fmt(res.nonCrit)}</span>
                                          {renderPct(res.nonCrit, benchmarkResults?.[id]?.nonCrit)}
                                        </div>
                                      ) : "—"}
                                    </td>
                                    <td className="py-1.5 pr-1 text-right tabular-nums">
                                      {res ? (
                                        <div className="flex flex-col items-end">
                                          <span>{fmt(res.crit)}</span>
                                          {renderPct(res.crit, benchmarkResults?.[id]?.crit)}
                                        </div>
                                      ) : "—"}
                                    </td>
                                    <td className="py-1.5 text-right tabular-nums font-semibold">
                                      {res ? (
                                        <div className="flex flex-col items-end">
                                          <span>{fmt(res.avg)}</span>
                                          {renderPct(res.avg, benchmarkResults?.[id]?.avg)}
                                        </div>
                                      ) : "—"}
                                    </td>
                                  </>
                                  )
                                ) : null}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </section>
                  );
                })}

                {/* Standalone reaction outputs: transformative + indirect Lunar.
                    These don't scale with talents — only level, EM, and enemy RES. */}
                {(TRANSFORMATIVE_BY_ELEMENT[config.element].length || LUNAR_BY_ELEMENT[config.element].length) ? (
                  <section className="mt-5 border-t border-gray-200 dark:border-zinc-800 pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm">Reaction DMG ({config.element}-triggered)</h3>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <label className="flex items-center gap-1">
                          Bonus %
                          <input className={inputCls("reactionPanelBonus", "w-14")} type="number"
                            value={inst.reactionPanelBonus}
                            onChange={e => updateInstance(inst.id, () => ({ reactionPanelBonus: e.target.value }))} />
                        </label>
                        {LUNAR_BY_ELEMENT[config.element].length ? (
                          <label className="flex items-center gap-1" title="Lunar Reaction Base DMG Bonus (Moonsign Benediction passives)">
                            Lunar Base %
                            <input className={inputCls("lunarBaseBonus", "w-14")} type="number"
                              value={inst.lunarBaseBonus}
                              onChange={e => updateInstance(inst.id, () => ({ lunarBaseBonus: e.target.value }))} />
                          </label>
                        ) : null}
                      </div>
                    </div>
                    {extras ? (
                      <table className="mt-1 w-full text-xs">
                        <thead>
                          <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                            <th className="py-1.5 font-normal">Reaction</th>
                            <th className="py-1.5 pr-1 text-right font-normal">Non-Crit</th>
                            <th className="py-1.5 pr-1 text-right font-normal">CRIT</th>
                            <th className="py-1.5 text-right font-normal">Avg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extras.transformative.map(t => (
                            <tr key={t.type} className="border-t border-gray-100 dark:border-zinc-800/60">
                              <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">{TRANSFORMATIVE_LABEL[t.type]}</td>
                              <td className="py-1.5 pr-1 text-right tabular-nums" colSpan={3}>
                                <span className="font-semibold">{fmt(t.dmg)}</span>
                                <span className="ml-1 text-[10px] text-gray-400">(no crit)</span>
                              </td>
                            </tr>
                          ))}
                          {extras.lunar.map(l => (
                            <tr key={l.type} className="border-t border-gray-100 dark:border-zinc-800/60">
                              <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">{LUNAR_LABEL[l.type]}</td>
                              <td className="py-1.5 pr-1 text-right tabular-nums">{fmt(l.res.nonCrit)}</td>
                              <td className="py-1.5 pr-1 text-right tabular-nums">{fmt(l.res.crit)}</td>
                              <td className="py-1.5 text-right tabular-nums font-semibold">{fmt(l.res.avg)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="mt-1 text-[10px] text-gray-400">Fill the remaining fields to compute (scales with character level, EM, and enemy RES).</p>
                    )}
                  </section>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
