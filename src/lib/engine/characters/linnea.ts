import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { LUNAR_DIRECT_MULTIPLIER } from "../lunar";

export function resolveLinnea(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;
  const val = (id: string) => ctx.inputs[id] ?? 0;

  // C4 Moondrift: DEF of Linnea +25%
  const defBonusPct = on("c4-moondrift") ? 25 : 0;
  const defDelta = 0.01 * defBonusPct * ctx.baseDef;
  if (defDelta > 0) {
    res.statDeltas.def = (res.statDeltas.def ?? 0) + defDelta;
    res.notes.push(`C4: +${fmt(defDelta)} DEF (+25% Base DEF)`);
  }
  const defFinal = stats.def + defDelta;

  // A4: If active char is NOT a moonsign character, increase Linnea's own EM by 5% of her DEF
  const emDelta = on("active-char-non-moonsign") ? 0.05 * defFinal : 0;
  if (emDelta > 0) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + emDelta;
    res.notes.push(`A4: +${fmt(emDelta)} EM (5% DEF, active character is not a Moonsign character)`);
  }

  // Moonsign Benediction (Habitat Survey): Every 100 DEF increases Lunar-Crystallize Base DMG by 0.7%, max 14%
  const lunarBase = Math.min(0.7 * (defFinal / 100), 14);
  res.lunarBaseBonusPct = lunarBase;
  res.notes.push(
    `Moonsign: +${lunarBase.toFixed(1)}% Lunar-Crystallize Base DMG (0.7%/100 DEF${lunarBase >= 14 ? ", capped" : ""})`
  );

  // C2 Moondrift: Geo/Hydro party members CRIT DMG +40%
  if (on("c2-moondrift")) {
    res.statDeltas.critDmg = (res.statDeltas.critDmg ?? 0) + 40;
    res.notes.push("C2: +40% CRIT DMG to Geo/Hydro party members");
  }

  // C6 elevates Lunar-Crystallize DMG of nearby party members by 25% (Reaction Bonus)
  const reactionBonusPct = cons >= 6 ? 25 : 0;
  if (cons >= 6) {
    res.notes.push("C6: +25% Lunar-Crystallize Reaction DMG");
  }

  // Lunar hits modifiers
  const direct: DirectReactionParams = {
    coefficient: LUNAR_DIRECT_MULTIPLIER["lunar-crystallize"], // 1.6
    baseDmgBonusPct: lunarBase,
    reactionBonusPct,
  };
  const lunarKeys = ["heavy-overdrive", "million-ton-crush"];
  for (const key of lunarKeys) addMods(res.perHit, key, { directReaction: direct });

  // C1/C6 Field Catalog:
  // Consuming 1 stack boosts nearby party Lunar-Crystallize DMG by 75% DEF.
  // Million Ton Crush consumes up to 5 stacks (150% DEF each).
  // Under C6, consuming double the stacks gives 1.5x the original flat bonus.
  const catalogStacks = val("field-catalog-stacks");
  if (catalogStacks > 0) {
    // For normal Lunar hit (heavy-overdrive): consumes 1 stack (C6: 2 stacks)
    const normalStacks = cons >= 6 ? Math.min(catalogStacks, 2) : 1;
    const normalMultiplier = cons >= 6 ? 1.125 : 0.75;
    const normalFlat = normalMultiplier * defFinal * (cons >= 6 ? normalStacks / 2 : normalStacks);
    addMods(res.perHit, "heavy-overdrive", { flatDmgBonus: normalFlat });
    res.notes.push(`C1: +${fmt(normalFlat)} flat DMG on Heavy Overdrive Hammer (${cons >= 6 ? "2 stacks consumed, 112.5% DEF" : "1 stack consumed, 75% DEF"})`);

    // For Million Ton Crush: consumes up to 5 stacks (C6: 10 stacks)
    const crushMaxStacks = cons >= 6 ? 10 : 5;
    const crushStacks = Math.min(catalogStacks, crushMaxStacks);
    const crushMultiplier = cons >= 6 ? 2.25 : 1.50;
    const crushFactor = cons >= 6 ? crushStacks / 2 : crushStacks;
    const crushFlat = crushMultiplier * defFinal * crushFactor;
    addMods(res.perHit, "million-ton-crush", { flatDmgBonus: crushFlat });
    res.notes.push(`C1: +${fmt(crushFlat)} flat DMG on Million Ton Crush (${crushStacks} stack${crushStacks > 1 ? "s" : ""} consumed, ${cons >= 6 ? "225% DEF per pair" : "150% DEF each"})`);
  }

  // C2: Million Ton Crush CRIT DMG +150%
  if (on("c2-moondrift")) {
    addMods(res.perHit, "million-ton-crush", { critDmgBonusPct: 150 });
    res.notes.push("C2: +150% CRIT DMG on Million Ton Crush");
  }

  // Burst Healing flat portions based on talent level
  const burstLvl = ctx.talentLevels["burst"] || 1;
  const initialFlatTable = [0, 770.38, 832, 901, 986, 1063, 1148, 1256, 1364, 1487, 1695, 1826, 1957, 2126];
  const initialFlat = initialFlatTable[burstLvl] ?? 770.38;
  addMods(res.perHit, "burst-initial", { flatDmgBonus: initialFlat });

  const continuousFlatTable = [0, 154.08, 166, 180, 197, 212, 229, 251, 272, 297, 339, 365, 391, 425];
  const continuousFlat = continuousFlatTable[burstLvl] ?? 154.08;
  addMods(res.perHit, "burst-continuous", { flatDmgBonus: continuousFlat });

  return res;
}
