import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveSkirk(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // Mutual Weapons Mentorship (Utility Passive)
  if (on("mutual-weapons-mentorship")) {
    res.notes.push("Mutual Weapons Mentorship: +1 Elemental Skill Level (active)");
  }

  // Return to Oblivion (Death's Crossing stacks)
  const crossingStacks = val("deaths-crossing-stacks");
  const naMult = [1.0, 1.10, 1.20, 1.70][crossingStacks] ?? 1.0;
  const burstMult = [1.0, 1.05, 1.15, 1.60][crossingStacks] ?? 1.0;

  const sfHits = ["sf-1-hit", "sf-2-hit", "sf-3-hit-a", "sf-3-hit-b", "sf-4-hit-a", "sf-4-hit-b", "sf-5-hit"];
  const burstHits = ["slash-dmg", "final-dmg"];

  for (const key of sfHits) {
    addMods(res.perHit, key, { baseDmgMultiplier: naMult });
  }
  for (const key of burstHits) {
    addMods(res.perHit, key, { baseDmgMultiplier: burstMult });
  }

  res.notes.push(
    `Return to Oblivion: ×${naMult} to Seven-Phase Flash NA, ×${burstMult} to Burst (${crossingStacks} Death's Crossing stacks)`
  );

  // C4 Fractured Flow
  if (cons >= 4) {
    const c4AtkBonusPct = [0, 10, 20, 40][crossingStacks] ?? 0;
    if (c4AtkBonusPct > 0) {
      const c4Bonus = (c4AtkBonusPct / 100) * ctx.baseAtk;
      res.statDeltas.atk = (res.statDeltas.atk ?? 0) + c4Bonus;
      res.notes.push(`C4 Fractured Flow: +${c4AtkBonusPct}% ATK (+${fmt(c4Bonus)} ATK)`);
    }
  }

  // Serpent's Subtlety (Burst Havoc: Ruin bonus)
  const subtletyCap = cons >= 2 ? 22 : 12;
  const subtletyBonus = Math.min(val("subtlety-bonus"), subtletyCap);
  if (subtletyBonus > 0) {
    const flatDmg = (34.782 / 100) * subtletyBonus * stats.atk;
    for (const key of burstHits) {
      addMods(res.perHit, key, { flatDmgBonus: flatDmg });
    }
    res.notes.push(
      `Serpent's Subtlety: +${fmt(flatDmg)} flat DMG to Burst (${subtletyBonus} points over 50${subtletyBonus < val("subtlety-bonus") ? " [capped]" : ""}${cons >= 2 ? ", Into the Abyss C2" : ""})`
    );
  }

  // All Shall Wither (Havoc: Extinction buff)
  if (on("all-shall-wither")) {
    const rifts = val("wither-rifts");
    const riftBonus = [0, 8, 12, 16, 20][rifts] ?? 0;
    const totalWitherBonus = 40 + riftBonus;
    res.statDeltas.normalDmgBonus = (res.statDeltas.normalDmgBonus ?? 0) + totalWitherBonus;
    res.notes.push(
      `All Shall Wither: +${totalWitherBonus}% Normal ATK DMG Bonus (${rifts} Void Rifts absorbed)`
    );
  }

  // C2 Into the Abyss ATK buff
  if (cons >= 2 && on("c2-burst-atk-buff")) {
    const c2Bonus = 0.70 * ctx.baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + c2Bonus;
    res.notes.push(`C2 Into the Abyss: +70% ATK (+${fmt(c2Bonus)} ATK)`);
  }

  // C1 Far to Fall Crystal Blade
  if (cons >= 1) {
    res.notes.push("C1 Far to Fall: Crystal Blade enabled (deals 500% ATK Cryo DMG as Charged Attack DMG)");
  } else {
    addMods(res.perHit, "c1-blade", { baseDmgMultiplier: 0 });
    res.notes.push("C1 Far to Fall: Crystal Blade disabled (requires C1)");
  }

  // C6 To the Source Sever stacks
  const severStacks = val("c6-sever-stacks");
  if (cons >= 6) {
    addMods(res.perHit, "sever-dmg", { baseDmgMultiplier: severStacks });
    res.notes.push(`C6 To the Source: Burst consumes Sever stacks to deal 750% ATK per stack (${severStacks} stacks)`);
  } else {
    addMods(res.perHit, "sever-dmg", { baseDmgMultiplier: 0 });
    res.notes.push("C6 To the Source: Sever DMG disabled (requires C6)");
  }

  return res;
}
