import React, { useState, useMemo } from "react";
import type { CharacterConfig, StatField } from "@/data/registry/types";
import type { CalcInstance } from "../types";
import type { validate } from "@/lib/engine/validation";

const STANDARD_GROUPS: { key: StatField["group"]; label: string }[] = [
  { key: "base", label: "Base Stats" },
  { key: "combat", label: "Combat Stats" },
  { key: "advanced", label: "Advanced Stats" },
  { key: "defense", label: "Target Stats" },
];

interface StatsGridProps {
  inst: CalcInstance;
  config: CharacterConfig;
  validation: ReturnType<typeof validate>;
  setStat: (instId: string, statId: string, v: string) => void;
  updateInstance?: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  inst,
  config,
  validation,
  setStat,
  updateInstance,
}) => {
  const [isReactionsOpen, setIsReactionsOpen] = useState(false);
  const err = (id: string) => validation.errors[id];
  
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${
      err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""
    }`;

  const lunarFields = useMemo(() => config.stats.filter((f) => f.group === "lunar"), [config.stats]);
  const stellarFields = useMemo(() => config.stats.filter((f) => f.group === "stellar"), [config.stats]);

  const activeReactionCustomCount = useMemo(() => {
    let count = 0;
    if (inst.reactionPanelBonus && Number(inst.reactionPanelBonus) !== 0) count++;
    if (inst.lunarBaseBonus && Number(inst.lunarBaseBonus) !== 0) count++;
    if (inst.stellarBaseBonus && Number(inst.stellarBaseBonus) !== 0) count++;
    if (inst.stellarPanelBonus && Number(inst.stellarPanelBonus) !== 0) count++;
    for (const f of [...lunarFields, ...stellarFields]) {
      const val = inst.stats[f.key];
      if (val && Number(val) !== 0) count++;
    }
    return count;
  }, [inst, lunarFields, stellarFields]);

  const renderField = (f: StatField) => {
    const baseErr =
      err(`${f.key}.base`) ||
      err(`${f.key}.flat`) ||
      err(`${f.key}.percent`);
    const singleErr = err(f.key);
    return (
      <label
        key={f.key}
        className="flex flex-col gap-1 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors"
      >
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {f.label}
          </span>
          {f.hasBaseAndFlat ? (
            <span className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
              <input
                className={inputCls(`${f.key}.base`, "w-20 sm:w-24 text-right font-mono")}
                type="number"
                placeholder="Base"
                value={inst.stats[`${f.key}.base`] ?? ""}
                onChange={(e) =>
                  setStat(inst.id, `${f.key}.base`, e.target.value)
                }
              />
              <span className="text-gray-400 dark:text-gray-500 font-bold">+</span>
              <div className="relative">
                <input
                  className={inputCls(`${f.key}.percent`, "w-20 sm:w-24 pr-5 text-right font-mono")}
                  type="number"
                  placeholder="%"
                  value={inst.stats[`${f.key}.percent`] ?? ""}
                  onChange={(e) =>
                    setStat(
                      inst.id,
                      `${f.key}.percent`,
                      e.target.value
                    )
                  }
                />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none select-none">
                  %
                </span>
              </div>
              <span className="text-gray-400 dark:text-gray-500 font-bold">+</span>
              <input
                className={inputCls(`${f.key}.flat`, "w-20 sm:w-24 text-right font-mono")}
                type="number"
                placeholder="Flat"
                value={inst.stats[`${f.key}.flat`] ?? ""}
                onChange={(e) =>
                  setStat(inst.id, `${f.key}.flat`, e.target.value)
                }
              />
            </span>
          ) : (
            <input
              className={inputCls(f.key, "w-28 sm:w-32 text-right font-mono")}
              type="number"
              value={inst.stats[f.key] ?? ""}
              onChange={(e) =>
                setStat(inst.id, f.key, e.target.value)
              }
            />
          )}
        </span>
        {f.hasBaseAndFlat ? (
          (() => {
            const base = Number(inst.stats[`${f.key}.base`]) || 0;
            const pct = Number(inst.stats[`${f.key}.percent`]) || 0;
            const flat = Number(inst.stats[`${f.key}.flat`]) || 0;
            const increment = Math.round(base * (pct / 100));
            const total = base + increment + flat;
            return (
              <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800/50 p-1.5 rounded border border-gray-200 dark:border-zinc-700/50 mt-1 select-none flex justify-between">
                <span>
                  {base} (Base) + {increment} ({pct}%) + {flat} (Flat)
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  = {total} (Total)
                </span>
              </div>
            );
          })()
        ) : null}
        {(f.hasBaseAndFlat ? baseErr : singleErr) ? (
          <span className="text-xs text-red-600">
            {f.hasBaseAndFlat ? baseErr : singleErr}
          </span>
        ) : null}
      </label>
    );
  };

  const renderExpandableReactionsSection = () => {
    return (
      <section key="reaction-modifiers" className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Reaction Multipliers & Lunar / Stellar Stats
            </h2>
            {activeReactionCustomCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                {activeReactionCustomCount} customized
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsReactionsOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none font-medium ${
              isReactionsOpen
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-2xs"
                : "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 shadow-2xs"
            }`}
            title="Toggle space-saving Reaction Multipliers and Lunar/Stellar advanced stats"
          >
            <span>{isReactionsOpen ? "Shrink Reaction Inputs" : "Expand Reaction Inputs"}</span>
            <span className="text-[9px]">{isReactionsOpen ? "▲" : "▼"}</span>
          </button>
        </div>

        {isReactionsOpen && (
          <div className="space-y-3.5 p-3 rounded-xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-200/80 dark:border-zinc-800/90">
            {/* Core Multipliers (4 cards) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-zinc-800 pb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-300">
                  Core Reaction Multipliers
                </span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                  Direct & transformative modifiers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Transformative Reaction Bonus % */}
                <label className="flex flex-col gap-1 rounded-lg border border-gray-200/80 dark:border-zinc-750 bg-white/90 dark:bg-zinc-800/80 p-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Reaction Bonus %
                    </span>
                    <div className="relative">
                      <input
                        className={inputCls("reactionPanelBonus", "w-20 text-right font-mono pr-5")}
                        type="number"
                        placeholder="0"
                        value={inst.reactionPanelBonus ?? ""}
                        onChange={(e) => {
                          if (updateInstance) {
                            updateInstance(inst.id, () => ({ reactionPanelBonus: e.target.value }));
                          }
                        }}
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none select-none">
                        %
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-400 leading-tight">
                    Transformative panel bonus (Overloaded, Swirl, Bloom, Electro-Charged, etc.)
                  </span>
                </label>

                {/* Lunar Base % */}
                <label className="flex flex-col gap-1 rounded-lg border border-cyan-200/70 dark:border-cyan-800/50 bg-white/90 dark:bg-zinc-800/80 p-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                      Lunar Base %
                    </span>
                    <div className="relative">
                      <input
                        className={inputCls("lunarBaseBonus", "w-20 text-right font-mono pr-5")}
                        type="number"
                        placeholder="0"
                        value={inst.lunarBaseBonus ?? ""}
                        onChange={(e) => {
                          if (updateInstance) {
                            updateInstance(inst.id, () => ({ lunarBaseBonus: e.target.value }));
                          }
                        }}
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70 text-xs font-medium pointer-events-none select-none">
                        %
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-400 leading-tight">
                    Moonsign Benediction base DMG bonus for Lunar reactions & direct hits
                  </span>
                </label>

                {/* Stellar Base % */}
                <label className="flex flex-col gap-1 rounded-lg border border-purple-200/70 dark:border-purple-800/50 bg-white/90 dark:bg-zinc-800/80 p-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                      Stellar Base %
                    </span>
                    <div className="relative">
                      <input
                        className={inputCls("stellarBaseBonus", "w-20 text-right font-mono pr-5")}
                        type="number"
                        placeholder="0"
                        value={inst.stellarBaseBonus ?? ""}
                        onChange={(e) => {
                          if (updateInstance) {
                            updateInstance(inst.id, () => ({ stellarBaseBonus: e.target.value }));
                          }
                        }}
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-purple-600/70 dark:text-purple-400/70 text-xs font-medium pointer-events-none select-none">
                        %
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-400 leading-tight">
                    Stellar Glimmer base DMG bonus (e.g. Sandrone Light of Rationalisme)
                  </span>
                </label>

                {/* Stellar Reaction % */}
                <label className="flex flex-col gap-1 rounded-lg border border-indigo-200/70 dark:border-indigo-800/50 bg-white/90 dark:bg-zinc-800/80 p-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                      Stellar Reaction %
                    </span>
                    <div className="relative">
                      <input
                        className={inputCls("stellarPanelBonus", "w-20 text-right font-mono pr-5")}
                        type="number"
                        placeholder="0"
                        value={inst.stellarPanelBonus ?? ""}
                        onChange={(e) => {
                          if (updateInstance) {
                            updateInstance(inst.id, () => ({ stellarPanelBonus: e.target.value }));
                          }
                        }}
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-600/70 dark:text-indigo-400/70 text-xs font-medium pointer-events-none select-none">
                        %
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-400 leading-tight">
                    Stellar Glimmer reaction DMG bonus (e.g. Sandrone C1 +30% Stellar Reaction DMG)
                  </span>
                </label>
              </div>
            </div>

            {/* Lunar Specific Stats */}
            {lunarFields.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                  Lunar Reaction & Direct Stats
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {lunarFields.map(renderField)}
                </div>
              </div>
            )}

            {/* Stellar Specific Stats */}
            {stellarFields.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                  Stellar Reaction & Direct Stats
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {stellarFields.map(renderField)}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      {STANDARD_GROUPS.map((group) => {
        const fields = config.stats.filter((f) => f.group === group.key);
        if (fields.length === 0) return null;
        return (
          <React.Fragment key={group.key}>
            <section className="mb-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {fields.map(renderField)}
              </div>
            </section>
            {/* Insert Expandable Reaction section right after Advanced Stats */}
            {group.key === "advanced" && renderExpandableReactionsSection()}
          </React.Fragment>
        );
      })}
    </>
  );
};

