import { describe, it, expect } from "vitest";
import { resolveSandrone } from "./sandrone";
import { sandrone } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";

describe("sandrone mechanics", () => {
  it("Light of Rationalisme: 0.7% per 100 ATK, capped at 14%", () => {
    const r1 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 1000 } }));
    expect(r1.perHit["prism-shot-stellar"]?.directReaction?.baseDmgBonusPct).toBeCloseTo(7);
    const r2 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 2500 } }));
    expect(r2.perHit["prism-shot-stellar"]?.directReaction?.baseDmgBonusPct).toBe(14);
  });
  it("Polestar field: BRC + Cryo DMG bonus by hit count; off → neutral", () => {
    const off = resolveSandrone(sandrone, ctxFor("sandrone"));
    expect(off.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBe(1);
    expect(off.statDeltas.dmgBonus ?? 0).toBe(0);
    const zero = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "polestar-field": 1, "polestar-hits": 0 } }));
    expect(zero.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBe(1);
    expect(zero.statDeltas.dmgBonus).toBe(20);
    const ten = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "polestar-field": 1, "polestar-hits": 10 } }));
    expect(ten.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBeCloseTo(1.9);
    expect(ten.statDeltas.dmgBonus).toBe(38);
  });
  it("C1 adds +30% stellar reaction bonus", () => {
    const r = resolveSandrone(sandrone, ctxFor("sandrone", { constellationLevel: 1 }));
    expect(r.perHit["prism-shot-stellar"]?.directReaction?.reactionBonusPct).toBe(30);
  });
  it("A1 skills and C2 stack buffers", () => {
    const r = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "decoding-over-50": 1, "refined-tactics": 10 } }));
    expect(r.perHit["prism-shot-stellar"]?.baseDmgMultiplier).toBe(4);
    expect(r.perHit["convective-ray-stellar"]?.baseDmgMultiplier).toBe(2);
  });
  it("C2 Beam stacks add CRIT DMG", () => {
    const r = resolveSandrone(sandrone, ctxFor("sandrone", { constellationLevel: 2, inputs: { "c2-beam-stacks": 3 } }));
    expect(r.perHit["condensed-beam-stellar"]?.critDmgBonusPct).toBe(100); // 40 + 20*3
  });
});
