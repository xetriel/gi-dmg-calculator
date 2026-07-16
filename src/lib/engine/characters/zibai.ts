import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { LUNAR_DIRECT_MULTIPLIER } from "../lunar";

export function resolveZibai(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // A4 Layered Peaks: +15% of Base DEF per other Geo member; +60 EM per Hydro member.
  const geoAllies = Math.min(val("geo-allies"), 3);
  const hydroAllies = Math.min(val("hydro-allies"), 3);
  const defDelta = 0.15 * ctx.baseDef * geoAllies;
  if (defDelta > 0) {
    res.statDeltas.def = (res.statDeltas.def ?? 0) + defDelta;
    res.notes.push(`A4: +${fmt(defDelta)} DEF (${geoAllies} Geo all${geoAllies > 1 ? "ies" : "y"} × 15% Base DEF)`);
  }
  if (hydroAllies > 0) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 60 * hydroAllies;
    res.notes.push(`A4: +${60 * hydroAllies} Elemental Mastery (${hydroAllies} Hydro all${hydroAllies > 1 ? "ies" : "y"})`);
  }
  const defEff = stats.def + defDelta;

  // Moonsign Benediction: +0.7% Lunar-Crystallize Base DMG per 100 DEF, cap 14%.
  const lunarBase = Math.min(0.7 * (defEff / 100), 14);
  res.lunarBaseBonusPct = lunarBase;
  res.notes.push(
    `Moonsign: +${lunarBase.toFixed(1)}% Lunar-Crystallize Base DMG (0.7%/100 DEF${lunarBase >= 14 ? ", capped" : ""})`
  );

  // C2: party Lunar-Crystallize Reaction DMG +30% while in Lunar Phase Shift.
  const reactionBonusPct = cons >= 2 ? 30 : 0;
  const direct: DirectReactionParams = {
    coefficient: LUNAR_DIRECT_MULTIPLIER["lunar-crystallize"], // 1.6
    baseDmgBonusPct: lunarBase,
    reactionBonusPct,
  };
  const lunarKeys = ["spirit-steed-2", "4-hit-additional", "skill-2"];
  for (const key of lunarKeys) addMods(res.perHit, key, { directReaction: direct });
  if (cons >= 2) res.notes.push("C2: +30% Lunar-Crystallize DMG (Reaction Bonus, in Phase Shift)");

  // A1 Moonfall: Spirit Steed's Stride 2nd hit +60% of DEF (flat).
  if (on("moonfall")) {
    addMods(res.perHit, "spirit-steed-2", { flatDmgBonus: 0.6 * defEff });
    res.notes.push(`A1 Moonfall: +${fmt(0.6 * defEff)} flat DMG on Spirit Steed 2nd hit (60% DEF)`);
  }
  // C2 Ascendant Gleam: Stride 2nd hit additional DMG = 550% of DEF (flat).
  if (cons >= 2) {
    addMods(res.perHit, "spirit-steed-2", { flatDmgBonus: 5.5 * defEff });
    res.notes.push(`C2: +${fmt(5.5 * defEff)} flat DMG on Spirit Steed 2nd hit (550% DEF, Ascendant Gleam)`);
  }
  // C1: first Stride of the phase — 2nd-hit Lunar DMG +220%.
  if (cons >= 1 && on("c1-first-stride")) {
    addMods(res.perHit, "spirit-steed-2", { baseDmgMultiplier: 3.2 });
    res.notes.push("C1: first Stride 2nd-hit ×3.2 (+220%)");
  }
  // C4 Scattermoon Splendor: next Phase Shift 4-Hit Additional deals 250% of original.
  if (cons >= 4 && on("c4-scattermoon")) {
    addMods(res.perHit, "4-hit-additional", { baseDmgMultiplier: 2.5 });
    res.notes.push("C4 Scattermoon: Phase Shift 4-Hit Additional ×2.5");
  }
  // C6: Stride consumes all Radiance; +1.6%/point above 70 on Stride + her Lunar hits.
  if (cons >= 6) {
    const radiance = Math.min(Math.max(val("c6-radiance"), 70), 100);
    const bonusPct = (radiance - 70) * 1.6;
    if (bonusPct > 0) {
      for (const key of ["spirit-steed-1", ...lunarKeys]) {
        addMods(res.perHit, key, { baseDmgMultiplier: 1 + bonusPct / 100 });
      }
      res.notes.push(`C6: +${bonusPct.toFixed(1)}% on Spirit Steed & Lunar hits (${radiance} Radiance consumed)`);
    }
  }

  return res;
}
