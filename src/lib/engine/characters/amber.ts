import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveAmber(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;
  const baseAtk = ctx.baseAtk ?? 223;

  // 1. A1: Every Arrow Finds Its Target (+10% CRIT Rate on Fiery Rain)
  addMods(res.perHit, "burst-wave-dmg", { critRateBonusPct: 10 });
  addMods(res.perHit, "burst-total-dmg", { critRateBonusPct: 10 });
  res.notes.push("A1 Every Arrow Finds Its Target: +10% CRIT Rate & +30% AoE on Fiery Rain");

  // 2. A4: Precise Shot (+15% ATK on Weak Spot Hit)
  if (on("a4-precise-shot")) {
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + 0.15 * baseAtk;
    res.statDeltas.atkPercent = (res.statDeltas.atkPercent ?? 0) + 15;
    res.notes.push("A4 Precise Shot: +15% ATK (Aimed Shot weak spot hit)");
  }

  // 3. Weak Spot Hit (Guaranteed CRIT on Aimed Shots)
  if (on("weakspot-auto-crit")) {
    const aimedKeys = ["aimed", "aimed-c1", "fully-charged-aimed", "fully-charged-aimed-c1"];
    for (const key of aimedKeys) {
      addMods(res.perHit, key, { critRateBonusPct: 100 });
    }
    res.notes.push("Weak Spot Hit: Guaranteed CRIT (+100% CRIT Rate) on Aimed Shots");
  }

  // 4. C1: One Arrow to Rule Them All (Second Arrow deals 20% DMG)
  if (cons >= 1) {
    addMods(res.perHit, "aimed-c1", { baseDmgMultiplier: 1.0 });
    addMods(res.perHit, "fully-charged-aimed-c1", { baseDmgMultiplier: 1.0 });
    res.notes.push("C1 One Arrow to Rule Them All: Fires second arrow dealing 20% DMG on Aimed Shots");
  } else {
    addMods(res.perHit, "aimed-c1", { baseDmgMultiplier: 0 });
    addMods(res.perHit, "fully-charged-aimed-c1", { baseDmgMultiplier: 0 });
  }

  // 5. C2: Bunny Triggered (+200% DMG bonus on manual detonation)
  if (cons >= 2) {
    addMods(res.perHit, "manual-detonation-c2", {
      baseDmgMultiplier: 1.0,
      bonusDmgPct: 200,
    });
    if (on("c2-manual-detonation")) {
      addMods(res.perHit, "explosion-dmg", { bonusDmgPct: 200 });
      res.notes.push("C2 Bunny Triggered: +200% DMG Bonus applied to Baron Bunny detonation");
    }
  } else {
    addMods(res.perHit, "manual-detonation-c2", { baseDmgMultiplier: 0 });
  }

  // 6. C6: Wildfire (+15% ATK & +15% Movement SPD)
  if (cons >= 6 && on("c6-wildfire")) {
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + 0.15 * baseAtk;
    res.statDeltas.atkPercent = (res.statDeltas.atkPercent ?? 0) + 15;
    res.statDeltas.movementSpd = (res.statDeltas.movementSpd ?? 0) + 15;
    res.notes.push("C6 Wildfire: +15% ATK & +15% Movement SPD to party after Fiery Rain");
  }

  return res;
}
