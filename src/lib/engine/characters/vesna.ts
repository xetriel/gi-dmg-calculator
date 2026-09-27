import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DirectReactionParams } from "../damage";
import { addMods } from "../mechanics-utils";

export function resolveVesna(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  const armed = on("armed-for-action");
  const radiance = on("radiance-stellar-swirl");

  // A1: Rite of Spring's Procession
  // Max 6 stacks. Spirit Blades deal +10% DMG per stack (Base DMG Multiplier).
  // C2: Entering Armed for Action immediately grants 6 stacks.
  let stacks = Math.min(val("disciplinary-action-stacks"), 6);
  if (cons >= 2 && armed) {
    stacks = 6;
  }
  const spiritBladeBaseMultiplier = 1.0 + 0.10 * stacks;
  if (stacks > 0) {
    res.notes.push(
      `A1 Rite of Spring's Procession: +${(0.10 * stacks * 100).toFixed(0)}% Base DMG Multiplier to Spirit Blades (${stacks} stack${stacks > 1 ? "s" : ""})`
    );
  }

  // C2: +60% ATK when at maximum Disciplinary Action stacks
  if (cons >= 2 && stacks >= 6) {
    res.statDeltas.atkPercent = (res.statDeltas.atkPercent ?? 0) + 60;
    res.notes.push("C2 Kolo of Spring's Arrival: +60% ATK (max Disciplinary Action stacks)");
  }

  // Stellar Jubilee: Splendid Prelude
  // Base Stellar Swirl reaction DMG +0.7% per 100 ATK (cap 14.0% at 2,000 ATK)
  const baseDmgBonusPct = Math.min(0.7 * (stats.atk / 100), 14.0);
  res.notes.push(
    `Stellar Jubilee: Splendid Prelude: +${baseDmgBonusPct.toFixed(1)}% Base Stellar Swirl DMG (0.7%/100 ATK${baseDmgBonusPct >= 14 ? ", capped" : ""})`
  );

  // A4: Truth Prevails
  // In Radiance: Stellar Swirl state:
  // - For each Anemo or Cryo teammate: +6% ATK (+18% at C4)
  // - For each teammate of other elements: +25 EM (+75 EM at C4)
  if (radiance) {
    const anemoCryoCount = Math.min(val("party-anemo-cryo-count"), 3);
    const maxOther = Math.max(0, 3 - anemoCryoCount);
    const otherCount = Math.min(val("party-other-element-count"), maxOther);

    const atkPerMember = cons >= 4 ? 18 : 6;
    const emPerMember = cons >= 4 ? 75 : 25;

    const atkBonus = atkPerMember * anemoCryoCount;
    const emBonus = emPerMember * otherCount;

    if (atkBonus > 0) {
      res.statDeltas.atkPercent = (res.statDeltas.atkPercent ?? 0) + atkBonus;
      res.notes.push(
        `A4 Truth Prevails${cons >= 4 ? " (C4 3×)" : ""}: +${atkBonus}% ATK (${anemoCryoCount} Anemo/Cryo teammate${anemoCryoCount > 1 ? "s" : ""})`
      );
    }
    if (emBonus > 0) {
      res.statDeltas.em = (res.statDeltas.em ?? 0) + emBonus;
      res.notes.push(
        `A4 Truth Prevails${cons >= 4 ? " (C4 3×)" : ""}: +${emBonus} EM (${otherCount} other-element teammate${otherCount > 1 ? "s" : ""})`
      );
    }
    res.notes.push("Radiance: Stellar Swirl active: Spirit Blades deal direct Stellar Swirl DMG (Base BRC ×1.00)");
  } else {
    res.notes.push("Radiance: Inactive (toggle Radiance: Stellar Swirl to activate Stellar Swirl Spirit Blades)");
  }

  // C1: Winter's Farewell Feast: +20% Stellar Swirl reaction DMG while in Armed for Action mode
  if (cons >= 1 && armed) {
    res.statDeltas.stellarSwirlDmgBonus = (res.statDeltas.stellarSwirlDmgBonus ?? 0) + 20;
    res.notes.push("C1 Winter's Farewell Feast: +20% Stellar Swirl reaction DMG (Armed for Action)");
  }

  // C6: Unwavering Ardor: +20% Stellar Swirl reaction DMG
  if (cons >= 6) {
    res.statDeltas.stellarSwirlDmgBonus = (res.statDeltas.stellarSwirlDmgBonus ?? 0) + 20;
    res.notes.push("C6 Unwavering Ardor: +20% Stellar Swirl reaction DMG");
  }

  // Direct Stellar Swirl reaction parameters
  const directSwirl: DirectReactionParams = {
    coefficient: 1.0,
    baseDmgBonusPct,
    reactionBonusPct: 0,
    stellarType: "stellar-swirl",
  };

  // Normal Attack infusion in Armed for Action mode
  if (armed) {
    const naKeys = [
      "1-hit",
      "2-hit",
      "3-hit-a",
      "3-hit-b",
      "4-hit",
      "5-hit",
      "6-hit",
      "charged",
      "plunge",
      "low-plunge",
      "high-plunge",
    ];
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Anemo" });
    }
    res.notes.push("Armed for Action: Normal, Charged, and Plunging attacks converted to Anemo DMG");
  } else {
    // If not in Armed for Action, disable Wind Pinion and Windborne Sword hits
    const armedKeys = [
      "wind-pinion",
      "windborne-1",
      "windborne-2",
      "spirit-blade-2",
      "spirit-blade-2-stellar",
      "windborne-3-blades",
      "windborne-3-blades-stellar",
      "windborne-3-final",
    ];
    for (const key of armedKeys) {
      addMods(res.perHit, key, { baseDmgMultiplier: 0 });
    }
  }

  // Spirit Blade hit keys: apply A1 Base DMG Multiplier
  const allSpiritBlades = [
    "spirit-blade-2",
    "spirit-blade-2-stellar",
    "windborne-3-blades",
    "windborne-3-blades-stellar",
    "c6-transpose-blade",
    "c6-transpose-blade-stellar",
    "burst-spirit-blade",
    "burst-spirit-blade-stellar",
  ];
  for (const key of allSpiritBlades) {
    addMods(res.perHit, key, { baseDmgMultiplier: spiritBladeBaseMultiplier });
  }

  // Radiance: Stellar Swirl vs Anemo Spirit Blade Hit Gating
  if (radiance) {
    // Enable direct Stellar Swirl reaction on stellar rows
    const stellarRows = [
      "spirit-blade-2-stellar",
      "windborne-3-blades-stellar",
      "c6-transpose-blade-stellar",
      "burst-spirit-blade-stellar",
    ];
    for (const key of stellarRows) {
      addMods(res.perHit, key, { directReaction: directSwirl });
    }

    // Disable standard Anemo Spirit Blade counterpart hits
    const anemoRows = [
      "spirit-blade-2",
      "windborne-3-blades",
      "c6-transpose-blade",
      "burst-spirit-blade",
    ];
    for (const key of anemoRows) {
      addMods(res.perHit, key, { baseDmgMultiplier: 0 });
    }
  } else {
    // Radiance inactive: disable Stellar Swirl direct rows
    const stellarRows = [
      "spirit-blade-2-stellar",
      "windborne-3-blades-stellar",
      "c6-transpose-blade-stellar",
      "burst-spirit-blade-stellar",
    ];
    for (const key of stellarRows) {
      addMods(res.perHit, key, { baseDmgMultiplier: 0 });
    }
  }

  // C6 Transpose hits: disabled below C6
  if (cons < 6) {
    addMods(res.perHit, "c6-transpose", { baseDmgMultiplier: 0 });
    addMods(res.perHit, "c6-transpose-blade", { baseDmgMultiplier: 0 });
    addMods(res.perHit, "c6-transpose-blade-stellar", { baseDmgMultiplier: 0 });
  }

  return res;
}
