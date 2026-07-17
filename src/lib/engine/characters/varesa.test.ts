import { describe, it, expect } from "vitest";
import { resolveVaresa } from "./varesa";
import { varesa } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("varesa mechanics", () => {
  it("A4 Passive ATK stack scaling", () => {
    const r1 = resolveVaresa(varesa, ctxFor("varesa", { baseAtk: 1000, inputs: { "nightsoul-burst-stacks": 2 } }));
    expect(r1.statDeltas.atk).toBe(700); // 70% of 1000

    const r2 = resolveVaresa(varesa, ctxFor("varesa", { baseAtk: 1000, inputs: { "nightsoul-burst-stacks": 1 } }));
    expect(r2.statDeltas.atk).toBe(350); // 35% of 1000

    const r3 = resolveVaresa(varesa, ctxFor("varesa", { baseAtk: 1000, inputs: { "nightsoul-burst-stacks": 0 } }));
    expect(r3.statDeltas.atk).toBeUndefined();
  });

  it("A1 Tag-Team Triple Jump: flat Plunge ground impact DMG", () => {
    const r1 = resolveVaresa(varesa, ctxFor("varesa", { stats: { ...baseStats, atk: 2000 }, inputs: { "rainbow-crash": 1 } }));
    // Base Rainbow Crash: 50% of ATK = 1000 flat DMG
    expect(r1.perHit["low-plunge"]?.flatDmgBonus).toBeCloseTo(1000, 1);
    expect(r1.perHit["high-plunge"]?.flatDmgBonus).toBeCloseTo(1000, 1);
    expect(r1.perHit["volcano-kablam-dmg"]?.flatDmgBonus).toBeCloseTo(1000, 1);

    const r2 = resolveVaresa(varesa, ctxFor("varesa", { stats: { ...baseStats, atk: 2000 }, inputs: { "rainbow-crash": 1, "fiery-passion": 1 } }));
    // Fiery Passion: 180% of ATK = 3600 flat DMG
    expect(r2.perHit["low-plunge"]?.flatDmgBonus).toBeCloseTo(3600, 1);

    const r3 = resolveVaresa(varesa, ctxFor("varesa", { constellationLevel: 1, stats: { ...baseStats, atk: 2000 }, inputs: { "rainbow-crash": 1, "fiery-passion": 0 } }));
    // C1: 180% of ATK = 3600 flat DMG even without Fiery Passion
    expect(r3.perHit["low-plunge"]?.flatDmgBonus).toBeCloseTo(3600, 1);
  });

  it("C4 The Courage to Press On plunge flat DMG and Burst nuke scaling", () => {
    // Neither state active, C4 refinement active: 500% of ATK (max 20000)
    const r1 = resolveVaresa(varesa, ctxFor("varesa", { constellationLevel: 4, stats: { ...baseStats, atk: 2000 }, inputs: { "c4-diligent-refinement": 1 } }));
    // 500% * 2000 = 10,000 flat DMG
    expect(r1.perHit["low-plunge"]?.flatDmgBonus).toBeCloseTo(10000, 1);

    const r2 = resolveVaresa(varesa, ctxFor("varesa", { constellationLevel: 4, stats: { ...baseStats, atk: 5000 }, inputs: { "c4-diligent-refinement": 1 } }));
    // 500% * 5000 = 25,000 -> capped at 20,000 flat DMG
    expect(r2.perHit["low-plunge"]?.flatDmgBonus).toBeCloseTo(20000, 1);

    // If either state is active, Burst kick DMG +100% (2.0x multiplier)
    const r3 = resolveVaresa(varesa, ctxFor("varesa", { constellationLevel: 4, inputs: { "fiery-passion": 1 } }));
    expect(r3.perHit["kick-dmg"]?.baseDmgMultiplier).toBeCloseTo(2.0, 1);
    expect(r3.perHit["fiery-kick-dmg"]?.baseDmgMultiplier).toBeCloseTo(2.0, 1);
  });

  it("C6 A Hero of Justice's Triumph CRIT rate/DMG bonus", () => {
    const r1 = resolveVaresa(varesa, ctxFor("varesa", { constellationLevel: 6 }));
    const plungeGroundHits = ["plunge", "low-plunge", "high-plunge", "volcano-kablam-dmg", "kick-dmg", "fiery-kick-dmg"];
    for (const key of plungeGroundHits) {
      expect(r1.perHit[key]?.critRateBonusPct).toBe(10);
      expect(r1.perHit[key]?.critDmgBonusPct).toBe(100);
    }
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "varesa"));
    expect(rows.length).toBe(180); // 12 hits * 15 levels = 180 rows
  });
});
