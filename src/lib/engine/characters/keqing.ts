import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt, hitKeysOf } from "../mechanics-utils";

export function resolveKeqing(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // A1 Thundering Penance: Electro Infusion for 5s after recasting Skill
  if (on("a1-electro-infusion")) {
    const normalHits = hitKeysOf(config, "normal");
    for (const key of normalHits) {
      addMods(res.perHit, key, { element: "Electro" });
    }
    res.notes.push("Thundering Penance: Electro Infusion on Normal, Charged, and Plunging Attacks");
  }

  // A4 Aristocratic Dignity: +15% CRIT Rate & +15% ER for 8s after Burst
  if (on("a4-crit-er-buff")) {
    res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + 15;
    res.notes.push("Aristocratic Dignity: +15% CRIT Rate & +15% ER for 8s after Burst");
  }

  // C4 Attunement: +25% ATK for 10s after Electro reaction
  if (cons >= 4 && on("c4-atk-buff")) {
    const baseAtk = ctx.baseAtk ?? 323;
    const c4AtkBonus = 0.25 * baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + c4AtkBonus;
    res.notes.push(`C4 Attunement: +25% Base ATK (+${fmt(c4AtkBonus)} ATK) for 10s`);
  }

  // C6 Tenacious Star: +6% Electro DMG Bonus per stack (max 4 stacks = +24%)
  const c6Stacks = Math.max(0, Math.min(val("c6-electro-stacks"), 4));
  if (cons >= 6 && c6Stacks > 0) {
    const c6ElectroBonus = 6 * c6Stacks;
    res.statDeltas.electroDmgBonus = (res.statDeltas.electroDmgBonus ?? 0) + c6ElectroBonus;
    res.notes.push(`C6 Tenacious Star: +${c6ElectroBonus}% Electro DMG Bonus (${c6Stacks} stack${c6Stacks === 1 ? "" : "s"})`);
  }

  // C1 Thundering Might note
  if (cons >= 1) {
    res.notes.push("C1 Thundering Might: 50% ATK AoE Electro DMG at start point & terminus of Blink");
  }

  return res;
}
