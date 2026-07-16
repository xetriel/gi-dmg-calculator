import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { LUNAR_DIRECT_MULTIPLIER } from "../lunar";

export function resolveFlins(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;
  const val = (id: string) => ctx.inputs[id] ?? 0;

  // C4 ATK Buff: +20% Base ATK
  const atkBonus = cons >= 4 ? 0.20 * ctx.baseAtk : 0;
  if (atkBonus > 0) {
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(`C4: +${fmt(atkBonus)} ATK (20% Base ATK)`);
  }
  const atkEff = stats.atk + atkBonus;

  // A4 Whispering Flame EM Buff: Every point of ATK increases EM by 8% (max 160). Under C4, this increases to 10% of ATK (max 220).
  const emLimit = cons >= 4 ? 220 : 160;
  const emRatio = cons >= 4 ? 0.10 : 0.08;
  const emBonus = Math.min(emRatio * atkEff, emLimit);
  if (emBonus > 0) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + emBonus;
    res.notes.push(
      cons >= 4
        ? `C4 Night on Bald Mountain: +${emBonus.toFixed(0)} Elemental Mastery (10% ATK, max 220)`
        : `A4 Whispering Flame: +${emBonus.toFixed(0)} Elemental Mastery (8% ATK, max 160)`
    );
  }

  // Old World Secrets (Moonsign Benediction): Every 100 ATK increases Lunar-Charged Base DMG by 0.7%, up to 14%.
  const lunarBase = Math.min(0.7 * (atkEff / 100), 14);
  res.lunarBaseBonusPct = lunarBase;
  res.notes.push(
    `Moonsign: +${lunarBase.toFixed(2)}% Lunar-Charged Base DMG (0.7%/100 ATK${lunarBase >= 14 ? ", capped" : ""})`
  );

  // Symphony of Winter (A1): +20% reaction bonus to Lunar-Charged reactions triggered by Flins under Ascendant Gleam
  const reactionBonus = on("ascendant-gleam") ? 20 : 0;
  if (on("ascendant-gleam")) {
    res.notes.push("A1 Symphony of Winter: +20% Lunar-Charged DMG (Reaction Bonus)");
  }

  // C6 Elevation: Elevate Flins's Lunar-Charged DMG by 35% (C6). Under Ascendant Gleam, elevate by an additional 10% (total 45%).
  let elevationMult = 1.0;
  if (cons >= 6) {
    elevationMult += 0.35;
    if (on("ascendant-gleam")) {
      elevationMult += 0.10;
    }
    res.notes.push(
      on("ascendant-gleam")
        ? "C6: Flins's Lunar-Charged DMG is elevated by 45% (Ascendant Gleam)"
        : "C6: Flins's Lunar-Charged DMG is elevated by 35%"
    );
  }

  // C2 RES Shred: decrease opponent Electro RES by 25%
  if (cons >= 2 && on("ascendant-gleam") && on("c2-res-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 25;
    res.notes.push("C2: opponent Electro RES decreased by 25% (Ascendant Gleam)");
  }

  // Direct reaction parameters for Lunar-Charged (coefficient: 3.0)
  const direct: DirectReactionParams = {
    coefficient: LUNAR_DIRECT_MULTIPLIER["lunar-charged"], // 3.0
    baseDmgBonusPct: lunarBase,
    reactionBonusPct: reactionBonus,
  };

  // Scale normal/charged hits if in Manifest Flame form
  if (on("manifest-flame")) {
    const skillLvl = ctx.talentLevels["skill"];
    const normalLvl = ctx.talentLevels["normal"];

    const mapping = {
      "1-hit": "mf-1-hit",
      "2-hit": "mf-2-hit",
      "3-hit": "mf-3-hit",
      "4-hit": "mf-4-hit",
      "5-hit": "mf-5-hit",
      "charged": "mf-charged",
    };

    for (const [normKey, mfKey] of Object.entries(mapping)) {
      const mfMult = ctx.scaling["skill"]?.byLevel[skillLvl]?.[mfKey] ?? 0;
      const normMult = ctx.scaling["normal"]?.byLevel[normalLvl]?.[normKey] ?? 1;
      const mult = normMult > 0 ? mfMult / normMult : 0;
      addMods(res.perHit, normKey, { baseDmgMultiplier: mult });
    }

    // Plunging is disabled in Manifest Flame form
    for (const key of ["plunge", "low-plunge", "high-plunge"]) {
      addMods(res.perHit, key, { baseDmgMultiplier: 0 });
    }
  }

  // If Ascendant Gleam is off, Thunderous Symphony Additional DMG deals 0
  if (!on("ascendant-gleam")) {
    addMods(res.perHit, "symphony-add", { baseDmgMultiplier: 0 });
  }

  // If C2 is not unlocked, C2 Extra DMG deals 0
  if (cons < 2) {
    addMods(res.perHit, "c2-extra", { baseDmgMultiplier: 0 });
  }

  // Direct reaction hits: route through directReaction + apply elevation multiplier
  const lunarKeys = ["burst-middle", "burst-final", "symphony-dmg", "symphony-add", "c2-extra"];
  for (const key of lunarKeys) {
    addMods(res.perHit, key, {
      directReaction: direct,
      baseDmgMultiplier: elevationMult,
    });
  }

  return res;
}
