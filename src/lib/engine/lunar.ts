// Lunar reaction damage, per the saved Damage wiki page.
//
// Indirect (triggered by applying elements; Lunar-Charged / Lunar-Crystallize only):
//   DMG_Individual = Base Reaction Coeff × LevelMult(contributor) × (1 + %Reaction Base DMG Bonus)
//                    × (1 + 6·EM/(EM+2000) + %Reaction Bonus) × Elevation × RESMult × CritMult
//
//   Ranked multi-contributor combination:
//   DMG_Indirect = 0.60 · D1 + 0.30 · D2 + 0.05 · D3 + 0.05 · D4
//   where D1 >= D2 >= D3 >= D4. Unfilled slots contribute D_k = 0.
//   (1 contributor = 60%, 2 = 90%, 3 = 95%, 4 = 100% capacity).
//   Benchmark CRIT: The highest contributor (D1) dictates the CRIT ratio for the reaction.
//
// Direct (dealt by a character's own lunar ability):
//   DMG = (Coeff × Ability% × Stat × BaseDMGMult × (1 + %Reaction Base DMG Bonus)
//         × (1 + 6·EM/(EM+2000) + %Reaction Bonus) + Additive) × Elevation × RESMult × CritMult

import type { Element } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";
import { resMultiplier, stellarEmBonus, type DamageStats } from "./damage";

export type LunarType = "lunar-charged" | "lunar-crystallize" | "lunar-bloom";

export const LUNAR_LABEL: Record<LunarType, string> = {
  "lunar-charged": "Lunar-Charged",
  "lunar-crystallize": "Lunar-Crystallize",
  "lunar-bloom": "Lunar-Bloom",
};

// Indirect Base Reaction Coefficients:
// 3.0 for Lunar-Charged
// 1.6 for Lunar-Crystallize
// Lunar-Bloom deals no indirect reaction DMG (its cores are ordinary Bloom cores).
export const LUNAR_INDIRECT_MULTIPLIER: Partial<Record<LunarType, number>> = {
  "lunar-charged": 3.0,
  "lunar-crystallize": 1.6,
};

// Direct Base Reaction Coefficients:
// 3.0 for Lunar-Charged, 1.6 for Lunar-Crystallize, 1.0 for Lunar-Bloom.
export const LUNAR_DIRECT_MULTIPLIER: Record<LunarType, number> = {
  "lunar-charged": 3.0,
  "lunar-crystallize": 1.6,
  "lunar-bloom": 1.0,
};

// Indirect lunar reactions this element can contribute to (Electro-Charged family
// needs Electro or Hydro application; Crystallize needs Geo).
export const LUNAR_BY_ELEMENT: Record<Element, LunarType[]> = {
  Electro: ["lunar-charged"],
  Hydro: ["lunar-charged", "lunar-bloom"],
  Geo: ["lunar-crystallize"],
  Pyro: [],
  Cryo: [],
  Anemo: [],
  Dendro: ["lunar-bloom"],
};

export interface LunarResult {
  nonCrit: number;
  crit: number;
  avg: number;
  benchmarkCritRate?: number;
  benchmarkCritDmg?: number;
  contributorCount?: number;
}

export interface LunarContributorParams {
  id?: string;
  name?: string;
  element?: Element;
  levelChar: number;
  em: number;
  critRate: number;
  critDmg: number;
  enemyRes: number;
  reactionBonusPct?: number;
  baseDmgBonusPct?: number;
  elevationBonusPct?: number;
  flatDmg?: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

// Same 6·EM/(EM+2000) term the Stellar/direct-reaction branch uses.
export const lunarEmBonus = stellarEmBonus;

/**
 * Computes individual theoretical indirect damage for a single contributor.
 */
export function computeIndividualLunarDamage(
  coeff: number,
  contributor: LunarContributorParams,
): { nonCrit: number; critRate: number; critDmg: number } {
  const emBonusFrac = lunarEmBonus(contributor.em);
  const rxBonus = 1 + emBonusFrac + (contributor.reactionBonusPct ?? 0) / 100;
  const baseDmgBonus = 1 + (contributor.baseDmgBonusPct ?? 0) / 100;
  const elevation = 1 + (contributor.elevationBonusPct ?? 0) / 100;
  const res = resMultiplier(contributor.enemyRes);

  const baseTerm = coeff * levelMultiplier(contributor.levelChar) * baseDmgBonus * rxBonus;
  const totalBase = baseTerm + (contributor.flatDmg ?? 0);
  const nonCrit = totalBase * elevation * res;

  return {
    nonCrit,
    critRate: contributor.critRate,
    critDmg: contributor.critDmg,
  };
}

/**
 * Normalizes and combines up to 4 contributors into the final indirect damage output:
 * DMG_Indirect = 0.60 * D1 + 0.30 * D2 + 0.05 * D3 + 0.05 * D4
 * Ranking is descending: D1 >= D2 >= D3 >= D4.
 * Inactive/unfilled contributor slots contribute 0 (1 = 60%, 2 = 90%, 3 = 95%, 4 = 100%).
 * The highest contributor (D1) provides the benchmark CRIT ratio.
 */
export function combineRankedLunarContributors(
  individualResults: { nonCrit: number; critRate: number; critDmg: number }[],
): LunarResult {
  if (!individualResults.length) {
    return { nonCrit: 0, crit: 0, avg: 0 };
  }

  // Sort descending by Non-Crit damage
  const sorted = [...individualResults].sort((a, b) => b.nonCrit - a.nonCrit);

  const d1 = sorted[0]?.nonCrit ?? 0;
  const d2 = sorted[1]?.nonCrit ?? 0;
  const d3 = sorted[2]?.nonCrit ?? 0;
  const d4 = sorted[3]?.nonCrit ?? 0;

  const combinedNonCrit = 0.60 * d1 + 0.30 * d2 + 0.05 * d3 + 0.05 * d4;

  // Benchmark CRIT ratio from highest contributor (D1)
  const benchmarkCritRate = sorted[0]?.critRate ?? 0;
  const benchmarkCritDmg = sorted[0]?.critDmg ?? 0;

  const cr = clamp(benchmarkCritRate, 0, 100) / 100;
  const cd = benchmarkCritDmg / 100;

  return {
    nonCrit: combinedNonCrit,
    crit: combinedNonCrit * (1 + cd),
    avg: combinedNonCrit * (1 + cr * cd),
    benchmarkCritRate,
    benchmarkCritDmg,
    contributorCount: individualResults.length,
  };
}

/**
 * Indirect lunar reaction DMG.
 * Supports active character + optional party support contributors with normalized 4-slot combination.
 */
export function indirectLunarDamage(
  type: LunarType,
  stats: DamageStats,
  lunarBaseDmgBonusPct: number = 0,
  reactionBonusPct: number = 0,
  extraContributors: LunarContributorParams[] = [],
): LunarResult {
  const mult = LUNAR_INDIRECT_MULTIPLIER[type];
  if (!mult) return { nonCrit: 0, crit: 0, avg: 0 };

  // Specific and superset bonuses
  let specificDmgBonus = stats.lunarReactionDmgBonus ?? 0;
  let specificElevation = stats.lunarReactionSpecialDmgBonus ?? 0;
  let specificFlatDmg =
    (stats.lunarReactionDmgIncrease ?? 0) +
    (stats.commonDmgIncrease ?? 0);
  let specificBaseBonus =
    lunarBaseDmgBonusPct +
    (stats.lunarReactionBaseDmgMultiplier ?? 0);
  let specificCritRate = stats.lunarReactionCritRate ?? 0;
  let specificCritDmg = stats.lunarReactionCritDmg ?? 0;

  if (type === "lunar-charged") {
    specificDmgBonus += stats.lunarChargedDmgBonus ?? 0;
    specificElevation += stats.lunarChargedElevation ?? 0;
    specificFlatDmg +=
      (stats.lunarChargedFlatDmg ?? 0) +
      (stats.lunarChargedReactionDmgIncrease ?? 0);
    specificBaseBonus += stats.lunarChargedBaseDmgMultiplier ?? 0;
    specificCritRate += stats.lunarChargedCritRate ?? 0;
    specificCritDmg += stats.lunarChargedCritDmg ?? 0;
  } else if (type === "lunar-bloom") {
    specificDmgBonus += stats.lunarBloomDmgBonus ?? 0;
    specificElevation += stats.lunarBloomElevation ?? 0;
    specificFlatDmg +=
      (stats.lunarBloomFlatDmg ?? 0) +
      (stats.lunarBloomReactionDmgIncrease ?? 0) +
      (stats.lunarBloomDmgIncrease ?? 0);
    specificBaseBonus += stats.lunarBloomBaseDmgMultiplier ?? 0;
    specificCritRate += stats.lunarBloomCritRate ?? 0;
    specificCritDmg += stats.lunarBloomCritDmg ?? 0;
  } else if (type === "lunar-crystallize") {
    specificDmgBonus += stats.lunarCrystallizeDmgBonus ?? 0;
    specificElevation += stats.lunarCrystallizeElevation ?? 0;
    specificFlatDmg +=
      (stats.lunarCrystallizeFlatDmg ?? 0) +
      (stats.lunarCrystallizeReactionDmgIncrease ?? 0) +
      (stats.lunarCrystallizeDmgIncrease ?? 0);
    specificBaseBonus += stats.lunarCrystallizeBaseDmgMultiplier ?? 0;
    specificCritRate += stats.lunarCrystallizeCritRate ?? 0;
    specificCritDmg += stats.lunarCrystallizeCritDmg ?? 0;
  }

  // Target element RES:
  // Lunar-Charged deals Electro DMG, Lunar-Crystallize deals Geo DMG
  const targetRes =
    type === "lunar-charged"
      ? (stats.enemyElectroRes ?? stats.enemyRes)
      : (stats.enemyGeoRes ?? stats.enemyRes);

  const activeContributor: LunarContributorParams = {
    id: "active-char",
    name: "Active Character",
    levelChar: stats.levelChar,
    em: stats.em,
    critRate: stats.critRate + specificCritRate,
    critDmg: stats.critDmg + specificCritDmg,
    enemyRes: targetRes,
    reactionBonusPct: reactionBonusPct + specificDmgBonus,
    baseDmgBonusPct: specificBaseBonus,
    elevationBonusPct: specificElevation,
    flatDmg: specificFlatDmg,
  };

  const allContributors = [activeContributor, ...extraContributors];
  const individualResults = allContributors.map(c =>
    computeIndividualLunarDamage(mult, c)
  );

  return combineRankedLunarContributors(individualResults);
}
