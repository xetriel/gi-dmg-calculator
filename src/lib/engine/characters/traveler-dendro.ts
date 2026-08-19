import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveTravelerDendro(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const num = (id: string) => Number(inputs[id] ?? 0);
  const str = (id: string) => String(inputs[id] ?? "");

  // A1 Verdant Overgrowth: Lea Lotus Lamp gains Lotus Light stacks (max 10), granting +6 EM per stack
  const stacks = Math.max(0, Math.min(10, num("a1-lotus-light-stacks")));
  if (stacks > 0) {
    const emBonus = stacks * 6;
    res.statDeltas.em = (res.statDeltas.em ?? 0) + emBonus;
    res.notes.push(`Verdant Overgrowth (A1): +${emBonus} EM (${stacks} Lotus Light stacks).`);
  }

  // A4 Verdant Luxuriance: Every point of EM increases Skill DMG by 0.15% & Burst DMG by 0.1%
  const totalEm = (stats.em ?? 0) + (res.statDeltas.em ?? 0);
  if (totalEm > 0) {
    const skillBonus = totalEm * 0.15;
    const burstBonus = totalEm * 0.1;
    addMods(res.perHit, "skill-dmg", { bonusDmgPct: skillBonus });
    addMods(res.perHit, "lotus-dmg", { bonusDmgPct: burstBonus });
    addMods(res.perHit, "transfiguration-explosion", { bonusDmgPct: burstBonus });
    res.notes.push(`Verdant Luxuriance (A4): +${skillBonus.toFixed(1)}% Skill DMG & +${burstBonus.toFixed(1)}% Burst DMG from ${totalEm} EM.`);
  }

  // C6 Moment of Respite (+12% Dendro DMG Bonus & +12% Transmuted Element DMG Bonus)
  if (cons >= 6 && on("c6-dendro-buff")) {
    res.statDeltas.dendroDmgBonus = (res.statDeltas.dendroDmgBonus ?? 0) + 12;
    res.notes.push("Moment of Respite (C6): +12% Dendro DMG Bonus under Lotus Light Transfiguration.");

    if (on("c6-hydro-buff")) {
      res.statDeltas.hydroDmgBonus = (res.statDeltas.hydroDmgBonus ?? 0) + 12;
      res.notes.push("Moment of Respite (C6): +12% Hydro DMG Bonus (Hydro Transfiguration).");
    }
    if (on("c6-electro-buff")) {
      res.statDeltas.electroDmgBonus = (res.statDeltas.electroDmgBonus ?? 0) + 12;
      res.notes.push("Moment of Respite (C6): +12% Electro DMG Bonus (Electro Transfiguration).");
    }
    if (on("c6-pyro-buff")) {
      res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + 12;
      res.notes.push("Moment of Respite (C6): +12% Pyro DMG Bonus (Pyro Transfiguration).");
    }
  }

  return res;
}
