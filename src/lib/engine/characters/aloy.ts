import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, hitKeysOfCategory, fmt } from "../mechanics-utils";

export function resolveAloy(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // A1 Combat Override: +16% ATK when gaining a Coil stack
  if (on("a1-atk-buff")) {
    const baseAtkEff = ctx.baseAtk ?? 234;
    const atkBonus = 0.16 * baseAtkEff;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`A1 Combat Override: +${Math.round(atkBonus)} ATK (+16% Base ATK)`);
  }

  // A4 Strong Strike: +3.5% Cryo DMG Bonus per stack in Rushing Ice state (max 10 stacks = +35%)
  const a4Stacks = Math.max(0, Math.min(val("a4-cryo-stacks"), 10));
  if (a4Stacks > 0) {
    const cryoBonus = 3.5 * a4Stacks;
    res.statDeltas.cryoDmgBonus = (res.statDeltas.cryoDmgBonus ?? 0) + cryoBonus;
    res.notes.push(`A4 Strong Strike: +${cryoBonus.toFixed(1)}% Cryo DMG Bonus (${a4Stacks} stacks)`);
  }

  // Coil Stacks (1–3) and Rushing Ice State (4)
  const coilStacks = Math.max(0, Math.min(val("coil-stacks"), 4));
  if (coilStacks >= 1 && coilStacks <= 3) {
    const coilBonus = coeff(ctx, "skill", `coil-${coilStacks}`) ?? 0;
    if (coilBonus > 0) {
      res.statDeltas.normalDmgBonus = (res.statDeltas.normalDmgBonus ?? 0) + coilBonus;
      res.notes.push(`Coil (${coilStacks} stack${coilStacks === 1 ? "" : "s"}): +${coilBonus.toFixed(1)}% Normal Attack DMG Bonus`);
    }
  } else if (coilStacks === 4) {
    // 4 Coil Stacks = Rushing Ice State
    const rushingIceBonus = coeff(ctx, "skill", "rushing-ice") ?? 47.65;
    res.statDeltas.normalDmgBonus = (res.statDeltas.normalDmgBonus ?? 0) + rushingIceBonus;

    // Cryo Infusion on Normal Attacks
    const naHitKeys = hitKeysOfCategory(config, "normal", "normal");
    for (const key of naHitKeys) {
      addMods(res.perHit, key, { element: "Cryo" });
    }
    res.notes.push(`Rushing Ice State (4 Coil Stacks): Cryo Normal Attack Infusion & +${rushingIceBonus.toFixed(1)}% Normal Attack DMG Bonus`);
  }

  return res;
}
