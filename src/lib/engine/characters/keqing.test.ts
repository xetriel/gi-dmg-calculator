import { describe, it, expect } from "vitest";
import { resolveKeqing } from "./keqing";
import { keqing } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("keqing mechanics", () => {
  it("A1 Thundering Penance Electro infusion override", () => {
    const r1 = resolveKeqing(keqing, ctxFor("keqing", {
      inputs: { "a1-electro-infusion": 1 },
    }));
    expect(r1.perHit["1-hit"]?.element).toBe("Electro");
    expect(r1.perHit["charged-1"]?.element).toBe("Electro");
    expect(r1.perHit["plunge"]?.element).toBe("Electro");
  });

  it("A4 Aristocratic Dignity +15% CRIT Rate bonus", () => {
    const r4 = resolveKeqing(keqing, ctxFor("keqing", {
      inputs: { "a4-crit-er-buff": 1 },
    }));
    expect(r4.statDeltas.critRate).toBe(15);
  });

  it("C4 Attunement +25% Base ATK bonus", () => {
    // baseAtk = 323 -> +25% = 80.75
    const r4 = resolveKeqing(keqing, ctxFor("keqing", {
      constellationLevel: 4,
      baseAtk: 323,
      inputs: { "c4-atk-buff": 1 },
    }));
    expect(r4.statDeltas.atk).toBeCloseTo(80.75);
  });

  it("C6 Tenacious Star +24% Electro DMG Bonus at 4 stacks", () => {
    const r6 = resolveKeqing(keqing, ctxFor("keqing", {
      constellationLevel: 6,
      inputs: { "c6-electro-stacks": 4 },
    }));
    expect(r6.statDeltas.electroDmgBonus).toBe(24);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "keqing"));
    expect(rows.length).toBe(252); // 18 hit definitions * 14 levels = 252 rows
  });
});
