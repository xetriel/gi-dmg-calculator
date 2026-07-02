// Pure, framework-free Genshin damage engine.
// Implements the wiki's General Damage Formula:
//   DMG = (Talent% × Stat × BaseDMGMultiplier + AdditiveBaseDMGBonus)
//         × DMGBonusMult × DEFMult × RESMult × AmplifyingMult × CritMult
// Consumes resolved numeric stats + a per-hit descriptor and returns
// Non-Crit / CRIT / Average outgoing damage. No React, no I/O — easily testable.
import type { ScalingSource, Element, ReactionType } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";

export interface DamageStats {
  atk: number;
  hp: number;
  def: number;
  em: number;
  critRate: number;      // percent
  critDmg: number;       // percent
  dmgBonus: number;      // percent
  dmgReduction: number;  // percent — "DMG Reduction / -(DMG Bonus)"
  enemyRes: number;      // percent
  levelChar: number;
  levelEnemy: number;
  defReduction: number;  // percent
  defIgnore: number;     // percent
}

export interface HitInput {
  multiplier: number;         // talent multiplier, percent
  scaling: ScalingSource;
  element: Element;           // trigger element (for reaction multipliers)
  reaction: ReactionType;
  reactionBonusPct: number;   // extra reaction bonus %, e.g. from artifacts/talents
  flatDmgBonus?: number;      // additive base DMG (e.g. Masque, Dark-Shattering Flame, C2 Blood Blossom)
  baseDmgMultiplier?: number; // base DMG multiplier (e.g. Neuvillette Draconic stacks ×1.1/1.25/1.6)
  critDmgBonusPct?: number;   // per-hit CRIT DMG bonus (e.g. Neuvillette C2 on Equitable Judgment)
  critRateBonusPct?: number;  // per-hit CRIT Rate bonus (e.g. Arlecchino C6 on NA/Burst)
  bonusDmgPct?: number;       // per-hit DMG Bonus% addition (e.g. Clorinde C4 on Last Lightfall)
}

export interface HitResult {
  nonCrit: number;
  crit: number;
  avg: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

export function scalingTotal(stats: DamageStats, source: ScalingSource): number {
  switch (source) {
    case "atk": return stats.atk;
    case "hp": return stats.hp;
    case "def": return stats.def;
    case "em": return stats.em;
  }
}

// (1 + DMG Bonus% - DMG Reduction%). The registry's dmgReduction field is
// labeled "DMG Reduction / -(DMG Bonus)", so it subtracts from the bonus.
// `extraPct` allows per-hit DMG Bonus additions (same slot, additive).
export function dmgBonusMultiplier(stats: DamageStats, extraPct: number = 0): number {
  return 1 + (stats.dmgBonus + extraPct - stats.dmgReduction) / 100;
}

// Enemy DEF multiplier. Per requirement, DEF debuffs are negative %DEF Bonuses
// and the total %DEF Bonus is floored at -90% (enemy DEF factor >= 0.10).
export function defMultiplier(stats: DamageStats): number {
  const defBonusPct = Math.max(-(stats.defReduction + stats.defIgnore), -90);
  const k = 1 + defBonusPct / 100; // enemy DEF factor, >= 0.10
  const lc = stats.levelChar + 100;
  return lc / (lc + (stats.levelEnemy + 100) * k);
}

// Enemy RES multiplier from a single all-element RES%.
export function resMultiplier(enemyResPct: number): number {
  const r = enemyResPct / 100;
  if (r < 0) return 1 - r / 2;
  if (r < 0.75) return 1 - r;
  return 1 / (4 * r + 1);
}

// Amplifying reaction base multipliers keyed by the trigger element.
const AMP_BASE: Record<Element, Partial<Record<ReactionType, number>>> = {
  Pyro: { vaporize: 1.5, melt: 2.0 },
  Hydro: { vaporize: 2.0 },
  Cryo: { melt: 1.5 },
  Electro: {},
  Anemo: {},
  Geo: {},
  Dendro: {},
};

// Catalyze (additive) reactions keyed by trigger element. Aggravate = Electro.
// (Spread would be Dendro 1.25 — no Dendro character in the roster yet.)
const CATALYZE_BASE: Record<Element, Partial<Record<ReactionType, number>>> = {
  Electro: { aggravate: 1.15 },
  Pyro: {}, Hydro: {}, Cryo: {}, Anemo: {}, Geo: {}, Dendro: {},
};

// Reactions selectable for a given element (always includes "none").
export function availableReactions(element: Element): ReactionType[] {
  return [
    "none",
    ...(Object.keys(AMP_BASE[element]) as ReactionType[]),
    ...(Object.keys(CATALYZE_BASE[element]) as ReactionType[]),
  ];
}

// Amplifying multiplier: base × (1 + 2.78·EM/(EM+1400) + reaction bonus).
export function amplifyingMultiplier(
  element: Element,
  reaction: ReactionType,
  em: number,
  reactionBonusPct: number,
): number {
  if (reaction === "none") return 1;
  const base = AMP_BASE[element][reaction];
  if (!base) return 1; // not an amplifying reaction for this element
  const emBonus = (2.78 * em) / (em + 1400);
  return base * (1 + emBonus + reactionBonusPct / 100);
}

// Catalyze additive base DMG bonus (wiki "Additive Base DMG Bonus, Catalyze"):
// ReactionMult × LevelMult(character) × (1 + 5·EM/(EM+1200) + reaction bonus).
export function catalyzeAdditive(
  element: Element,
  reaction: ReactionType,
  levelChar: number,
  em: number,
  reactionBonusPct: number,
): number {
  const base = CATALYZE_BASE[element][reaction];
  if (!base) return 0;
  const emBonus = (5 * em) / (em + 1200);
  return base * levelMultiplier(levelChar) * (1 + emBonus + reactionBonusPct / 100);
}

export function computeHit(stats: DamageStats, hit: HitInput): HitResult {
  const additive =
    (hit.flatDmgBonus ?? 0) +
    catalyzeAdditive(hit.element, hit.reaction, stats.levelChar, stats.em, hit.reactionBonusPct);
  const base =
    (hit.multiplier / 100) * scalingTotal(stats, hit.scaling) * (hit.baseDmgMultiplier ?? 1) +
    additive;
  const nonCrit =
    base *
    dmgBonusMultiplier(stats, hit.bonusDmgPct ?? 0) *
    defMultiplier(stats) *
    resMultiplier(stats.enemyRes) *
    amplifyingMultiplier(hit.element, hit.reaction, stats.em, hit.reactionBonusPct);

  const cr = clamp(stats.critRate + (hit.critRateBonusPct ?? 0), 0, 100) / 100;
  const cd = (stats.critDmg + (hit.critDmgBonusPct ?? 0)) / 100;
  return {
    nonCrit,
    crit: nonCrit * (1 + cd),
    avg: nonCrit * (1 + cr * cd),
  };
}
