import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { stellarBRC, stellarEmBonus, resMultiplier } from "../damage";

export function resolveSandrone(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // Stellar-Conduct params shared by her three stellar hits.
  // Light of Rationalisme: Base Stellar-Conduct DMG +0.7% per 100 ATK, cap 14%.
  const baseDmgBonusPct = Math.min(0.7 * (stats.atk / 100), 14);
  // C1: all party members deal 30% increased Stellar-Conduct DMG (Reaction Bonus slot).
  const reactionBonusPct = cons >= 1 ? 30 : 0;
  const fieldOn = on("polestar-field");
  const hits = Math.min(val("polestar-hits"), 10);
  const brc = fieldOn ? stellarBRC(hits) : 1;
  const direct: DirectReactionParams = { coefficient: brc, baseDmgBonusPct, reactionBonusPct };

  const stellarKeys = ["condensed-beam-stellar", "prism-shot-stellar", "convective-ray-stellar"];
  for (const key of stellarKeys) addMods(res.perHit, key, { directReaction: direct });
  res.notes.push(
    `Light of Rationalisme: +${baseDmgBonusPct.toFixed(1)}% Base Stellar-Conduct DMG (0.7%/100 ATK${baseDmgBonusPct >= 14 ? ", capped" : ""})`
  );
  if (fieldOn) {
    // Polestar Field: Cryo/Electro DMG Bonus +20% (0 hits) or +(28+n)% (n≥1).
    // Only non-stellar hits benefit — the stellar branch ignores DMG Bonus%.
    const fieldBonus = hits >= 1 ? 28 + hits : 20;
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + fieldBonus;
    res.notes.push(
      `Polestar Field: BRC ×${brc.toFixed(2)} on Stellar hits (${hits} hit${hits === 1 ? "" : "s"}); +${fieldBonus}% Cryo DMG Bonus on non-Stellar hits`
    );
  }
  if (cons >= 1) res.notes.push("C1: +30% Stellar-Conduct DMG (Reaction Bonus)");

  // A1 Eternal Speculation Engine: Decoding Power > 50 → 2nd Prism Shot ×4.
  if (on("decoding-over-50")) {
    addMods(res.perHit, "prism-shot-stellar", { baseDmgMultiplier: 4 });
    res.notes.push("A1: 2nd Prism Shot deals 400% of original DMG (Decoding Power > 50)");
  }
  // A1: Burst in Radiance clears Refined Tactics stacks → Ray deals 100% + 10%/stack.
  const tactics = Math.min(val("refined-tactics"), 10);
  if (tactics > 0) {
    addMods(res.perHit, "convective-ray-stellar", { baseDmgMultiplier: 1 + 0.1 * tactics });
    res.notes.push(`A1: Convective Ray ×${(1 + 0.1 * tactics).toFixed(1)} (${tactics} Refined Tactics stack${tactics > 1 ? "s" : ""} cleared)`);
  }
  // C2: condensed beams +40% CRIT DMG, +20% per beam fired this Decoding (max 3).
  if (cons >= 2) {
    const beamStacks = Math.min(val("c2-beam-stacks"), 3);
    const critDmg = 40 + 20 * beamStacks;
    addMods(res.perHit, "condensed-beam-stellar", { critDmgBonusPct: critDmg });
    res.notes.push(`C2: +${critDmg}% CRIT DMG on Condensed Beams (${beamStacks} beam stack${beamStacks === 1 ? "" : "s"})`);
  }
  // C4 Extra Cannon / C6 Cluster Beam: fixed-% stellar side hits, shown as notes.
  const stellarNonCrit = (multPct: number) =>
    brc * (multPct / 100) * stats.atk * (1 + baseDmgBonusPct / 100) *
    (1 + stellarEmBonus(stats.em) + reactionBonusPct / 100) *
    resMultiplier(stats.enemyRes);
  if (cons >= 4) {
    res.notes.push(`C4 Extra Cannon: ${fmt(stellarNonCrit(125))} Stellar-Conduct DMG per proc (125% ATK, every 4s)`);
  }
  if (cons >= 6) {
    res.notes.push(`C6 Cluster Beam: 4 × ${fmt(stellarNonCrit(80))} Stellar-Conduct DMG (80% ATK each)`);
  }

  return res;
}
