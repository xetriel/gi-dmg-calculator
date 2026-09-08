// Transformative reaction damage, per the wiki's formula:
//   DMG = ReactionMult × LevelMult(attacker) × (1 + 16·EM/(EM+2000) + ReactionBonus%)
//         × RESMult(target)
// Transformative hits do not scale with ATK/talents. They can CRIT if reaction CRIT stats are granted.
import type { Element } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";
import { resMultiplier, type DamageStats } from "./damage";

export type TransformativeType =
  | "burning" | "swirl" | "superconduct" | "electro-charged"
  | "bloom" | "overloaded" | "burgeon" | "hyperbloom" | "shatter";

export const TRANSFORMATIVE_MULTIPLIER: Record<TransformativeType, number> = {
  burning: 0.25,
  swirl: 0.6,
  superconduct: 1.5,
  "electro-charged": 2.0,
  bloom: 2.0,
  overloaded: 2.75,
  burgeon: 3.0,
  hyperbloom: 3.0,
  shatter: 3.0,
};

export const TRANSFORMATIVE_LABEL: Record<TransformativeType, string> = {
  burning: "Burning",
  swirl: "Swirl",
  superconduct: "Superconduct",
  "electro-charged": "Electro-Charged",
  bloom: "Bloom",
  overloaded: "Overloaded",
  burgeon: "Burgeon",
  hyperbloom: "Hyperbloom",
  shatter: "Shatter",
};

// Transformative reactions the character's own element can trigger.
export const TRANSFORMATIVE_BY_ELEMENT: Record<Element, TransformativeType[]> = {
  Pyro: ["overloaded", "burning", "burgeon"],
  Hydro: ["electro-charged", "bloom"],
  Electro: ["overloaded", "electro-charged", "superconduct", "hyperbloom"],
  Cryo: ["superconduct", "shatter"],
  Anemo: ["swirl"],
  Geo: [],
  Dendro: ["bloom", "burning"],
};

export interface TransformativeResult {
  nonCrit: number;
  crit: number;
  avg: number;
  canCrit: boolean;
  critRate?: number;
  critDmg?: number;
  specificBonus: number;
  rxCritRate: number;
  rxCritDmg: number;
  targetRes: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

export function transformativeDamage(
  type: TransformativeType,
  levelChar: number,
  em: number,
  enemyResPct: number,
  reactionBonusPct: number = 0,
): number {
  const emBonus = (16 * em) / (em + 2000);
  return (
    TRANSFORMATIVE_MULTIPLIER[type] *
    levelMultiplier(levelChar) *
    (1 + emBonus + reactionBonusPct / 100) *
    resMultiplier(enemyResPct)
  );
}

/**
 * Computes transformative reaction damage with reaction-specific bonuses,
 * element-specific enemy resistance, and reaction CRIT bonuses.
 */
export function transformativeDamageWithStats(
  type: TransformativeType,
  stats: DamageStats,
  panelBonus: number = 0,
  swirlElement?: Element,
): TransformativeResult {
  let specificBonus = 0;
  let rxCritRate = 0;
  let rxCritDmg = 0;
  let targetRes = stats.enemyRes;

  switch (type) {
    case "burning":
      specificBonus = stats.burningDmgBonus ?? 0;
      rxCritRate = stats.burningCritRate ?? 0;
      rxCritDmg = stats.burningCritDmg ?? 0;
      targetRes = stats.enemyPyroRes ?? stats.enemyRes;
      break;
    case "bloom":
      specificBonus = stats.bloomDmgBonus ?? 0;
      rxCritRate = stats.bloomCritRate ?? 0;
      rxCritDmg = stats.bloomCritDmg ?? 0;
      targetRes = stats.enemyDendroRes ?? stats.enemyRes;
      break;
    case "burgeon":
      specificBonus = stats.burgeonDmgBonus ?? 0;
      rxCritRate = stats.burgeonCritRate ?? 0;
      rxCritDmg = stats.burgeonCritDmg ?? 0;
      targetRes = stats.enemyDendroRes ?? stats.enemyRes;
      break;
    case "hyperbloom":
      specificBonus = stats.hyperbloomDmgBonus ?? 0;
      rxCritRate = stats.hyperbloomCritRate ?? 0;
      rxCritDmg = stats.hyperbloomCritDmg ?? 0;
      targetRes = stats.enemyDendroRes ?? stats.enemyRes;
      break;
    case "swirl":
      specificBonus = stats.swirlDmgBonus ?? 0;
      rxCritRate = stats.swirlCritRate ?? 0;
      rxCritDmg = stats.swirlCritDmg ?? 0;
      if (swirlElement) {
        switch (swirlElement) {
          case "Pyro": targetRes = stats.enemyPyroRes ?? stats.enemyRes; break;
          case "Hydro": targetRes = stats.enemyHydroRes ?? stats.enemyRes; break;
          case "Electro": targetRes = stats.enemyElectroRes ?? stats.enemyRes; break;
          case "Cryo": targetRes = stats.enemyCryoRes ?? stats.enemyRes; break;
          default: targetRes = stats.enemyAnemoRes ?? stats.enemyRes; break;
        }
      } else {
        targetRes = stats.enemyAnemoRes ?? stats.enemyRes;
      }
      break;
    case "overloaded":
      specificBonus = stats.overloadedDmgBonus ?? 0;
      targetRes = stats.enemyPyroRes ?? stats.enemyRes;
      break;
    case "superconduct":
      specificBonus = stats.superconductDmgBonus ?? 0;
      rxCritRate = stats.superconductCritRate ?? 0;
      rxCritDmg = stats.superconductCritDmg ?? 0;
      targetRes = stats.enemyCryoRes ?? stats.enemyRes;
      break;
    case "electro-charged":
      specificBonus = stats.electroChargedDmgBonus ?? 0;
      targetRes = stats.enemyElectroRes ?? stats.enemyRes;
      break;
    case "shatter":
      specificBonus = stats.shatteredDmgBonus ?? 0;
      targetRes = stats.enemyPhysicalRes ?? stats.enemyRes;
      break;
  }

  const nonCrit = transformativeDamage(type, stats.levelChar, stats.em, targetRes, panelBonus + specificBonus);
  const canCrit = rxCritRate > 0 && rxCritDmg > 0;

  if (canCrit) {
    const cr = clamp(rxCritRate, 0, 100) / 100;
    const cd = rxCritDmg / 100;
    return {
      nonCrit,
      crit: nonCrit * (1 + cd),
      avg: nonCrit * (1 + cr * cd),
      canCrit: true,
      critRate: rxCritRate,
      critDmg: rxCritDmg,
      specificBonus,
      rxCritRate,
      rxCritDmg,
      targetRes,
    };
  }

  return {
    nonCrit,
    crit: nonCrit,
    avg: nonCrit,
    canCrit: false,
    specificBonus,
    rxCritRate,
    rxCritDmg,
    targetRes,
  };
}
