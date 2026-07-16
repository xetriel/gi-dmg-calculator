import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf, fmt } from "../mechanics-utils";

export function resolveClorinde(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const val = (id: string) => inputs[id] ?? 0;

  // A1 Dark-Shattering Flame: after a party Electro-related reaction, NA & Burst
  // gain +20% ATK as flat DMG per stack (max 3), total capped at 1,800.
  // C2 upgrades to 30% per stack, cap 2,700.
  const stacks = val("dark-flame-stacks");
  if (stacks > 0) {
    const perStack = cons >= 2 ? 30 : 20;
    const cap = cons >= 2 ? 2700 : 1800;
    const additive = Math.min(stacks * (perStack / 100) * stats.atk, cap);
    const keys = [...hitKeysOf(config, "normal"), "swift-hunt-1", "swift-hunt-2", "skill-dmg-x5"];
    for (const key of keys) addMods(res.perHit, key, { flatDmgBonus: additive });
    res.notes.push(
      `Dark-Shattering Flame: +${fmt(additive)} flat DMG on NA & Burst (${stacks} × ${perStack}% ATK${additive >= cap ? ", capped" : ""}${cons >= 2 ? ", C2" : ""})`
    );
  }
  // A4 Lawful Remuneration: +10% CRIT Rate per Bond of Life change (max 2 stacks).
  const a4 = Math.min(val("a4-crit-stacks"), 2) * 10;
  if (a4 > 0) {
    res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + a4;
    res.notes.push(`A4: +${a4}% CRIT Rate (Bond of Life ≥ 100%)`);
  }
  // C4: every 1% current Bond of Life → +2% Last Lightfall DMG (max +200%).
  if (cons >= 4) {
    const bonus = Math.min(2 * val("bond-of-life"), 200);
    if (bonus > 0) {
      addMods(res.perHit, "skill-dmg-x5", { bonusDmgPct: bonus });
      res.notes.push(`C4: +${bonus}% DMG Bonus on Last Lightfall (Bond of Life)`);
    }
  }
  // C6: +10% CRIT Rate and +70% CRIT DMG for 12s after using Hunter's Vigil.
  if (cons >= 6) {
    res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + 10;
    res.statDeltas.critDmg = (res.statDeltas.critDmg ?? 0) + 70;
    res.notes.push("C6: +10% CRIT Rate / +70% CRIT DMG (12s after Hunter's Vigil)");
  }

  return res;
}
