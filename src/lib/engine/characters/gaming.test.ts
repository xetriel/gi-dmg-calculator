import { describe, it, expect } from "vitest";
import { resolveGaming } from "./gaming";
import { gaming } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("gaming mechanics", () => {
  it("A4 Passive: Air of Prosperity high HP plunge bonus", () => {
    // HP >= 60%: +20% plunge DMG on charmed-cloudstrider-dmg
    const r1 = resolveGaming(gaming, ctxFor("gaming", { inputs: { "gaming-high-hp": 1 } }));
    expect(r1.perHit["charmed-cloudstrider-dmg"]?.bonusDmgPct).toBe(20);

    // HP < 60%: no DMG bonus
    const r2 = resolveGaming(gaming, ctxFor("gaming", { inputs: { "gaming-high-hp": 0 } }));
    expect(r2.perHit["charmed-cloudstrider-dmg"]?.bonusDmgPct).toBeUndefined();
  });

  it("C2 Plumage of Plummet: overflow healing ATK bonus", () => {
    const r1 = resolveGaming(gaming, ctxFor("gaming", { baseAtk: 1000, inputs: { "c2-overflow-heal": 1 } }));
    expect(r1.statDeltas.atk).toBe(200); // 20% of 1000 base ATK

    const r2 = resolveGaming(gaming, ctxFor("gaming", { baseAtk: 1000, inputs: { "c2-overflow-heal": 0 } }));
    expect(r2.statDeltas.atk).toBeUndefined();
  });

  it("C6 To Tame All Beasts: plunge CRIT bonuses", () => {
    // constellation level < 6: no bonus
    const r1 = resolveGaming(gaming, ctxFor("gaming", { constellationLevel: 5 }));
    expect(r1.perHit["charmed-cloudstrider-dmg"]?.critRateBonusPct).toBeUndefined();
    expect(r1.perHit["charmed-cloudstrider-dmg"]?.critDmgBonusPct).toBeUndefined();

    // constellation level >= 6: +20% CRIT Rate, +40% CRIT DMG
    const r2 = resolveGaming(gaming, ctxFor("gaming", { constellationLevel: 6 }));
    expect(r2.perHit["charmed-cloudstrider-dmg"]?.critRateBonusPct).toBe(20);
    expect(r2.perHit["charmed-cloudstrider-dmg"]?.critDmgBonusPct).toBe(40);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "gaming"));
    expect(rows.length).toBe(165); // 11 hits * 15 levels = 165 rows
  });
});
