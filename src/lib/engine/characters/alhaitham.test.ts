import { describe, it, expect } from "vitest";
import { resolveAlhaitham } from "./alhaitham";
import { alhaitham } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("alhaitham mechanics", () => {
  it("Dendro Infusion conversion on Normal Attack hits", () => {
    // With infusion: element becomes Dendro
    const r1 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { inputs: { "dendro-infusion": 1 } }));
    expect(r1.perHit["1-hit"]?.element).toBe("Dendro");
    expect(r1.perHit["charged"]?.element).toBe("Dendro");

    // Without infusion: element undefined (defaults to physical)
    const r2 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { inputs: { "dendro-infusion": 0 } }));
    expect(r2.perHit["1-hit"]?.element).toBeUndefined();
  });

  it("dual-scaling ATK + EM calculations for Skill and Burst", () => {
    // Level 1 Skill & Burst at EM = 500
    const r1 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", {
      stats: { ...baseStats, em: 500 },
      talentLevels: { skill: 1, burst: 1 }
    }));
    // Rush DMG: (193.6 / 100) * 500 * 0.8 = 774.4
    expect(r1.perHit["rush-dmg"]?.flatDmgBonus).toBeCloseTo(774.4, 1);
    // Projection-1: (67.2 / 100) * 500 * 2.0 = 672.0
    expect(r1.perHit["projection-1"]?.flatDmgBonus).toBeCloseTo(672.0, 1);
    // Burst: (121.6 / 100) * 500 * 0.8 = 486.4
    expect(r1.perHit["burst-dmg"]?.flatDmgBonus).toBeCloseTo(486.4, 1);

    // Level 10 Skill & Burst at EM = 500
    const r10 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", {
      stats: { ...baseStats, em: 500 },
      talentLevels: { skill: 10, burst: 10 }
    }));
    // Rush DMG: (348.48 / 100) * 500 * 0.8 = 1393.92
    expect(r10.perHit["rush-dmg"]?.flatDmgBonus).toBeCloseTo(1393.92, 2);
    // Projection-1: (120.96 / 100) * 500 * 2.0 = 1209.6
    expect(r10.perHit["projection-1"]?.flatDmgBonus).toBeCloseTo(1209.6, 2);
    // Burst: (218.88 / 100) * 500 * 0.8 = 875.52
    expect(r10.perHit["burst-dmg"]?.flatDmgBonus).toBeCloseTo(875.52, 2);
  });

  it("A4 Passive: Mysteries Laid Bare EM-based skill/burst bonus", () => {
    // EM = 500 -> +50% bonus DMG
    const r1 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { stats: { ...baseStats, em: 500 } }));
    expect(r1.perHit["projection-1"]?.bonusDmgPct).toBeCloseTo(50, 1);
    expect(r1.perHit["burst-dmg"]?.bonusDmgPct).toBeCloseTo(50, 1);

    // EM = 1000 -> +100% bonus DMG
    const r2 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { stats: { ...baseStats, em: 1000 } }));
    expect(r2.perHit["projection-1"]?.bonusDmgPct).toBeCloseTo(100, 1);

    // EM = 1200 -> capped at +100% bonus DMG
    const r3 = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { stats: { ...baseStats, em: 1200 } }));
    expect(r3.perHit["projection-1"]?.bonusDmgPct).toBeCloseTo(100, 1);
  });

  it("C2 Rhetoric EM stacks", () => {
    const r = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { inputs: { "alhaitham-c2-stacks": 3 } }));
    expect(r.statDeltas.em).toBe(150);
  });

  it("C4 Elucidation Dendro DMG stacks", () => {
    const r = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { inputs: { "alhaitham-c4-dmg-bonus-stacks": 3 } }));
    expect(r.statDeltas.dmgBonus).toBe(30);
  });

  it("C6 Structuration max mirrors buff", () => {
    const r = resolveAlhaitham(alhaitham, ctxFor("alhaitham", { constellationLevel: 6, inputs: { "alhaitham-c6-crit": 1 } }));
    expect(r.statDeltas.critRate).toBe(10);
    expect(r.statDeltas.critDmg).toBe(70);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "alhaitham"));
    expect(rows.length).toBe(210); // 14 hits * 15 levels = 210 rows
  });
});
