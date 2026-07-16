import { describe, it, expect } from "vitest";
import { resolveFlins } from "./flins";
import { flins } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { resolveMechanics } from "../mechanics";

describe("flins mechanics", () => {
  it("C4 ATK Buff works correctly", () => {
    const rC0 = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 0, baseAtk: 1000 }));
    expect(rC0.statDeltas.atk).toBeUndefined();

    const rC4 = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 4, baseAtk: 1000 }));
    expect(rC4.statDeltas.atk).toBe(200); // 20% of 1000 ATK
  });

  it("A4 and C4 EM buffs work correctly", () => {
    // C0 with 2000 ATK -> EM = min(0.08 * 2000, 160) = 160
    const rC0 = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 0, stats: { ...baseStats, atk: 2000 } }));
    expect(rC0.statDeltas.em).toBe(160);

    // C0 with 1000 ATK -> EM = min(0.08 * 1000, 160) = 80
    const rC0_low = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 0, stats: { ...baseStats, atk: 1000 } }));
    expect(rC0_low.statDeltas.em).toBe(80);

    // C4 with 2000 ATK -> base ATK 800 -> +160 ATK C4 -> 2160 ATK -> EM = min(0.1 * 2160, 220) = 216
    const rC4 = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 4, stats: { ...baseStats, atk: 2000 }, baseAtk: 800 }));
    expect(rC4.statDeltas.em).toBe(216);
  });

  it("Moonsign Benediction sets lunarBaseBonusPct correctly", () => {
    // 1000 ATK -> 7%
    const r1 = resolveMechanics(flins, ctxFor("flins", { stats: { ...baseStats, atk: 1000 } }));
    expect(r1.lunarBaseBonusPct).toBe(7);

    // 2500 ATK -> 14% (capped)
    const r2 = resolveMechanics(flins, ctxFor("flins", { stats: { ...baseStats, atk: 2500 } }));
    expect(r2.lunarBaseBonusPct).toBe(14);
  });

  it("A1 Symphony of Winter sets reaction bonus under Ascendant Gleam", () => {
    const r1 = resolveMechanics(flins, ctxFor("flins", { inputs: { "ascendant-gleam": 1 } }));
    expect(r1.perHit["burst-middle"]?.directReaction?.reactionBonusPct).toBe(20);

    const r2 = resolveMechanics(flins, ctxFor("flins", { inputs: { "ascendant-gleam": 0 } }));
    expect(r2.perHit["burst-middle"]?.directReaction?.reactionBonusPct).toBe(0);
  });

  it("C6 Elevation is applied correctly", () => {
    // C6, Ascendant Gleam off -> 35% elevation (1.35 multiplier)
    const r1 = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 6, inputs: { "ascendant-gleam": 0 } }));
    expect(r1.perHit["burst-middle"]?.baseDmgMultiplier).toBeCloseTo(1.35);

    // C6, Ascendant Gleam on -> 45% elevation (1.45 multiplier)
    const r2 = resolveMechanics(flins, ctxFor("flins", { constellationLevel: 6, inputs: { "ascendant-gleam": 1 } }));
    expect(r2.perHit["burst-middle"]?.baseDmgMultiplier).toBeCloseTo(1.45);
  });

  it("Manifest Flame NA scaling ratios", () => {
    const r = resolveMechanics(flins, ctxFor("flins", { inputs: { "manifest-flame": 1 } }));
    // Manifest Flame 1-Hit level 10 = 104.85%. Original 1-Hit level 10 = 88.41%.
    // baseDmgMultiplier for 1-hit = 104.85 / 88.41 = 1.18595...
    expect(r.perHit["1-hit"]?.baseDmgMultiplier).toBeCloseTo(1.18595);
    // Plunging should be disabled
    expect(r.perHit["plunge"]?.baseDmgMultiplier).toBe(0);
  });
});
