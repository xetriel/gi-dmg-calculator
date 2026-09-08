import type { CharacterConfig, ReactionType, Constellation } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { DamageStats } from "./damage";

export interface RawInputs {
  stats: Record<string, string>; // keys: "atk.base", "atk.flat", "critRate", "levelChar", ...
  hits: Record<string, string>;  // key: hitId(groupIndex, hitIndex) -> multiplier %
  reaction: ReactionType;
  reactionBonus: string;
  mechanicInputs?: Record<string, string>; // MechanicDef.id -> raw value (percent controls validated)
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>; // keyed by stat input id, hitId, "reactionBonus", or "mech.<id>"
  general: string[];
}

export const hitId = (groupIndex: number, hitIndex: number) => `${groupIndex}:${hitIndex}`;

// Parse a raw string to a finite number, or null if empty/invalid.
export function toNum(s: string | number | undefined): number | null {
  if (s == null) return null;
  if (typeof s === "number") return Number.isFinite(s) ? s : null;
  const t = String(s).trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

// All stat input ids for a character (HP/ATK/DEF expand to .base + .flat).
export function statInputIds(config: CharacterConfig): string[] {
  const ids: string[] = [];
  for (const f of config.stats) {
    if (f.hasBaseAndFlat) ids.push(`${f.key}.base`, `${f.key}.flat`, `${f.key}.percent`);
    else ids.push(f.key);
  }
  return ids;
}

const LEVEL_FIELDS = ["levelChar", "levelEnemy"];

/**
 * Detects the required constellation level for a mechanic definition.
 * Evaluates explicit minConstellation, ID pattern (e.g. c1-, c2-, c4-, c6-),
 * or label pattern (e.g. (C1), (C2), C1:, etc.).
 * Returns 1..6, or 0 if not gated by a constellation.
 */
export function getRequiredConstellation(m: { id: string; label?: string; minConstellation?: number }): number {
  if (m.minConstellation != null && m.minConstellation > 0) {
    return m.minConstellation;
  }
  const idMatch = m.id.match(/^c([1-6])[-_]|[-_]c([1-6])[-_]|[-_]c([1-6])$|\bc([1-6])\b/i);
  if (idMatch) {
    const n = Number(idMatch[1] || idMatch[2] || idMatch[3] || idMatch[4]);
    if (n >= 1 && n <= 6) return n;
  }
  if (m.label) {
    const labelMatch = m.label.match(/\bC([1-6])\b/);
    if (labelMatch) {
      const n = Number(labelMatch[1]);
      if (n >= 1 && n <= 6) return n;
    }
  }
  return 0;
}

// Compute the talent level bonus from active constellations.
// Returns a map of TalentType -> bonus (e.g. { skill: 3, burst: 3 }).
function talentLevelBonuses(
  constellations: Constellation[] | undefined,
  constellationLevel: number,
): Record<string, number> {
  const bonuses: Record<string, number> = {};
  if (!constellations) return bonuses;
  for (const c of constellations) {
    if (c.level > constellationLevel) continue;
    for (const e of c.effects) {
      if (e.type === "talent_level_bonus" && e.talentType) {
        bonuses[e.talentType] = (bonuses[e.talentType] ?? 0) + 3;
      }
    }
  }
  return bonuses;
}

// Effective talent level per talent type: the selected level plus any C3/C5 +3
// bonus, capped at the max level available in the scaling data. NaN when the
// talent has no scaling data / no selected level.
export function effectiveTalentLevels(
  config: CharacterConfig,
  scaling: TalentScalingData,
  levels: Record<string, string>,
  constellationLevel: number = 0,
  mechanicInputs?: Record<string, string>,
  talentBoosts?: { normal?: number; skill?: number; burst?: number },
): Record<string, number> {
  const lvlBonuses = talentLevelBonuses(config.constellations, constellationLevel);
  if (config.id === "skirk" && mechanicInputs && (mechanicInputs["mutual-weapons-mentorship"] ?? "1") === "1") {
    lvlBonuses.skill = (lvlBonuses.skill ?? 0) + 1;
  }
  if (talentBoosts) {
    if (talentBoosts.normal) lvlBonuses.normal = (lvlBonuses.normal ?? 0) + talentBoosts.normal;
    if (talentBoosts.skill) lvlBonuses.skill = (lvlBonuses.skill ?? 0) + talentBoosts.skill;
    if (talentBoosts.burst) lvlBonuses.burst = (lvlBonuses.burst ?? 0) + talentBoosts.burst;
  }
  const out: Record<string, number> = {};
  for (const g of config.talents) {
    const s = scaling[g.type];
    const rawLvlStr = levels[g.type] ?? (g.type === "special" ? "1" : "");
    const baseLvl = s ? Number(rawLvlStr) : NaN;
    const effectiveLvl = baseLvl ? baseLvl + (lvlBonuses[g.type] ?? 0) : NaN;
    const maxLvl = s ? Math.max(...s.levels) : 0;
    out[g.type] = effectiveLvl > maxLvl ? maxLvl : effectiveLvl;
  }
  return out;
}

// Resolve each hit's effective multiplier: the level-backed value if a talent level
// is selected and the scaling table has a value for that hit, otherwise the manual input.
// Returns null when neither is available (i.e. the hit is not yet filled).
export function resolveHitMultipliers(
  config: CharacterConfig,
  scaling: TalentScalingData,
  levels: Record<string, string>,
  manualHits: Record<string, string>,
  constellationLevel: number = 0,
  mechanicInputs?: Record<string, string>,
  talentBoosts?: { normal?: number; skill?: number; burst?: number },
): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  const effLevels = effectiveTalentLevels(config, scaling, levels, constellationLevel, mechanicInputs, talentBoosts);
  config.talents.forEach((g, gi) => {
    const s = scaling[g.type];
    const cappedLvl = effLevels[g.type];
    g.hits.forEach((h, hi) => {
      const id = hitId(gi, hi);
      const levelVal = s && cappedLvl ? s.byLevel[cappedLvl]?.[h.key] : undefined;
      out[id] = levelVal != null ? levelVal : toNum(manualHits[id] ?? "");
    });
  });
  return out;
}

export function validate(
  config: CharacterConfig,
  raw: RawInputs,
  resolvedHits: Record<string, number | null> = {},
): ValidationResult {
  const errors: Record<string, string> = {};
  const general: string[] = [];

  // Essential base stats that must be defined if the stat input map is provided
  const ESSENTIAL_STATS = new Set(["hp.base", "atk.base", "def.base", "levelChar", "levelEnemy"]);

  // Every essential stat field must be filled with a finite number.
  // Non-essential stat fields only fail validation if explicitly typed as invalid (e.g., empty string or non-numeric).
  for (const id of statInputIds(config)) {
    const val = raw.stats[id];
    if (val !== undefined && toNum(val) === null) {
      errors[id] = "Required";
    } else if (val === undefined && ESSENTIAL_STATS.has(id)) {
      errors[id] = "Required";
    }
  }

  // Character Level range: 0 < level <= 100 (only when the field parses).
  const charLvl = toNum(raw.stats["levelChar"]);
  if (charLvl !== null && !(charLvl > 0 && charLvl <= 100)) {
    errors["levelChar"] = "Must be 0 < level ≤ 100";
  }

  // Enemy Level range: 0 < level <= 200 (only when the field parses).
  const enemyLvl = toNum(raw.stats["levelEnemy"]);
  if (enemyLvl !== null && !(enemyLvl > 0 && enemyLvl <= 200)) {
    errors["levelEnemy"] = "Must be 0 < level ≤ 200";
  }

  // Every talent hit must resolve to a multiplier (from its talent level or manual input).
  const consLevel = toNum(raw.stats["constellationLevel"]) ?? 0;
  config.talents.forEach((g, gi) =>
    g.hits.forEach((h, hi) => {
      const id = hitId(gi, hi);
      const m = resolvedHits[id];
      const isInactive = h.minConstellation != null && consLevel < h.minConstellation;
      if ((m == null || !Number.isFinite(m)) && !isInactive) errors[id] = "Required";
    }),
  );

  // Reaction bonus validation: if typed, must be a valid number. Empty string defaults to 0.
  if (raw.reaction !== "none" && raw.reactionBonus && raw.reactionBonus.trim() !== "" && toNum(raw.reactionBonus) === null) {
    errors["reactionBonus"] = "Invalid number";
  }

  // Mechanic percent inputs (e.g. Bond of Life) must be a number within 0..max
  // (Bond of Life: 0 ≤ BoL ≤ 200% of Max HP). Toggle/stacks controls are
  // constrained by their UI and skipped here.
  for (const m of config.mechanicDefs ?? []) {
    if (m.control !== "percent") continue;
    const v = toNum(raw.mechanicInputs?.[m.id]);
    if (v === null) {
      errors[`mech.${m.id}`] = "Required";
    } else if (v < 0 || (m.max != null && v > m.max)) {
      errors[`mech.${m.id}`] = `Must be 0 ≤ value ≤ ${m.max ?? "∞"}`;
    }
  }

  // DEF floor is applied (not blocked) — surface a hint when it kicks in.
  const dr = toNum(raw.stats["defReduction"]) ?? 0;
  const di = toNum(raw.stats["defIgnore"]) ?? 0;
  if (dr + di > 90) {
    general.push("Total DEF reduction exceeds 90% — clamped to a -90% %DEF Bonus.");
  }

  return { ok: Object.keys(errors).length === 0, errors, general };
}

// Resolve validated raw inputs into engine-ready numeric stats.
export function resolveStats(raw: RawInputs): DamageStats {
  const g = (id: string) => toNum(raw.stats[id]) ?? 0;
  const opt = (id: string) => {
    const v = toNum(raw.stats[id]);
    return v !== null ? v : undefined;
  };
  const total = (key: string) => g(`${key}.base`) + (g(`${key}.base`) * g(`${key}.percent`) / 100) + g(`${key}.flat`);

  return {
    // 1. Basic Stats
    atk: total("atk"),
    hp: total("hp"),
    def: total("def"),
    em: g("em"),
    critRate: g("critRate"),
    critDmg: g("critDmg"),
    energyRecharge: g("energyRecharge"),
    healingBonus: g("healingBonus"),
    hpPercent: opt("hp.percent"),
    atkPercent: opt("atk.percent"),
    defPercent: opt("def.percent"),

    // 2. Elemental DMG Bonuses
    dmgBonus: g("dmgBonus"),
    commonDmgBonus: opt("commonDmgBonus"),
    pyroDmgBonus: g("pyroDmgBonus"),
    hydroDmgBonus: g("hydroDmgBonus"),
    dendroDmgBonus: g("dendroDmgBonus"),
    electroDmgBonus: g("electroDmgBonus"),
    anemoDmgBonus: g("anemoDmgBonus"),
    cryoDmgBonus: g("cryoDmgBonus"),
    geoDmgBonus: g("geoDmgBonus"),
    physicalDmgBonus: g("physicalDmgBonus"),

    // 3. Enemy Debuffs
    enemyRes: g("enemyRes"),
    enemyPhysicalRes: opt("enemyPhysicalRes"),
    enemyAnemoRes: opt("enemyAnemoRes"),
    enemyGeoRes: opt("enemyGeoRes"),
    enemyElectroRes: opt("enemyElectroRes"),
    enemyHydroRes: opt("enemyHydroRes"),
    enemyPyroRes: opt("enemyPyroRes"),
    enemyCryoRes: opt("enemyCryoRes"),
    enemyDendroRes: opt("enemyDendroRes"),
    defReduction: g("defReduction"),
    defIgnore: g("defIgnore"),

    // 4. Self Resistances
    selfPhysicalRes: opt("selfPhysicalRes"),
    selfAnemoRes: opt("selfAnemoRes"),
    selfGeoRes: opt("selfGeoRes"),
    selfElectroRes: opt("selfElectroRes"),
    selfHydroRes: opt("selfHydroRes"),
    selfPyroRes: opt("selfPyroRes"),
    selfCryoRes: opt("selfCryoRes"),
    selfDendroRes: opt("selfDendroRes"),

    // 5. Reaction DMG Bonuses & Multipliers
    overloadedDmgBonus: opt("overloadedDmgBonus"),
    shatteredDmgBonus: opt("shatteredDmgBonus"),
    electroChargedDmgBonus: opt("electroChargedDmgBonus"),
    superconductDmgBonus: opt("superconductDmgBonus"),
    swirlDmgBonus: opt("swirlDmgBonus"),
    burningDmgBonus: opt("burningDmgBonus"),
    bloomDmgBonus: opt("bloomDmgBonus"),
    burgeonDmgBonus: opt("burgeonDmgBonus"),
    hyperbloomDmgBonus: opt("hyperbloomDmgBonus"),
    vaporizeDmgBonus: opt("vaporizeDmgBonus"),
    meltDmgBonus: opt("meltDmgBonus"),
    spreadDmgBonus: opt("spreadDmgBonus"),
    aggravateDmgBonus: opt("aggravateDmgBonus"),

    lunarChargedDmgBonus: opt("lunarChargedDmgBonus"),
    lunarBloomDmgBonus: opt("lunarBloomDmgBonus"),
    lunarCrystallizeDmgBonus: opt("lunarCrystallizeDmgBonus"),
    stellarConductDmgBonus: opt("stellarConductDmgBonus"),
    stellarSwirlDmgBonus: opt("stellarSwirlDmgBonus"),
    stellarGlimmerDmgBonus: opt("stellarGlimmerDmgBonus"),
    lunarReactionDmgBonus: opt("lunarReactionDmgBonus"),
    stellarReactionDmgBonus: opt("stellarReactionDmgBonus"),

    lunarChargedBaseDmgMultiplier: opt("lunarChargedBaseDmgMultiplier"),
    lunarBloomBaseDmgMultiplier: opt("lunarBloomBaseDmgMultiplier"),
    lunarCrystallizeBaseDmgMultiplier: opt("lunarCrystallizeBaseDmgMultiplier"),
    stellarConductBaseDmgMultiplier: opt("stellarConductBaseDmgMultiplier"),
    stellarSwirlBaseDmgMultiplier: opt("stellarSwirlBaseDmgMultiplier"),
    lunarReactionBaseDmgMultiplier: opt("lunarReactionBaseDmgMultiplier"),
    stellarReactionBaseDmgMultiplier: opt("stellarReactionBaseDmgMultiplier"),

    lunarChargedSpecialDmgBonus: opt("lunarChargedSpecialDmgBonus"),
    lunarBloomSpecialDmgBonus: opt("lunarBloomSpecialDmgBonus"),
    lunarCrystallizeSpecialDmgBonus: opt("lunarCrystallizeSpecialDmgBonus"),
    stellarConductSpecialDmgBonus: opt("stellarConductSpecialDmgBonus"),
    stellarSwirlSpecialDmgBonus: opt("stellarSwirlSpecialDmgBonus"),
    lunarReactionSpecialDmgBonus: opt("lunarReactionSpecialDmgBonus"),
    stellarReactionSpecialDmgBonus: opt("stellarReactionSpecialDmgBonus"),

    stellarConductMultiplier: opt("stellarConductMultiplier"),
    stellarSwirlMultiplier: opt("stellarSwirlMultiplier"),
    stellarReactionMultiplier: opt("stellarReactionMultiplier"),

    lunarChargedElevation: opt("lunarChargedElevation"),
    lunarBloomElevation: opt("lunarBloomElevation"),
    lunarCrystallizeElevation: opt("lunarCrystallizeElevation"),

    // 6. Reaction CRIT Bonuses
    lunarChargedCritRate: opt("lunarChargedCritRate"),
    lunarChargedCritDmg: opt("lunarChargedCritDmg"),
    burningCritRate: opt("burningCritRate"),
    burningCritDmg: opt("burningCritDmg"),
    superconductCritRate: opt("superconductCritRate"),
    superconductCritDmg: opt("superconductCritDmg"),
    bloomCritRate: opt("bloomCritRate"),
    bloomCritDmg: opt("bloomCritDmg"),
    burgeonCritRate: opt("burgeonCritRate"),
    burgeonCritDmg: opt("burgeonCritDmg"),
    hyperbloomCritRate: opt("hyperbloomCritRate"),
    hyperbloomCritDmg: opt("hyperbloomCritDmg"),
    lunarBloomCritRate: opt("lunarBloomCritRate"),
    lunarBloomCritDmg: opt("lunarBloomCritDmg"),
    swirlCritRate: opt("swirlCritRate"),
    swirlCritDmg: opt("swirlCritDmg"),
    lunarCrystallizeCritRate: opt("lunarCrystallizeCritRate"),
    lunarCrystallizeCritDmg: opt("lunarCrystallizeCritDmg"),
    stellarConductCritRate: opt("stellarConductCritRate"),
    stellarConductCritDmg: opt("stellarConductCritDmg"),
    stellarSwirlCritRate: opt("stellarSwirlCritRate"),
    stellarSwirlCritDmg: opt("stellarSwirlCritDmg"),
    lunarReactionCritRate: opt("lunarReactionCritRate"),
    lunarReactionCritDmg: opt("lunarReactionCritDmg"),
    stellarReactionCritRate: opt("stellarReactionCritRate"),
    stellarReactionCritDmg: opt("stellarReactionCritDmg"),

    // 7. Elemental Damage Increases
    physicalDmgIncrease: opt("physicalDmgIncrease"),
    anemoDmgIncrease: opt("anemoDmgIncrease"),
    geoDmgIncrease: opt("geoDmgIncrease"),
    electroDmgIncrease: opt("electroDmgIncrease"),
    hydroDmgIncrease: opt("hydroDmgIncrease"),
    pyroDmgIncrease: opt("pyroDmgIncrease"),
    cryoDmgIncrease: opt("cryoDmgIncrease"),
    dendroDmgIncrease: opt("dendroDmgIncrease"),
    commonDmgIncrease: opt("commonDmgIncrease"),

    lunarBloomDmgIncrease: opt("lunarBloomDmgIncrease"),
    lunarCrystallizeDmgIncrease: opt("lunarCrystallizeDmgIncrease"),
    stellarConductDmgIncrease: opt("stellarConductDmgIncrease"),
    stellarSwirlDmgIncrease: opt("stellarSwirlDmgIncrease"),

    lunarChargedReactionDmgIncrease: opt("lunarChargedReactionDmgIncrease"),
    lunarChargedDirectDmgIncrease: opt("lunarChargedDirectDmgIncrease"),
    lunarBloomReactionDmgIncrease: opt("lunarBloomReactionDmgIncrease"),
    lunarBloomDirectDmgIncrease: opt("lunarBloomDirectDmgIncrease"),
    lunarCrystallizeReactionDmgIncrease: opt("lunarCrystallizeReactionDmgIncrease"),
    lunarCrystallizeDirectDmgIncrease: opt("lunarCrystallizeDirectDmgIncrease"),
    stellarConductReactionDmgIncrease: opt("stellarConductReactionDmgIncrease"),
    stellarConductDirectDmgIncrease: opt("stellarConductDirectDmgIncrease"),
    stellarSwirlReactionDmgIncrease: opt("stellarSwirlReactionDmgIncrease"),
    stellarSwirlDirectDmgIncrease: opt("stellarSwirlDirectDmgIncrease"),
    lunarReactionDmgIncrease: opt("lunarReactionDmgIncrease"),
    stellarReactionDmgIncrease: opt("stellarReactionDmgIncrease"),

    lunarChargedFlatDmg: opt("lunarChargedFlatDmg"),
    lunarBloomFlatDmg: opt("lunarBloomFlatDmg"),
    lunarCrystallizeFlatDmg: opt("lunarCrystallizeFlatDmg"),
    flatDmgBonus: opt("flatDmgBonus"),

    // 8. Talent Damage Increases
    normalDmgIncrease: opt("normalDmgIncrease"),
    chargedDmgIncrease: opt("chargedDmgIncrease"),
    plungingCollisionDmgIncrease: opt("plungingCollisionDmgIncrease"),
    plungingImpactDmgIncrease: opt("plungingImpactDmgIncrease"),
    skillDmgIncrease: opt("skillDmgIncrease"),
    burstDmgIncrease: opt("burstDmgIncrease"),

    // 9. Elemental CRIT Bonuses
    physicalCritRate: opt("physicalCritRate"),
    physicalCritDmg: opt("physicalCritDmg"),
    anemoCritRate: opt("anemoCritRate"),
    anemoCritDmg: opt("anemoCritDmg"),
    geoCritRate: opt("geoCritRate"),
    geoCritDmg: opt("geoCritDmg"),
    electroCritRate: opt("electroCritRate"),
    electroCritDmg: opt("electroCritDmg"),
    hydroCritRate: opt("hydroCritRate"),
    hydroCritDmg: opt("hydroCritDmg"),
    pyroCritRate: opt("pyroCritRate"),
    pyroCritDmg: opt("pyroCritDmg"),
    cryoCritRate: opt("cryoCritRate"),
    cryoCritDmg: opt("cryoCritDmg"),
    dendroCritRate: opt("dendroCritRate"),
    dendroCritDmg: opt("dendroCritDmg"),

    // 10. Talent DMG Bonuses
    normalDmgBonus: g("normalDmgBonus"),
    chargedDmgBonus: g("chargedDmgBonus"),
    plungeDmgBonus: g("plungeDmgBonus"),
    skillDmgBonus: g("skillDmgBonus"),
    burstDmgBonus: g("burstDmgBonus"),
    plungingCollisionDmgBonus: opt("plungingCollisionDmgBonus"),
    plungingImpactDmgBonus: opt("plungingImpactDmgBonus"),
    plungingDmgBonus: opt("plungingDmgBonus"),
    elementalAttDmgBonus: opt("elementalAttDmgBonus"),
    normalAttEleDmgBonus: opt("normalAttEleDmgBonus"),

    // 11. Talent CRIT Bonuses
    normalCritRate: opt("normalCritRate"),
    normalCritDmg: opt("normalCritDmg"),
    chargedCritRate: opt("chargedCritRate"),
    chargedCritDmg: opt("chargedCritDmg"),
    plungingCollisionCritRate: opt("plungingCollisionCritRate"),
    plungingCollisionCritDmg: opt("plungingCollisionCritDmg"),
    plungingImpactCritRate: opt("plungingImpactCritRate"),
    plungingImpactCritDmg: opt("plungingImpactCritDmg"),
    plungingCritRate: opt("plungingCritRate"),
    plungingCritDmg: opt("plungingCritDmg"),
    skillCritRate: opt("skillCritRate"),
    skillCritDmg: opt("skillCritDmg"),
    burstCritRate: opt("burstCritRate"),
    burstCritDmg: opt("burstCritDmg"),
    elementalAttCritRate: opt("elementalAttCritRate"),
    elementalAttCritDmg: opt("elementalAttCritDmg"),

    // 12. Talent Level Boosts
    normalLevelBoost: opt("normalLevelBoost"),
    skillLevelBoost: opt("skillLevelBoost"),
    burstLevelBoost: opt("burstLevelBoost"),

    // 13. Base Stat Modifications
    baseAtk: opt("baseAtk"),
    baseHp: opt("baseHp"),
    baseDef: opt("baseDef"),

    // 14. Stamina Buffs
    stamina: opt("stamina"),
    staminaDec: opt("staminaDec"),
    sprintingStaminaDec: opt("sprintingStaminaDec"),
    glidingStaminaDec: opt("glidingStaminaDec"),
    chargedAttackStaminaDec: opt("chargedAttackStaminaDec"),

    // 15. Target & Misc Stats
    levelChar: g("levelChar") || 90,
    levelEnemy: g("levelEnemy") || 100,
    dmgReduction: g("dmgReduction"),
    incomingHealingBonus: opt("incomingHealingBonus"),
    shieldStrength: opt("shieldStrength"),
    cdReduction: opt("cdReduction"),
    movementSpd: opt("movementSpd"),
    atkSpd: opt("atkSpd"),
    weakspotDmg: opt("weakspotDmg"),
    healIncrease: opt("healIncrease"),
    allRes: opt("allRes"),
  };
}
