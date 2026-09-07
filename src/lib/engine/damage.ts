// Pure, framework-free Genshin damage engine.
// Implements the wiki's General Damage Formula:
//   DMG = (Talent% × Stat × BaseDMGMultiplier + AdditiveBaseDMGBonus)
//         × DMGBonusMult × DEFMult × RESMult × AmplifyingMult × CritMult
// Consumes resolved numeric stats + a per-hit descriptor and returns
// Non-Crit / CRIT / Average outgoing damage. No React, no I/O — easily testable.
import type { ScalingSource, Element, ReactionType, HitCategory } from "@/data/registry/types";
import { levelMultiplier } from "./level-multiplier";

export interface DamageStats {
  // 1. Basic Stats
  atk: number;
  hp: number;
  def: number;
  em: number;
  critRate: number;      // percent
  critDmg: number;       // percent
  energyRecharge: number; // percent
  healingBonus: number;   // percent
  hpPercent?: number;
  atkPercent?: number;
  defPercent?: number;

  // 2. Elemental DMG Bonuses
  pyroDmgBonus: number;     // percent — Pyro DMG Bonus
  hydroDmgBonus: number;    // percent — Hydro DMG Bonus
  dendroDmgBonus: number;   // percent — Dendro DMG Bonus
  electroDmgBonus: number;  // percent — Electro DMG Bonus
  anemoDmgBonus: number;    // percent — Anemo DMG Bonus
  cryoDmgBonus: number;     // percent — Cryo DMG Bonus
  geoDmgBonus: number;      // percent — Geo DMG Bonus
  physicalDmgBonus: number; // percent — Physical DMG Bonus
  dmgBonus: number;         // percent — Elemental/Physical/All DMG Bonus (shown in-game)
  commonDmgBonus?: number;  // percent — Common / All DMG Bonus

  // 3. Enemy Debuffs
  enemyRes: number;         // percent (global fallback)
  enemyPhysicalRes?: number;
  enemyAnemoRes?: number;
  enemyGeoRes?: number;
  enemyElectroRes?: number;
  enemyHydroRes?: number;
  enemyPyroRes?: number;
  enemyCryoRes?: number;
  enemyDendroRes?: number;
  defReduction: number;     // percent
  defIgnore: number;        // percent

  // 4. Self Resistances
  selfPhysicalRes?: number;
  selfAnemoRes?: number;
  selfGeoRes?: number;
  selfElectroRes?: number;
  selfHydroRes?: number;
  selfPyroRes?: number;
  selfCryoRes?: number;
  selfDendroRes?: number;

  // 5. Reaction DMG Bonuses
  overloadedDmgBonus?: number;
  shatteredDmgBonus?: number;
  electroChargedDmgBonus?: number;
  superconductDmgBonus?: number;
  swirlDmgBonus?: number;
  burningDmgBonus?: number;
  bloomDmgBonus?: number;
  burgeonDmgBonus?: number;
  hyperbloomDmgBonus?: number;
  vaporizeDmgBonus?: number;
  meltDmgBonus?: number;
  spreadDmgBonus?: number;
  aggravateDmgBonus?: number;

  lunarChargedDmgBonus?: number;
  lunarBloomDmgBonus?: number;
  lunarCrystallizeDmgBonus?: number;
  stellarConductDmgBonus?: number;
  stellarSwirlDmgBonus?: number;
  stellarGlimmerDmgBonus?: number;
  lunarReactionDmgBonus?: number;
  stellarReactionDmgBonus?: number;

  lunarChargedBaseDmgMultiplier?: number;
  lunarBloomBaseDmgMultiplier?: number;
  lunarCrystallizeBaseDmgMultiplier?: number;
  stellarConductBaseDmgMultiplier?: number;
  stellarSwirlBaseDmgMultiplier?: number;
  lunarReactionBaseDmgMultiplier?: number;
  stellarReactionBaseDmgMultiplier?: number;

  lunarChargedSpecialDmgBonus?: number;
  lunarBloomSpecialDmgBonus?: number;
  lunarCrystallizeSpecialDmgBonus?: number;
  stellarConductSpecialDmgBonus?: number;
  stellarSwirlSpecialDmgBonus?: number;
  lunarReactionSpecialDmgBonus?: number;
  stellarReactionSpecialDmgBonus?: number;

  stellarConductMultiplier?: number;
  stellarSwirlMultiplier?: number;
  stellarReactionMultiplier?: number;

  lunarChargedElevation?: number;
  lunarBloomElevation?: number;
  lunarCrystallizeElevation?: number;

  // 6. Reaction CRIT Bonuses
  lunarChargedCritRate?: number;
  lunarChargedCritDmg?: number;
  burningCritRate?: number;
  burningCritDmg?: number;
  bloomCritRate?: number;
  bloomCritDmg?: number;
  burgeonCritRate?: number;
  burgeonCritDmg?: number;
  hyperbloomCritRate?: number;
  hyperbloomCritDmg?: number;
  lunarBloomCritRate?: number;
  lunarBloomCritDmg?: number;
  swirlCritRate?: number;
  swirlCritDmg?: number;
  lunarCrystallizeCritRate?: number;
  lunarCrystallizeCritDmg?: number;
  stellarConductCritRate?: number;
  stellarConductCritDmg?: number;
  stellarSwirlCritRate?: number;
  stellarSwirlCritDmg?: number;
  lunarReactionCritRate?: number;
  lunarReactionCritDmg?: number;
  stellarReactionCritRate?: number;
  stellarReactionCritDmg?: number;

  // 7. Elemental Damage Increases (Additive Flat Base DMG)
  physicalDmgIncrease?: number;
  anemoDmgIncrease?: number;
  geoDmgIncrease?: number;
  electroDmgIncrease?: number;
  hydroDmgIncrease?: number;
  pyroDmgIncrease?: number;
  cryoDmgIncrease?: number;
  dendroDmgIncrease?: number;
  commonDmgIncrease?: number;

  lunarBloomDmgIncrease?: number;
  lunarCrystallizeDmgIncrease?: number;
  stellarConductDmgIncrease?: number;
  stellarSwirlDmgIncrease?: number;

  lunarChargedReactionDmgIncrease?: number;
  lunarChargedDirectDmgIncrease?: number;
  lunarBloomReactionDmgIncrease?: number;
  lunarBloomDirectDmgIncrease?: number;
  lunarCrystallizeReactionDmgIncrease?: number;
  lunarCrystallizeDirectDmgIncrease?: number;
  stellarConductReactionDmgIncrease?: number;
  stellarConductDirectDmgIncrease?: number;
  stellarSwirlReactionDmgIncrease?: number;
  stellarSwirlDirectDmgIncrease?: number;
  lunarReactionDmgIncrease?: number;
  stellarReactionDmgIncrease?: number;

  lunarChargedFlatDmg?: number;
  lunarBloomFlatDmg?: number;
  lunarCrystallizeFlatDmg?: number;
  flatDmgBonus?: number;

  // 8. Talent Damage Increases (Additive Flat Base DMG)
  normalDmgIncrease?: number;
  chargedDmgIncrease?: number;
  plungingCollisionDmgIncrease?: number;
  plungingImpactDmgIncrease?: number;
  skillDmgIncrease?: number;
  burstDmgIncrease?: number;

  // 9. Elemental CRIT Bonuses
  physicalCritRate?: number;
  physicalCritDmg?: number;
  anemoCritRate?: number;
  anemoCritDmg?: number;
  geoCritRate?: number;
  geoCritDmg?: number;
  electroCritRate?: number;
  electroCritDmg?: number;
  hydroCritRate?: number;
  hydroCritDmg?: number;
  pyroCritRate?: number;
  pyroCritDmg?: number;
  cryoCritRate?: number;
  cryoCritDmg?: number;
  dendroCritRate?: number;
  dendroCritDmg?: number;

  // 10. Talent DMG Bonuses
  normalDmgBonus: number;   // percent — Normal Attack DMG Bonus (hidden in-game)
  chargedDmgBonus: number;  // percent — Charged Attack DMG Bonus (hidden in-game)
  plungeDmgBonus: number;   // percent — Plunging Attack DMG Bonus (hidden in-game)
  skillDmgBonus: number;    // percent — Elemental Skill DMG Bonus (hidden in-game)
  burstDmgBonus: number;    // percent — Elemental Burst DMG Bonus (hidden in-game)
  plungingCollisionDmgBonus?: number;
  plungingImpactDmgBonus?: number;
  plungingDmgBonus?: number;
  elementalAttDmgBonus?: number;
  normalAttEleDmgBonus?: number;

  // 11. Talent CRIT Bonuses
  normalCritRate?: number;
  normalCritDmg?: number;
  chargedCritRate?: number;
  chargedCritDmg?: number;
  plungingCollisionCritRate?: number;
  plungingCollisionCritDmg?: number;
  plungingImpactCritRate?: number;
  plungingImpactCritDmg?: number;
  plungingCritRate?: number;
  plungingCritDmg?: number;
  skillCritRate?: number;
  skillCritDmg?: number;
  burstCritRate?: number;
  burstCritDmg?: number;
  elementalAttCritRate?: number;
  elementalAttCritDmg?: number;

  // 12. Talent Level Boosts
  normalLevelBoost?: number;
  skillLevelBoost?: number;
  burstLevelBoost?: number;

  // 13. Base Stat Modifications
  baseAtk?: number;
  baseHp?: number;
  baseDef?: number;

  // 14. Stamina Buffs
  stamina?: number;
  staminaDec?: number;
  sprintingStaminaDec?: number;
  glidingStaminaDec?: number;
  chargedAttackStaminaDec?: number;

  // 15. Target & Misc Stats
  dmgReduction: number;  // percent — "DMG Reduction / -(DMG Bonus)"
  levelChar: number;
  levelEnemy: number;
  incomingHealingBonus?: number;
  shieldStrength?: number; // percent
  cdReduction?: number;
  movementSpd?: number;
  atkSpd?: number;
  weakspotDmg?: number;
  healIncrease?: number;
  allRes?: number;

  [key: string]: number | undefined;
}

// Per-hit direct-reaction parameters, shared by Stellar-Conduct and Direct Lunar
// hits (wiki "Stellar Reaction Damage" / "Direct Lunar Damage"):
// reaction DMG that ignores standard DMG Bonus% and the enemy-DEF multiplier, uses the
// Lunar/Stellar EM bonus 6·EM/(EM+2000), and can CRIT.
export interface DirectReactionParams {
  coefficient: number;        // Base Reaction Coefficient (Polestar hits 1/1.45…2.0; Lunar-Crystallize 1.6; Lunar-Charged 3)
  baseDmgBonusPct: number;    // %Reaction Base DMG Bonus (Light of Rationalisme / Moonsign passives)
  reactionBonusPct: number;   // %Reaction Bonus (e.g. constellation +30, artifacts)
  elevationBonusPct?: number; // %Reaction Elevation Bonus (e.g. constellation elevation)
  lunarType?: "lunar-charged" | "lunar-crystallize" | "lunar-bloom";
  stellarType?: "stellar-swirl" | "stellar-glimmer" | "stellar-conduct";
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
    case "normal":
      categoryBonus = stats.normalDmgBonus;
      if (hitElement && hitElement !== "Physical") {
        categoryBonus += stats.normalAttEleDmgBonus ?? 0;
      }
      break;
    case "charged":
      categoryBonus = stats.chargedDmgBonus;
      break;
    case "plunge":
      categoryBonus = (stats.plungeDmgBonus ?? 0) + (stats.plungingDmgBonus ?? 0);
      break;
    case "skill":
      categoryBonus = stats.skillDmgBonus;
      break;
    case "burst":
      categoryBonus = stats.burstDmgBonus;
      break;
    case "special":
      categoryBonus = 0;
      break;
  }

  // Determine base elemental/physical/all DMG Bonus from character's default dmgBonus field.
  // Defaults to stats.dmgBonus when elements/labels are omitted (e.g. in basic tests).
  let baseDmgBonus = 0;
  const isAllDmg = !dmgBonusLabel || dmgBonusLabel === "All DMG Bonus%" || dmgBonusLabel === "DMG Bonus%";
  if (isAllDmg || !charElement || hitElement === charElement) {
    baseDmgBonus = stats.dmgBonus;
  }

  // Common DMG Bonus addition
  const commonBonus = stats.commonDmgBonus ?? 0;

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

  // Elemental Att. DMG Bonus (for any elemental attack)
  const eleAttBonus = (hitElement && hitElement !== "Physical") ? (stats.elementalAttDmgBonus ?? 0) : 0;

  return 1 + (baseDmgBonus + commonBonus + categoryBonus + elementBonus + eleAttBonus + extraPct - stats.dmgReduction) / 100;
}

// Enemy DEF multiplier. Per requirement, DEF debuffs are negative %DEF Bonuses
// and the total %DEF Bonus is floored at -90% (enemy DEF factor >= 0.10).
export function defMultiplier(stats: DamageStats, extraIgnorePct: number = 0): number {
  const defBonusPct = Math.max(-(stats.defReduction + stats.defIgnore + extraIgnorePct), -90);
  const k = 1 + defBonusPct / 100; // enemy DEF factor, >= 0.10
  const lc = stats.levelChar + 100;
  return lc / (lc + (stats.levelEnemy + 100) * k);
}

// Enemy RES multiplier from a single element RES%.
export function resMultiplier(enemyResPct: number): number {
  const r = enemyResPct / 100;
  if (r < 0) return 1 - r / 2;
  if (r < 0.75) return 1 - r;
  return 1 / (4 * r + 1);
}

/**
 * Resolves the specific enemy RES for a given element, falling back to the global enemyRes.
 */
export function getTargetResForElement(stats: DamageStats, element?: Element | "Physical"): number {
  if (!element) return stats.enemyRes;
  switch (element) {
    case "Pyro": return stats.enemyPyroRes ?? stats.enemyRes;
    case "Hydro": return stats.enemyHydroRes ?? stats.enemyRes;
    case "Dendro": return stats.enemyDendroRes ?? stats.enemyRes;
    case "Electro": return stats.enemyElectroRes ?? stats.enemyRes;
    case "Anemo": return stats.enemyAnemoRes ?? stats.enemyRes;
    case "Cryo": return stats.enemyCryoRes ?? stats.enemyRes;
    case "Geo": return stats.enemyGeoRes ?? stats.enemyRes;
    case "Physical": return stats.enemyPhysicalRes ?? stats.enemyRes;
  }
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

// Catalyze (additive) reactions keyed by trigger element. Aggravate = Electro, Spread = Dendro.
const CATALYZE_BASE: Record<Element, Partial<Record<ReactionType, number>>> = {
  Electro: { aggravate: 1.15 },
  Dendro: { spread: 1.25 },
  Pyro: {}, Hydro: {}, Cryo: {}, Anemo: {}, Geo: {},
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
  specificBonusPct: number = 0,
): number {
  if (reaction === "none") return 1;
  const base = AMP_BASE[element][reaction];
  if (!base) return 1; // not an amplifying reaction for this element
  const emBonus = (2.78 * em) / (em + 1400);
  return base * (1 + emBonus + (reactionBonusPct + specificBonusPct) / 100);
}

// Stellar/Lunar reaction EM bonus: 6·EM/(EM+2000) (as a fraction, not percent).
export function stellarEmBonus(em: number): number {
  return (6 * em) / (em + 2000);
}

/**
 * Stellar-Conduct Base Reaction Coefficient from Polestar recorded hits (0–12):
 * 0 hits => 1; n>=1 => 1.4 + 0.05·n (1.45 … 2.00).
 */
export function stellarBRC(hits: number): number {
  const n = clamp(Math.floor(hits), 0, 12);
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
  specificBonusPct: number = 0,
): number {
  const base = CATALYZE_BASE[element][reaction];
  if (!base) return 0;
  const emBonus = (5 * em) / (em + 1200);
  return base * levelMultiplier(levelChar) * (1 + emBonus + (reactionBonusPct + specificBonusPct) / 100);
}

export function computeHit(stats: DamageStats, hit: HitInput): HitResult {
  let nonCrit: number;
  const targetRes = getTargetResForElement(stats, hit.element);

  // Elemental CRIT bonuses
  let eleCritRate = 0;
  let eleCritDmg = 0;
  if (hit.element) {
    switch (hit.element) {
      case "Pyro":
        eleCritRate = stats.pyroCritRate ?? 0;
        eleCritDmg = stats.pyroCritDmg ?? 0;
        break;
      case "Hydro":
        eleCritRate = stats.hydroCritRate ?? 0;
        eleCritDmg = stats.hydroCritDmg ?? 0;
        break;
      case "Dendro":
        eleCritRate = stats.dendroCritRate ?? 0;
        eleCritDmg = stats.dendroCritDmg ?? 0;
        break;
      case "Electro":
        eleCritRate = stats.electroCritRate ?? 0;
        eleCritDmg = stats.electroCritDmg ?? 0;
        break;
      case "Anemo":
        eleCritRate = stats.anemoCritRate ?? 0;
        eleCritDmg = stats.anemoCritDmg ?? 0;
        break;
      case "Cryo":
        eleCritRate = stats.cryoCritRate ?? 0;
        eleCritDmg = stats.cryoCritDmg ?? 0;
        break;
      case "Geo":
        eleCritRate = stats.geoCritRate ?? 0;
        eleCritDmg = stats.geoCritDmg ?? 0;
        break;
      case "Physical":
        eleCritRate = stats.physicalCritRate ?? 0;
        eleCritDmg = stats.physicalCritDmg ?? 0;
        break;
    }
  }

  // Talent category CRIT bonuses
  let talentCritRate = 0;
  let talentCritDmg = 0;
  switch (hit.hitCategory) {
    case "normal":
      talentCritRate = stats.normalCritRate ?? 0;
      talentCritDmg = stats.normalCritDmg ?? 0;
      break;
    case "charged":
      talentCritRate = stats.chargedCritRate ?? 0;
      talentCritDmg = stats.chargedCritDmg ?? 0;
      break;
    case "plunge":
      talentCritRate = (stats.plungingCritRate ?? 0) + (stats.plungingImpactCritRate ?? 0);
      talentCritDmg = (stats.plungingCritDmg ?? 0) + (stats.plungingImpactCritDmg ?? 0);
      break;
    case "skill":
      talentCritRate = stats.skillCritRate ?? 0;
      talentCritDmg = stats.skillCritDmg ?? 0;
      break;
    case "burst":
      talentCritRate = stats.burstCritRate ?? 0;
      talentCritDmg = stats.burstCritDmg ?? 0;
      break;
  }
  if (hit.element !== "Physical") {
    talentCritRate += stats.elementalAttCritRate ?? 0;
    talentCritDmg += stats.elementalAttCritDmg ?? 0;
  }

  // Additive base flat increases
  let flatTalentIncrease = 0;
  switch (hit.hitCategory) {
    case "normal": flatTalentIncrease = stats.normalDmgIncrease ?? 0; break;
    case "charged": flatTalentIncrease = stats.chargedDmgIncrease ?? 0; break;
    case "plunge": flatTalentIncrease = (stats.plungingImpactDmgIncrease ?? 0) + (stats.plungingCollisionDmgIncrease ?? 0); break;
    case "skill": flatTalentIncrease = stats.skillDmgIncrease ?? 0; break;
    case "burst": flatTalentIncrease = stats.burstDmgIncrease ?? 0; break;
  }

  let flatElementIncrease = 0;
  switch (hit.element) {
    case "Pyro": flatElementIncrease = stats.pyroDmgIncrease ?? 0; break;
    case "Hydro": flatElementIncrease = stats.hydroDmgIncrease ?? 0; break;
    case "Dendro": flatElementIncrease = stats.dendroDmgIncrease ?? 0; break;
    case "Electro": flatElementIncrease = stats.electroDmgIncrease ?? 0; break;
    case "Anemo": flatElementIncrease = stats.anemoDmgIncrease ?? 0; break;
    case "Cryo": flatElementIncrease = stats.cryoDmgIncrease ?? 0; break;
    case "Geo": flatElementIncrease = stats.geoDmgIncrease ?? 0; break;
    case "Physical": flatElementIncrease = stats.physicalDmgIncrease ?? 0; break;
  }

  const commonFlat = stats.commonDmgIncrease ?? 0;

  if (hit.directReaction) {
    // Direct-reaction branch (wiki "Stellar-Conduct Damage" / "Direct Lunar Damage"):
    //   ((Coeff × Mult% × Stat × (1 + %EMBonus + %ReactionBonus) × (1 + %BaseDMGBonus) × BaseDMGMult) + Additive)
    //   × SpecialBonusFactor × RESMult × CRIT
    const s = hit.directReaction;
    let specificDmgBonus = 0;
    let specificElevation = 0;
    let specificFlatDmg = 0;
    let specificBaseMultiplier = 0;
    let rxCritRate = 0;
    let rxCritDmg = 0;

    if (s.lunarType === "lunar-charged") {
      specificDmgBonus = (stats.lunarChargedDmgBonus ?? 0) + (stats.lunarReactionDmgBonus ?? 0);
      specificElevation = (stats.lunarChargedElevation ?? 0) + (stats.lunarChargedSpecialDmgBonus ?? 0) + (stats.lunarReactionSpecialDmgBonus ?? 0);
      specificFlatDmg = (stats.lunarChargedFlatDmg ?? 0) + (stats.lunarChargedDirectDmgIncrease ?? 0) + (stats.lunarReactionDmgIncrease ?? 0);
      specificBaseMultiplier = (stats.lunarChargedBaseDmgMultiplier ?? 0) + (stats.lunarReactionBaseDmgMultiplier ?? 0);
      rxCritRate = (stats.lunarChargedCritRate ?? 0) + (stats.lunarReactionCritRate ?? 0);
      rxCritDmg = (stats.lunarChargedCritDmg ?? 0) + (stats.lunarReactionCritDmg ?? 0);
    } else if (s.lunarType === "lunar-bloom") {
      specificDmgBonus = (stats.lunarBloomDmgBonus ?? 0) + (stats.lunarReactionDmgBonus ?? 0);
      specificElevation = (stats.lunarBloomElevation ?? 0) + (stats.lunarBloomSpecialDmgBonus ?? 0) + (stats.lunarReactionSpecialDmgBonus ?? 0);
      specificFlatDmg = (stats.lunarBloomFlatDmg ?? 0) + (stats.lunarBloomDirectDmgIncrease ?? 0) + (stats.lunarBloomDmgIncrease ?? 0) + (stats.lunarReactionDmgIncrease ?? 0);
      specificBaseMultiplier = (stats.lunarBloomBaseDmgMultiplier ?? 0) + (stats.lunarReactionBaseDmgMultiplier ?? 0);
      rxCritRate = (stats.lunarBloomCritRate ?? 0) + (stats.lunarReactionCritRate ?? 0);
      rxCritDmg = (stats.lunarBloomCritDmg ?? 0) + (stats.lunarReactionCritDmg ?? 0);
    } else if (s.lunarType === "lunar-crystallize") {
      specificDmgBonus = (stats.lunarCrystallizeDmgBonus ?? 0) + (stats.lunarReactionDmgBonus ?? 0);
      specificElevation = (stats.lunarCrystallizeElevation ?? 0) + (stats.lunarCrystallizeSpecialDmgBonus ?? 0) + (stats.lunarReactionSpecialDmgBonus ?? 0);
      specificFlatDmg = (stats.lunarCrystallizeFlatDmg ?? 0) + (stats.lunarCrystallizeDirectDmgIncrease ?? 0) + (stats.lunarCrystallizeDmgIncrease ?? 0) + (stats.lunarReactionDmgIncrease ?? 0);
      specificBaseMultiplier = (stats.lunarCrystallizeBaseDmgMultiplier ?? 0) + (stats.lunarReactionBaseDmgMultiplier ?? 0);
      rxCritRate = (stats.lunarCrystallizeCritRate ?? 0) + (stats.lunarReactionCritRate ?? 0);
      rxCritDmg = (stats.lunarCrystallizeCritDmg ?? 0) + (stats.lunarReactionCritDmg ?? 0);
    } else if (s.stellarType === "stellar-conduct" || (s.stellarType === undefined && !s.lunarType)) {
      specificDmgBonus = (stats.stellarConductDmgBonus ?? 0) + (stats.stellarGlimmerDmgBonus ?? 0) + (stats.stellarReactionDmgBonus ?? 0);
      specificElevation = (stats.stellarConductSpecialDmgBonus ?? 0) + (stats.stellarReactionSpecialDmgBonus ?? 0);
      specificFlatDmg = (stats.stellarConductDirectDmgIncrease ?? 0) + (stats.stellarConductDmgIncrease ?? 0) + (stats.stellarReactionDmgIncrease ?? 0);
      specificBaseMultiplier = (stats.stellarConductBaseDmgMultiplier ?? 0) + (stats.stellarReactionBaseDmgMultiplier ?? 0);
      rxCritRate = (stats.stellarConductCritRate ?? 0) + (stats.stellarReactionCritRate ?? 0);
      rxCritDmg = (stats.stellarConductCritDmg ?? 0) + (stats.stellarReactionCritDmg ?? 0);
    } else if (s.stellarType === "stellar-swirl") {
      specificDmgBonus = (stats.stellarSwirlDmgBonus ?? 0) + (stats.stellarGlimmerDmgBonus ?? 0) + (stats.stellarReactionDmgBonus ?? 0);
      specificElevation = (stats.stellarSwirlSpecialDmgBonus ?? 0) + (stats.stellarReactionSpecialDmgBonus ?? 0);
      specificFlatDmg = (stats.stellarSwirlDirectDmgIncrease ?? 0) + (stats.stellarSwirlDmgIncrease ?? 0) + (stats.stellarReactionDmgIncrease ?? 0);
      specificBaseMultiplier = (stats.stellarSwirlBaseDmgMultiplier ?? 0) + (stats.stellarReactionBaseDmgMultiplier ?? 0);
      rxCritRate = (stats.stellarSwirlCritRate ?? 0) + (stats.stellarReactionCritRate ?? 0);
      rxCritDmg = (stats.stellarSwirlCritDmg ?? 0) + (stats.stellarReactionCritDmg ?? 0);
    }

    const emBonusFrac = stellarEmBonus(stats.em);
    const emRxBonusFactor = 1 + emBonusFrac + (s.reactionBonusPct + specificDmgBonus) / 100;
    const baseDmgBonusFactor = 1 + (s.baseDmgBonusPct + specificBaseMultiplier) / 100;
    const baseMultFactor = hit.baseDmgMultiplier ?? 1;

    const coeff = s.coefficient;
    const abilityBase = coeff * (hit.multiplier / 100) * scalingTotal(stats, hit.scaling);
    const scaledBase = abilityBase * emRxBonusFactor * baseDmgBonusFactor * baseMultFactor;
    const totalBase =
      scaledBase +
      (hit.flatDmgBonus ?? 0) +
      (stats.flatDmgBonus ?? 0) +
      specificFlatDmg +
      flatTalentIncrease +
      flatElementIncrease +
      commonFlat;
    const specialBonusFactor = 1 + (specificElevation + (s.elevationBonusPct ?? 0)) / 100;

    nonCrit = totalBase * specialBonusFactor * resMultiplier(targetRes);

    // Apply reaction CRIT stats alongside elemental/talent CRIT
    eleCritRate += rxCritRate;
    eleCritDmg += rxCritDmg;
  } else {
    let specificCatalyzeBonus = 0;
    if (hit.reaction === "aggravate") specificCatalyzeBonus = stats.aggravateDmgBonus ?? 0;
    else if (hit.reaction === "spread") specificCatalyzeBonus = stats.spreadDmgBonus ?? 0;

    let specificAmpBonus = 0;
    if (hit.reaction === "vaporize") specificAmpBonus = stats.vaporizeDmgBonus ?? 0;
    else if (hit.reaction === "melt") specificAmpBonus = stats.meltDmgBonus ?? 0;

    const additive =
      (hit.flatDmgBonus ?? 0) +
      (stats.flatDmgBonus ?? 0) +
      flatTalentIncrease +
      flatElementIncrease +
      commonFlat +
      (hit.element === "Physical" ? 0 : catalyzeAdditive(hit.element, hit.reaction, stats.levelChar, stats.em, hit.reactionBonusPct, specificCatalyzeBonus));
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
      resMultiplier(targetRes) *
      (hit.element === "Physical" ? 1 : amplifyingMultiplier(hit.element, hit.reaction, stats.em, hit.reactionBonusPct, specificAmpBonus));
  }

  const cr = clamp(stats.critRate + (hit.critRateBonusPct ?? 0) + eleCritRate + talentCritRate, 0, 100) / 100;
  const cd = (stats.critDmg + (hit.critDmgBonusPct ?? 0) + eleCritDmg + talentCritDmg) / 100;
  return {
    nonCrit,
    crit: nonCrit * (1 + cd),
    avg: nonCrit * (1 + cr * cd),
    element: hit.element,
    reaction: hit.reaction,
  };
}
