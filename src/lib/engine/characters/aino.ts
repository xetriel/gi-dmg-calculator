import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveAino(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;

  // 1. C1: The Theory of Ash—Field Equilibrium (+80 EM to Aino & party)
  if (cons >= 1 && on("c1-ash-field-em")) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 80;
    res.notes.push("C1 Theory of Ash—Field Equilibrium: +80 EM");
  }

  // Calculate effective EM including stat deltas for EM-to-DMG scaling
  const effectiveEm = stats.em + (res.statDeltas.em ?? 0);

  // 2. A4: Structured Power Booster (Burst DMG increased by 50% of EM as flat additive base DMG)
  const a4FlatDmg = 0.50 * effectiveEm;
  addMods(res.perHit, "water-ball", { flatDmgBonus: a4FlatDmg });
  addMods(res.perHit, "water-ball-enhanced", { flatDmgBonus: a4FlatDmg });
  res.notes.push(`A4 Structured Power Booster: +${fmt(a4FlatDmg)} flat DMG to Burst (50% EM)`);

  // 3. C2: The Principle of Transference in Gear Differentials
  // Active when Aino is off-field during Burst; deals 25% ATK + 100% EM
  if (cons >= 2 && on("off-field-state")) {
    const c2FlatDmg = 1.00 * effectiveEm;
    addMods(res.perHit, "c2-water-ball", {
      baseDmgMultiplier: 1.0,
      flatDmgBonus: c2FlatDmg,
    });
    res.notes.push(
      `C2 Principle of Transference: Enabled (+${fmt(c2FlatDmg)} flat DMG from 100% EM, CD 5s)`
    );
  } else {
    addMods(res.perHit, "c2-water-ball", { baseDmgMultiplier: 0 });
  }

  // 4. C6: The Burden of Creative Genius
  // For 15s after Burst: +15% Reaction DMG (+35% with Ascendant Gleam)
  if (cons >= 6 && on("c6-creative-genius")) {
    const isAscendant = on("moonsign-ascendant-gleam");
    const reactionBonus = isAscendant ? 35 : 15;
    res.statDeltas.electroChargedDmgBonus = (res.statDeltas.electroChargedDmgBonus ?? 0) + reactionBonus;
    res.statDeltas.bloomDmgBonus = (res.statDeltas.bloomDmgBonus ?? 0) + reactionBonus;
    res.statDeltas.lunarChargedDmgBonus = (res.statDeltas.lunarChargedDmgBonus ?? 0) + reactionBonus;
    res.statDeltas.lunarBloomDmgBonus = (res.statDeltas.lunarBloomDmgBonus ?? 0) + reactionBonus;
    res.statDeltas.lunarCrystallizeDmgBonus = (res.statDeltas.lunarCrystallizeDmgBonus ?? 0) + reactionBonus;
    res.notes.push(
      `C6 Creative Genius: +${reactionBonus}% Reaction DMG (Electro-Charged, Bloom, Lunar-Charged, Lunar-Bloom, Lunar-Crystallize)${
        isAscendant ? " [Ascendant Gleam]" : ""
      }`
    );
  }

  // 5. A1 / Moonsign: Ascendant Gleam note
  if (on("moonsign-ascendant-gleam")) {
    res.notes.push(
      "Moonsign: Ascendant Gleam: Burst fires water balls every 0.75s (up to 20 shots) across larger AoE"
    );
  }

  // 6. Normal Attack Physical DMG tagging
  const normalKeys = [
    "1-hit",
    "2-hit",
    "3-hit-a",
    "3-hit-b",
    "charged-loop",
    "charged-final",
    "plunge",
    "low-plunge",
    "high-plunge",
  ];
  for (const key of normalKeys) {
    addMods(res.perHit, key, { element: "Physical" });
  }

  return res;
}
