"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CharacterConfig, ReactionType } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { computeHit, availableReactions, scalingTotal, type HitResult, type DamageStats } from "@/lib/engine/damage";
import { validate, resolveStats, resolveHitMultipliers, effectiveTalentLevels, hitId, toNum, type RawInputs } from "@/lib/engine/validation";
import { resolveMechanics, type PerHitMods } from "@/lib/engine/mechanics";
import { transformativeDamage, TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL } from "@/lib/engine/transformative";
import { indirectLunarDamage, LUNAR_BY_ELEMENT, LUNAR_LABEL } from "@/lib/engine/lunar";
import { levelMultiplier } from "@/lib/engine/level-multiplier";
import { encodeBuild } from "@/lib/engine/share";
import { resolveTeamBuffs, type TeamBuffSource } from "@/lib/engine/team-buffs";
import { resolveExternalWeaponBuffs } from "@/lib/engine/weapon-buffs";
import { byId as characterById } from "@/data/registry/characters";
import { renderStyledText } from "./calculator/utils/colors";

// Import custom hooks and components
import { useRotation } from "./calculator/hooks/useRotation";
import { useCalculatorState, initialStats } from "./calculator/hooks/useCalculatorState";
import { hydrateFromBuild } from "./calculator/hooks/useCalculatorState";
import type { SavedBuild, CalcInstance, ComputedInstance, RotationStep, StatBuffSource } from "./calculator/types";
import { StatsGrid } from "./calculator/components/StatsGrid";
import { MechanicsPanel } from "./calculator/components/MechanicsPanel";
import { DamageTable } from "./calculator/components/DamageTable";
import { TransformativePanel } from "./calculator/components/TransformativePanel";
import { RotationModal } from "./calculator/components/RotationModal";
import { StatBreakdownRow } from "./calculator/components/StatBreakdownRow";
import { TeamBuffPanel } from "./calculator/components/TeamBuffPanel";
import { ExternalWeaponBuffPanel } from "./calculator/components/ExternalWeaponBuffPanel";


const REACTION_LABEL: Record<ReactionType, string> = {
  none: "None",
  vaporize: "Vaporize",
  melt: "Melt",
  aggravate: "Aggravate",
};

const DIRECT_TAG: Record<"stellar" | "lunar", { label: string; cls: string; title: string }> = {
  stellar: {
    label: "Stellar",
    cls: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300",
    title: "Stellar-Conduct reaction DMG: ignores DMG Bonus% and enemy DEF; EM bonus 6·EM/(EM+2000)",
  },
  lunar: {
    label: "Lunar",
    cls: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300",
    title: "Lunar-Crystallize reaction DMG: ignores DMG Bonus% and enemy DEF; EM bonus 6·EM/(EM+2000)",
  },
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const selectCls = "border px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";

const EFFECTIVE_ROWS: { key: keyof DamageStats; label: string; unit: "flat" | "percent"; hideIfZero?: boolean }[] = [
  { key: "atk", label: "ATK", unit: "flat" },
  { key: "hp", label: "Max HP", unit: "flat" },
  { key: "def", label: "DEF", unit: "flat" },
  { key: "em", label: "EM", unit: "flat" },
  { key: "critRate", label: "CRIT Rate", unit: "percent" },
  { key: "critDmg", label: "CRIT DMG", unit: "percent" },
  { key: "energyRecharge", label: "Energy Recharge", unit: "percent" },
  { key: "healingBonus", label: "Healing Bonus", unit: "percent", hideIfZero: true },
  { key: "dmgBonus", label: "DMG Bonus", unit: "percent" },
  { key: "normalDmgBonus", label: "  └ Normal ATK", unit: "percent", hideIfZero: true },
  { key: "chargedDmgBonus", label: "  └ Charged ATK", unit: "percent", hideIfZero: true },
  { key: "plungeDmgBonus", label: "  └ Plunging ATK", unit: "percent", hideIfZero: true },
  { key: "skillDmgBonus", label: "  └ Elemental Skill", unit: "percent", hideIfZero: true },
  { key: "burstDmgBonus", label: "  └ Elemental Burst", unit: "percent", hideIfZero: true },
  { key: "pyroDmgBonus", label: "Pyro DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "hydroDmgBonus", label: "Hydro DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "dendroDmgBonus", label: "Dendro DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "electroDmgBonus", label: "Electro DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "anemoDmgBonus", label: "Anemo DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "cryoDmgBonus", label: "Cryo DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "geoDmgBonus", label: "Geo DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "physicalDmgBonus", label: "Physical DMG Bonus", unit: "percent", hideIfZero: true },
  { key: "dmgReduction", label: "DMG Reduction / -(DMG Bonus)", unit: "percent", hideIfZero: true },
  { key: "enemyRes", label: "Enemy RES", unit: "percent" },
  { key: "levelChar", label: "Level", unit: "flat" },
  { key: "levelEnemy", label: "Enemy Level", unit: "flat" },
  { key: "defReduction", label: "DEF Reduction", unit: "percent", hideIfZero: true },
  { key: "defIgnore", label: "DEF Ignore", unit: "percent", hideIfZero: true },
];

import { activeEffects, constellationFlatBonus, constellationStatBonuses } from "@/lib/engine/constellations";

export function CharacterCalculator({
  config,
  scaling,
  initialBuild,
  savedBuilds = [],
  isSharedBuild = false,
  fromCharacterId,
}: {
  config: CharacterConfig;
  scaling: TalentScalingData;
  initialBuild?: { id: string | null; name: string | null; data: unknown } | null;
  savedBuilds?: SavedBuild[];
  isSharedBuild?: boolean;
  fromCharacterId?: string | null;
}) {
  const router = useRouter();

  // Create initial instance helper for hydration function
  const createInitialInstance = (id: string): CalcInstance => {
    const initLevels: Record<string, string> = {};
    for (const g of config.talents) {
      const s = scaling[g.type];
      if (s && s.levels.length) initLevels[g.type] = String(s.levels[s.levels.length - 1]);
    }
    const initMechanics: Record<string, string> = {};
    for (const m of config.mechanicDefs ?? []) {
      initMechanics[m.id] = String(m.defaultValue ?? 0);
    }
    return {
      id,
      stats: { ...initialStats },
      hits: {},
      levels: initLevels,
      mechanicInputs: initMechanics,
      reaction: "none",
      reactionBonus: "",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };
  };

  const hydrated = initialBuild?.data ? hydrateFromBuild(initialBuild.data, createInitialInstance) : null;

  // Initialize hooks
  const rotationState = useRotation(hydrated);
  const calcState = useCalculatorState({
    config,
    scaling,
    initialBuild,
    savedBuilds,
    rotations: rotationState.rotations,
    activeRotationId: rotationState.activeRotationId,
    setRotations: rotationState.setRotations,
    setActiveRotationId: rotationState.setActiveRotationId,
    hydrated,
  });

  const {
    instances,
    activeBuildId,
    activeBuildName,
    savedBuildsList,
    isSaveModalOpen,
    setIsSaveModalOpen,
    newBuildName,
    setNewBuildName,
    isLoadDropdownOpen,
    setIsLoadDropdownOpen,
    benchmarkId,
    setBenchmarkId,
    showExtraInfo,
    setShowExtraInfo,
    isSaving,
    saveStatus,
    setSaveStatus,
    isScannerOpen,
    setIsScannerOpen,
    scannerTargetId,
    setScannerTargetId,
    scanImage,
    isScanningImage,
    scanError,
    scanResult,
    isConfirmDiscardOpen,
    setIsConfirmDiscardOpen,
    isExportDropdownOpen,
    setIsExportDropdownOpen,
    isDirty,
    
    // Scan handlers
    applyScanToSetup,
    handleScanDragOver,
    handleScanDrop,
    handleScanFileInputChange,

    // Persistence handlers
    saveChanges,
    handleSaveAsNew,
    loadBuild,
    handleDeleteBuild,
    handleSaveAndSwitch,
    shareBuild,
    importBuild,

    // Modifiers
    addInstance,
    removeInstance,
    updateInstance,
    setMechanic,
    setStat,
    setHit,
    setLevel,
    setReaction,
    setReactionBonus,
  } = calcState;

  const [showSharedBanner, setShowSharedBanner] = useState(isSharedBuild);
  const [isRotationOpen, setIsRotationOpen] = useState(false);
  const [isSelectAttackOpen, setIsSelectAttackOpen] = useState(false);

  const [isSplitView, setIsSplitView] = useState(false);
  const [splitRatio, setSplitRatio] = useState(45);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSplitView(localStorage.getItem("calculator-split-view") === "true");
    }
  }, []);

  const toggleSplitView = () => {
    const newState = !isSplitView;
    setIsSplitView(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("calculator-split-view", String(newState));
    }
  };

  const handleMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    const cardEl = document.getElementById(`setup-card-${cardId}`);
    if (!cardEl) return;
    const startRect = cardEl.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const relativeY = moveEvent.clientY - startRect.top;
      const percentage = Math.max(20, Math.min(80, (relativeY / startRect.height) * 100));
      setSplitRatio(percentage);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const [highlightedSetupId, setHighlightedSetupId] = useState<string | null>(null);

  // Clean up stale ?share=... query from browser history so back button preserves working draft
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("share")) {
      params.delete("share");
      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ""}${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const setupId = params.get("setup");
    if (setupId) {
      setHighlightedSetupId(setupId);
      setTimeout(() => {
        const el = document.getElementById(`setup-card-${setupId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      }, 200);
      setTimeout(() => {
        setHighlightedSetupId(null);
      }, 2500);
    }

    try {
      const savedScroll = sessionStorage.getItem(`gi_calc_scroll_${config.id}`);
      if (savedScroll) {
        const scrollY = parseInt(savedScroll, 10);
        if (!isNaN(scrollY) && scrollY > 0) {
          setTimeout(() => {
            window.scrollTo({ top: scrollY, behavior: "smooth" });
          }, 150);
        }
        sessionStorage.removeItem(`gi_calc_scroll_${config.id}`);
      }
    } catch (e) {}
  }, [config.id]);

  const upperRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lowerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const notesBoxRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [maxNotesHeight, setMaxNotesHeight] = useState<number>(0);

  useEffect(() => {
    const updateMaxHeight = () => {
      let maxH = 0;
      instances.forEach(inst => {
        const el = notesBoxRefs.current[inst.id];
        if (el) {
          const h = el.scrollHeight;
          if (h > maxH) maxH = h;
        }
      });
      setMaxNotesHeight(maxH);
    };

    updateMaxHeight();
    const timer = setTimeout(updateMaxHeight, 50);
    window.addEventListener("resize", updateMaxHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, [instances, config]);

  const handleUpperScroll = (cardId: string, event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    instances.forEach(inst => {
      if (inst.id === cardId) return;
      const target = upperRefs.current[inst.id];
      if (target && target.scrollTop !== scrollTop) {
        target.scrollTop = scrollTop;
      }
    });
  };

  const handleLowerScroll = (cardId: string, event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    instances.forEach(inst => {
      if (inst.id === cardId) return;
      const target = lowerRefs.current[inst.id];
      if (target && target.scrollTop !== scrollTop) {
        target.scrollTop = scrollTop;
      }
    });
  };

  const activeBenchmarkId = benchmarkId || instances[0]?.id;

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

  // Derive all outputs from an instance's inputs
  function computeInstance(inst: CalcInstance): ComputedInstance {
    const raw: RawInputs = {
      stats: inst.stats,
      hits: inst.hits,
      reaction: inst.reaction,
      reactionBonus: inst.reactionBonus,
      mechanicInputs: inst.mechanicInputs,
    };
    const resolved = resolveHitMultipliers(config, scaling, inst.levels, inst.hits, inst.constellationLevel, inst.mechanicInputs);
    const validation = validate(config, raw, resolved);
    if (!validation.ok) {
      return {
        validation,
        results: null,
        extras: null,
        inputStats: null,
        effectiveStats: null,
        rotationTotals: {},
        rotationStepsDmg: {},
        rotationStepsDetails: {},
      };
    }
    const s = resolveStats(raw);
    const inputStats = { ...s };

    const mechInputs: Record<string, number> = {};
    for (const m of config.mechanicDefs ?? []) {
      mechInputs[m.id] = toNum(inst.mechanicInputs[m.id]) ?? 0;
    }
    const mech = resolveMechanics(config, {
      stats: s,
      baseAtk: toNum(inst.stats["atk.base"]) ?? 0,
      baseDef: toNum(inst.stats["def.base"]) ?? 0,
      baseHp: toNum(inst.stats["hp.base"]) ?? 0,
      constellationLevel: inst.constellationLevel,
      talentLevels: effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel, inst.mechanicInputs),
      scaling,
      inputs: mechInputs,
    });

    for (const [key, val] of Object.entries(mech.statDeltas)) {
      if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
    }
    const effects = activeEffects(config, inst.constellationLevel);
    const statBonuses = constellationStatBonuses(effects);
    for (const [key, val] of Object.entries(statBonuses)) {
      if (key in s) (s as unknown as Record<string, number>)[key] += val;
    }

    // Apply team support buffs
    let lunarBaseFromTeam = 0;
    if (inst.teamBuffsEnabled !== false && inst.teamSupports?.length) {
      const teamResult = resolveTeamBuffs(inst.teamSupports, true);
      for (const [key, val] of Object.entries(teamResult.statDeltas)) {
        if (key in s && typeof val === "number") {
          (s as unknown as Record<string, number>)[key] += val;
        }
      }
      lunarBaseFromTeam = teamResult.lunarBaseBonusPct;
    }

    // Apply external weapon team buffs
    if (inst.externalWeaponBuffsEnabled !== false && inst.externalWeapons?.length) {
      const weaponResult = resolveExternalWeaponBuffs(inst.externalWeapons, toNum(inst.stats["atk.base"]) ?? 0, config, true);
      for (const [key, val] of Object.entries(weaponResult.statDeltas)) {
        if (key in s && typeof val === "number") {
          (s as unknown as Record<string, number>)[key] += val;
        }
      }
    }


    const healingBonus = toNum(inst.stats["healingBonus"]) ?? 0;
    const out: Record<string, HitResult> = {};
    config.talents.forEach((g, gi) =>
      g.hits.forEach((h, hi) => {
        const id = hitId(gi, hi);
        const mult = resolved[id] ?? 0;
        const mods: PerHitMods = mech.perHit[h.key] ?? {};
        if (h.kind === "heal" || h.kind === "shield") {
          const flatBonus = constellationFlatBonus(effects, h.key, s) + (mods.flatDmgBonus ?? 0);
          let val = (mult / 100) * scalingTotal(s, h.scaling) + flatBonus;
          if (h.kind === "heal") {
            val *= (1 + healingBonus / 100);
          }
          out[id] = { nonCrit: val, crit: val, avg: val };
          return;
        }
        const flatBonus = constellationFlatBonus(effects, h.key, s) + (mods.flatDmgBonus ?? 0);
        const hitCat = h.hitCategory ?? (g.type as "normal" | "skill" | "burst");
        out[id] = computeHit(s, {
          multiplier: mult,
          scaling: h.scaling,
          element: mods.element ?? h.element ?? config.element,
          reaction: inst.reaction,
          reactionBonusPct: Number(inst.reactionBonus || 0) + (mods.reactionBonusPct ?? 0),
          flatDmgBonus: flatBonus || undefined,
          baseDmgMultiplier: mods.baseDmgMultiplier,
          critDmgBonusPct: mods.critDmgBonusPct,
          critRateBonusPct: mods.critRateBonusPct,
          bonusDmgPct: mods.bonusDmgPct,
          defIgnorePct: mods.defIgnorePct,
          hitCategory: hitCat,
          charElement: config.element,
          dmgBonusLabel: config.dmgBonusLabel,
          directReaction: h.direct ? mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 } : undefined,
        });
      }),
    );

    const panelBonus = toNum(inst.reactionPanelBonus) ?? 0;
    const lunarBase = toNum(inst.lunarBaseBonus) ?? 0;
    const extras = {
      transformative: (TRANSFORMATIVE_BY_ELEMENT[config.element] ?? []).map(type => ({
        type,
        dmg: transformativeDamage(type, s.levelChar, s.em, s.enemyRes, panelBonus),
      })),
      lunar: (LUNAR_BY_ELEMENT[config.element] ?? []).map(type => ({
        type,
        res: indirectLunarDamage(type, s, lunarBase + (mech.lunarBaseBonusPct ?? 0) + lunarBaseFromTeam, panelBonus),
      })),
      notes: mech.notes,
    };

    const rotationTotals: Record<string, number> = {};
    const rotationStepsDmg: Record<string, number[]> = {};
    const rotationStepsDetails: Record<string, HitResult[]> = {};

    for (const r of rotationState.rotations) {
      let total = 0;
      const stepDmgs: number[] = [];
      const stepDetails: HitResult[] = [];

      r.steps.forEach((step: RotationStep) => {
        const effectiveReaction = step.reactionOverride === "default" ? inst.reaction : step.reactionOverride;
        const rawType = step.hitType || "avg";
        const typeKey = (rawType === "non-crit" ? "nonCrit" : rawType) as "nonCrit" | "crit" | "avg";
        const qty = step.quantity ?? 1;

        let res: HitResult | undefined;
        if (effectiveReaction === inst.reaction) {
          res = out[step.targetHitId];
        } else {
          let hitConfig = null;
          let groupType = "normal";
          for (let gi = 0; gi < config.talents.length; gi++) {
            for (let hi = 0; hi < config.talents[gi].hits.length; hi++) {
              if (hitId(gi, hi) === step.targetHitId) {
                hitConfig = config.talents[gi].hits[hi];
                groupType = config.talents[gi].type;
                break;
              }
            }
            if (hitConfig) break;
          }
          if (hitConfig) {
            const mods: PerHitMods = mech.perHit[hitConfig.key] ?? {};
            const flatBonus = constellationFlatBonus(effects, hitConfig.key, s) + (mods.flatDmgBonus ?? 0);
            const hitCat = hitConfig.hitCategory ?? (groupType as "normal" | "skill" | "burst");
            res = computeHit(s, {
              multiplier: resolved[step.targetHitId] ?? 0,
              scaling: hitConfig.scaling,
              element: mods.element ?? config.element,
              reaction: effectiveReaction,
              reactionBonusPct: Number(inst.reactionBonus || 0) + (mods.reactionBonusPct ?? 0),
              flatDmgBonus: flatBonus || undefined,
              baseDmgMultiplier: mods.baseDmgMultiplier,
              critDmgBonusPct: mods.critDmgBonusPct,
              critRateBonusPct: mods.critRateBonusPct,
              bonusDmgPct: mods.bonusDmgPct,
              defIgnorePct: mods.defIgnorePct,
              hitCategory: hitCat,
              charElement: config.element,
              dmgBonusLabel: config.dmgBonusLabel,
              directReaction: hitConfig.direct ? mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 } : undefined,
            });
          }
        }

        const val = (res ? res[typeKey] : 0) * qty;
        total += val;
        stepDmgs.push(val);
        stepDetails.push(res || { nonCrit: 0, crit: 0, avg: 0 });
      });

      rotationTotals[r.id] = total;
      rotationStepsDmg[r.id] = stepDmgs;
      rotationStepsDetails[r.id] = stepDetails;
    }

    return { validation, results: out, extras, inputStats, effectiveStats: s, rotationTotals, rotationStepsDmg, rotationStepsDetails };
  }

  const computedById = new Map(instances.map(i => [i.id, computeInstance(i)]));
  const activeRot = rotationState.rotations.find(r => r.id === rotationState.activeRotationId) || rotationState.rotations[0];

  const buildExportSummary = () => {
    const setups = instances.map((inst, i) => {
      const c = computedById.get(inst.id);
      let headline = 0;
      if (c?.results) {
        config.talents.forEach((g, gi) =>
          g.hits.forEach((h, hi) => {
            if (h.kind === "heal" || h.kind === "shield") return;
            const r = c.results![hitId(gi, hi)];
            if (r) headline = Math.max(headline, r.avg);
          }),
        );
        for (const total of Object.values(c.rotationTotals)) headline = Math.max(headline, total);
      }
      return { label: `Setup ${i + 1}`, headline: Math.round(headline) };
    });
    const topHeadline = setups.reduce((m, s) => Math.max(m, s.headline), 0);
    return { setupCount: instances.length, topHeadline, setups };
  };

  const logExportEvent = (format: string) => {
    // best-effort event logging import/call
    import("@/app/history/actions").then(({ logExport }) => {
      const snapshot = { instances, rotations: rotationState.rotations, activeRotationId: rotationState.activeRotationId };
      logExport(config.id, format as any, activeBuildName, snapshot, buildExportSummary()).catch(() => {});
    });
  };

  const exportAsJson = () => {
    const payload = { instances, rotations: rotationState.rotations, activeRotationId: rotationState.activeRotationId };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gi_calculator_${config.id}_build.json`;
    a.click();
    URL.revokeObjectURL(url);
    logExportEvent("json");
    setSaveStatus("Exported JSON!");
    setIsExportDropdownOpen(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const buildTxtReport = (): string => {
    let text = "";
    text += `==================================================\n`;
    text += `GENSHIN IMPACT DAMAGE CALCULATOR BUILD REPORT\n`;
    text += `Character: ${config.name} (${config.element})\n`;
    text += `Generated on: ${new Date().toLocaleString("en-US")}\n`;
    text += `==================================================\n\n`;

    const headers = ["Category / Stat", ...instances.map((_, idx) => `Setup ${idx + 1}`)];
    text += headers.join("\t") + "\n";
    text += "─".repeat(60) + "\n";

    text += "INPUT STATS\n";
    config.stats.forEach(s => {
      if (s.hasBaseAndFlat) {
        text += `  ${s.label} (Base)\t` + instances.map(inst => inst.stats[`${s.key}.base`] || "0").join("\t") + "\n";
        text += `  ${s.label} (%)\t` + instances.map(inst => `${inst.stats[`${s.key}.percent`] || "0"}%`).join("\t") + "\n";
        text += `  ${s.label} (Flat)\t` + instances.map(inst => inst.stats[`${s.key}.flat`] || "0").join("\t") + "\n";
      } else {
        text += `  ${s.label}\t` + instances.map(inst => {
          const val = inst.stats[s.key] || "0";
          return `${val}${s.unit === "percent" ? "%" : ""}`;
        }).join("\t") + "\n";
      }
    });

    text += "\nEFFECTIVE COMPUTED STATS\n";
    EFFECTIVE_ROWS.forEach(er => {
      if (er.hideIfZero) {
        const hasValue = instances.some(inst => {
          const eff = computedById.get(inst.id)?.effectiveStats?.[er.key] ?? 0;
          return Math.abs(eff) > 0.05;
        });
        if (!hasValue) return;
      }
      text += `  ${er.label}\t` + instances.map(inst => {
        const eff = computedById.get(inst.id)?.effectiveStats?.[er.key] ?? 0;
        return `${eff.toFixed(1)}${er.unit === "percent" ? "%" : ""}`;
      }).join("\t") + "\n";
    });

    text += "\nTALENT LEVELS\n";
    config.talents.forEach(g => {
      text += `  ${g.name} Lv.\t` + instances.map(inst => inst.levels[g.type] || "1").join("\t") + "\n";
    });

    text += "\nTALENT DMG CALCULATIONS (AVG)\n";
    config.talents.forEach((g, gi) => {
      g.hits.forEach((h, hi) => {
        const key = hitId(gi, hi);
        text += `  ${g.name}: ${h.name}\t` + instances.map(inst => {
          const res = computedById.get(inst.id)?.results?.[key];
          if (!res) return "—";
          return h.kind === "heal" ? `+${Math.round(res.nonCrit)} HP` : h.kind === "shield" ? `${Math.round(res.nonCrit)} Shield` : Math.round(res.avg);
        }).join("\t") + "\n";
      });
    });

    text += "\nCOMBO ROTATIONS DMG\n";
    rotationState.rotations.forEach(r => {
      if (r.steps.length === 0) return;
      text += `  Combo: ${r.name}\t` + instances.map(inst => {
        const total = computedById.get(inst.id)?.rotationTotals?.[r.id] ?? 0;
        return Math.round(total);
      }).join("\t") + "\n";
    });

    return text;
  };

  const exportAsTxt = () => {
    const output = buildTxtReport();
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gi_calculator_${config.id}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    logExportEvent("txt");
    setSaveStatus("Exported TXT report!");
    setIsExportDropdownOpen(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const copyAsText = () => {
    const reportText = buildTxtReport();
    navigator.clipboard.writeText(reportText).then(() => {
      setSaveStatus("Copied report text!");
      setIsExportDropdownOpen(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }).catch((err) => {
      console.error(err);
      setSaveStatus("Copy failed");
      setTimeout(() => setSaveStatus(null), 3000);
    });
  };

  const exportAsCsv = () => {
    let csvContent = "";
    const headers = ["Stat / Output Column", ...instances.map((_, idx) => `Setup ${idx + 1}`)];
    csvContent += headers.map(h => `"${h}"`).join(",") + "\n";

    csvContent += `"INPUT STATS"\n`;
    config.stats.forEach(s => {
      if (s.hasBaseAndFlat) {
        const baseRow = [
          `${s.label} (Base)`,
          ...instances.map(inst => inst.stats[`${s.key}.base`] || "0")
        ];
        csvContent += baseRow.map(r => `"${r}"`).join(",") + "\n";

        const percentRow = [
          `${s.label} (%)`,
          ...instances.map(inst => `${inst.stats[`${s.key}.percent`] || "0"}%`)
        ];
        csvContent += percentRow.map(r => `"${r}"`).join(",") + "\n";

        const flatRow = [
          `${s.label} (Flat)`,
          ...instances.map(inst => inst.stats[`${s.key}.flat`] || "0")
        ];
        csvContent += flatRow.map(r => `"${r}"`).join(",") + "\n";
      } else {
        const row = [
          s.label,
          ...instances.map(inst => {
            const val = inst.stats[s.key] || "0";
            return `${val}${s.unit === "percent" ? "%" : ""}`;
          })
        ];
        csvContent += row.map(r => `"${r}"`).join(",") + "\n";
      }
    });

    csvContent += `\n"EFFECTIVE COMPUTED STATS"\n`;
    EFFECTIVE_ROWS.forEach(er => {
      if (er.hideIfZero) {
        const hasValue = instances.some(inst => {
          const eff = computedById.get(inst.id)?.effectiveStats?.[er.key] ?? 0;
          return Math.abs(eff) > 0.05;
        });
        if (!hasValue) return;
      }
      const row = [
        er.label,
        ...instances.map(inst => {
          const eff = computedById.get(inst.id)?.effectiveStats?.[er.key] ?? 0;
          return `${eff.toFixed(1)}${er.unit === "percent" ? "%" : ""}`;
        })
      ];
      csvContent += row.map(r => `"${r}"`).join(",") + "\n";
    });

    csvContent += `\n"TALENT LEVELS"\n`;
    config.talents.forEach(g => {
      const row = [
        `${g.name} Level`,
        ...instances.map(inst => inst.levels[g.type] || "1")
      ];
      csvContent += row.map(r => `"${r}"`).join(",") + "\n";
    });

    csvContent += `\n"DAMAGE CALCULATIONS (AVG)"\n`;
    config.talents.forEach((g, gi) => {
      g.hits.forEach((h, hi) => {
        const key = hitId(gi, hi);
        const row = [
          `${g.name}: ${h.name}`,
          ...instances.map(inst => {
            const res = computedById.get(inst.id)?.results?.[key];
            if (!res) return "—";
            return h.kind === "heal" ? `+${Math.round(res.nonCrit)} HP` : h.kind === "shield" ? `${Math.round(res.nonCrit)} Shield` : Math.round(res.avg);
          })
        ];
        csvContent += row.map(r => `"${r}"`).join(",") + "\n";
      });
    });

    csvContent += `\n"ROTATION COMBO DAMAGE"\n`;
    rotationState.rotations.forEach(r => {
      if (r.steps.length === 0) return;
      const row = [
        `Combo: ${r.name}`,
        ...instances.map(inst => {
          const total = computedById.get(inst.id)?.rotationTotals?.[r.id] ?? 0;
          return Math.round(total);
        })
      ];
      csvContent += row.map(r => `"${r}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gi_calculator_${config.id}_spreadsheet.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logExportEvent("csv");
    setSaveStatus("Exported CSV spreadsheet!");
    setIsExportDropdownOpen(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const exportAsPdf = () => {
    const node = document.getElementById("calculator-setups-container");
    if (!node) return;
    setSaveStatus("Generating PDF...");
    setIsExportDropdownOpen(false);

    const parent = node.parentElement;
    const parentWasDark = parent?.classList.contains("dark");
    if (parent && !parentWasDark) {
      parent.classList.add("dark");
    }
    const nodeWasDark = node.classList.contains("dark");
    if (!nodeWasDark) {
      node.classList.add("dark");
    }

    import("html-to-image")
      .then((htmlToImage) => {
        return htmlToImage.toPng(node, {
          backgroundColor: "#0a0a0a",
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
            width: `${node.scrollWidth}px`,
            height: `${node.scrollHeight}px`,
            overflow: "visible",
          },
          width: node.scrollWidth,
          height: node.scrollHeight,
        });
      })
      .then((dataUrl) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          alert("Please allow popups to save as PDF.");
          return;
        }

        printWindow.document.write(`
          <html>
            <head>
              <title>gi_calculator_${config.id}_builds</title>
              <style>
                @page {
                  size: landscape;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  background-color: #0a0a0a;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
        logExportEvent("pdf");
        setSaveStatus("Exported PDF!");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
        setSaveStatus("PDF export failed");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .finally(() => {
        if (parent && !parentWasDark) {
          parent.classList.remove("dark");
        }
        if (!nodeWasDark) {
          node.classList.remove("dark");
        }
      });
  };

  const exportAsPng = () => {
    const node = document.getElementById("calculator-setups-container");
    if (!node) return;
    setSaveStatus("Generating PNG...");
    setIsExportDropdownOpen(false);

    const parent = node.parentElement;
    const parentWasDark = parent?.classList.contains("dark");
    if (parent && !parentWasDark) {
      parent.classList.add("dark");
    }
    const nodeWasDark = node.classList.contains("dark");
    if (!nodeWasDark) {
      node.classList.add("dark");
    }

    import("html-to-image")
      .then((htmlToImage) => {
        return htmlToImage.toPng(node, {
          backgroundColor: "#0a0a0a",
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
            width: `${node.scrollWidth}px`,
            height: `${node.scrollHeight}px`,
            overflow: "visible",
          },
          width: node.scrollWidth,
          height: node.scrollHeight,
        });
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `gi_calculator_${config.id}_builds.png`;
        link.href = dataUrl;
        link.click();
        logExportEvent("png");
        setSaveStatus("Exported PNG!");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
        setSaveStatus("PNG export failed");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .finally(() => {
        if (parent && !parentWasDark) {
          parent.classList.remove("dark");
        }
        if (!nodeWasDark) {
          node.classList.remove("dark");
        }
      });
  };

  // Resolve "editing support for X" banner context
  const fromCharConfig = fromCharacterId ? characterById(fromCharacterId) : null;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Support editing banner */}
      {fromCharConfig && (
        <div className="shrink-0 mb-3 flex items-center justify-between px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            🛠️ Editing support build for <strong>{fromCharConfig.name}</strong>
          </span>
          <a
            href={`/characters/${fromCharacterId}`}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors flex items-center gap-1"
          >
            ← Back to {fromCharConfig.name} Calculator
          </a>
        </div>
      )}
      <header className="mb-6 shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{config.name}</h1>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Combo:</span>
              <select
                className="bg-transparent border-none text-xs font-semibold py-0.5 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
                value={rotationState.activeRotationId}
                onChange={e => rotationState.setActiveRotationId(e.target.value)}
              >
                {rotationState.rotations.map(r => (
                  <option key={r.id} value={r.id} className="bg-white dark:bg-zinc-950 text-black dark:text-white">
                    {r.name || "Untitled"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="text-[11px] text-gray-550 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer select-none truncate max-w-sm mt-0.5 flex items-center gap-1"
          >
            <span>{config.weapon} · {config.element} · Rarity: {config.rarity}★</span>
            <span className="text-gray-405">•</span>
            <span className="underline">
              {showExtraInfo ? "Hide info" : "Show character details"}
            </span>
            <span className={`inline-block transform transition-transform duration-200 text-gray-400 dark:text-zinc-500 font-mono text-xs ${showExtraInfo ? "rotate-180" : ""}`}>
              ▼
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {saveStatus && (
            <span className="text-xs text-gray-500 font-medium animate-pulse mr-2">
              {saveStatus}
            </span>
          )}
          <button
            onClick={toggleSplitView}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 ${
              isSplitView
                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-extrabold"
                : "border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-black dark:text-white"
            }`}
            title="Toggle split layout for setups"
          >
            <span>{isSplitView ? "🥞 Column View" : "📖 Split View"}</span>
          </button>
          <button
            onClick={() => setIsRotationOpen(true)}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>📋 Rotation Builder</span>
            {rotationState.rotations.length > 0 && (
              <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {rotationState.rotations.length}
              </span>
            )}
          </button>

          {/* Dedicated Support Build Editor Link */}
          <Link
            href={`/characters/${config.id}/support${fromCharacterId ? `?from=${fromCharacterId}` : ""}`}
            className="rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors shadow-xs flex items-center gap-1.5"
            title="Open dedicated Support Build Editor"
          >
            <span>🛡️ Support Editor</span>
          </Link>

          {/* Load Build Dropdown */}
          <div className="relative load-dropdown-container">
            <button
              onClick={() => setIsLoadDropdownOpen(!isLoadDropdownOpen)}
              className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              title="Load a saved build from database"
            >
              <span>📂 {activeBuildName}</span>
              <span className="text-[10px] text-gray-400 font-mono">▼</span>
            </button>
            {isLoadDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-bold text-gray-450 dark:text-zinc-500 px-3 py-1.5 border-b border-gray-100 dark:border-zinc-900 mb-1">
                  SELECT SAVED BUILD
                </div>
                <button
                  onClick={() => {
                    calcState.setActiveBuildId(null);
                    calcState.setActiveBuildName("Scratchpad");
                    setIsLoadDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer ${!activeBuildId ? "text-amber-600 dark:text-amber-400 bg-amber-500/5" : "text-gray-700 dark:text-zinc-300"}`}
                >
                  <span>📝 New Scratchpad Setup</span>
                </button>
                {savedBuildsList.length === 0 ? (
                  <div className="text-xs text-gray-400 dark:text-zinc-650 px-3 py-2 italic text-center">
                    No saved builds yet
                  </div>
                ) : (
                  savedBuildsList.map(b => (
                    <div
                      key={b.id}
                      onClick={() => loadBuild(b)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer ${activeBuildId === b.id ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 font-bold" : "text-gray-700 dark:text-zinc-300"}`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate max-w-[125px]" title={b.name}>{b.name}</span>
                        {b.isOffline ? (
                          <span className="text-[8px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1 py-0.5 border border-zinc-200 dark:border-zinc-700/60 rounded font-mono">Local</span>
                        ) : (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 border border-emerald-500/15 rounded font-mono">Cloud</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDeleteBuild(e, b.id)}
                        className="text-zinc-400 hover:text-red-500 p-0.5 rounded transition-colors"
                        title="Delete this build configuration"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={calcState.saveChanges}
            disabled={isSaving}
            className={
              isDirty
                ? "rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                : "rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            }
            title="Save changes to active build"
          >
            {activeBuildId ? "Save Changes" : "Save Setup"}
          </button>

          {/* Unified Actions Dropdown Group */}
          <div className="relative export-dropdown-container">
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer flex items-center gap-1"
              title="Actions & Export options"
            >
              <span>⚙️ More Actions</span>
              <span className="text-[10px] text-gray-400 font-mono">▼</span>
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setIsExportDropdownOpen(false);
                    document.getElementById("json-import-input")?.click();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📥</span> Import JSON Setup
                </button>
                <button
                  onClick={() => {
                    setIsExportDropdownOpen(false);
                    shareBuild();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">🔗</span> Share Build Link
                </button>
                {activeBuildId && (
                  <button
                    onClick={() => {
                      setIsExportDropdownOpen(false);
                      setNewBuildName(`${activeBuildName} Copy`);
                      setIsSaveModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                    title="Save current configuration as a new separate database entry"
                  >
                    <span className="text-zinc-400">💾</span> Save As New Setup
                  </button>
                )}

                {/* Divider */}
                <div className="border-t border-gray-150 dark:border-zinc-850 my-1.5"></div>

                <button
                  onClick={exportAsJson}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📥</span> Export JSON (.json)
                </button>
                <button
                  onClick={exportAsCsv}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📊</span> Export CSV (.csv)
                </button>
                <button
                  onClick={exportAsTxt}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📄</span> Export TXT (.txt)
                </button>
                <button
                  onClick={copyAsText}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📋</span> Copy as text
                </button>
                <button
                  onClick={exportAsPdf}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">🖨️</span> Save as PDF (.pdf)
                </button>
                <button
                  onClick={exportAsPng}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">🖼️</span> Download PNG (.png)
                </button>
              </div>
            )}
          </div>

          <input
            id="json-import-input"
            type="file"
            accept=".json"
            onChange={importBuild}
            className="hidden"
          />
        </div>
      </header>

      {/* Shared Build Banner */}
      {showSharedBanner && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl p-3.5 flex items-center justify-between text-xs font-semibold shrink-0">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>You are viewing a shared build. Save Changes to save this configuration to your local character build list.</span>
          </span>
          <button
            onClick={() => setShowSharedBanner(false)}
            className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 cursor-pointer px-2 py-0.5 rounded hover:bg-amber-500/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Special Mechanics, Panels, Notes at page level */}
      {showExtraInfo && (config.mechanics?.length || config.panels?.length || config.notes?.length) ? (
        <div className="mb-6 shrink-0 flex flex-wrap gap-8 border-b border-gray-200 dark:border-zinc-800 pb-4 text-xs">
          {config.mechanics?.length ? (
            <div>
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 text-[10px]">Special Mechanics</h3>
              <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-0.5">
                {config.mechanics.map(m => <li key={m}>{m}</li>)}
              </ul>
            </div>
          ) : null}
          {config.panels?.length ? (
            <div>
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 text-[10px]">Panels</h3>
              <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-0.5">
                {config.panels.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ) : null}
          {config.notes?.length ? (
            <div>
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 text-[10px]">Notes</h3>
              <ul className="list-disc pl-4 text-gray-550 dark:text-gray-400 space-y-0.5">
                {config.notes.map(n => <li key={n}>{renderStyledText(n)}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Wiki Talent Descriptions at page level */}
      {showExtraInfo && config.wikiTalents?.length ? (
        <div className="mb-6 shrink-0 border-b border-gray-200 dark:border-zinc-800 pb-6 text-xs max-w-4xl">
          <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 text-[10px]">Wiki Talent Descriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/40 dark:bg-zinc-950/20 border border-gray-150 dark:border-zinc-850 p-5 rounded-xl shadow-2xs">
            {config.wikiTalents.map(t => (
              <div key={t.name} className="space-y-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                  <span>{t.name}</span>
                  <span className="text-[9px] bg-zinc-200 dark:bg-zinc-300 text-black dark:text-zinc-950 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                    {t.type}
                  </span>
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-x-auto pb-4">
        <div id="calculator-setups-container" className="flex gap-6 items-start p-1.5">
          {instances.map((inst, index) => {
            const reactionOptions = availableReactions(config.element);
            const computed = computedById.get(inst.id)!;
            const { validation, results, extras, rotationTotals, inputStats, effectiveStats } = computed;
            const benchmarkResults = computedById.get(activeBenchmarkId)?.results;

            const err = (id: string) => validation.errors[id];
            const inputCls = (id: string, w: string) =>
              `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""}`;
            const baseBenchmarkInst = activeBenchmarkId === inst.id;

            const renderOutputs = () => {
              if (!effectiveStats || !inputStats || !extras) return null;

              const reactionBonusPct = toNum(inst.reactionPanelBonus) ?? 0;
              const emTransformative = (16 * effectiveStats.em) / (effectiveStats.em + 2000) * 100;
              const totalTransformativeBonus = emTransformative + reactionBonusPct;

              const showAmplifying = ["Pyro", "Hydro", "Cryo"].includes(config.element);
              const instReactionBonusPct = Number(inst.reactionBonus || 0);
              const emAmplifyingBonus = (2.78 * effectiveStats.em) / (effectiveStats.em + 1400);
              const getAmpMult = (base: number) => base * (1 + emAmplifyingBonus + instReactionBonusPct / 100);

              const showCatalyze = config.element === "Electro";
              const emCatalyzeBonus = (5 * effectiveStats.em) / (effectiveStats.em + 1200);
              const aggravateFlat = showCatalyze
                ? 1.15 * levelMultiplier(effectiveStats.levelChar) * (1 + emCatalyzeBonus + instReactionBonusPct / 100)
                : 0;

              const handleFormulaRedirectWithAnchor = (targetAnchorId?: string) => {
                const payload = { instances, rotations: rotationState.rotations, activeRotationId: rotationState.activeRotationId };
                const encoded = encodeBuild(payload);
                const hash = targetAnchorId ? `#${targetAnchorId}` : "";
                let modeParam = "";
                if (typeof window !== "undefined") {
                  try {
                    sessionStorage.setItem(`gi_calc_scroll_${config.id}`, window.scrollY.toString());
                    const storedMode = localStorage.getItem("gi_calc_dmg_type");
                    if (storedMode) modeParam = `&mode=${storedMode}`;
                  } catch (e) {}
                }
                router.push(`/characters/${config.id}/formula?share=${encoded}&setup=${inst.id}${modeParam}${hash}`);
              };

              return (
                <div className="space-y-4">
                  {/* Reaction selector */}
                  <section className="mb-2">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Reaction</h2>
                    {reactionOptions.length > 1 ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <select className={selectCls} value={inst.reaction}
                          onChange={e => {
                            const newRx = e.target.value as ReactionType;
                            setReaction(inst.id, newRx);
                            if (newRx !== "none" && (!inst.reactionBonus || inst.reactionBonus.trim() === "")) {
                              setReactionBonus(inst.id, "0");
                            }
                          }}>
                          {reactionOptions.map(r => (
                            <option key={r} value={r} className="bg-white dark:bg-zinc-800 text-black dark:text-white">
                              {REACTION_LABEL[r]}
                            </option>
                          ))}
                        </select>
                        {inst.reaction !== "none" ? (
                          <label className="flex items-center gap-2 text-sm select-none">
                            Reaction Bonus %
                            <input className={inputCls("reactionBonus", "w-24")} type="number"
                              value={inst.reactionBonus}
                              onChange={e => setReactionBonus(inst.id, e.target.value)} />
                            {err("reactionBonus") ? <span className="text-xs text-red-655">{err("reactionBonus")}</span> : null}
                          </label>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-405">No hit-attached reaction available for {config.element}.</p>
                    )}
                  </section>

                  {instances.length > 1 && (
                    <div className="mb-2 select-none">
                      <button
                        onClick={() => setBenchmarkId(inst.id)}
                        disabled={baseBenchmarkInst}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-sm ${baseBenchmarkInst
                          ? "bg-gray-100 text-gray-400 dark:bg-zinc-800/40 dark:text-zinc-650 cursor-not-allowed border border-gray-200 dark:border-zinc-850"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                          }`}
                      >
                        Compare This
                      </button>
                    </div>
                  )}

                  {!validation.ok && (
                    <span className="text-xs text-red-655 block mb-2 select-none">
                      {Object.keys(validation.errors).length} field(s) need attention.
                    </span>
                  )}

                  {/* Remastered Effective stats panel box */}
                  <div className="mb-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-3 shadow-2xs select-none">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                        Effective Stats & Buff Breakdown
                      </h2>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                        Formula: Raw + Additions = Total
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* Base & Combat Stats Breakdown */}
                      {EFFECTIVE_ROWS.map(row => {
                        const raw = inputStats[row.key] ?? 0;
                        const total = effectiveStats[row.key] ?? 0;
                        const delta = total - raw;

                        const additions: StatBuffSource[] = [];

                        // Add mechanics sources
                        const parsedInputs: Record<string, number> = {};
                        if (inst.mechanicInputs) {
                          for (const [k, v] of Object.entries(inst.mechanicInputs)) {
                            parsedInputs[k] = Number(v) || 0;
                          }
                        }

                        const mechResult = resolveMechanics(config, {
                          stats: inputStats,
                          baseAtk: toNum(inst.stats["atk.base"]) ?? 800,
                          baseDef: toNum(inst.stats["def.base"]) ?? 500,
                          baseHp: toNum(inst.stats["hp.base"]) ?? 15000,
                          constellationLevel: inst.constellationLevel,
                          talentLevels: effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel, inst.mechanicInputs),
                          scaling,
                          inputs: parsedInputs,
                        });

                        if (mechResult.statBuffSources?.[row.key]) {
                          additions.push(...mechResult.statBuffSources[row.key]);
                        }

                        // Add constellation stat bonuses
                        if (config.constellations) {
                          for (const c of config.constellations) {
                            if (c.level <= inst.constellationLevel) {
                              for (const e of c.effects) {
                                if (e.type === "stat_bonus" && e.statKey === row.key && e.statValue) {
                                  additions.push({
                                    source: `C${c.level} (${c.name})`,
                                    value: e.statValue,
                                    description: c.description || `Grants +${e.statValue} ${row.label}`,
                                  });
                                }
                              }
                            }
                          }
                        }

                        // Add team support buff sources
                        if (inst.teamBuffsEnabled !== false && inst.teamSupports?.length) {
                          const teamRes = resolveTeamBuffs(inst.teamSupports, true);
                          for (const src of teamRes.sources) {
                            if (src.stat === row.key) {
                              additions.push({
                                source: `${src.supportName} (Team)`,
                                value: src.value,
                                description: src.label,
                              });
                            }
                          }
                        }

                        // Add external weapon buff sources
                        if (inst.externalWeaponBuffsEnabled !== false && inst.externalWeapons?.length) {
                          const weaponRes = resolveExternalWeaponBuffs(inst.externalWeapons, toNum(inst.stats["atk.base"]) ?? 0, config, true);
                          for (const src of weaponRes.sources) {
                            if (src.stat === row.key) {
                              additions.push({
                                source: `${src.weaponName} (Weapon)`,
                                value: src.value,
                                description: src.label,
                              });
                            }
                          }
                        }


                        // Generic fallback addition if total differs from raw but no source was explicitly captured
                        const recordedSum = additions.reduce((acc, curr) => acc + curr.value, 0);
                        const unrecordedDelta = delta - recordedSum;
                        if (Math.abs(unrecordedDelta) > 0.05) {
                          additions.push({
                            source: "Character Mechanics / Trait Buff",
                            value: unrecordedDelta,
                            description: "Special state or active passive mechanic modifier",
                          });
                        }

                        return (
                          <StatBreakdownRow
                            key={row.key}
                            name={row.label}
                            unit={row.unit}
                            raw={raw}
                            additions={additions}
                            total={total}
                            hideIfZero={row.hideIfZero}
                          />
                        );
                      })}

                      {/* Reaction Multipliers & Reaction Buff Rows */}
                      <StatBreakdownRow
                        name="Transformative Reaction Bonus"
                        unit="percent"
                        raw={emTransformative}
                        additions={
                          reactionBonusPct > 0
                            ? [{ source: "Panel Reaction Bonus", value: reactionBonusPct, description: "Direct reaction bonus input" }]
                            : []
                        }
                        total={totalTransformativeBonus}
                      />

                      {showAmplifying && config.element === "Pyro" && (
                        <>
                          <StatBreakdownRow
                            name="Vaporize Multiplier"
                            unit="multiplier"
                            raw={1.5}
                            additions={[
                              ...(emAmplifyingBonus > 0
                                ? [{ source: "EM Amplifying Bonus", value: 1.5 * emAmplifyingBonus, description: "Amplifying EM bonus multiplier" }]
                                : []),
                              ...(instReactionBonusPct > 0
                                ? [{ source: "Panel Reaction Bonus%", value: 1.5 * (instReactionBonusPct / 100), description: "Panel reaction bonus modifier" }]
                                : []),
                            ]}
                            total={getAmpMult(1.5)}
                          />
                          <StatBreakdownRow
                            name="Melt Multiplier"
                            unit="multiplier"
                            raw={2.0}
                            additions={[
                              ...(emAmplifyingBonus > 0
                                ? [{ source: "EM Amplifying Bonus", value: 2.0 * emAmplifyingBonus, description: "Amplifying EM bonus multiplier" }]
                                : []),
                              ...(instReactionBonusPct > 0
                                ? [{ source: "Panel Reaction Bonus%", value: 2.0 * (instReactionBonusPct / 100), description: "Panel reaction bonus modifier" }]
                                : []),
                            ]}
                            total={getAmpMult(2.0)}
                          />
                        </>
                      )}

                      {showAmplifying && config.element === "Hydro" && (
                        <StatBreakdownRow
                          name="Vaporize Multiplier"
                          unit="multiplier"
                          raw={2.0}
                          additions={[
                            ...(emAmplifyingBonus > 0
                              ? [{ source: "EM Amplifying Bonus", value: 2.0 * emAmplifyingBonus, description: "Amplifying EM bonus multiplier" }]
                              : []),
                            ...(instReactionBonusPct > 0
                              ? [{ source: "Panel Reaction Bonus%", value: 2.0 * (instReactionBonusPct / 100), description: "Panel reaction bonus modifier" }]
                              : []),
                          ]}
                          total={getAmpMult(2.0)}
                        />
                      )}

                      {showAmplifying && config.element === "Cryo" && (
                        <StatBreakdownRow
                          name="Melt Multiplier"
                          unit="multiplier"
                          raw={1.5}
                          additions={[
                            ...(emAmplifyingBonus > 0
                              ? [{ source: "EM Amplifying Bonus", value: 1.5 * emAmplifyingBonus, description: "Amplifying EM bonus multiplier" }]
                              : []),
                            ...(instReactionBonusPct > 0
                              ? [{ source: "Panel Reaction Bonus%", value: 1.5 * (instReactionBonusPct / 100), description: "Panel reaction bonus modifier" }]
                              : []),
                          ]}
                          total={getAmpMult(1.5)}
                        />
                      )}

                      {showCatalyze && (
                        <StatBreakdownRow
                          name="Aggravate Flat DMG Bonus"
                          unit="flat"
                          raw={1.15 * levelMultiplier(effectiveStats.levelChar)}
                          additions={
                            emCatalyzeBonus > 0 || instReactionBonusPct > 0
                              ? [
                                  {
                                    source: "EM Catalyze & Panel Reaction Bonus",
                                    value: aggravateFlat - 1.15 * levelMultiplier(effectiveStats.levelChar),
                                    description: "Level base scaling * (1 + EM bonus% + panel reaction bonus%)",
                                  },
                                ]
                              : []
                          }
                          total={aggravateFlat}
                        />
                      )}

                      {toNum(inst.lunarBaseBonus) ? (
                        <StatBreakdownRow
                          name="Lunar Reaction Base DMG Bonus"
                          unit="percent"
                          raw={0}
                          additions={[
                            {
                              source: "Moonsign Benediction / Panel Input",
                              value: toNum(inst.lunarBaseBonus) || 0,
                              description: "Lunar reaction base DMG bonus %",
                            },
                          ]}
                          total={toNum(inst.lunarBaseBonus) || 0}
                        />
                      ) : null}
                    </div>
                  </div>

                  {extras.notes.length > 0 ? (
                    <div
                      ref={el => { notesBoxRefs.current[inst.id] = el; }}
                      style={{ minHeight: maxNotesHeight > 0 ? `${maxNotesHeight}px` : undefined }}
                      className="mb-3 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5 select-none flex flex-col justify-start transition-[min-height] duration-150"
                    >
                      {extras.notes.map(n => (
                        <p key={n} className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">• {renderStyledText(n)}</p>
                      ))}
                    </div>
                  ) : maxNotesHeight > 0 ? (
                    <div
                      style={{ minHeight: `${maxNotesHeight}px` }}
                      className="mb-3 rounded-lg border border-transparent p-2.5 opacity-0 pointer-events-none select-none aria-hidden='true'"
                    />
                  ) : null}

                  {validation.general.map(g => (
                    <p key={g} className="mb-2 text-xs text-amber-600 select-none">{g}</p>
                  ))}

                  {/* Talent table list rendering */}
                  <DamageTable
                    inst={inst}
                    config={config}
                    scaling={scaling}
                    results={results}
                    benchmarkResults={benchmarkResults}
                    showPct={instances.length > 1}
                    validation={validation}
                    setLevel={setLevel}
                    setHit={setHit}
                    onFormulaRedirect={handleFormulaRedirectWithAnchor}
                  />

                  {/* Transformative Reaction lists */}
                  <TransformativePanel
                    inst={inst}
                    config={config}
                    extras={extras}
                    validation={validation}
                    updateInstance={updateInstance}
                    onFormulaRedirect={handleFormulaRedirectWithAnchor}
                  />

                  {/* Rotation Average summaries */}
                  <div className="mt-5 border-t border-gray-200 dark:border-zinc-800 pt-3 select-none">
                    <h3 className="font-semibold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Combo Rotations DMG</h3>
                    <div className="space-y-1.5">
                      {rotationState.rotations.map(r => {
                        if (r.steps.length === 0) return null;
                        const isSelected = r.id === rotationState.activeRotationId;
                        const total = rotationTotals[r.id] ?? 0;
                        const benchmarkTotal = benchmarkResults ? (computedById.get(activeBenchmarkId)?.rotationTotals?.[r.id] ?? 0) : 0;
                        return (
                          <div
                            key={r.id}
                            className={`text-xs flex items-center justify-between gap-4 font-semibold leading-tight py-1.5 px-2.5 rounded-lg border transition-all ${
                              isSelected
                                ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold"
                                : "bg-transparent border-transparent text-gray-500 dark:text-zinc-350"
                            }`}
                          >
                            <span className="truncate max-w-[240px]">{r.name || "Combo"}:</span>
                            <div className="flex flex-col items-end leading-none">
                              <span className="tabular-nums font-mono mb-0.5">{fmt(total)}</span>
                              {(() => {
                                if (instances.length <= 1 || benchmarkTotal === 0) return null;
                                const pct = (total / benchmarkTotal) * 100;
                                let colorClass = "text-gray-400 dark:text-zinc-500";
                                if (pct < 99.95) {
                                  colorClass = "text-red-500 dark:text-red-400 font-semibold";
                                } else if (pct > 100.05) {
                                  colorClass = "text-green-500 dark:text-green-400 font-semibold";
                                }
                                return (
                                  <span className={`text-[9px] ${colorClass}`}>
                                    {pct.toFixed(1)}%
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })}
                      {rotationState.rotations.every(r => r.steps.length === 0) && (
                        <p className="text-[10px] text-gray-405 dark:text-zinc-500 italic">No rotations built yet. Open the Rotation Builder above to get started.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div
                key={inst.id}
                id={`setup-card-${inst.id}`}
                className={`shrink-0 border rounded-xl p-5 shadow-xs flex flex-col transition-all bg-white/50 dark:bg-zinc-900/30 w-[480px] ${
                  isSplitView ? "h-[700px]" : ""
                } ${
                  highlightedSetupId === inst.id
                    ? "border-amber-500 ring-2 ring-amber-500 shadow-md"
                    : baseBenchmarkInst
                    ? "border-zinc-400 dark:border-zinc-500 ring-1 ring-zinc-400 dark:ring-zinc-500 bg-white/80 dark:bg-zinc-900/40"
                    : "border-gray-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-3 mb-4 shrink-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Setup {index + 1}</span>
                      {baseBenchmarkInst && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                          Benchmark
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        calcState.setScannerTargetId(inst.id);
                        calcState.setIsScannerOpen(true);
                        calcState.setScanImage(null);
                        calcState.setScanResult(null);
                        calcState.setScanError(null);
                      }}
                      className="text-xs text-zinc-555 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-250 font-semibold cursor-pointer flex items-center gap-0.5"
                      title="Scan stats from screenshot"
                    >
                      <span>📷 Scan</span>
                    </button>
                    {instances.length > 1 && (
                      <button
                        onClick={() => removeInstance(inst.id)}
                        className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold cursor-pointer border-l border-gray-250 dark:border-zinc-800 pl-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {isSplitView ? (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Top Section: Input Settings */}
                    <div
                      ref={el => { upperRefs.current[inst.id] = el; }}
                      onScroll={(e) => handleUpperScroll(inst.id, e)}
                      style={{ height: `${splitRatio}%` }}
                      className="overflow-y-auto shrink-0 pb-2 flex flex-col gap-4 no-scrollbar"
                    >
                      {/* Constellation & Mechanics selectors */}
                      <MechanicsPanel
                        inst={inst}
                        config={config}
                        validation={validation}
                        updateInstance={updateInstance}
                        setMechanic={setMechanic}
                      />

                      {/* Team Buffs panel (hidden in support edit mode to prevent recursion) */}
                      {!fromCharacterId && (
                        <TeamBuffPanel
                          inst={inst}
                          updateInstance={updateInstance}
                          dpsCharacterId={config.id}
                        />
                      )}

                      {/* External Weapon Buffs panel */}
                      {!fromCharacterId && (
                        <ExternalWeaponBuffPanel
                          config={config}
                          inst={inst}
                          updateInstance={updateInstance}
                        />
                      )}

                      {/* Core attribute tables */}
                      <StatsGrid
                        inst={inst}
                        config={config}
                        validation={validation}
                        setStat={setStat}
                      />
                    </div>

                    {/* Draggable Horizontal Splitter Divider */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, inst.id)}
                      className="h-1.5 hover:h-2 bg-gray-200/80 hover:bg-amber-400 dark:bg-zinc-800/80 dark:hover:bg-amber-500 cursor-row-resize my-1 rounded-full transition-all flex items-center justify-center shrink-0 z-10 group"
                      title="Drag to adjust section heights"
                    >
                      <div className="w-8 h-0.5 bg-gray-400 dark:bg-zinc-650 group-hover:bg-white rounded-full transition-colors"></div>
                    </div>

                    {/* Bottom Section: Output & Calculations */}
                    <div
                      ref={el => { lowerRefs.current[inst.id] = el; }}
                      onScroll={(e) => handleLowerScroll(inst.id, e)}
                      style={{ height: `${100 - splitRatio - 2}%` }}
                      className="overflow-y-auto shrink-0 pt-2 flex flex-col gap-4 no-scrollbar"
                    >
                      {renderOutputs()}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 flex-1">
                    {/* Constellation & Mechanics selectors */}
                    <MechanicsPanel
                      inst={inst}
                      config={config}
                      validation={validation}
                      updateInstance={updateInstance}
                      setMechanic={setMechanic}
                    />

                    {/* Team Buffs panel (hidden in support edit mode to prevent recursion) */}
                    {!fromCharacterId && (
                      <TeamBuffPanel
                        inst={inst}
                        updateInstance={updateInstance}
                        dpsCharacterId={config.id}
                      />
                    )}

                    {/* External Weapon Buffs panel */}
                    {!fromCharacterId && (
                      <ExternalWeaponBuffPanel
                        config={config}
                        inst={inst}
                        updateInstance={updateInstance}
                      />
                    )}

                    {/* Core attribute tables */}
                    <StatsGrid
                      inst={inst}
                      config={config}
                      validation={validation}
                      setStat={setStat}
                    />


                    {renderOutputs()}
                  </div>
                )}
              </div>
            );
          })}

          {instances.length < 3 && (
            <div className="w-[200px] shrink-0 sticky top-6 no-print">
              <div
                onClick={addInstance}
                className="border-2 border-dashed border-gray-300 dark:border-zinc-800 hover:border-amber-500/60 dark:hover:border-amber-500/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/40 dark:bg-zinc-900/10 hover:bg-gray-50/30 dark:hover:bg-zinc-900/20 group transition-all duration-200 select-none shadow-xs"
                title="Add a new setup column to compare stats"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">➕</span>
                <span className="font-bold text-xs text-gray-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors">Add Setup</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rotation Builder Dialog Overlay popup */}
      <RotationModal
        isRotationOpen={isRotationOpen}
        setIsRotationOpen={setIsRotationOpen}
        isSelectAttackOpen={isSelectAttackOpen}
        setIsSelectAttackOpen={setIsSelectAttackOpen}
        instances={instances}
        activeBenchmarkId={activeBenchmarkId}
        setBenchmarkId={setBenchmarkId}
        rotations={rotationState.rotations}
        activeRotationId={rotationState.activeRotationId}
        setActiveRotationId={(id) => rotationState.setActiveRotationId(id)}
        addRotation={rotationState.addRotation}
        deleteRotation={rotationState.deleteRotation}
        updateActiveRotation={rotationState.updateActiveRotation}
        moveStep={rotationState.moveStep}
        rotationNextId={rotationState.rotationNextId}
        setRotationNextId={rotationState.setRotationNextId}
        draggedIndex={rotationState.draggedIndex}
        setDraggedIndex={(idx) => rotationState.setDraggedIndex(idx)}
        config={config}
        computedById={computedById}
      />

      {/* Unsaved Navigation Discard dialog modal */}
      {isConfirmDiscardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-150 dark:border-zinc-850 shrink-0">
              <div className="flex items-center gap-2 text-amber-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">Unsaved Changes</h3>
              </div>
              <button
                onClick={() => setIsConfirmDiscardOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer text-xs font-bold font-mono"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                You have unsaved work on the calculator page for <span className="font-bold text-gray-800 dark:text-zinc-200">{config.name}</span>. Moving to another page will discard all unsaved edits.
              </p>
            </div>
            <div className="px-5 py-3 border-t border-gray-150 dark:border-zinc-850 shrink-0 flex items-center justify-end gap-2 bg-gray-50/50 dark:bg-zinc-900/10 rounded-b-2xl">
              <button
                onClick={() => setIsConfirmDiscardOpen(false)}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                Keep Editing
              </button>
              <button
                onClick={() => {
                  calcState.setSavedJson(JSON.stringify({ instances, rotations: rotationState.rotations, activeRotationId: rotationState.activeRotationId }));
                  setIsConfirmDiscardOpen(false);
                  router.push(calcState.pendingNavigationHref);
                }}
                disabled={isSaving}
                className="rounded-lg bg-red-650 hover:bg-red-650/90 text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                Discard & Switch
              </button>
              <button
                onClick={handleSaveAndSwitch}
                disabled={isSaving}
                className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save & Switch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save build configuration popup dialog */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 w-[400px] shadow-2xl animate-in zoom-in-95 duration-200 text-black dark:text-white">
            <h3 className="text-base font-bold text-black dark:text-white mb-2">Save Build Configuration</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">
              Enter a name for this build setup to save it to the database library.
            </p>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500 mb-5"
              placeholder="e.g. Hu Tao Vaporize Shimenawa"
              value={newBuildName}
              onChange={e => setNewBuildName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSaveAsNew(newBuildName);
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900 text-black dark:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveAsNew(newBuildName)}
                disabled={!newBuildName.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden OCR screenshot scanner selector */}
      <input
        id="screenshot-file-input"
        type="file"
        accept="image/*"
        onChange={handleScanFileInputChange}
        className="hidden"
      />

      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-150 dark:border-zinc-850 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">
                  Scan Stats from Screenshot - Setup {instances.findIndex(i => i.id === scannerTargetId) + 1}
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                  Auto-fill stat inputs by uploading a screenshot of the in-game Attributes or Enka.network details card
                </p>
              </div>
              <button
                onClick={() => {
                  calcState.setIsScannerOpen(false);
                  calcState.setScanImage(null);
                  calcState.setScanResult(null);
                  calcState.setScanError(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer text-xs font-bold font-mono"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-h-[70vh]">
              {!scanImage && (
                <div
                  onClick={() => document.getElementById("screenshot-file-input")?.click()}
                  onDragOver={handleScanDragOver}
                  onDrop={handleScanDrop}
                  className="border-2 border-dashed border-gray-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-650 rounded-xl p-10 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[260px] bg-gray-50/25 dark:bg-zinc-900/10 group"
                >
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">📸</span>
                  <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Drag & drop a screenshot here, or click to upload
                  </p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mb-4 max-w-sm leading-relaxed">
                    You can also copy a screenshot image directly to your clipboard and press <kbd className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-gray-250 dark:border-zinc-700 font-mono text-[10px]">Ctrl+V</kbd> on this page.
                  </p>
                  <span className="text-[10px] bg-zinc-150 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded font-bold uppercase tracking-wider">
                    Supports character detail sheets
                  </span>
                </div>
              )}

              {scanImage && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 flex flex-col items-center gap-4">
                    <div className="relative border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[220px] w-full shadow-inner">
                      <img
                        src={scanImage}
                        alt="Pasted screenshot preview"
                        className="max-h-[280px] object-contain rounded"
                      />
                      {isScanningImage && (
                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse border-y-2 border-emerald-500 flex flex-col items-center justify-center">
                          <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-lg">
                            Analyzing image...
                          </span>
                        </div>
                      )}
                    </div>

                    {isScanningImage && (
                      <div className="w-full space-y-1.5 text-center">
                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 animate-pulse">
                          Gemini is reading the screen stats...
                        </p>
                        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-2/3 animate-[loading_1.5s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    )}

                    {!isScanningImage && (
                      <button
                        onClick={() => {
                          calcState.setScanImage(null);
                          calcState.setScanResult(null);
                          calcState.setScanError(null);
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔄 Try another screenshot</span>
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    {scanError && (
                      <div className="bg-red-550/10 border border-red-500/20 text-red-500 dark:text-red-400 p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">Scan Error</h4>
                        <p className="text-xs leading-relaxed">{scanError}</p>
                      </div>
                    )}

                    {scanResult && (() => {
                      const targetInst = instances.find(i => i.id === scannerTargetId);
                      if (!targetInst) return null;
                      
                      const showDiff = (scanned: string | number, current: string | number) => {
                        const sc = String(scanned).trim();
                        const cu = String(current).trim();
                        return sc !== "0" && sc !== "" && sc !== cu;
                      };

                      return (
                        <div className="space-y-3 animate-in fade-in duration-350">
                          <div className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                            <span className="flex items-center gap-1.5">
                              <span>✨</span>
                              <span>Detected: <strong className="font-bold">{scanResult.characterName || "Character"}</strong> (Lv. {scanResult.levelChar || "90"})</span>
                            </span>
                          </div>

                          <div className="border border-gray-200/60 dark:border-zinc-850 rounded-xl overflow-hidden shadow-2xs">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-150 dark:border-zinc-850">
                                  <th className="py-2 px-3 font-normal">Stat Name</th>
                                  <th className="py-2 px-3 font-normal">Current</th>
                                  <th className="py-2 px-3 font-normal">Scanned Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-150 dark:divide-zinc-850/60">
                                {scanResult.levelChar && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">Character Level</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">{targetInst.stats.levelChar}</td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.levelChar}</span>
                                        {showDiff(scanResult.levelChar, targetInst.stats.levelChar) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {(scanResult.hpBase || scanResult.hpFlat) && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">HP (Base + Flat)</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">
                                      {targetInst.stats["hp.base"] ?? 0} + {targetInst.stats["hp.flat"] ?? 0}
                                    </td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.hpBase ?? "0"} + {scanResult.hpFlat ?? "0"}</span>
                                        {(showDiff(scanResult.hpBase, targetInst.stats["hp.base"]) || showDiff(scanResult.hpFlat, targetInst.stats["hp.flat"])) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {(scanResult.atkBase || scanResult.atkFlat) && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">ATK (Base + Flat)</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">
                                      {targetInst.stats["atk.base"] ?? 0} + {targetInst.stats["atk.flat"] ?? 0}
                                    </td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.atkBase ?? "0"} + {scanResult.atkFlat ?? "0"}</span>
                                        {(showDiff(scanResult.atkBase, targetInst.stats["atk.base"]) || showDiff(scanResult.atkFlat, targetInst.stats["atk.flat"])) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {(scanResult.defBase || scanResult.defFlat) && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">DEF (Base + Flat)</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">
                                      {targetInst.stats["def.base"] ?? 0} + {targetInst.stats["def.flat"] ?? 0}
                                    </td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.defBase ?? "0"} + {scanResult.defFlat ?? "0"}</span>
                                        {(showDiff(scanResult.defBase, targetInst.stats["def.base"]) || showDiff(scanResult.defFlat, targetInst.stats["def.flat"])) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {scanResult.em && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">Elemental Mastery</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">{targetInst.stats.em}</td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.em}</span>
                                        {showDiff(scanResult.em, targetInst.stats.em) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {scanResult.critRate && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">CRIT Rate %</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">{targetInst.stats.critRate}%</td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.critRate}%</span>
                                        {showDiff(scanResult.critRate, targetInst.stats.critRate) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {scanResult.critDmg && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">CRIT DMG %</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">{targetInst.stats.critDmg}%</td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.critDmg}%</span>
                                        {showDiff(scanResult.critDmg, targetInst.stats.critDmg) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {scanResult.energyRecharge && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">Energy Recharge %</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">{targetInst.stats.energyRecharge}%</td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.energyRecharge}%</span>
                                        {showDiff(scanResult.energyRecharge, targetInst.stats.energyRecharge) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {scanResult.dmgBonus && (
                                  <tr className="hover:bg-gray-50/10 dark:hover:bg-zinc-900/5 transition-colors">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-zinc-350">All DMG Bonus%</td>
                                    <td className="py-2 px-3 text-gray-400 tabular-nums">{targetInst.stats.dmgBonus}%</td>
                                    <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                      <div className="flex items-center justify-between">
                                        <span>{scanResult.dmgBonus}%</span>
                                        {showDiff(scanResult.dmgBonus, targetInst.stats.dmgBonus) && (
                                          <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded font-mono font-bold">New</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-gray-150 dark:border-zinc-850 shrink-0 flex items-center justify-end gap-2 bg-gray-50/50 dark:bg-zinc-900/10">
              <button
                onClick={() => {
                  calcState.setIsScannerOpen(false);
                  calcState.setScanImage(null);
                  calcState.setScanResult(null);
                  calcState.setScanError(null);
                }}
                className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-black dark:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {scanResult && scannerTargetId && (
                <button
                  onClick={() => applyScanToSetup(scannerTargetId, scanResult)}
                  className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 transition-colors cursor-pointer shadow-sm"
                >
                  Apply Stats to Setup {instances.findIndex(i => i.id === scannerTargetId) + 1}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
