import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveGanyu(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // A1 Undivided Heart: +20% CRIT Rate for Frostflake Arrows and Frostflake Blooms
  if (on("a1-crit-buff")) {
    addMods(res.perHit, "frostflake-arrow", { critRateBonusPct: 20 });
    addMods(res.perHit, "frostflake-bloom", { critRateBonusPct: 20 });
    res.notes.push("A1 Undivided Heart: +20% CRIT Rate to Frostflake Arrow & Bloom");
  }

  // A4 Harmony Between Heaven and Earth: +20% Cryo DMG Bonus in Burst AoE
  if (on("a4-cryo-buff")) {
    res.statDeltas.cryoDmgBonus = (res.statDeltas.cryoDmgBonus ?? 0) + 20;
    res.notes.push("A4 Harmony Between Heaven and Earth: +20% Cryo DMG Bonus");
  }

  // C1 Dew-Drinker: -15% Cryo RES Shred for 6s after Frostflake Arrow/Bloom hit
  if (cons >= 1 && on("c1-cryo-res-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 15;
    res.notes.push("C1 Dew-Drinker: -15% Cryo RES Shred");
  }

  // C4 Westward Sojourn: Opponents in Burst AoE take +5% increased DMG per stack (max 5 stacks = +25%)
  const c4Stacks = Math.max(0, Math.min(val("c4-dmg-stacks"), 5));
  if (cons >= 4 && c4Stacks > 0) {
    const c4Bonus = 5 * c4Stacks;
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + c4Bonus;
    res.notes.push(`C4 Westward Sojourn: +${c4Bonus}% Increased DMG Taken (${c4Stacks} stacks)`);
  }

  return res;
}
