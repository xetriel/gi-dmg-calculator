"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CHARACTERS, SUPPORT_CONFIGS, byId as characterById } from "@/data/registry/characters";
import { WEAPONS, weaponById, type WeaponConfig } from "@/data/registry/weapons";
import { ARTIFACTS, artifactById, type ArtifactConfig } from "@/data/registry/artifacts";
import { ElementIcon, WeaponIcon } from "@/components/icons";
import { getRarityTheme } from "../calculator/rarity-theme";
import {
  getSupportEquipmentSetups,
  saveSupportEquipmentSetup,
  deleteSupportEquipmentSetup,
  getDefaultEquipmentSetup,
  resolveSupportEquipmentBuffs,
  type SupportEquipmentSetup,
  type EquippedWeaponState,
  type EquippedArtifactState,
} from "@/lib/engine/support-equipment";
import type { Element, WeaponType } from "@/data/registry/types";

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

const ALL_ELEMENTS: Element[] = ["Pyro", "Hydro", "Electro", "Cryo", "Anemo", "Geo", "Dendro"];

export function BuildsView() {
  const searchParams = useSearchParams();
  const initialCharParam = searchParams.get("character") || "xilonen";
  const fromParam = searchParams.get("from");

  const [selectedCharId, setSelectedCharId] = useState<string>(initialCharParam);
  const [elementFilter, setElementFilter] = useState<"ALL" | Element>("ALL");
  const [charSearchQuery, setCharSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Setups state for currently selected character
  const [setups, setSetups] = useState<SupportEquipmentSetup[]>([]);
  const [activeSetupId, setActiveSetupId] = useState<string>("1");

  // Active setup draft state
  const [activeWeapon, setActiveWeapon] = useState<EquippedWeaponState | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<EquippedArtifactState | null>(null);
  const [isWeaponEnabled, setIsWeaponEnabled] = useState(true);
  const [isArtifactEnabled, setIsArtifactEnabled] = useState(true);
  const [setupName, setSetupName] = useState("");

  // Selected character config
  const charCfg = useMemo(() => {
    return characterById(selectedCharId) || CHARACTERS[0];
  }, [selectedCharId]);

  const supportCfg = useMemo(() => {
    return SUPPORT_CONFIGS.find((s) => s.characterId === charCfg.id || s.id === charCfg.id);
  }, [charCfg.id]);

  const theme = getRarityTheme(charCfg.rarity);

  // Load setups when selected character changes
  useEffect(() => {
    const loaded = getSupportEquipmentSetups(charCfg.id);
    setSetups(loaded);
    setActiveSetupId(loaded[0]?.id || "1");

    const first = loaded[0] || getDefaultEquipmentSetup(charCfg.id, "1");
    setActiveWeapon(first.weapon);
    setActiveArtifact(first.artifact);
    setIsWeaponEnabled(first.weapon ? first.weapon.enabled !== false : true);
    setIsArtifactEnabled(first.artifact ? first.artifact.enabled !== false : true);
    setSetupName(first.name || `Support Setup ${first.id}`);
  }, [charCfg.id]);

  // Handle switching setup
  const handleSelectSetup = (setupId: string) => {
    setActiveSetupId(setupId);
    const target = setups.find((s) => s.id === setupId);
    if (target) {
      setActiveWeapon(target.weapon);
      setActiveArtifact(target.artifact);
      setIsWeaponEnabled(target.weapon?.enabled !== false);
      setIsArtifactEnabled(target.artifact?.enabled !== false);
      setSetupName(target.name || `Support Setup ${target.id}`);
    }
  };

  // Add a new setup
  const handleAddSetup = () => {
    const newId = String(setups.length + 1);
    const newSetup: SupportEquipmentSetup = {
      id: newId,
      name: `Support Setup ${newId}`,
      characterId: charCfg.id,
      weapon: activeWeapon ? { ...activeWeapon } : null,
      artifact: activeArtifact ? { ...activeArtifact } : null,
      updatedAt: Date.now(),
    };
    saveSupportEquipmentSetup(charCfg.id, newSetup);
    setSetups([...setups, newSetup]);
    setActiveSetupId(newId);
    setSetupName(newSetup.name);
  };

  // Delete current setup
  const handleDeleteSetup = () => {
    if (setups.length <= 1) return;
    deleteSupportEquipmentSetup(charCfg.id, activeSetupId);
    const remaining = setups.filter((s) => s.id !== activeSetupId);
    setSetups(remaining);
    const nextId = remaining[0]?.id || "1";
    setActiveSetupId(nextId);
    const nextSetup = remaining[0];
    if (nextSetup) {
      setActiveWeapon(nextSetup.weapon);
      setActiveArtifact(nextSetup.artifact);
      setIsWeaponEnabled(nextSetup.weapon?.enabled !== false);
      setIsArtifactEnabled(nextSetup.artifact?.enabled !== false);
      setSetupName(nextSetup.name);
    }
  };

  // Save current setup
  const handleSaveSetup = () => {
    const finalWeapon: EquippedWeaponState | null = activeWeapon
      ? { ...activeWeapon, enabled: isWeaponEnabled }
      : null;
    const finalArtifact: EquippedArtifactState | null = activeArtifact
      ? { ...activeArtifact, enabled: isArtifactEnabled }
      : null;

    const updatedSetup: SupportEquipmentSetup = {
      id: activeSetupId,
      name: setupName.trim() || `Support Setup ${activeSetupId}`,
      characterId: charCfg.id,
      weapon: finalWeapon,
      artifact: finalArtifact,
      updatedAt: Date.now(),
    };

    saveSupportEquipmentSetup(charCfg.id, updatedSetup);
    setSetups((prev) =>
      prev.map((s) => (s.id === activeSetupId ? updatedSetup : s))
    );

    setSaveStatus("Saved to presets!");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // Available weapons for this character (matching weapon type + supportive weapons)
  const availableWeapons = useMemo(() => {
    return WEAPONS.filter((w) => {
      if (w.type === charCfg.weapon) return true;
      if (w.isSupport) return true;
      return false;
    }).sort((a, b) => {
      if (a.isSupport && !b.isSupport) return -1;
      if (!a.isSupport && b.isSupport) return 1;
      return b.rarity - a.rarity;
    });
  }, [charCfg.weapon]);

  // Available artifacts (all artifacts, prioritizing supportive ones)
  const availableArtifacts = useMemo(() => {
    return [...ARTIFACTS].sort((a, b) => {
      if (a.isSupport && !b.isSupport) return -1;
      if (!a.isSupport && b.isSupport) return 1;
      return b.rarity - a.rarity;
    });
  }, []);

  // Filtered character list
  const filteredCharacters = useMemo(() => {
    return CHARACTERS.filter((c) => {
      if (elementFilter !== "ALL" && c.element !== elementFilter) return false;
      if (charSearchQuery.trim()) {
        const q = charSearchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [elementFilter, charSearchQuery]);

  // Selected configs
  const selectedWeaponCfg = activeWeapon ? weaponById(activeWeapon.weaponId) : null;
  const selectedArtifactCfg = activeArtifact ? artifactById(activeArtifact.artifactId) : null;

  // Live buff resolution
  const resolvedBuffs = useMemo(() => {
    return resolveSupportEquipmentBuffs({
      supportCharacterId: charCfg.id,
      weaponState: activeWeapon && isWeaponEnabled ? { ...activeWeapon, enabled: true } : null,
      artifactState: activeArtifact && isArtifactEnabled ? { ...activeArtifact, enabled: true } : null,
      activeCharElement: charCfg.element,
      activeCharWeapon: charCfg.weapon,
      activeCharBaseAtk: 1000,
      activeCharBaseDef: 800,
      activeCharBaseHp: 15000,
    });
  }, [charCfg, activeWeapon, isWeaponEnabled, activeArtifact, isArtifactEnabled]);

  const fromChar = fromParam ? characterById(fromParam) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Top Navigation Banner if redirected from a parent calculator */}
      {fromChar && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              Configuring equipment for <strong>{charCfg.name}</strong> as support for <strong>{fromChar.name}</strong>.
            </span>
          </div>
          <Link
            href={`/characters/${fromChar.id}`}
            className="text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/80 hover:bg-amber-300/60 dark:hover:bg-amber-800 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 transition-colors flex items-center gap-1"
          >
            <span>← Back to {fromChar.name} Calculator</span>
          </Link>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Character Equipment &amp; Builds Focus
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Weapon &amp; Artifact Sets
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            Configure character weapon passives and 2-Piece / 4-Piece artifact set team buffs. Presets are saved per character and instantly loaded whenever used in the Damage Calculator.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {saveStatus && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
              ✓ {saveStatus}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveSetup}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-1.5 ${theme.addButton}`}
          >
            <span>💾</span>
            <span>Save Settings</span>
          </button>
          <Link
            href={`/characters/${charCfg.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
          >
            <span>⚡ Open in Calculator</span>
          </Link>
        </div>
      </div>

      {/* Character Selector Toolbar */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 whitespace-nowrap">
              Active Character:
            </span>
            <select
              value={selectedCharId}
              onChange={(e) => setSelectedCharId(e.target.value)}
              className="text-xs font-bold p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 min-w-[200px]"
            >
              {CHARACTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.element}, {c.rarity}★)
                </option>
              ))}
            </select>
          </div>

          {/* Search character */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={charSearchQuery}
              onChange={(e) => setCharSearchQuery(e.target.value)}
              placeholder="Search characters..."
              className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Element Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-gray-150 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 mr-1">
            Element:
          </span>
          <button
            onClick={() => setElementFilter("ALL")}
            className={`px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer border ${
              elementFilter === "ALL"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent"
                : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700"
            }`}
          >
            All
          </button>
          {ALL_ELEMENTS.map((elem) => (
            <button
              key={elem}
              onClick={() => setElementFilter(elem)}
              className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer border flex items-center gap-1 ${
                elementFilter === elem
                  ? "bg-amber-500 text-zinc-950 font-bold border-amber-600 shadow-2xs"
                  : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-amber-400"
              }`}
            >
              <ElementIcon element={elem} className="w-3 h-3" />
              <span>{elem}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Setup Manager & Preset Tabs */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/40 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-600 dark:text-zinc-400">Setups:</span>
          {setups.map((s) => {
            const isSelected = activeSetupId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSetup(s.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? theme.activeButton
                    : `bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 ${theme.buttonHover}`
                }`}
              >
                {s.name || `Setup ${s.id}`}
              </button>
            );
          })}

          <button
            onClick={handleAddSetup}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-colors cursor-pointer"
          >
            + New Setup
          </button>

          {setups.length > 1 && (
            <button
              onClick={handleDeleteSetup}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title="Delete this setup preset"
            >
              Delete Setup
            </button>
          )}
        </div>

        {/* Rename Setup Input */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Name:</span>
          <input
            type="text"
            value={setupName}
            onChange={(e) => setSetupName(e.target.value)}
            className="text-xs font-semibold p-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white w-48"
            placeholder="Setup name..."
          />
        </div>
      </div>

      {/* Main Workbench Grid (Left: Weapon & Artifact Selectors, Right: Buffs Breakdown & Support Scaling) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Weapon & Artifact Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* WEAPON SELECTION WORKBENCH */}
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚔️</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Weapon Equipment
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    {charCfg.weapon} class weapons or supportive weapons across all classes
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isWeaponEnabled}
                  onChange={(e) => setIsWeaponEnabled(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 cursor-pointer"
                />
                <span>Enable Weapon</span>
              </label>
            </div>

            {/* Weapon Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400 block mb-1">
                Choose Weapon:
              </label>
              <select
                value={activeWeapon?.weaponId || ""}
                onChange={(e) => {
                  const wId = e.target.value;
                  if (!wId) {
                    setActiveWeapon(null);
                  } else {
                    setActiveWeapon({
                      weaponId: wId,
                      refinement: activeWeapon?.refinement || 1,
                      inputs: {},
                      enabled: true,
                    });
                  }
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">(None - Unequipped)</option>
                {availableWeapons.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.type}, {w.rarity}★){w.isSupport ? " [Team Support]" : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedWeaponCfg && (
              <div className="space-y-4 pt-1">
                {/* Refinement Level Buttons */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400 block mb-1.5">
                    Refinement Level (R1–R5):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((r) => {
                      const isRefActive = (activeWeapon?.refinement || 1) === r;
                      return (
                        <button
                          key={r}
                          onClick={() =>
                            setActiveWeapon((prev) =>
                              prev ? { ...prev, refinement: r } : null
                            )
                          }
                          className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isRefActive
                              ? theme.activeButton
                              : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                          }`}
                        >
                          R{r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Passive Details */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-1">
                  <div className="font-bold text-xs text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{selectedWeaponCfg.passiveName}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getRarityTheme(selectedWeaponCfg.rarity).badge}`}>
                      {"★".repeat(selectedWeaponCfg.rarity)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                    {selectedWeaponCfg.passiveDesc}
                  </p>
                </div>

                {/* Passive Mechanic Controls */}
                {(selectedWeaponCfg.mechanicDefs ?? []).length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-150 dark:border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block">
                      Weapon Passive Conditions
                    </span>
                    {selectedWeaponCfg.mechanicDefs?.map((m) => {
                      const val = activeWeapon?.inputs?.[m.id] ?? m.defaultValue ?? 0;
                      const isChecked = val === "1" || Number(val) > 0;
                      return (
                        <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setActiveWeapon((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      inputs: {
                                        ...(prev.inputs ?? {}),
                                        [m.id]: e.target.checked ? "1" : "0",
                                      },
                                    }
                                  : null
                              )
                            }
                            className="h-4 w-4 accent-amber-500 cursor-pointer"
                          />
                          <span className="text-gray-700 dark:text-zinc-300 font-medium">
                            {m.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ARTIFACT SET WORKBENCH */}
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🏺</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Artifact Set Equipment
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    Focuses on 2-Piece and 4-Piece set bonuses (individual piece stats are not simulated)
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isArtifactEnabled}
                  onChange={(e) => setIsArtifactEnabled(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 cursor-pointer"
                />
                <span>Enable Artifact</span>
              </label>
            </div>

            {/* Artifact Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400 block mb-1">
                Choose Artifact Set:
              </label>
              <select
                value={activeArtifact?.artifactId || ""}
                onChange={(e) => {
                  const aId = e.target.value;
                  if (!aId) {
                    setActiveArtifact(null);
                  } else {
                    setActiveArtifact({
                      artifactId: aId,
                      pieceCount: activeArtifact?.pieceCount || 4,
                      inputs: {},
                      enabled: true,
                    });
                  }
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">(None - Unequipped)</option>
                {availableArtifacts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.rarity}★){a.isSupport ? " [Party Support]" : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedArtifactCfg && (
              <div className="space-y-4 pt-1">
                {/* 2-Piece vs 4-Piece Toggle */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400 block mb-1.5">
                    Piece Requirement:
                  </label>
                  <div className="flex items-center gap-2">
                    {([2, 4] as const).map((pc) => {
                      const isPcActive = (activeArtifact?.pieceCount || 4) === pc;
                      return (
                        <button
                          key={pc}
                          onClick={() =>
                            setActiveArtifact((prev) =>
                              prev ? { ...prev, pieceCount: pc } : null
                            )
                          }
                          className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isPcActive
                              ? theme.activeButton
                              : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                          }`}
                        >
                          {pc}-Piece Set
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Set Bonus Descriptions */}
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">
                      2-Piece Bonus:
                    </span>
                    <span className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                      {selectedArtifactCfg.twoPieceDesc}
                    </span>
                  </div>

                  {(activeArtifact?.pieceCount || 4) >= 4 && (
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">
                        4-Piece Bonus:
                      </span>
                      <span className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                        {selectedArtifactCfg.fourPieceDesc}
                      </span>
                    </div>
                  )}
                </div>

                {/* Artifact Mechanic Controls */}
                {(selectedArtifactCfg.mechanicDefs ?? []).length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-150 dark:border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block">
                      Artifact Passive Conditions
                    </span>
                    <div className={(selectedArtifactCfg.mechanicDefs ?? []).length > 4 ? "grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1" : "space-y-2"}>
                      {selectedArtifactCfg.mechanicDefs?.map((m) => {
                        const val = activeArtifact?.inputs?.[m.id] ?? m.defaultValue ?? 0;
                        const isChecked = val === "1" || Number(val) > 0;
                        return (
                          <label key={m.id} className="flex items-start gap-2 text-xs cursor-pointer p-1 rounded-md hover:bg-gray-100/50 dark:hover:bg-zinc-800/40">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                setActiveArtifact((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        inputs: {
                                          ...(prev.inputs ?? {}),
                                          [m.id]: e.target.checked ? "1" : "0",
                                        },
                                      }
                                    : null
                                )
                              }
                              className="h-4 w-4 accent-amber-500 cursor-pointer mt-0.5"
                            />
                            <span className="text-gray-700 dark:text-zinc-300 font-medium">
                              {m.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (5 cols): Live Buff Overview & Support Scaling */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Party Teammate Buffs Card */}
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>👥</span>
                <span>Buffs Provided to Party Teammates</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                {resolvedBuffs.partySources.length} Buffs
              </span>
            </div>

            {resolvedBuffs.partySources.length === 0 ? (
              <div className="text-xs text-gray-400 dark:text-zinc-500 italic p-4 text-center bg-white/60 dark:bg-zinc-900/60 rounded-xl">
                No party buffs currently provided by this setup. Equip a supportive weapon or artifact set.
              </div>
            ) : (
              <div className="space-y-2">
                {resolvedBuffs.partySources.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/20 shadow-2xs text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 dark:text-zinc-100 truncate">
                        {s.label}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                        {s.explainer}
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 text-sm">
                      +{fmt(s.value)}{s.isPercent ? "%" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Self Wielder Buffs Card */}
          <div className="p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <span>👤</span>
                <span>{charCfg.name}&apos;s Self Stat Bonuses</span>
              </span>
              <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20 font-mono">
                {resolvedBuffs.selfSources.length} Buffs
              </span>
            </div>

            {resolvedBuffs.selfSources.length === 0 ? (
              <div className="text-xs text-gray-400 dark:text-zinc-500 italic p-4 text-center bg-white/60 dark:bg-zinc-900/60 rounded-xl">
                No self stat bonuses applied.
              </div>
            ) : (
              <div className="space-y-2">
                {resolvedBuffs.selfSources.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-sky-500/20 shadow-2xs text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 dark:text-zinc-100 truncate">
                        {s.label}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                        {s.explainer}
                      </div>
                    </div>
                    <span className="font-bold text-sky-600 dark:text-sky-400 shrink-0">
                      +{fmt(s.value)}{s.isPercent ? "%" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Support Scaling Explainer */}
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span>💡</span>
              <span>Active Support Scaling Explainer</span>
            </div>

            {resolvedBuffs.scalingExplainers.length === 0 ? (
              <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                When equipped by {charCfg.name}, party buff provisions adapt to their element ({charCfg.element}) and supportive attributes.
              </p>
            ) : (
              <div className="space-y-2.5">
                {resolvedBuffs.scalingExplainers.map((expl, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-gray-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-amber-500/15 leading-relaxed"
                  >
                    {expl}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
