"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CharacterConfig, ReactionType, StatField, ConstellationEffect, MechanicDef, ScalingSource } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { computeHit, availableReactions, scalingTotal, type HitResult, type DamageStats } from "@/lib/engine/damage";
import { validate, resolveStats, resolveHitMultipliers, effectiveTalentLevels, hitId, toNum, type RawInputs } from "@/lib/engine/validation";
import { resolveMechanics, type PerHitMods } from "@/lib/engine/mechanics";
import { transformativeDamage, TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL, type TransformativeType } from "@/lib/engine/transformative";
import { indirectLunarDamage, LUNAR_BY_ELEMENT, LUNAR_LABEL, type LunarType, type LunarResult } from "@/lib/engine/lunar";
import { saveBuildForCharacter } from "@/app/builds/actions";
import { encodeBuild } from "@/lib/engine/share";

// Excel-style stat panel wired to the pure damage engine.
// Fill every field, pick a talent level (where data exists) or type a multiplier,
// choose a reaction — every hit's Non-Crit / CRIT / Average damage recomputes live
// on each change (no Calculate button).
const GROUPS: { key: StatField["group"]; label: string }[] = [
  { key: "base", label: "Base Stats" },
  { key: "combat", label: "Combat Stats" },
  { key: "advanced", label: "Advanced Stats" },
  { key: "defense", label: "Target Stats" },
];

const REACTION_LABEL: Record<ReactionType, string> = {
  none: "None",
  vaporize: "Vaporize",
  melt: "Melt",
  aggravate: "Aggravate",
};

// Fixed locale: results now render during SSR too, and the server's locale can
// differ from the browser's (e.g. "2.047" vs "2,047" → hydration mismatch).
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const selectCls = "border px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";

// Attributes shown in the "Effective Stats" panel — the values actually used to
// compute damage after talent toggles + constellations (e.g. Hu Tao's Paramita ATK).
const EFFECTIVE_ROWS: { key: keyof DamageStats; label: string; unit: "flat" | "percent" }[] = [
  { key: "atk", label: "ATK", unit: "flat" },
  { key: "hp", label: "Max HP", unit: "flat" },
  { key: "def", label: "DEF", unit: "flat" },
  { key: "em", label: "EM", unit: "flat" },
  { key: "critRate", label: "CRIT Rate", unit: "percent" },
  { key: "critDmg", label: "CRIT DMG", unit: "percent" },
  { key: "dmgBonus", label: "DMG Bonus", unit: "percent" },
];

interface ReactionExtras {
  transformative: { type: TransformativeType; dmg: number }[];
  lunar: { type: LunarType; res: LunarResult }[];
  notes: string[]; // computed mechanic lines (Paramita ATK, Masque flat DMG, heals, …)
}

interface CalcInstance {
  id: string;
  stats: Record<string, string>;
  hits: Record<string, string>;
  levels: Record<string, string>;
  mechanicInputs: Record<string, string>; // MechanicDef.id -> raw value ("1"/"0" for toggles)
  reaction: ReactionType;
  reactionBonus: string;
  reactionPanelBonus: string; // Reaction Bonus % applied to the transformative/lunar panel
  lunarBaseBonus: string;     // Lunar Reaction Base DMG Bonus % (Moonsign passives)
  constellationLevel: number;
}

interface RotationStep {
  id: string;
  targetHitId: string;                    // hitId(gi, hi) e.g. "0:0"
  reactionOverride: ReactionType | "default";
}

interface SavedRotation {
  id: string;
  name: string;
  description: string;
  steps: RotationStep[];
}

// Results derived from an instance's inputs on every render (no stored results).
interface ComputedInstance {
  validation: ReturnType<typeof validate>;
  results: Record<string, HitResult> | null; // null while inputs are invalid
  extras: ReactionExtras | null;
  inputStats: DamageStats | null;             // stats as entered (before mechanic/constellation deltas)
  effectiveStats: DamageStats | null;         // stats actually used for damage (after deltas)
  rotationTotals: Record<string, number>;      // rotationId -> total damage
  rotationStepsDmg: Record<string, number[]>;  // rotationId -> step damage array
}

// Collect all active constellation effects up to the given level.
function activeEffects(config: CharacterConfig, level: number): ConstellationEffect[] {
  if (!config.constellations) return [];
  return config.constellations
    .filter(c => c.level <= level)
    .flatMap(c => c.effects);
}

// Compute flat DMG bonus for a specific hit key from constellation effects.
function constellationFlatBonus(
  effects: ConstellationEffect[],
  hitKey: string,
  stats: DamageStats,
): number {
  let bonus = 0;
  for (const e of effects) {
    if (e.type === "flat_dmg_bonus" && e.affectedHitKeys?.includes(hitKey)) {
      const base = e.bonusScaling ? scalingTotal(stats, e.bonusScaling) : 0;
      bonus += base * (e.bonusPercent ?? 0) / 100;
    }
  }
  return bonus;
}

// Compute stat bonuses from constellation effects.
function constellationStatBonuses(effects: ConstellationEffect[]): Record<string, number> {
  const bonuses: Record<string, number> = {};
  for (const e of effects) {
    if (e.type === "stat_bonus" && e.statKey) {
      bonuses[e.statKey] = (bonuses[e.statKey] ?? 0) + (e.statValue ?? 0);
    }
  }
  return bonuses;
}

const initialStats = {
  "hp.base": "0",
  "hp.percent": "0",
  "hp.flat": "15000",
  "atk.base": "0",
  "atk.percent": "0",
  "atk.flat": "1500",
  "def.base": "0",
  "def.percent": "0",
  "def.flat": "800",
  "critRate": "70",
  "critDmg": "140",
  "dmgBonus": "46.6",
  "em": "0",
  "energyRecharge": "100",
  "healingBonus": "0",
  "dmgReduction": "0",
  "enemyRes": "10",
  "levelChar": "90",
  "levelEnemy": "100",
  "defReduction": "0",
  "defIgnore": "0",
};

export function CharacterCalculator({
  config,
  scaling,
  initialBuild,
  isSharedBuild = false,
}: {
  config: CharacterConfig;
  scaling: TalentScalingData;
  initialBuild?: { data: unknown } | null;
  isSharedBuild?: boolean;
}) {
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

  // Backward-compatible hydration: supports plain array (oldest), single rotation object (old), and multiple rotations (new).
  function hydrateFromBuild(data: unknown): { instances: CalcInstance[]; rotations: SavedRotation[]; activeRotationId: string } {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const d = data as {
        rotations?: unknown; rotationSteps?: unknown; instances?: CalcInstance[];
        activeRotationId?: string; description?: string;
      };
      if (Array.isArray(d.rotations)) {
        return {
          instances: (d.instances ?? [createInitialInstance("1")]) as CalcInstance[],
          rotations: d.rotations as SavedRotation[],
          activeRotationId: (d.activeRotationId ?? ((d.rotations as SavedRotation[])[0]?.id || "")) as string,
        };
      }
      if (Array.isArray(d.rotationSteps)) {
        const legacyRot: SavedRotation = {
          id: "legacy-rotation",
          name: "Combo 1",
          description: (d.description ?? "") as string,
          steps: d.rotationSteps as RotationStep[],
        };
        return {
          instances: (d.instances ?? [createInitialInstance("1")]) as CalcInstance[],
          rotations: [legacyRot],
          activeRotationId: "legacy-rotation",
        };
      }
    }
    if (Array.isArray(data) && data.length > 0) {
      return {
        instances: data as CalcInstance[],
        rotations: [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }],
        activeRotationId: "combo-1",
      };
    }
    return {
      instances: [createInitialInstance("1")],
      rotations: [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }],
      activeRotationId: "combo-1",
    };
  }

  const hydrated = initialBuild?.data ? hydrateFromBuild(initialBuild.data) : null;

  const [instances, setInstances] = useState<CalcInstance[]>(
    () => hydrated?.instances ?? [createInitialInstance("1")]
  );
  const [rotations, setRotations] = useState<SavedRotation[]>(
    () => hydrated?.rotations ?? [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }]
  );
  const [activeRotationId, setActiveRotationId] = useState<string>(
    () => hydrated?.activeRotationId ?? (hydrated?.rotations?.[0]?.id ?? "combo-1")
  );
  
  const [savedJson, setSavedJson] = useState<string>(() => {
    const payload = {
      instances: hydrated?.instances ?? [createInitialInstance("1")],
      rotations: hydrated?.rotations ?? [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }],
      activeRotationId: hydrated?.activeRotationId ?? "combo-1",
    };
    return JSON.stringify(payload);
  });
  const [benchmarkId, setBenchmarkId] = useState<string | null>(null);
  const [nextId, setNextId] = useState(() => {
    const insts = hydrated?.instances ?? [];
    if (insts.length > 0) {
      const ids = insts.map(i => Number(i.id) || 0);
      return Math.max(...ids, 0) + 1;
    }
    return 2;
  });
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isRotationOpen, setIsRotationOpen] = useState(false);
  const [isSelectAttackOpen, setIsSelectAttackOpen] = useState(false);
  const [rotationNextId, setRotationNextId] = useState(() => {
    const allSteps = (hydrated?.rotations ?? []).flatMap(r => r.steps);
    if (allSteps.length > 0) {
      const ids = allSteps.map(s => Number(s.id) || 0);
      return Math.max(...ids, 0) + 1;
    }
    return 1;
  });

  const currentPayload = () => JSON.stringify({ instances, rotations, activeRotationId });
  const isDirty = currentPayload() !== savedJson;

  const router = useRouter();
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState("");

  // Warn before browser unload (reload/tab close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Intercept client-side routing links click events on this page
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (!isDirty) return;

      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:") && !e.defaultPrevented) {
          e.preventDefault();
          e.stopPropagation();
          setPendingNavigationHref(href);
          setIsConfirmDiscardOpen(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [isDirty]);

  const saveChanges = async () => {
    setIsSaving(true);
    setSaveStatus("Saving...");
    try {
      const payload = { instances, rotations, activeRotationId };
      await saveBuildForCharacter(config.id, payload);
      setSavedJson(JSON.stringify(payload));
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.error(e);
      setSaveStatus("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndSwitch = async () => {
    setIsSaving(true);
    setSaveStatus("Saving...");
    try {
      const payload = { instances, rotations, activeRotationId };
      await saveBuildForCharacter(config.id, payload);
      setSavedJson(JSON.stringify(payload));
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(null), 3000);
      setIsConfirmDiscardOpen(false);
      router.push(pendingNavigationHref);
    } catch (e) {
      console.error(e);
      setSaveStatus("Failed to save");
      alert("Failed to save changes. Please try again or discard edits.");
    } finally {
      setIsSaving(false);
    }
  };

  const [showSharedBanner, setShowSharedBanner] = useState(isSharedBuild);

  const shareBuild = () => {
    const payload = { instances, rotations, activeRotationId };
    const encoded = encodeBuild(payload);
    if (!encoded) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSaveStatus("Copied share link!");
      setTimeout(() => setSaveStatus(null), 3000);
    }).catch((err) => {
      console.error(err);
      setSaveStatus("Failed to copy link");
      setTimeout(() => setSaveStatus(null), 3000);
    });
  };

  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Close export dropdown when clicking outside
  useEffect(() => {
    if (!isExportDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".export-dropdown-container")) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isExportDropdownOpen]);

  const exportAsJson = () => {
    const payload = { instances, rotations, activeRotationId };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gi_calculator_${config.id}_build.json`;
    a.click();
    URL.revokeObjectURL(url);
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

    // Headers Row
    const headers = ["Category / Stat", ...instances.map((_, idx) => `Setup ${idx + 1}`)];
    text += headers.join("\t") + "\n";
    text += "─".repeat(60) + "\n";

    // Section: Input Stats
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

    // Section: Effective Stats
    text += "\nEFFECTIVE COMPUTED STATS\n";
    EFFECTIVE_ROWS.forEach(er => {
      text += `  ${er.label}\t` + instances.map(inst => {
        const eff = computedById.get(inst.id)?.effectiveStats?.[er.key] ?? 0;
        return `${eff.toFixed(1)}${er.unit === "percent" ? "%" : ""}`;
      }).join("\t") + "\n";
    });

    // Section: Talent Levels
    text += "\nTALENT LEVELS\n";
    config.talents.forEach(g => {
      text += `  ${g.name} Lv.\t` + instances.map(inst => inst.levels[g.type] || "1").join("\t") + "\n";
    });

    // Section: Talent Hit Calculations (Avg)
    text += "\nTALENT DMG CALCULATIONS (AVG)\n";
    config.talents.forEach((g, gi) => {
      g.hits.forEach((h, hi) => {
        const key = hitId(gi, hi);
        text += `  ${g.name}: ${h.name}\t` + instances.map(inst => {
          const res = computedById.get(inst.id)?.results?.[key];
          if (!res) return "—";
          return h.kind === "heal" ? `+${Math.round(res.nonCrit)} HP` : Math.round(res.avg);
        }).join("\t") + "\n";
      });
    });

    // Section: Combo Rotations
    text += "\nCOMBO ROTATIONS DMG\n";
    rotations.forEach(r => {
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
            return h.kind === "heal" ? `+${Math.round(res.nonCrit)} HP` : Math.round(res.avg);
          })
        ];
        csvContent += row.map(r => `"${r}"`).join(",") + "\n";
      });
    });

    csvContent += `\n"ROTATION COMBO DAMAGE"\n`;
    rotations.forEach(r => {
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
    setSaveStatus("Exported CSV spreadsheet!");
    setIsExportDropdownOpen(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const exportAsPdf = () => {
    const node = document.getElementById("calculator-setups-container");
    if (!node) return;
    setSaveStatus("Generating PDF...");
    setIsExportDropdownOpen(false);

    // Force dark class on setups container wrapper to force dark mode styles
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
        // Open a new print window with the image fitted to it
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
        setSaveStatus("Exported PDF!");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
        setSaveStatus("PDF export failed");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .finally(() => {
        // Restore class configurations
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

    // Force dark class on setups container wrapper to force dark mode styles
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
        setSaveStatus("Exported PNG!");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
        setSaveStatus("PNG export failed");
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .finally(() => {
        // Restore class configurations
        if (parent && !parentWasDark) {
          parent.classList.remove("dark");
        }
        if (!nodeWasDark) {
          node.classList.remove("dark");
        }
      });
  };

  const importBuild = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const hydratedData = hydrateFromBuild(data);
        setInstances(hydratedData.instances);
        setRotations(hydratedData.rotations);
        setActiveRotationId(hydratedData.activeRotationId);
        setSaveStatus("Imported build!");
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to parse JSON file. Please make sure it's a valid calculator build export.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Clear input selection so same file can be re-imported
  };

  const addRotation = () => {
    const newId = `rot-${Date.now()}`;
    const newRot: SavedRotation = {
      id: newId,
      name: `Combo ${rotations.length + 1}`,
      description: "Custom rotation sequence",
      steps: [],
    };
    setRotations(prev => [...prev, newRot]);
    setActiveRotationId(newId);
  };

  const deleteRotation = (idToDelete: string) => {
    if (rotations.length <= 1) return;
    const index = rotations.findIndex(r => r.id === idToDelete);
    const newRotations = rotations.filter(r => r.id !== idToDelete);
    setRotations(newRotations);
    if (activeRotationId === idToDelete) {
      const nextActiveIndex = index === 0 ? 0 : index - 1;
      setActiveRotationId(newRotations[nextActiveIndex].id);
    }
  };

  const updateActiveRotation = (updater: (rot: SavedRotation) => Partial<SavedRotation>) => {
    setRotations(prev => prev.map(r => r.id === activeRotationId ? { ...r, ...updater(r) } : r));
  };



  const addInstance = () => {
    if (instances.length >= 3) return;
    const last = instances[instances.length - 1];
    const newInst: CalcInstance = {
      id: String(nextId),
      stats: { ...last.stats },
      hits: { ...last.hits },
      levels: { ...last.levels },
      mechanicInputs: { ...last.mechanicInputs },
      reaction: last.reaction,
      reactionBonus: last.reactionBonus,
      reactionPanelBonus: last.reactionPanelBonus,
      lunarBaseBonus: last.lunarBaseBonus,
      constellationLevel: last.constellationLevel,
    };
    setInstances(s => [...s, newInst]);
    setNextId(n => n + 1);
  };

  const removeInstance = (id: string) => {
    if (instances.length <= 1) return;
    setInstances(s => s.filter(inst => inst.id !== id));
    if (benchmarkId === id) {
      setBenchmarkId(null);
    }
  };

  const updateInstance = (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => {
    setInstances(prev =>
      prev.map(inst => {
        if (inst.id !== id) return inst;
        return {
          ...inst,
          ...updater(inst),
        };
      })
    );
  };

  const setMechanic = (instId: string, mechId: string, v: string) => {
    updateInstance(instId, inst => ({
      mechanicInputs: { ...inst.mechanicInputs, [mechId]: v },
    }));
  };

  const setStat = (instId: string, statId: string, v: string) => {
    updateInstance(instId, inst => ({
      stats: { ...inst.stats, [statId]: v },
    }));
  };

  const setHit = (instId: string, hitId: string, v: string) => {
    updateInstance(instId, inst => ({
      hits: { ...inst.hits, [hitId]: v },
    }));
  };

  const setLevel = (instId: string, type: string, v: string) => {
    updateInstance(instId, inst => ({
      levels: { ...inst.levels, [type]: v },
    }));
  };

  const setReaction = (instId: string, r: ReactionType) => {
    updateInstance(instId, () => ({
      reaction: r,
    }));
  };

  const setReactionBonus = (instId: string, v: string) => {
    updateInstance(instId, () => ({
      reactionBonus: v,
    }));
  };

  const activeBenchmarkId = benchmarkId || instances[0]?.id;

  const renderPct = (currentVal: number, benchmarkVal: number | undefined) => {
    if (instances.length < 2) return null;
    if (benchmarkVal === undefined || benchmarkVal === 0) return null;
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

  // Derive all outputs from an instance's inputs — runs on every render, so results
  // update immediately on any change. Returns null results while inputs are invalid.
  function computeInstance(inst: CalcInstance): ComputedInstance {
    const raw: RawInputs = { stats: inst.stats, hits: inst.hits, reaction: inst.reaction, reactionBonus: inst.reactionBonus, mechanicInputs: inst.mechanicInputs };
    const resolved = resolveHitMultipliers(config, scaling, inst.levels, inst.hits, inst.constellationLevel);
    const validation = validate(config, raw, resolved);
    if (!validation.ok) {
      return { validation, results: null, extras: null, inputStats: null, effectiveStats: null, rotationTotals: {}, rotationStepsDmg: {} };
    }
    const s = resolveStats(raw);
    const inputStats = { ...s }; // snapshot before mechanic + constellation stat deltas

    // Character mechanics (Masque/BoL, Paramita, Draconic stacks, Dark-Shattering, …)
    // computed from the pre-delta stats, then merged with constellation effects.
    const mechInputs: Record<string, number> = {};
    for (const m of config.mechanicDefs ?? []) {
      mechInputs[m.id] = toNum(inst.mechanicInputs[m.id]) ?? 0;
    }
    const mech = resolveMechanics(config, {
      stats: s,
      baseAtk: toNum(inst.stats["atk.base"]) ?? 0,
      constellationLevel: inst.constellationLevel,
      talentLevels: effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel),
      scaling,
      inputs: mechInputs,
    });

    // Apply stat deltas: mechanics first, then generic constellation stat bonuses.
    for (const [key, val] of Object.entries(mech.statDeltas)) {
      if (key in s && typeof val === "number") (s as unknown as Record<string, number>)[key] += val;
    }
    const effects = activeEffects(config, inst.constellationLevel);
    const statBonuses = constellationStatBonuses(effects);
    for (const [key, val] of Object.entries(statBonuses)) {
      if (key in s) (s as unknown as Record<string, number>)[key] += val;
    }

    const healingBonus = toNum(inst.stats["healingBonus"]) ?? 0;
    const out: Record<string, HitResult> = {};
    config.talents.forEach((g, gi) =>
      g.hits.forEach((h, hi) => {
        const id = hitId(gi, hi);
        const mult = resolved[id] ?? 0;
        if (h.kind === "heal") {
          // Healing rows: mult% × stat × (1 + Healing Bonus). No crit.
          const heal = (mult / 100) * scalingTotal(s, h.scaling) * (1 + healingBonus / 100);
          out[id] = { nonCrit: heal, crit: heal, avg: heal };
          return;
        }
        const mods: PerHitMods = mech.perHit[h.key] ?? {};
        const flatBonus = constellationFlatBonus(effects, h.key, s) + (mods.flatDmgBonus ?? 0);
        out[id] = computeHit(s, {
          multiplier: mult,
          scaling: h.scaling,
          element: config.element,
          reaction: inst.reaction,
          reactionBonusPct: Number(inst.reactionBonus || 0),
          flatDmgBonus: flatBonus || undefined,
          baseDmgMultiplier: mods.baseDmgMultiplier,
          critDmgBonusPct: mods.critDmgBonusPct,
          critRateBonusPct: mods.critRateBonusPct,
          bonusDmgPct: mods.bonusDmgPct,
        });
      }),
    );

    // Standalone reaction outputs (transformative + indirect lunar) from final stats.
    const panelBonus = toNum(inst.reactionPanelBonus) ?? 0;
    const lunarBase = toNum(inst.lunarBaseBonus) ?? 0;
    const extras: ReactionExtras = {
      transformative: TRANSFORMATIVE_BY_ELEMENT[config.element].map(type => ({
        type,
        dmg: transformativeDamage(type, s.levelChar, s.em, s.enemyRes, panelBonus),
      })),
      lunar: LUNAR_BY_ELEMENT[config.element].map(type => ({
        type,
        res: indirectLunarDamage(type, s, lunarBase, panelBonus),
      })),
      notes: mech.notes,
    };

    // Calculate rotation damage for all rotations
    const rotationTotals: Record<string, number> = {};
    const rotationStepsDmg: Record<string, number[]> = {};

    for (const r of rotations) {
      let total = 0;
      const stepDmgs = r.steps.map(step => {
        const effectiveReaction = step.reactionOverride === "default" ? inst.reaction : step.reactionOverride;
        if (effectiveReaction === inst.reaction) {
          const res = out[step.targetHitId];
          const val = res ? res.avg : 0;
          total += val;
          return val;
        } else {
          let hitConfig: { key: string; scaling: ScalingSource } | null = null;
          for (let gi = 0; gi < config.talents.length; gi++) {
            for (let hi = 0; hi < config.talents[gi].hits.length; hi++) {
              if (hitId(gi, hi) === step.targetHitId) {
                hitConfig = config.talents[gi].hits[hi];
                break;
              }
            }
            if (hitConfig) break;
          }
          if (!hitConfig) return 0;
          const mods: PerHitMods = mech.perHit[hitConfig.key] ?? {};
          const flatBonus = constellationFlatBonus(effects, hitConfig.key, s) + (mods.flatDmgBonus ?? 0);
          const res = computeHit(s, {
            multiplier: resolved[step.targetHitId] ?? 0,
            scaling: hitConfig.scaling,
            element: config.element,
            reaction: effectiveReaction,
            reactionBonusPct: Number(inst.reactionBonus || 0),
            flatDmgBonus: flatBonus || undefined,
            baseDmgMultiplier: mods.baseDmgMultiplier,
            critDmgBonusPct: mods.critDmgBonusPct,
            critRateBonusPct: mods.critRateBonusPct,
            bonusDmgPct: mods.bonusDmgPct,
          });
          total += res.avg;
          return res.avg;
        }
      });
      rotationTotals[r.id] = total;
      rotationStepsDmg[r.id] = stepDmgs;
    }

    return { validation, results: out, extras, inputStats, effectiveStats: s, rotationTotals, rotationStepsDmg };
  }

  // Computed once per render for all setups (benchmark comparisons read from here too).
  const computedById = new Map(instances.map(i => [i.id, computeInstance(i)]));
  const activeRot = rotations.find(r => r.id === activeRotationId) || rotations[0];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="mb-6 shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{config.name}</h1>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Combo:</span>
              <select
                className="bg-transparent border-none text-xs font-semibold py-0.5 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
                value={activeRotationId}
                onChange={e => setActiveRotationId(e.target.value)}
              >
                {rotations.map(r => (
                  <option key={r.id} value={r.id} className="bg-white dark:bg-zinc-950 text-black dark:text-white">
                    {r.name || "Untitled"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 cursor-pointer select-none transition-colors mt-1"
            title="Click to toggle special mechanics, panels, and notes"
          >
            <span>
              {config.rarity}★ · {config.element} · {config.weapon} · scales off {config.scalingSource.toUpperCase()} ·
              ascension stat: {config.ascensionStat.label} (max {config.ascensionStat.maxValue}%)
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
            onClick={() => setIsRotationOpen(true)}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>📋 Rotation Builder</span>
            {rotations.length > 0 && (
              <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {rotations.length}
              </span>
            )}
          </button>
          <button
            onClick={shareBuild}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer"
            title="Copy shareable link containing current configuration to clipboard"
          >
            🔗 Share
          </button>
          {/* Export Dropdown Group */}
          <div className="relative export-dropdown-container">
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer flex items-center gap-1"
              title="Export configuration or results in various formats"
            >
              <span>📤 Export</span>
              <span className="text-[10px] text-gray-400 font-mono">▼</span>
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={exportAsJson}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📥</span> JSON Configuration (.json)
                </button>
                <button
                  onClick={exportAsCsv}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📊</span> CSV Spreadsheet (.csv)
                </button>
                <button
                  onClick={exportAsTxt}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <span className="text-zinc-400">📄</span> Text Report Summary (.txt)
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
                  <span className="text-zinc-400">🖼️</span> Download PNG Image (.png)
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
          <button
            onClick={() => document.getElementById("json-import-input")?.click()}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm cursor-pointer"
            title="Import configuration from local JSON file"
          >
            📥 Import
          </button>
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className={
              isDirty
                ? "rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                : "rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-semibold text-black dark:text-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            }
          >
            Save Changes
          </button>
          <button
            onClick={addInstance}
            disabled={instances.length >= 3}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            + Add Setup ({instances.length}/3)
          </button>
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
              <ul className="list-disc pl-4 text-gray-500 dark:text-gray-400 space-y-0.5">
                {config.notes.map(n => <li key={n}>{n}</li>)}
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
            const { validation, results, extras, rotationTotals, inputStats, effectiveStats } = computedById.get(inst.id)!;
            const benchmarkResults = computedById.get(activeBenchmarkId)?.results;

            const err = (id: string) => validation.errors[id];
            const inputCls = (id: string, w: string) =>
              `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""}`;

            const baseBenchmarkInst = activeBenchmarkId === inst.id;

            return (
              <div
                key={inst.id}
                className={`w-[420px] shrink-0 border rounded-xl p-5 shadow-xs flex flex-col transition-all bg-white/50 dark:bg-zinc-900/30 ${baseBenchmarkInst
                    ? "border-zinc-400 dark:border-zinc-500 ring-1 ring-zinc-400 dark:ring-zinc-500 bg-white/80 dark:bg-zinc-900/40"
                    : "border-gray-200 dark:border-zinc-800"
                  }`}
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-3 mb-4">
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
                  {instances.length > 1 && (
                    <button
                      onClick={() => removeInstance(inst.id)}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Constellation selector */}
                {config.constellations?.length ? (
                  <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Constellation</h2>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4, 5, 6].map(lvl => {
                        const active = inst.constellationLevel >= lvl;
                        const isInfo = lvl > 0 && config.constellations!.find(c => c.level === lvl)?.effects.every(e => e.type === "informational");
                        return (
                          <button
                            key={lvl}
                            onClick={() => updateInstance(inst.id, () => ({ constellationLevel: inst.constellationLevel === lvl ? lvl - 1 : lvl }))}
                            title={lvl === 0 ? "No constellation" : `C${lvl}: ${config.constellations!.find(c => c.level === lvl)?.name ?? ""}`}
                            className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer transition-all border ${active
                                ? isInfo
                                  ? "bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 border-zinc-400 dark:border-zinc-500"
                                  : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                                : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                              }`}
                          >
                            C{lvl}
                          </button>
                        );
                      })}
                    </div>
                    {inst.constellationLevel > 0 && (
                      <details className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 group">
                        <summary className="cursor-pointer font-semibold list-none flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-350 select-none">
                          <span>Show Constellation Details</span>
                          <span className="text-[8px] transform group-open:rotate-180 transition-transform duration-200">▼</span>
                        </summary>
                        <div className="mt-1.5 space-y-1 pl-1 border-l border-zinc-200 dark:border-zinc-800">
                          {config.constellations!.filter(c => c.level <= inst.constellationLevel).map(c =>
                            <span key={c.level} className="block leading-normal">
                              <span className="font-bold text-zinc-700 dark:text-zinc-300">C{c.level} ({c.name})</span>: {c.description}
                            </span>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                ) : null}

                {/* Character mechanics (registry-driven controls; math in engine/mechanics.ts) */}
                {config.mechanicDefs?.length ? (
                  <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Mechanics</h2>
                    <div className="space-y-2">
                      {config.mechanicDefs.map((m: MechanicDef) => {
                        const val = inst.mechanicInputs[m.id] ?? "0";
                        return (
                          <div key={m.id} className="flex flex-col gap-1" title={m.hint}>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{m.label}</span>
                              {m.control === "toggle" ? (
                                <input type="checkbox" className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                                  checked={Number(val) > 0}
                                  onChange={e => setMechanic(inst.id, m.id, e.target.checked ? "1" : "0")} />
                              ) : m.control === "stacks" ? (
                                <div className="flex gap-1">
                                  {Array.from({ length: (m.max ?? 3) + 1 }, (_, i) => (
                                    <button key={i}
                                      onClick={() => setMechanic(inst.id, m.id, String(i))}
                                      className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer transition-all border ${Number(val) === i
                                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                                          : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                                        }`}>
                                      {i}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <input className={inputCls(`mech.${m.id}`, "w-20")} type="number" min={0} max={m.max}
                                  value={val} onChange={e => setMechanic(inst.id, m.id, e.target.value)} />
                              )}
                            </div>
                            {err(`mech.${m.id}`) ? (
                              <span className="text-xs text-red-600 text-right">{err(`mech.${m.id}`)}</span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {GROUPS.map(group => {
                  const fields = config.stats.filter(f => f.group === group.key);
                  if (fields.length === 0) return null;
                  return (
                    <section key={group.key} className="mb-4">
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{group.label}</h2>
                      <div className="grid grid-cols-1 gap-2">
                        {fields.map(f => {
                          const baseErr = err(`${f.key}.base`) || err(`${f.key}.flat`) || err(`${f.key}.percent`);
                          const singleErr = err(f.key);
                          return (
                            <label key={f.key} className="flex flex-col gap-1 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors">
                              <span className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</span>
                                {f.hasBaseAndFlat ? (
                                  <span className="flex items-center gap-1">
                                    <input className={inputCls(`${f.key}.base`, "w-16")} type="number" placeholder="Base"
                                      value={inst.stats[`${f.key}.base`] ?? ""}
                                      onChange={e => setStat(inst.id, `${f.key}.base`, e.target.value)} />
                                    <span className="text-gray-400 dark:text-gray-500">+</span>
                                    <div className="relative">
                                      <input className={inputCls(`${f.key}.percent`, "w-16 pr-4")} type="number" placeholder="%"
                                        value={inst.stats[`${f.key}.percent`] ?? ""}
                                        onChange={e => setStat(inst.id, `${f.key}.percent`, e.target.value)} />
                                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none">%</span>
                                    </div>
                                    <span className="text-gray-400 dark:text-gray-500">+</span>
                                    <input className={inputCls(`${f.key}.flat`, "w-16")} type="number" placeholder="Flat"
                                      value={inst.stats[`${f.key}.flat`] ?? ""}
                                      onChange={e => setStat(inst.id, `${f.key}.flat`, e.target.value)} />
                                  </span>
                                ) : (
                                  <input className={inputCls(f.key, "w-24")} type="number"
                                    value={inst.stats[f.key] ?? ""}
                                    onChange={e => setStat(inst.id, f.key, e.target.value)} />
                                )}
                              </span>
                              {f.hasBaseAndFlat ? (() => {
                                const base = Number(inst.stats[`${f.key}.base`]) || 0;
                                const pct = Number(inst.stats[`${f.key}.percent`]) || 0;
                                const flat = Number(inst.stats[`${f.key}.flat`]) || 0;
                                const increment = Math.round(base * (pct / 100));
                                const total = base + increment + flat;
                                return (
                                  <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800/50 p-1.5 rounded border border-gray-200 dark:border-zinc-700/50 mt-1 select-none flex justify-between">
                                    <span>{base} (Base) + {increment} ({pct}%) + {flat} (Flat)</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">= {total} (Total)</span>
                                  </div>
                                );
                              })() : null}
                              {(f.hasBaseAndFlat ? baseErr : singleErr) ? (
                                <span className="text-xs text-red-600">{f.hasBaseAndFlat ? baseErr : singleErr}</span>
                              ) : null}
                            </label>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

                <section className="mb-4">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Reaction</h2>
                  {reactionOptions.length > 1 ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <select className={selectCls} value={inst.reaction}
                        onChange={e => setReaction(inst.id, e.target.value as ReactionType)}>
                        {reactionOptions.map(r => (
                          <option key={r} value={r} className="bg-white dark:bg-zinc-800 text-black dark:text-white">
                            {REACTION_LABEL[r]}
                          </option>
                        ))}
                      </select>
                      {inst.reaction !== "none" ? (
                        <label className="flex items-center gap-2 text-sm">
                          Reaction Bonus %
                          <input className={inputCls("reactionBonus", "w-24")} type="number"
                            value={inst.reactionBonus}
                            onChange={e => setReactionBonus(inst.id, e.target.value)} />
                          {err("reactionBonus") ? <span className="text-xs text-red-600">{err("reactionBonus")}</span> : null}
                        </label>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No hit-attached reaction available for {config.element}.</p>
                  )}
                </section>

                {instances.length > 1 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setBenchmarkId(inst.id)}
                      disabled={baseBenchmarkInst}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-sm ${baseBenchmarkInst
                          ? "bg-gray-100 text-gray-400 dark:bg-zinc-800/40 dark:text-zinc-600 cursor-not-allowed border border-gray-200 dark:border-zinc-850"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                        }`}
                    >
                      Compare This
                    </button>
                  </div>
                )}

                {!validation.ok && (
                  <span className="text-xs text-red-600 block mb-3">
                    {Object.keys(validation.errors).length} field(s) need attention.
                  </span>
                )}

                {/* Effective stats — the values actually used for damage after talent
                    toggles + constellations (Paramita ATK, Sanguine Rouge DMG Bonus, …). */}
                {effectiveStats && inputStats ? (
                  <div className="mb-3 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5">
                    <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Effective Stats</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                      {EFFECTIVE_ROWS.map(row => {
                        const eff = effectiveStats[row.key];
                        const delta = eff - inputStats[row.key];
                        const changed = Math.abs(delta) > 0.05;
                        const show = (v: number) => (row.unit === "percent" ? `${v.toFixed(1)}%` : fmt(v));
                        return (
                          <div key={row.key} className="flex items-center justify-between gap-2">
                            <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                            <span className="tabular-nums font-medium text-gray-800 dark:text-gray-200">
                              {show(eff)}
                              {changed ? (
                                <span className="ml-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  {delta > 0 ? "+" : "−"}{row.unit === "percent" ? `${Math.abs(delta).toFixed(1)}%` : fmt(Math.abs(delta))}
                                </span>
                              ) : null}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {extras?.notes.length ? (
                  <div className="mb-3 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5">
                    {extras.notes.map(n => (
                      <p key={n} className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">• {n}</p>
                    ))}
                  </div>
                ) : null}

                {validation.general.map(g => (
                  <p key={g} className="mb-2 text-xs text-amber-600">{g}</p>
                ))}

                {config.talents.map((g, gi) => {
                  const s = scaling[g.type];
                  const selLevel = s ? Number(inst.levels[g.type]) : NaN;
                  return (
                    <section key={g.name} className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-1">
                        <h3 className="font-semibold text-sm">{g.name}</h3>
                        {s && s.levels.length ? (
                          <label className="flex items-center gap-1.5 text-xs text-gray-500">
                            Lv.
                            <select className="border border-gray-250 dark:border-zinc-700 rounded px-1.5 py-0.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white" value={inst.levels[g.type] ?? ""}
                              onChange={e => setLevel(inst.id, g.type, e.target.value)}>
                              {s.levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </label>
                        ) : null}
                      </div>
                      <table className="mt-1 w-full text-xs">
                        <thead>
                          <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                            <th className="py-1.5 font-normal">Hit</th>
                            <th className="py-1.5 font-normal text-right">Mult %</th>
                            {results ? (
                              <>
                                <th className="py-1.5 pr-1 text-right font-normal">Non-Crit</th>
                                <th className="py-1.5 pr-1 text-right font-normal">CRIT</th>
                                <th className="py-1.5 text-right font-normal">Avg</th>
                              </>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody>
                          {g.hits.map((h, hi) => {
                            const id = hitId(gi, hi);
                            const res = results?.[id];
                            const levelVal = s && selLevel ? s.byLevel[selLevel]?.[h.key] : undefined;
                            const isHeal = h.kind === "heal";
                            return (
                              <tr key={id} className={`border-t border-gray-100 dark:border-zinc-800/60 ${isHeal ? "bg-emerald-50/40 dark:bg-emerald-950/10" : ""}`}>
                                <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">
                                  {h.name} <span className="text-[10px] text-gray-400 dark:text-gray-500">({isHeal ? "HEAL" : h.scaling.toUpperCase()})</span>
                                </td>
                                <td className="py-1.5 text-right font-mono text-gray-600 dark:text-gray-400">
                                  {levelVal != null ? (
                                    <span title={`Talent Lv. ${selLevel}`}>{levelVal}</span>
                                  ) : (
                                    <input className={inputCls(id, "w-16 text-right")} type="number" placeholder="%"
                                      value={inst.hits[id] ?? ""} onChange={e => setHit(inst.id, id, e.target.value)} />
                                  )}
                                </td>
                                {results ? (
                                  isHeal ? (
                                    <td colSpan={3} className="py-1.5 text-right tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">
                                      {res ? (
                                        <div className="flex flex-col items-end">
                                          <span>+{fmt(res.nonCrit)} HP</span>
                                          {renderPct(res.nonCrit, benchmarkResults?.[id]?.nonCrit)}
                                        </div>
                                      ) : "—"}
                                    </td>
                                  ) : (
                                    <>
                                      <td className="py-1.5 pr-1 text-right tabular-nums">
                                        {res ? (
                                          <div className="flex flex-col items-end">
                                            <span>{fmt(res.nonCrit)}</span>
                                            {renderPct(res.nonCrit, benchmarkResults?.[id]?.nonCrit)}
                                          </div>
                                        ) : "—"}
                                      </td>
                                      <td className="py-1.5 pr-1 text-right tabular-nums">
                                        {res ? (
                                          <div className="flex flex-col items-end">
                                            <span>{fmt(res.crit)}</span>
                                            {renderPct(res.crit, benchmarkResults?.[id]?.crit)}
                                          </div>
                                        ) : "—"}
                                      </td>
                                      <td className="py-1.5 text-right tabular-nums font-semibold">
                                        {res ? (
                                          <div className="flex flex-col items-end">
                                            <span>{fmt(res.avg)}</span>
                                            {renderPct(res.avg, benchmarkResults?.[id]?.avg)}
                                          </div>
                                        ) : "—"}
                                      </td>
                                    </>
                                  )
                                ) : null}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </section>
                  );
                })}

                {/* Standalone reaction outputs: transformative + indirect Lunar.
                    These don't scale with talents — only level, EM, and enemy RES. */}
                {(TRANSFORMATIVE_BY_ELEMENT[config.element].length || LUNAR_BY_ELEMENT[config.element].length) ? (
                  <section className="mt-5 border-t border-gray-200 dark:border-zinc-800 pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm">Reaction DMG ({config.element}-triggered)</h3>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <label className="flex items-center gap-1">
                          Bonus %
                          <input className={inputCls("reactionPanelBonus", "w-14")} type="number"
                            value={inst.reactionPanelBonus}
                            onChange={e => updateInstance(inst.id, () => ({ reactionPanelBonus: e.target.value }))} />
                        </label>
                        {LUNAR_BY_ELEMENT[config.element].length ? (
                          <label className="flex items-center gap-1" title="Lunar Reaction Base DMG Bonus (Moonsign Benediction passives)">
                            Lunar Base %
                            <input className={inputCls("lunarBaseBonus", "w-14")} type="number"
                              value={inst.lunarBaseBonus}
                              onChange={e => updateInstance(inst.id, () => ({ lunarBaseBonus: e.target.value }))} />
                          </label>
                        ) : null}
                      </div>
                    </div>
                    {extras ? (
                      <table className="mt-1 w-full text-xs">
                        <thead>
                          <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                            <th className="py-1.5 font-normal">Reaction</th>
                            <th className="py-1.5 pr-1 text-right font-normal">Non-Crit</th>
                            <th className="py-1.5 pr-1 text-right font-normal">CRIT</th>
                            <th className="py-1.5 text-right font-normal">Avg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extras.transformative.map(t => (
                            <tr key={t.type} className="border-t border-gray-100 dark:border-zinc-800/60">
                              <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">{TRANSFORMATIVE_LABEL[t.type]}</td>
                              <td className="py-1.5 pr-1 text-right tabular-nums" colSpan={3}>
                                <span className="font-semibold">{fmt(t.dmg)}</span>
                                <span className="ml-1 text-[10px] text-gray-400">(no crit)</span>
                              </td>
                            </tr>
                          ))}
                          {extras.lunar.map(l => (
                            <tr key={l.type} className="border-t border-gray-100 dark:border-zinc-800/60">
                              <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">{LUNAR_LABEL[l.type]}</td>
                              <td className="py-1.5 pr-1 text-right tabular-nums">{fmt(l.res.nonCrit)}</td>
                              <td className="py-1.5 pr-1 text-right tabular-nums">{fmt(l.res.crit)}</td>
                              <td className="py-1.5 text-right tabular-nums font-semibold">{fmt(l.res.avg)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="mt-1 text-[10px] text-gray-400">Fill the remaining fields to compute (scales with character level, EM, and enemy RES).</p>
                    )}
                  </section>
                ) : null}

                {/* Combo Rotations Summary Section */}
                <div className="mt-5 border-t border-gray-200 dark:border-zinc-800 pt-3 select-none">
                  <h3 className="font-semibold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Combo Rotations DMG</h3>
                  <div className="space-y-1.5">
                    {rotations.map(r => {
                      if (r.steps.length === 0) return null;
                      const isSelected = r.id === activeRotationId;
                      return (
                        <div
                          key={r.id}
                          className={`text-xs flex items-center justify-between gap-4 font-semibold leading-tight py-1.5 px-2.5 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-extrabold"
                              : "bg-transparent border-transparent text-gray-400 dark:text-zinc-500"
                          }`}
                        >
                          <span className="truncate max-w-[240px]">{r.name || "Combo"}:</span>
                          <span className="tabular-nums font-mono">{fmt(rotationTotals[r.id] ?? 0)}</span>
                        </div>
                      );
                    })}
                    {rotations.every(r => r.steps.length === 0) && (
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 italic">No rotations built yet. Open the Rotation Builder above to get started.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Rotation Builder Modal Popup ── */}
      {isRotationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 animate-out fade-out">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-zinc-850 shrink-0">
              <div>
                <h2 className="text-lg font-bold">Rotation Builder</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Configure your combo sequence and compare setups</p>
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

            {/* Modal Content (Split Screen) */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Rotations list */}
              <div className="w-64 border-r border-gray-150 dark:border-zinc-850 p-4 overflow-y-auto flex flex-col bg-gray-50/30 dark:bg-zinc-950/20 shrink-0">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 tracking-wider">Rotations</span>
                  <button
                    onClick={addRotation}
                    className="rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-2 py-1 text-[10px] font-bold text-white dark:text-zinc-950 transition-colors cursor-pointer"
                  >
                    + Add New
                  </button>
                </div>

                <div className="space-y-1.5 flex-1 overflow-y-auto">
                  {rotations.map(r => {
                    const isSelected = r.id === activeRotationId;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setActiveRotationId(r.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group ${
                          isSelected
                            ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                            : "bg-white border-gray-200 hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-xs font-bold truncate leading-tight">
                            {r.name || "Untitled Rotation"}
                          </span>
                          <span className={`text-[10px] truncate leading-normal mt-0.5 ${
                            isSelected ? "text-gray-300 dark:text-zinc-500" : "text-gray-400"
                          }`}>
                            {r.description || "No description"}
                          </span>
                        </div>
                        {rotations.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRotation(r.id);
                            }}
                            className={`p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 dark:hover:text-red-300 transition-all cursor-pointer ${
                              isSelected ? "text-white hover:text-red-400" : "text-gray-400"
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
              </div>

              {/* Right Panel - Active Rotation Details */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col min-w-0">
                {activeRot ? (
                  <>
                    {/* Metadata Editors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-gray-200/50 dark:border-zinc-800/50 shrink-0">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5">Rotation Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Vaporize E Combo..."
                          className="w-full border px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-semibold"
                          value={activeRot.name}
                          onChange={e => updateActiveRotation(() => ({ name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5">Rotation Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Kaeya melt support sequence..."
                          className="w-full border px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                          value={activeRot.description}
                          onChange={e => updateActiveRotation(() => ({ description: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Step Builder Controls */}
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                      <button
                        className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-bold text-white dark:text-zinc-950 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 border border-gray-300 dark:border-zinc-700 font-semibold"
                        onClick={() => {
                          setIsSelectAttackOpen(true);
                        }}
                      >
                        <span>➕ Add Step</span>
                      </button>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 italic">
                        Click &quot;+ Add Step&quot; to choose from all attack instances for your character.
                      </span>
                    </div>

                    {/* Steps Table */}
                    {activeRot.steps.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                        <p className="text-sm text-gray-400 dark:text-zinc-500 mb-1 font-semibold">This rotation is empty</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Pick an attack from the dropdown and click &quot;+ Add Step&quot; to build your combo.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto border border-gray-200/60 dark:border-zinc-850 rounded-xl min-h-[200px]">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-zinc-900/30">
                              <th className="py-2.5 px-3 font-normal w-8">#</th>
                              <th className="py-2.5 px-3 font-normal">Hit</th>
                              <th className="py-2.5 px-3 font-normal w-28">Reaction</th>
                              {instances.map((inst, idx) => {
                                const baseBenchmarkInst = activeBenchmarkId === inst.id;
                                return (
                                  <th key={inst.id} className="py-2.5 px-3 text-right font-normal">
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="font-semibold text-gray-800 dark:text-gray-250">Setup {idx + 1} Avg</span>
                                      <button
                                        onClick={() => setBenchmarkId(inst.id)}
                                        disabled={baseBenchmarkInst}
                                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${baseBenchmarkInst
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
                              <th className="py-2.5 px-3 w-16"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeRot.steps.map((step, stepIdx) => {
                              let hitName = step.targetHitId;
                              for (let gi = 0; gi < config.talents.length; gi++) {
                                for (let hi = 0; hi < config.talents[gi].hits.length; hi++) {
                                  if (hitId(gi, hi) === step.targetHitId) {
                                    hitName = `${config.talents[gi].name}: ${config.talents[gi].hits[hi].name}`;
                                  }
                                }
                              }
                              
                              // Find benchmark hit value
                              const benchmarkInst = instances.find(i => i.id === activeBenchmarkId);
                              let benchmarkDmg = 0;
                              if (benchmarkInst) {
                                const benchmarkComputed = computedById.get(benchmarkInst.id);
                                if (benchmarkComputed && benchmarkComputed.rotationStepsDmg) {
                                  benchmarkDmg = benchmarkComputed.rotationStepsDmg[activeRotationId]?.[stepIdx] ?? 0;
                                }
                              }

                              return (
                                <tr key={step.id} className="border-t border-gray-100 dark:border-zinc-900/80 hover:bg-gray-50/20 dark:hover:bg-zinc-900/10">
                                  <td className="py-2.5 px-3 text-gray-400 dark:text-zinc-500 tabular-nums">{stepIdx + 1}</td>
                                  <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300 font-medium">{hitName}</td>
                                  <td className="py-2.5 px-3">
                                    <select
                                      className={selectCls + " text-[10px] py-0.5 w-24"}
                                      value={step.reactionOverride}
                                      onChange={e => {
                                        const newSteps = [...activeRot.steps];
                                        newSteps[stepIdx] = { ...step, reactionOverride: e.target.value as ReactionType | "default" };
                                        updateActiveRotation(() => ({ steps: newSteps }));
                                      }}
                                    >
                                      <option value="default">Default</option>
                                      {Object.entries(REACTION_LABEL).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                      ))}
                                    </select>
                                  </td>
                                  {instances.map(inst => {
                                    const computed = computedById.get(inst.id);
                                    const stepsDmg = computed?.rotationStepsDmg[activeRotationId];
                                    const dmg = stepsDmg ? stepsDmg[stepIdx] : 0;
                                    return (
                                      <td key={inst.id} className="py-2.5 px-3 text-right tabular-nums font-semibold">
                                        <div className="flex flex-col items-end">
                                          <span>{fmt(dmg)}</span>
                                          {renderPct(dmg, benchmarkDmg)}
                                        </div>
                                      </td>
                                    );
                                  })}
                                  <td className="py-2.5 px-3 text-center">
                                    <button
                                      className="text-red-400 hover:text-red-650 dark:hover:text-red-300 cursor-pointer text-xs p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ml-4"
                                      onClick={() => {
                                        updateActiveRotation(r => ({
                                          steps: r.steps.filter(s => s.id !== step.id)
                                        }));
                                      }}
                                      title="Remove step"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-250 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/20">
                              <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200" colSpan={3}>Total Average DMG</td>
                              {instances.map(inst => {
                                const computed = computedById.get(inst.id);
                                const total = computed?.rotationTotals[activeRotationId] ?? 0;
                                const benchmarkComputed = computedById.get(activeBenchmarkId);
                                const benchmarkTotal = benchmarkComputed?.rotationTotals[activeRotationId] ?? 0;
                                return (
                                  <td key={inst.id} className="py-3 px-3 text-right tabular-nums font-bold text-sm text-zinc-900 dark:text-zinc-100">
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
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-150 dark:border-zinc-850 shrink-0 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/10">
              <span className="text-[11px] text-gray-400 dark:text-zinc-500">Changes will be saved automatically along with your setup builds.</span>
              <button
                onClick={() => setIsRotationOpen(false)}
                className="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Attack Selector Popup Modal overlay (z-60) ── */}
      {isSelectAttackOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[75vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-150 dark:border-zinc-850 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">Select Attack Instance</h3>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">Choose an attack to append to your combo</p>
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
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500">{g.name}</h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {g.hits.map((h, hi) => {
                      if (h.kind === "heal") return null;
                      const hitIdValue = hitId(gi, hi);
                      return (
                        <button
                          key={hitIdValue}
                          onClick={() => {
                            updateActiveRotation(r => ({
                              steps: [...r.steps, {
                                id: String(rotationNextId),
                                targetHitId: hitIdValue,
                                reactionOverride: "default",
                              }]
                            }));
                            setRotationNextId(prev => prev + 1);
                            setIsSelectAttackOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-gray-200/60 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-zinc-100 bg-white hover:bg-zinc-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-xs text-gray-700 dark:text-zinc-300 font-semibold transition-all cursor-pointer flex items-center justify-between group"
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
                className="rounded-lg bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Unsaved Progress Confirmation Modal overlay (z-50) ── */}
      {isConfirmDiscardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
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

            {/* Content */}
            <div className="p-5">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                You have unsaved work on the calculator page for <span className="font-bold text-gray-800 dark:text-zinc-200">{config.name}</span>. Moving to another page will discard all unsaved edits.
              </p>
            </div>

            {/* Footer */}
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
                  setSavedJson(currentPayload()); // Sync savedJson so isDirty resolves to false
                  setIsConfirmDiscardOpen(false);
                  router.push(pendingNavigationHref);
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
    </div>
  );
}
