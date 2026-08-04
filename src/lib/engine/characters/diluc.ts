import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf, hitKeysOfCategory } from "../mechanics-utils";

export function resolveDiluc(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Pyro Infusion (Dawn Burst cast)
  if (on("pyro-infusion")) {
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Pyro" });
    }
    res.notes.push("Pyro Infusion: Normal, Charged, and Plunging Attacks deal Pyro DMG");
  }

  // A4 Blessing of Phoenix: +20% Pyro DMG Bonus during Infusion
  if (on("a4-pyro-buff")) {
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + 20;
    res.notes.push("A4 Blessing of Phoenix: +20% Pyro DMG Bonus");
  }

  // C1 Conviction: +15% DMG against opponents with HP > 50%
  if (cons >= 1 && on("c1-high-hp-buff")) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 15;
    res.notes.push("C1 Conviction: +15% DMG Bonus (Opponent HP > 50%)");
  }

  // C2 Searing Ember: +10% ATK per stack (max 3 stacks = +30% Base ATK)
  const c2Stacks = Math.max(0, Math.min(val("c2-stacks"), 3));
  if (cons >= 2 && c2Stacks > 0) {
    const baseAtkEff = ctx.baseAtk ?? 335;
    const atkBonus = (c2Stacks * 0.10) * baseAtkEff;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`C2 Searing Ember: +${Math.round(atkBonus)} ATK (+${c2Stacks * 10}% Base ATK, ${c2Stacks} stacks)`);
  }

  // C4 Flowing Flame: +40% DMG to next Searing Onslaught hit in combo
  if (cons >= 4 && on("c4-rhythm-buff")) {
    addMods(res.perHit, "2-hit", { bonusDmgPct: 40 });
    addMods(res.perHit, "3-hit", { bonusDmgPct: 40 });
    res.notes.push("C4 Flowing Flame: +40% DMG Bonus to 2nd & 3rd Searing Onslaught hits");
  }

  // C6 Flaming Sword, Nemesis of the Dark: Next 2 Normal Attacks deal +30% DMG
  if (cons >= 6 && on("c6-post-skill-buff")) {
    const naHitKeys = hitKeysOfCategory(config, "normal", "normal");
    for (const key of naHitKeys) {
      addMods(res.perHit, key, { bonusDmgPct: 30 });
    }
    res.notes.push("C6 Flaming Sword: +30% Normal Attack DMG Bonus for next 2 hits");
  }

  return res;
}
