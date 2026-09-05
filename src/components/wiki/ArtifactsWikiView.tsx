"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ARTIFACTS, type ArtifactConfig } from "@/data/registry/artifacts";
import { RarityRangeBadge } from "@/components/wiki/RarityRangeBadge";
import { getArtifactRarityRange, matchesArtifactRarity } from "@/data/registry/artifacts/types";

export function ArtifactsWikiView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<number | "all">("all");
  const [rarityMode, setRarityMode] = useState<"range" | "max">("range");
  const [selectedRole, setSelectedRole] = useState<"all" | "support" | "wielder">("all");

  // Local interactive mechanic state per artifact: artifactId -> record of inputKey -> number
  const [mechanicInputs, setMechanicInputs] = useState<Record<string, Record<string, number>>>({});

  const getInputValue = (artId: string, defId: string, fallback: number = 0) => {
    return mechanicInputs[artId]?.[defId] ?? fallback;
  };

  const setInputValue = (artId: string, defId: string, val: number) => {
    setMechanicInputs((prev) => ({
      ...prev,
      [artId]: {
        ...(prev[artId] ?? {}),
        [defId]: val,
      },
    }));
  };

  const filteredArtifacts = useMemo(() => {
    return ARTIFACTS.filter((art) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = art.name.toLowerCase().includes(q);
        const match2pc = art.twoPieceDesc.toLowerCase().includes(q);
        const match4pc = art.fourPieceDesc.toLowerCase().includes(q);
        if (!matchName && !match2pc && !match4pc) return false;
      }
      if (selectedRarity !== "all") {
        if (!matchesArtifactRarity(art, selectedRarity, rarityMode)) return false;
      }
      if (selectedRole === "support" && !art.isSupport) return false;
      if (selectedRole === "wielder" && art.buffType === "team") return false;
      return true;
    });
  }, [searchQuery, selectedRarity, rarityMode, selectedRole]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRarity("all");
    setSelectedRole("all");
  };

  const isFiltering = searchQuery || selectedRarity !== "all" || selectedRole !== "all";

  // Tier counts
  const fiveStarSets = ARTIFACTS.filter((a) => a.rarity === 5).length;
  const fourStarSets = ARTIFACTS.filter((a) => a.rarity === 4).length;
  const lowTierSets = ARTIFACTS.filter((a) => a.rarity <= 3).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Artifacts Encyclopedia
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              {filteredArtifacts.length} of {ARTIFACTS.length} Sets
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            All 64 canonical artifact sets with authentic acquisition drop tiers (4★–5★, 3★–4★, 1★–3★), 2-Piece and 4-Piece bonus descriptions, and interactive mechanic sandboxes.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
        >
          <span>⚡ Go to Calculator</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm space-y-3 shadow-xs">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artifact name, 2-Piece bonus, or 4-Piece bonus..."
            className="w-full text-sm border border-gray-300 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Drop Tier Range Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedRarity("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedRarity === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setSelectedRarity(5)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                selectedRarity === 5
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              4★–5★ ({fiveStarSets})
            </button>
            <button
              onClick={() => setSelectedRarity(4)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                selectedRarity === 4
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40 shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              {rarityMode === "range" ? "Contains 4★" : "3★–4★"} ({fourStarSets})
            </button>
            <button
              onClick={() => setSelectedRarity(3)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                selectedRarity === 3
                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              1★–3★ ({lowTierSets})
            </button>
          </div>

          {/* Rarity Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80 text-[11px]">
            <span className="text-gray-400 dark:text-zinc-500 font-semibold">Mode:</span>
            <button
              onClick={() => setRarityMode(rarityMode === "range" ? "max" : "range")}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              title="Switch between filtering by Drop Range (4★ includes 5★ sets with 4★ pieces) vs Maximum Rarity strictly"
            >
              {rarityMode === "range" ? "Drop Tiers (Inclusive)" : "Max Rarity (Strict)"}
            </button>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedRole === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setSelectedRole("support")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedRole === "support"
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40 font-bold shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              🤝 Support Sets
            </button>
            <button
              onClick={() => setSelectedRole("wielder")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedRole === "wielder"
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40 font-bold shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              ⚔️ DPS / Wielder
            </button>
          </div>

          {isFiltering && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-red-500 hover:underline px-2 py-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Artifacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArtifacts.map((artifact) => {
          const range = getArtifactRarityRange(artifact);

          return (
            <div
              key={artifact.id}
              id={`artifact-${artifact.id}`}
              className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {artifact.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-2">
                      <RarityRangeBadge artifact={artifact} range={range} />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {artifact.isSupport ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        🤝 Support Set
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30">
                        ⚔️ Wielder Set
                      </span>
                    )}
                  </div>
                </div>

                {/* 1-Piece Description (for Tiaras) */}
                {artifact.onePieceDesc && (
                  <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                      1-Piece Bonus:
                    </span>
                    <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                      {artifact.onePieceDesc}
                    </p>
                  </div>
                )}

                {/* 2-Piece Bonus */}
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide text-[11px]">
                      2-Piece Set:
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {artifact.twoPieceDesc}
                  </p>
                </div>

                {/* 4-Piece Bonus */}
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide text-[11px]">
                      4-Piece Set:
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {artifact.fourPieceDesc}
                  </p>
                </div>

                {/* Interactive Mechanics Sandbox Preview */}
                {artifact.mechanicDefs && artifact.mechanicDefs.length > 0 && (
                  <div className="p-3 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center justify-between">
                      <span>Interactive Mechanics Sandbox</span>
                      <span className="text-amber-500 font-normal font-sans">Live Preview</span>
                    </div>

                    {artifact.mechanicDefs.map((def) => {
                      const curVal = getInputValue(artifact.id, def.id, def.defaultValue ?? 0);
                      const isToggle = def.control === "toggle";

                      return (
                        <div
                          key={def.id}
                          className="flex items-center justify-between gap-3 text-xs pt-1 border-t border-zinc-200/60 dark:border-zinc-700/60 first:border-t-0 first:pt-0"
                        >
                          <span className="text-gray-700 dark:text-zinc-300 font-medium truncate">
                            {def.label}
                          </span>

                          {isToggle ? (
                            <button
                              onClick={() => setInputValue(artifact.id, def.id, curVal === 1 ? 0 : 1)}
                              className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                                curVal === 1
                                  ? "bg-amber-500 text-zinc-950 font-extrabold shadow-xs"
                                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                              }`}
                            >
                              {curVal === 1 ? "Active [ON]" : "Inactive [OFF]"}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min={def.min ?? 0}
                                max={def.max ?? 100}
                                value={curVal}
                                onChange={(e) => setInputValue(artifact.id, def.id, Number(e.target.value))}
                                className="w-20 accent-amber-500 cursor-pointer"
                              />
                              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 w-8 text-right">
                                {curVal}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Show dynamic buff preview calculated from inputs */}
                    {artifact.buffs.length > 0 && (
                      <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                        {artifact.buffs.map((b) => {
                          const inputs = mechanicInputs[artifact.id] ?? {};
                          const simulatedVal = b.compute
                            ? b.compute({
                                pieceCount: b.pieceRequirement,
                                slot: "wielder",
                                baseAtk: 800,
                                baseDef: 800,
                                baseHp: 15000,
                                inputs,
                              })
                            : b.value ?? 0;

                          return (
                            <div
                              key={b.id}
                              className="flex items-center justify-between text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded"
                            >
                              <span className="truncate max-w-[70%]">{b.label}</span>
                              <span className="font-mono font-bold shrink-0">
                                +{simulatedVal}
                                {b.isPercent !== false && "%"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="text-[10px] text-gray-400 dark:text-zinc-500">
                  ID: <code className="font-mono">{artifact.id}</code>
                </div>

                <Link
                  href="/"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors flex items-center gap-1"
                >
                  <span>Use in Calculator →</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArtifacts.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-zinc-500 space-y-2">
          <div className="text-3xl">🔍</div>
          <div className="text-sm font-semibold">No artifact sets matching the active filters.</div>
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
