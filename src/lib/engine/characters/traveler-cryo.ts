import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, hitKeysOf, coeff, fmt } from "../mechanics-utils";

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
  // DOES NOT apply to Charged Attack: Freezing Ice (Foreign Permafrost states this explicitly)
  const exemptFromA1 = new Set(["freezing-ice", "freezing-ice-stellar"]);
  if (on("frostpierce-active")) {
    const naKeys = hitKeysOf(config, "normal");
    const flatDmg = 0.80 * totalAtk;
    for (const key of naKeys) {
      if (exemptFromA1.has(key)) {
        // Cryo element infusion only, no flat DMG bonus
        addMods(res.perHit, key, { element: "Cryo" });
      } else {
        addMods(res.perHit, key, { element: "Cryo", flatDmgBonus: flatDmg });
      }
    }
    res.notes.push(`A1 Ever-Keen Frost: NA/CA/Plunge → Cryo DMG + ${fmt(flatDmg)} Flat DMG (80% ATK, excl. Freezing Ice)`);
  }

  // Foreign Permafrost: At 3 Icepoint stacks, Charged Attack: Freezing Ice gains +140% ATK flat DMG
  const icepointStacks = val("icepoint-stacks");
  if (icepointStacks >= 3) {
    const freezingFlatDmg = 1.40 * totalAtk;
    addMods(res.perHit, "freezing-ice", { flatDmgBonus: freezingFlatDmg });
    addMods(res.perHit, "freezing-ice-stellar", { flatDmgBonus: freezingFlatDmg });
    res.notes.push(`Foreign Permafrost: Freezing Ice +${fmt(freezingFlatDmg)} Flat DMG (140% ATK)`);
  }

  // Frostglow Stacks (0–8): per-stack DMG bonus to burst javelin hits
  // The per-stack bonus scales with burst talent level (looked up from scaling data)
  const stacks = Math.min(val("frostglow-stacks"), 8);
  if (stacks > 0) {
    // Look up level-dependent per-stack bonus from scaling data; fall back to Lv10 defaults
    const cryoPerStack = coeff(ctx, "burst", "frostglow-bonus") ?? 4.96;
    const stellarConductPerStack = coeff(ctx, "burst", "stellar-conduct-frostglow-bonus") ?? 3.31;
    const stellarSwirlPerStack = cryoPerStack; // Stellar Swirl uses same values as Cryo per wiki

    const cryoBonusPct = stacks * cryoPerStack;
    const stellarConductBonusPct = stacks * stellarConductPerStack;
    const stellarSwirlBonusPct = stacks * stellarSwirlPerStack;

    // Apply to Cryo burst keys
    for (const key of ["burst-javelin-dmg", "burst-javelin-3-hit", "burst-javelin-5-hit"]) {
      addMods(res.perHit, key, { bonusDmgPct: cryoBonusPct });
    }
    // Apply to Stellar-Conduct burst keys
    for (const key of ["stellar-conduct-javelin-dmg", "stellar-conduct-javelin-3-hit", "stellar-conduct-javelin-5-hit"]) {
      addMods(res.perHit, key, { bonusDmgPct: stellarConductBonusPct });
    }
    // Apply to Stellar Swirl burst keys
    for (const key of ["stellar-swirl-javelin-dmg", "stellar-swirl-javelin-3-hit", "stellar-swirl-javelin-5-hit"]) {
      addMods(res.perHit, key, { bonusDmgPct: stellarSwirlBonusPct });
    }

    res.notes.push(
      `Frostglow Stacks (${stacks}/8): +${cryoBonusPct.toFixed(2)}% Cryo / +${stellarConductBonusPct.toFixed(2)}% Stellar-Conduct / +${stellarSwirlBonusPct.toFixed(2)}% Stellar Swirl Burst Javelin DMG`
    );
  }

  // Stellar Jubilee — Illusory Frostmirror: Base Stellar DMG Bonus +0.35% per 100 ATK (cap 7%)
  const baseDmgBonusPct = Math.min(0.35 * (totalAtk / 100), 7);
  // C6 Brumal Grimfrost: +5% per consumed Frostglow stack (max +40%) as Stellar Glimmer reaction DMG
  const c6ReactionBonusPct = cons >= 6 ? Math.min(stacks * 5, 40) : 0;

  const direct: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct,
    reactionBonusPct: c6ReactionBonusPct,
  };

  // Apply direct reaction to all stellar burst hit keys
  const stellarBurstKeys = [
    "stellar-conduct-javelin-dmg", "stellar-conduct-javelin-3-hit", "stellar-conduct-javelin-5-hit",
    "stellar-swirl-javelin-dmg", "stellar-swirl-javelin-3-hit", "stellar-swirl-javelin-5-hit",
  ];
  for (const key of stellarBurstKeys) {
    addMods(res.perHit, key, { directReaction: direct });
  }

  // Also apply direct reaction to freezing-ice-stellar (Stellar Glimmer Charged Attack)
  addMods(res.perHit, "freezing-ice-stellar", { directReaction: { ...direct } });

  res.notes.push(
    `Illusory Frostmirror: +${baseDmgBonusPct.toFixed(1)}% Base Stellar DMG (0.35%/100 ATK${baseDmgBonusPct >= 7 ? ", capped" : ""})`
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
