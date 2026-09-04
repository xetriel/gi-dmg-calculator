"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "./types";
import { hydrateFromBuild, getInitialStats } from "./hooks/useCalculatorState";
import { resolveAllEffectiveStats } from "@/lib/engine/effective-stats";
import { encodeBuild } from "@/lib/engine/share";
import { resolveStats, effectiveTalentLevels } from "@/lib/engine/validation";
import { resolveMechanics } from "@/lib/engine/mechanics";
import { activeEffects, constellationStatBonuses } from "@/lib/engine/constellations";
import { resolveTeamBuffs } from "@/lib/engine/team-buffs";
import { resolveExternalWeaponBuffs } from "@/lib/engine/weapon-buffs";
import { resolveExternalArtifactBuffs } from "@/lib/engine/artifact-buffs";
import { getRarityTheme } from "./rarity-theme";
import { ElementIcon } from "@/components/icons";

interface EffectiveStatsViewProps {
  config: CharacterConfig;
  scaling: TalentScalingData;
  initialBuild: { id: string | null; name: string | null; data: unknown } | null;
  initialSetupId?: string | null;
}

const CATEGORY_TABS: Array<{ id: string; label: string; icon: string }> = [
  { id: "all", label: "All Stats", icon: "📋" },
  { id: "externalOnly", label: "External Buffed Only", icon: "⭐" },
  { id: "attributes", label: "Core Attributes", icon: "⚔️" },
  { id: "categoryDmg", label: "Category DMG", icon: "💥" },
  { id: "elementalDmg", label: "Elemental DMG", icon: "🔥" },
  { id: "reactionElevation", label: "Reaction & Elevation", icon: "🌙" },
  { id: "debuffs", label: "Enemy Debuffs", icon: "🛡️" },
  { id: "multipliers", label: "Multipliers", icon: "⚡" },
];

export const EffectiveStatsView: React.FC<EffectiveStatsViewProps> = ({
  config,
  scaling,
  initialBuild,
  initialSetupId,
}) => {
  const router = useRouter();

  const [instances] = useState<CalcInstance[]>(() => {
    const createInit = (id: string): CalcInstance => ({
      id,
      stats: getInitialStats(config),
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: {},
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    });

    if (initialBuild?.data) {
      const hyd = hydrateFromBuild(initialBuild.data, createInit);
      if (hyd && hyd.instances.length > 0) return hyd.instances;
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`gi_calc_working_draft_${config.id}`);
        if (stored) {
          const draft = JSON.parse(stored);
          if (Array.isArray(draft.instances) && draft.instances.length > 0) {
            return draft.instances;
          }
        }
      } catch (e) {
        console.error("Failed to load working draft in EffectiveStatsView:", e);
      }
    }

    return [createInit("setup-1")];
  });

  const [activeInstId, setActiveInstId] = useState<string>(() => {
    if (initialSetupId && instances.some((i) => i.id === initialSetupId)) {
      return initialSetupId;
    }
    return instances[0]?.id ?? "setup-1";
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setup = params.get("setup");
    if (setup && instances.some((i) => i.id === setup)) {
      setActiveInstId(setup);
    }
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveCategory("all");
      setHighlightedId(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, [instances]);

  const sharePayload = { instances, rotations: [], activeRotationId: "" };
  const encodedShare = encodeBuild(sharePayload);
  const backHref = `/characters/${config.id}?${encodedShare ? `share=${encodedShare}&` : ""}setup=${activeInstId}`;

  const handleBackToCalculator = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  const currentInst = instances.find((i) => i.id === activeInstId) || instances[0];

  // Compute input & effective stats for the active instance
  const computedStats = useMemo(() => {
    if (!currentInst) return null;
    const raw = {
      stats: currentInst.stats,
      hits: currentInst.hits,
      reaction: currentInst.reaction,
      reactionBonus: currentInst.reactionBonus,
      mechanicInputs: currentInst.mechanicInputs,
    };
    const inputStats = resolveStats(raw);
    const s = { ...inputStats };

    const toNum = (v: string | number | undefined) => (v != null && v !== "" ? Number(v) : undefined);

    const mechInputs: Record<string, number> = {};
    for (const m of config.mechanicDefs ?? []) {
      mechInputs[m.id] = toNum(currentInst.mechanicInputs[m.id]) ?? 0;
    }

    const mech = resolveMechanics(config, {
      stats: inputStats,
      baseAtk: toNum(currentInst.stats["atk.base"]) ?? 0,
      baseDef: toNum(currentInst.stats["def.base"]) ?? 0,
      baseHp: toNum(currentInst.stats["hp.base"]) ?? 0,
      constellationLevel: currentInst.constellationLevel,
      talentLevels: effectiveTalentLevels(config, scaling, currentInst.levels, currentInst.constellationLevel, currentInst.mechanicInputs),
      scaling,
      inputs: mechInputs,
    });

    for (const [key, val] of Object.entries(mech.statDeltas)) {
      if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
    }

    const effects = activeEffects(config, currentInst.constellationLevel);
    const statBonuses = constellationStatBonuses(effects);
    for (const [key, val] of Object.entries(statBonuses)) {
      if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
    }

    if (currentInst.teamBuffsEnabled !== false && currentInst.teamSupports?.length) {
      const teamRes = resolveTeamBuffs(currentInst.teamSupports, true);
      for (const [key, val] of Object.entries(teamRes.statDeltas)) {
        if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
      }
    }

    if (currentInst.externalWeaponBuffsEnabled !== false && currentInst.externalWeapons?.length) {
      const weaponRes = resolveExternalWeaponBuffs(currentInst.externalWeapons, toNum(currentInst.stats["atk.base"]) ?? 0, config, true);
      for (const [key, val] of Object.entries(weaponRes.statDeltas)) {
        if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
      }
    }

    if (currentInst.externalArtifacts?.length && currentInst.externalArtifactBuffsEnabled !== false) {
      const artifactRes = resolveExternalArtifactBuffs(
        currentInst.externalArtifacts,
        toNum(currentInst.stats["atk.base"]) ?? 0,
        config,
        true,
        toNum(currentInst.stats["def.base"]) ?? 0,
        toNum(currentInst.stats["hp.base"]) ?? 0,
      );
      for (const [key, val] of Object.entries(artifactRes.statDeltas)) {
        if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
      }
    }

    return { inputStats, effectiveStats: s };
  }, [currentInst, config, scaling]);

  const breakdowns = useMemo(() => {
    if (!computedStats || !currentInst) return [];
    return resolveAllEffectiveStats(
      config,
      scaling,
      currentInst,
      computedStats.inputStats,
      computedStats.effectiveStats
    );
  }, [config, scaling, currentInst, computedStats]);

  const externalBuffedCount = breakdowns.filter((b) => b.hasExternalBuffs).length;

  const filteredBreakdowns = breakdowns.filter((b) => {
    if (activeCategory === "externalOnly") {
      if (!b.hasExternalBuffs) return false;
    } else if (activeCategory !== "all") {
      if (b.category !== activeCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchLabel = b.label.toLowerCase().includes(q);
      const matchKey = b.key.toLowerCase().includes(q);
      const matchSources = b.additions.some(
        (a) => a.source.toLowerCase().includes(q) || (a.description ?? "").toLowerCase().includes(q)
      );
      return matchLabel || matchKey || matchSources;
    }

    return true;
  });

  const formatVal = (v: number, unit: "flat" | "percent" | "multiplier") => {
    if (unit === "percent") return `${v.toFixed(1)}%`;
    if (unit === "multiplier") return `${v.toFixed(2)}x`;
    return Math.round(v).toLocaleString("en-US");
  };

  const formatSignedAdd = (v: number, unit: "flat" | "percent" | "multiplier") => {
    const prefix = v >= 0 ? "+" : "−";
    const absV = Math.abs(v);
    if (unit === "percent") return `${prefix}${absV.toFixed(1)}%`;
    if (unit === "multiplier") return `${prefix}${absV.toFixed(2)}x`;
    return `${prefix}${Math.round(absV).toLocaleString("en-US")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        {/* Navigation Breadcrumb & Back */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={handleBackToCalculator}
            className="text-xs text-gray-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <span>← Back to {config.name} Calculator</span>
          </button>

          {/* Setup Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-200/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-gray-300/40 dark:border-zinc-800">
            {instances.map((inst, idx) => {
              const isSelected = inst.id === activeInstId;
              return (
                <button
                  key={inst.id}
                  onClick={() => setActiveInstId(inst.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-xs font-bold"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Setup {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5 shadow-xs flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-2xl">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {config.name} Effective Stats & Buff Breakdown
                </h1>
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  <ElementIcon element={config.element} className="w-3.5 h-3.5" />
                  <span>{config.element}</span>
                </div>
                {externalBuffedCount > 0 && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    ⭐ {externalBuffedCount} Stat(s) Externally Buffed
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Full-screen transparency view for all calculated combat attributes, reaction bonuses, and external support sources
              </p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-lg">
              <input
                type="text"
                placeholder="Search stats, elevation, buff sources (e.g. Bennett, TTDS, Noblesse)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-gray-400">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Amber Legend Notice */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-400/30 shrink-0" />
              <span className="text-amber-800 dark:text-amber-300 text-xs">
                Amber text highlights stats augmented by external support buffs
              </span>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-wrap">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              const isStar = tab.id === "externalOnly";
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? isStar
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs"
                      : isStar
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:border-amber-500"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.id === "externalOnly" && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold ml-0.5">
                      {externalBuffedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="space-y-3">
          {filteredBreakdowns.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-600">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-semibold text-sm">No stats matching the filter or search</p>
              <p className="text-xs mt-1">Try clearing your search query or selecting "All Stats".</p>
            </div>
          ) : (
            filteredBreakdowns.map((b) => {
              const isExt = b.hasExternalBuffs;
              const externalSources = b.additions.filter(
                (a) => a.type === "external" || a.category === "team" || a.category === "weapon" || a.category === "artifact"
              );
              const internalSources = b.additions.filter((a) => a.type !== "external");

              const isHighlighted = highlightedId === `stat-${b.key}`;

              return (
                <div
                  key={b.key}
                  id={`stat-${b.key}`}
                  className={`rounded-2xl border p-5 transition-all duration-300 ${
                    isHighlighted
                      ? "border-amber-500 ring-4 ring-amber-500/40 shadow-xl bg-amber-50/10 dark:bg-amber-950/20"
                      : isExt
                      ? "border-amber-400/50 dark:border-amber-500/40 bg-white dark:bg-zinc-900 shadow-xs ring-1 ring-amber-400/20"
                      : "border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60"
                  }`}
                >
                  {/* Card Top: Stat Label, Badges & Total Value */}
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isExt && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/30" />
                      )}
                      <h3
                        className={`text-base font-bold ${
                          isExt
                            ? "text-amber-950 dark:text-amber-200"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {b.label}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {b.category ?? "attribute"}
                      </span>
                      {isExt && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          ⭐ External Support Buffed
                        </span>
                      )}
                    </div>

                    {/* Final Output Value */}
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xs text-gray-400 dark:text-zinc-500 font-sans">Final Total:</span>
                      <span
                        className={`text-lg font-extrabold ${
                          isExt
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {formatVal(b.total, b.unit)}
                      </span>
                    </div>
                  </div>

                  {/* Math Equation Bar */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200/80 dark:border-zinc-800/80 text-xs font-mono tabular-nums flex-wrap justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400 font-sans text-xs">Formula:</span>
                      <span className="text-gray-600 dark:text-zinc-400">
                        {formatVal(b.raw, b.unit)} (Raw)
                      </span>
                      {b.additions.length > 0 && (
                        <>
                          <span className="text-gray-400 font-sans">+</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {b.additions.map((add, ai) => {
                              const isAddExt =
                                add.type === "external" ||
                                add.category === "team" ||
                                add.category === "weapon" ||
                                add.category === "artifact";
                              return (
                                <span
                                  key={ai}
                                  className={`font-semibold ${
                                    isAddExt
                                      ? "text-amber-600 dark:text-amber-400 font-bold"
                                      : "text-sky-600 dark:text-sky-400"
                                  }`}
                                  title={`${add.source}: ${formatSignedAdd(add.value, b.unit)}`}
                                >
                                  {formatSignedAdd(add.value, b.unit)}
                                </span>
                              );
                            })}
                          </div>
                        </>
                      )}
                      <span className="text-gray-400 font-sans">=</span>
                      <span className="font-extrabold text-black dark:text-white text-sm">
                        {formatVal(b.total, b.unit)}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Sources Breakdown */}
                  {b.additions.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* External Support Contributors */}
                      {externalSources.length > 0 && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                            <span>👥</span>
                            <span>Outside External Support Buffs ({externalSources.length})</span>
                          </span>
                          <ul className="space-y-1.5 text-xs">
                            {externalSources.map((add, ai) => {
                              const theme = getRarityTheme(add.rarity ?? 5);
                              return (
                                <li
                                  key={ai}
                                  className="flex flex-col gap-0.5 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/40 shadow-2xs"
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 flex-wrap">
                                      <span>✨ {add.source}</span>
                                      {add.rarity && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${theme.badge}`}>
                                          {add.rarity}★
                                        </span>
                                      )}
                                    </span>
                                    <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold shrink-0">
                                      {formatSignedAdd(add.value, b.unit)}
                                    </span>
                                  </div>
                                  {add.description && (
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 italic leading-snug">
                                      {add.description}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Internal Character Contributors */}
                      {internalSources.length > 0 && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/80 dark:bg-zinc-900/40 border border-gray-200/60 dark:border-zinc-800/60">
                          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                            <span>⚙️</span>
                            <span>Character Mechanics & Constellations ({internalSources.length})</span>
                          </span>
                          <ul className="space-y-1.5 text-xs">
                            {internalSources.map((add, ai) => (
                              <li
                                key={ai}
                                className="flex flex-col gap-0.5 p-2 rounded-lg bg-white dark:bg-zinc-950 border border-gray-200/80 dark:border-zinc-800 shadow-2xs"
                              >
                                <div className="flex justify-between items-start gap-1">
                                  <span className="font-semibold text-gray-800 dark:text-zinc-200">
                                    • {add.source}
                                  </span>
                                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                                    {formatSignedAdd(add.value, b.unit)}
                                  </span>
                                </div>
                                {add.description && (
                                  <p className="text-xs text-gray-500 dark:text-zinc-400 italic leading-snug">
                                    {add.description}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
