import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveTravelerDendro(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A4 Verdant Luxuriance: Every point of EM increases Skill DMG by 0.15% & Burst DMG by 0.1%
  const em = stats.em ?? 0;
  if (em > 0) {
    const skillBonus = em * 0.15;
    const burstBonus = em * 0.1;
    addMods(res.perHit, "skill-dmg", { bonusDmgPct: skillBonus });
    addMods(res.perHit, "lotus-dmg", { bonusDmgPct: burstBonus });
    res.notes.push(`Verdant Luxuriance (A4): +${skillBonus.toFixed(1)}% Skill DMG & +${burstBonus.toFixed(1)}% Burst DMG from ${em} EM.`);
  }

  // C6 Moment of Respite (+12% Dendro DMG Bonus)
  if (cons >= 6 && on("c6-dendro-buff")) {
    res.statDeltas.dendroDmgBonus = (res.statDeltas.dendroDmgBonus ?? 0) + 12;
    res.notes.push("Moment of Respite (C6): +12% Dendro DMG Bonus under Lotus Light Transfiguration.");
  }

  return res;
}
