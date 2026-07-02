// Transformative reaction damage, per the wiki's formula:
//   DMG = ReactionMult × LevelMult(attacker) × (1 + 16·EM/(EM+2000) + ReactionBonus%)
//         × RESMult(target)
// Transformative hits do not scale with ATK/talents and (baseline) cannot CRIT.
// Multipliers taken verbatim from the saved Damage wiki page.
import type { Element } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";
import { resMultiplier } from "./damage";

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
