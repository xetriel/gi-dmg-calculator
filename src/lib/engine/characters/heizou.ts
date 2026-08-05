import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveHeizou(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Declension Stacks (0–4) & Conviction Effect (at 4 stacks)
  const stacks = Math.max(0, Math.min(val("declension-stacks"), 4));
  const declensionPct = coeff(ctx, "skill", "declension-dmg") ?? 102.38;
  const convictionPct = coeff(ctx, "skill", "conviction-dmg") ?? 204.77;

  if (stacks > 0) {
    const totalAtk = (ctx.baseAtk ?? 225) + stats.atk + (res.statDeltas.atk ?? 0);
    const bonusPct = stacks * declensionPct + (stacks === 4 ? convictionPct : 0);
    const stackFlatDmg = (bonusPct / 100) * totalAtk;

    addMods(res.perHit, "skill-dmg", { flatDmgBonus: stackFlatDmg });
    res.notes.push(
      `Heartstopper Strike (${stacks} Declension stack${stacks === 1 ? "" : "s"}${stacks === 4 ? " + Conviction" : ""}): +${fmt(stackFlatDmg)} Flat DMG (+${bonusPct.toFixed(1)}% ATK)`
    );
  }

  // C6 Curious Casefiles: +4% CRIT Rate per Declension stack; +32% CRIT DMG at 4 stacks (Conviction)
  if (cons >= 6 && stacks > 0) {
    const c6CritRate = stacks * 4;
    const c6CritDmg = stacks === 4 ? 32 : 0;

    addMods(res.perHit, "skill-dmg", {
      critRateBonusPct: c6CritRate,
      ...(c6CritDmg > 0 ? { critDmgBonusPct: c6CritDmg } : {}),
    });

    res.notes.push(
      `C6 Curious Casefiles: +${c6CritRate}% CRIT Rate${c6CritDmg > 0 ? " & +32% CRIT DMG" : ""} on Heartstopper Strike`
    );
  }

  // C1 Named Juvenile Casebook note
  if (cons >= 1 && on("c1-na-spd")) {
    res.notes.push("C1 Named Juvenile Casebook: +15% Normal Attack SPD for 5s");
  }

  // A4 Penetrative Reasoning note
  if (on("a4-em-buff")) {
    res.notes.push("A4 Penetrative Reasoning: +80 EM to teammates for 10s");
  }

  return res;
}
