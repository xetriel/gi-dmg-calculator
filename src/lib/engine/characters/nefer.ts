import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveNefer(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;
  const val = (id: string) => ctx.inputs[id] ?? 0;

  // A1/C2 EM Buff: Grant +100 EM (A1) if stacks reach 3 (constellation < 2) or +200 EM (C2) if stacks reach 5 (constellation >= 2).
  const rawStacks = val("veil-stacks");
  const maxStacks = cons >= 2 ? 5 : 3;
  const stacks = Math.min(rawStacks, maxStacks);

  if (cons >= 2 && stacks === 5) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 200;
    res.notes.push("C2: +200 Elemental Mastery (5 Veil of Falsehood stacks)");
  } else if (cons < 2 && stacks === 3) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 100;
    res.notes.push("A1: +100 Elemental Mastery (3 Veil of Falsehood stacks)");
  }

  const emEff = stats.em + (res.statDeltas.em ?? 0);

  // Dusklit Eaves (A3/Moonsign): Every point of EM increases Lunar-Bloom base damage by 0.0175%, capped at 14% (reached at 800 EM).
  const lunarBase = Math.min(0.0175 * emEff, 14);
  res.lunarBaseBonusPct = lunarBase;
  res.notes.push(
    `Dusklit Eaves: +${lunarBase.toFixed(2)}% Lunar-Bloom Base DMG (0.0175%/EM${lunarBase >= 14 ? ", capped" : ""})`
  );

  // Veil of Falsehood & C2 Multipliers:
  // Veil of Falsehood increases Phantasm Performance DMG by 8% per stack.
  // C2 multiplies Phantasm Performance DMG by 1.4.
  let baseDmgMult = 1 + 0.08 * stacks;
  if (cons >= 2) {
    baseDmgMult *= 1.4;
  }

  if (stacks > 0) {
    res.notes.push(`Veil of Falsehood: +${stacks * 8}% Phantasm Performance DMG (${stacks} stack${stacks > 1 ? "s" : ""})`);
  }
  if (cons >= 2) {
    res.notes.push("C2: Phantasm Performance deals up to 140% of original DMG");
  }

  // C6 Elevation: If C6 is unlocked and Moonsign: Ascendant Gleam is active, elevate Nefer's Lunar-Bloom DMG by 15%.
  const elevationMult = (cons >= 6 && on("ascendant-gleam")) ? 1.15 : 1.0;
  if (cons >= 6 && on("ascendant-gleam")) {
    res.notes.push("C6: Nefer's Lunar-Bloom DMG is elevated by 15% (Ascendant Gleam)");
  }

  // C4 RES Shred: Decrease Dendro RES by 20% if in Shadow Dance state and RES Shred is checked.
  if (cons >= 4 && on("shadow-dance") && on("c4-res-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 20;
    res.notes.push("C4: opponent Dendro RES decreased by 20% (during Shadow Dance)");
  }

  // Skill DMG split scaling:
  const skillEmCoeff = coeff(ctx, "skill", "skill-dmg") ?? 0;
  const skillAtkPart = stats.atk * (skillEmCoeff / 2 / 100);
  addMods(res.perHit, "skill-dmg", { flatDmgBonus: skillAtkPart });

  // Phantasm Nefer DMG split scaling:
  const phantasm1EmCoeff = coeff(ctx, "skill", "phantasm-1-nefer") ?? 0;
  const phantasm1AtkPart = stats.atk * (phantasm1EmCoeff / 2 / 100) * baseDmgMult;
  addMods(res.perHit, "phantasm-1-nefer", { baseDmgMultiplier: baseDmgMult, flatDmgBonus: phantasm1AtkPart });

  if (cons < 6) {
    const phantasm2EmCoeff = coeff(ctx, "skill", "phantasm-2-nefer") ?? 0;
    const phantasm2AtkPart = stats.atk * (phantasm2EmCoeff / 2 / 100) * baseDmgMult;
    addMods(res.perHit, "phantasm-2-nefer", { baseDmgMultiplier: baseDmgMult, flatDmgBonus: phantasm2AtkPart });
  } else {
    // C6 Converted Phantasm 2-Hit replaces the original Nefer 2-Hit
    addMods(res.perHit, "phantasm-2-nefer", { baseDmgMultiplier: 0 });
    res.notes.push("C6: Phantasm 2-Hit converted to Lunar-Bloom DMG");
  }

  // Shades' hits are direct Lunar reactions (Lunar-Bloom coefficient: 1.0)
  const direct: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct: lunarBase,
    reactionBonusPct: 0,
  };

  // C1 flat bonus: "The Base DMG for Lunar-Bloom reactions caused by Nefer's Phantasm Performance is increased by 60% of her EM. This effect is also boosted by Veil of Falsehood."
  // Since C1 flat bonus is also boosted by Veil and Elevation, we scale it.
  const c1Flat = cons >= 1 ? 0.6 * emEff * baseDmgMult * elevationMult : 0;
  if (cons >= 1) {
    res.notes.push(`C1: +${fmt(0.6 * emEff)} Base DMG to Phantasm Performance Lunar-Bloom reactions, boosted by Veil & Elevation`);
  }

  const shadesKeys = ["phantasm-1-shades", "phantasm-2-shades", "phantasm-3-shades"];
  for (const key of shadesKeys) {
    addMods(res.perHit, key, {
      directReaction: direct,
      baseDmgMultiplier: baseDmgMult * elevationMult,
      flatDmgBonus: c1Flat,
    });
  }

  // C6 Converted & Extra hits:
  if (cons >= 6) {
    addMods(res.perHit, "c6-converted", {
      directReaction: direct,
      baseDmgMultiplier: baseDmgMult * elevationMult,
      flatDmgBonus: c1Flat,
    });
    addMods(res.perHit, "c6-extra", {
      directReaction: direct,
      baseDmgMultiplier: baseDmgMult * elevationMult,
      flatDmgBonus: c1Flat,
    });
  } else {
    addMods(res.perHit, "c6-converted", { baseDmgMultiplier: 0 });
    addMods(res.perHit, "c6-extra", { baseDmgMultiplier: 0 });
  }

  // Burst DMG split scaling & stack bonus:
  const burst1EmCoeff = coeff(ctx, "burst", "burst-1-hit") ?? 0;
  const burst1AtkPart = stats.atk * (burst1EmCoeff / 2 / 100);
  addMods(res.perHit, "burst-1-hit", { flatDmgBonus: burst1AtkPart });

  const burst2EmCoeff = coeff(ctx, "burst", "burst-2-hit") ?? 0;
  const burst2AtkPart = stats.atk * (burst2EmCoeff / 2 / 100);
  addMods(res.perHit, "burst-2-hit", { flatDmgBonus: burst2AtkPart });

  const burstBonusPctPerStack = coeff(ctx, "burst", "burst-dmg-bonus") ?? 0;
  const totalBurstBonus = burstBonusPctPerStack * stacks;
  if (totalBurstBonus > 0) {
    addMods(res.perHit, "burst-1-hit", { bonusDmgPct: totalBurstBonus });
    addMods(res.perHit, "burst-2-hit", { bonusDmgPct: totalBurstBonus });
    res.notes.push(`Burst: +${totalBurstBonus}% DMG Bonus (${stacks} Veil stack${stacks > 1 ? "s" : ""} consumed × ${burstBonusPctPerStack}%)`);
  }

  return res;
}
