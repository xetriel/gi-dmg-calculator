import { describe, it, expect } from "vitest";
import { resolveZibai } from "./zibai";
import { zibai } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { resolveMechanics } from "../mechanics";

describe("zibai mechanics", () => {
  it("A4 Layered Peaks gives DEF and EM bonuses", () => {
    const r = resolveZibai(zibai, ctxFor("zibai", { baseDef: 1000, inputs: { "geo-allies": 2, "hydro-allies": 1 } }));
    expect(r.statDeltas.def).toBe(300); // 15% * 1000 * 2
    expect(r.statDeltas.em).toBe(60); // 60 * 1
  });
  it("Moonsign Benediction sets lunarBaseBonusPct by DEF", () => {
    const r1 = resolveZibai(zibai, ctxFor("zibai", { stats: { ...baseStats, def: 1000 } }));
    expect(r1.lunarBaseBonusPct).toBe(7); // 0.7 * 10
    const r2 = resolveZibai(zibai, ctxFor("zibai", { stats: { ...baseStats, def: 1000 }, baseDef: 1000, inputs: { "geo-allies": 2 } }));
    expect(r2.statDeltas.def).toBe(300); // 300 delta + 1000 base -> 1300 DEF -> 9.1%
    expect(r2.lunarBaseBonusPct).toBeCloseTo(9.1, 1);
  });
  it("A1 and constellations (C1, C2, C4, C6) apply modifiers", () => {
    // C0 with A1 active
    const rA1 = resolveZibai(zibai, ctxFor("zibai", { stats: { ...baseStats, def: 1000 }, inputs: { "moonfall": 1 } }));
    expect(rA1.perHit["spirit-steed-2"]?.flatDmgBonus).toBe(600); // 60% of 1000 DEF

    // C2 active
    const rC2 = resolveZibai(zibai, ctxFor("zibai", { constellationLevel: 2, stats: { ...baseStats, def: 1000 }, inputs: { "moonfall": 1 } }));
    expect(rC2.perHit["spirit-steed-2"]?.flatDmgBonus).toBe(6100); // 60% + 550% = 610% of 1000 DEF
    expect(rC2.perHit["spirit-steed-2"]?.directReaction?.reactionBonusPct).toBe(30);

    // C1 first stride
    const rC1 = resolveZibai(zibai, ctxFor("zibai", { constellationLevel: 1, inputs: { "c1-first-stride": 1 } }));
    expect(rC1.perHit["spirit-steed-2"]?.baseDmgMultiplier).toBeCloseTo(3.2);

    // C4 scattermoon
    const rC4 = resolveZibai(zibai, ctxFor("zibai", { constellationLevel: 4, inputs: { "c4-scattermoon": 1 } }));
    expect(rC4.perHit["4-hit-additional"]?.baseDmgMultiplier).toBeCloseTo(2.5);

    // C6 radiance
    const rC6 = resolveZibai(zibai, ctxFor("zibai", { constellationLevel: 6, inputs: { "c6-radiance": 85 } }));
    // (85 - 70) * 1.6% = 24% bonus -> multiplier 1.24
    expect(rC6.perHit["spirit-steed-1"]?.baseDmgMultiplier).toBeCloseTo(1.24);
    expect(rC6.perHit["spirit-steed-2"]?.baseDmgMultiplier).toBeCloseTo(1.24);
  });
});
