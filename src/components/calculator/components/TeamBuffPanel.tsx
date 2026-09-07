"use client";
import React from "react";
import type { CalcInstance } from "../types";
import { supportById, byId as characterById } from "@/data/registry/characters";
import { resolveTeamBuffs } from "@/lib/engine/team-buffs";
import { ElementIcon } from "@/components/icons";
import { getRarityTheme } from "../rarity-theme";

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
  dpsCharacterId,
  onOpenModal,
}) => {
  const supports = inst.teamSupports ?? [];
  const masterEnabled = inst.teamBuffsEnabled !== false;
  const dpsConfig = dpsCharacterId ? characterById(dpsCharacterId) : undefined;

  const dpsBaseAtk = Number(inst.stats["atk.base"] || 0);
  const dpsBaseDef = Number(inst.stats["def.base"] || 0);
  const dpsBaseHp = Number(inst.stats["hp.base"] || 0);

  // Compute live preview of all team buffs
  const teamResult = resolveTeamBuffs(supports, masterEnabled, dpsConfig, dpsBaseAtk, dpsBaseDef, dpsBaseHp);

  const activeCount = supports.filter((s) => s.enabled).length;

  const toggleMaster = () => {
    updateInstance(inst.id, () => ({ teamBuffsEnabled: !masterEnabled }));
  };

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white hover:text-black dark:hover:text-white transition-colors cursor-pointer group whitespace-nowrap min-w-0"
          title={`Open Team Support Buffs configuration modal (Max ${MAX_SUPPORTS} supports per team)`}
        >
          <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform text-xs shrink-0">
            👥
          </span>
          <span className="truncate">Team Support Buffs</span>
          {supports.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shrink-0">
              <span className="text-gray-900 dark:text-white font-extrabold">{activeCount}/{supports.length}</span>
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {supports.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const anyActive = supports.some((s) => s.useCharacterBuild !== false);
                const next = !anyActive;
                const updated = supports.map((s) => ({ ...s, useCharacterBuild: next }));
                updateInstance(inst.id, () => ({ teamSupports: updated }));
              }}
              className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                supports.every((s) => s.useCharacterBuild !== false)
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-2xs"
                  : supports.some((s) => s.useCharacterBuild !== false)
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-300 dark:border-zinc-700"
              }`}
              title="Toggle Use Character Build for all supports in this team (Option 1 vs Option 2)"
            >
              <span>🛡️ Builds:</span>
              <span className="font-bold">
                {supports.every((s) => s.useCharacterBuild !== false)
                  ? "ON"
                  : supports.some((s) => s.useCharacterBuild !== false)
                  ? "PART"
                  : "OFF"}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11px] px-2 py-0.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 font-semibold shadow-2xs cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            ⚙️ Edit
          </button>
          <label className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap shrink-0" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400">Apply</span>
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
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
              const theme = getRarityTheme(sConfig.rarity);
              const isActive = masterEnabled && sup.enabled;
              const isBuildActive = sup.useCharacterBuild !== false;

              // Clean setup label: e.g. "Setup 1" instead of verbose "Support Setup 1"
              const setupLabel = sup.selectedSetupName
                ? sup.selectedSetupName.replace(/^Support\s+/i, "")
                : `Setup ${sup.selectedSetupId ?? "1"}`;

              return (
                <div
                  key={sup.supportId ? `${sup.supportId}-${idx}` : idx}
                  onClick={onOpenModal}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all whitespace-nowrap ${
                    isActive
                      ? theme.panelPillActive
                      : "bg-gray-100/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 opacity-60"
                  }`}
                  title={`${sConfig.name} (C${sup.constellationLevel}, ${setupLabel}) - Click to configure`}
                >
                  <ElementIcon element={sConfig.element} className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-[11px]">{sConfig.name}</span>
                  <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                    C{sup.constellationLevel}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${theme.badge}`}>
                    {setupLabel}
                  </span>
                  {/* Mini Equipment or Kit-Only Status */}
                  {isBuildActive ? (
                    <span className="inline-flex items-center gap-0.5">
                      {sup.equippedWeapon?.weaponId && (
                        <span className="text-[10px]" title="Equipped Weapon active in Weapon panel">⚔️</span>
                      )}
                      {sup.equippedArtifact?.artifactId && (
                        <span className="text-[10px]" title="Equipped Artifact Set active in Artifact panel">🏺</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[9px] px-1 py-0.2 rounded font-semibold bg-gray-200/80 dark:bg-zinc-700/80 text-gray-600 dark:text-zinc-300" title="Character build disabled (Kit buffs only)">
                      Kit Only
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Aggregated Team Buffs Pill Breakdown (Character kit buffs only; weapon/artifact buffs are in respective panels) */}
          {(() => {
            const characterSources = teamResult.sources.filter((s) => !s.sourceType || s.sourceType === "character");
            if (characterSources.length === 0) return null;

            return (
              <div className="pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
                {characterSources.map((s, i) => {
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
            );
          })()}
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full py-1.5 px-2 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-gray-50/50 dark:bg-zinc-900/30 whitespace-nowrap"
        >
          <span>➕</span>
          <span>Add Team Support Buffs</span>
          <span className="text-gray-400 dark:text-zinc-500 font-medium"> (Max {MAX_SUPPORTS})</span>
        </button>
      )}
    </div>
  );
};
