import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { stellarEmBonus, resMultiplier } from "../damage";
import { stellarConductBRC, stellarConductFieldBuffs } from "../stellar";

export function resolveSandrone(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // A4 A Lady's Code of Conduct: +8 EM per 100 ATK (cap 160 EM)
  const a4Em = Math.min(0.08 * stats.atk, 160);
  if (a4Em > 0) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + a4Em;
    res.statBuffSources = res.statBuffSources ?? {};
    res.statBuffSources.em = [
      {
        source: "A4: A Lady's Code of Conduct",
        value: a4Em,
        description: "+8 EM per 100 ATK (cap 160)",
        type: "mechanic",
        category: "character",
      },
    ];
    res.notes.push(`A4 A Lady's Code of Conduct: +${fmt(a4Em)} EM (8% of ATK${a4Em >= 160 ? ", capped" : ""})`);
  }

  // Light of Rationalisme: Base Stellar Reaction DMG +0.7% per 100 ATK, cap 14%.
  // Applies to both Stellar-Conduct and Stellar Swirl.
  const baseDmgBonusPct = Math.min(0.7 * (stats.atk / 100), 14);
  res.notes.push(
    `Light of Rationalisme: +${baseDmgBonusPct.toFixed(1)}% Base Stellar Reaction DMG (0.7%/100 ATK${baseDmgBonusPct >= 14 ? ", capped" : ""})`
  );

  // C1: all party members deal 30% increased Stellar Glimmer reaction DMG.
  const reactionBonusPct = cons >= 1 ? 30 : 0;
  if (cons >= 1) {
    res.notes.push("C1: +30% Stellar Glimmer Reaction DMG");
  }

  // Radiance State Resolution:
  // "Characters can only be affected by one Radiance state at any one time,
  // and where more than one state can be triggered, Radiance: Stellar-Conduct shall apply first."
  const fieldOn = on("polestar-field");
  const swirlOn = on("radiance-stellar-swirl");

  let brc = 1;
  let stellarType: "stellar-conduct" | "stellar-swirl" = "stellar-conduct";

  if (fieldOn) {
    // Inside Polestar Field: enters Radiance: Stellar-Conduct
    const hits = Math.min(val("polestar-hits"), 12);
    const buffs = stellarConductFieldBuffs(hits);
    brc = buffs.brc;
    stellarType = "stellar-conduct";

    // Polestar Field: Cryo/Electro DMG Bonus +20% (0 hits) or +(28+n)% (n≥1, up to +40%).
    // Physical RES reduction: -40%.
    // Only non-stellar hits benefit from DMG Bonus — the stellar branch ignores DMG Bonus%.
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + buffs.cryoDmgBonus;
    res.statDeltas.enemyPhysicalRes = (res.statDeltas.enemyPhysicalRes ?? 0) - buffs.enemyPhysicalResShred;
    res.statBuffSources = res.statBuffSources ?? {};
    res.statBuffSources.dmgBonus = [
      {
        source: "Polestar Field",
        value: buffs.cryoDmgBonus,
        description: "Cryo/Electro DMG Bonus on non-Stellar hits",
        type: "mechanic",
        category: "character",
      },
    ];
    res.statBuffSources.enemyPhysicalRes = [
      {
        source: "Polestar Field",
        value: -buffs.enemyPhysicalResShred,
        description: "-40% Enemy Physical RES shred",
        type: "mechanic",
        category: "character",
      },
    ];
    res.notes.push(
      `Polestar Field: Radiance: Stellar-Conduct active (BRC ×${brc.toFixed(2)} on Stellar hits (${hits} hit${hits === 1 ? "" : "s"}); +${buffs.cryoDmgBonus}% Cryo DMG Bonus on non-Stellar hits; -${buffs.enemyPhysicalResShred}% Enemy Phys RES)`
    );
  } else if (swirlOn) {
    // Party Stellar Swirl triggered: enters Radiance: Stellar Swirl
    brc = 1.0;
    stellarType = "stellar-swirl";
    res.notes.push("Radiance: Stellar Swirl active: direct hits deal Stellar Swirl DMG (Base BRC ×1.00)");
  } else {
    // Neutral fallback
    brc = 1.0;
    stellarType = "stellar-conduct";
    res.notes.push("Radiance: Inactive (direct hits deal standard Cryo DMG; toggle Polestar Field or Radiance: Stellar Swirl to activate Radiance)");
  }

  // Stellar params shared by her three stellar hits.
  const direct: DirectReactionParams = {
    coefficient: brc,
    baseDmgBonusPct,
    reactionBonusPct,
    stellarType,
  };

  const stellarKeys = ["condensed-beam-stellar", "prism-shot-stellar", "convective-ray-stellar"];
  for (const key of stellarKeys) addMods(res.perHit, key, { directReaction: direct });

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

  // C6 Elevation: all Stellar Glimmer reaction DMG dealt by Sandrone is elevated by 20%.
  if (cons >= 6) {
    res.statDeltas.stellarReactionSpecialDmgBonus = (res.statDeltas.stellarReactionSpecialDmgBonus ?? 0) + 20;
    res.statBuffSources = res.statBuffSources ?? {};
    res.statBuffSources.stellarReactionSpecialDmgBonus = [
      {
        source: "C6: Narcissus Wakes, Her Eyes Upon the Dawn",
        value: 20,
        description: "+20% Elevation to all Stellar Glimmer reaction DMG",
        type: "constellation",
        category: "character",
      },
    ];
    res.notes.push("C6: +20% Elevation DMG to all Stellar Glimmer reaction DMG");
  }

  // C4 Extra Cannon / C6 Cluster Beam: fixed-% stellar side hits, shown as notes.
  const elevationFactor = cons >= 6 ? 1.20 : 1.0;
  const emForNotes = (stats.em ?? 0) + a4Em;
  const stellarNonCrit = (multPct: number) =>
    brc * (multPct / 100) * stats.atk * (1 + baseDmgBonusPct / 100) *
    (1 + stellarEmBonus(emForNotes) + reactionBonusPct / 100) *
    elevationFactor *
    resMultiplier(stats.enemyRes);

  if (cons >= 4) {
    const isSwirl = stellarType === "stellar-swirl";
    const c4Mult = isSwirl ? 187.5 : 125;
    const rxName = isSwirl ? "Stellar Swirl" : "Stellar-Conduct";
    res.notes.push(`C4 Extra Cannon: ${fmt(stellarNonCrit(c4Mult))} ${rxName} DMG per proc (${c4Mult}% ATK, every 4s)`);
  }
  if (cons >= 6) {
    const isSwirl = stellarType === "stellar-swirl";
    const c6Mult = isSwirl ? 120 : 80;
    const rxName = isSwirl ? "Stellar Swirl" : "Stellar-Conduct";
    res.notes.push(`C6 Cluster Beam: 4 × ${fmt(stellarNonCrit(c6Mult))} ${rxName} DMG (${c6Mult}% ATK each, elevated by 20%)`);
  }

  return res;
}
