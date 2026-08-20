"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance } from "./types";
import { getInitialStats, hydrateFromBuild } from "./hooks/useCalculatorState";
import { StatsGrid } from "./components/StatsGrid";
import { MechanicsPanel } from "./components/MechanicsPanel";
import { validate } from "@/lib/engine/validation";
import { SUPPORT_CONFIGS, supportById, byId as characterById } from "@/data/registry/characters";
import { resolveSupportCtx, type SupportInstance } from "@/lib/engine/team-buffs";

interface SupportBuildEditorViewProps {
  config: CharacterConfig;
  fromCharacterId?: string | null;
  initialBuild?: { id: string | null; name: string | null; data: unknown } | null;
}

const fmt = (n: number, decimals = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

export const SupportBuildEditorView: React.FC<SupportBuildEditorViewProps> = ({
  config,
  fromCharacterId,
  initialBuild,
}) => {
  const router = useRouter();
  const fromChar = fromCharacterId ? characterById(fromCharacterId) : null;

  // Find support config for this character
  const supportConfig = useMemo(() => {
    return SUPPORT_CONFIGS.find(
      (s) => s.characterId === config.id || s.id === config.id || s.id === `${config.id}-support`
    );
  }, [config.id]);

  const createInitialInstance = (id: string): CalcInstance => {
    const initMechanics: Record<string, string> = {};
    for (const m of config.mechanicDefs ?? []) {
      initMechanics[m.id] = String(m.defaultValue ?? 0);
    }
    for (const m of supportConfig?.mechanicDefs ?? []) {
      if (!(m.id in initMechanics)) {
        initMechanics[m.id] = String(m.defaultValue ?? 0);
      }
    }
    return {
      id,
      stats: getInitialStats(config),
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: initMechanics,
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
      teamBuffsEnabled: false,
    };
  };

  // State
  const [isMounted, setIsMounted] = useState(false);
  const [instances, setInstances] = useState<CalcInstance[]>(() => {
    if (initialBuild?.data) {
      const hyd = hydrateFromBuild(initialBuild.data, createInitialInstance);
      if (hyd && hyd.instances.length > 0) return hyd.instances;
    }
    return [createInitialInstance("1")];
  });

  const [activeInstanceId, setActiveInstanceId] = useState<string>("1");

  // Load from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(`gi_calc_working_draft_${config.id}`);
      if (stored) {
        const draft = JSON.parse(stored);
        if (Array.isArray(draft.instances) && draft.instances.length > 0) {
          setInstances(draft.instances);
          setActiveInstanceId(draft.instances[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load working draft in SupportBuildEditorView:", e);
    }
  }, [config.id]);

  // Auto-save to localStorage on mutation
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    try {
      const existing = localStorage.getItem(`gi_calc_working_draft_${config.id}`);
      let draft: Record<string, unknown> = { instances };
      if (existing) {
        draft = { ...JSON.parse(existing), instances };
      }
      localStorage.setItem(`gi_calc_working_draft_${config.id}`, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save working draft in SupportBuildEditorView:", e);
    }
  }, [instances, config.id, isMounted]);

  // Active instance
  const activeInst = instances.find((i) => i.id === activeInstanceId) ?? instances[0];

  const updateInstance = (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => {
    setInstances((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updater(i) } : i))
    );
  };

  const setStat = (instId: string, statId: string, value: string) => {
    updateInstance(instId, (i) => ({
      stats: { ...i.stats, [statId]: value },
    }));
  };

  const setMechanic = (instId: string, mechId: string, value: string) => {
    updateInstance(instId, (i) => ({
      mechanicInputs: { ...i.mechanicInputs, [mechId]: value },
    }));
  };

  const addSetup = () => {
    if (instances.length >= 3) return;
    const nextNum = instances.length + 1;
    const nextId = String(nextNum);
    const newInst = {
      ...createInitialInstance(nextId),
      stats: { ...activeInst.stats },
      constellationLevel: activeInst.constellationLevel,
      mechanicInputs: { ...activeInst.mechanicInputs },
    };
    setInstances([...instances, newInst]);
    setActiveInstanceId(nextId);
  };

  const deleteSetup = (id: string) => {
    if (instances.length <= 1) return;
    const remaining = instances.filter((i) => i.id !== id);
    setInstances(remaining);
    if (activeInstanceId === id) {
      setActiveInstanceId(remaining[0].id);
    }
  };

  const validation = useMemo(() => {
    if (!activeInst) return { ok: true, errors: {}, general: [] };
    const raw = {
      stats: activeInst.stats,
      hits: activeInst.hits ?? {},
      levels: activeInst.levels ?? {},
      mechanicInputs: activeInst.mechanicInputs ?? {},
      reaction: activeInst.reaction ?? "none",
      reactionBonus: activeInst.reactionBonus ?? "",
      reactionPanelBonus: activeInst.reactionPanelBonus ?? "0",
      lunarBaseBonus: activeInst.lunarBaseBonus ?? "0",
    };
    return validate(config, raw, {});
  }, [activeInst, config]);

  // Build SupportCtx for live preview
  const supportCtx = useMemo(() => {
    if (!activeInst || !supportConfig) return null;
    const supportInst: SupportInstance = {
      supportId: supportConfig.id,
      stats: activeInst.stats,
      mechanicInputs: activeInst.mechanicInputs,
      constellationLevel: activeInst.constellationLevel,
      enabled: true,
      selectedSetupId: activeInst.id,
      selectedSetupName: `Setup ${activeInst.id}`,
    };
    return resolveSupportCtx(supportInst);
  }, [activeInst, supportConfig]);

  // Live computed buffs
  const computedBuffs = useMemo(() => {
    if (!supportCtx || !supportConfig) return [];
    const list: Array<{ label: string; stat: string; value: number }> = [];
    for (const b of supportConfig.buffs) {
      const val = b.compute(supportCtx);
      if (val > 0) {
        list.push({ label: b.label, stat: b.stat, value: val });
      }
    }
    if (supportConfig.lunarBaseBonusCompute) {
      const lb = supportConfig.lunarBaseBonusCompute(supportCtx);
      if (lb > 0) {
        list.push({
          label: `Lunar Base DMG (${supportConfig.name} Moonsign)`,
          stat: "lunarBaseBonusPct",
          value: lb,
        });
      }
    }
    return list;
  }, [supportCtx, supportConfig]);

  // Brief stat pills
  const briefPills = useMemo(() => {
    if (!supportCtx || !supportConfig?.formatBriefStats) return [];
    return supportConfig.formatBriefStats(supportCtx);
  }, [supportCtx, supportConfig]);

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner when navigating from a DPS character */}
      {fromChar && (
        <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🛠️</span>
            <span className="text-xs text-amber-900 dark:text-amber-200 font-medium">
              Editing support build for <strong>{fromChar.name}</strong>'s party
            </span>
          </div>
          <Link
            href={`/characters/${fromCharacterId}`}
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors flex items-center gap-1 bg-amber-200/50 dark:bg-amber-900/60 px-3 py-1 rounded-md"
          >
            ← Back to {fromChar.name} Calculator
          </Link>
        </div>
      )}

      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Support Build Editor
            </span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              {config.element} • {config.rarity}★
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Configure this character's standalone attributes, artifacts, and constellation. Buffs auto-sync to all party members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/characters/${config.id}`}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all flex items-center gap-1 font-medium"
          >
            Switch to DPS Calculator ↗
          </Link>
        </div>
      </header>

      {/* Setup Selector Tabs */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          {instances.map((inst) => {
            const isActive = inst.id === activeInstanceId;
            return (
              <button
                key={inst.id}
                onClick={() => setActiveInstanceId(inst.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border flex items-center gap-2 ${
                  isActive
                    ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                    : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400"
                }`}
              >
                <span>Setup {inst.id}</span>
                {instances.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSetup(inst.id);
                    }}
                    className="hover:text-red-300 transition-colors cursor-pointer text-[10px]"
                    title="Delete this setup"
                  >
                    ✕
                  </span>
                )}
              </button>
            );
          })}

          {instances.length < 3 && (
            <button
              onClick={addSetup}
              className="px-2.5 py-1 text-xs text-gray-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400 border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg transition-all flex items-center gap-1"
              title="Add a new setup variant"
            >
              + Add Setup
            </button>
          )}
        </div>

        <div className="text-[11px] text-gray-400 dark:text-zinc-500 italic">
          Draft auto-saved to local storage
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stats & Mechanics inputs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Constellation & Character Mechanics */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white/50 dark:bg-zinc-900/30 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300 mb-3 flex items-center justify-between">
              <span>Constellations & Active Talents</span>
              <span className="text-[10px] font-normal text-gray-400 dark:text-zinc-500">
                Setup {activeInst.id}
              </span>
            </h2>
            <MechanicsPanel
              inst={activeInst}
              config={config}
              validation={validation}
              updateInstance={updateInstance}
              setMechanic={setMechanic}
            />
          </div>

          {/* Core Attribute Inputs */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white/50 dark:bg-zinc-900/30 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300 mb-3">
              Character & Artifact Attributes
            </h2>
            <StatsGrid
              inst={activeInst}
              config={config}
              validation={validation}
              setStat={setStat}
            />
          </div>
        </div>

        {/* Right Column: Live Provided Team Buffs Output */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-4">
          <div className="border border-amber-300/80 dark:border-amber-700/60 rounded-xl p-4 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800/60 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Provided Team Buffs</span>
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                  Bonuses applied to active DPS character in party
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200">
                C{activeInst.constellationLevel}
              </span>
            </div>

            {/* Brief Stat Pills */}
            {briefPills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {briefPills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium border border-amber-200 dark:border-zinc-700"
                  >
                    <span className="text-gray-400 dark:text-zinc-500">{pill.label}:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{pill.value}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Computed Buff List */}
            <div className="space-y-2">
              {computedBuffs.map((buff, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-amber-200/60 dark:border-amber-800/40"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                    {buff.label}
                  </span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                    +{buff.stat === "em" || buff.stat === "atk" || buff.stat === "hp" || buff.stat === "def"
                      ? fmt(buff.value)
                      : `${fmt(buff.value)}%`}
                  </span>
                </div>
              ))}

              {computedBuffs.length === 0 && (
                <div className="p-4 rounded-lg bg-white/60 dark:bg-zinc-900/40 border border-dashed border-gray-300 dark:border-zinc-700 text-center text-xs text-gray-400 dark:text-zinc-500 italic">
                  No active buffs computed for current stats and toggle settings.
                </div>
              )}
            </div>

            {/* Context Info */}
            <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-800/60 text-[11px] text-gray-500 dark:text-zinc-400 space-y-1">
              <p className="flex items-center gap-1">
                <span>🛡️</span>
                <span><strong>No Nested Team Buffs:</strong> Support calculations use pure standalone attributes.</span>
              </p>
              <p className="flex items-center gap-1">
                <span>🔄</span>
                <span><strong>Auto-Sync:</strong> Changes save instantly and appear in the Team Buffs panel on other characters.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
