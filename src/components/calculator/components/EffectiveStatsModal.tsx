"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "../types";
import type { DamageStats } from "@/lib/engine/damage";
import { resolveAllEffectiveStats, type EffectiveRowDef } from "@/lib/engine/effective-stats";
import { getRarityTheme } from "../rarity-theme";
import { ElementIcon } from "@/components/icons";

interface EffectiveStatsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  config: CharacterConfig;
  scaling: TalentScalingData;
  instances: CalcInstance[];
  activeInstanceId: string;
  setActiveInstanceId: (id: string) => void;
  computedById: Map<
    string,
    {
      inputStats: DamageStats | null;
      effectiveStats: DamageStats | null;
    }
  >;
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

export const EffectiveStatsModal: React.FC<EffectiveStatsModalProps> = ({
  isOpen,
  setIsOpen,
  config,
  scaling,
  instances,
  activeInstanceId,
  setActiveInstanceId,
  computedById,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const currentInst = instances.find((i) => i.id === activeInstanceId) || instances[0];
  if (!currentInst) return null;

  const computed = computedById.get(currentInst.id);
  const inputStats = computed?.inputStats;
  const effectiveStats = computed?.effectiveStats;

  const breakdowns = inputStats && effectiveStats
    ? resolveAllEffectiveStats(config, scaling, currentInst, inputStats, effectiveStats)
    : [];

  const externalBuffedCount = breakdowns.filter((b) => b.hasExternalBuffs).length;

  const filteredBreakdowns = breakdowns.filter((b) => {
    // Category filtering
    if (activeCategory === "externalOnly") {
      if (!b.hasExternalBuffs) return false;
    } else if (activeCategory !== "all") {
      if (b.category !== activeCategory) return false;
    }

    // Search query
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="max-w-5xl w-full h-[88vh] bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-lg">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Effective Stats & Buff Breakdown
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  <ElementIcon element={config.element} className="w-3.5 h-3.5" />
                  <span>{config.name}</span>
                </div>
                {externalBuffedCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    ⭐ {externalBuffedCount} Stat(s) Externally Buffed
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Complete audit of all calculated attributes, reaction elevations, and external support buff sources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Setup Switcher Tabs */}
            <div className="flex items-center gap-1 bg-gray-200/60 dark:bg-zinc-800/60 p-1 rounded-xl border border-gray-300/40 dark:border-zinc-700/40">
              {instances.map((inst, idx) => {
                const isSelected = inst.id === currentInst.id;
                return (
                  <button
                    key={inst.id}
                    onClick={() => setActiveInstanceId(inst.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs font-bold"
                        : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Setup {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Link to Dedicated Standalone Route */}
            <Link
              href={`/characters/${config.id}/effective-stats?setup=${currentInst.id}`}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:border-amber-400 font-semibold transition-all inline-flex items-center gap-1"
              title="Open full-screen independent page"
            >
              <span>↗</span>
              <span className="hidden sm:inline">Open Full Page</span>
            </Link>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Search stats, elevation, buff sources (e.g. Bennett, TTDS, Noblesse)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute left-2.5 top-2 text-xs text-gray-400">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Amber Legend Notice */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-400/30 shrink-0" />
              <span className="text-amber-800 dark:text-amber-300 text-[11px]">
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
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
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

        {/* Stat Cards Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40 dark:bg-zinc-950">
          {filteredBreakdowns.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-zinc-600">
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

              return (
                <div
                  key={b.key}
                  className={`rounded-xl border p-4 transition-all duration-150 ${
                    isExt
                      ? "border-amber-400/50 dark:border-amber-500/40 bg-white dark:bg-zinc-900 shadow-xs ring-1 ring-amber-400/20"
                      : "border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60"
                  }`}
                >
                  {/* Card Top: Stat Label, Badges & Total Value */}
                  <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isExt && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-400/30" />
                      )}
                      <h3
                        className={`text-sm font-bold ${
                          isExt
                            ? "text-amber-950 dark:text-amber-200"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {b.label}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {b.category ?? "attribute"}
                      </span>
                      {isExt && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          ⭐ External Support Buffed
                        </span>
                      )}
                    </div>

                    {/* Final Output Value */}
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-xs text-gray-400 dark:text-zinc-500 font-sans">Final Total:</span>
                      <span
                        className={`text-base font-extrabold ${
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
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-zinc-950/60 border border-gray-200/80 dark:border-zinc-800/80 text-xs font-mono tabular-nums flex-wrap justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400 font-sans text-[11px]">Formula:</span>
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
                      <span className="font-extrabold text-black dark:text-white">
                        {formatVal(b.total, b.unit)}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Sources Breakdown */}
                  {b.additions.length > 0 && (
                    <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* External Support Contributors */}
                      {externalSources.length > 0 && (
                        <div className="space-y-1 p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <span>👥</span>
                            <span>Outside External Support Buffs ({externalSources.length})</span>
                          </span>
                          <ul className="space-y-1 text-xs">
                            {externalSources.map((add, ai) => {
                              const theme = getRarityTheme(add.rarity ?? 5);
                              return (
                                <li
                                  key={ai}
                                  className="flex flex-col gap-0.5 p-1.5 rounded bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/40"
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1 flex-wrap">
                                      <span>✨ {add.source}</span>
                                      {add.rarity && (
                                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${theme.badge}`}>
                                          {add.rarity}★
                                        </span>
                                      )}
                                    </span>
                                    <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold shrink-0">
                                      {formatSignedAdd(add.value, b.unit)}
                                    </span>
                                  </div>
                                  {add.description && (
                                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 italic leading-snug">
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
                        <div className="space-y-1 p-2.5 rounded-lg bg-gray-50/80 dark:bg-zinc-900/40 border border-gray-200/60 dark:border-zinc-800/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                            <span>⚙️</span>
                            <span>Character Mechanics & Constellations ({internalSources.length})</span>
                          </span>
                          <ul className="space-y-1 text-xs">
                            {internalSources.map((add, ai) => (
                              <li
                                key={ai}
                                className="flex flex-col gap-0.5 p-1.5 rounded bg-white dark:bg-zinc-950 border border-gray-200/80 dark:border-zinc-800"
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
                                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 italic leading-snug">
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
