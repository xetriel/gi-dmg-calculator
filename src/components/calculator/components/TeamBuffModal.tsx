"use client";
import React, { useState } from "react";
import Link from "next/link";
import type { CharacterConfig, Element } from "@/data/registry/types";
import type { CalcInstance, SupportInstance } from "../types";
import { SUPPORT_CONFIGS, supportById } from "@/data/registry/characters";
import { resolveTeamBuffs, resolveSupportCtx } from "@/lib/engine/team-buffs";
import { ElementIcon, WeaponIcon } from "@/components/icons";
import { getRarityTheme } from "../rarity-theme";

interface TeamBuffModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  config: CharacterConfig;
  instances: CalcInstance[];
  activeInstanceId: string;
  setActiveInstanceId: (id: string) => void;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
}

const MAX_SUPPORTS = 3;

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });



const ELEMENT_BADGES: Record<string, string> = {
  Pyro: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Hydro: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Electro: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Cryo: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  Anemo: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  Geo: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Dendro: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
};

// Reads the support character's working draft from localStorage
function readSupportDraft(characterId: string): {
  instances: Array<{
    id: string;
    stats: Record<string, string>;
    mechanicInputs: Record<string, string>;
    constellationLevel: number;
    levels?: Record<string, string>;
  }>;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`gi_calc_working_draft_${characterId}`);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (Array.isArray(draft.instances) && draft.instances.length > 0) {
      return { instances: draft.instances };
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export const TeamBuffModal: React.FC<TeamBuffModalProps> = ({
  isOpen,
  setIsOpen,
  config,
  instances,
  activeInstanceId,
  setActiveInstanceId,
  updateInstance,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [elementFilter, setElementFilter] = useState<"ALL" | Element>("ALL");
  const [rarityFilter, setRarityFilter] = useState<number | "ALL">("ALL");

  if (!isOpen) return null;

  const currentInst = instances.find((i) => i.id === activeInstanceId) || instances[0];
  if (!currentInst) return null;

  const supports = currentInst.teamSupports ?? [];
  const masterEnabled = currentInst.teamBuffsEnabled !== false;

  // Compute live total team buff results
  const totalResult = resolveTeamBuffs(supports, masterEnabled);

  // Set of already added support IDs for the active setup
  const addedSupportIds = new Set(supports.map((s) => s.supportId));
  const isMaxReached = supports.length >= MAX_SUPPORTS;

  // Filter catalog of support characters
  const filteredCatalog = SUPPORT_CONFIGS.filter((s) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchElement = s.element.toLowerCase().includes(q);
      const matchDesc = (s.description ?? "").toLowerCase().includes(q);
      const matchBuffs = (s.buffExplanations ?? []).some(
        (b) => b.name.toLowerCase().includes(q) || b.brief.toLowerCase().includes(q) || b.full.toLowerCase().includes(q)
      );
      const matchConstellations = (s.constellations ?? []).some(
        (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
      if (!matchName && !matchElement && !matchDesc && !matchBuffs && !matchConstellations) return false;
    }

    // Element filter
    if (elementFilter !== "ALL" && s.element !== elementFilter) return false;

    // Rarity filter
    if (rarityFilter !== "ALL" && s.rarity !== rarityFilter) return false;

    return true;
  });

  const addSupport = (supportId: string) => {
    if (isMaxReached) return;
    const sConfig = supportById(supportId);
    if (!sConfig) return;

    const initStats: Record<string, string> = {};
    for (const f of sConfig.statFields) {
      if (f.hasBaseAndFlat) {
        initStats[`${f.key}.base`] = f.defaultValue;
        initStats[`${f.key}.percent`] = "0";
        initStats[`${f.key}.flat`] = "0";
      } else {
        initStats[f.key] = f.defaultValue;
        if (f.key === "baseAtk" && !("atk.base" in initStats)) {
          initStats["atk.base"] = f.defaultValue;
        }
      }
    }

    const initMechanics: Record<string, string> = {};
    for (const m of sConfig.mechanicDefs ?? []) {
      initMechanics[m.id] = String(m.defaultValue ?? 0);
    }

    // Try to hydrate from the support character's working draft
    const draft = readSupportDraft(sConfig.characterId);
    let finalStats = initStats;
    let finalMechanics = initMechanics;
    let finalConstellation = 0;
    let finalTalents: Record<string, string> | undefined;
    let setupId: string | undefined;
    let setupName: string | undefined;

    if (draft && draft.instances.length > 0) {
      const firstInst = draft.instances[0];
      finalStats = firstInst.stats ?? initStats;
      finalMechanics = firstInst.mechanicInputs ?? initMechanics;
      finalConstellation = firstInst.constellationLevel ?? 0;
      finalTalents = firstInst.levels;
      setupId = firstInst.id;
      setupName = `Support Setup ${firstInst.id}`;
    } else {
      setupId = "1";
      setupName = "Support Setup 1";
    }

    const newSupport: SupportInstance = {
      supportId,
      stats: finalStats,
      mechanicInputs: finalMechanics,
      constellationLevel: finalConstellation,
      talentLevels: finalTalents,
      enabled: true,
      selectedSetupId: setupId,
      selectedSetupName: setupName,
    };

    updateInstance(currentInst.id, () => ({
      teamSupports: [...supports, newSupport],
    }));
  };

  const removeSupport = (index: number) => {
    updateInstance(currentInst.id, () => ({
      teamSupports: supports.filter((_, i) => i !== index),
    }));
  };

  const updateSupport = (
    index: number,
    updater: (s: SupportInstance) => Partial<SupportInstance>
  ) => {
    const updated = [...supports];
    updated[index] = { ...updated[index], ...updater(updated[index]) };
    updateInstance(currentInst.id, () => ({ teamSupports: updated }));
  };

  const toggleMaster = () => {
    updateInstance(currentInst.id, () => ({ teamBuffsEnabled: !masterEnabled }));
  };

  // Sync support stats from the character's working draft in localStorage
  const syncFromDraft = (index: number) => {
    const sup = supports[index];
    if (!sup) return;
    const sConfig = supportById(sup.supportId);
    if (!sConfig) return;

    const draft = readSupportDraft(sConfig.characterId);
    if (!draft || !draft.instances.length) return;

    const targetInst = draft.instances.find((i) => i.id === sup.selectedSetupId) ?? draft.instances[0];
    if (!targetInst) return;

    updateSupport(index, () => ({
      stats: targetInst.stats,
      mechanicInputs: targetInst.mechanicInputs ?? sup.mechanicInputs,
      constellationLevel: targetInst.constellationLevel ?? sup.constellationLevel,
      talentLevels: targetInst.levels ?? sup.talentLevels,
      selectedSetupId: targetInst.id,
      selectedSetupName: `Support Setup ${targetInst.id}`,
    }));
  };

  // Switch to a different setup from the support character's working draft
  const switchSetup = (index: number, setupId: string) => {
    const sup = supports[index];
    if (!sup) return;
    const sConfig = supportById(sup.supportId);
    if (!sConfig) return;

    const draft = readSupportDraft(sConfig.characterId);
    if (!draft) return;

    const targetInst = draft.instances.find((i) => i.id === setupId);
    if (!targetInst) return;

    updateSupport(index, () => ({
      stats: targetInst.stats,
      mechanicInputs: targetInst.mechanicInputs ?? sup.mechanicInputs,
      constellationLevel: targetInst.constellationLevel ?? sup.constellationLevel,
      talentLevels: targetInst.levels ?? sup.talentLevels,
      selectedSetupId: targetInst.id,
      selectedSetupName: `Support Setup ${targetInst.id}`,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-6xl h-[90vh] max-h-[850px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-150 dark:border-zinc-850 shrink-0 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-lg">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Team Support Buffs
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {supports.filter((s) => s.enabled).length}/{supports.length} Active (Max {MAX_SUPPORTS})
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Configure party support characters and team buffs applied to {config.name} (Max {MAX_SUPPORTS} supports per team)
              </p>
            </div>
          </div>

          {/* Setup Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-200/60 dark:bg-zinc-800/60 p-1 rounded-xl border border-gray-300/40 dark:border-zinc-700/40">
            {instances.map((inst, idx) => {
              const activeCount = (inst.teamSupports ?? []).filter((s) => s.enabled).length;
              const isSelected = inst.id === currentInst.id;
              return (
                <button
                  key={inst.id}
                  onClick={() => setActiveInstanceId(inst.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs font-bold"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <span>{`Setup ${idx + 1}`}</span>
                  {activeCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">
                      {activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Main Content: Split Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-zinc-800">
          
          {/* LEFT PANE: Support Character Catalog & Filtering (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-gray-50/30 dark:bg-zinc-900/20">
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 space-y-2.5 shrink-0">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search support name, element, buff effects..."
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

              {/* Element Filters */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setElementFilter("ALL")}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer border ${
                    elementFilter === "ALL"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-2xs"
                      : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                  }`}
                >
                  All Elements ({SUPPORT_CONFIGS.length})
                </button>
                {(["Pyro", "Hydro", "Electro", "Cryo", "Anemo", "Geo", "Dendro"] as const).map((elem) => (
                  <button
                    key={elem}
                    onClick={() => setElementFilter(elem)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer border flex items-center gap-1 ${
                      elementFilter === elem
                        ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                        : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-amber-400"
                    }`}
                  >
                    <ElementIcon element={elem} className="w-3 h-3" />
                    <span>{elem}</span>
                  </button>
                ))}
              </div>

              {/* Rarity Filter */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-zinc-400">
                <span className="font-semibold">Rarity:</span>
                {(["ALL", 5, 4] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer border ${
                      rarityFilter === r
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-amber-400"
                    }`}
                  >
                    {r === "ALL" ? "All" : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Support Catalog List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredCatalog.map((s) => {
                const isAdded = addedSupportIds.has(s.id);
                const theme = getRarityTheme(s.rarity);

                return (
                  <div
                    key={s.id}
                    className={`rounded-xl border p-3 transition-all duration-150 flex flex-col justify-between gap-2.5 ${
                      isAdded
                        ? `${theme.catalogAddedBg} opacity-70`
                        : `border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 ${theme.catalogBorderHover} hover:shadow-xs`
                    }`}
                  >
                    <div>
                      {/* Title, Badges & Action Button */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <ElementIcon element={s.element} className="w-4 h-4" />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {s.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${theme.badge}`}>
                            {"★".repeat(s.rarity)}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${ELEMENT_BADGES[s.element] || ""}`}>
                            {s.element}
                          </span>
                          {s.weapon && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                              <WeaponIcon weapon={s.weapon} className="w-2.5 h-2.5" />
                              {s.weapon}
                            </span>
                          )}
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => addSupport(s.id)}
                          disabled={isAdded || isMaxReached}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                            isAdded
                              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                              : isMaxReached
                              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                              : `${theme.addButton} shadow-xs`
                          }`}
                          title={isMaxReached && !isAdded ? `Maximum of ${MAX_SUPPORTS} support characters reached` : undefined}
                        >
                          {isAdded ? "Added ✓" : isMaxReached ? `Max ${MAX_SUPPORTS}` : "+ Add"}
                        </button>
                      </div>

                      {/* Character Description */}
                      {s.description && (
                        <p className="text-[11px] text-gray-600 dark:text-zinc-400 mb-2 leading-relaxed">
                          {s.description}
                        </p>
                      )}

                      {/* Provided Buffs Details / Explanations */}
                      <div className="space-y-1.5 text-[11px] bg-gray-50/60 dark:bg-zinc-900/40 p-2.5 rounded-lg border border-gray-200/50 dark:border-zinc-800/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                          Provided Buffs & Mechanics
                        </span>
                        {(s.buffExplanations ?? []).map((buff, bi) => (
                          <div key={bi} className="space-y-0.5">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="font-bold text-gray-800 dark:text-zinc-200">
                                {buff.name}
                              </span>
                              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                {buff.brief}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                              {buff.full}
                            </p>
                          </div>
                        ))}

                        {/* Fallback if no buffExplanations exist */}
                        {(!s.buffExplanations || s.buffExplanations.length === 0) && (
                          <div className="space-y-1">
                            {s.buffs.map((b, bi) => (
                              <div key={bi} className="text-[10px] text-gray-600 dark:text-zinc-400">
                                • <span className="font-semibold text-gray-800 dark:text-zinc-200">{b.label}</span> ({b.stat})
                              </div>
                            ))}
                            {s.lunarBaseBonusCompute && (
                              <div className="text-[10px] text-gray-600 dark:text-zinc-400">
                                • <span className="font-semibold text-gray-800 dark:text-zinc-200">Moonsign Benediction</span> (Lunar Base DMG)
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400 dark:text-zinc-600 italic">
                  No support characters found matching the selected filters.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Configured Support Characters for Setup (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-white dark:bg-zinc-950">
            {/* Right Pane Header */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/30 dark:bg-zinc-900/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Configured Supports for Setup {instances.findIndex((i) => i.id === currentInst.id) + 1}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  ({supports.length}/{MAX_SUPPORTS})
                </span>
              </div>

              {/* Master Enable Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300">
                  Apply All Buffs
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-amber-500 cursor-pointer"
                  checked={masterEnabled}
                  onChange={toggleMaster}
                />
              </label>
            </div>

            {/* Configured Supports Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
              {supports.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-zinc-500">
                  <span className="text-4xl mb-3">👥</span>
                  <p className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    No Support Characters Configured
                  </p>
                  <p className="text-xs max-w-sm">
                    Select support characters (e.g. *Ineffa*, *Bennett*) from the catalog on the left to add their team buffs and stat bonuses (max {MAX_SUPPORTS} per team).
                  </p>
                </div>
              )}

              {supports.map((sup, index) => {
                const sConfig = supportById(sup.supportId);
                if (!sConfig) return null;
                const isActive = masterEnabled && sup.enabled;

                // Resolve context for brief stats and preview
                const ctx = resolveSupportCtx({ ...sup, enabled: true });
                const briefStats = ctx && sConfig.formatBriefStats ? sConfig.formatBriefStats(ctx) : [];

                // Compute individual support preview
                const preview = resolveTeamBuffs([{ ...sup, enabled: true }], true);

                // Get available setups from working draft
                const draft = readSupportDraft(sConfig.characterId);
                const availableSetups = draft?.instances && draft.instances.length > 0 ? draft.instances : [{ id: "1" }];
                const theme = getRarityTheme(sConfig.rarity);

                return (
                  <div
                    key={`${sup.supportId}-${index}`}
                    className={`rounded-2xl border p-4 transition-all duration-200 shadow-xs ${
                      isActive
                        ? theme.cardBorderActive
                        : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 opacity-60"
                    }`}
                  >
                    {/* Support Card Header */}
                    <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="checkbox"
                          className={`h-4 w-4 ${theme.checkboxAccent} cursor-pointer`}
                          checked={sup.enabled}
                          onChange={() => updateSupport(index, () => ({ enabled: !sup.enabled }))}
                        />
                        <ElementIcon element={sConfig.element} className="w-4 h-4" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {sConfig.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${theme.badge}`}>
                          {"★".repeat(sConfig.rarity)}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${ELEMENT_BADGES[sConfig.element] || ""}`}>
                          {sConfig.element}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold">
                          C{sup.constellationLevel}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${theme.notePill}`}>
                          Buffing: Character Setup {currentInst.id}
                        </span>
                      </div>

                      <button
                        onClick={() => removeSupport(index)}
                        className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove support"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Brief Info Stat Pills */}
                    {briefStats.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {briefStats.map((pill, pi) => (
                          <span
                            key={pi}
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium border border-zinc-200 dark:border-zinc-700"
                          >
                            <span className="text-gray-400 dark:text-zinc-500">{pill.label}:</span>
                            <span className="font-bold">{pill.value}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Setup Switcher & Actions */}
                    <div className="flex items-center justify-between gap-2 mb-3 bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-gray-200/80 dark:border-zinc-800/80 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold flex items-center gap-1">
                          <span>⚙️</span>
                          <span>Support Setup:</span>
                        </span>

                        {/* Setup option buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {availableSetups.map((s) => {
                            const isSelected = (sup.selectedSetupId ?? "1") === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => switchSetup(index, s.id)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border flex items-center gap-1 ${
                                  isSelected
                                    ? theme.activeButton
                                    : `bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 ${theme.buttonHover}`
                                }`}
                                title={`Switch to ${sConfig.name} Support Setup ${s.id}`}
                              >
                                <span>Support Setup {s.id}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Sync button */}
                        <button
                          type="button"
                          onClick={() => syncFromDraft(index)}
                          className={`text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 ${theme.buttonHover} transition-all font-semibold cursor-pointer`}
                          title="Sync latest stats from this support character's calculator"
                        >
                          🔄 Sync
                        </button>

                        {/* Edit in dedicated support builder */}
                        <Link
                          href={`/characters/${sConfig.characterId}/support?from=${config.id}&charSetup=${currentInst.id}&supportSetup=${sup.selectedSetupId ?? "1"}`}
                          className={`text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 ${theme.buttonHover} transition-all inline-flex items-center gap-1 font-semibold`}
                          title="Open dedicated support builder for this character"
                        >
                          ✎ Edit Build ↗
                        </Link>
                      </div>
                    </div>

                    {/* Constellation Selector */}
                    <div className="flex items-center gap-2 mb-3 bg-white/70 dark:bg-zinc-900/70 p-2 rounded-xl border border-gray-200/80 dark:border-zinc-800/80">
                      <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">Constellation:</span>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() =>
                              updateSupport(index, () => ({
                                constellationLevel: sup.constellationLevel === lvl ? Math.max(0, lvl - 1) : lvl,
                              }))
                            }
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                              sup.constellationLevel >= lvl
                                ? theme.activeButton
                                : `bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 ${theme.buttonHover}`
                            }`}
                          >
                            C{lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mechanic Controls (Toggles / Stacks) */}
                    {(sConfig.mechanicDefs ?? []).length > 0 && (
                      <div className="space-y-2 mb-3 bg-gray-50/80 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-gray-200/60 dark:border-zinc-800/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1">
                          Mechanic Conditions
                        </span>
                        {(sConfig.mechanicDefs ?? []).map((m) => {
                          const mechVal = Number(sup.mechanicInputs[m.id] ?? "0") > 0;
                          const conMatch = m.id.match(/c(\d+)/);
                          const requiredCon = conMatch ? Number(conMatch[1]) : 0;
                          const isGated = requiredCon > 0 && sup.constellationLevel < requiredCon;

                          return (
                            <div key={m.id} className="flex items-center gap-2 text-xs" title={m.hint}>
                              <input
                                type="checkbox"
                                className={`h-4 w-4 ${theme.checkboxAccent} cursor-pointer disabled:opacity-40`}
                                checked={mechVal && !isGated}
                                disabled={isGated}
                                onChange={(e) =>
                                  updateSupport(index, (s) => ({
                                    mechanicInputs: { ...s.mechanicInputs, [m.id]: e.target.checked ? "1" : "0" },
                                  }))
                                }
                              />
                              <span className={`${isGated ? "text-gray-400 dark:text-zinc-600 line-through" : "text-gray-800 dark:text-zinc-200"}`}>
                                {m.label}
                                {isGated && <span className="ml-1 text-[10px] text-amber-500 font-bold">(Requires C{requiredCon})</span>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Calculated Individual Buff Outputs */}
                    <div className="pt-2 border-t border-gray-200/60 dark:border-zinc-800/60 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                        Active Stat Bonuses:
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {preview.sources.map((s, i) => (
                          <span
                            key={i}
                            className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                              isActive
                                ? theme.notePill
                                : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border-gray-200 dark:border-zinc-700"
                            }`}
                          >
                            {s.label}: +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                              ? fmt(s.value)
                              : `${fmt(s.value)}%`}
                          </span>
                        ))}
                        {preview.sources.length === 0 && (
                          <span className="text-xs text-gray-400 dark:text-zinc-600 italic">
                            No active buffs for this setup
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Bar: Aggregated Buff Totals */}
            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 shrink-0 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Total Team Support Bonuses:
                </span>
                {totalResult.sources.length > 0 ? (
                  totalResult.sources.map((s, i) => (
                    <span
                      key={i}
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                        masterEnabled
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30"
                          : "bg-gray-200 dark:bg-zinc-800 text-gray-400 line-through border-transparent"
                      }`}
                    >
                      {s.label}: +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                        ? fmt(s.value)
                        : `${fmt(s.value)}%`}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 dark:text-zinc-500 italic">
                    None active
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
