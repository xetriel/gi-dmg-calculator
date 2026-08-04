import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";

export function resolveCyno(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Pactsworn Pathclearer State (Burst & A1 +100 EM)
  if (on("pactsworn-state")) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 100;
    res.notes.push("Pactsworn Pathclearer State: +100 EM & Electro Infusion");
  }

  // Total EM after deltas
  const emTotal = stats.em + (res.statDeltas.em ?? 0);

  // A4 Authority Over the Nine Bows: EM-based Flat DMG additions
  // Pactsworn Normal Attack DMG increased by 150% of EM
  if (emTotal > 0) {
    const pactswornFlat = 1.50 * emTotal;
    const pactswornHits = [
      "pactsworn-1", "pactsworn-2", "pactsworn-3", "pactsworn-4", "pactsworn-5",
      "pactsworn-charged", "pactsworn-plunge", "pactsworn-low-plunge", "pactsworn-high-plunge"
    ];
    for (const key of pactswornHits) {
      addMods(res.perHit, key, { flatDmgBonus: pactswornFlat });
    }

    // Duststalker Bolt DMG increased by 250% of EM
    const duststalkerFlat = 2.50 * emTotal;
    for (const key of ["duststalker-bolt", "duststalker-bolt-stellar"]) {
      addMods(res.perHit, key, { flatDmgBonus: duststalkerFlat });
    }

    res.notes.push(`A4 Nine Bows: +${fmt(pactswornFlat)} Flat DMG to Pactsworn Attacks (150% EM), +${fmt(duststalkerFlat)} Flat DMG to Duststalker Bolts (250% EM)`);
  }

  // A1 Featherfall Judgment: Judication stance increases Mortuary Rite DMG by 35%
  if (on("judication-buff")) {
    addMods(res.perHit, "mortuary-rite", { bonusDmgPct: 35 });
    res.notes.push("A1 Judication: +35% Mortuary Rite DMG");
  }

  // Revelation Buff / Stellar-Conduct Direct Reaction
  if (on("revelation-buff")) {
    const direct: DirectReactionParams = { coefficient: 1.45, baseDmgBonusPct: 0, reactionBonusPct: 0 };
    addMods(res.perHit, "duststalker-bolt-stellar", { directReaction: direct });
    res.notes.push("Revelation Buff: Duststalker Bolt routing through Stellar-Conduct Direct Reaction");
  }

  // C2 Ceremony: Homecoming of Spirits (+10% Electro DMG Bonus per stack, max 5 stacks = +50%)
  const c2Stacks = Math.max(0, Math.min(val("c2-stacks"), 5));
  if (cons >= 2 && c2Stacks > 0) {
    res.statDeltas.electroDmgBonus = (res.statDeltas.electroDmgBonus ?? 0) + 10 * c2Stacks;
    res.notes.push(`C2 Ceremony: +${10 * c2Stacks}% Electro DMG Bonus (${c2Stacks} stacks)`);
  }

  return res;
}
