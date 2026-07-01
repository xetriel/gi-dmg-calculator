// Pure, framework-free Genshin damage engine (v1).
// Consumes resolved numeric stats + a per-hit descriptor and returns
// Non-Crit / CRIT / Average outgoing damage. No React, no I/O — easily testable.
import type { ScalingSource, Element, ReactionType } from "@/data/registry/types";

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
  element: Element;           // trigger element (for reaction base multiplier)
  reaction: ReactionType;
  reactionBonusPct: number;   // extra reaction bonus %, e.g. from artifacts/talents
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
export function dmgBonusMultiplier(stats: DamageStats): number {
  return 1 + (stats.dmgBonus - stats.dmgReduction) / 100;
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

// Reactions the engine can apply for a given element (always includes "none").
export function availableReactions(element: Element): ReactionType[] {
  return ["none", ...(Object.keys(AMP_BASE[element]) as ReactionType[])];
}

// Amplifying multiplier: base × (1 + EM reaction bonus + extra reaction bonus).
export function amplifyingMultiplier(
  element: Element,
  reaction: ReactionType,
  em: number,
  reactionBonusPct: number,
): number {
  if (reaction === "none") return 1;
  const base = AMP_BASE[element][reaction];
  if (!base) return 1; // reaction not valid for this element
  const emBonus = (2.78 * em) / (em + 1400);
  return base * (1 + emBonus + reactionBonusPct / 100);
}

export function computeHit(stats: DamageStats, hit: HitInput): HitResult {
  const base = (hit.multiplier / 100) * scalingTotal(stats, hit.scaling);
  const nonCrit =
    base *
    dmgBonusMultiplier(stats) *
    defMultiplier(stats) *
    resMultiplier(stats.enemyRes) *
    amplifyingMultiplier(hit.element, hit.reaction, stats.em, hit.reactionBonusPct);

  const cr = clamp(stats.critRate, 0, 100) / 100;
  const cd = stats.critDmg / 100;
  return {
    nonCrit,
    crit: nonCrit * (1 + cd),
    avg: nonCrit * (1 + cr * cd),
  };
}
