"use client";
import React, { useState } from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance, ExternalWeaponInstance } from "../types";
import { WEAPONS, weaponById, getWeaponsForCharacter } from "@/data/registry/weapons";
import { resolveExternalWeaponBuffs } from "@/lib/engine/weapon-buffs";
import { toNum } from "@/lib/engine/validation";
import { WeaponIcon } from "@/components/icons";

interface ExternalWeaponBuffPanelProps {
  config: CharacterConfig;
  inst: CalcInstance;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
}

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

const RARITY_COLORS: Record<number, string> = {
  5: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  4: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  3: "text-sky-500 bg-sky-500/10 border-sky-500/30",
  2: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  1: "text-zinc-500 bg-zinc-500/10 border-zinc-500/30",
};

export const ExternalWeaponBuffPanel: React.FC<ExternalWeaponBuffPanelProps> = ({
  config,
  inst,
  updateInstance,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const weapons = inst.externalWeapons ?? [];
  const masterEnabled = inst.externalWeaponBuffsEnabled !== false;
  const baseAtk = toNum(inst.stats["atk.base"]) ?? 0;

  // Compute live preview of all weapon buffs
  const weaponResult = resolveExternalWeaponBuffs(weapons, baseAtk, config, masterEnabled);

  // Filter available weapons for this character
  const availableWeapons = getWeaponsForCharacter(config, WEAPONS);
  const addedWeaponIds = new Set(weapons.map(w => w.weaponId));
  const selectableWeapons = availableWeapons.filter(w => !addedWeaponIds.has(w.id));

  const addWeapon = (weaponId: string) => {
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

    updateInstance(inst.id, () => ({
      externalWeapons: [...weapons, newInst],
    }));
  };

  const removeWeapon = (index: number) => {
    updateInstance(inst.id, () => ({
      externalWeapons: weapons.filter((_, i) => i !== index),
    }));
  };

  const updateWeapon = (index: number, updater: (w: ExternalWeaponInstance) => Partial<ExternalWeaponInstance>) => {
    const updated = [...weapons];
    updated[index] = { ...updated[index], ...updater(updated[index]) };
    updateInstance(inst.id, () => ({ externalWeapons: updated }));
  };

  const toggleMaster = () => {
    updateInstance(inst.id, () => ({ externalWeaponBuffsEnabled: !masterEnabled }));
  };

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <span className={`text-[8px] transform transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}>
            ▼
          </span>
          External Weapon Buffs
          {weapons.length > 0 && (
            <span className="text-[10px] font-normal normal-case tracking-normal text-gray-400 dark:text-zinc-500">
              ({weapons.filter(w => w.enabled).length}/{weapons.length} active)
            </span>
          )}
        </button>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-[10px] text-gray-500 dark:text-zinc-400">Apply All</span>
          <input
            type="checkbox"
            className="h-3.5 w-3.5 accent-amber-500 cursor-pointer"
            checked={masterEnabled}
            onChange={toggleMaster}
          />
        </label>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {/* Weapon Cards */}
          {weapons.map((wInst, index) => {
            const wConfig = weaponById(wInst.weaponId);
            if (!wConfig) return null;
            const isActive = masterEnabled && wInst.enabled;

            // Compute preview for this individual weapon
            const singleResult = resolveExternalWeaponBuffs(
              [{ ...wInst, enabled: true }],
              baseAtk,
              config,
              true
            );

            const isMatchingClass = wConfig.type === config.weapon;

            return (
              <div
                key={wInst.id || `${wInst.weaponId}-${index}`}
                className={`rounded-lg border p-3 transition-all ${
                  isActive
                    ? "border-amber-400/60 dark:border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/15"
                    : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 opacity-60"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-amber-500 cursor-pointer"
                      checked={wInst.enabled}
                      onChange={() => updateWeapon(index, w => ({ enabled: !w.enabled }))}
                    />
                    <WeaponIcon weapon={wConfig.type} className="w-4 h-4" />
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      {wConfig.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${RARITY_COLORS[wConfig.rarity] || "text-zinc-400"}`}>
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
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-1"
                    title="Remove weapon"
                  >
                    ✕
                  </button>
                </div>

                {/* Passive Name & Description Snippet */}
                <div className="text-[10px] text-gray-500 dark:text-zinc-400 mb-2 italic">
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">{wConfig.passiveName}:</span> {wConfig.passiveDesc}
                </div>

                {/* Refinement Selector (R1 to R5) */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 mr-1 font-medium">Refinement:</span>
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => updateWeapon(index, () => ({ refinement: r }))}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all border ${
                        (wInst.refinement || 1) === r
                          ? "bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-500 shadow-sm"
                          : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-amber-400"
                      }`}
                    >
                      R{r}
                    </button>
                  ))}
                </div>

                {/* Mechanic Controls (Toggles / Stacks) */}
                {(wConfig.mechanicDefs ?? []).map(m => {
                  if (m.control === "toggle") {
                    const isChecked = (wInst.inputs?.[m.id] ?? String(m.defaultValue ?? 1)) === "1" || Number(wInst.inputs?.[m.id] ?? 1) > 0;
                    return (
                      <div key={m.id} className="flex items-center gap-2 mb-1.5" title={m.hint}>
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-amber-500 cursor-pointer"
                          checked={isChecked}
                          onChange={e => updateWeapon(index, w => ({
                            inputs: { ...w.inputs, [m.id]: e.target.checked ? "1" : "0" }
                          }))}
                        />
                        <span className="text-[10px] text-gray-700 dark:text-zinc-300">
                          {m.label}
                        </span>
                      </div>
                    );
                  }

                  if (m.control === "stacks" || m.control === "percent") {
                    const val = Number(wInst.inputs?.[m.id] ?? m.defaultValue ?? 0);
                    return (
                      <div key={m.id} className="flex items-center justify-between gap-2 mb-1.5 text-[10px]" title={m.hint}>
                        <span className="text-gray-600 dark:text-zinc-400">{m.label}:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={m.max ?? 100000}
                            value={val}
                            onChange={e => {
                              const numVal = Number(e.target.value);
                              updateWeapon(index, w => ({
                                inputs: { ...w.inputs, [m.id]: String(numVal) }
                              }));
                            }}
                            className="w-16 px-1.5 py-0.5 text-[10px] text-right border rounded bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Computed Buff Preview */}
                <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    Provided Buffs
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {singleResult.sources.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600 dark:text-zinc-400">{s.label}</span>
                        <span className={`font-semibold ${isActive ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-zinc-600"}`}>
                          +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                            ? fmt(s.value)
                            : `${fmt(s.value)}%`}
                        </span>
                      </div>
                    ))}
                    {singleResult.sources.length === 0 && (
                      <span className="text-[10px] text-gray-400 dark:text-zinc-600 italic">No active buffs for this setup</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Weapon Dropdown */}
          {selectableWeapons.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="flex-1 border rounded px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                defaultValue=""
                onChange={e => {
                  if (e.target.value) {
                    addWeapon(e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="" disabled>+ Add External Weapon Buff...</option>
                {selectableWeapons.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.type} · {w.rarity}★{w.isSupport ? " · Party Support" : ""})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Aggregated Weapon Buffs Summary */}
          {weaponResult.sources.length > 0 && (
            <div className="mt-1 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-700">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                Total External Weapon Buffs {!masterEnabled && "(Disabled)"}
              </span>
              <div className="mt-1 space-y-0.5">
                {weaponResult.sources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500 dark:text-zinc-400">
                      {s.label}
                    </span>
                    <span className={`font-semibold ${masterEnabled ? "text-amber-600 dark:text-amber-400" : "text-gray-400 line-through"}`}>
                      +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                        ? fmt(s.value)
                        : `${fmt(s.value)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
