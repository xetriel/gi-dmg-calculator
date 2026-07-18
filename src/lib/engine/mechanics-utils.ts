import type { CharacterConfig, Element } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { DamageStats, DirectReactionParams } from "./damage";

export interface PerHitMods {
  flatDmgBonus?: number;
  baseDmgMultiplier?: number;
  critDmgBonusPct?: number;
  critRateBonusPct?: number;
  bonusDmgPct?: number;
  reactionBonusPct?: number; // extra reaction bonus %, e.g. from talents
  defIgnorePct?: number;     // per-hit DEF ignore % (e.g. Durin C6 on Burst)
  directReaction?: DirectReactionParams; // Stellar-Conduct / Direct-Lunar hits: routes computeHit into the direct-reaction branch
  element?: Element | "Physical";
}

export interface MechanicsResult {
  statDeltas: Partial<DamageStats>; // added onto the resolved stats before computing hits
  perHit: Record<string, PerHitMods>; // keyed by TalentHit.key
  notes: string[]; // computed info lines shown in the UI (e.g. heal amounts, caps hit)
  lunarBaseBonusPct?: number; // auto Lunar Base DMG Bonus (Moonsign passives, e.g. Zibai) — also fed to the indirect lunar panel
}

export interface MechanicsCtx {
  stats: DamageStats;                   // resolved stats, before deltas
  baseAtk: number;                      // the "Base" ATK input (Paramita cap: 400% of it)
  baseDef: number;                      // the "Base" DEF input (Zibai A4: +15% of it per Geo ally)
  baseHp?: number;                      // the "Base" HP input (Columbina C2 HP Buff)
  constellationLevel: number;           // 0–6
  talentLevels: Record<string, number>; // effective level per talent type (incl. C3/C5 +3)
  scaling: TalentScalingData;           // per-level values incl. buff/heal rows
  inputs: Record<string, number>;       // MechanicDef.id -> value (toggle: 0/1)
}

// Look up a per-level coefficient (damage/buff/heal row) from the scaling data.
export function coeff(ctx: MechanicsCtx, talentType: string, hitKey: string): number | undefined {
  const t = ctx.scaling[talentType];
  const lvl = ctx.talentLevels[talentType];
  if (!t || !lvl) return undefined;
  const capped = Math.min(lvl, Math.max(...t.levels));
  return t.byLevel[capped]?.[hitKey];
}

// All damage hit keys of one talent group (used to apply "all Normal Attack" effects).
export function hitKeysOf(config: CharacterConfig, type: string): string[] {
  return config.talents.find(g => g.type === type)?.hits.filter(h => h.kind !== "heal" && h.kind !== "shield").map(h => h.key) ?? [];
}

export const addMods = (perHit: Record<string, PerHitMods>, key: string, mods: PerHitMods) => {
  const m = (perHit[key] ??= {});
  if (mods.flatDmgBonus !== undefined) m.flatDmgBonus = (m.flatDmgBonus ?? 0) + mods.flatDmgBonus;
  if (mods.baseDmgMultiplier !== undefined) m.baseDmgMultiplier = (m.baseDmgMultiplier ?? 1) * mods.baseDmgMultiplier;
  if (mods.critDmgBonusPct !== undefined) m.critDmgBonusPct = (m.critDmgBonusPct ?? 0) + mods.critDmgBonusPct;
  if (mods.critRateBonusPct !== undefined) m.critRateBonusPct = (m.critRateBonusPct ?? 0) + mods.critRateBonusPct;
  if (mods.bonusDmgPct !== undefined) m.bonusDmgPct = (m.bonusDmgPct ?? 0) + mods.bonusDmgPct;
  if (mods.reactionBonusPct !== undefined) m.reactionBonusPct = (m.reactionBonusPct ?? 0) + mods.reactionBonusPct;
  if (mods.defIgnorePct !== undefined) m.defIgnorePct = (m.defIgnorePct ?? 0) + mods.defIgnorePct;
  if (mods.directReaction !== undefined) m.directReaction = mods.directReaction; // set once per hit, not accumulated
  if (mods.element !== undefined) m.element = mods.element;
};

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
