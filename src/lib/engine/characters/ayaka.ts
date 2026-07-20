import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf } from "../mechanics-utils";

export function resolveAyaka(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A4 Sprint Senho Cryo DMG Bonus
  if (on("senho-cryo-bonus")) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 18;
    res.notes.push("A4 Senho Cryo Bonus: +18% Cryo DMG Bonus");
  }

  // A1 Passive: Amatsumi Kunitsumi Ihahito
  // +30% Normal/Charged Attack DMG Bonus for 6s after Skill cast
  if (on("a1-skill-dmg-buff")) {
    res.statDeltas.normalDmgBonus = (res.statDeltas.normalDmgBonus ?? 0) + 30;
    res.statDeltas.chargedDmgBonus = (res.statDeltas.chargedDmgBonus ?? 0) + 30;
    res.notes.push("A1 Amatsumi Kunitsumi: +30% Normal and Charged Attack DMG Bonus");
  }

  // Cryo Infusion
  if (on("cryo-infusion")) {
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Cryo" });
    }
  }

  // C4 Ebb and Flow DEF reduction
  if (on("c4-def-shred")) {
    res.statDeltas.defReduction = (res.statDeltas.defReduction ?? 0) + 30;
    res.notes.push("C4 Ebb and Flow: -30% enemy DEF on Burst hits");
  }

  // C6 Dance of Suigetsu Charged Attack buff
  if (cons >= 6 && on("c6-charged-buff")) {
    res.statDeltas.chargedDmgBonus = (res.statDeltas.chargedDmgBonus ?? 0) + 298;
    res.notes.push("C6 Usurahi Butou: +298% Charged Attack DMG Bonus");
  }

  return res;
}
