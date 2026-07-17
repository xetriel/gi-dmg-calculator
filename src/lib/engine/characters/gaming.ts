import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveGaming(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A4 Passive: Air of Prosperity
  if (on("gaming-high-hp")) {
    // Charmed Cloudstrider Plunging Attack damage is increased by 20%
    addMods(res.perHit, "charmed-cloudstrider-dmg", { bonusDmgPct: 20 });
    res.notes.push("A4 Air of Prosperity: +20% Plunging Attack: Charmed Cloudstrider DMG Bonus (HP ≥ 60%)");
  }

  // C2: Plumage of Plummet
  if (on("c2-overflow-heal")) {
    const atkBonus = 0.20 * ctx.baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`C2 Plumage of Plummet: +20% ATK (+${fmt(atkBonus)} ATK, overflow healed)`);
  }

  // C6: To Tame All Beasts
  if (cons >= 6) {
    addMods(res.perHit, "charmed-cloudstrider-dmg", { critRateBonusPct: 20, critDmgBonusPct: 40 });
    res.notes.push("C6 To Tame All Beasts: Plunging Attack: Charmed Cloudstrider +20% CRIT Rate / +40% CRIT DMG");
  }

  return res;
}
