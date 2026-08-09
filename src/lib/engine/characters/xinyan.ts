import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveXinyan(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A4 Now That's Rock 'N' Roll! (+15% Physical DMG Bonus when shield is active)
  if (on("shield-active")) {
    res.statDeltas.physicalDmgBonus = (res.statDeltas.physicalDmgBonus ?? 0) + 15;
    res.notes.push("Now That's Rock 'N' Roll! (A4): +15% Physical DMG Bonus while protected by Sweeping Fervor's shield.");
  }

  // C2 Impromptu Opening (+100% CRIT Rate on Burst Physical DMG)
  if (cons >= 2 && on("c2-burst-crit")) {
    addMods(res.perHit, "burst-physical", {
      critRateBonusPct: 100,
    });
    res.notes.push("Impromptu Opening (C2): Riff Revolution Physical DMG CRIT Rate +100%.");
  }

  // C4 Wildfire Rhythm (-15% Physical RES shred)
  if (cons >= 4 && on("c4-phys-shred")) {
    res.notes.push("Wildfire Rhythm (C4): Opponents hit by Sweeping Fervor have Physical RES decreased by 15%.");
  }

  // C6 Rockin' in a Wild World (+50% DEF converted to ATK during Charged Attacks)
  if (cons >= 6 && on("c6-charged-atk-bonus")) {
    const atkBonus = 0.50 * stats.def;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`Rockin' in a Wild World (C6): +${atkBonus.toFixed(1)} ATK (+50% DEF) during Charged Attacks.`);
  }

  return res;
}
