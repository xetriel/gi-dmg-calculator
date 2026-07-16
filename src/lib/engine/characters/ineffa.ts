import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { LUNAR_DIRECT_MULTIPLIER } from "../lunar";

export function resolveIneffa(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;

  // 1. Assemblage Hub (Moonsign Benediction): Every 100 ATK increases Lunar-Charged Base DMG by 0.7%, max 14%
  const lunarBase = Math.min(0.7 * (stats.atk / 100), 14);
  res.lunarBaseBonusPct = lunarBase;
  res.notes.push(
    `Assemblage Hub: +${lunarBase.toFixed(1)}% Lunar-Charged Base DMG (0.7%/100 ATK${lunarBase >= 14 ? ", capped" : ""})`
  );

  // 2. A4: Parameter Permutation Protocol: Increases EM by 6% of Ineffa's ATK
  if (on("a4-burst-em-share")) {
    const emDelta = 0.06 * stats.atk;
    res.statDeltas.em = (res.statDeltas.em ?? 0) + emDelta;
    res.notes.push(`A4 Parameter Permutation: +${fmt(emDelta)} EM (6% ATK)`);
  }

  // 3. C1 Carrier Flow Composite: Increases Lunar-Charged DMG by 2.5% per 100 ATK (max 50%)
  let reactionBonusPct = 0;
  if (cons >= 1 && on("c1-carrier-flow")) {
    const c1Bonus = Math.min(2.5 * (stats.atk / 100), 50);
    reactionBonusPct += c1Bonus;
    res.notes.push(
      `C1 Carrier Flow: +${c1Bonus.toFixed(1)}% Lunar-Charged DMG Bonus (2.5%/100 ATK${c1Bonus >= 50 ? ", capped" : ""})`
    );
  }

  // 4. Shield flat absorption portion from Skill level
  const skillLvl = ctx.talentLevels["skill"] || 1;
  const shieldFlatTable = [0, 1387, 1525, 1676, 1837, 2011, 2196, 2392, 2600, 2820, 3051, 3294, 3548, 3814];
  const shieldFlat = shieldFlatTable[skillLvl] ?? 1387;
  addMods(res.perHit, "shield", { flatDmgBonus: shieldFlat });

  // 5. C2 Punishment Edict DMG (300% ATK, considered Lunar-Charged DMG)
  const c2Active = cons >= 2;
  addMods(res.perHit, "c2-punishment-edict", {
    baseDmgMultiplier: c2Active ? 1.0 : 0,
  });

  // 6. C6 Dawning Morn DMG (135% ATK, considered Lunar-Charged DMG, when Carrier Flow is active)
  const c6Active = cons >= 6 && on("c1-carrier-flow");
  addMods(res.perHit, "c6-dawning-morn", {
    baseDmgMultiplier: c6Active ? 1.0 : 0,
  });

  // 7. Lunar reaction parameters for direct reaction hits
  const direct: DirectReactionParams = {
    coefficient: LUNAR_DIRECT_MULTIPLIER["lunar-charged"], // 3.0
    baseDmgBonusPct: lunarBase,
    reactionBonusPct,
  };
  const lunarKeys = ["a1-extra", "c2-punishment-edict", "c6-dawning-morn"];
  for (const key of lunarKeys) {
    addMods(res.perHit, key, { directReaction: direct });
  }

  // 8. Explicitly set normal attack hits as Physical
  const normalKeys = [
    "1-hit", "2-hit", "3-hit", "4-hit",
    "charged", "plunge", "low-plunge", "high-plunge"
  ];
  for (const key of normalKeys) {
    addMods(res.perHit, key, {
      element: "Physical",
      baseDmgMultiplier: 1.0,
    });
  }

  return res;
}
