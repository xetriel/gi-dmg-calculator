// Pure, framework-free Genshin damage engine.
// Implements the wiki's General Damage Formula:
//   DMG = (Talent% × Stat × BaseDMGMultiplier + AdditiveBaseDMGBonus)
//         × DMGBonusMult × DEFMult × RESMult × AmplifyingMult × CritMult
// Consumes resolved numeric stats + a per-hit descriptor and returns
// Non-Crit / CRIT / Average outgoing damage. No React, no I/O — easily testable.
import type { ScalingSource, Element, ReactionType, HitCategory } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";

export interface DamageStats {
  atk: number;
  hp: number;
  def: number;
  em: number;
  critRate: number;      // percent
  critDmg: number;       // percent
  dmgBonus: number;      // percent — Elemental/Physical/All DMG Bonus (shown in-game)
  normalDmgBonus: number;   // percent — Normal Attack DMG Bonus (hidden in-game)
  chargedDmgBonus: number;  // percent — Charged Attack DMG Bonus (hidden in-game)
  plungeDmgBonus: number;   // percent — Plunging Attack DMG Bonus (hidden in-game)
  skillDmgBonus: number;    // percent — Elemental Skill DMG Bonus (hidden in-game)
  burstDmgBonus: number;    // percent — Elemental Burst DMG Bonus (hidden in-game)
  pyroDmgBonus: number;     // percent — Pyro DMG Bonus
  hydroDmgBonus: number;    // percent — Hydro DMG Bonus
  dendroDmgBonus: number;   // percent — Dendro DMG Bonus
  electroDmgBonus: number;  // percent — Electro DMG Bonus
  anemoDmgBonus: number;    // percent — Anemo DMG Bonus
  cryoDmgBonus: number;     // percent — Cryo DMG Bonus
  geoDmgBonus: number;      // percent — Geo DMG Bonus
  physicalDmgBonus: number; // percent — Physical DMG Bonus
  dmgReduction: number;  // percent — "DMG Reduction / -(DMG Bonus)"
  enemyRes: number;      // percent
  levelChar: number;
  levelEnemy: number;
  defReduction: number;  // percent
  defIgnore: number;     // percent
  energyRecharge: number; // percent
  healingBonus: number;   // percent
  lunarChargedDmgBonus?: number;
  lunarBloomDmgBonus?: number;
  lunarCrystallizeDmgBonus?: number;
  lunarChargedElevation?: number;
  lunarBloomElevation?: number;
  lunarCrystallizeElevation?: number;
  lunarChargedFlatDmg?: number;
  lunarBloomFlatDmg?: number;
  lunarCrystallizeFlatDmg?: number;
}

// Per-hit direct-reaction parameters, shared by Stellar-Conduct and Direct Lunar
// hits (wiki "Stellar Reaction Damage" / "Direct Lunar Damage" — identical shape):
// reaction DMG that ignores DMG Bonus% and the enemy-DEF multiplier, uses the
// Lunar/Stellar EM bonus 6·EM/(EM+2000), and can CRIT.
export interface DirectReactionParams {
  coefficient: number;        // Base Reaction Coefficient (Polestar hits 1/1.45…1.9; Lunar-Crystallize 1.6)
  baseDmgBonusPct: number;    // %Reaction Base DMG Bonus (Light of Rationalisme / Moonsign passives, max 14)
  reactionBonusPct: number;   // %Reaction Bonus (e.g. constellation +30, artifacts)
  elevationBonusPct?: number; // %Reaction Elevation Bonus (e.g. constellation elevation)
  lunarType?: "lunar-charged" | "lunar-crystallize" | "lunar-bloom";
}

export interface HitInput {
  multiplier: number;         // talent multiplier, percent
  scaling: ScalingSource;
  element: Element | "Physical";           // trigger element (for reaction multipliers)
  reaction: ReactionType;
  reactionBonusPct: number;   // extra reaction bonus %, e.g. from artifacts/talents
  flatDmgBonus?: number;      // additive base DMG (e.g. Masque, Dark-Shattering Flame, C2 Blood Blossom)
  baseDmgMultiplier?: number; // base DMG multiplier (e.g. Neuvillette Draconic stacks ×1.1/1.25/1.6)
  critDmgBonusPct?: number;   // per-hit CRIT DMG bonus (e.g. Neuvillette C2 on Equitable Judgment)
  critRateBonusPct?: number;  // per-hit CRIT Rate bonus (e.g. Arlecchino C6 on NA/Burst)
  bonusDmgPct?: number;       // per-hit DMG Bonus% addition (e.g. Clorinde C4 on Last Lightfall)
  defIgnorePct?: number;      // per-hit DEF ignore % (e.g. Durin C6 on Burst)
  hitCategory?: HitCategory;  // talent-type DMG Bonus routing (normal/charged/plunge/skill/burst)
  charElement?: Element;      // character's base element for DMG Bonus routing
  dmgBonusLabel?: string;     // character's dynamic DMG bonus label
  directReaction?: DirectReactionParams; // present => compute through the direct-reaction branch
}

export interface HitResult {
  nonCrit: number;
  crit: number;
  avg: number;
  element?: Element | "Physical";
  reaction?: ReactionType;
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
// `hitCategory` selects the per-talent-type DMG Bonus (Normal/Charged/Plunge/Skill/Burst),
// which stacks additively with the elemental and physical DMG bonuses.
export function dmgBonusMultiplier(
  stats: DamageStats,
  extraPct: number = 0,
  hitCategory?: HitCategory,
  hitElement?: Element | "Physical",
  charElement?: Element,
  dmgBonusLabel: string = ""
): number {
  let categoryBonus = 0;
  switch (hitCategory) {
    case "normal":  categoryBonus = stats.normalDmgBonus; break;
    case "charged": categoryBonus = stats.chargedDmgBonus; break;
    case "plunge":  categoryBonus = stats.plungeDmgBonus; break;
    case "skill":   categoryBonus = stats.skillDmgBonus; break;
    case "burst":   categoryBonus = stats.burstDmgBonus; break;
    case "special": categoryBonus = 0; break;
  }

  // Determine base elemental/physical/all DMG Bonus from character's default dmgBonus field.
  // Defaults to stats.dmgBonus when elements/labels are omitted (e.g. in basic tests).
  let baseDmgBonus = 0;
  const isAllDmg = !dmgBonusLabel || dmgBonusLabel === "All DMG Bonus%" || dmgBonusLabel === "DMG Bonus%";
  if (isAllDmg || !charElement || hitElement === charElement) {
    baseDmgBonus = stats.dmgBonus;
  }

  // Add specific elemental/physical bonus
  let elementBonus = 0;
  if (hitElement) {
    switch (hitElement) {
      case "Pyro":     elementBonus = stats.pyroDmgBonus; break;
      case "Hydro":    elementBonus = stats.hydroDmgBonus; break;
      case "Dendro":   elementBonus = stats.dendroDmgBonus; break;
      case "Electro":  elementBonus = stats.electroDmgBonus; break;
      case "Anemo":    elementBonus = stats.anemoDmgBonus; break;
      case "Cryo":     elementBonus = stats.cryoDmgBonus; break;
      case "Geo":      elementBonus = stats.geoDmgBonus; break;
      case "Physical": elementBonus = stats.physicalDmgBonus; break;
    }
  }

  return 1 + (baseDmgBonus + categoryBonus + elementBonus + extraPct - stats.dmgReduction) / 100;
}

// Enemy DEF multiplier. Per requirement, DEF debuffs are negative %DEF Bonuses
// and the total %DEF Bonus is floored at -90% (enemy DEF factor >= 0.10).
export function defMultiplier(stats: DamageStats, extraIgnorePct: number = 0): number {
  const defBonusPct = Math.max(-(stats.defReduction + stats.defIgnore + extraIgnorePct), -90);
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

// Stellar/Lunar reaction EM bonus: 6·EM/(EM+2000) (as a fraction, not percent).
export function stellarEmBonus(em: number): number {
  return (6 * em) / (em + 2000);
}

// Stellar-Conduct Base Reaction Coefficient from Polestar recorded hits (0–10):
// 0 hits => 1; n>=1 => 1.4 + 0.05·n (1.45 … 1.9).
export function stellarBRC(hits: number): number {
  const n = clamp(Math.floor(hits), 0, 10);
  return n <= 0 ? 1 : 1.4 + 0.05 * n;
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
  let nonCrit: number;

  if (hit.directReaction) {
    // Direct-reaction branch (wiki "Stellar-Conduct Damage" / "Direct Lunar Damage"):
    //   ((Coeff × Mult% × Stat × (1 + %EMBonus + %ReactionBonus) × (1 + %BaseDMGBonus) × BaseDMGMult) + Additive)
    //   × SpecialBonusFactor × RESMult × CRIT
    const s = hit.directReaction;
    let specificDmgBonus = 0;
    let specificElevation = 0;
    let specificFlatDmg = 0;
    if (s.lunarType === "lunar-charged") {
      specificDmgBonus = stats.lunarChargedDmgBonus ?? 0;
      specificElevation = stats.lunarChargedElevation ?? 0;
      specificFlatDmg = stats.lunarChargedFlatDmg ?? 0;
    } else if (s.lunarType === "lunar-bloom") {
      specificDmgBonus = stats.lunarBloomDmgBonus ?? 0;
      specificElevation = stats.lunarBloomElevation ?? 0;
      specificFlatDmg = stats.lunarBloomFlatDmg ?? 0;
    } else if (s.lunarType === "lunar-crystallize") {
      specificDmgBonus = stats.lunarCrystallizeDmgBonus ?? 0;
      specificElevation = stats.lunarCrystallizeElevation ?? 0;
      specificFlatDmg = stats.lunarCrystallizeFlatDmg ?? 0;
    }

    const emBonusFrac = stellarEmBonus(stats.em);
    const emRxBonusFactor = 1 + emBonusFrac + (s.reactionBonusPct + specificDmgBonus) / 100;
    const baseDmgBonusFactor = 1 + s.baseDmgBonusPct / 100;
    const baseMultFactor = hit.baseDmgMultiplier ?? 1;

    const abilityBase = s.coefficient * (hit.multiplier / 100) * scalingTotal(stats, hit.scaling);
    const scaledBase = abilityBase * emRxBonusFactor * baseDmgBonusFactor * baseMultFactor;
    const totalBase = scaledBase + (hit.flatDmgBonus ?? 0) + specificFlatDmg;
    const specialBonusFactor = 1 + (specificElevation + (s.elevationBonusPct ?? 0)) / 100;

    nonCrit = totalBase * specialBonusFactor * resMultiplier(stats.enemyRes);
  } else {
    const additive =
      (hit.flatDmgBonus ?? 0) +
      (hit.element === "Physical" ? 0 : catalyzeAdditive(hit.element, hit.reaction, stats.levelChar, stats.em, hit.reactionBonusPct));
    const base =
      (hit.multiplier / 100) * scalingTotal(stats, hit.scaling) * (hit.baseDmgMultiplier ?? 1) +
      additive;
    nonCrit =
      base *
      dmgBonusMultiplier(
        stats,
        hit.bonusDmgPct ?? 0,
        hit.hitCategory,
        hit.element,
        hit.charElement,
        hit.dmgBonusLabel
      ) *
      defMultiplier(stats, hit.defIgnorePct) *
      resMultiplier(stats.enemyRes) *
      (hit.element === "Physical" ? 1 : amplifyingMultiplier(hit.element, hit.reaction, stats.em, hit.reactionBonusPct));
  }

  const cr = clamp(stats.critRate + (hit.critRateBonusPct ?? 0), 0, 100) / 100;
  const cd = (stats.critDmg + (hit.critDmgBonusPct ?? 0)) / 100;
  return {
    nonCrit,
    crit: nonCrit * (1 + cd),
    avg: nonCrit * (1 + cr * cd),
    element: hit.element,
    reaction: hit.reaction,
  };
}
