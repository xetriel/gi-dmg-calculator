// Lunar reaction damage, per the saved Damage wiki page.
//
// Indirect (triggered by applying elements; Lunar-Charged / Lunar-Crystallize only):
//   DMG = Mult_Indirect × LevelMult(contributor) × (1 + LunarBaseDmgBonus%)
//         × (1 + 6·EM/(EM+2000) + ReactionBonus%) × Elevation × RESMult × CritMult
// Direct (dealt by a character's own lunar ability):
//   DMG = (Mult_Direct × Ability% × Stat × (1 + LunarBaseDmgBonus%)
//         × (1 + 6·EM/(EM+2000) + ReactionBonus%) + Additive) × Elevation × RESMult × CritMult
// Lunar reaction DMG CAN crit (uses the contributor's CRIT stats).
// Elevation multiplier defaults to 1 (regional mechanic, out of scope).
import type { Element } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";
import { resMultiplier, stellarEmBonus, type DamageStats } from "./damage";

export type LunarType = "lunar-charged" | "lunar-crystallize" | "lunar-bloom";

export const LUNAR_LABEL: Record<LunarType, string> = {
  "lunar-charged": "Lunar-Charged",
  "lunar-crystallize": "Lunar-Crystallize",
  "lunar-bloom": "Lunar-Bloom",
};

// Indirect multipliers (wiki: 1.8 Lunar-Charged, 0.96 Lunar-Crystallize;
// Lunar-Bloom deals no indirect reaction DMG — its cores are ordinary Bloom cores).
export const LUNAR_INDIRECT_MULTIPLIER: Partial<Record<LunarType, number>> = {
  "lunar-charged": 1.8,
  "lunar-crystallize": 0.96,
};

// Direct multipliers (wiki: 3 Lunar-Charged, 1.6 Lunar-Crystallize, 1 Lunar-Bloom).
export const LUNAR_DIRECT_MULTIPLIER: Record<LunarType, number> = {
  "lunar-charged": 3,
  "lunar-crystallize": 1.6,
  "lunar-bloom": 1,
};

// Indirect lunar reactions this element can contribute to (Electro-Charged family
// needs Electro or Hydro application; Crystallize needs Geo).
export const LUNAR_BY_ELEMENT: Record<Element, LunarType[]> = {
  Electro: ["lunar-charged"],
  Hydro: ["lunar-charged", "lunar-bloom"],
  Geo: ["lunar-crystallize"],
  Pyro: [], Cryo: [], Anemo: [], Dendro: ["lunar-bloom"],
};

export interface LunarResult { nonCrit: number; crit: number; avg: number }

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

function withCrit(nonCrit: number, stats: DamageStats): LunarResult {
  const cr = clamp(stats.critRate, 0, 100) / 100;
  const cd = stats.critDmg / 100;
  return { nonCrit, crit: nonCrit * (1 + cd), avg: nonCrit * (1 + cr * cd) };
}

// Same 6·EM/(EM+2000) term the Stellar/direct-reaction branch uses.
export const lunarEmBonus = stellarEmBonus;

// Indirect lunar reaction DMG for one contributor (the calculator's character).
export function indirectLunarDamage(
  type: LunarType,
  stats: DamageStats,
  lunarBaseDmgBonusPct: number = 0,
  reactionBonusPct: number = 0,
): LunarResult {
  const mult = LUNAR_INDIRECT_MULTIPLIER[type];
  if (!mult) return { nonCrit: 0, crit: 0, avg: 0 };

  let specificDmgBonus = 0;
  let specificElevation = 0;
  let specificFlatDmg = 0;
  if (type === "lunar-charged") {
    specificDmgBonus = stats.lunarChargedDmgBonus ?? 0;
    specificElevation = stats.lunarChargedElevation ?? 0;
    specificFlatDmg = stats.lunarChargedFlatDmg ?? 0;
  } else if (type === "lunar-bloom") {
    specificDmgBonus = stats.lunarBloomDmgBonus ?? 0;
    specificElevation = stats.lunarBloomElevation ?? 0;
    specificFlatDmg = stats.lunarBloomFlatDmg ?? 0;
  } else if (type === "lunar-crystallize") {
    specificDmgBonus = stats.lunarCrystallizeDmgBonus ?? 0;
    specificElevation = stats.lunarCrystallizeElevation ?? 0;
    specificFlatDmg = stats.lunarCrystallizeFlatDmg ?? 0;
  }

  const baseTerm =
    mult *
    levelMultiplier(stats.levelChar) *
    (1 + lunarBaseDmgBonusPct / 100) *
    (1 + lunarEmBonus(stats.em) + (reactionBonusPct + specificDmgBonus) / 100);

  const totalBase = baseTerm + specificFlatDmg;
  const specialBonusFactor = 1 + specificElevation / 100;
  const nonCrit = totalBase * specialBonusFactor * resMultiplier(stats.enemyRes);

  return withCrit(nonCrit, stats);
}
