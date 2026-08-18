import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";

export function resolveMizuki(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  const isDreamdrifter = on("dreamdrifter-state");
  const isHexerei = on("hexerei-secret-rite");

  // A1: Bright Moon's Restless Voice (Note)
  if (isDreamdrifter) {
    res.notes.push("A1 Bright Moon's Restless Voice: Swirl/Stellar-Swirl extends Dreamdrifter by +2.5s (max +5s, total 10s)");
  }

  // A4 Passive: Thoughts by Day Bring Dreams by Night (+100 EM)
  if (isDreamdrifter && on("a4-em-buff")) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 100;
    res.notes.push("A4 Thoughts by Day Bring Dreams by Night: +100 Elemental Mastery");
  }

  const totalEm = stats.em + (res.statDeltas.em ?? 0);

  // Witch's Revelation: Vast Be the Dream (Radiance: Stellar Swirl Reaction DMG)
  if (isDreamdrifter && isHexerei) {
    const direct: DirectReactionParams = {
      coefficient: 1.0,
      baseDmgBonusPct: 14,
      reactionBonusPct: 0,
    };
    addMods(res.perHit, "stellar-swirl-hit", { directReaction: direct });
    res.notes.push("Witch's Revelation (Vast Be the Dream): 1,000% EM Radiance: Stellar Swirl Reaction DMG enabled (Hexerei Synergy Active)");
  } else {
    addMods(res.perHit, "stellar-swirl-hit", { baseDmgMultiplier: 0 });
  }

  // C1: In Mist-Like Waters (+200% EM Flat Reaction DMG)
  if (cons >= 1 && isDreamdrifter) {
    const c1FlatDmg = 2.00 * totalEm;
    addMods(res.perHit, "stellar-swirl-hit", { flatDmgBonus: c1FlatDmg });
    res.notes.push(`C1 In Mist-Like Waters: +${fmt(c1FlatDmg)} Flat Reaction DMG (200% of EM)`);
  }

  // C2: Your Echo I Meet in Dreams (0.04% per EM Elemental DMG Bonus to Party)
  if (cons >= 2 && isDreamdrifter && on("c2-em-dmg-buff")) {
    const dmgBonusPct = 0.04 * totalEm;
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + dmgBonusPct;
    res.statDeltas.hydroDmgBonus = (res.statDeltas.hydroDmgBonus ?? 0) + dmgBonusPct;
    res.statDeltas.cryoDmgBonus = (res.statDeltas.cryoDmgBonus ?? 0) + dmgBonusPct;
    res.statDeltas.electroDmgBonus = (res.statDeltas.electroDmgBonus ?? 0) + dmgBonusPct;
    res.notes.push(`C2 Your Echo I Meet in Dreams: +${dmgBonusPct.toFixed(1)}% Pyro/Hydro/Cryo/Electro DMG Bonus to party (${(0.04).toFixed(2)}% per EM)`);
  }

  // C6: The Heart Lingers Long (+20% CRIT Rate / +40% CRIT DMG on Stellar Swirl)
  if (cons >= 6 && isDreamdrifter) {
    addMods(res.perHit, "stellar-swirl-hit", { critRateBonusPct: 20, critDmgBonusPct: 40 });
    res.notes.push("C6 The Heart Lingers Long: Stellar Swirl +20% CRIT Rate / +40% CRIT DMG; Swirl fixed 30% CRIT Rate / 100% CRIT DMG");
  }

  return res;
}
