// Stellar Glimmer reaction damage (Stellar-Conduct & Stellar Swirl).
//
// Indirect (triggered by applying elements; Stellar Swirl only):
//   DMG_Individual = Base Reaction Coeff × LevelMult(contributor) × (1 + %Reaction Base DMG Bonus)
//                    × (1 + 6·EM/(EM+2000) + %Reaction Bonus) × Elevation × RESMult × CritMult
//
//   Ranked multi-contributor combination:
//   DMG_Indirect = 0.60 · D1 + 0.30 · D2 + 0.05 · D3 + 0.05 · D4
//   where D1 >= D2 >= D3 >= D4. Unfilled slots contribute D_k = 0.
//   (1 contributor = 60%, 2 = 90%, 3 = 95%, 4 = 100% capacity).
//   Benchmark CRIT: The highest contributor (D1) dictates the CRIT ratio for the reaction.
//
// Direct (Stellar-Conduct / Direct Stellar Swirl):
//   DMG = (Coeff × Ability% × Stat × BaseDMGMult × (1 + %Reaction Base DMG Bonus)
//         × (1 + 6·EM/(EM+2000) + %Reaction Bonus) + Additive) × Elevation × RESMult × CritMult

import type { Element } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";
import { resMultiplier, stellarEmBonus, type DamageStats } from "./damage";

export type StellarType = "stellar-conduct" | "stellar-swirl";
export type StellarSwirlVariant = "initial" | "vortex-lv1" | "vortex-lv2";

export const STELLAR_LABEL: Record<StellarType, string> = {
  "stellar-conduct": "Stellar-Conduct",
  "stellar-swirl": "Stellar Swirl",
};

export const STELLAR_SWIRL_VARIANT_LABEL: Record<StellarSwirlVariant, string> = {
  initial: "Stellar Swirl (Initial Anemo)",
  "vortex-lv1": "Stellar Swirl (Lv. 1 Vortex Cryo AoE)",
  "vortex-lv2": "Stellar Swirl (Lv. 2 Vortex Cryo AoE)",
};

// Indirect Base Reaction Coefficients:
// 0.75 for Stellar Swirl (Initial Anemo)
// 2.0  for Stellar Swirl (Lv. 1 Vortex Cryo)
// 3.0  for Stellar Swirl (Lv. 2 Vortex Cryo)
// Stellar-Conduct has no indirect elemental application damage.
export const STELLAR_INDIRECT_COEFFICIENT: Record<StellarSwirlVariant, number> = {
  initial: 0.75,
  "vortex-lv1": 2.0,
  "vortex-lv2": 3.0,
};

// Direct Base Reaction Coefficients:
export const STELLAR_DIRECT_COEFFICIENT: Record<StellarType, number> = {
  "stellar-conduct": 1.0, // base without recorded hits
  "stellar-swirl": 1.0,
};

// Elements that can trigger or contribute to Stellar Glimmer reactions
export const STELLAR_BY_ELEMENT: Record<Element, StellarType[]> = {
  Anemo: ["stellar-swirl"],
  Cryo: ["stellar-conduct", "stellar-swirl"],
  Electro: ["stellar-conduct"],
  Pyro: [],
  Hydro: [],
  Geo: [],
  Dendro: [],
};

export interface StellarResult {
  nonCrit: number;
  crit: number;
  avg: number;
  benchmarkCritRate?: number;
  benchmarkCritDmg?: number;
  contributorCount?: number;
}

export interface ContributorParams {
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

/**
 * Stellar-Conduct Base Reaction Coefficient from Polestar recorded Cryo/Electro hits (0–12):
 * - 0 hits => 1.00
 * - 1 to 12 hits => 1.40 + 0.05 * hits (1.45 ... 2.00)
 */
export function stellarConductBRC(hits: number): number {
  const n = clamp(Math.floor(hits), 0, 12);
  return n <= 0 ? 1.0 : 1.40 + 0.05 * n;
}

/**
 * Polestar Field buffs granted based on recorded Cryo/Electro hits (0–12):
 * - Cryo & Electro DMG Bonus: 20% (0 hits), 28% + 1% * hits (1..12 hits, up to 40%).
 * - Enemy Physical RES reduction: 40% (for all 0..12 hits).
 */
export function stellarConductFieldBuffs(hits: number): {
  cryoElectroDmgBonus: number;
  cryoDmgBonus: number;
  electroDmgBonus: number;
  enemyPhysicalResShred: number;
  brc: number;
} {
  const n = clamp(Math.floor(hits), 0, 12);
  const bonus = n <= 0 ? 20 : 28 + n;
  return {
    cryoElectroDmgBonus: bonus,
    cryoDmgBonus: bonus,
    electroDmgBonus: bonus,
    enemyPhysicalResShred: 40,
    brc: stellarConductBRC(n),
  };
}

export interface IndividualStellarDamageResult {
  nonCrit: number;
  crit: number;
  avg: number;
  critRate: number;
  critDmg: number;
}

/**
 * Computes individual theoretical indirect damage for a single contributor.
 */
export function computeIndividualStellarDamage(
  coeff: number,
  contributor: ContributorParams,
  resOverrideElement?: Element | "Physical",
  enemyResPct?: number,
): IndividualStellarDamageResult {
  const emBonusFrac = stellarEmBonus(contributor.em);
  const rxBonus = 1 + emBonusFrac + (contributor.reactionBonusPct ?? 0) / 100;
  const baseDmgBonus = 1 + (contributor.baseDmgBonusPct ?? 0) / 100;
  const elevation = 1 + (contributor.elevationBonusPct ?? 0) / 100;
  const res = resMultiplier(enemyResPct !== undefined ? enemyResPct : contributor.enemyRes);

  const baseTerm = coeff * levelMultiplier(contributor.levelChar) * baseDmgBonus * rxBonus;
  const totalBase = baseTerm + (contributor.flatDmg ?? 0);
  const nonCrit = totalBase * elevation * res;

  const cr = clamp(contributor.critRate, 0, 100) / 100;
  const cd = contributor.critDmg / 100;
  const crit = nonCrit * (1 + cd);
  const avg = nonCrit * (1 + cr * cd);

  return {
    nonCrit,
    crit,
    avg,
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
export function combineRankedContributors(
  individualResults: { nonCrit: number; critRate: number; critDmg: number }[],
): StellarResult {
  if (!individualResults.length) {
    return { nonCrit: 0, crit: 0, avg: 0 };
  }

  // Sort descending by Non-Crit damage
  const sorted = [...individualResults].sort((a, b) => b.nonCrit - a.nonCrit);

  const d1 = sorted[0];
  const d2 = sorted[1];
  const d3 = sorted[2];
  const d4 = sorted[3];

  const combinedNonCrit =
    0.60 * (d1?.nonCrit ?? 0) +
    0.30 * (d2?.nonCrit ?? 0) +
    0.05 * (d3?.nonCrit ?? 0) +
    0.05 * (d4?.nonCrit ?? 0);

  // Benchmark CRIT ratio from highest contributor (D1)
  const benchmarkCritRate = d1?.critRate ?? 0;
  const benchmarkCritDmg = d1?.critDmg ?? 0;

  const cr = clamp(benchmarkCritRate, 0, 100) / 100;
  const cd = benchmarkCritDmg / 100;
  const combinedCrit = combinedNonCrit * (1 + cd);
  const combinedAvg = combinedNonCrit * (1 + cr * cd);

  return {
    nonCrit: combinedNonCrit,
    crit: combinedCrit,
    avg: combinedAvg,
    benchmarkCritRate,
    benchmarkCritDmg,
    contributorCount: individualResults.length,
  };
}

/**
 * Calculates indirect Stellar Swirl reaction damage for a variant (initial, vortex-lv1, vortex-lv2).
 * Consumes the active character stats and optional active party support contributors.
 */
export function indirectStellarDamage(
  variant: StellarSwirlVariant,
  stats: DamageStats,
  stellarBaseBonusPct: number = 0,
  panelReactionBonusPct: number = 0,
  extraContributors: ContributorParams[] = [],
): StellarResult {
  const multiplierBonusPct =
    (stats.stellarSwirlMultiplier ?? 0) +
    (stats.stellarReactionMultiplier ?? 0);
  const coeff = STELLAR_INDIRECT_COEFFICIENT[variant] + multiplierBonusPct / 100;

  // Specific and superset bonuses for Stellar
  const specificDmgBonus =
    (stats.stellarSwirlDmgBonus ?? 0) +
    (stats.stellarGlimmerDmgBonus ?? 0) +
    (stats.stellarReactionDmgBonus ?? 0);

  const specificBaseBonus =
    stellarBaseBonusPct +
    (stats.stellarSwirlBaseDmgMultiplier ?? 0) +
    (stats.stellarReactionBaseDmgMultiplier ?? 0);

  const specificElevation =
    (stats.stellarSwirlSpecialDmgBonus ?? 0) +
    (stats.stellarReactionSpecialDmgBonus ?? 0);

  const specificFlatDmg =
    (stats.stellarSwirlReactionDmgIncrease ?? 0) +
    (stats.stellarSwirlDmgIncrease ?? 0) +
    (stats.stellarReactionDmgIncrease ?? 0);

  const specificCritRate =
    (stats.stellarSwirlCritRate ?? 0) +
    (stats.stellarReactionCritRate ?? 0);

  const specificCritDmg =
    (stats.stellarSwirlCritDmg ?? 0) +
    (stats.stellarReactionCritDmg ?? 0);

  const variantCritRate =
    variant === "initial"
      ? (stats.anemoCritRate ?? 0)
      : (stats.cryoCritRate ?? 0);

  const variantCritDmg =
    variant === "initial"
      ? (stats.anemoCritDmg ?? 0)
      : (stats.cryoCritDmg ?? 0);

  // Active character contributor
  // Initial Stellar Swirl deals Anemo DMG; Vortex explosions deal Cryo AoE DMG
  const targetRes =
    variant === "initial"
      ? (stats.enemyAnemoRes ?? stats.enemyRes)
      : (stats.enemyCryoRes ?? stats.enemyRes);

  const activeContributor: ContributorParams = {
    id: "active-char",
    name: "Active Character",
    levelChar: stats.levelChar,
    em: stats.em,
    critRate: stats.critRate + specificCritRate + variantCritRate,
    critDmg: stats.critDmg + specificCritDmg + variantCritDmg,
    enemyRes: targetRes,
    reactionBonusPct: panelReactionBonusPct + specificDmgBonus,
    baseDmgBonusPct: specificBaseBonus,
    elevationBonusPct: specificElevation,
    flatDmg: specificFlatDmg,
  };

  const allContributors = [activeContributor, ...extraContributors];
  const individualResults = allContributors.map(c =>
    computeIndividualStellarDamage(coeff, c, undefined, targetRes)
  );

  return combineRankedContributors(individualResults);
}
