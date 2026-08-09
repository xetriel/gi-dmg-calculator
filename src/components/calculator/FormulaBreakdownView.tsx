"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "./types";
import { encodeBuild } from "@/lib/engine/share";
import { hydrateFromBuild, getInitialStats } from "./hooks/useCalculatorState";
import { explainHitFormulas, type FormulaBreakdown } from "@/lib/engine/formula-explainer";
import { DMG_COLORS } from "./utils/colors";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface FormulaBreakdownViewProps {
  config: CharacterConfig;
  scaling: TalentScalingData;
  initialBuild: { id: string | null; name: string | null; data: unknown } | null;
  initialSetupId?: string | null;
}

export const FormulaBreakdownView: React.FC<FormulaBreakdownViewProps> = ({
  config,
  scaling,
  initialBuild,
  initialSetupId,
}) => {
  const router = useRouter();
  // Hydrate calculation instances from shared or default build, with fallback to working draft
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
        console.error("Failed to load working draft in FormulaBreakdownView:", e);
      }
    }

    return [createInit("setup-1")];
  });

  const [activeInstId, setActiveInstId] = useState<string>(() => {
    if (initialSetupId && instances.some(i => i.id === initialSetupId)) {
      return initialSetupId;
    }
    return instances[0]?.id ?? "setup-1";
  });
  const [dmgType, setDmgType] = useState<"crit" | "nonCrit" | "avg">((): "crit" | "nonCrit" | "avg" => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode") as "crit" | "nonCrit" | "avg" | null;
      if (modeParam && ["crit", "nonCrit", "avg"].includes(modeParam)) {
        return modeParam;
      }
      try {
        const stored = localStorage.getItem("gi_calc_dmg_type") as "crit" | "nonCrit" | "avg" | null;
        if (stored && ["crit", "nonCrit", "avg"].includes(stored)) {
          return stored;
        }
      } catch (e) {}
    }
    return "avg";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleSetDmgType = (type: "crit" | "nonCrit" | "avg") => {
    setDmgType(type);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gi_calc_dmg_type", type);
      } catch (e) {}
      const params = new URLSearchParams(window.location.search);
      params.set("mode", type);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setup = params.get("setup");
    if (setup && instances.some(i => i.id === setup)) {
      setActiveInstId(setup);
    }
    const modeParam = params.get("mode") as "crit" | "nonCrit" | "avg" | null;
    if (modeParam && ["crit", "nonCrit", "avg"].includes(modeParam)) {
      setDmgType(modeParam);
    }
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
  }, [instances]);

  const activeInst = instances.find(i => i.id === activeInstId) ?? instances[0];
  const breakdowns = explainHitFormulas(config, scaling, activeInst);

  const sharePayload = { instances, rotations: [], activeRotationId: "" };
  const encodedShare = encodeBuild(sharePayload);
  const backHref = `/characters/${config.id}?${encodedShare ? `share=${encodedShare}&` : ""}setup=${activeInstId}&mode=${dmgType}`;

  const handleBackToCalculator = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  const categories = ["all", "normal", "charged", "plunge", "skill", "burst", "special", "transformative", "lunar", "team-buffs"];

  const getFormulaForType = (b: FormulaBreakdown, type: "crit" | "nonCrit" | "avg"): string => {
    if (type === "nonCrit") return b.mainFormulaNonCrit ?? b.mainFormula;
    if (type === "avg") return b.mainFormulaAvg ?? b.mainFormula;
    return b.mainFormulaCrit ?? b.mainFormula;
  };

  const filteredBreakdowns = breakdowns.filter(b => {
    const activeFormula = getFormulaForType(b, dmgType);
    const matchesSearch =
      b.hitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activeFormula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subBreakdowns.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeCategory === "all" || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyFormula = (b: FormulaBreakdown) => {
    const mainLine = getFormulaForType(b, dmgType);
    const fullText = [mainLine, ...b.subBreakdowns].join("\n");
    navigator.clipboard.writeText(fullText);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const elementColor = DMG_COLORS[config.element] ?? "#3b82f6";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-4 md:p-8 font-sans">
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToCalculator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
          >
            ← Back to Calculator
          </button>
          <h1 className="text-xl font-bold tracking-tight">
            Formula Breakdown & Mechanics: {config.name}
          </h1>
        </div>
        <div className="text-xs text-gray-500 dark:text-zinc-400">
          Showing exact equations & stat scaling
        </div>
      </div>

      {/* Setup selector tabs if multiple instances */}
      <div className="max-w-6xl mx-auto mb-6">
        {instances.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-zinc-800">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 shrink-0">Setup:</span>
            {instances.map((inst, index) => (
              <button
                key={inst.id}
                onClick={() => setActiveInstId(inst.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
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
                {cat === "team-buffs" ? "Team Buffs" : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Damage Mode Selector */}
            <div className="flex items-center gap-1 bg-gray-200/60 dark:bg-zinc-900 p-0.5 rounded-lg border border-gray-250 dark:border-zinc-800 shrink-0">
              <button
                onClick={() => handleSetDmgType("crit")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  dmgType === "crit"
                    ? "bg-amber-500 text-white shadow-xs font-bold"
                    : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                ⚡ CRIT
              </button>
              <button
                onClick={() => handleSetDmgType("nonCrit")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  dmgType === "nonCrit"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Non-Crit
              </button>
              <button
                onClick={() => handleSetDmgType("avg")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  dmgType === "avg"
                    ? "bg-emerald-600 text-white shadow-xs font-bold"
                    : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Average
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
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
          filteredBreakdowns.map(b => {
            const isTeamCard = b.category === "team-buffs";
            const activeFormula = getFormulaForType(b, dmgType);

            return (
              <div
                key={b.id}
                id={b.id}
                className={`bg-white dark:bg-zinc-900/90 rounded-xl border p-4 shadow-sm transition-all ${
                  isTeamCard
                    ? "border-amber-400/80 dark:border-amber-500/50 bg-amber-50/20 dark:bg-amber-950/10"
                    : highlightedId === b.id
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
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${
                      isTeamCard ? "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}>
                      {b.category}
                    </span>
                    {!isTeamCard && (
                      <span
                        className="px-2 py-0.5 text-[10px] font-semibold rounded text-white"
                        style={{ backgroundColor: DMG_COLORS[b.element] ?? elementColor }}
                      >
                        {b.element}
                      </span>
                    )}
                  </div>

                  {!isTeamCard && (
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                        dmgType === "nonCrit" ? "bg-zinc-200 dark:bg-zinc-800 ring-1 ring-zinc-400 font-bold" : ""
                      }`}>
                        <span className="text-gray-400 text-[10px]">Non-Crit:</span>
                        <span className="font-semibold text-gray-700 dark:text-zinc-300">
                          {fmt(b.nonCrit)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                        dmgType === "crit" ? "bg-amber-500/15 dark:bg-amber-500/20 ring-1 ring-amber-500 font-bold" : ""
                      }`}>
                        <span className="text-amber-500 text-[10px] font-bold">CRIT:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {fmt(b.crit)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                        dmgType === "avg" ? "bg-emerald-500/15 dark:bg-emerald-500/20 ring-1 ring-emerald-500 font-bold" : ""
                      }`}>
                        <span className="text-emerald-500 text-[10px] font-bold">Avg:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {fmt(b.avg)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyFormula(b)}
                        className="ml-2 px-2.5 py-1 text-[11px] font-sans font-medium rounded border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition-colors"
                      >
                        {copiedId === b.id ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  )}

                  {isTeamCard && (
                    <button
                      onClick={() => handleCopyFormula(b)}
                      className="px-2.5 py-1 text-[11px] font-sans font-medium rounded border border-amber-300 dark:border-amber-700 bg-amber-100/50 dark:bg-amber-900/40 hover:bg-amber-200/50 text-amber-900 dark:text-amber-200 transition-colors"
                    >
                      {copiedId === b.id ? "✓ Copied" : "Copy Team Buffs"}
                    </button>
                  )}
                </div>

                {/* Main Formula Highlight Box (or Title for Team Buffs) */}
                {!isTeamCard && (
                  <div className="mb-3 p-3 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800 shadow-inner">
                    {activeFormula}
                  </div>
                )}

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
            );
          })
        )}
      </div>
    </div>
  );
};
