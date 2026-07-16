import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveNeuvillette(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { constellationLevel: cons } = ctx;
  const val = (id: string) => ctx.inputs[id] ?? 0;

  // Past Draconic Glories: Equitable Judgment deals 110%/125%/160% at 1/2/3 stacks.
  // C1: +1 stack on taking the field (still capped at 3).
  const stacks = Math.min(val("draconic-stacks") + (cons >= 1 ? 1 : 0), 3);
  const mult = [1, 1.1, 1.25, 1.6][stacks];
  if (mult !== 1) {
    addMods(res.perHit, "equitable-judgment", { baseDmgMultiplier: mult });
    res.notes.push(`Past Draconic Glories ×${mult} on Equitable Judgment (${stacks} stack${stacks > 1 ? "s" : ""}${cons >= 1 ? ", incl. C1" : ""})`);
  }
  // C2: each stack +14% CRIT DMG on Equitable Judgment (max 42%).
  if (cons >= 2 && stacks > 0) {
    addMods(res.perHit, "equitable-judgment", { critDmgBonusPct: Math.min(14 * stacks, 42) });
    res.notes.push(`C2: +${Math.min(14 * stacks, 42)}% CRIT DMG on Equitable Judgment`);
  }
  // A4: +0.6% Hydro DMG per 1% current HP above 30% of Max HP, capped at +30%.
  const hpPct = val("current-hp");
  const a4 = Math.min(Math.max(hpPct - 30, 0) * 0.6, 30);
  if (a4 > 0) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + a4;
    res.notes.push(`A4: +${a4.toFixed(1)}% Hydro DMG Bonus (current HP ${hpPct}%)`);
  }

  return res;
}
