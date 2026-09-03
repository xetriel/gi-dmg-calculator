"use client";
import React from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance } from "../types";
import { artifactById } from "@/data/registry/artifacts";
import { resolveExternalArtifactBuffs } from "@/lib/engine/artifact-buffs";
import { toNum } from "@/lib/engine/validation";
import { getRarityTheme } from "../rarity-theme";

interface ExternalArtifactBuffPanelProps {
  config: CharacterConfig;
  inst: CalcInstance;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
  onOpenModal?: () => void;
}

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

export const ExternalArtifactBuffPanel: React.FC<ExternalArtifactBuffPanelProps> = ({
  config,
  inst,
  updateInstance,
  onOpenModal,
}) => {
  const artifacts = inst.externalArtifacts ?? [];
  const masterEnabled = inst.externalArtifactBuffsEnabled !== false;
  const baseAtk = toNum(inst.stats["atk.base"]) ?? 0;

  // Compute live preview of all artifact buffs
  const artifactResult = resolveExternalArtifactBuffs(artifacts, baseAtk, config, masterEnabled);

  const activeCount = artifacts.filter((a) => a.enabled).length;

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white hover:text-black dark:hover:text-white transition-colors cursor-pointer group"
          title="Open External Artifact Buffs configuration modal"
        >
          <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform">
            🏺
          </span>
          <span>External Artifact Buffs</span>
          {artifacts.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <span className="text-gray-900 dark:text-white font-extrabold">{activeCount}/{artifacts.length}</span>
              <span className="text-gray-400 dark:text-zinc-500 font-medium"> (Max 4)</span>
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11px] px-2 py-0.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-purple-400 font-semibold shadow-2xs cursor-pointer transition-colors"
          >
            ⚙️ Edit
          </button>
          <label className="flex items-center gap-1.5 cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400">Apply</span>
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-purple-500 cursor-pointer"
              checked={masterEnabled}
              onChange={() => updateInstance(inst.id, () => ({ externalArtifactBuffsEnabled: !masterEnabled }))}
            />
          </label>
        </div>
      </div>

      {/* Configured Artifacts Preview / Pill Cloud */}
      {artifacts.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {artifacts.map((aInst, idx) => {
              const aConfig = artifactById(aInst.artifactId);
              if (!aConfig) return null;
              const theme = getRarityTheme(aConfig.rarity);
              const isActive = masterEnabled && aInst.enabled;
              const isWielder = (aInst.slot || "wielder") === "wielder";

              return (
                <div
                  key={aInst.id || `${aInst.artifactId}-${idx}`}
                  onClick={onOpenModal}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                    isActive
                      ? theme.panelPillActive
                      : "bg-gray-100/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 opacity-60"
                  }`}
                  title={`${aConfig.name} (${aInst.pieceCount || 4}-Pc, ${isWielder ? "Wielder" : "Support"}) - Click to configure`}
                >
                  <span className="text-xs">🏺</span>
                  <span className="font-semibold text-[11px] truncate max-w-[130px]">{aConfig.name}</span>
                  <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${theme.badge}`}>{aInst.pieceCount || 4}P</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                      isWielder
                        ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                        : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {isWielder ? "Wielder" : "Support"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Aggregated Buffs Pill Breakdown */}
          {artifactResult.sources.length > 0 && (
            <div className="pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
              {artifactResult.sources.map((s, i) => {
                const theme = getRarityTheme(s.rarity);
                return (
                  <span
                    key={i}
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      masterEnabled
                        ? theme.sourceBuffPill
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"
                    }`}
                  >
                    {s.label}: +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                      ? fmt(s.value)
                      : `${fmt(s.value)}%`}
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
          <span>Add External Artifact Buffs</span>
          <span className="text-gray-400 dark:text-zinc-500 font-medium"> (Max 4)</span>
        </button>
      )}
    </div>
  );
};
