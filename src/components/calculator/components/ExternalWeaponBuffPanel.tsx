"use client";
import React from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance } from "../types";
import { weaponById } from "@/data/registry/weapons";
import { resolveExternalWeaponBuffs } from "@/lib/engine/weapon-buffs";
import { getActiveSupportEquippedWeapons } from "@/lib/engine/support-equipment";
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

  // Retrieve active support-equipped weapons
  const teamSupports = inst.teamSupports ?? [];
  const teamBuffsEnabled = inst.teamBuffsEnabled !== false;
  const supportWeapons = getActiveSupportEquippedWeapons(
    teamSupports,
    teamBuffsEnabled,
    config.element,
    config.weapon,
    baseAtk,
    Number(inst.stats["def.base"] ?? 0),
    Number(inst.stats["hp.base"] ?? 0)
  );
  const supportWeaponMap = new Map(supportWeapons.map((sw) => [sw.weapon.weaponId, sw]));
  const supportWeaponIds = Array.from(supportWeaponMap.keys());

  // Compute live preview of standalone weapon buffs (bypassing overridden duplicates)
  const weaponResult = resolveExternalWeaponBuffs(weapons, baseAtk, config, masterEnabled, supportWeaponIds);

  // Combined weapon buff sources for live preview in this panel
  const combinedWeaponSources = [
    ...weaponResult.sources,
    ...(masterEnabled ? supportWeapons.flatMap((sw) => sw.buffs) : []),
  ];

  const totalWeaponsCount = weapons.length + supportWeapons.length;
  const activeCount =
    weapons.filter((w) => w.enabled && !supportWeaponMap.has(w.weaponId)).length +
    (masterEnabled ? supportWeapons.length : 0);

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white hover:text-black dark:hover:text-white transition-colors cursor-pointer group whitespace-nowrap min-w-0"
          title="Open External Weapon Buffs configuration modal (Max 4 Standalone weapons)"
        >
          <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform shrink-0">
            ⚔️
          </span>
          <span className="truncate">External Weapon Buffs</span>
          {totalWeaponsCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shrink-0">
              <span className="text-gray-900 dark:text-white font-extrabold">{activeCount}/{totalWeaponsCount}</span>
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11px] px-2 py-0.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 font-semibold shadow-2xs cursor-pointer transition-colors whitespace-nowrap"
          >
            ⚙️ Edit
          </button>
          <label className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400">Apply</span>
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
              checked={masterEnabled}
              onChange={() => updateInstance(inst.id, () => ({ externalWeaponBuffsEnabled: !masterEnabled }))}
            />
          </label>
        </div>
      </div>

      {/* Configured Weapons Preview / Pill Cloud */}
      {totalWeaponsCount > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 1. Support Character Equipped Weapons */}
            {supportWeapons.map((sw, sIdx) => {
              const wConfig = weaponById(sw.weapon.weaponId);
              if (!wConfig) return null;
              const theme = getRarityTheme(wConfig.rarity);
              return (
                <div
                  key={`sup-wep-${sw.supportId}-${sIdx}`}
                  onClick={onOpenModal}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                    masterEnabled
                      ? theme.panelPillActive
                      : "bg-gray-100/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 opacity-60"
                  }`}
                  title={`${wConfig.name} (R${sw.weapon.refinement}, Equipped by ${sw.supportName}) - Click to configure`}
                >
                  <WeaponIcon weapon={wConfig.type} className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-[11px] truncate max-w-[130px]">{wConfig.name}</span>
                  <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${theme.badge}`}>R{sw.weapon.refinement}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                    <span>🛡️</span>
                    <span>{sw.supportName}</span>
                  </span>
                </div>
              );
            })}

            {/* 2. Standalone Configured Weapons */}
            {weapons.map((wInst, idx) => {
              const wConfig = weaponById(wInst.weaponId);
              if (!wConfig) return null;
              const theme = getRarityTheme(wConfig.rarity);
              const isOverridden = supportWeaponMap.has(wInst.weaponId);
              const matchingSupport = supportWeaponMap.get(wInst.weaponId);
              const isActive = masterEnabled && wInst.enabled && !isOverridden;
              const isMatchingClass = config.weapon === wConfig.type;
              const isWielder = (wInst.slot ?? (isMatchingClass && wConfig.buffType === "self" ? "wielder" : "support")) === "wielder" && isMatchingClass;

              return (
                <div
                  key={wInst.id || `${wInst.weaponId}-${idx}`}
                  onClick={onOpenModal}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                    isOverridden
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 opacity-75"
                      : isActive
                      ? theme.panelPillActive
                      : "bg-gray-100/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 opacity-60"
                  }`}
                  title={
                    isOverridden && matchingSupport
                      ? `${wConfig.name} is overridden by ${matchingSupport.supportName}'s equipped build`
                      : `${wConfig.name} (R${wInst.refinement || 1}, ${isWielder ? "Wielder" : "Support"}) - Click to configure`
                  }
                >
                  <WeaponIcon weapon={wConfig.type} className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-[11px] truncate max-w-[130px]">{wConfig.name}</span>
                  <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${theme.badge}`}>R{wInst.refinement || 1}</span>
                  {isOverridden && matchingSupport ? (
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      ⚡ Replaced by {matchingSupport.supportName}
                    </span>
                  ) : (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                        isWielder
                          ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                          : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {isWielder ? "Wielder" : "Support"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Aggregated Buffs Pill Breakdown */}
          {combinedWeaponSources.length > 0 && (
            <div className="pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
              {combinedWeaponSources.map((s, i) => {
                const theme = getRarityTheme(s.rarity);
                const isFlat = s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def";
                const sign = s.value > 0 ? "+" : "";
                const formattedVal = `${sign}${fmt(s.value)}${isFlat ? "" : "%"}`;

                return (
                  <span
                    key={i}
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded border whitespace-nowrap ${
                      masterEnabled
                        ? theme.sourceBuffPill
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"
                    }`}
                  >
                    {s.label}: {formattedVal}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full py-1.5 px-2 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-gray-50/50 dark:bg-zinc-900/30"
        >
          <span>➕</span>
          <span>Configure External Weapons</span>
          <span className="text-gray-400 dark:text-zinc-500 font-medium"> (Max 4)</span>
        </button>
      )}
    </div>
  );
};
