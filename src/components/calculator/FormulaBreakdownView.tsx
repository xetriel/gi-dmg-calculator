"use client";
import React, { useState } from "react";
import Link from "next/link";
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "./types";
import { hydrateFromBuild, getInitialStats } from "./hooks/useCalculatorState";
import { explainHitFormulas, type FormulaBreakdown } from "@/lib/engine/formula-explainer";
import { DMG_COLORS } from "./utils/colors";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface FormulaBreakdownViewProps {
  config: CharacterConfig;
  scaling: TalentScalingData;
  initialBuild: { id: string | null; name: string | null; data: unknown } | null;
}

export const FormulaBreakdownView: React.FC<FormulaBreakdownViewProps> = ({
  config,
  scaling,
  initialBuild,
}) => {
  // Hydrate calculation instances from shared or default build
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
      if (hyd && hyd.instances.length > 0) {
        return hyd.instances;
      }
    }
    return [createInit("setup-1")];
  });

  const [activeInstId, setActiveInstId] = useState<string>(instances[0]?.id ?? "setup-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setHighlightedId(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, []);

  const activeInst = instances.find(i => i.id === activeInstId) ?? instances[0];
  const breakdowns = explainHitFormulas(config, scaling, activeInst);

  const categories = ["all", "normal", "charged", "plunge", "skill", "burst", "special", "transformative", "lunar"];

  const filteredBreakdowns = breakdowns.filter(b => {
    const matchesSearch =
      b.hitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mainFormula.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "all" || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyFormula = (b: FormulaBreakdown) => {
    const fullText = [b.mainFormula, ...b.subBreakdowns].join("\n");
    navigator.clipboard.writeText(fullText);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const elementColor = DMG_COLORS[config.element] ?? "#3b82f6";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md text-lg"
              style={{ backgroundColor: elementColor }}
            >
              {config.element.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  {config.name} Damage Formula Breakdown
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {config.weapon} • {config.element}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Exact mathematical sub-equations and parameter breakdown for all possible damage outputs
              </p>
            </div>
          </div>

          <Link
            href={`/characters/${config.id}`}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            ← Back to Calculator
          </Link>
        </div>

        {/* Setup Switcher Tabs (if multiple setups exist) */}
        {instances.length > 1 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
              Setups:
            </span>
            {instances.map((inst, index) => (
              <button
                key={inst.id}
                onClick={() => setActiveInstId(inst.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeInstId === inst.id
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                Setup #{index + 1} (C{inst.constellationLevel})
              </button>
            ))}
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors shrink-0 ${
                  activeCategory === cat
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-gray-200/60 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter by hit name or formula..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Main Breakdown Cards List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {filteredBreakdowns.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              No matching formula breakdowns found.
            </p>
          </div>
        ) : (
          filteredBreakdowns.map(b => (
            <div
              key={b.id}
              id={b.id}
              className={`bg-white dark:bg-zinc-900/90 rounded-xl border p-4 shadow-sm transition-all ${
                highlightedId === b.id
                  ? "border-amber-500 ring-2 ring-amber-500/50 shadow-md"
                  : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
              }`}
            >
              {/* Card Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-zinc-100">
                    {b.hitName}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {b.category}
                  </span>
                  <span
                    className="px-2 py-0.5 text-[10px] font-semibold rounded text-white"
                    style={{ backgroundColor: DMG_COLORS[b.element] ?? elementColor }}
                  >
                    {b.element}
                  </span>
                </div>

                {/* Calculated Damage Summary Badges */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-[10px]">Non-Crit:</span>
                    <span className="font-semibold text-gray-700 dark:text-zinc-300">
                      {fmt(b.nonCrit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 text-[10px] font-bold">CRIT:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {fmt(b.crit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 text-[10px] font-bold">Avg:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {fmt(b.avg)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyFormula(b)}
                    className="ml-2 px-2.5 py-1 text-[11px] font-sans font-medium rounded border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition-colors"
                  >
                    {copiedId === b.id ? "✓ Copied" : "Copy Text"}
                  </button>
                </div>
              </div>

              {/* Main Formula Highlight Box */}
              <div className="mb-3 p-3 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800 shadow-inner">
                {b.mainFormula}
              </div>

              {/* Sub-equations Breakdown Lines */}
              <div className="space-y-1 font-mono text-xs text-gray-700 dark:text-zinc-300 bg-gray-50/80 dark:bg-zinc-950/40 p-3 rounded-lg border border-gray-150 dark:border-zinc-800/80 overflow-x-auto">
                {b.subBreakdowns.map((sub, i) => (
                  <div key={i} className="py-0.5 leading-normal flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-600 select-none text-[10px] pt-0.5">
                      ↳
                    </span>
                    <span className={i === 0 ? "font-semibold text-amber-700 dark:text-amber-300" : ""}>
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
