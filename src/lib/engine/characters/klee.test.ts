import { describe, it, expect } from "vitest";
import { resolveKlee } from "./klee";
import { klee } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("klee mechanics", () => {
  it("Hexerei Secret Rite +15% Pyro DMG and Boom Badges multiplier (150% at 3 stacks)", () => {
    const r1 = resolveKlee(klee, ctxFor("klee", {
      inputs: { "hexerei-secret-rite": 1, "hexerei-boom-badges": 3 },
    }));
    expect(r1.statDeltas.pyroDmgBonus).toBe(15);
    expect(r1.perHit["charged"]?.baseDmgMultiplier).toBe(1.5);
  });

  it("A1 Pounding Surprise +50% Charged Attack DMG Bonus", () => {
    const r1 = resolveKlee(klee, ctxFor("klee", {
      inputs: { "a1-explosive-spark": 1 },
    }));
    expect(r1.perHit["charged"]?.bonusDmgPct).toBe(50);
  });

  it("C1 Chained Reaction +60% Base ATK buff", () => {
    // baseAtk = 311 -> +60% = 186.6
    const r1 = resolveKlee(klee, ctxFor("klee", {
      constellationLevel: 1,
      baseAtk: 311,
      inputs: { "c1-atk-buff": 1 },
    }));
    expect(r1.statDeltas.atk).toBeCloseTo(186.6);
  });

  it("C2 Explosive Frags -23% DEF shred", () => {
    const r2 = resolveKlee(klee, ctxFor("klee", {
      constellationLevel: 2,
      inputs: { "c2-def-shred": 1 },
    }));
    expect(r2.statDeltas.defReduction).toBe(23);
  });

  it("C4 Sparkly Explosion +100% DMG bonus when on-field", () => {
    const r4 = resolveKlee(klee, ctxFor("klee", {
      constellationLevel: 4,
      inputs: { "c4-on-field": 1 },
    }));
    expect(r4.perHit["c4-sparkly-explosion"]?.bonusDmgPct).toBe(100);
  });

  it("C6 Blazing Delight +10% Pyro DMG Bonus", () => {
    const r6 = resolveKlee(klee, ctxFor("klee", {
      constellationLevel: 6,
      inputs: { "c6-pyro-buff": 1 },
    }));
    expect(r6.statDeltas.pyroDmgBonus).toBe(10);
  });

  it("C1 & C4 hit zeroing at lower constellations", () => {
    const r0 = resolveKlee(klee, ctxFor("klee", { constellationLevel: 0 }));
    expect(r0.perHit["c1-chained-reaction"]?.baseDmgMultiplier).toBe(0);
    expect(r0.perHit["c4-sparkly-explosion"]?.baseDmgMultiplier).toBe(0);

    const r3 = resolveKlee(klee, ctxFor("klee", { constellationLevel: 3 }));
    expect(r3.perHit["c1-chained-reaction"]?.baseDmgMultiplier).toBeUndefined();
    expect(r3.perHit["c4-sparkly-explosion"]?.baseDmgMultiplier).toBe(0);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "klee"));
    expect(rows.length).toBe(168); // 12 hit definitions * 14 levels = 168 rows
  });
});
