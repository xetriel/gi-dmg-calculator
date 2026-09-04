import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { DamageStats } from "./damage";
import type { CalcInstance, StatBuffSource, StatBreakdown } from "@/components/calculator/types";
import { resolveMechanics } from "./mechanics";
import { effectiveTalentLevels } from "./validation";
import { activeEffects, constellationStatBonuses } from "./constellations";
import { resolveTeamBuffs } from "./team-buffs";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";
import { levelMultiplier } from "./level-multiplier";

const toNum = (val: string | number | undefined): number | undefined => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") return isNaN(val) ? undefined : val;
  const s = String(val).trim();
  if (s === "") return undefined;
  const n = Number(s);
  return isNaN(n) ? undefined : n;
};

export interface EffectiveRowDef {
  key: keyof DamageStats | "lunarBaseBonus" | "transformativeBonus" | "vaporizeMult" | "meltMult" | "aggravateFlat" | "spreadFlat";
  label: string;
  category: "attributes" | "categoryDmg" | "elementalDmg" | "reactionElevation" | "debuffs" | "multipliers";
  unit: "flat" | "percent" | "multiplier";
  hideIfZero?: boolean;
}

export const EFFECTIVE_ROW_DEFINITIONS: EffectiveRowDef[] = [
  // 1. Core Attributes
  { key: "atk", label: "ATK", category: "attributes", unit: "flat" },
  { key: "hp", label: "Max HP", category: "attributes", unit: "flat" },
  { key: "def", label: "DEF", category: "attributes", unit: "flat" },
  { key: "em", label: "Elemental Mastery", category: "attributes", unit: "flat" },
  { key: "critRate", label: "CRIT Rate", category: "attributes", unit: "percent" },
  { key: "critDmg", label: "CRIT DMG", category: "attributes", unit: "percent" },
  { key: "energyRecharge", label: "Energy Recharge", category: "attributes", unit: "percent" },
  { key: "healingBonus", label: "Healing Bonus", category: "attributes", unit: "percent", hideIfZero: true },

  // 2. Attack Category DMG Bonuses
  { key: "dmgBonus", label: "Common / All DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "normalDmgBonus", label: "Normal ATK DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "chargedDmgBonus", label: "Charged ATK DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "plungeDmgBonus", label: "Plunging ATK DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "skillDmgBonus", label: "Elemental Skill DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "burstDmgBonus", label: "Elemental Burst DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },

  // 3. Elemental & Physical DMG Bonuses
  { key: "pyroDmgBonus", label: "Pyro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "hydroDmgBonus", label: "Hydro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "dendroDmgBonus", label: "Dendro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "electroDmgBonus", label: "Electro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "anemoDmgBonus", label: "Anemo DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "cryoDmgBonus", label: "Cryo DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "geoDmgBonus", label: "Geo DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "physicalDmgBonus", label: "Physical DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },

  // 4. Reaction DMG Bonuses & Elevation
  { key: "lunarChargedElevation", label: "Lunar-Charged Elevation DMG", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "lunarBloomElevation", label: "Lunar-Bloom Elevation DMG", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeElevation", label: "Lunar-Crystallize Elevation DMG", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "lunarChargedDmgBonus", label: "Lunar-Charged DMG Bonus", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "lunarBloomDmgBonus", label: "Lunar-Bloom DMG Bonus", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeDmgBonus", label: "Lunar-Crystallize DMG Bonus", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlDmgBonus", label: "Stellar Swirl DMG Bonus", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "stellarGlimmerDmgBonus", label: "Stellar Glimmer DMG Bonus", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "lunarChargedFlatDmg", label: "Lunar-Charged Flat DMG", category: "reactionElevation", unit: "flat", hideIfZero: true },
  { key: "lunarBloomFlatDmg", label: "Lunar-Bloom Flat DMG", category: "reactionElevation", unit: "flat", hideIfZero: true },
  { key: "lunarCrystallizeFlatDmg", label: "Lunar-Crystallize Flat DMG", category: "reactionElevation", unit: "flat", hideIfZero: true },
  { key: "lunarBaseBonus", label: "Lunar Reaction Base DMG Bonus", category: "reactionElevation", unit: "percent", hideIfZero: true },
  { key: "transformativeBonus", label: "Transformative Reaction Bonus", category: "multipliers", unit: "percent", hideIfZero: false },
  { key: "vaporizeMult", label: "Vaporize Multiplier", category: "multipliers", unit: "multiplier", hideIfZero: true },
  { key: "meltMult", label: "Melt Multiplier", category: "multipliers", unit: "multiplier", hideIfZero: true },
  { key: "aggravateFlat", label: "Aggravate Flat DMG Bonus", category: "multipliers", unit: "flat", hideIfZero: true },
  { key: "spreadFlat", label: "Spread Flat DMG Bonus", category: "multipliers", unit: "flat", hideIfZero: true },

  // 5. Enemy Debuffs & Defense
  { key: "enemyRes", label: "Enemy RES", category: "debuffs", unit: "percent" },
  { key: "defReduction", label: "DEF Reduction", category: "debuffs", unit: "percent", hideIfZero: true },
  { key: "defIgnore", label: "DEF Ignore", category: "debuffs", unit: "percent", hideIfZero: true },
  { key: "dmgReduction", label: "DMG Reduction / -(DMG Bonus)", category: "debuffs", unit: "percent", hideIfZero: true },
  { key: "levelChar", label: "Character Level", category: "debuffs", unit: "flat" },
  { key: "levelEnemy", label: "Enemy Level", category: "debuffs", unit: "flat" },
];

export function resolveAllEffectiveStats(
  config: CharacterConfig,
  scaling: TalentScalingData,
  inst: CalcInstance,
  inputStats: DamageStats,
  effectiveStats: DamageStats
): StatBreakdown[] {
  const breakdowns: StatBreakdown[] = [];

  // Parse mechanics inputs
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

  const effects = activeEffects(config, inst.constellationLevel);
  const constellationStats = constellationStatBonuses(effects);

  // Resolve external buffs
  const teamRes = inst.teamBuffsEnabled !== false && inst.teamSupports?.length
    ? resolveTeamBuffs(inst.teamSupports, true)
    : { statDeltas: {}, lunarBaseBonusPct: 0, sources: [], teamCrit: { critRate: 0, critDmg: 0, supportCount: 0 } };

  const weaponRes = inst.externalWeaponBuffsEnabled !== false && inst.externalWeapons?.length
    ? resolveExternalWeaponBuffs(inst.externalWeapons, toNum(inst.stats["atk.base"]) ?? 0, config, true)
    : { statDeltas: {}, sources: [] };

  const artifactRes = inst.externalArtifactBuffsEnabled !== false && inst.externalArtifacts?.length
    ? resolveExternalArtifactBuffs(
        inst.externalArtifacts,
        toNum(inst.stats["atk.base"]) ?? 0,
        config,
        true,
        toNum(inst.stats["def.base"]) ?? 0,
        toNum(inst.stats["hp.base"]) ?? 0,
      )
    : { statDeltas: {}, sources: [] };

  // Multiplier math parameters
  const reactionBonusPct = toNum(inst.reactionPanelBonus) ?? 0;
  const emTransformative = (16 * effectiveStats.em) / (effectiveStats.em + 2000) * 100;
  const totalTransformativeBonus = emTransformative + reactionBonusPct;

  const instReactionBonusPct = Number(inst.reactionBonus || 0);
  const emAmplifyingBonus = (2.78 * effectiveStats.em) / (effectiveStats.em + 1400);
  const getAmpMult = (base: number) => base * (1 + emAmplifyingBonus + instReactionBonusPct / 100);

  const emCatalyzeBonus = (5 * effectiveStats.em) / (effectiveStats.em + 1200);
  const aggravateFlatVal = 1.15 * levelMultiplier(effectiveStats.levelChar) * (1 + emCatalyzeBonus + instReactionBonusPct / 100);
  const spreadFlatVal = 1.25 * levelMultiplier(effectiveStats.levelChar) * (1 + emCatalyzeBonus + instReactionBonusPct / 100);

  const rawLunarBase = toNum(inst.lunarBaseBonus) ?? 0;
  const teamLunarBase = teamRes.lunarBaseBonusPct ?? 0;
  const mechLunarBase = mechResult.lunarBaseBonusPct ?? 0;
  const totalLunarBase = rawLunarBase + teamLunarBase + mechLunarBase;

  // Process each definition
  for (const row of EFFECTIVE_ROW_DEFINITIONS) {
    // Special handled rows
    if (row.key === "transformativeBonus") {
      const additions: StatBuffSource[] = [];
      if (reactionBonusPct > 0) {
        additions.push({
          source: "Panel Reaction Bonus",
          value: reactionBonusPct,
          description: "Direct reaction bonus input from panel",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: emTransformative,
        additions,
        total: totalTransformativeBonus,
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "lunarBaseBonus") {
      const additions: StatBuffSource[] = [];
      if (mechLunarBase > 0) {
        additions.push({
          source: `${config.name} (Moonsign Benediction)`,
          value: mechLunarBase,
          description: "Character passive lunar base scaling",
          type: "mechanic",
          category: "character",
        });
      }
      if (teamLunarBase > 0) {
        additions.push({
          source: "Team Moonsign Buff",
          value: teamLunarBase,
          description: "Teammate Moonsign Benediction base DMG bonus",
          type: "external",
          category: "team",
          rarity: 5,
        });
      }
      const hasValue = totalLunarBase > 0.01;
      if (row.hideIfZero && !hasValue) continue;

      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawLunarBase,
        additions,
        total: totalLunarBase,
        hideIfZero: row.hideIfZero,
        hasExternalBuffs: additions.some(a => a.type === "external"),
      });
      continue;
    }

    if (row.key === "vaporizeMult") {
      const showVape = ["Pyro", "Hydro"].includes(config.element);
      if (!showVape) continue;
      const baseAmp = config.element === "Pyro" ? 1.5 : 2.0;
      const additions: StatBuffSource[] = [];
      if (emAmplifyingBonus > 0) {
        additions.push({
          source: "EM Amplifying Bonus",
          value: baseAmp * emAmplifyingBonus,
          description: "Amplifying EM bonus multiplier",
          type: "mechanic",
          category: "character",
        });
      }
      if (instReactionBonusPct > 0) {
        additions.push({
          source: "Reaction Bonus%",
          value: baseAmp * (instReactionBonusPct / 100),
          description: "Reaction bonus modifier input",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: `${row.label} (${baseAmp.toFixed(1)}x Base)`,
        category: row.category,
        unit: row.unit,
        raw: baseAmp,
        additions,
        total: getAmpMult(baseAmp),
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "meltMult") {
      const showMelt = ["Pyro", "Cryo"].includes(config.element);
      if (!showMelt) continue;
      const baseAmp = config.element === "Pyro" ? 2.0 : 1.5;
      const additions: StatBuffSource[] = [];
      if (emAmplifyingBonus > 0) {
        additions.push({
          source: "EM Amplifying Bonus",
          value: baseAmp * emAmplifyingBonus,
          description: "Amplifying EM bonus multiplier",
          type: "mechanic",
          category: "character",
        });
      }
      if (instReactionBonusPct > 0) {
        additions.push({
          source: "Reaction Bonus%",
          value: baseAmp * (instReactionBonusPct / 100),
          description: "Reaction bonus modifier input",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: `${row.label} (${baseAmp.toFixed(1)}x Base)`,
        category: row.category,
        unit: row.unit,
        raw: baseAmp,
        additions,
        total: getAmpMult(baseAmp),
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "aggravateFlat") {
      if (config.element !== "Electro") continue;
      const rawBase = 1.15 * levelMultiplier(effectiveStats.levelChar);
      const additions: StatBuffSource[] = [];
      if (emCatalyzeBonus > 0 || instReactionBonusPct > 0) {
        additions.push({
          source: "EM Catalyze & Reaction Bonus",
          value: aggravateFlatVal - rawBase,
          description: "Level base scaling * (1 + EM bonus% + panel reaction bonus%)",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawBase,
        additions,
        total: aggravateFlatVal,
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "spreadFlat") {
      if (config.element !== "Dendro") continue;
      const rawBase = 1.25 * levelMultiplier(effectiveStats.levelChar);
      const additions: StatBuffSource[] = [];
      if (emCatalyzeBonus > 0 || instReactionBonusPct > 0) {
        additions.push({
          source: "EM Catalyze & Reaction Bonus",
          value: spreadFlatVal - rawBase,
          description: "Level base scaling * (1 + EM bonus% + panel reaction bonus%)",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawBase,
        additions,
        total: spreadFlatVal,
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    // Standard DamageStats rows
    const statKey = row.key as keyof DamageStats;
    const raw = (inputStats[statKey] as number | undefined) ?? 0;
    const total = (effectiveStats[statKey] as number | undefined) ?? 0;
    const delta = total - raw;

    const additions: StatBuffSource[] = [];

    // 1. Character mechanics additions
    if (mechResult.statBuffSources?.[statKey]) {
      for (const mSrc of mechResult.statBuffSources[statKey]) {
        additions.push({
          source: mSrc.source,
          value: mSrc.value,
          description: mSrc.description,
          type: "mechanic",
          category: "character",
        });
      }
    }

    // 2. Constellation stat additions
    if (config.constellations) {
      for (const c of config.constellations) {
        if (c.level <= inst.constellationLevel) {
          for (const e of c.effects) {
            if (e.type === "stat_bonus" && e.statKey === statKey && e.statValue) {
              additions.push({
                source: `C${c.level} (${c.name})`,
                value: e.statValue,
                description: c.description || `Grants +${e.statValue} ${row.label}`,
                type: "constellation",
                category: "character",
              });
            }
          }
        }
      }
    }

    // 3. Team Support Buffs (External)
    for (const src of teamRes.sources) {
      if (src.stat === statKey) {
        additions.push({
          source: `${src.supportName} (Team)`,
          value: src.value,
          description: src.label,
          type: "external",
          category: "team",
          rarity: src.rarity ?? 5,
        });
      }
    }

    // 4. External Weapon Buffs (External)
    for (const src of weaponRes.sources) {
      if (src.stat === statKey) {
        additions.push({
          source: `${src.weaponName} (Weapon)`,
          value: src.value,
          description: src.label,
          type: "external",
          category: "weapon",
          rarity: src.rarity ?? 5,
        });
      }
    }

    // 5. External Artifact Buffs (External)
    for (const src of artifactRes.sources) {
      if (src.stat === statKey) {
        additions.push({
          source: `${src.artifactName} (Artifact)`,
          value: src.value,
          description: src.label,
          type: "external",
          category: "artifact",
          rarity: src.rarity ?? 5,
        });
      }
    }

    // 6. Generic unrecorded delta fallback
    const recordedSum = additions.reduce((acc, curr) => acc + curr.value, 0);
    const unrecordedDelta = delta - recordedSum;
    if (Math.abs(unrecordedDelta) > 0.05) {
      additions.push({
        source: "Character Mechanics / Trait Buff",
        value: unrecordedDelta,
        description: "Special active mechanic or ascension passive modifier",
        type: "fallback",
        category: "character",
      });
    }

    // Hide if zero check
    if (row.hideIfZero && Math.abs(total) < 0.05 && additions.length === 0) {
      continue;
    }

    const hasExternalBuffs = additions.some(a => a.type === "external");

    breakdowns.push({
      key: row.key,
      label: row.label,
      category: row.category,
      unit: row.unit,
      raw,
      additions,
      total,
      hideIfZero: row.hideIfZero,
      hasExternalBuffs,
    });
  }

  return breakdowns;
}
