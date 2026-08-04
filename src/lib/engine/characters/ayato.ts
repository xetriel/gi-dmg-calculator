import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff } from "../mechanics-utils";

export function resolveAyato(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // C2: Max Namisen stacks limit is 5 instead of 4
  const maxStacks = cons >= 2 ? 5 : 4;
  const rawStacks = val("namisen-stacks");
  const stacks = Math.max(0, Math.min(rawStacks, maxStacks));

  // C2 World Source HP Boost (+50% Max HP when stacks >= 3)
  if (cons >= 2 && on("c2-hp-buff") && stacks >= 3) {
    const baseHpEff = ctx.baseHp ?? 13715;
    const hpBonus = 0.50 * baseHpEff;
    res.statDeltas.hp = (res.statDeltas.hp ?? 0) + hpBonus;
    res.notes.push(`C2 World Source: +${Math.round(hpBonus)} Max HP (+50% Base HP, 3+ Namisen Stacks)`);
  }

  // Namisen Flat DMG Bonus calculation
  // Extra DMG = stacks * (namisenPct / 100) * Max HP
  const namisenPct = coeff(ctx, "skill", "namisen-increase") ?? 0.56;
  if (stacks > 0 && namisenPct > 0 && stats) {
    const flatDmg = stacks * (namisenPct / 100) * stats.hp;
    const shunsuikenKeys = ["shunsuiken-1", "shunsuiken-2", "shunsuiken-3"];
    for (const key of shunsuikenKeys) {
      addMods(res.perHit, key, { flatDmgBonus: flatDmg });
    }
    res.notes.push(`Namisen (${stacks} stacks): +${Math.round(flatDmg)} Flat DMG to Shunsuiken`);
  }

  // C1 Kyouka Fushi: +40% Shunsuiken DMG against <= 50% HP enemies
  if (cons >= 1 && on("c1-low-hp-buff")) {
    const shunsuikenKeys = ["shunsuiken-1", "shunsuiken-2", "shunsuiken-3"];
    for (const key of shunsuikenKeys) {
      addMods(res.perHit, key, { bonusDmgPct: 40 });
    }
    res.notes.push("C1 Kyouka Fushi: +40% Shunsuiken DMG against HP <= 50%");
  }

  // Suiyuu Elemental Burst NA DMG Bonus
  if (on("burst-na-buff")) {
    const naBonus = coeff(ctx, "burst", "burst-na-increase") ?? 11;
    res.statDeltas.normalDmgBonus = (res.statDeltas.normalDmgBonus ?? 0) + naBonus;
    res.notes.push(`Suiyuu Burst Field: +${naBonus}% Normal Attack DMG Bonus`);
  }

  return res;
}
