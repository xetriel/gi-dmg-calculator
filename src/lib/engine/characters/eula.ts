import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveEula(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Grimheart Stacks (+30% DEF per stack, max 2 stacks = +60%)
  const grimheart = Math.max(0, Math.min(val("grimheart-stacks"), 2));
  if (grimheart > 0) {
    const baseDefEff = ctx.baseDef ?? 751;
    const defBonus = (0.30 * grimheart) * baseDefEff;
    res.statDeltas.def = (res.statDeltas.def ?? 0) + defBonus;
    res.notes.push(`Grimheart (${grimheart} stack${grimheart === 1 ? "" : "s"}): +${30 * grimheart}% DEF (+${Math.round(defBonus)} DEF)`);
  }

  // Hold Skill Physical & Cryo RES Shred (-25%)
  if (on("hold-res-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 25;
    res.notes.push("Icetide Vortex (Hold): -25% Physical & Cryo RES Shred");
  }

  // C1 Tidal Illusion (+30% Physical DMG Bonus when Grimheart is consumed)
  if (cons >= 1 && on("c1-phys-buff")) {
    res.statDeltas.physicalDmgBonus = (res.statDeltas.physicalDmgBonus ?? 0) + 30;
    res.notes.push("C1 Tidal Illusion: +30% Physical DMG Bonus");
  }

  // Lightfall Sword Energy Stacks (0–30)
  const stacks = Math.max(0, Math.min(val("lightfall-energy-stacks"), 30));
  const stackPct = coeff(ctx, "burst", "lightfall-stack") ?? 135.0;
  if (stacks > 0) {
    // Total ATK estimated from baseAtk + stats.atk + statDeltas.atk
    const totalAtk = (ctx.baseAtk ?? 342) + stats.atk + (res.statDeltas.atk ?? 0);
    const stackFlatDmg = (stacks * stackPct / 100) * totalAtk;
    addMods(res.perHit, "lightfall-base", { flatDmgBonus: stackFlatDmg });
    res.notes.push(`Lightfall Sword (${stacks} energy stack${stacks === 1 ? "" : "s"}): +${fmt(stackFlatDmg)} Flat DMG (${(stacks * stackPct).toFixed(1)}% ATK)`);
  }

  // C4 The Obstinacy of One's Inferiors (+25% DMG to Lightfall Swords vs opponents < 50% HP)
  if (cons >= 4 && on("c4-low-hp-buff")) {
    addMods(res.perHit, "lightfall-base", { bonusDmgPct: 25 });
    addMods(res.perHit, "shattered-lightfall", { bonusDmgPct: 25 });
    res.notes.push("C4 The Obstinacy of One's Inferiors: +25% Lightfall Sword DMG vs <50% HP");
  }

  return res;
}
