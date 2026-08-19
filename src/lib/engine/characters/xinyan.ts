import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveXinyan(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A4 Passive: ...Now That's Rock 'N' Roll! (+15% Physical DMG Bonus when shielded)
  if (on("xinyan-shield-active")) {
    res.statDeltas.physicalDmgBonus = (res.statDeltas.physicalDmgBonus ?? 0) + 15;
    res.notes.push("A4 ...Now That's Rock 'N' Roll!: +15% Physical DMG Bonus while shielded");
  }

  // C1: Fatal Acceleration (+12% Normal and Charged ATK SPD on CRIT)
  if (cons >= 1 && on("c1-crit-spd")) {
    res.notes.push("C1 Fatal Acceleration: +12% Normal & Charged Attack SPD (after CRIT hit)");
  }

  // C2: Impromptu Opening (+100% CRIT Rate on Burst Physical DMG)
  if (cons >= 2) {
    addMods(res.perHit, "burst-physical", { critRateBonusPct: 100 });
    res.notes.push("C2 Impromptu Opening: +100% CRIT Rate on Riff Revolution (Physical DMG)");
  }

  // C4: Wildfire Rhythm (-15% Physical RES Shred)
  if (cons >= 4 && on("c4-phys-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 15;
    res.notes.push("C4 Wildfire Rhythm: -15% Enemy Physical RES (Sweeping Fervor swing hit)");
  }

  // C6: Rockin' in a Flaming World (Charged Attacks gain ATK Bonus = 50% DEF)
  if (cons >= 6 && on("c6-charged-atk-bonus")) {
    const totalDef = stats.def + (res.statDeltas.def ?? 0);
    const cyclicMult = coeff(ctx, "normal", "charged-cyclic") ?? 123.6;
    const finalMult = coeff(ctx, "normal", "charged-final") ?? 224.0;
    const cyclicFlat = (cyclicMult / 100) * (0.50 * totalDef);
    const finalFlat = (finalMult / 100) * (0.50 * totalDef);

    addMods(res.perHit, "charged-cyclic", { flatDmgBonus: cyclicFlat });
    addMods(res.perHit, "charged-final", { flatDmgBonus: finalFlat });
    res.notes.push(`C6 Rockin' in a Flaming World: +50% DEF as ATK on Charged Attacks (+${fmt(0.50 * totalDef)} ATK equivalent)`);
  }

  return res;
}
