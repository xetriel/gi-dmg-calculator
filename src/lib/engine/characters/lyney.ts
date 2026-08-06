import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveLyney(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Prop Surplus Stacks (0–5 Stacks: +propBonusCoeff * ATK per stack to Skill Base DMG)
  const propStacks = Math.max(0, Math.min(val("prop-surplus-stacks"), 5));
  if (propStacks > 0) {
    const propBonusCoeff = coeff(ctx, "skill", "prop-surplus-bonus") ?? 0;
    if (propBonusCoeff > 0) {
      const flatBonus = propStacks * (propBonusCoeff / 100) * stats.atk;
      addMods(res.perHit, "skill-dmg", { flatDmgBonus: flatBonus });
      res.notes.push(`Prop Surplus (${propStacks} stack${propStacks === 1 ? "" : "s"}): +${fmt(flatBonus)} flat DMG to Bewildering Lights (${propStacks} × ${propBonusCoeff}% ATK)`);
    }
  }

  // A1 Perilous Performance (+80% ATK Flat DMG to Pyrotechnic Strike)
  if (on("a1-hp-consumed")) {
    const a1Flat = 0.80 * stats.atk;
    addMods(res.perHit, "pyrotechnic-strike", { flatDmgBonus: a1Flat });
    addMods(res.perHit, "c6-reprise", { flatDmgBonus: a1Flat });
    res.notes.push(`A1 Perilous Performance: +${fmt(a1Flat)} flat DMG to Pyrotechnic Strike (80% ATK)`);
  }

  // A4 Conclusive Ovation (Pyro-affected opponent: 1–3 Pyro members: +60% / +80% / +100% Pyro DMG Bonus)
  const pyroMembers = val("a4-pyro-members");
  if (pyroMembers > 0) {
    const clampedMembers = Math.max(1, Math.min(pyroMembers, 3));
    const pyroBonus = 60 + (clampedMembers - 1) * 20;
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + pyroBonus;
    res.notes.push(`A4 Conclusive Ovation: +${pyroBonus}% Pyro DMG Bonus (${clampedMembers} Pyro party member${clampedMembers === 1 ? "" : "s"})`);
  }

  // C2 Crisp Focus (0–3 Stacks: +20% / +40% / +60% CRIT DMG)
  if (cons >= 2) {
    const c2Stacks = Math.max(0, Math.min(val("c2-focus-stacks"), 3));
    if (c2Stacks > 0) {
      const c2CritDmg = c2Stacks * 20;
      res.statDeltas.critDmg = (res.statDeltas.critDmg ?? 0) + c2CritDmg;
      res.notes.push(`C2 Crisp Focus (${c2Stacks} stack${c2Stacks === 1 ? "" : "s"}): +${c2CritDmg}% CRIT DMG`);
    }
  }

  // C4 Well-Rehearsed Verses (-20% Enemy Pyro RES)
  if (cons >= 4 && on("c4-pyro-res-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 20;
    res.notes.push("C4 Well-Rehearsed Verses: -20% Enemy Pyro RES for 6s");
  }

  // Constellation exclusive hit: 0 multiplier if below C6
  if (cons < 6) {
    addMods(res.perHit, "c6-reprise", { baseDmgMultiplier: 0 });
  }

  return res;
}
