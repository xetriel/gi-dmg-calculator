import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods, fmt } from "../mechanics-utils";
import { stellarConductFieldBuffs } from "../stellar";

export function resolveOdette(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // A1: Spring Rite of the Chosen One
  // Max 4 stacks at C0, up to 6 stacks at C1+
  const maxStacks = cons >= 1 ? 6 : 4;
  const stacks = Math.min(val("marvelous-splendor-stacks"), maxStacks);
  if (stacks > 0) {
    const a1Bonus = 15 * stacks;
    res.statDeltas.stellarReactionDmgBonus = (res.statDeltas.stellarReactionDmgBonus ?? 0) + a1Bonus;
    res.notes.push(`A1 Marvelous Splendor: +${a1Bonus}% Stellar Glimmer DMG (${stacks} stack${stacks > 1 ? "s" : ""})`);
  }

  // C2: Marvelous Splendor ATK% bonus (+7% ATK per stack)
  if (cons >= 2 && stacks > 0) {
    const c2AtkPct = 7 * stacks;
    res.statDeltas.atkPercent = (res.statDeltas.atkPercent ?? 0) + c2AtkPct;
    res.notes.push(`C2 Marvelous Splendor: +${c2AtkPct}% ATK (${stacks} stack${stacks > 1 ? "s" : ""})`);
  }

  // A4: Pathetique of Pateticheskaya
  // For every 100 ATK over 1,000, +1.5% Base DMG Multiplier to direct Stellar hits (cap 30% at 3,000 ATK)
  const atkOver1000 = Math.max(0, stats.atk - 1000);
  const a4MultBonus = Math.min(0.30, (atkOver1000 / 100) * 0.015);
  if (a4MultBonus > 0) {
    res.notes.push(`A4 Pathetique of Pateticheskaya: +${(a4MultBonus * 100).toFixed(1)}% Base DMG Multiplier on direct Stellar hits (ATK ${fmt(stats.atk)})`);
  }

  // Stellar Jubilee: Dance of Aurore
  // Base Stellar Reaction DMG +0.7% per 100 ATK (cap 14% at 2,000 ATK)
  const baseDmgBonusPct = Math.min(0.7 * (stats.atk / 100), 14);
  res.notes.push(
    `Dance of Aurore: +${baseDmgBonusPct.toFixed(1)}% Base Stellar Reaction DMG (0.7%/100 ATK${baseDmgBonusPct >= 14 ? ", capped" : ""})`
  );

  // Snow Swan's Dream (Burst)
  if (on("snow-swans-dream")) {
    const burstLvl = (ctx.talentLevels?.burst ?? 10) + (cons >= 5 ? 3 : 0);
    const burstBonus = 14 + (Math.min(burstLvl, 13) - 1) * 4;
    res.statDeltas.stellarReactionDmgBonus = (res.statDeltas.stellarReactionDmgBonus ?? 0) + burstBonus;
    res.notes.push(`Snow Swan's Dream (Burst Lv${burstLvl}): +${burstBonus}% Stellar Glimmer Reaction DMG`);
  }

  // Radiance State & Polestar Field
  // Priority: Polestar Field (Stellar-Conduct) > Radiance: Stellar Swirl
  const fieldOn = on("polestar-field");
  const swirlOn = on("radiance-stellar-swirl");

  let conductBrc = 1.0;
  let activeRadiance: "stellar-conduct" | "stellar-swirl" | "none" = "none";

  if (fieldOn) {
    activeRadiance = "stellar-conduct";
    const hits = Math.min(val("polestar-hits"), 12);
    const buffs = stellarConductFieldBuffs(hits);
    conductBrc = buffs.brc;

    // Polestar Field grants Cryo/Electro DMG Bonus to non-Stellar hits and reduces Enemy Phys RES
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + buffs.cryoDmgBonus;
    res.statDeltas.enemyPhysicalRes = (res.statDeltas.enemyPhysicalRes ?? 0) - buffs.enemyPhysicalResShred;
    res.notes.push(
      `Polestar Field: Radiance: Stellar-Conduct active (BRC ×${conductBrc.toFixed(2)} (${hits} recorded hit${hits === 1 ? "" : "s"}); +${buffs.cryoDmgBonus}% Cryo/Electro DMG on non-Stellar hits; -${buffs.enemyPhysicalResShred}% Enemy Phys RES)`
    );
  } else if (swirlOn) {
    activeRadiance = "stellar-swirl";
    res.notes.push("Radiance: Stellar Swirl active: direct hits deal Stellar Swirl DMG (Base BRC ×1.00)");
  } else {
    res.notes.push("Radiance: Inactive (toggle Polestar Field or Radiance: Stellar Swirl to activate Radiance)");
  }

  // C2: Opponents near Solo Dance Double have corresponding RES lowered by 20% in Radiance
  const doubleActive = on("solo-dance-double");
  if (cons >= 2 && doubleActive && activeRadiance !== "none") {
    if (activeRadiance === "stellar-conduct") {
      res.statDeltas.enemyCryoRes = (res.statDeltas.enemyCryoRes ?? 0) - 20;
      res.statDeltas.enemyElectroRes = (res.statDeltas.enemyElectroRes ?? 0) - 20;
      res.notes.push("C2 Solo Dance Double: -20% Enemy Cryo & Electro RES (Radiance: Stellar-Conduct)");
    } else if (activeRadiance === "stellar-swirl") {
      res.statDeltas.enemyCryoRes = (res.statDeltas.enemyCryoRes ?? 0) - 20;
      res.statDeltas.enemyAnemoRes = (res.statDeltas.enemyAnemoRes ?? 0) - 20;
      res.notes.push("C2 Solo Dance Double: -20% Enemy Cryo & Anemo RES (Radiance: Stellar Swirl)");
    }
  }

  // C6: Divine Elevation (+25% team + 20% self = +45% Elevation to Stellar Glimmer reaction DMG)
  if (cons >= 6 && stacks > 0) {
    res.statDeltas.stellarReactionSpecialDmgBonus = (res.statDeltas.stellarReactionSpecialDmgBonus ?? 0) + 45;
    res.notes.push("C6 Divine Elevation: +45% Elevation to all Stellar Glimmer reaction DMG (25% base + 20% self)");
  }

  // Direct Stellar reaction parameters
  const directConduct: DirectReactionParams = {
    coefficient: conductBrc,
    baseDmgBonusPct,
    reactionBonusPct: 0,
    stellarType: "stellar-conduct",
  };

  const directSwirl: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct,
    reactionBonusPct: 0,
    stellarType: "stellar-swirl",
  };

  const stellarBaseMultiplier = 1.0 + a4MultBonus;

  // Apply to Stellar-Conduct hits
  const conductHitKeys = [
    "coda-stellar-conduct",
    "plume-stellar-conduct",
    "wing-stellar-conduct",
    "c1-stellar-conduct",
    "c4-coord-stellar-conduct",
  ];
  for (const key of conductHitKeys) {
    addMods(res.perHit, key, {
      directReaction: directConduct,
      baseDmgMultiplier: stellarBaseMultiplier,
    });
  }

  // Apply to Stellar Swirl hits
  const swirlHitKeys = [
    "coda-stellar-swirl",
    "plume-stellar-swirl",
    "wing-stellar-swirl",
    "c1-stellar-swirl",
    "c4-coord-stellar-swirl",
  ];
  for (const key of swirlHitKeys) {
    addMods(res.perHit, key, {
      directReaction: directSwirl,
      baseDmgMultiplier: stellarBaseMultiplier,
    });
  }

  // Solo Dance Double hits disabled if Double is not on field
  if (!doubleActive) {
    const doubleKeys = [
      "plume-dance",
      "plume-stellar-conduct",
      "plume-stellar-swirl",
      "wing-dance",
      "wing-stellar-conduct",
      "wing-stellar-swirl",
    ];
    for (const key of doubleKeys) {
      addMods(res.perHit, key, { baseDmgMultiplier: 0 });
    }
  }

  // Constellation Hit Gating:
  // C1 Additional Finisher hits are disabled at C0
  if (cons < 1) {
    addMods(res.perHit, "c1-stellar-conduct", { baseDmgMultiplier: 0 });
    addMods(res.perHit, "c1-stellar-swirl", { baseDmgMultiplier: 0 });
  }

  // C4 Coordinated Attack hits are disabled below C4
  if (cons < 4) {
    addMods(res.perHit, "c4-coord-stellar-conduct", { baseDmgMultiplier: 0 });
    addMods(res.perHit, "c4-coord-stellar-swirl", { baseDmgMultiplier: 0 });
  }

  return res;
}
