"use client";
import React from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance } from "../types";
import { weaponById } from "@/data/registry/weapons";
import { resolveExternalWeaponBuffs } from "@/lib/engine/weapon-buffs";
import { toNum } from "@/lib/engine/validation";
import { WeaponIcon } from "@/components/icons";
import { getRarityTheme } from "../rarity-theme";

interface ExternalWeaponBuffPanelProps {
  config: CharacterConfig;
  inst: CalcInstance;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
  onOpenModal?: () => void;
}

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

export const ExternalWeaponBuffPanel: React.FC<ExternalWeaponBuffPanelProps> = ({
  config,
  inst,
  updateInstance,
  onOpenModal,
}) => {
  const weapons = inst.externalWeapons ?? [];
  const masterEnabled = inst.externalWeaponBuffsEnabled !== false;
  const baseAtk = toNum(inst.stats["atk.base"]) ?? 0;

  // Compute live preview of all weapon buffs
  const weaponResult = resolveExternalWeaponBuffs(weapons, baseAtk, config, masterEnabled);

  const toggleMaster = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateInstance(inst.id, () => ({ externalWeaponBuffsEnabled: !masterEnabled }));
  };

  const activeCount = weapons.filter((w) => w.enabled).length;

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-zinc-200 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          title="Open External Weapon Buffs configuration modal"
        >
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
            ⚔️
          </span>
          <span>External Weapon Buffs</span>
          {weapons.length > 0 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {activeCount}/{weapons.length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11px] px-2 py-0.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-amber-400 font-semibold shadow-2xs cursor-pointer transition-colors"
          >
            ⚙️ Edit
          </button>
          <label className="flex items-center gap-1.5 cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400">Apply</span>
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-amber-500 cursor-pointer"
              checked={masterEnabled}
              onChange={() => updateInstance(inst.id, () => ({ externalWeaponBuffsEnabled: !masterEnabled }))}
            />
          </label>
        </div>
      </div>

      {/* Configured Weapons Preview / Pill Cloud */}
      {weapons.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {weapons.map((wInst, idx) => {
              const wConfig = weaponById(wInst.weaponId);
              if (!wConfig) return null;
              const theme = getRarityTheme(wConfig.rarity);
              const isActive = masterEnabled && wInst.enabled;

              return (
                <div
                  key={wInst.id || `${wInst.weaponId}-${idx}`}
                  onClick={onOpenModal}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                    isActive
                      ? theme.panelPillActive
                      : "bg-gray-100/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 opacity-60"
                  }`}
                  title={`${wConfig.name} (R${wInst.refinement || 1}) - Click to configure`}
                >
                  <WeaponIcon weapon={wConfig.type} className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-[11px] truncate max-w-[130px]">{wConfig.name}</span>
                  <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${theme.badge}`}>R{wInst.refinement || 1}</span>
                </div>
              );
            })}
          </div>

          {/* Aggregated Buffs Pill Breakdown */}
          {weaponResult.sources.length > 0 && (
            <div className="pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
              {weaponResult.sources.map((s, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    masterEnabled
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"
                  }`}
                >
                  {s.label}: +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                    ? fmt(s.value)
                    : `${fmt(s.value)}%`}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full py-1.5 px-2 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-500 text-gray-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-gray-50/50 dark:bg-zinc-900/30"
        >
          <span>➕</span>
          <span>Add External Weapon Buffs</span>
        </button>
      )}
    </div>
  );
};
