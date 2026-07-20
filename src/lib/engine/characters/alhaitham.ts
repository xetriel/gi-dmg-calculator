import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, hitKeysOf, fmt } from "../mechanics-utils";

export function resolveAlhaitham(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // C2 Rhetoric EM Buff
  const c2Stacks = val("alhaitham-c2-stacks");
  if (c2Stacks > 0) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 50 * c2Stacks;
    res.notes.push(`C2 Rhetoric: +${50 * c2Stacks} EM (${c2Stacks} stacks)`);
  }

  // C4 Elucidation Dendro DMG Buff
  const c4Stacks = val("alhaitham-c4-dmg-bonus-stacks");
  if (c4Stacks > 0) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 10 * c4Stacks;
    res.notes.push(`C4 Elucidation: +${10 * c4Stacks}% Dendro DMG Bonus (${c4Stacks} stacks)`);
  }

  // C6 Structuration CRIT Buff
  if (cons >= 6 && on("alhaitham-c6-crit")) {
    res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + 10;
    res.statDeltas.critDmg = (res.statDeltas.critDmg ?? 0) + 70;
    res.notes.push("C6 Structuration: +10% CRIT Rate, +70% CRIT DMG");
  }

  // Apply effective EM for calculations
  const emEff = stats.em + (res.statDeltas.em ?? 0);

  // A4 Mysteries Laid Bare DMG Bonus
  // Projection Attack & Burst DMG increased by 0.1% per EM (max 100%)
  const a4DmgBonus = Math.min(0.1 * emEff, 100);
  res.notes.push(`A4 Mysteries Laid Bare: +${a4DmgBonus.toFixed(1)}% Skill Projection/Burst DMG Bonus (based on ${fmt(emEff)} EM)`);

  // Dendro Infusion
  if (on("dendro-infusion")) {
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Dendro" });
    }
  }

  // Dual-Scaling calculations using flatDmgBonus
  // Rush DMG: (Rush Multiplier / 100) * EM * 0.8
  const rushMult = coeff(ctx, "skill", "rush-dmg") ?? 0;
  if (rushMult > 0) {
    const rushEMDmg = (rushMult / 100) * emEff * 0.8;
    addMods(res.perHit, "rush-dmg", { flatDmgBonus: rushEMDmg });
  }

  // Projection DMG: (Projection Multiplier / 100) * EM * 2.0
  const skillHits = ["projection-1", "projection-2", "projection-3"];
  for (const key of skillHits) {
    const projMult = coeff(ctx, "skill", key) ?? 0;
    if (projMult > 0) {
      const projEMDmg = (projMult / 100) * emEff * 2.0;
      addMods(res.perHit, key, { flatDmgBonus: projEMDmg, bonusDmgPct: a4DmgBonus });
    }
  }

  // Burst DMG: (Burst Multiplier / 100) * EM * 0.8
  const burstMult = coeff(ctx, "burst", "burst-dmg") ?? 0;
  if (burstMult > 0) {
    const burstEMDmg = (burstMult / 100) * emEff * 0.8;
    addMods(res.perHit, "burst-dmg", { flatDmgBonus: burstEMDmg, bonusDmgPct: a4DmgBonus });
  }

  return res;
}
