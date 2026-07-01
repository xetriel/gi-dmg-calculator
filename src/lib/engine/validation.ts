// Input processing + validation for the calculator UI.
// Works on raw string inputs so we can distinguish "empty" from "0".
import type { CharacterConfig, ReactionType } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { DamageStats } from "./damage";

export interface RawInputs {
  stats: Record<string, string>; // keys: "atk.base", "atk.flat", "critRate", "levelChar", ...
  hits: Record<string, string>;  // key: hitId(groupIndex, hitIndex) -> multiplier %
  reaction: ReactionType;
  reactionBonus: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>; // keyed by stat input id, hitId, or "reactionBonus"
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
    if (f.hasBaseAndFlat) ids.push(`${f.key}.base`, `${f.key}.flat`);
    else ids.push(f.key);
  }
  return ids;
}

const LEVEL_FIELDS = ["levelChar", "levelEnemy"];

// Resolve each hit's effective multiplier: the level-backed value if a talent level
// is selected and the scaling table has a value for that hit, otherwise the manual input.
// Returns null when neither is available (i.e. the hit is not yet filled).
export function resolveHitMultipliers(
  config: CharacterConfig,
  scaling: TalentScalingData,
  levels: Record<string, string>,
  manualHits: Record<string, string>,
): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  config.talents.forEach((g, gi) => {
    const s = scaling[g.type];
    const lvl = s ? Number(levels[g.type]) : NaN;
    g.hits.forEach((h, hi) => {
      const id = hitId(gi, hi);
      const levelVal = s && lvl ? s.byLevel[lvl]?.[h.key] : undefined;
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

  // Level range: 0 < level <= 100 (only when the field parses).
  for (const lvl of LEVEL_FIELDS) {
    const v = toNum(raw.stats[lvl]);
    if (v !== null && !(v > 0 && v <= 100)) errors[lvl] = "Must be 0 < level ≤ 100";
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
  const total = (key: string) => g(`${key}.base`) + g(`${key}.flat`);
  return {
    atk: total("atk"),
    hp: total("hp"),
    def: total("def"),
    em: g("em"),
    critRate: g("critRate"),
    critDmg: g("critDmg"),
    dmgBonus: g("dmgBonus"),
    dmgReduction: g("dmgReduction"),
    enemyRes: g("enemyRes"),
    levelChar: g("levelChar"),
    levelEnemy: g("levelEnemy"),
    defReduction: g("defReduction"),
    defIgnore: g("defIgnore"),
  };
}
