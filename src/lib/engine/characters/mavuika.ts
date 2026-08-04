import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

const FLAMESTRIDER_NA_KEYS = [
  "flamestrider-1-hit", "flamestrider-2-hit", "flamestrider-3-hit",
  "flamestrider-4-hit", "flamestrider-5-hit",
];
const FLAMESTRIDER_CA_KEYS = [
  "flamestrider-charged-cyclic", "flamestrider-charged-final",
];

export function resolveMavuika(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  const fightingSpirit = val("fighting-spirit"); // 0–200

  // ── A1 Passive: Gift of Flaming Flowers ──────────────────────────────
  // Nearby party member triggers Nightsoul Burst → ATK +30% for 10s.
  if (on("a1-nightsoul-burst")) {
    const atkBonus = 0.30 * ctx.baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`A1 Gift of Flaming Flowers: +30% ATK (+${fmt(atkBonus)} ATK)`);
  }

  // ── C1: The Night-Lord's Explication ──────────────────────────────────
  // +40% ATK for 8s after gaining Fighting Spirit.
  if (cons >= 1 && on("c1-atk-buff")) {
    const atkBonus = 0.40 * ctx.baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`C1 The Night-Lord's Explication: +40% ATK (+${fmt(atkBonus)} ATK)`);
  }

  // ── C2: The Ashen Price ───────────────────────────────────────────────
  // In Nightsoul's Blessing: Base ATK +200, Ring DEF −20%, Flamestrider
  // NA/CA/Sunfell flat DMG.
  if (cons >= 2) {
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + 200;
    res.notes.push("C2 The Ashen Price: +200 ATK (Base ATK increase)");

    // Ring of Searing Radiance: nearby enemies DEF −20%
    if (on("c2-def-shred")) {
      res.statDeltas.defReduction = (res.statDeltas.defReduction ?? 0) + 20;
      res.notes.push("C2 Ring of Searing Radiance: −20% DEF");
    }

    // Flamestrider flat DMG bonuses (only when in Flamestrider or Burst stance)
    if (on("flamestrider-active") || on("burst-active")) {
      const atkEff = stats.atk + (res.statDeltas.atk ?? 0);

      // NA +60% ATK
      const naFlat = 0.60 * atkEff;
      for (const key of FLAMESTRIDER_NA_KEYS) {
        addMods(res.perHit, key, { flatDmgBonus: naFlat });
      }

      // CA +90% ATK
      const caFlat = 0.90 * atkEff;
      for (const key of FLAMESTRIDER_CA_KEYS) {
        addMods(res.perHit, key, { flatDmgBonus: caFlat });
      }

      // Sunfell Slice +120% ATK
      const sunfellFlat = 1.20 * atkEff;
      addMods(res.perHit, "sunfell-slice", { flatDmgBonus: sunfellFlat });

      res.notes.push(
        `C2 Flamestrider: NA +${fmt(naFlat)}, CA +${fmt(caFlat)}, Sunfell +${fmt(sunfellFlat)} flat DMG`
      );
    }
  }

  // ── A4 Passive: Kiongozi ──────────────────────────────────────────────
  // After Burst, each point of Fighting Spirit increases DMG by 0.2% (max 40%).
  // C4: no decay, gains additional +10% DMG Bonus.
  if (on("a4-kiongozi") && fightingSpirit > 0) {
    let dmgBonus = Math.min(fightingSpirit * 0.2, 40);
    if (cons >= 4) {
      dmgBonus += 10;
    }
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + dmgBonus;
    res.notes.push(
      `A4 Kiongozi: +${dmgBonus}% DMG Bonus (${fightingSpirit} FS × 0.2%${cons >= 4 ? " + C4 10%, no decay" : ""})`
    );
  }

  // ── Fighting Spirit flat DMG bonuses (Burst active) ───────────────────
  // Per point of Fighting Spirit: Sunfell +1.6% ATK, NA +0.26% ATK, CA +0.52% ATK.
  // These scale with Burst talent level via coeff().
  if (on("burst-active") && fightingSpirit > 0) {
    const sunfellPer = coeff(ctx, "burst", "fs-sunfell-bonus") ?? 1.6;
    const naPer = coeff(ctx, "burst", "fs-na-bonus") ?? 0.26;
    const caPer = coeff(ctx, "burst", "fs-ca-bonus") ?? 0.52;

    const atkEff = stats.atk + (res.statDeltas.atk ?? 0);

    // Sunfell Slice flat DMG
    const sunfellFlat = fightingSpirit * (sunfellPer / 100) * atkEff;
    addMods(res.perHit, "sunfell-slice", { flatDmgBonus: sunfellFlat });

    // Flamestrider NA flat DMG
    const naFlat = fightingSpirit * (naPer / 100) * atkEff;
    for (const key of FLAMESTRIDER_NA_KEYS) {
      addMods(res.perHit, key, { flatDmgBonus: naFlat });
    }

    // Flamestrider CA flat DMG
    const caFlat = fightingSpirit * (caPer / 100) * atkEff;
    for (const key of FLAMESTRIDER_CA_KEYS) {
      addMods(res.perHit, key, { flatDmgBonus: caFlat });
    }

    res.notes.push(
      `Fighting Spirit (${fightingSpirit}): Sunfell +${fmt(sunfellFlat)}, NA +${fmt(naFlat)}, CA +${fmt(caFlat)} flat DMG`
    );
  }

  // ── C6: "Humanity's Name" Unfettered (Informational) ─────────────────
  if (cons >= 6) {
    res.notes.push(
      "C6 \"Humanity's Name\" Unfettered: Ring hits → Flamestrider crash (200% ATK Pyro); Flamestrider → Scorching Ring (DEF −20%, 500% ATK Pyro every 3s)"
    );
  }

  return res;
}
