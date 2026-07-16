import { describe, it, expect } from "vitest";
import { resolveNefer } from "./nefer";
import { nefer } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { resolveMechanics } from "../mechanics";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("nefer mechanics", () => {
  it("A1/C2 EM bonus activation", () => {
    // A1: +100 EM at 3 stacks
    const r1 = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 0, inputs: { "veil-stacks": 3 } }));
    expect(r1.statDeltas.em).toBe(100);

    // C2: +200 EM at 5 stacks
    const r2 = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 2, inputs: { "veil-stacks": 5 } }));
    expect(r2.statDeltas.em).toBe(200);

    // Caps stacks without C2 to 3, so EM is 100
    const r3 = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 0, inputs: { "veil-stacks": 5 } }));
    expect(r3.statDeltas.em).toBe(100);
  });

  it("Dusklit Eaves: base damage bonus is EM-scaled", () => {
    const r1 = resolveMechanics(nefer, ctxFor("nefer", { stats: { ...baseStats, em: 400 } }));
    expect(r1.lunarBaseBonusPct).toBeCloseTo(7.0);

    const r2 = resolveMechanics(nefer, ctxFor("nefer", { stats: { ...baseStats, em: 900 } }));
    expect(r2.lunarBaseBonusPct).toBeCloseTo(14.0);
  });

  it("Phantasm Performance split-scaling (Nefer hits)", () => {
    const r = resolveMechanics(nefer, ctxFor("nefer", { stats: { ...baseStats, atk: 2000, em: 500 }, inputs: { "veil-stacks": 0 } }));
    // 1-hit EM at lvl 10 = 88.7. ATK part = 2000 * (44.35 / 100) = 887.
    // baseDmgMult = 1
    expect(r.perHit["phantasm-1-nefer"]?.baseDmgMultiplier).toBeCloseTo(1);
    expect(r.perHit["phantasm-1-nefer"]?.flatDmgBonus).toBeCloseTo(887);
  });

  it("C1 flat DMG bonus on Shades' hits", () => {
    const r = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 1, stats: { ...baseStats, em: 500 }, inputs: { "veil-stacks": 0 } }));
    // C1: 60% EM flat, boosted by Veil (1.0) & Elevation (1.0).
    // 0.6 * 500 = 300.
    expect(r.perHit["phantasm-1-shades"]?.flatDmgBonus).toBeCloseTo(300);
  });

  it("C2 1.4x multiplier and stack scaling", () => {
    const r = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 2, stats: { ...baseStats, em: 500 }, inputs: { "veil-stacks": 5 } }));
    // baseDmgMult = (1 + 0.08 * 5) * 1.4 = 1.4 * 1.4 = 1.96.
    expect(r.perHit["phantasm-1-nefer"]?.baseDmgMultiplier).toBeCloseTo(1.96);
  });

  it("C4 RES reduction during Shadow Dance", () => {
    const r = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 4, inputs: { "shadow-dance": 1, "c4-res-shred": 1 } }));
    expect(r.statDeltas.enemyRes).toBe(-20);
  });

  it("C6 converted and extra hits, and elevation under Ascendant Gleam", () => {
    const r = resolveMechanics(nefer, ctxFor("nefer", { constellationLevel: 6, inputs: { "veil-stacks": 3, "ascendant-gleam": 1 } }));
    // phantasm-2-nefer baseDmgMultiplier is 0 (converted)
    expect(r.perHit["phantasm-2-nefer"]?.baseDmgMultiplier).toBe(0);

    // c6-converted is direct reaction with 1.15 elevation multiplier
    // baseDmgMult = (1 + 0.08 * 3) * 1.4 = 1.736 (C2 is active)
    // elevationMult = 1.15
    // baseDmgMultiplier = 1.736 * 1.15 = 1.9964
    expect(r.perHit["c6-converted"]?.baseDmgMultiplier).toBeCloseTo(1.9964);
    expect(r.perHit["c6-extra"]?.baseDmgMultiplier).toBeCloseTo(1.9964);
  });

  it("Burst DMG stack bonus and split scaling", () => {
    const r = resolveMechanics(nefer, ctxFor("nefer", { stats: { ...baseStats, atk: 2000 }, inputs: { "veil-stacks": 3 } }));
    // burst-dmg-bonus at level 10 is 40.
    // total burst bonus = 40 * 3 = 120.
    expect(r.perHit["burst-1-hit"]?.bonusDmgPct).toBe(120);
    // ATK part: lvl 10 burst-1-hit EM = 808.7. ATK part = 2000 * 404.35 / 100 = 8087.
    expect(r.perHit["burst-1-hit"]?.flatDmgBonus).toBeCloseTo(8087);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "nefer"));
    expect(rows.length).toBe(231);
  });
});
