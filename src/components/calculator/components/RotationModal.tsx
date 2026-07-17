import React from "react";
import type { CharacterConfig, ReactionType } from "@/data/registry/types";
import type { CalcInstance, ComputedInstance, SavedRotation, RotationStep } from "../types";
import { hitId } from "@/lib/engine/validation";
import { getHitColor, DMG_COLORS } from "../utils/colors";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

const REACTION_LABEL: Record<ReactionType, string> = {
  none: "None",
  vaporize: "Vaporize",
  melt: "Melt",
  aggravate: "Aggravate",
};

const selectCls =
  "border px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";

interface RotationModalProps {
  isRotationOpen: boolean;
  setIsRotationOpen: (open: boolean) => void;
  isSelectAttackOpen: boolean;
  setIsSelectAttackOpen: (open: boolean) => void;
  instances: CalcInstance[];
  activeBenchmarkId: string | null;
  setBenchmarkId: (id: string | null) => void;
  rotations: SavedRotation[];
  activeRotationId: string;
  setActiveRotationId: (id: string) => void;
  addRotation: () => void;
  deleteRotation: (id: string) => void;
  updateActiveRotation: (updater: (rot: SavedRotation) => Partial<SavedRotation>) => void;
  moveStep: (index: number, direction: "up" | "down") => void;
  rotationNextId: number;
  setRotationNextId: React.Dispatch<React.SetStateAction<number>>;
  draggedIndex: number | null;
  setDraggedIndex: (index: number | null) => void;
  config: CharacterConfig;
  computedById: Map<string, ComputedInstance>;
}

export const RotationModal: React.FC<RotationModalProps> = ({
  isRotationOpen,
  setIsRotationOpen,
  isSelectAttackOpen,
  setIsSelectAttackOpen,
  instances,
  activeBenchmarkId,
  setBenchmarkId,
  rotations,
  activeRotationId,
  setActiveRotationId,
  addRotation,
  deleteRotation,
  updateActiveRotation,
  moveStep,
  rotationNextId,
  setRotationNextId,
  draggedIndex,
  setDraggedIndex,
  config,
  computedById,
}) => {
  if (!isRotationOpen) return null;

  const activeRot = rotations.find((r) => r.id === activeRotationId) || rotations[0];

  const renderPct = (currentVal: number, benchmarkVal: number | undefined) => {
    if (instances.length < 2 || benchmarkVal === undefined || benchmarkVal === 0) return null;
    const pct = (currentVal / benchmarkVal) * 100;

    let colorClass = "text-gray-400 dark:text-zinc-500";
    if (pct < 99.95) {
      colorClass = "text-red-500 dark:text-red-400 font-semibold";
    } else if (pct > 100.05) {
      colorClass = "text-green-500 dark:text-green-400 font-semibold";
    }

    return (
      <span className={`text-[10px] leading-none ${colorClass}`}>
        {pct.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 animate-out fade-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-zinc-850 shrink-0">
          <div>
            <h2 className="text-lg font-bold">Rotation Builder</h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Configure your combo sequence and compare setups
            </p>
          </div>
          <button
            onClick={() => setIsRotationOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Horizontal Rotations Tab Bar */}
        <div className="px-6 py-2.5 border-b border-gray-150 dark:border-zinc-850 bg-gray-50/30 dark:bg-zinc-950/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto select-none py-1 scrollbar-none">
            {rotations.map((r) => {
              const isSelected = r.id === activeRotationId;
              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRotationId(r.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-xs font-bold"
                      : "bg-white border-gray-200 hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 text-gray-700 dark:text-zinc-300"
                  }`}
                >
                  <span>{r.name || "Untitled Rotation"}</span>
                  {rotations.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRotation(r.id);
                      }}
                      className={`hover:bg-red-500/10 hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer text-[10px] ${
                        isSelected ? "text-gray-300 hover:text-red-400" : "text-gray-400"
                      }`}
                      title="Delete rotation"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={addRotation}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-3 py-1.5 text-xs font-bold text-white dark:text-zinc-950 transition-colors cursor-pointer shrink-0"
          >
            + Add New Rotation
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col min-w-0">
          {activeRot ? (
            <>
              {/* Metadata Editors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-gray-200/50 dark:border-zinc-800/50 shrink-0">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5">
                    Rotation Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vaporize E Combo..."
                    className="w-full border px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-semibold"
                    value={activeRot.name}
                    onChange={(e) => updateActiveRotation(() => ({ name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5">
                    Rotation Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kaeya melt support sequence..."
                    className="w-full border px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                    value={activeRot.description}
                    onChange={(e) => updateActiveRotation(() => ({ description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Step Builder Controls */}
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <button
                  className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-bold text-white dark:text-zinc-950 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 border border-gray-300 dark:border-zinc-700 font-semibold"
                  onClick={() => setIsSelectAttackOpen(true)}
                >
                  <span>➕ Add Step</span>
                </button>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 italic">
                  Click "+ Add Step" to choose from all attack instances for your character.
                </span>
              </div>

              {/* Steps Table */}
              {activeRot.steps.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                  <p className="text-sm text-gray-400 dark:text-zinc-500 mb-1 font-semibold">
                    This rotation is empty
                  </p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">
                    Pick an attack from the dropdown and click "+ Add Step" to build your combo.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto border border-gray-200/60 dark:border-zinc-850 rounded-xl min-h-[200px]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-zinc-900/30">
                        <th className="py-2.5 px-3 font-normal w-8">#</th>
                        <th className="py-2.5 px-3 font-normal">Hit</th>
                        <th className="py-2.5 px-3 font-normal w-16 text-center">Qty</th>
                        <th className="py-2.5 px-3 font-normal w-28">Reaction</th>
                        <th className="py-2.5 px-3 font-normal w-28">Hit Type</th>
                        {instances.map((inst, idx) => {
                          const baseBenchmarkInst = activeBenchmarkId === inst.id;
                          return (
                            <th key={inst.id} className="py-2.5 px-3 text-right font-normal">
                              <div className="flex flex-col items-end gap-1">
                                <span className="font-semibold text-gray-800 dark:text-gray-250">
                                  Setup {idx + 1} Avg
                                </span>
                                <button
                                  onClick={() => setBenchmarkId(inst.id)}
                                  disabled={baseBenchmarkInst}
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${
                                    baseBenchmarkInst
                                      ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 cursor-not-allowed border border-gray-300 dark:border-zinc-700"
                                      : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                                  }`}
                                >
                                  {baseBenchmarkInst ? "Benchmark" : "Compare"}
                                </button>
                              </div>
                            </th>
                          );
                        })}
                        <th className="py-2.5 px-3 w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRot.steps.map((step: RotationStep, stepIdx: number) => {
                        let hitName = step.targetHitId;
                        for (let gi = 0; gi < config.talents.length; gi++) {
                          for (let hi = 0; hi < config.talents[gi].hits.length; hi++) {
                            if (hitId(gi, hi) === step.targetHitId) {
                              hitName = `${config.talents[gi].name}: ${config.talents[gi].hits[hi].name}`;
                            }
                          }
                        }

                        // Find benchmark hit value
                        const benchmarkInst = instances.find((i) => i.id === activeBenchmarkId);
                        let benchmarkDmg = 0;
                        if (benchmarkInst) {
                          const benchmarkComputed = computedById.get(benchmarkInst.id);
                          if (benchmarkComputed && benchmarkComputed.rotationStepsDmg) {
                            benchmarkDmg =
                              benchmarkComputed.rotationStepsDmg[activeRotationId]?.[stepIdx] ?? 0;
                          }
                        }

                        return (
                          <tr
                            key={step.id}
                            draggable="true"
                            onDragStart={(e) => {
                              setDraggedIndex(stepIdx);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              if (draggedIndex === null || draggedIndex === stepIdx) return;

                              const newSteps = [...activeRot.steps];
                              const draggedItem = newSteps[draggedIndex];
                              newSteps.splice(draggedIndex, 1);
                              newSteps.splice(stepIdx, 0, draggedItem);

                              setDraggedIndex(stepIdx);
                              updateActiveRotation(() => ({ steps: newSteps }));
                            }}
                            onDragEnd={() => setDraggedIndex(null)}
                            className={`border-t border-gray-100 dark:border-zinc-900/80 hover:bg-gray-50/20 dark:hover:bg-zinc-900/10 transition-all select-none ${
                              draggedIndex === stepIdx ? "opacity-40 bg-zinc-50 dark:bg-zinc-900/40" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 text-gray-400 dark:text-zinc-500 tabular-nums flex items-center justify-between gap-1 group/idx">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors font-bold select-none text-[11px] pr-0.5"
                                  title="Drag to reorder"
                                >
                                  ⋮⋮
                                </span>
                                <span>{stepIdx + 1}</span>
                              </div>
                              <div className="flex flex-col opacity-0 group-hover/idx:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  disabled={stepIdx === 0}
                                  onClick={() => moveStep(stepIdx, "up")}
                                  className="text-[8px] hover:text-amber-500 dark:hover:text-amber-400 leading-none py-0.5 cursor-pointer disabled:opacity-30 disabled:hover:text-inherit"
                                  title="Move step up"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={stepIdx === activeRot.steps.length - 1}
                                  onClick={() => moveStep(stepIdx, "down")}
                                  className="text-[8px] hover:text-amber-500 dark:hover:text-amber-400 leading-none py-0.5 cursor-pointer disabled:opacity-30 disabled:hover:text-inherit"
                                  title="Move step down"
                                >
                                  ▼
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300 font-medium">
                              {hitName}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                max="99"
                                className="w-12 border rounded px-1.5 py-0.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-355 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-center font-bold"
                                value={step.quantity ?? 1}
                                onChange={(e) => {
                                  const val = Math.max(1, parseInt(e.target.value) || 1);
                                  const newSteps = [...activeRot.steps];
                                  newSteps[stepIdx] = { ...step, quantity: val };
                                  updateActiveRotation(() => ({ steps: newSteps }));
                                }}
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                className={selectCls + " text-[10px] py-0.5 w-24"}
                                value={step.reactionOverride}
                                onChange={(e) => {
                                  const newSteps = [...activeRot.steps];
                                  newSteps[stepIdx] = {
                                    ...step,
                                    reactionOverride: e.target.value as ReactionType | "default",
                                  };
                                  updateActiveRotation(() => ({ steps: newSteps }));
                                }}
                              >
                                <option value="default">Default</option>
                                {Object.entries(REACTION_LABEL).map(([k, v]) => (
                                  <option key={k} value={k}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                className={selectCls + " text-[10px] py-0.5 w-24"}
                                value={step.hitType || "avg"}
                                onChange={(e) => {
                                  const newSteps = [...activeRot.steps];
                                  newSteps[stepIdx] = {
                                    ...step,
                                    hitType: e.target.value as "avg" | "crit" | "non-crit",
                                  };
                                  updateActiveRotation(() => ({ steps: newSteps }));
                                }}
                              >
                                <option value="avg">Average</option>
                                <option value="crit">CRIT</option>
                                <option value="non-crit">Non-Crit</option>
                              </select>
                            </td>
                            {instances.map((inst) => {
                              const computed = computedById.get(inst.id);
                              const stepsDmg = computed?.rotationStepsDmg[activeRotationId];
                              const dmg = stepsDmg ? stepsDmg[stepIdx] : 0;
                              
                              let hitConfig = null;
                              for (let gi = 0; gi < config.talents.length; gi++) {
                                for (let hi = 0; hi < config.talents[gi].hits.length; hi++) {
                                  if (hitId(gi, hi) === step.targetHitId) {
                                    hitConfig = config.talents[gi].hits[hi];
                                    break;
                                  }
                                }
                                if (hitConfig) break;
                              }

                              const details = computed?.rotationStepsDetails?.[activeRotationId]?.[stepIdx];
                              const cellColor = hitConfig?.kind === "heal"
                                ? DMG_COLORS["Heal-related"]
                                : hitConfig?.kind === "shield"
                                ? DMG_COLORS["Shield-related"]
                                : details
                                ? getHitColor(
                                    details.element ?? config.element,
                                    details.reaction,
                                    hitConfig?.direct,
                                    hitConfig?.name
                                  )
                                : undefined;

                              return (
                                <td
                                  key={inst.id}
                                  className="py-2.5 px-3 text-right tabular-nums font-semibold"
                                  style={cellColor ? { color: cellColor } : undefined}
                                >
                                  <div className="flex flex-col items-end">
                                    <span>{fmt(dmg)}</span>
                                    {renderPct(dmg, benchmarkDmg)}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => {
                                    const newStep: RotationStep = {
                                      ...step,
                                      id: `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                    };
                                    const newSteps = [...activeRot.steps];
                                    newSteps.splice(stepIdx + 1, 0, newStep);
                                    updateActiveRotation(() => ({ steps: newSteps }));
                                  }}
                                  className="text-zinc-400 hover:text-amber-500 cursor-pointer text-xs p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                                  title="Duplicate step"
                                >
                                  📑
                                </button>
                                <button
                                  className="text-red-400 hover:text-red-650 dark:hover:text-red-300 cursor-pointer text-xs p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                  onClick={() => {
                                    updateActiveRotation((r: SavedRotation) => ({
                                      steps: r.steps.filter((s: RotationStep) => s.id !== step.id),
                                    }));
                                  }}
                                  title="Remove step"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-250 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/20">
                        <td className="py-3 px-3 font-semibold text-gray-800 dark:text-white" colSpan={5}>
                          Total Average DMG
                        </td>
                        {instances.map((inst) => {
                          const computed = computedById.get(inst.id);
                          const total = computed?.rotationTotals[activeRotationId] ?? 0;
                          const benchmarkComputed = activeBenchmarkId ? computedById.get(activeBenchmarkId) : undefined;
                          const benchmarkTotal =
                            benchmarkComputed?.rotationTotals[activeRotationId] ?? 0;
                          return (
                            <td
                              key={inst.id}
                              className="py-3 px-3 text-right tabular-nums font-bold text-sm text-zinc-900 dark:text-white"
                            >
                              <div className="flex flex-col items-end">
                                <span>{fmt(total)}</span>
                                {renderPct(total, benchmarkTotal)}
                              </div>
                            </td>
                          );
                        })}
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select or create a rotation on the sidebar to get started
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-150 dark:border-zinc-850 shrink-0 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/10">
          <span className="text-[11px] text-gray-400 dark:text-zinc-500">
            Changes will be saved automatically along with your setup builds.
          </span>
          <button
            onClick={() => setIsRotationOpen(false)}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* ── Attack Selector Popup Modal overlay (z-60) ── */}
      {isSelectAttackOpen && (
        <div className="fixed inset-0 z-65 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[75vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-150 dark:border-zinc-850 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">
                  Select Attack Instance
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                  Choose an attack to append to your combo
                </p>
              </div>
              <button
                onClick={() => setIsSelectAttackOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer text-xs font-bold font-mono"
              >
                ✕
              </button>
            </div>

            {/* List of attacks grouped by talent */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {config.talents.map((g, gi) => (
                <div key={g.name} className="space-y-1.5">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500">
                    {g.name}
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {g.hits.map((h, hi) => {
                      if (h.kind === "heal" || h.kind === "shield") return null;
                      const hitIdValue = hitId(gi, hi);
                      return (
                        <button
                          key={hitIdValue}
                          onClick={() => {
                            updateActiveRotation((r) => ({
                              steps: [
                                ...r.steps,
                                {
                                  id: String(rotationNextId),
                                  targetHitId: hitIdValue,
                                  reactionOverride: "default",
                                },
                              ],
                            }));
                            setRotationNextId((prev) => prev + 1);
                            setIsSelectAttackOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-gray-200/60 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-zinc-100 bg-white hover:bg-zinc-55 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-xs text-gray-700 dark:text-zinc-300 font-semibold transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <span>{h.name}</span>
                          <span className="text-[9px] text-gray-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 uppercase tracking-wider font-bold">
                            {h.scaling}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-150 dark:border-zinc-850 shrink-0 flex justify-end bg-gray-50/50 dark:bg-zinc-900/10">
              <button
                onClick={() => setIsSelectAttackOpen(false)}
                className="rounded-lg bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-zinc-350 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
