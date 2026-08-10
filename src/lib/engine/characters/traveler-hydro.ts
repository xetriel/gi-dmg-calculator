import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";

export function resolveTravelerHydro(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C4 Pouring Stream (10% Max HP Shield)
  if (cons >= 4 && on("c4-shield")) {
    const shieldHp = 0.10 * stats.hp;
    res.notes.push(`Pouring Stream (C4): Creates a shield absorbing 10% Max HP (${shieldHp.toFixed(0)} HP durability) upon casting Aquacrest Saber.`);
  }

  return res;
}
