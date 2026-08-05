import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt, hitKeysOf } from "../mechanics-utils";

export function resolveItto(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  const baseDef = ctx.baseDef ?? 959;
  const baseAtk = ctx.baseAtk ?? 227;

  // C4 Jailhouse Bread and Butter: +20% DEF and +20% ATK to nearby party members
  if (cons >= 4 && on("c4-party-buff")) {
    const c4DefBonus = 0.20 * baseDef;
    const c4AtkBonus = 0.20 * baseAtk;
    res.statDeltas.def = (res.statDeltas.def ?? 0) + c4DefBonus;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + c4AtkBonus;
    res.notes.push("C4 Jailhouse Bread and Butter: +20% DEF & +20% ATK");
  }

  // Calculate total DEF for conversion & A4 passive scaling
  const totalDef = stats.def + (res.statDeltas.def ?? 0);

  // Raging Oni King State: Converts DEF to ATK & infuses NA/CA/Plunge with Geo
  if (on("burst-oni-king")) {
    const defCoeff = coeff(ctx, "burst", "def-to-atk") ?? 103.68;
    const defAtkBonus = (defCoeff / 100) * totalDef;

    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + defAtkBonus;
    res.notes.push(`Raging Oni King: +${fmt(defAtkBonus)} ATK (${defCoeff.toFixed(1)}% of DEF)`);

    // Override element on all Normal, Charged, and Plunging Attack hits to Geo
    const normalHits = hitKeysOf(config, "normal");
    for (const key of normalHits) {
      addMods(res.perHit, key, { element: "Geo" });
    }
  }

  // A4 Bloodline of the Crimson Oni: Arataki Kesagiri slash DMG increased by 35% of DEF
  const kesagiriFlatDmg = 0.35 * totalDef;
  addMods(res.perHit, "kesagiri-combo", { flatDmgBonus: kesagiriFlatDmg });
  addMods(res.perHit, "kesagiri-final", { flatDmgBonus: kesagiriFlatDmg });
  res.notes.push(`A4 Bloodline of the Crimson Oni: +${fmt(kesagiriFlatDmg)} Flat DMG to Arataki Kesagiri (35% DEF)`);

  // C6 Arataki Itto, Present!: +70% CRIT DMG to Arataki Kesagiri Charged Attacks
  if (cons >= 6) {
    addMods(res.perHit, "kesagiri-combo", { critDmgBonusPct: 70 });
    addMods(res.perHit, "kesagiri-final", { critDmgBonusPct: 70 });
    res.notes.push("C6 Arataki Itto, Present!: +70% CRIT DMG to Arataki Kesagiri");
  }

  // A1 Arataki Ichiban note
  if (on("a1-kesagiri-spd")) {
    res.notes.push("A1 Arataki Ichiban: Consecutive Kesagiri slashes gain +10% ATK SPD per slash (max +30%)");
  }

  return res;
}
