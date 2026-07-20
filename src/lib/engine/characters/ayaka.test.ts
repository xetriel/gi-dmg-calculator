import { describe, it, expect } from "vitest";
import { resolveAyaka } from "./ayaka";
import { ayaka } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("ayaka mechanics", () => {
  it("Cryo Infusion conversion on Normal Attack hits", () => {
    // With infusion: element becomes Cryo
    const r1 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "cryo-infusion": 1 } }));
    expect(r1.perHit["1-hit"]?.element).toBe("Cryo");
    expect(r1.perHit["charged"]?.element).toBe("Cryo");

    // Without infusion: element undefined (defaults to physical)
    const r2 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "cryo-infusion": 0 } }));
    expect(r2.perHit["1-hit"]?.element).toBeUndefined();
  });

  it("A1 Passive: Amatsumi Kunitsumi NA/CA DMG Buff", () => {
    // A1 active: +30% Normal and Charged DMG Bonus
    const r1 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "a1-skill-dmg-buff": 1 } }));
    expect(r1.statDeltas.normalDmgBonus).toBe(30);
    expect(r1.statDeltas.chargedDmgBonus).toBe(30);

    // A1 inactive: no bonus
    const r2 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "a1-skill-dmg-buff": 0 } }));
    expect(r2.statDeltas.normalDmgBonus).toBeUndefined();
    expect(r2.statDeltas.chargedDmgBonus).toBeUndefined();
  });

  it("A4 Passive: Sprint Senho Cryo DMG Bonus", () => {
    // A4 active: +18% Cryo DMG Bonus
    const r1 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "senho-cryo-bonus": 1 } }));
    expect(r1.statDeltas.dmgBonus).toBe(18);

    // A4 inactive: no bonus
    const r2 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "senho-cryo-bonus": 0 } }));
    expect(r2.statDeltas.dmgBonus).toBeUndefined();
  });

  it("C4 Ebb and Flow DEF reduction", () => {
    // C4 active: +30% DEF reduction
    const r1 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "c4-def-shred": 1 } }));
    expect(r1.statDeltas.defReduction).toBe(30);

    // C4 inactive: no DEF reduction
    const r2 = resolveAyaka(ayaka, ctxFor("ayaka", { inputs: { "c4-def-shred": 0 } }));
    expect(r2.statDeltas.defReduction).toBeUndefined();
  });

  it("C6 Dance of Suigetsu Charged Attack DMG buff", () => {
    // C6 active: +298% Charged Attack DMG Bonus
    const r1 = resolveAyaka(ayaka, ctxFor("ayaka", { constellationLevel: 6, inputs: { "c6-charged-buff": 1 } }));
    expect(r1.statDeltas.chargedDmgBonus).toBe(298);

    // C6 inactive: no buff
    const r2 = resolveAyaka(ayaka, ctxFor("ayaka", { constellationLevel: 6, inputs: { "c6-charged-buff": 0 } }));
    expect(r2.statDeltas.chargedDmgBonus).toBeUndefined();
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "ayaka"));
    expect(rows.length).toBe(180); // 12 hits * 15 levels = 180 rows
  });
});
