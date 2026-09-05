"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { WEAPONS, type WeaponConfig, type WeaponType } from "@/data/registry/weapons";
import { WeaponIcon } from "@/components/icons";

const WEAPON_TYPES: WeaponType[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];
const RARITIES = [5, 4, 3, 2, 1];

export function WeaponsWikiView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<WeaponType | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<number | "all">("all");
  const [selectedRole, setSelectedRole] = useState<"all" | "support" | "self">("all");
  const [selectedSubstat, setSelectedSubstat] = useState<string>("all");

  // Per-weapon refinement state: record of weaponId -> refinement (1..5)
  const [refinements, setRefinements] = useState<Record<string, number>>({});

  const getRefinement = (id: string) => refinements[id] ?? 1;
  const setRefinement = (id: string, r: number) => {
    setRefinements((prev) => ({ ...prev, [id]: r }));
  };

  const filteredWeapons = useMemo(() => {
    return WEAPONS.filter((w) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = w.name.toLowerCase().includes(q);
        const matchPassive = w.passiveName?.toLowerCase().includes(q) || w.passiveDesc?.toLowerCase().includes(q);
        if (!matchName && !matchPassive) return false;
      }
      if (selectedType !== "all" && w.type !== selectedType) return false;
      if (selectedRarity !== "all" && w.rarity !== selectedRarity) return false;
      if (selectedRole === "support" && !w.isSupport) return false;
      if (selectedRole === "self" && w.buffType === "team") return false;
      if (selectedSubstat !== "all" && w.subStat?.type !== selectedSubstat) return false;
      return true;
    });
  }, [searchQuery, selectedType, selectedRarity, selectedRole, selectedSubstat]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedRarity("all");
    setSelectedRole("all");
    setSelectedSubstat("all");
  };

  const isFiltering =
    Boolean(searchQuery) ||
    selectedType !== "all" ||
    selectedRarity !== "all" ||
    selectedRole !== "all" ||
    selectedSubstat !== "all";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Weapons Compendium
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {filteredWeapons.length} of {WEAPONS.length}
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            All 246 canonical weapons with Lv 90 stats, substats, interactive R1–R5 refinement sliders, and damage support capabilities.
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
            placeholder="Search weapon name, passive skill, or effect..."
            className="w-full text-sm border border-gray-300 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
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

        {/* Filter Chips Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Weapon Type Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                selectedType === "all"
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              All Types
            </button>
            {WEAPON_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-1.5 rounded-md flex items-center gap-1 font-semibold transition-colors ${
                  selectedType === type
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold shadow-xs"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                title={type}
              >
                <WeaponIcon weapon={type} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{type}</span>
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
            {RARITIES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-2 py-1 rounded-md font-bold transition-colors ${
                  selectedRarity === r
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs"
                    : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {r}★
              </button>
            ))}
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
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 font-bold shadow-xs"
                  : "text-gray-600 dark:text-zinc-400"
              }`}
            >
              🤝 Support Only
            </button>
          </div>

          {/* Substat Dropdown */}
          <select
            value={selectedSubstat}
            onChange={(e) => setSelectedSubstat(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Substats</option>
            <option value="critRate">CRIT Rate%</option>
            <option value="critDmg">CRIT DMG%</option>
            <option value="atkPct">ATK%</option>
            <option value="energyRecharge">Energy Recharge%</option>
            <option value="em">Elemental Mastery</option>
            <option value="hpPct">HP%</option>
            <option value="defPct">DEF%</option>
            <option value="physicalDmgBonus">Physical DMG%</option>
          </select>

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

      {/* Weapons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWeapons.map((weapon) => {
          const r = getRefinement(weapon.id);
          const hasRefinements = weapon.buffs.some((b) => b.refinementValues && b.refinementValues.length === 5);

          return (
            <div
              key={weapon.id}
              id={`weapon-${weapon.id}`}
              className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <WeaponIcon weapon={weapon.type} className="w-5 h-5" />
                      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {weapon.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-bold ${
                          weapon.rarity === 5
                            ? "text-amber-500"
                            : weapon.rarity === 4
                            ? "text-purple-400"
                            : "text-blue-400"
                        }`}
                      >
                        {"★".repeat(weapon.rarity)} ({weapon.rarity}-Star)
                      </span>
                      <span className="text-xs text-gray-400 dark:text-zinc-500">•</span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                        {weapon.type}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {weapon.isSupport && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        🤝 Support
                      </span>
                    )}
                    {weapon.signatureFor && weapon.signatureFor.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 capitalize">
                        ⭐ Sig: {weapon.signatureFor[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Base Stats Row */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60 font-mono text-xs">
                  <div>
                    <span className="text-gray-400 dark:text-zinc-500 block text-[10px] uppercase font-sans font-bold">
                      Base ATK (Lv90)
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {weapon.baseAtk}
                    </span>
                    {weapon.lvl1BaseAtk && (
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 ml-1.5 font-normal">
                        (Lv1: {weapon.lvl1BaseAtk})
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-gray-400 dark:text-zinc-500 block text-[10px] uppercase font-sans font-bold">
                      Substat (Lv90)
                    </span>
                    {weapon.subStat ? (
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                        <span>{weapon.subStat.label}: </span>
                        <span>
                          {weapon.subStat.value}
                          {weapon.subStat.type !== "em" && "%"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-zinc-500 italic">None</span>
                    )}
                  </div>
                </div>

                {/* Passive Skill Details */}
                {weapon.passiveName ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        {weapon.passiveName}
                      </span>

                      {/* Interactive Refinement Selector (R1-R5) */}
                      {hasRefinements && (
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-[10px]">
                          <span className="px-1 text-gray-400 dark:text-zinc-500 font-bold">Rank:</span>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              onClick={() => setRefinement(weapon.id, level)}
                              className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                                r === level
                                  ? "bg-amber-500 text-zinc-950 font-extrabold shadow-xs"
                                  : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                              }`}
                            >
                              R{level}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                      {weapon.passiveDesc}
                    </p>

                    {/* Dynamic Refinement Buff Values Inspector */}
                    {weapon.buffs.length > 0 && (
                      <div className="mt-2 space-y-1 pt-1.5 border-t border-gray-100 dark:border-zinc-800/80">
                        {weapon.buffs.map((b) => {
                          const val = b.refinementValues ? b.refinementValues[r - 1] : b.compute ? b.compute(r, { refinement: r, baseAtk: weapon.baseAtk }) : 0;
                          return (
                            <div
                              key={b.id}
                              className="flex items-center justify-between text-[11px] font-medium bg-amber-500/5 px-2 py-1 rounded border border-amber-500/20"
                            >
                              <span className="text-gray-700 dark:text-zinc-300 truncate max-w-[70%]">
                                {b.label}
                              </span>
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                                Rank {r}: +{val}
                                {b.isPercent !== false && "%"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 dark:text-zinc-500 italic pt-1">
                    No passive skill for this weapon.
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="text-[10px] text-gray-400 dark:text-zinc-500">
                  ID: <code className="font-mono">{weapon.id}</code>
                </div>

                <Link
                  href="/"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors flex items-center gap-1"
                >
                  <span>Equip in Calculator →</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWeapons.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-zinc-500 space-y-2">
          <div className="text-3xl">🔍</div>
          <div className="text-sm font-semibold">No weapons matching the active filters.</div>
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
