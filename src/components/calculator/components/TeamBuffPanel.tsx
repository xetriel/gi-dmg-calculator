"use client";
import React, { useState } from "react";
import type { CalcInstance, SupportInstance } from "../types";
import { SUPPORT_CONFIGS, supportById } from "@/data/registry/supports";
import { resolveTeamBuffs } from "@/lib/engine/team-buffs";

interface TeamBuffPanelProps {
  inst: CalcInstance;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
}

const MAX_SUPPORTS = 3;

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

export const TeamBuffPanel: React.FC<TeamBuffPanelProps> = ({ inst, updateInstance }) => {
  const [collapsed, setCollapsed] = useState(false);
  const supports = inst.teamSupports ?? [];
  const masterEnabled = inst.teamBuffsEnabled !== false;

  // Compute live preview of all team buffs
  const teamResult = resolveTeamBuffs(supports, masterEnabled);

  const addSupport = (supportId: string) => {
    if (supports.length >= MAX_SUPPORTS) return;
    const config = supportById(supportId);
    if (!config) return;

    const initStats: Record<string, string> = {};
    for (const f of config.statFields) {
      if (f.hasBaseAndFlat) {
        initStats[`${f.key}.base`] = f.defaultValue;
        initStats[`${f.key}.percent`] = "0";
        initStats[`${f.key}.flat`] = "0";
      } else {
        initStats[f.key] = f.defaultValue;
      }
    }

    const initMechanics: Record<string, string> = {};
    for (const m of config.mechanicDefs ?? []) {
      initMechanics[m.id] = String(m.defaultValue ?? 0);
    }

    const newSupport: SupportInstance = {
      supportId,
      stats: initStats,
      mechanicInputs: initMechanics,
      constellationLevel: 0,
      enabled: true,
    };

    updateInstance(inst.id, () => ({
      teamSupports: [...supports, newSupport],
    }));
  };

  const removeSupport = (index: number) => {
    updateInstance(inst.id, () => ({
      teamSupports: supports.filter((_, i) => i !== index),
    }));
  };

  const updateSupport = (index: number, updater: (s: SupportInstance) => Partial<SupportInstance>) => {
    const updated = [...supports];
    updated[index] = { ...updated[index], ...updater(updated[index]) };
    updateInstance(inst.id, () => ({ teamSupports: updated }));
  };

  const toggleMaster = () => {
    updateInstance(inst.id, () => ({ teamBuffsEnabled: !masterEnabled }));
  };

  const inputCls = "w-16 border rounded px-1.5 py-0.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-right";

  // Available supports not yet added
  const addedIds = new Set(supports.map(s => s.supportId));
  const available = SUPPORT_CONFIGS.filter(c => !addedIds.has(c.id));

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
          Team Buffs
          {supports.length > 0 && (
            <span className="text-[10px] font-normal normal-case tracking-normal text-gray-400 dark:text-zinc-500">
              ({supports.filter(s => s.enabled).length}/{supports.length} active)
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
          {/* Support cards */}
          {supports.map((sup, index) => {
            const config = supportById(sup.supportId);
            if (!config) return null;
            const isActive = masterEnabled && sup.enabled;

            // Compute individual support preview
            const preview = resolveTeamBuffs([{ ...sup, enabled: true }], true);

            return (
              <div
                key={`${sup.supportId}-${index}`}
                className={`rounded-lg border p-3 transition-all ${
                  isActive
                    ? "border-amber-400/60 dark:border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/15"
                    : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 opacity-60"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-amber-500 cursor-pointer"
                      checked={sup.enabled}
                      onChange={() => updateSupport(index, () => ({ enabled: !sup.enabled }))}
                    />
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      {config.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-medium">
                      C{sup.constellationLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => removeSupport(index)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-1"
                    title="Remove support"
                  >
                    ✕
                  </button>
                </div>

                {/* Stat inputs */}
                <div className="space-y-1.5 mb-2">
                  {config.statFields.map(f => (
                    <div key={f.key} className="flex items-center gap-2">
                      {f.hasBaseAndFlat ? (
                        <>
                          <span className="text-[10px] text-gray-500 dark:text-zinc-400 w-12 shrink-0">{f.label}</span>
                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-[9px] text-gray-400">Base</span>
                            <input
                              className={inputCls}
                              type="number"
                              value={sup.stats[`${f.key}.base`] ?? f.defaultValue}
                              onChange={e => updateSupport(index, s => ({
                                stats: { ...s.stats, [`${f.key}.base`]: e.target.value }
                              }))}
                            />
                            <span className="text-[9px] text-gray-400">%</span>
                            <input
                              className={inputCls}
                              type="number"
                              value={sup.stats[`${f.key}.percent`] ?? "0"}
                              onChange={e => updateSupport(index, s => ({
                                stats: { ...s.stats, [`${f.key}.percent`]: e.target.value }
                              }))}
                            />
                            <span className="text-[9px] text-gray-400">Flat</span>
                            <input
                              className={inputCls}
                              type="number"
                              value={sup.stats[`${f.key}.flat`] ?? "0"}
                              onChange={e => updateSupport(index, s => ({
                                stats: { ...s.stats, [`${f.key}.flat`]: e.target.value }
                              }))}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-gray-500 dark:text-zinc-400 w-20 shrink-0">{f.label}</span>
                          <input
                            className={inputCls}
                            type="number"
                            value={sup.stats[f.key] ?? f.defaultValue}
                            onChange={e => updateSupport(index, s => ({
                              stats: { ...s.stats, [f.key]: e.target.value }
                            }))}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constellation selector */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 mr-1">Const.</span>
                  {[0, 1, 2, 3, 4, 5, 6].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => updateSupport(index, () => ({
                        constellationLevel: sup.constellationLevel === lvl ? Math.max(0, lvl - 1) : lvl
                      }))}
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-all border ${
                        sup.constellationLevel >= lvl
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                          : "bg-white dark:bg-zinc-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                      }`}
                    >
                      C{lvl}
                    </button>
                  ))}
                </div>

                {/* Mechanic toggles */}
                {(config.mechanicDefs ?? []).map(m => {
                  const mechVal = Number(sup.mechanicInputs[m.id] ?? "0") > 0;
                  // Gate C1-dependent mechanics
                  const isC1Gated = m.id.includes("c1") && sup.constellationLevel < 1;
                  return (
                    <div key={m.id} className="flex items-center gap-2 mb-1" title={m.hint}>
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-zinc-900 dark:accent-zinc-100 cursor-pointer disabled:opacity-40"
                        checked={mechVal && !isC1Gated}
                        disabled={isC1Gated}
                        onChange={e => updateSupport(index, s => ({
                          mechanicInputs: { ...s.mechanicInputs, [m.id]: e.target.checked ? "1" : "0" }
                        }))}
                      />
                      <span className={`text-[10px] ${isC1Gated ? "text-gray-400 dark:text-zinc-600" : "text-gray-600 dark:text-zinc-300"}`}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}

                {/* Computed buff preview */}
                <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    Computed Buffs
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {preview.sources.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500 dark:text-zinc-400">{s.label}</span>
                        <span className={`font-semibold ${isActive ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-zinc-600"}`}>
                          +{s.stat === "em" || s.stat === "atk" || s.stat === "hp" || s.stat === "def"
                            ? fmt(s.value)
                            : `${fmt(s.value)}%`}
                        </span>
                      </div>
                    ))}
                    {preview.sources.length === 0 && (
                      <span className="text-[10px] text-gray-400 dark:text-zinc-600 italic">No active buffs</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add support button */}
          {supports.length < MAX_SUPPORTS && available.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="flex-1 border rounded px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                defaultValue=""
                onChange={e => {
                  if (e.target.value) {
                    addSupport(e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="" disabled>+ Add Support ({MAX_SUPPORTS - supports.length} remaining)</option>
                {available.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.element})</option>
                ))}
              </select>
            </div>
          )}

          {supports.length >= MAX_SUPPORTS && (
            <div className="text-[10px] text-gray-400 dark:text-zinc-600 text-center italic">
              Maximum {MAX_SUPPORTS} supports reached
            </div>
          )}

          {/* Aggregated team buff summary */}
          {teamResult.sources.length > 0 && (
            <div className="mt-1 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-700">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                Total Team Buffs {!masterEnabled && "(Disabled)"}
              </span>
              <div className="mt-1 space-y-0.5">
                {teamResult.sources.map((s, i) => (
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
