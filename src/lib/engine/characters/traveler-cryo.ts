import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, hitKeysOf, fmt } from "../mechanics-utils";

export function resolveTravelerCryo(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  const totalAtk = stats.atk;

  // A4 Lucent Ice: +8% of ATK as Elemental Mastery (capped at 160 EM)
  const a4Em = Math.min(0.08 * totalAtk, 160);
  if (a4Em > 0) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + a4Em;
    res.notes.push(`A4 Lucent Ice: +${fmt(a4Em)} EM (8% of ATK, cap 160)`);
  }

  // C2 Frostfall Reverberation: +60 EM (boosted to +120 if Stellar Glimmer active)
  if (cons >= 2) {
    const c2Em = on("c2-stellar-em") ? 120 : 60;
    res.statDeltas.em = (res.statDeltas.em ?? 0) + c2Em;
    res.notes.push(`C2 Frostfall Reverberation: +${c2Em} EM${on("c2-stellar-em") ? " (Stellar Glimmer active)" : ""}`);
  }

  // A1 Ever-Keen Frost: Frostpierce Star active → NA/CA/Plunge → Cryo infusion + 80% ATK flat DMG
  if (on("frostpierce-active")) {
    const naKeys = hitKeysOf(config, "normal");
    const flatDmg = 0.80 * totalAtk;
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Cryo", flatDmgBonus: flatDmg });
    }
    res.notes.push(`A1 Ever-Keen Frost: NA/CA/Plunge → Cryo DMG + ${fmt(flatDmg)} Flat DMG (80% ATK)`);
  }

  // Frostglow Stacks (0–8): +4.96% DMG per stack to burst javelin hits
  const stacks = Math.min(val("frostglow-stacks"), 8);
  if (stacks > 0) {
    const bonusPct = stacks * 4.96;
    addMods(res.perHit, "burst-javelin-dmg", { bonusDmgPct: bonusPct });
    res.notes.push(`Frostglow Stacks (${stacks}/8): +${bonusPct.toFixed(2)}% Burst Javelin DMG`);
  }

  // Stellar Jubilee — Illusory Frostmirror: Base Stellar DMG Bonus +0.7% per 100 ATK (cap 14%)
  const baseDmgBonusPct = Math.min(0.7 * (totalAtk / 100), 14);
  // C6 Brumal Grimfrost: +5% per consumed Frostglow stack (max +40%) as Stellar Glimmer reaction DMG
  const c6ReactionBonusPct = cons >= 6 ? Math.min(stacks * 5, 40) : 0;

  const direct: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct,
    reactionBonusPct: c6ReactionBonusPct,
  };

  const stellarKeys = ["stellar-conduct-javelin-dmg", "stellar-swirl-javelin-dmg"];
  for (const key of stellarKeys) {
    addMods(res.perHit, key, { directReaction: direct });
  }
  res.notes.push(
    `Illusory Frostmirror: +${baseDmgBonusPct.toFixed(1)}% Base Stellar DMG (0.7%/100 ATK${baseDmgBonusPct >= 14 ? ", capped" : ""})`
  );
  if (cons >= 6 && c6ReactionBonusPct > 0) {
    res.notes.push(`C6 Brumal Grimfrost: +${c6ReactionBonusPct}% Stellar Glimmer Reaction DMG (${stacks} stack${stacks === 1 ? "" : "s"} × 5%)`);
  }

  // C1 Somber Freeze (Informational note)
  if (cons >= 1) {
    res.notes.push("C1 Somber Freeze: Regenerates 5 Energy on Stellar Glimmer DMG (0.5s CD)");
  }

  return res;
}
