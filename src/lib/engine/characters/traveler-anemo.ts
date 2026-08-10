import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";

export function resolveTravelerAnemo(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C2 Uprising Whirlwind (+16% ER)
  if (cons >= 2 && on("c2-er-bonus")) {
    res.statDeltas.energyRecharge = (res.statDeltas.energyRecharge ?? 0) + 16;
    res.notes.push("Uprising Whirlwind (C2): +16% Energy Recharge.");
  }

  // C6 Intertwined Winds (-20% Anemo RES & Absorbed Element RES)
  if (cons >= 6 && on("c6-res-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 20;
    res.notes.push("Intertwined Winds (C6): Targets hit by Gust Surge have Anemo RES and Absorbed Element RES decreased by 20%.");
  }

  return res;
}
