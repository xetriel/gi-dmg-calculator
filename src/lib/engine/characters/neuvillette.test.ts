import { describe, it, expect } from "vitest";
import { resolveNeuvillette } from "./neuvillette";
import { neuvillette } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";

describe("mechanics: Neuvillette", () => {
  it("Draconic stacks multiply Equitable Judgment only", () => {
    const r = resolveNeuvillette(neuvillette, ctxFor("neuvillette", { inputs: { "draconic-stacks": 3, "current-hp": 0 } }));
    expect(r.perHit["equitable-judgment"].baseDmgMultiplier).toBeCloseTo(1.6);
    expect(r.perHit["1-hit"]).toBeUndefined();
  });
  it("C1 adds a stack (capped at 3); C2 adds 14% CRIT DMG per stack", () => {
    const r = resolveNeuvillette(neuvillette, ctxFor("neuvillette", { constellationLevel: 2, inputs: { "draconic-stacks": 2, "current-hp": 0 } }));
    expect(r.perHit["equitable-judgment"].baseDmgMultiplier).toBeCloseTo(1.6); // 2+1 -> 3
    expect(r.perHit["equitable-judgment"].critDmgBonusPct).toBe(42);
  });
  it("A4 current-HP Hydro bonus caps at +30%", () => {
    expect(resolveNeuvillette(neuvillette, ctxFor("neuvillette", { inputs: { "current-hp": 100 } })).statDeltas.dmgBonus).toBe(30);
    expect(resolveNeuvillette(neuvillette, ctxFor("neuvillette", { inputs: { "current-hp": 60 } })).statDeltas.dmgBonus).toBeCloseTo(18);
    expect(resolveNeuvillette(neuvillette, ctxFor("neuvillette", { inputs: { "current-hp": 30 } })).statDeltas.dmgBonus).toBeUndefined();
  });
});
