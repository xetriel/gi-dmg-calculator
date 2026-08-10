import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveTravelerElectro(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C2 Violet Vehemence (-15% Electro RES)
  if (cons >= 2 && on("c2-electro-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 15;
    res.notes.push("Violet Vehemence (C2): Decreases target Electro RES by 15% on Falling Thunder hit.");
  }

  // C6 World-Shaking Thunder (3rd Falling Thunder deals 200% DMG multiplier)
  if (cons >= 6) {
    addMods(res.perHit, "falling-thunder-3rd", {
      baseDmgMultiplier: 2,
    });
    res.notes.push("World-Shaking Thunder (C6): 3rd Falling Thunder deals 200% DMG multiplier.");
  }

  return res;
}
