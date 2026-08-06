import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveMualani(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  const effHp = (stats.hp ?? 0) + (res.statDeltas.hp ?? 0);

  // A1 Heat-Seeking Surfshark: Wave-Surfing's Passion (+15% Max HP flat DMG per stack on Sharky's Bites)
  const a1Stacks = Math.max(0, Math.min(val("a1-pufferfish-stacks"), 3));
  if (a1Stacks > 0) {
    const a1Flat = 0.15 * a1Stacks * effHp;
    addMods(res.perHit, "shark-bite", { flatDmgBonus: a1Flat });
    addMods(res.perHit, "shark-bite-1", { flatDmgBonus: a1Flat });
    addMods(res.perHit, "shark-bite-2", { flatDmgBonus: a1Flat });
    addMods(res.perHit, "surging-bite", { flatDmgBonus: a1Flat });
    res.notes.push(`A1 Heat-Seeking Surfshark: +${fmt(a1Flat)} flat DMG on Sharky's Bites (${a1Stacks} Pufferfish stack${a1Stacks === 1 ? "" : "s"} × 15% Max HP)`);
  }

  // A4 Resistant Freshwater: Till the Final Wave (+15% / +30% Max HP flat Burst DMG)
  const a4Stacks = Math.max(0, Math.min(val("a4-nightsoul-burst-stacks"), 2));
  if (a4Stacks > 0) {
    const a4Flat = 0.15 * a4Stacks * effHp;
    addMods(res.perHit, "burst-dmg", { flatDmgBonus: a4Flat });
    res.notes.push(`A4 Resistant Freshwater: +${fmt(a4Flat)} flat Burst DMG (${a4Stacks} Nightsoul Burst stack${a4Stacks === 1 ? "" : "s"} × 15% Max HP)`);
  }

  // C1 The Leisurely "Meztli" / C6 Spirit of the Springs' People (+66% Max HP flat DMG to Surging Bite)
  if ((cons >= 1 && on("c1-surging-first-hit")) || cons >= 6) {
    const c1Flat = 0.66 * effHp;
    addMods(res.perHit, "surging-bite", { flatDmgBonus: c1Flat });
    res.notes.push(`C1 The Leisurely "Meztli": +${fmt(c1Flat)} flat DMG to Sharky's Surging Bite (66% Max HP)`);
  }

  // C4 Shark-Eating Shark (+75% Burst DMG Bonus)
  if (cons >= 4 && on("c4-burst-buff")) {
    addMods(res.perHit, "burst-dmg", { bonusDmgPct: 75 });
    res.notes.push("C4 Shark-Eating Shark: +75% Burst DMG Bonus");
  }

  return res;
}
