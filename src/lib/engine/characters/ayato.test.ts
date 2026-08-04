import { describe, it, expect } from "vitest";
import { resolveAyato } from "./ayato";
import { ayato } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("ayato mechanics", () => {
  it("Namisen stacks flat DMG calculation", () => {
    // At level 10 skill, namisen-increase is 0.56% Max HP per stack.
    // HP = 20,000 -> 0.56% of 20,000 = 112 per stack.
    // 4 stacks -> 4 * 112 = 448 flat DMG to Shunsuiken.
    const r1 = resolveAyato(ayato, ctxFor("ayato", {
      inputs: { "namisen-stacks": 4 },
      stats: { hp: 20000 },
      levels: { skill: "10" },
    }));
    expect(r1.perHit["shunsuiken-1"]?.flatDmgBonus).toBeCloseTo(448);
    expect(r1.perHit["shunsuiken-2"]?.flatDmgBonus).toBeCloseTo(448);
    expect(r1.perHit["shunsuiken-3"]?.flatDmgBonus).toBeCloseTo(448);

    // 0 stacks -> 0 flat DMG
    const r2 = resolveAyato(ayato, ctxFor("ayato", {
      inputs: { "namisen-stacks": 0 },
      stats: { hp: 20000 },
      levels: { skill: "10" },
    }));
    expect(r2.perHit["shunsuiken-1"]?.flatDmgBonus).toBeUndefined();
  });

  it("C1 Kyouka Fushi Shunsuiken DMG bonus", () => {
    const r1 = resolveAyato(ayato, ctxFor("ayato", {
      constellationLevel: 1,
      inputs: { "c1-low-hp-buff": 1 },
    }));
    expect(r1.perHit["shunsuiken-1"]?.bonusDmgPct).toBe(40);
    expect(r1.perHit["shunsuiken-2"]?.bonusDmgPct).toBe(40);
    expect(r1.perHit["shunsuiken-3"]?.bonusDmgPct).toBe(40);
  });

  it("C2 World Source Max HP bonus", () => {
    // C2 active with >= 3 stacks -> +50% Base HP
    const r1 = resolveAyato(ayato, ctxFor("ayato", {
      constellationLevel: 2,
      inputs: { "namisen-stacks": 5, "c2-hp-buff": 1 },
    }));
    expect(r1.statDeltas.hp).toBe(6857.5);

    // C2 with < 3 stacks -> no HP bonus
    const r2 = resolveAyato(ayato, ctxFor("ayato", {
      constellationLevel: 2,
      inputs: { "namisen-stacks": 2, "c2-hp-buff": 1 },
    }));
    expect(r2.statDeltas.hp).toBeUndefined();
  });

  it("Suiyuu Burst Field NA DMG Bonus", () => {
    const r1 = resolveAyato(ayato, ctxFor("ayato", {
      inputs: { "burst-na-buff": 1 },
      levels: { burst: "10" },
    }));
    expect(r1.statDeltas.normalDmgBonus).toBe(11);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "ayato"));
    expect(rows.length).toBe(238); // 17 hit definitions * 14 levels = 238 rows
  });
});
