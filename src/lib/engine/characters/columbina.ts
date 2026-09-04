import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveColumbina(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // A1: increases her CRIT Rate by 5% per Lunacy stack (max 3 stacks).
  const lunacy = val("lunacy-stacks");
  res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + 5 * lunacy;
  if (lunacy > 0) {
    res.notes.push(`A1 Lunacy: +${5 * lunacy}% CRIT Rate (${lunacy} stack${lunacy > 1 ? "s" : ""})`);
  }

  // C2 Lunar Brilliance: increases her Max HP by 40% (based on base HP input).
  const baseHpEff = ctx.baseHp ?? 0;
  const lbActive = cons >= 2 && (on("c2-lunar-brilliance") || on("lunar-brilliance"));
  const hpBonus = lbActive ? 0.40 * baseHpEff : 0;
  if (hpBonus > 0) {
    res.statDeltas.hp = (res.statDeltas.hp ?? 0) + hpBonus;
    res.notes.push(`C2 Lunar Brilliance: +${fmt(hpBonus)} Max HP (40% Base HP)`);
  }

  const hpEff = stats.hp + hpBonus;

  // C2 Moonsign: Ascendant Gleam character buffs (ATK, EM, and DEF based on reaction type)
  if (lbActive) {
    const hasExplicitGleam =
      inputs["c2-gleam-charged"] !== undefined ||
      inputs["c2-gleam-bloom"] !== undefined ||
      inputs["c2-gleam-crystallize"] !== undefined;

    const gleamCharged = hasExplicitGleam ? on("c2-gleam-charged") : true;
    const gleamBloom = hasExplicitGleam ? on("c2-gleam-bloom") : true;
    const gleamCrystallize = hasExplicitGleam ? on("c2-gleam-crystallize") : true;

    const notesParts: string[] = [];
    if (gleamCharged) {
      const atkShared = 0.01 * hpEff;
      res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkShared;
      notesParts.push(`+${fmt(atkShared)} ATK`);
    }
    if (gleamBloom) {
      const emShared = 0.0035 * hpEff;
      res.statDeltas.em = (res.statDeltas.em ?? 0) + emShared;
      notesParts.push(`+${fmt(emShared)} EM`);
    }
    if (gleamCrystallize) {
      const defShared = 0.01 * hpEff;
      res.statDeltas.def = (res.statDeltas.def ?? 0) + defShared;
      notesParts.push(`+${fmt(defShared)} DEF`);
    }
    if (notesParts.length > 0) {
      res.notes.push(
        `C2: ${notesParts.join(", ")} (based on Columbina Max HP)`
      );
    }
  }

  // Moonsign Benediction: +0.2% Lunar reaction Base DMG per 1000 Max HP, cap 7%.
  const lunarBase = Math.min(0.2 * (hpEff / 1000), 7);
  res.lunarBaseBonusPct = lunarBase;
  res.notes.push(
    `Moonsign: +${lunarBase.toFixed(1)}% Lunar Base DMG Bonus (0.2%/1000 Max HP${lunarBase >= 7 ? ", capped" : ""})`
  );

  // Burst Domain Reaction Bonus:
  const domainReactionBonus = on("lunar-domain") ? (coeff(ctx, "burst", "domain-bonus") ?? 0) : 0;
  if (domainReactionBonus > 0) {
    res.notes.push(`Lunar Domain: +${domainReactionBonus}% Lunar Reaction DMG Bonus`);
  }

  // Constellation Elevation bonuses: C1 (+1.5%), C2 (+7%), C4 (+1.5%), C6 (+7%)
  let elevation = 1.0;
  if (cons >= 1) elevation += 0.015;
  if (cons >= 2) elevation += 0.07;
  if (cons >= 4) elevation += 0.015;
  if (cons >= 6) elevation += 0.07;
  if (elevation > 1.0) {
    res.notes.push(`Reaction Elevation: ×${elevation.toFixed(3)} (+${((elevation - 1) * 100).toFixed(1)}% from constellations)`);
  }

  // C6 CRIT DMG buff (+80% CRIT DMG on all elements inside Burst Domain)
  const c6Active = cons >= 6 && on("lunar-domain") && on("c6-crit-dmg-buff");
  if (c6Active) {
    const allHits = [
      "1-hit", "2-hit", "3-hit", "charged", "moondew-cleanse", "plunge", "low-plunge", "high-plunge",
      "skill-dmg", "ripple-dmg", "gi-charged", "gi-bloom", "gi-crystallize", "burst-dmg"
    ];
    for (const key of allHits) {
      addMods(res.perHit, key, { critDmgBonusPct: 80 });
    }
    res.notes.push("C6: +80% CRIT DMG to elements in Lunar Domain");
  }

  const elevationBonusPct = (elevation - 1) * 100;

  // Route Moondew Cleanse (direct Lunar-Bloom, coefficient 1.0)
  const cleanseDirect: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct: lunarBase,
    reactionBonusPct: domainReactionBonus,
    elevationBonusPct,
    lunarType: "lunar-bloom",
  };
  addMods(res.perHit, "moondew-cleanse", {
    directReaction: cleanseDirect,
  });

  // Gravity Interference flat C4 scaling additions
  const c4ChargedFlat = cons >= 4 ? 0.125 * hpEff * elevation : 0;
  const c4BloomFlat = cons >= 4 ? 0.025 * hpEff * elevation : 0;
  const c4CrystallizeFlat = cons >= 4 ? 0.125 * hpEff * elevation : 0;

  // Direct reaction Gravity Interference parameters:
  // Coefficient: Charged (3.0), Bloom (1.0), Crystallize (1.6)
  const giChargedDirect: DirectReactionParams = {
    coefficient: 3.0,
    baseDmgBonusPct: lunarBase,
    reactionBonusPct: domainReactionBonus,
    elevationBonusPct,
    lunarType: "lunar-charged",
  };
  const giBloomDirect: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct: lunarBase,
    reactionBonusPct: domainReactionBonus,
    elevationBonusPct,
    lunarType: "lunar-bloom",
  };
  const giCrystallizeDirect: DirectReactionParams = {
    coefficient: 1.6,
    baseDmgBonusPct: lunarBase,
    reactionBonusPct: domainReactionBonus,
    elevationBonusPct,
    lunarType: "lunar-crystallize",
  };

  addMods(res.perHit, "gi-charged", {
    directReaction: giChargedDirect,
    flatDmgBonus: c4ChargedFlat,
  });
  addMods(res.perHit, "gi-bloom", {
    directReaction: giBloomDirect,
    flatDmgBonus: c4BloomFlat,
  });
  addMods(res.perHit, "gi-crystallize", {
    directReaction: giCrystallizeDirect,
    flatDmgBonus: c4CrystallizeFlat,
  });

  if (cons >= 4) {
    res.notes.push(
      `C4 flat base DMG: +${fmt(0.125 * hpEff)} (Lunar-Charged/Cryst.), +${fmt(0.025 * hpEff)} (Lunar-Bloom)`
    );
  }

  return res;
}
