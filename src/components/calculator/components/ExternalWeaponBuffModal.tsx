"use client";
import React, { useState, useMemo } from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { WeaponType } from "@/data/registry/weapons/types";
import type { CalcInstance, ExternalWeaponInstance } from "../types";
import { WEAPONS, weaponById, getWeaponsForCharacter } from "@/data/registry/weapons";
import { resolveExternalWeaponBuffs } from "@/lib/engine/weapon-buffs";
import { toNum } from "@/lib/engine/validation";
import { WeaponIcon } from "@/components/icons";
import { getRarityTheme } from "../rarity-theme";

interface ExternalWeaponBuffModalProps {
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



export const MAX_EXTERNAL_WEAPONS = 4;

export const ExternalWeaponBuffModal: React.FC<ExternalWeaponBuffModalProps> = ({
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
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | WeaponType>("ALL");
  const [rarityFilter, setRarityFilter] = useState<number | "ALL">("ALL");

  if (!isOpen) return null;

  const currentInst = instances.find((i) => i.id === activeInstanceId) || instances[0];
  if (!currentInst) return null;

  const weapons = currentInst.externalWeapons ?? [];
  const masterEnabled = currentInst.externalWeaponBuffsEnabled !== false;
  const baseAtk = toNum(currentInst.stats["atk.base"]) ?? 0;

  // Max external weapons limit reached check
  const isMaxReached = weapons.length >= MAX_EXTERNAL_WEAPONS;

  // Compute live total weapon buff results
  const totalResult = resolveExternalWeaponBuffs(weapons, baseAtk, config, masterEnabled);

  // Set of already added weapon IDs for the active setup
  const addedWeaponIds = new Set(weapons.map((w) => w.weaponId));

  // Available weapons for this character (all matching weapon type + all supportive weapons)
  const availableForChar = getWeaponsForCharacter(config, WEAPONS);

  // Filter catalog of weapons
  const filteredCatalog = availableForChar.filter((w) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = w.name.toLowerCase().includes(q);
      const matchPassive = w.passiveName.toLowerCase().includes(q);
      const matchDesc = w.passiveDesc.toLowerCase().includes(q);
      const matchType = w.type.toLowerCase().includes(q);
      if (!matchName && !matchPassive && !matchDesc && !matchType) return false;
    }

    // Scope filter
    if (scopeFilter === "support" && !w.isSupport) return false;
    if (scopeFilter === "wielder" && w.type !== config.weapon) return false;

    // Category filter
    if (categoryFilter !== "ALL" && w.type !== categoryFilter) return false;

    // Rarity filter
    if (rarityFilter !== "ALL" && w.rarity !== rarityFilter) return false;

    return true;
  });

  const addWeapon = (weaponId: string) => {
    if (isMaxReached) return;

    const wConfig = weaponById(weaponId);
    if (!wConfig) return;

    const initInputs: Record<string, string> = {};
    for (const m of wConfig.mechanicDefs ?? []) {
      initInputs[m.id] = String(m.defaultValue ?? 0);
    }

    const newInst: ExternalWeaponInstance = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      weaponId,
      refinement: 1,
      enabled: true,
      inputs: initInputs,
    };

    updateInstance(currentInst.id, () => ({
      externalWeapons: [...weapons, newInst],
    }));
  };

  const removeWeapon = (index: number) => {
    updateInstance(currentInst.id, () => ({
      externalWeapons: weapons.filter((_, i) => i !== index),
    }));
  };

  const updateWeapon = (
    index: number,
    updater: (w: ExternalWeaponInstance) => Partial<ExternalWeaponInstance>
  ) => {
    const updated = [...weapons];
    updated[index] = { ...updated[index], ...updater(updated[index]) };
    updateInstance(currentInst.id, () => ({ externalWeapons: updated }));
  };

  const toggleMaster = () => {
    updateInstance(currentInst.id, () => ({ externalWeaponBuffsEnabled: !masterEnabled }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-6xl h-[90vh] max-h-[850px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-150 dark:border-zinc-850 shrink-0 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              <WeaponIcon weapon={config.weapon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  External Weapon Buffs
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  {weapons.filter((w) => w.enabled).length}/{weapons.length} Active (Max {MAX_EXTERNAL_WEAPONS})
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Configure party support weapons or wielder weapons applied to {config.name} (Max {MAX_EXTERNAL_WEAPONS} weapons per team)
              </p>
            </div>
          </div>

          {/* Setup Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-200/60 dark:bg-zinc-800/60 p-1 rounded-xl border border-gray-300/40 dark:border-zinc-700/40">
            {instances.map((inst, idx) => {
              const activeCount = (inst.externalWeapons ?? []).filter((w) => w.enabled).length;
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
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold">
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
          
          {/* LEFT PANE: Weapon Catalog & Filtering (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-gray-50/30 dark:bg-zinc-900/20">
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 space-y-2.5 shrink-0">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search weapon name, passive, effect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
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
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                  }`}
                >
                  All Available ({availableForChar.length})
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
                  <span>⚔️ {config.weapon}s Only</span>
                </button>
              </div>

              {/* Weapon Category Filters */}
              <div className="flex items-center gap-1 flex-wrap">
                {(["ALL", "Sword", "Claymore", "Polearm", "Bow", "Catalyst"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer border ${
                      categoryFilter === cat
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-2xs"
                        : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Rarity Filter */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-zinc-400">
                <span className="font-semibold">Rarity:</span>
                {(["ALL", 5, 4, 3] as const).map((r) => {
                  const isSelected = rarityFilter === r;
                  const activeClass =
                    r === "ALL"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-2xs"
                      : r === 5
                      ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                      : r === 4
                      ? "bg-purple-600 text-white border-purple-700 shadow-2xs"
                      : "bg-sky-600 text-white border-sky-700 shadow-2xs";

                  const hoverClass =
                    r === "ALL"
                      ? "hover:border-gray-400"
                      : r === 5
                      ? "hover:border-amber-400"
                      : r === 4
                      ? "hover:border-purple-400"
                      : "hover:border-sky-400";

                  return (
                    <button
                      key={r}
                      onClick={() => setRarityFilter(r)}
                      className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? activeClass
                          : `bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 ${hoverClass}`
                      }`}
                    >
                      {r === "ALL" ? "All" : `${r}★`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Weapon Catalog List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredCatalog.map((w) => {
                const isAdded = addedWeaponIds.has(w.id);
                const isMatchingClass = w.type === config.weapon;
                const theme = getRarityTheme(w.rarity);

                return (
                  <div
                    key={w.id}
                    className={`rounded-xl border p-3 transition-all duration-150 flex flex-col justify-between gap-2 ${
                      isAdded
                        ? `${theme.catalogAddedBg} opacity-70`
                        : `border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 ${theme.catalogBorderHover} hover:shadow-xs`
                    }`}
                  >
                    <div>
                      {/* Title & Badges */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <WeaponIcon weapon={w.type} className="w-4 h-4" />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {w.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${theme.badge}`}>
                            {"★".repeat(w.rarity)}
                          </span>
                          {w.isSupport && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
                              Party Support
                            </span>
                          )}
                          {isMatchingClass && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-700">
                              {w.type} (Wielder)
                            </span>
                          )}
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => addWeapon(w.id)}
                          disabled={isAdded || isMaxReached}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                            isAdded
                              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                              : isMaxReached
                              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                              : `${theme.addButton} shadow-xs cursor-pointer`
                          }`}
                          title={isMaxReached && !isAdded ? `Maximum of ${MAX_EXTERNAL_WEAPONS} weapons reached` : undefined}
                        >
                          {isAdded ? "Added ✓" : isMaxReached ? `Max ${MAX_EXTERNAL_WEAPONS}` : "+ Add"}
                        </button>
                      </div>

                      {/* Passive details */}
                      {w.passiveName && (
                        <div className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          <span className="font-semibold text-gray-700 dark:text-zinc-300">{w.passiveName}:</span> {w.passiveDesc}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400 dark:text-zinc-600 italic">
                  No weapons found matching the selected filters.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Configured External Weapons for Setup (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-white dark:bg-zinc-950">
            {/* Right Pane Header */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/30 dark:bg-zinc-900/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Configured Weapons for Setup {instances.findIndex((i) => i.id === currentInst.id) + 1}
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  ({weapons.length}/{MAX_EXTERNAL_WEAPONS})
                </span>
              </div>

              {/* Master Enable Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300">
                  Apply All Buffs
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                  checked={masterEnabled}
                  onChange={toggleMaster}
                />
              </label>
            </div>

            {/* Configured Weapons Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
              {weapons.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-zinc-500">
                  <span className="text-4xl mb-3">⚔️</span>
                  <p className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    No External Weapons Configured
                  </p>
                  <p className="text-xs max-w-sm">
                    Select supportive weapons (e.g. *Freedom-Sworn*, *Key of Khaj-Nisut*, *Athame Artis*) or wielder weapons from the catalog on the left to add their team buffs (max {MAX_EXTERNAL_WEAPONS} per team).
                  </p>
                </div>
              )}

              {weapons.map((wInst, index) => {
                const wConfig = weaponById(wInst.weaponId);
                if (!wConfig) return null;
                const isActive = masterEnabled && wInst.enabled;

                // Compute individual preview for this weapon
                const singleResult = resolveExternalWeaponBuffs(
                  [{ ...wInst, enabled: true }],
                  baseAtk,
                  config,
                  true
                );

                const isMatchingClass = wConfig.type === config.weapon;
                const theme = getRarityTheme(wConfig.rarity);

                return (
                  <div
                    key={wInst.id || `${wInst.weaponId}-${index}`}
                    className={`rounded-2xl border p-4 transition-all duration-200 shadow-xs ${
                      isActive
                        ? theme.cardBorderActive
                        : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 opacity-60"
                    }`}
                  >
                    {/* Weapon Card Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="checkbox"
                          className={`h-4 w-4 ${theme.checkboxAccent} cursor-pointer`}
                          checked={wInst.enabled}
                          onChange={() => updateWeapon(index, (w) => ({ enabled: !w.enabled }))}
                        />
                        <WeaponIcon weapon={wConfig.type} className="w-4 h-4" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {wConfig.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${theme.badge}`}>
                          {"★".repeat(wConfig.rarity)}
                        </span>
                        {wConfig.isSupport && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
                            Party Support
                          </span>
                        )}
                        {isMatchingClass && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-700">
                            {wConfig.type} (Wielder)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeWeapon(index)}
                        className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove weapon"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Passive Description */}
                    {wConfig.passiveDesc && (
                      <div className="text-[11px] text-gray-600 dark:text-zinc-400 mb-3 italic leading-relaxed">
                        <span className="font-semibold text-gray-800 dark:text-zinc-200">{wConfig.passiveName}:</span> {wConfig.passiveDesc}
                      </div>
                    )}

                    {/* Refinement Selector (R1 - R5) */}
                    <div className="flex items-center gap-2 mb-3 bg-white/70 dark:bg-zinc-900/70 p-2 rounded-xl border border-gray-200/80 dark:border-zinc-800/80">
                      <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">Refinement:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            onClick={() => updateWeapon(index, () => ({ refinement: r }))}
                            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                              (wInst.refinement || 1) === r
                                ? theme.activeButton
                                : `bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 ${theme.buttonHover}`
                            }`}
                          >
                            R{r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mechanic Controls (Toggles / Stacks / Sliders) */}
                    {(wConfig.mechanicDefs ?? []).length > 0 && (
                      <div className="space-y-2 mb-3 bg-gray-50/80 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-gray-200/60 dark:border-zinc-800/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1">
                          Mechanic Conditions
                        </span>
                        {(wConfig.mechanicDefs ?? []).map((m) => {
                          if (m.control === "toggle") {
                            const isChecked =
                              (wInst.inputs?.[m.id] ?? String(m.defaultValue ?? 1)) === "1" ||
                              Number(wInst.inputs?.[m.id] ?? 1) > 0;
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
                                    updateWeapon(index, (w) => ({
                                      inputs: { ...w.inputs, [m.id]: e.target.checked ? "1" : "0" },
                                    }))
                                  }
                                />
                                <span>{m.label}</span>
                              </label>
                            );
                          }

                          if (m.control === "stacks" || m.control === "percent") {
                            const val = Number(wInst.inputs?.[m.id] ?? m.defaultValue ?? 0);
                            return (
                              <div
                                key={m.id}
                                className="flex items-center justify-between gap-3 text-xs"
                                title={m.hint}
                              >
                                <span className="text-gray-700 dark:text-zinc-300 font-medium">
                                  {m.label}:
                                </span>
                                <input
                                  type="number"
                                  min={m.min ?? 0}
                                  max={m.max ?? 100000}
                                  value={val}
                                  onChange={(e) => {
                                    const numVal = Number(e.target.value);
                                    updateWeapon(index, (w) => ({
                                      inputs: { ...w.inputs, [m.id]: String(numVal) },
                                    }))
                                  }
                                  }
                                  className="w-24 px-2 py-1 text-xs text-right border rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 font-mono font-bold"
                                />
                              </div>
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
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Total External Weapon Bonuses:
                </span>
                {totalResult.sources.length > 0 ? (
                  totalResult.sources.map((s, i) => {
                    const theme = getRarityTheme(s.rarity);
                    return (
                      <span
                        key={i}
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                          masterEnabled
                            ? theme.sourceBuffPill
                            : "bg-gray-200 dark:bg-zinc-800 text-gray-400 line-through border-transparent"
                        }`}
                      >
                        {s.label}: +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                          ? fmt(s.value)
                          : `${fmt(s.value)}%`}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-400 dark:text-zinc-500 italic">
                    None active
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm transition-all cursor-pointer"
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
