import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, hitKeysOf } from "../mechanics-utils";

export function resolveKaveh(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // A4 A Craftsman's Curious Conceptions: +25 EM per stack (max 4 stacks = +100 EM)
  const a4Stacks = Math.max(0, Math.min(val("a4-em-stacks"), 4));
  if (a4Stacks > 0) {
    const a4Em = 25 * a4Stacks;
    res.statDeltas.em = (res.statDeltas.em ?? 0) + a4Em;
    res.notes.push(`A4 A Craftsman's Curious Conceptions: +${a4Em} EM (${a4Stacks} stack${a4Stacks === 1 ? "" : "s"})`);
  }

  // Painted Dome State: Dendro Infusion & Bloom DMG Bonus
  if (on("burst-painted-dome")) {
    const bloomBonus = coeff(ctx, "burst", "bloom-dmg-bonus") ?? 49.48;

    // Override element on all Normal, Charged, and Plunging Attack hits to Dendro
    const normalHits = hitKeysOf(config, "normal");
    for (const key of normalHits) {
      addMods(res.perHit, key, { element: "Dendro" });
    }

    res.notes.push(`Painted Dome: Dendro Infusion & +${bloomBonus.toFixed(2)}% Bloom DMG Bonus`);
  }

  // C1 Sublime Salutations note
  if (cons >= 1 && on("c1-buff")) {
    res.notes.push("C1 Sublime Salutations: +50% Dendro RES & +50% Healing Received for 3.5s");
  }

  // C4 Feast of Apadana note
  if (cons >= 4 && on("c4-bloom-buff")) {
    res.notes.push("C4 Feast of Apadana: +60% Bloom DMG Bonus for Kaveh's Dendro Cores");
  }

  // C6 Pairidaeza's Dreams note
  if (cons >= 6) {
    res.notes.push("C6 Pairidaeza's Dreams: Pairidaeza's Light deals 61.8% ATK AoE Dendro DMG (3s CD)");
  }

  return res;
}
