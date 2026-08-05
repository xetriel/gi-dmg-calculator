import { describe, it, expect } from "vitest";
import { resolveItto } from "./itto";
import { itto } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("itto mechanics", () => {
  it("Raging Oni King DEF to ATK conversion & Geo infusion override", () => {
    // Total DEF = 2000
    // Level 10 burst: def-to-atk = 103.68% -> converted ATK = 2073.6
    const r1 = resolveItto(itto, ctxFor("itto", {
      inputs: { "burst-oni-king": 1 },
      levels: { burst: "10" },
      baseDef: 959,
      stats: { ...baseStats, def: 2000 },
    }));
    expect(r1.statDeltas.atk).toBeCloseTo(2073.6);
    expect(r1.perHit["1-hit"]?.element).toBe("Geo");
    expect(r1.perHit["kesagiri-combo"]?.element).toBe("Geo");
  });

  it("A4 Bloodline of the Crimson Oni 35% DEF flat DMG bonus to Arataki Kesagiri", () => {
    // Total DEF = 2000
    // A4 flat DMG = 0.35 * 2000 = 700
    const r1 = resolveItto(itto, ctxFor("itto", {
      baseDef: 959,
      stats: { ...baseStats, def: 2000 },
    }));
    expect(r1.perHit["kesagiri-combo"]?.flatDmgBonus).toBe(700);
    expect(r1.perHit["kesagiri-final"]?.flatDmgBonus).toBe(700);
  });

  it("C6 Arataki Itto, Present! +70% CRIT DMG bonus", () => {
    const r6 = resolveItto(itto, ctxFor("itto", {
      constellationLevel: 6,
    }));
    expect(r6.perHit["kesagiri-combo"]?.critDmgBonusPct).toBe(70);
    expect(r6.perHit["kesagiri-final"]?.critDmgBonusPct).toBe(70);
  });

  it("C4 Jailhouse Bread and Butter +20% DEF & +20% ATK party buff", () => {
    // baseDef = 959 -> +20% = 191.8; baseAtk = 227 -> +20% = 45.4
    const r4 = resolveItto(itto, ctxFor("itto", {
      constellationLevel: 4,
      baseDef: 959,
      baseAtk: 227,
      inputs: { "c4-party-buff": 1 },
    }));
    expect(r4.statDeltas.def).toBeCloseTo(191.8);
    expect(r4.statDeltas.atk).toBeCloseTo(45.4);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "itto"));
    expect(rows.length).toBe(168); // 12 hit definitions * 14 levels = 168 rows
  });
});
