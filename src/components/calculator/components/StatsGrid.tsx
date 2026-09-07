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
  // Accordion open/close states
  const [isReactionsOpen, setIsReactionsOpen] = useState(false);
  const [isTalentsOpen, setIsTalentsOpen] = useState(false);
  const [isElementalOpen, setIsElementalOpen] = useState(false);
  const [isEnemyResOpen, setIsEnemyResOpen] = useState(false);
  const [isMiscOpen, setIsMiscOpen] = useState(false);

  const err = (id: string) => validation.errors[id];
  
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${
      err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""
    }`;

  // Grouped stat fields
  const lunarFields = useMemo(() => config.stats.filter((f) => f.group === "lunar"), [config.stats]);
  const stellarFields = useMemo(() => config.stats.filter((f) => f.group === "stellar"), [config.stats]);
  const reactionFields = useMemo(() => config.stats.filter((f) => f.group === "reactions"), [config.stats]);
  const reactionCritFields = useMemo(() => config.stats.filter((f) => f.group === "reactionCrits"), [config.stats]);

  const talentIncreaseFields = useMemo(() => config.stats.filter((f) => f.group === "talentIncreases"), [config.stats]);
  const talentCritFields = useMemo(() => config.stats.filter((f) => f.group === "talentCrits"), [config.stats]);
  const talentDmgFields = useMemo(() => config.stats.filter((f) => f.group === "talentDmg"), [config.stats]);
  const talentLevelFields = useMemo(() => config.stats.filter((f) => f.group === "talentLevels"), [config.stats]);

  const elementalIncreaseFields = useMemo(() => config.stats.filter((f) => f.group === "elementalIncreases"), [config.stats]);
  const elementalCritFields = useMemo(() => config.stats.filter((f) => f.group === "elementalCrits"), [config.stats]);

  const enemyResFields = useMemo(() => config.stats.filter((f) => f.group === "enemyRes"), [config.stats]);

  const selfResFields = useMemo(() => config.stats.filter((f) => f.group === "selfRes"), [config.stats]);
  const staminaFields = useMemo(() => config.stats.filter((f) => f.group === "stamina"), [config.stats]);
  const miscFields = useMemo(() => config.stats.filter((f) => f.group === "misc"), [config.stats]);

  // Active customized counts for badges
  const activeReactionCount = useMemo(() => {
    let count = 0;
    if (inst.reactionPanelBonus && Number(inst.reactionPanelBonus) !== 0) count++;
    if (inst.lunarBaseBonus && Number(inst.lunarBaseBonus) !== 0) count++;
    if (inst.stellarBaseBonus && Number(inst.stellarBaseBonus) !== 0) count++;
    if (inst.stellarPanelBonus && Number(inst.stellarPanelBonus) !== 0) count++;
    for (const f of [...lunarFields, ...stellarFields, ...reactionFields, ...reactionCritFields]) {
      const val = inst.stats[f.key];
      if (val && Number(val) !== 0) count++;
    }
    return count;
  }, [inst, lunarFields, stellarFields, reactionFields, reactionCritFields]);

  const activeTalentsCount = useMemo(() => {
    let count = 0;
    for (const f of [...talentIncreaseFields, ...talentCritFields, ...talentDmgFields, ...talentLevelFields]) {
      const val = inst.stats[f.key];
      if (val && Number(val) !== 0) count++;
    }
    return count;
  }, [inst, talentIncreaseFields, talentCritFields, talentDmgFields, talentLevelFields]);

  const activeElementalCount = useMemo(() => {
    let count = 0;
    for (const f of [...elementalIncreaseFields, ...elementalCritFields]) {
      const val = inst.stats[f.key];
      if (val && Number(val) !== 0) count++;
    }
    return count;
  }, [inst, elementalIncreaseFields, elementalCritFields]);

  const activeEnemyResCount = useMemo(() => {
    let count = 0;
    for (const f of enemyResFields) {
      const val = inst.stats[f.key];
      if (val && Number(val) !== 0) count++;
    }
    return count;
  }, [inst, enemyResFields]);

  const activeMiscCount = useMemo(() => {
    let count = 0;
    for (const f of [...selfResFields, ...staminaFields, ...miscFields]) {
      const val = inst.stats[f.key];
      if (val && Number(val) !== 0) count++;
    }
    return count;
  }, [inst, selfResFields, staminaFields, miscFields]);

  const renderField = (f: StatField) => {
    const baseErr =
      err(`${f.key}.base`) ||
      err(`${f.key}.flat`) ||
      err(`${f.key}.percent`);
    const singleErr = err(f.key);
    const isPercent = f.unit === "percent";

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
          ) : isPercent ? (
            <div className="relative">
              <input
                className={inputCls(f.key, "w-24 sm:w-28 pr-5 text-right font-mono")}
                type="number"
                placeholder="0"
                value={inst.stats[f.key] ?? ""}
                onChange={(e) =>
                  setStat(inst.id, f.key, e.target.value)
                }
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none select-none">
                %
              </span>
            </div>
          ) : (
            <input
              className={inputCls(f.key, "w-24 sm:w-28 text-right font-mono")}
              type="number"
              placeholder="0"
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

  const renderSectionHeader = (
    title: string,
    isOpen: boolean,
    toggle: () => void,
    activeCount: number,
    resetFn?: () => void
  ) => (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {title}
        </h2>
        {activeCount > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
            {activeCount} customized
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {activeCount > 0 && resetFn && (
          <button
            type="button"
            onClick={resetFn}
            className="text-[10px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors"
            title="Reset customized values in this section"
          >
            Reset
          </button>
        )}
        <button
          type="button"
          onClick={toggle}
          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none font-medium ${
            isOpen
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-2xs"
              : "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 shadow-2xs"
          }`}
          title={`Toggle ${title}`}
        >
          <span>{isOpen ? "Shrink Inputs" : "Expand Inputs"}</span>
          <span className="text-[9px]">{isOpen ? "▲" : "▼"}</span>
        </button>
      </div>
    </div>
  );

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
                {fields.map((f) => renderField(f))}
              </div>
            </section>

            {/* Expandable Sections after Advanced Stats */}
            {group.key === "advanced" && (
              <>
                {/* 1. Reaction Multipliers & Reaction Stats */}
                <section key="section-reactions" className="mb-4">
                  {renderSectionHeader(
                    "Reaction Multipliers & Reaction Stats",
                    isReactionsOpen,
                    () => setIsReactionsOpen((prev) => !prev),
                    activeReactionCount,
                    () => {
                      if (updateInstance) {
                        updateInstance(inst.id, () => ({
                          reactionPanelBonus: "0",
                          lunarBaseBonus: "0",
                          stellarBaseBonus: "0",
                          stellarPanelBonus: "0",
                        }));
                      }
                      for (const f of [...lunarFields, ...stellarFields, ...reactionFields, ...reactionCritFields]) {
                        setStat(inst.id, f.key, "");
                      }
                    }
                  )}

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

                        <div className="grid grid-cols-1 gap-2">
                          {/* Transformative Reaction Bonus % */}
                          <label
                            className="flex flex-col gap-1 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors"
                            title="Transformative panel bonus (Overloaded, Swirl, Bloom, Electro-Charged, etc.)"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Transformative Reaction Bonus
                              </span>
                              <div className="relative">
                                <input
                                  className={inputCls("reactionPanelBonus", "w-24 sm:w-28 pr-5 text-right font-mono")}
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
                            </span>
                          </label>

                          {/* Lunar Base % */}
                          <label
                            className="flex flex-col gap-1 rounded-lg border border-cyan-200/70 dark:border-cyan-800/50 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors"
                            title="Moonsign Benediction base DMG bonus for Lunar reactions & direct hits"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
                                Lunar Base DMG Bonus
                              </span>
                              <div className="relative">
                                <input
                                  className={inputCls("lunarBaseBonus", "w-24 sm:w-28 pr-5 text-right font-mono")}
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
                            </span>
                          </label>

                          {/* Stellar Base % */}
                          <label
                            className="flex flex-col gap-1 rounded-lg border border-purple-200/70 dark:border-purple-800/50 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors"
                            title="Stellar Glimmer base DMG bonus (e.g. Sandrone Light of Rationalisme)"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                                Stellar Base DMG Bonus
                              </span>
                              <div className="relative">
                                <input
                                  className={inputCls("stellarBaseBonus", "w-24 sm:w-28 pr-5 text-right font-mono")}
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
                            </span>
                          </label>

                          {/* Stellar Reaction % */}
                          <label
                            className="flex flex-col gap-1 rounded-lg border border-indigo-200/70 dark:border-indigo-800/50 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors"
                            title="Stellar Glimmer reaction DMG bonus (e.g. Sandrone C1 +30% Stellar Reaction DMG)"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                                Stellar Reaction DMG Bonus
                              </span>
                              <div className="relative">
                                <input
                                  className={inputCls("stellarPanelBonus", "w-24 sm:w-28 pr-5 text-right font-mono")}
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
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Reaction DMG Bonuses & Multipliers */}
                      {reactionFields.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                            Reaction DMG Bonuses & Multipliers
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {reactionFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Reaction CRIT Bonuses */}
                      {reactionCritFields.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                            Reaction CRIT Bonuses
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {reactionCritFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Lunar Specific Stats */}
                      {lunarFields.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                            Lunar Reaction & Direct Stats
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {lunarFields.map((f) => renderField(f))}
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
                            {stellarFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* 2. Talent Specific Modifiers */}
                <section key="section-talents" className="mb-4">
                  {renderSectionHeader(
                    "Talent Specific Modifiers (Flat Increases, CRIT & Levels)",
                    isTalentsOpen,
                    () => setIsTalentsOpen((prev) => !prev),
                    activeTalentsCount,
                    () => {
                      for (const f of [...talentIncreaseFields, ...talentCritFields, ...talentDmgFields, ...talentLevelFields]) {
                        setStat(inst.id, f.key, "");
                      }
                    }
                  )}

                  {isTalentsOpen && (
                    <div className="space-y-3 p-3 rounded-xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-200/80 dark:border-zinc-800/90">
                      {/* Talent Flat Increases */}
                      {talentIncreaseFields.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Additive Flat Base DMG Increases (Yun Jin / Shenhe / Xianyun type)
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {talentIncreaseFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Talent CRIT Bonuses */}
                      {talentCritFields.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Talent Category CRIT Bonuses
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {talentCritFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Talent DMG Bonuses */}
                      {talentDmgFields.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Specialized Talent DMG Bonuses
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {talentDmgFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Talent Level Boosts */}
                      {talentLevelFields.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Talent Level Boosts (+1 / +3)
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {talentLevelFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* 3. Elemental Specific Modifiers */}
                <section key="section-elemental" className="mb-4">
                  {renderSectionHeader(
                    "Elemental Specific Modifiers (Flat Increases & CRIT)",
                    isElementalOpen,
                    () => setIsElementalOpen((prev) => !prev),
                    activeElementalCount,
                    () => {
                      for (const f of [...elementalIncreaseFields, ...elementalCritFields]) {
                        setStat(inst.id, f.key, "");
                      }
                    }
                  )}

                  {isElementalOpen && (
                    <div className="space-y-3 p-3 rounded-xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-200/80 dark:border-zinc-800/90">
                      {/* Elemental Flat Increases */}
                      {elementalIncreaseFields.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                            Elemental & Reaction Additive Flat DMG Increases
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {elementalIncreaseFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Elemental CRIT Bonuses */}
                      {elementalCritFields.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Elemental CRIT Rate & CRIT DMG (Sara / Gorou / Faruzan type)
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {elementalCritFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Expandable Sections after Target Stats */}
            {group.key === "defense" && (
              <>
                {/* 4. Target Enemy Resistances */}
                <section key="section-enemy-res" className="mb-4">
                  {renderSectionHeader(
                    "Target Enemy Resistances (Per-Element Breakdown)",
                    isEnemyResOpen,
                    () => setIsEnemyResOpen((prev) => !prev),
                    activeEnemyResCount,
                    () => {
                      for (const f of enemyResFields) {
                        setStat(inst.id, f.key, "");
                      }
                    }
                  )}

                  {isEnemyResOpen && (
                    <div className="space-y-2 p-3 rounded-xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-200/80 dark:border-zinc-800/90">
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 mb-1 leading-tight">
                        Individual element RES% overrides the baseline Enemy RES% (All Elements). Empty fields fall back to baseline.
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {enemyResFields.map((f) => renderField(f))}
                      </div>
                    </div>
                  )}
                </section>

                {/* 5. Self Resistances & Utility / Misc Stats */}
                <section key="section-misc" className="mb-4">
                  {renderSectionHeader(
                    "Self Resistances & Utility / Misc Stats",
                    isMiscOpen,
                    () => setIsMiscOpen((prev) => !prev),
                    activeMiscCount,
                    () => {
                      for (const f of [...selfResFields, ...staminaFields, ...miscFields]) {
                        setStat(inst.id, f.key, "");
                      }
                    }
                  )}

                  {isMiscOpen && (
                    <div className="space-y-3 p-3 rounded-xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-200/80 dark:border-zinc-800/90">
                      {/* Self Resistances */}
                      {selfResFields.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                            Incoming Damage Self Resistances
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {selfResFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Stamina Stats */}
                      {staminaFields.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                            Stamina & Consumption Decreases
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {staminaFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}

                      {/* Misc Stats */}
                      {miscFields.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-gray-200/70 dark:border-zinc-800">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Combat Utility, Shields & Speeds
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {miscFields.map((f) => renderField(f))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};


