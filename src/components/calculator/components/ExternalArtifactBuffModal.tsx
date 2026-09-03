"use client";
import React, { useState } from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance, ExternalArtifactInstance } from "../types";
import { ARTIFACTS, artifactById, filterArtifacts } from "@/data/registry/artifacts";
import { resolveExternalArtifactBuffs } from "@/lib/engine/artifact-buffs";
import { toNum } from "@/lib/engine/validation";
import { getRarityTheme } from "../rarity-theme";

interface ExternalArtifactBuffModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  config: CharacterConfig;
  instances: CalcInstance[];
  activeInstanceId: string;
  setActiveInstanceId: (id: string) => void;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
}

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });



export const ExternalArtifactBuffModal: React.FC<ExternalArtifactBuffModalProps> = ({
  isOpen,
  setIsOpen,
  config,
  instances,
  activeInstanceId,
  setActiveInstanceId,
  updateInstance,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"all" | "support" | "wielder">("all");
  const [rarityFilter, setRarityFilter] = useState<number | "ALL">("ALL");

  if (!isOpen) return null;

  const currentInst = instances.find((i) => i.id === activeInstanceId) || instances[0];
  if (!currentInst) return null;

  const artifacts = currentInst.externalArtifacts ?? [];
  const masterEnabled = currentInst.externalArtifactBuffsEnabled !== false;
  const baseAtk = toNum(currentInst.stats["atk.base"]) ?? 0;

  // Compute live total artifact buff results
  const totalResult = resolveExternalArtifactBuffs(artifacts, baseAtk, config, masterEnabled);

  // Set of already added artifact IDs for the active setup
  const addedArtifactIds = new Set(artifacts.map((a) => a.artifactId));
  const isMaxReached = artifacts.length >= 4;

  // Filter catalog of artifacts
  const filteredCatalog = filterArtifacts(ARTIFACTS, scopeFilter).filter((a) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = a.name.toLowerCase().includes(q);
      const match2p = a.twoPieceDesc.toLowerCase().includes(q);
      const match4p = a.fourPieceDesc.toLowerCase().includes(q);
      if (!matchName && !match2p && !match4p) return false;
    }

    // Rarity filter
    if (rarityFilter !== "ALL" && a.rarity !== rarityFilter) return false;

    return true;
  });

  const addArtifact = (artifactId: string) => {
    if (isMaxReached) return;
    const aConfig = artifactById(artifactId);
    if (!aConfig) return;

    const initInputs: Record<string, string> = {};
    for (const m of aConfig.mechanicDefs ?? []) {
      initInputs[m.id] = String(m.defaultValue ?? 1);
    }

    // Default slot: support if team-only, else wielder
    const defaultSlot = aConfig.buffType === "team" ? "support" : "wielder";

    const newInst: ExternalArtifactInstance = {
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      artifactId,
      pieceCount: 4,
      slot: defaultSlot,
      enabled: true,
      inputs: initInputs,
    };

    updateInstance(currentInst.id, () => ({
      externalArtifacts: [...artifacts, newInst],
    }));
  };

  const removeArtifact = (index: number) => {
    updateInstance(currentInst.id, () => ({
      externalArtifacts: artifacts.filter((_, i) => i !== index),
    }));
  };

  const updateArtifact = (
    index: number,
    updater: (a: ExternalArtifactInstance) => Partial<ExternalArtifactInstance>
  ) => {
    const updated = [...artifacts];
    updated[index] = { ...updated[index], ...updater(updated[index]) };
    updateInstance(currentInst.id, () => ({ externalArtifacts: updated }));
  };

  const toggleMaster = () => {
    updateInstance(currentInst.id, () => ({ externalArtifactBuffsEnabled: !masterEnabled }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-6xl h-[90vh] max-h-[850px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-150 dark:border-zinc-850 shrink-0 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-lg">
              🏺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  External Artifact Buffs
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                  {artifacts.filter((a) => a.enabled).length}/{artifacts.length} Active (Max 4)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Configure party support artifact sets or wielder sets applied to {config.name} (Max 4 sets per team)
              </p>
            </div>
          </div>

          {/* Setup Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-200/60 dark:bg-zinc-800/60 p-1 rounded-xl border border-gray-300/40 dark:border-zinc-700/40">
            {instances.map((inst, idx) => {
              const activeCount = (inst.externalArtifacts ?? []).filter((a) => a.enabled).length;
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
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500 text-white font-bold">
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
          
          {/* LEFT PANE: Artifact Catalog & Filtering (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-gray-50/30 dark:bg-zinc-900/20">
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 space-y-2.5 shrink-0">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search artifact name, set effect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
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

              {/* Scope Filters */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setScopeFilter("all")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer border ${
                    scopeFilter === "all"
                      ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:border-purple-400"
                  }`}
                >
                  All ({ARTIFACTS.length})
                </button>
                <button
                  onClick={() => setScopeFilter("support")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer border flex items-center gap-1 ${
                    scopeFilter === "support"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:border-emerald-400"
                  }`}
                >
                  <span>🛡️ Party Support</span>
                </button>
                <button
                  onClick={() => setScopeFilter("wielder")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer border flex items-center gap-1 ${
                    scopeFilter === "wielder"
                      ? "bg-sky-600 text-white border-sky-700 shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:border-sky-400"
                  }`}
                >
                  <span>⚔️ Wielder</span>
                </button>
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
                        ? "bg-purple-600 text-white border-purple-700"
                        : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-purple-400"
                    }`}
                  >
                    {r === "ALL" ? "All" : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Artifact Catalog List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredCatalog.map((a) => {
                const isAdded = addedArtifactIds.has(a.id);
                const theme = getRarityTheme(a.rarity);

                return (
                  <div
                    key={a.id}
                    className={`rounded-xl border p-3 transition-all duration-150 flex flex-col justify-between gap-2 ${
                      isAdded
                        ? `${theme.catalogAddedBg} opacity-70`
                        : `border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 ${theme.catalogBorderHover} hover:shadow-xs`
                    }`}
                  >
                    <div>
                      {/* Title & Badges */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm">🏺</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {a.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${theme.badge}`}>
                            {"★".repeat(a.rarity)}
                          </span>
                          {a.isSupport && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
                              Party Support
                            </span>
                          )}
                          {(a.buffType === "self" || a.buffType === "both") && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-700">
                              Wielder
                            </span>
                          )}
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => addArtifact(a.id)}
                          disabled={isAdded || isMaxReached}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                            isAdded
                              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                              : isMaxReached
                              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                              : `${theme.addButton} shadow-xs`
                          }`}
                          title={isMaxReached && !isAdded ? "Maximum of 4 artifact sets reached" : undefined}
                        >
                          {isAdded ? "Added ✓" : isMaxReached ? "Max 4" : "+ Add"}
                        </button>
                      </div>

                      {/* Set Effects details */}
                      <div className="space-y-1 text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed bg-gray-50/60 dark:bg-zinc-900/40 p-2 rounded-lg border border-gray-200/50 dark:border-zinc-800/50">
                        <div>
                          <span className="font-bold text-gray-800 dark:text-zinc-200">2-Piece: </span>
                          <span>{a.twoPieceDesc}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 dark:text-zinc-200">4-Piece: </span>
                          <span>{a.fourPieceDesc}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400 dark:text-zinc-600 italic">
                  No artifacts found matching the selected filters.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Configured External Artifacts for Setup (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-white dark:bg-zinc-950">
            {/* Right Pane Header */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/30 dark:bg-zinc-900/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Configured Artifact Sets for Setup {instances.findIndex((i) => i.id === currentInst.id) + 1}
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  ({artifacts.length}/4)
                </span>
              </div>

              {/* Master Enable Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300">
                  Apply All Buffs
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-purple-500 cursor-pointer"
                  checked={masterEnabled}
                  onChange={toggleMaster}
                />
              </label>
            </div>

            {/* Configured Artifacts Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
              {artifacts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-zinc-500">
                  <span className="text-4xl mb-3">🏺</span>
                  <p className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    No External Artifacts Configured
                  </p>
                  <p className="text-xs max-w-sm">
                    Select party support artifact sets (e.g. *Heart of the Furnace*) or wielder sets (e.g. *Scarlet Proof*) from the catalog on the left to add their buffs (max 4 per team).
                  </p>
                </div>
              )}

              {artifacts.map((aInst, index) => {
                const aConfig = artifactById(aInst.artifactId);
                if (!aConfig) return null;
                const isActive = masterEnabled && aInst.enabled;
                const isWielder = (aInst.slot || "wielder") === "wielder";

                // Compute individual preview for this artifact
                const singleResult = resolveExternalArtifactBuffs(
                  [{ ...aInst, enabled: true }],
                  baseAtk,
                  config,
                  true
                );

                const theme = getRarityTheme(aConfig.rarity);

                return (
                  <div
                    key={aInst.id || `${aInst.artifactId}-${index}`}
                    className={`rounded-2xl border p-4 transition-all duration-200 shadow-xs ${
                      isActive
                        ? theme.cardBorderActive
                        : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 opacity-60"
                    }`}
                  >
                    {/* Artifact Card Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="checkbox"
                          className={`h-4 w-4 ${theme.checkboxAccent} cursor-pointer`}
                          checked={aInst.enabled}
                          onChange={() => updateArtifact(index, (a) => ({ enabled: !a.enabled }))}
                        />
                        <span className="text-sm">🏺</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {aConfig.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${theme.badge}`}>
                          {"★".repeat(aConfig.rarity)}
                        </span>
                        {aConfig.isSupport && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
                            Party Support
                          </span>
                        )}
                        {(aConfig.buffType === "self" || aConfig.buffType === "both") && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-700">
                            Wielder
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeArtifact(index)}
                        className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove artifact"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Dual Selector Controls: Role (Wielder / Support) + Piece Count (2-Piece / 4-Piece) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-gray-200/80 dark:border-zinc-800/80">
                      {/* Slot / Role Selector */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">Equipped On:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateArtifact(index, () => ({ slot: "wielder" }))}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                              isWielder
                                ? "bg-sky-600 text-white border-sky-700 shadow-xs"
                                : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-sky-400"
                            }`}
                            title="Equipped on active DPS character (receives self and team buffs)"
                          >
                            ⚔️ Wielder
                          </button>
                          <button
                            type="button"
                            onClick={() => updateArtifact(index, () => ({ slot: "support" }))}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                              !isWielder
                                ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                                : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-emerald-400"
                            }`}
                            title="Equipped on a party teammate (provides party buffs to active DPS)"
                          >
                            🛡️ Support
                          </button>
                        </div>
                      </div>

                      {/* Piece Count Selector */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">Set Pieces:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateArtifact(index, () => ({ pieceCount: 2 }))}
                            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                              (aInst.pieceCount || 4) === 2
                                ? theme.activeButton
                                : `bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 ${theme.buttonHover}`
                            }`}
                          >
                            2-Piece
                          </button>
                          <button
                            type="button"
                            onClick={() => updateArtifact(index, () => ({ pieceCount: 4 }))}
                            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                              (aInst.pieceCount || 4) === 4
                                ? theme.activeButton
                                : `bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 ${theme.buttonHover}`
                            }`}
                          >
                            4-Piece
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Set Effect Details */}
                    <div className="text-[11px] space-y-1 text-gray-600 dark:text-zinc-400 mb-3 bg-gray-50/50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-gray-200/50 dark:border-zinc-800/50 leading-relaxed">
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-zinc-200">2-Piece: </span>
                        <span>{aConfig.twoPieceDesc}</span>
                      </div>
                      {(aInst.pieceCount || 4) === 4 && (
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-zinc-200">4-Piece: </span>
                          <span>{aConfig.fourPieceDesc}</span>
                        </div>
                      )}
                    </div>

                    {/* Mechanic Controls (Toggles / Stacks) */}
                    {(aInst.pieceCount || 4) === 4 && (aConfig.mechanicDefs ?? []).length > 0 && (
                      <div className="space-y-2 mb-3 bg-gray-50/80 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-gray-200/60 dark:border-zinc-800/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1">
                          Mechanic Conditions
                        </span>
                        {(aConfig.mechanicDefs ?? []).map((m) => {
                          if (m.control === "toggle") {
                            const isChecked =
                              (aInst.inputs?.[m.id] ?? String(m.defaultValue ?? 1)) === "1" ||
                              Number(aInst.inputs?.[m.id] ?? 1) > 0;
                            return (
                              <label
                                key={m.id}
                                className="flex items-center gap-2 text-xs text-gray-800 dark:text-zinc-200 cursor-pointer"
                                title={m.hint}
                              >
                                <input
                                  type="checkbox"
                                  className={`h-4 w-4 ${theme.checkboxAccent} cursor-pointer`}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    updateArtifact(index, (a) => ({
                                      inputs: { ...a.inputs, [m.id]: e.target.checked ? "1" : "0" },
                                    }))
                                  }
                                />
                                <span>{m.label}</span>
                              </label>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}

                    {/* Calculated Individual Buff Outputs */}
                    <div className="pt-2 border-t border-gray-200/60 dark:border-zinc-800/60 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                        Active Stat Bonuses:
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {singleResult.sources.map((s, i) => (
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
                        {singleResult.sources.length === 0 && (
                          <span className="text-xs text-gray-400 dark:text-zinc-600 italic">
                            {!isWielder && aConfig.buffType === "self"
                              ? "No team buffs (Wielder-only artifact on Support slot)"
                              : "No active buffs for this setup"}
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
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Total External Artifact Bonuses:
                </span>
                {totalResult.sources.length > 0 ? (
                  totalResult.sources.map((s, i) => (
                    <span
                      key={i}
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                        masterEnabled
                          ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30"
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
                className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all cursor-pointer"
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
