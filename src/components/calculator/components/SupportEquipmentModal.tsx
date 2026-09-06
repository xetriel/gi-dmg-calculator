"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { WEAPONS, weaponById, type WeaponConfig } from "@/data/registry/weapons";
import { ARTIFACTS, artifactById, type ArtifactConfig } from "@/data/registry/artifacts";
import { supportById, byId as characterById } from "@/data/registry/characters";
import { ElementIcon, WeaponIcon } from "@/components/icons";
import { getRarityTheme } from "../rarity-theme";
import {
  getSupportEquipmentSetups,
  saveSupportEquipmentSetup,
  getDefaultEquipmentSetup,
  resolveSupportEquipmentBuffs,
  type SupportEquipmentSetup,
  type EquippedWeaponState,
  type EquippedArtifactState,
} from "@/lib/engine/support-equipment";
import { resolveSupportCtx } from "@/lib/engine/team-buffs";

interface SupportEquipmentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  supportId: string; // e.g. "xilonen" or "xilonen-support"
  activeDpsCharacterId: string; // foreign parent DPS character ID
  currentWeapon?: EquippedWeaponState | null;
  currentArtifact?: EquippedArtifactState | null;
  equipmentSetupId?: string;
  supportStats?: Record<string, string>;
  constellationLevel?: number;
  mechanicInputs?: Record<string, string>;
  onSave: (setup: {
    equipmentSetupId: string;
    weapon: EquippedWeaponState | null;
    artifact: EquippedArtifactState | null;
  }) => void;
}

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

export const SupportEquipmentModal: React.FC<SupportEquipmentModalProps> = ({
  isOpen,
  setIsOpen,
  supportId,
  activeDpsCharacterId,
  currentWeapon,
  currentArtifact,
  equipmentSetupId,
  supportStats,
  constellationLevel = 0,
  mechanicInputs = {},
  onSave,
}) => {
  const normSupportId = supportId.replace(/-support$/, "");
  const supportCfg = supportById(normSupportId) || supportById(`${normSupportId}-support`);
  const charCfg = characterById(normSupportId);
  const dpsCfg = characterById(activeDpsCharacterId);

  const supportName = supportCfg?.name ?? charCfg?.name ?? normSupportId;
  const supportElement = supportCfg?.element ?? charCfg?.element ?? "Geo";
  const supportWeaponType = supportCfg?.weapon ?? charCfg?.weapon ?? "Sword";
  const supportRarity = supportCfg?.rarity ?? charCfg?.rarity ?? 5;
  const theme = getRarityTheme(supportRarity);

  // Setups state
  const [setups, setSetups] = useState<SupportEquipmentSetup[]>([]);
  const [activeSetupId, setActiveSetupId] = useState<string>("1");

  // Active setup draft state
  const [activeWeapon, setActiveWeapon] = useState<EquippedWeaponState | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<EquippedArtifactState | null>(null);
  const [isWeaponEnabled, setIsWeaponEnabled] = useState(true);
  const [isArtifactEnabled, setIsArtifactEnabled] = useState(true);

  // Load setups when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const loaded = getSupportEquipmentSetups(normSupportId);
    setSetups(loaded);

    const initialSetupId = equipmentSetupId || loaded[0]?.id || "1";
    setActiveSetupId(initialSetupId);

    const found = loaded.find((s) => s.id === initialSetupId) || loaded[0];
    if (found) {
      setActiveWeapon(currentWeapon ?? found.weapon);
      setActiveArtifact(currentArtifact ?? found.artifact);
      setIsWeaponEnabled(currentWeapon ? currentWeapon.enabled !== false : found.weapon ? found.weapon.enabled !== false : true);
      setIsArtifactEnabled(currentArtifact ? currentArtifact.enabled !== false : found.artifact ? found.artifact.enabled !== false : true);
    } else {
      const def = getDefaultEquipmentSetup(normSupportId, "1");
      setActiveWeapon(currentWeapon ?? def.weapon);
      setActiveArtifact(currentArtifact ?? def.artifact);
    }
  }, [isOpen, normSupportId, equipmentSetupId, currentWeapon, currentArtifact]);

  // Filter available weapons (matching character weapon type + supportive weapons across all classes)
  const availableWeapons = useMemo(() => {
    return WEAPONS.filter((w) => {
      if (w.type === supportWeaponType) return true;
      if (w.isSupport) return true;
      return false;
    }).sort((a, b) => {
      // Prioritize support weapons & 5-stars
      if (a.isSupport && !b.isSupport) return -1;
      if (!a.isSupport && b.isSupport) return 1;
      return b.rarity - a.rarity;
    });
  }, [supportWeaponType]);

  // Filter available artifacts (all artifacts, prioritizing supportive ones)
  const availableArtifacts = useMemo(() => {
    return [...ARTIFACTS].sort((a, b) => {
      if (a.isSupport && !b.isSupport) return -1;
      if (!a.isSupport && b.isSupport) return 1;
      return b.rarity - a.rarity;
    });
  }, []);

  // Compute live equipment preview
  const resolvedPreview = useMemo(() => {
    const mockCtx = resolveSupportCtx({
      supportId: normSupportId,
      stats: supportStats ?? {},
      mechanicInputs,
      constellationLevel,
      enabled: true,
    });

    const wState: EquippedWeaponState | null =
      activeWeapon && isWeaponEnabled
        ? { ...activeWeapon, enabled: true }
        : null;

    const aState: EquippedArtifactState | null =
      activeArtifact && isArtifactEnabled
        ? { ...activeArtifact, enabled: true }
        : null;

    return resolveSupportEquipmentBuffs({
      supportCharacterId: normSupportId,
      supportCtx: mockCtx,
      weaponState: wState,
      artifactState: aState,
      activeCharElement: dpsCfg?.element,
      activeCharWeapon: dpsCfg?.weapon,
      activeCharBaseAtk: 1000,
      activeCharBaseDef: 800,
      activeCharBaseHp: 15000,
    });
  }, [normSupportId, supportStats, mechanicInputs, constellationLevel, activeWeapon, isWeaponEnabled, activeArtifact, isArtifactEnabled, dpsCfg]);

  if (!isOpen) return null;

  const handleSelectSetup = (setupId: string) => {
    setActiveSetupId(setupId);
    const target = setups.find((s) => s.id === setupId);
    if (target) {
      setActiveWeapon(target.weapon);
      setActiveArtifact(target.artifact);
      setIsWeaponEnabled(target.weapon?.enabled !== false);
      setIsArtifactEnabled(target.artifact?.enabled !== false);
    }
  };

  const handleAddSetup = () => {
    const newId = String(setups.length + 1);
    const newSetup: SupportEquipmentSetup = {
      id: newId,
      name: `Support Setup ${newId}`,
      characterId: normSupportId,
      weapon: activeWeapon ? { ...activeWeapon } : null,
      artifact: activeArtifact ? { ...activeArtifact } : null,
      updatedAt: Date.now(),
    };
    saveSupportEquipmentSetup(normSupportId, newSetup);
    setSetups([...setups, newSetup]);
    setActiveSetupId(newId);
  };

  const handleApplyAndSave = () => {
    const finalWeapon: EquippedWeaponState | null = activeWeapon
      ? { ...activeWeapon, enabled: isWeaponEnabled }
      : null;
    const finalArtifact: EquippedArtifactState | null = activeArtifact
      ? { ...activeArtifact, enabled: isArtifactEnabled }
      : null;

    const currentSetup = setups.find((s) => s.id === activeSetupId);
    const updatedSetup: SupportEquipmentSetup = {
      id: activeSetupId,
      name: currentSetup?.name || `Support Setup ${activeSetupId}`,
      characterId: normSupportId,
      weapon: finalWeapon,
      artifact: finalArtifact,
      updatedAt: Date.now(),
    };

    saveSupportEquipmentSetup(normSupportId, updatedSetup);
    onSave({
      equipmentSetupId: activeSetupId,
      weapon: finalWeapon,
      artifact: finalArtifact,
    });
    setIsOpen(false);
  };

  const selectedWeaponCfg = activeWeapon ? weaponById(activeWeapon.weaponId) : null;
  const selectedArtifactCfg = activeArtifact ? artifactById(activeArtifact.artifactId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl h-[92vh] max-h-[860px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-lg">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {supportName}&apos;s Equipment &amp; Team Buffs
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${theme.badge}`}>
                  {"★".repeat(supportRarity)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                  <ElementIcon element={supportElement} className="w-3 h-3" />
                  {supportElement}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                  <WeaponIcon weapon={supportWeaponType} className="w-3 h-3" />
                  {supportWeaponType}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Equip a weapon and 2-Piece / 4-Piece artifact set. Team buffs scale off {supportName} and apply to {dpsCfg?.name || "the active character"}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/builds?character=${normSupportId}&from=${activeDpsCharacterId}`}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors font-semibold flex items-center gap-1"
              title="Open full dedicated Builds page"
            >
              <span>Builds Tab</span>
              <span>↗</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-lg p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Setup Switcher Tabs */}
        <div className="px-6 py-2.5 bg-zinc-100/60 dark:bg-zinc-900/40 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Equipment Setup:</span>
            {setups.map((s) => {
              const isSelected = activeSetupId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSetup(s.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
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
              title="Add a new equipment setup preset"
            >
              + New Setup
            </button>
          </div>

          <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
            Presets automatically save and reload when {supportName} is used in other teams.
          </div>
        </div>

        {/* Main Body: 2 Columns (Left: Equipment Selectors, Right: Buffs & Scaling Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Left Column (7 cols): Weapon & Artifact Selection */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. WEAPON EQUIPMENT CARD */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚔️</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Equipped Weapon
                  </span>
                  {selectedWeaponCfg && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getRarityTheme(selectedWeaponCfg.rarity).badge}`}>
                      {"★".repeat(selectedWeaponCfg.rarity)}
                    </span>
                  )}
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
                <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 block mb-1">
                  Select Weapon:
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
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">(None - Unequipped)</option>
                  {availableWeapons.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.type}, {w.rarity}★){w.isSupport ? " [Party Support]" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selectedWeaponCfg && (
                <div className="space-y-3 pt-1">
                  {/* Refinement Buttons R1–R5 */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 block mb-1.5">
                      Refinement:
                    </label>
                    <div className="flex items-center gap-1.5">
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
                            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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

                  {/* Weapon Passive Description */}
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 text-xs">
                    <div className="font-bold text-gray-800 dark:text-zinc-200 mb-0.5">
                      {selectedWeaponCfg.passiveName}
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                      {selectedWeaponCfg.passiveDesc}
                    </p>
                  </div>

                  {/* Weapon Mechanic Inputs (Toggles/Sliders) */}
                  {(selectedWeaponCfg.mechanicDefs ?? []).length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-gray-150 dark:border-zinc-800">
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

            {/* 2. ARTIFACT EQUIPMENT CARD */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏺</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Equipped Artifact Set
                  </span>
                  {selectedArtifactCfg && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getRarityTheme(selectedArtifactCfg.rarity).badge}`}>
                      {"★".repeat(selectedArtifactCfg.rarity)}
                    </span>
                  )}
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
                <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 block mb-1">
                  Select Artifact Set:
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
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                <div className="space-y-3 pt-1">
                  {/* 2-Piece vs 4-Piece Selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 block mb-1.5">
                      Set Bonus Piece Count:
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
                            className={`px-3.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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

                  {/* Artifact Set Descriptions */}
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 text-[11px]">
                      <span className="font-bold text-amber-600 dark:text-amber-400 mr-1.5">
                        2-Piece Bonus:
                      </span>
                      <span className="text-gray-700 dark:text-zinc-300">
                        {selectedArtifactCfg.twoPieceDesc}
                      </span>
                    </div>

                    {(activeArtifact?.pieceCount || 4) >= 4 && (
                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 text-[11px]">
                        <span className="font-bold text-amber-600 dark:text-amber-400 mr-1.5">
                          4-Piece Bonus:
                        </span>
                        <span className="text-gray-700 dark:text-zinc-300">
                          {selectedArtifactCfg.fourPieceDesc}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Artifact Mechanic Inputs */}
                  {(selectedArtifactCfg.mechanicDefs ?? []).length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-gray-150 dark:border-zinc-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block">
                        Artifact Passive Conditions
                      </span>
                      {selectedArtifactCfg.mechanicDefs?.map((m) => {
                        const val = activeArtifact?.inputs?.[m.id] ?? m.defaultValue ?? 0;
                        const isChecked = val === "1" || Number(val) > 0;
                        return (
                          <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer">
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

          </div>

          {/* Right Column (5 cols): Live Buff Breakdown & Scaling Explainer */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Provided Party Buffs (Granted to Active DPS) */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-emerald-500/5 dark:bg-emerald-950/10 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>👥</span>
                  <span>Party Teammate Buffs</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {resolvedPreview.partySources.length} Active
                </span>
              </div>

              {resolvedPreview.partySources.length === 0 ? (
                <div className="text-xs text-gray-400 dark:text-zinc-500 italic p-3 text-center bg-white/50 dark:bg-zinc-900/50 rounded-lg">
                  No party buffs currently provided by this equipment combination.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {resolvedPreview.partySources.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-500/20 text-xs"
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

            {/* Self Buffs (Granted to Support Wielder) */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-sky-500/5 dark:bg-sky-950/10 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <span>👤</span>
                  <span>{supportName}&apos;s Self Stats</span>
                </span>
                <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  {resolvedPreview.selfSources.length} Active
                </span>
              </div>

              {resolvedPreview.selfSources.length === 0 ? (
                <div className="text-xs text-gray-400 dark:text-zinc-500 italic p-3 text-center bg-white/50 dark:bg-zinc-900/50 rounded-lg">
                  No self stat bonuses applied.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {resolvedPreview.selfSources.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-sky-500/20 text-xs"
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

            {/* Support Scaling Explainer */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 shadow-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>Active Support Scaling Explainer</span>
              </div>

              {resolvedPreview.scalingExplainers.length === 0 ? (
                <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                  Buffs provided by this weapon and artifact will scale off {supportName}&apos;s element ({supportElement}) and attributes.
                </p>
              ) : (
                <div className="space-y-2">
                  {resolvedPreview.scalingExplainers.map((expl, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] text-gray-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-amber-500/15 leading-relaxed"
                    >
                      {expl}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/60 shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyAndSave}
            className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md ${theme.addButton}`}
          >
            ✓ Save &amp; Equip to {supportName}
          </button>
        </div>

      </div>
    </div>
  );
};
