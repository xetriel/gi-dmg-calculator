import type { CharacterConfig, Element } from "@/data/registry/types";
import type { DamageStats } from "../damage";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveSucrose(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // 1. Hexerei: Secret Rite (Luna III / Version 6.2 Addition)
  // Unlocked by Witch's Homework: Of Wonderland Flowers (Witch's Eve Rite: Sevenfold Transmutation)
  if (on("hexerei-secret-rite")) {
    let hexereiBonus = 0;
    const smallActive = on("small-wind-spirit");
    const largeActive = on("large-wind-spirit");

    if (smallActive) {
      hexereiBonus += 40 / 7; // ~5.7142857%
      res.notes.push("Hexerei: Small Wind Spirit (+5.71428% Normal, Charged, Plunge, Skill & Burst DMG)");
    }
    if (largeActive) {
      // Sucrose herself is a Hexerei character, so she receives the Large Wind Spirit bonus
      hexereiBonus += 50 / 7; // ~7.1428571%
      res.notes.push("Hexerei: Large Wind Spirit (+7.14285% Hexerei NA, CA, Plunge, Skill & Burst DMG)");
    }

    if (hexereiBonus > 0) {
      res.statDeltas.normalDmgBonus = (res.statDeltas.normalDmgBonus ?? 0) + hexereiBonus;
      res.statDeltas.chargedDmgBonus = (res.statDeltas.chargedDmgBonus ?? 0) + hexereiBonus;
      res.statDeltas.plungeDmgBonus = (res.statDeltas.plungeDmgBonus ?? 0) + hexereiBonus;
      res.statDeltas.skillDmgBonus = (res.statDeltas.skillDmgBonus ?? 0) + hexereiBonus;
      res.statDeltas.burstDmgBonus = (res.statDeltas.burstDmgBonus ?? 0) + hexereiBonus;
    }
  }

  // 2. Elemental Burst Absorption & C6: Chaotic Entropy
  const absInput = inputs["burst-absorption"];
  let absorption: "none" | "Pyro" | "Hydro" | "Electro" | "Cryo" = "none";
  if (on("burst-absorb-pyro") || absInput === 1 || (absInput as unknown) === "Pyro") absorption = "Pyro";
  else if (on("burst-absorb-hydro") || absInput === 2 || (absInput as unknown) === "Hydro") absorption = "Hydro";
  else if (on("burst-absorb-electro") || absInput === 3 || (absInput as unknown) === "Electro") absorption = "Electro";
  else if (on("burst-absorb-cryo") || absInput === 4 || (absInput as unknown) === "Cryo") absorption = "Cryo";

  if (absorption === "none") {
    // When no element is absorbed, disable the absorption hit instance
    addMods(res.perHit, "burst-infusion", { baseDmgMultiplier: 0 });
  } else {
    // Route infused element to the absorbed type
    addMods(res.perHit, "burst-infusion", { element: absorption as Element });
    res.notes.push(`Forbidden Creation: Large Wind Spirit infused with ${absorption}`);

    // C6: Chaotic Entropy
    if (cons >= 6 && on("c6-absorption-buff")) {
      const isHexerei = on("hexerei-secret-rite");
      const hexereiExtra = isHexerei ? 60 / 7 : 0; // +8.5714286%
      const totalC6Bonus = 20 + hexereiExtra;
      const statKey = `${absorption.toLowerCase()}DmgBonus` as keyof DamageStats;
      (res.statDeltas as Record<string, number>)[statKey] =
        (((res.statDeltas as Record<string, number>)[statKey]) ?? 0) + totalC6Bonus;

      res.notes.push(
        `C6 Chaotic Entropy: +${totalC6Bonus.toFixed(2)}% ${absorption} DMG Bonus${
          isHexerei ? " (+8.57142% Hexerei bonus included)" : ""
        }`
      );
    }
  }

  // 3. Informational Notes for Constellations & Passives
  if (cons >= 1) {
    res.notes.push("C1 Clustered Vacuum Field: +1 additional charge to Astable Anemohypostasis Creation - 6308");
  }
  if (cons >= 2) {
    res.notes.push("C2 Beth: Unbound Form: Forbidden Creation duration +2s (4 total pulses)");
  }
  if (cons >= 4) {
    res.notes.push("C4 Alchemania: Every 7 Normal/Charged Attacks reduce Skill CD by 1-7s");
  }

  const em = ctx.stats.em ?? 0;
  if (on("a4-em-share")) {
    res.notes.push(`A4 Mollis Favonius: Shares +${(em * 0.20).toFixed(1)} EM (20% of Sucrose's EM) with party`);
  }
  if (on("a1-swirl-buff")) {
    res.notes.push("A1 Catalyst Conversion: Shares +50 EM with party members of the swirled element");
  }

  return res;
}
