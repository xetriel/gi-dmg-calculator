"use client";
import React from "react";
import type { CalcInstance } from "../types";
import { supportById } from "@/data/registry/characters";
import { resolveTeamBuffs } from "@/lib/engine/team-buffs";
import { ElementIcon } from "@/components/icons";

interface TeamBuffPanelProps {
  inst: CalcInstance;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
  dpsCharacterId?: string; // ID of the active DPS character
  onOpenModal?: () => void;
}

const MAX_SUPPORTS = 3;

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

export const TeamBuffPanel: React.FC<TeamBuffPanelProps> = ({
  inst,
  updateInstance,
  onOpenModal,
}) => {
  const supports = inst.teamSupports ?? [];
  const masterEnabled = inst.teamBuffsEnabled !== false;

  // Compute live preview of all team buffs
  const teamResult = resolveTeamBuffs(supports, masterEnabled);

  const activeCount = supports.filter((s) => s.enabled).length;

  const toggleMaster = () => {
    updateInstance(inst.id, () => ({ teamBuffsEnabled: !masterEnabled }));
  };

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-zinc-200 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          title="Open Team Support Buffs configuration modal"
        >
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform text-xs">
            👥
          </span>
          <span>Team Support Buffs</span>
          {supports.length > 0 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {activeCount}/{supports.length} (Max {MAX_SUPPORTS})
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
              onChange={toggleMaster}
            />
          </label>
        </div>
      </div>

      {/* Configured Support Characters Preview / Pill Cloud */}
      {supports.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {supports.map((sup, idx) => {
              const sConfig = supportById(sup.supportId);
              if (!sConfig) return null;
              const isActive = masterEnabled && sup.enabled;

              return (
                <div
                  key={sup.supportId ? `${sup.supportId}-${idx}` : idx}
                  onClick={onOpenModal}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                    isActive
                      ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200"
                      : "bg-gray-100/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 opacity-60"
                  }`}
                  title={`${sConfig.name} (C${sup.constellationLevel}${sup.selectedSetupName ? `, ${sup.selectedSetupName}` : ""}) - Click to configure`}
                >
                  <ElementIcon element={sConfig.element} className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[11px] truncate max-w-[120px]">{sConfig.name}</span>
                  <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                    C{sup.constellationLevel}
                  </span>
                  {(sup.selectedSetupName || sup.selectedSetupId) && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                      {sup.selectedSetupName?.startsWith("Support Setup")
                        ? sup.selectedSetupName
                        : `Support Setup ${sup.selectedSetupId ?? "1"}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Aggregated Team Buffs Pill Breakdown */}
          {teamResult.sources.length > 0 && (
            <div className="pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
              {teamResult.sources.map((s, i) => (
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
          <span>Add Team Support Buffs (Max {MAX_SUPPORTS})</span>
        </button>
      )}
    </div>
  );
};
