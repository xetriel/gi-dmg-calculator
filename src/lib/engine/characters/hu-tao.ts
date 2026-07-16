import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { coeff, fmt } from "../mechanics-utils";

export function resolveHuTao(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // Paramita Papilio: ATK += (skill "ATK Increase (% Max HP)") × Max HP, capped at
  // 400% of Base ATK. Wiki fixed value: cap = 400% Base ATK.
  if (on("paramita")) {
    const pct = coeff(ctx, "skill", "atk-increase") ?? 0;
    const raw = (pct / 100) * stats.hp;
    const cap = 4 * ctx.baseAtk;
    const bonus = Math.min(raw, cap);
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + bonus;
    res.notes.push(
      `Paramita: +${fmt(bonus)} ATK (${pct}% of Max HP${raw > cap ? ", capped at 400% Base ATK" : ""})`
    );
  }
  // Sanguine Rouge (A4): ≤50% HP → +33% Pyro DMG Bonus.
  if (on("low-hp")) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 33;
    res.notes.push("Sanguine Rouge: +33% Pyro DMG Bonus (HP ≤ 50%)");
  }

  return res;
}
