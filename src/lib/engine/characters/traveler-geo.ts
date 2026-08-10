import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";

export function resolveTravelerGeo(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C1 Invincible Wall (+10% CRIT Rate inside Burst zone)
  if (cons >= 1 && on("c1-crit-rate")) {
    res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + 10;
    res.notes.push("Invincible Wall (C1): +10% CRIT Rate within Wake of Earth radius.");
  }

  return res;
}
