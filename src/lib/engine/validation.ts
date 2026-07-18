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
export function toNum(s: string | undefined): number | null {
  if (s == null) return null;
  const t = s.trim();
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
): Record<string, number> {
  const lvlBonuses = talentLevelBonuses(config.constellations, constellationLevel);
  if (config.id === "skirk" && mechanicInputs && (mechanicInputs["mutual-weapons-mentorship"] ?? "1") === "1") {
    lvlBonuses.skill = (lvlBonuses.skill ?? 0) + 1;
  }
  const out: Record<string, number> = {};
  for (const g of config.talents) {
    const s = scaling[g.type];
    const baseLvl = s ? Number(levels[g.type]) : NaN;
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
): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  const effLevels = effectiveTalentLevels(config, scaling, levels, constellationLevel, mechanicInputs);
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
  resolvedHits: Record<string, number | null>,
): ValidationResult {
  const errors: Record<string, string> = {};
  const general: string[] = [];

  // Every stat field must be filled with a finite number.
  for (const id of statInputIds(config)) {
    if (toNum(raw.stats[id]) === null) errors[id] = "Required";
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
  config.talents.forEach((g, gi) =>
    g.hits.forEach((_h, hi) => {
      const id = hitId(gi, hi);
      const m = resolvedHits[id];
      if (m == null || !Number.isFinite(m)) errors[id] = "Required";
    }),
  );

  // Reaction bonus required only when a reaction is selected.
  if (raw.reaction !== "none" && toNum(raw.reactionBonus) === null) {
    errors["reactionBonus"] = "Required";
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
  const total = (key: string) => g(`${key}.base`) + (g(`${key}.base`) * g(`${key}.percent`) / 100) + g(`${key}.flat`);
  return {
    atk: total("atk"),
    hp: total("hp"),
    def: total("def"),
    em: g("em"),
    critRate: g("critRate"),
    critDmg: g("critDmg"),
    dmgBonus: g("dmgBonus"),
    normalDmgBonus: g("normalDmgBonus"),
    chargedDmgBonus: g("chargedDmgBonus"),
    plungeDmgBonus: g("plungeDmgBonus"),
    skillDmgBonus: g("skillDmgBonus"),
    burstDmgBonus: g("burstDmgBonus"),
    pyroDmgBonus: g("pyroDmgBonus"),
    hydroDmgBonus: g("hydroDmgBonus"),
    dendroDmgBonus: g("dendroDmgBonus"),
    electroDmgBonus: g("electroDmgBonus"),
    anemoDmgBonus: g("anemoDmgBonus"),
    cryoDmgBonus: g("cryoDmgBonus"),
    geoDmgBonus: g("geoDmgBonus"),
    physicalDmgBonus: g("physicalDmgBonus"),
    dmgReduction: g("dmgReduction"),
    enemyRes: g("enemyRes"),
    levelChar: g("levelChar"),
    levelEnemy: g("levelEnemy"),
    defReduction: g("defReduction"),
    defIgnore: g("defIgnore"),
    energyRecharge: g("energyRecharge"),
    healingBonus: g("healingBonus"),
  };
}
