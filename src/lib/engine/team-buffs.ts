import type { DamageStats } from "./damage";
import { supportById, type SupportCtx } from "../../data/registry/characters";

// A support character instance as stored in CalcInstance.teamSupports
export interface SupportInstance {
  supportId: string;                    // e.g., "ineffa-support"
  stats: Record<string, string>;       // stat inputs (full or limited)
  mechanicInputs: Record<string, string>;
  constellationLevel: number;
  enabled: boolean;                    // per-support toggle
  selectedSetupId?: string;            // e.g., "1" — references a CalcInstance.id from the support character's working draft
  selectedSetupName?: string;          // e.g., "Setup 1"
  sourceBuildId?: string | null;       // DB build ID if loaded from a saved build
  sourceBuildName?: string | null;     // Build name if loaded from a saved build
  talentLevels?: Record<string, string>; // e.g. { normal: "10", skill: "10", burst: "13" }
}

// Attribution for a single buff from a support
export interface TeamBuffSource {
  supportName: string;       // "Ineffa"
  stat: string;              // "em", "lunarChargedDmgBonus", etc.
  label: string;             // "EM (Ineffa A4)"
  value: number;             // 148.44
}

// Aggregated result from all active supports
export interface TeamBuffResult {
  statDeltas: Partial<DamageStats>;       // additive stat bonuses to DPS
  lunarBaseBonusPct: number;               // aggregated Lunar Base DMG Bonus
  sources: TeamBuffSource[];               // per-buff attribution
  teamCrit: { critRate: number; critDmg: number };  // team CRIT for Lunar panel
}

// Parse a string to a finite number, defaulting to 0
function toNum(s: string | undefined): number {
  if (s == null) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// Resolve a SupportInstance's stat inputs into a SupportCtx
export function resolveSupportCtx(inst: SupportInstance): SupportCtx | null {
  const config = supportById(inst.supportId);
  if (!config) return null;

  // Resolve ATK/HP/DEF from base+percent+flat, or simple scalar
  const resolveTriple = (key: string) => {
    const base = toNum(inst.stats[`${key}.base`]);
    const pct = toNum(inst.stats[`${key}.percent`]);
    const flat = toNum(inst.stats[`${key}.flat`]);
    if (base > 0 || flat > 0) {
      return base * (1 + pct / 100) + flat;
    }
    return 0;
  };

  // Robust attribute resolution: check both calculator triple keys (atk.base) and mini-card scalar keys (baseAtk)
  const baseAtk =
    toNum(inst.stats["atk.base"]) ||
    toNum(inst.stats["baseAtk"]) ||
    toNum(inst.stats["atk"]);
  const baseHp =
    toNum(inst.stats["hp.base"]) ||
    toNum(inst.stats["baseHp"]) ||
    toNum(inst.stats["hp"]);
  const baseDef =
    toNum(inst.stats["def.base"]) ||
    toNum(inst.stats["baseDef"]) ||
    toNum(inst.stats["def"]);

  const atk =
    resolveTriple("atk") ||
    toNum(inst.stats["atk"]) ||
    toNum(inst.stats["baseAtk"]) ||
    baseAtk;
  const hp =
    resolveTriple("hp") ||
    toNum(inst.stats["hp"]) ||
    toNum(inst.stats["baseHp"]) ||
    baseHp;
  const def =
    resolveTriple("def") ||
    toNum(inst.stats["def"]) ||
    toNum(inst.stats["baseDef"]) ||
    baseDef;
  const em = toNum(inst.stats["em"]);
  const critRate = toNum(inst.stats["critRate"]);
  const critDmg = toNum(inst.stats["critDmg"]);

  // Parse mechanic inputs with fallback to mechanic definition defaultValue
  const inputs: Record<string, number> = {};
  for (const [k, v] of Object.entries(inst.mechanicInputs ?? {})) {
    inputs[k] = toNum(v);
  }
  for (const m of config.mechanicDefs ?? []) {
    if (!(m.id in inputs)) {
      inputs[m.id] = m.defaultValue ?? 0;
    }
  }

  // Parse talent levels (e.g. burst level 13)
  const talentLevels: Record<string, number> = {};
  for (const [k, v] of Object.entries(inst.talentLevels ?? {})) {
    talentLevels[k] = toNum(v);
  }

  return {
    atk, baseAtk, hp, baseHp, def, baseDef, em, critRate, critDmg,
    constellationLevel: inst.constellationLevel,
    talentLevels,
    inputs,
  };
}

/**
 * Resolve team buffs from all active support instances.
 * @param supports - array of SupportInstance from CalcInstance.teamSupports
 * @param masterEnabled - the master "Apply All" toggle state
 * @returns aggregated team buff result
 */
export function resolveTeamBuffs(
  supports: SupportInstance[],
  masterEnabled: boolean = true,
): TeamBuffResult {
  const result: TeamBuffResult = {
    statDeltas: {},
    lunarBaseBonusPct: 0,
    sources: [],
    teamCrit: { critRate: 0, critDmg: 0 },
  };

  if (!masterEnabled || !supports.length) return result;

  let critRateSum = 0;
  let critDmgSum = 0;
  let critCount = 0;

  for (const inst of supports) {
    // Skip disabled supports
    if (!inst.enabled) continue;

    const config = supportById(inst.supportId);
    if (!config) continue;

    const ctx = resolveSupportCtx(inst);
    if (!ctx) continue;

    // Compute each buff
    for (const buff of config.buffs) {
      const value = buff.compute(ctx);
      if (value === 0) continue;

      result.sources.push({
        supportName: config.name,
        stat: buff.stat,
        label: buff.label,
        value,
      });

      // Accumulate into statDeltas
      const key = buff.stat as keyof DamageStats;
      (result.statDeltas as Record<string, number>)[key] =
        ((result.statDeltas as Record<string, number>)[key] ?? 0) + value;
    }

    // Compute Lunar Base DMG Bonus
    if (config.lunarBaseBonusCompute) {
      const lunarBase = config.lunarBaseBonusCompute(ctx);
      if (lunarBase > 0) {
        result.lunarBaseBonusPct += lunarBase;
        result.sources.push({
          supportName: config.name,
          stat: "lunarBaseBonusPct",
          label: `Lunar Base DMG (${config.name} Moonsign)`,
          value: lunarBase,
        });
      }
    }

    // Accumulate CRIT for team Lunar calc
    critRateSum += ctx.critRate;
    critDmgSum += ctx.critDmg;
    critCount++;
  }

  // Average team CRIT across enabled supports
  if (critCount > 0) {
    result.teamCrit.critRate = critRateSum / critCount;
    result.teamCrit.critDmg = critDmgSum / critCount;
  }

  return result;
}
