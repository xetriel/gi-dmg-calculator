"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { RAW_CHARACTERS } from "@/data/registry/characters";
import { ElementIcon, WeaponIcon } from "@/components/icons";
import type { Element, Weapon, ScalingSource } from "@/data/registry/types";

const ELEMENTS: Element[] = ["Pyro", "Hydro", "Anemo", "Electro", "Dendro", "Cryo", "Geo"];
const WEAPONS: Weapon[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

export function CharactersWikiView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<Element | "all">("all");
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<number | "all">("all");
  const [selectedScaling, setSelectedScaling] = useState<ScalingSource | "all">("all");
  const [expandedConstellations, setExpandedConstellations] = useState<Record<string, boolean>>({});

  const toggleConstellations = (id: string) => {
    setExpandedConstellations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCharacters = useMemo(() => {
    return RAW_CHARACTERS.filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchNotes = c.notes?.some((n) => n.toLowerCase().includes(q));
        const matchTalents = c.wikiTalents?.some(
          (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        );
        const matchConsts = c.constellations?.some(
          (cs) => cs.name.toLowerCase().includes(q) || cs.description.toLowerCase().includes(q)
        );
        if (!matchName && !matchNotes && !matchTalents && !matchConsts) return false;
      }
      if (selectedElement !== "all" && c.element !== selectedElement) return false;
      if (selectedWeapon !== "all" && c.weapon !== selectedWeapon) return false;
      if (selectedRarity !== "all" && c.rarity !== selectedRarity) return false;
      if (selectedScaling !== "all" && c.scalingSource !== selectedScaling) return false;
      return true;
    });
  }, [searchQuery, selectedElement, selectedWeapon, selectedRarity, selectedScaling]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedElement("all");
    setSelectedWeapon("all");
    setSelectedRarity("all");
    setSelectedScaling("all");
  };

  const isFiltering =
    Boolean(searchQuery) ||
    selectedElement !== "all" ||
    selectedWeapon !== "all" ||
    selectedRarity !== "all" ||
    selectedScaling !== "all";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Characters Dossier
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              {filteredCharacters.length} of {RAW_CHARACTERS.length} Profiles
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            Comprehensive kits for 48 characters with scaling sources, ascension stats, Normal/Skill/Burst hits, C1–C6 constellations, and universal support profiles.
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
            placeholder="Search character name, skill, burst, or constellation..."
            className="w-full text-sm border border-gray-300 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
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

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Element Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedElement("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedElement === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              All Elements
            </button>
            {ELEMENTS.map((elem) => (
              <button
                key={elem}
                onClick={() => setSelectedElement(elem)}
                className={`p-1.5 rounded-md flex items-center gap-1 font-semibold transition-colors ${
                  selectedElement === elem
                    ? "bg-amber-500/20 border border-amber-500/40 shadow-xs"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                title={elem}
              >
                <ElementIcon element={elem} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{elem}</span>
              </button>
            ))}
          </div>

          {/* Weapon Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedWeapon("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedWeapon === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              All Weapons
            </button>
            {WEAPONS.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeapon(w)}
                className={`p-1.5 rounded-md flex items-center gap-1 font-semibold transition-colors ${
                  selectedWeapon === w
                    ? "bg-amber-500/20 border border-amber-500/40 shadow-xs"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                title={w}
              >
                <WeaponIcon weapon={w} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{w}</span>
              </button>
            ))}
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedRarity("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedRarity === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              All★
            </button>
            <button
              onClick={() => setSelectedRarity(5)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                selectedRarity === 5
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              5★
            </button>
            <button
              onClick={() => setSelectedRarity(4)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                selectedRarity === 4
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40 shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              4★
            </button>
          </div>

          {/* Scaling Source */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedScaling("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedScaling === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              All Scaling
            </button>
            {(["atk", "hp", "def", "em"] as ScalingSource[]).map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedScaling(sc)}
                className={`px-2 py-1 rounded-md font-bold uppercase transition-colors ${
                  selectedScaling === sc
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 shadow-xs"
                    : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {sc}
              </button>
            ))}
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

      {/* Characters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCharacters.map((char) => {
          const isConstsExpanded = expandedConstellations[char.id] ?? false;

          return (
            <div
              key={char.id}
              id={`character-${char.id}`}
              className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <ElementIcon element={char.element} className="w-8 h-8 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          {char.name}
                        </h2>
                        <WeaponIcon weapon={char.weapon} className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-xs font-bold ${
                            char.rarity === 5 ? "text-amber-500" : "text-purple-400"
                          }`}
                        >
                          {"★".repeat(char.rarity)} ({char.rarity}-Star)
                        </span>
                        <span className="text-xs text-gray-400 dark:text-zinc-500">•</span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                          {char.element} · {char.weapon}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      Scales: {char.scalingSource.toUpperCase()}
                    </span>
                    {char.support && char.support.buffs.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        🤝 Support
                      </span>
                    )}
                  </div>
                </div>

                {/* Stat Profile Bar */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60 font-mono text-xs">
                  <div>
                    <span className="text-gray-400 dark:text-zinc-500 block text-[10px] uppercase font-sans font-bold">
                      Ascension Stat
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {char.ascensionStat.label} +{char.ascensionStat.maxValue}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-zinc-500 block text-[10px] uppercase font-sans font-bold">
                      Talent Hit Groups
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {char.talents.length} Groups ({char.talents.reduce((acc, t) => acc + t.hits.length, 0)} Hits)
                    </span>
                  </div>
                </div>

                {/* Wiki Talents Breakdown */}
                {char.wikiTalents && char.wikiTalents.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Talent Overview
                    </span>
                    <div className="space-y-1.5">
                      {char.wikiTalents.slice(0, 3).map((t, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-gray-50 dark:bg-zinc-800/30 border border-gray-200/60 dark:border-zinc-800 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-200 mb-0.5">
                            <span>{t.name}</span>
                            <span className="text-[10px] font-mono opacity-60 uppercase">{t.type}</span>
                          </div>
                          <p className="text-gray-600 dark:text-zinc-400 text-[11px] leading-relaxed line-clamp-3">
                            {t.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constellations Accordion (C1-C6) */}
                {char.constellations && char.constellations.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => toggleConstellations(char.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 hover:opacity-80 py-1"
                    >
                      <span>
                        Constellations (C1–C6) · {char.constellations.length} unlocked
                      </span>
                      <span>{isConstsExpanded ? "▲ Collapse" : "▼ Expand C1–C6"}</span>
                    </button>

                    {isConstsExpanded && (
                      <div className="space-y-1.5 mt-2 animate-in fade-in duration-150">
                        {char.constellations.map((cs) => (
                          <div
                            key={cs.level}
                            className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-200">
                              <span className="text-amber-500 font-mono">C{cs.level}</span>
                              <span className="truncate max-w-[85%] text-right font-medium">{cs.name}</span>
                            </div>
                            <p className="text-gray-600 dark:text-zinc-400 text-[11px] mt-1 leading-relaxed">
                              {cs.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Support Profile Callout */}
                {char.support && char.support.buffExplanations && char.support.buffExplanations.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      <span>🤝 Party Support Contribution</span>
                      <span className="font-mono">{char.support.buffs.length} Buffs</span>
                    </div>
                    {char.support.buffExplanations.slice(0, 2).map((b, bIdx) => (
                      <div key={bIdx} className="text-[11px] text-gray-700 dark:text-zinc-300">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">• {b.name}: </span>
                        <span>{b.brief}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="text-[10px] text-gray-400 dark:text-zinc-500">
                  ID: <code className="font-mono">{char.id}</code>
                </div>

                <Link
                  href={`/characters/${char.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
                >
                  <span>Open Calculator ↗</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-zinc-500 space-y-2">
          <div className="text-3xl">🔍</div>
          <div className="text-sm font-semibold">No characters matching the active filters.</div>
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
