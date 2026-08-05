import { describe, it, expect } from "vitest";
import { resolveKaveh } from "./kaveh";
import { kaveh } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("kaveh mechanics", () => {
  it("Painted Dome Dendro infusion override", () => {
    const r1 = resolveKaveh(kaveh, ctxFor("kaveh", {
      inputs: { "burst-painted-dome": 1 },
    }));
    expect(r1.perHit["1-hit"]?.element).toBe("Dendro");
    expect(r1.perHit["charged-spin"]?.element).toBe("Dendro");
    expect(r1.perHit["plunge"]?.element).toBe("Dendro");
  });

  it("A4 A Craftsman's Curious Conceptions +100 EM at 4 stacks", () => {
    const r4 = resolveKaveh(kaveh, ctxFor("kaveh", {
      inputs: { "a4-em-stacks": 4 },
    }));
    expect(r4.statDeltas.em).toBe(100);
  });

  it("C6 Pairidaeza's Dreams note present at C6", () => {
    const r6 = resolveKaveh(kaveh, ctxFor("kaveh", {
      constellationLevel: 6,
    }));
    expect(r6.notes.some(n => n.includes("Pairidaeza's Light"))).toBe(true);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "kaveh"));
    expect(rows.length).toBe(182); // 13 hit definitions * 14 levels = 182 rows
  });
});
