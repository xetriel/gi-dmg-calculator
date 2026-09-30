import { describe, it, expect } from "vitest";
import { resolveCandace } from "./candace";
import { candace } from "../../../data/registry/characters/candace";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("Candace mechanics resolver", () => {
  it("Prayer of the Crimson Crown off: normal attacks remain non-infused and receive no bonus DMG", () => {
    const res = resolveCandace(candace, ctxFor("candace", {
      inputs: { "prayer-of-crimson-crown": 0 },
    }));
    expect(res.perHit["1-hit"]?.element).toBeUndefined();
    expect(res.perHit["1-hit"]?.bonusDmgPct).toBeUndefined();
  });

  it("Prayer of the Crimson Crown active: normal attacks gain Hydro infusion and +20% base + A4 DMG Bonus", () => {
    // 30,000 Max HP -> A4 = 30,000 / 1000 * 0.5 = 15% -> total = 35%
    const res = resolveCandace(candace, ctxFor("candace", {
      stats: { ...baseStats, hp: 30000 },
      baseHp: 10875,
      inputs: { "prayer-of-crimson-crown": 1 },
    }));

    // Infusion check
    expect(res.perHit["1-hit"]?.element).toBe("Hydro");
    expect(res.perHit["charged"]?.element).toBe("Hydro");
    expect(res.perHit["plunge"]?.element).toBe("Hydro");

    // Normal attack bonus check
    expect(res.perHit["1-hit"]?.bonusDmgPct).toBe(35);
    expect(res.perHit["2-hit"]?.bonusDmgPct).toBe(35);
    expect(res.perHit["3-hit-1"]?.bonusDmgPct).toBe(35);
    expect(res.perHit["3-hit-2"]?.bonusDmgPct).toBe(35);
    expect(res.perHit["4-hit"]?.bonusDmgPct).toBe(35);

    // Charged and plunge should not receive normalDmgBonus
    expect(res.perHit["charged"]?.bonusDmgPct).toBeUndefined();
    expect(res.perHit["plunge"]?.bonusDmgPct).toBeUndefined();
  });

  it("C2 Moon-Piercing Brilliance: +20% Base HP bonus when active at C2+", () => {
    // baseHp = 10,875 -> 20% = 2,175
    const res = resolveCandace(candace, ctxFor("candace", {
      constellationLevel: 2,
      baseHp: 10875,
      inputs: { "c2-max-hp-buff": 1, "prayer-of-crimson-crown": 0 },
    }));
    expect(res.statDeltas.hp).toBe(2175);
  });

  it("C2 Moon-Piercing Brilliance: inactive when constellation < 2", () => {
    const res = resolveCandace(candace, ctxFor("candace", {
      constellationLevel: 1,
      baseHp: 10875,
      inputs: { "c2-max-hp-buff": 1 },
    }));
    expect(res.statDeltas.hp).toBeUndefined();
  });

  it("C6 The Overflow: disabled (baseDmgMultiplier = 0) below C6", () => {
    const res = resolveCandace(candace, ctxFor("candace", {
      constellationLevel: 5,
    }));
    expect(res.perHit["c6-the-overflow"]?.baseDmgMultiplier).toBe(0);
  });

  it("C6 The Overflow: enabled at C6", () => {
    const res = resolveCandace(candace, ctxFor("candace", {
      constellationLevel: 6,
    }));
    expect(res.perHit["c6-the-overflow"]?.baseDmgMultiplier).toBeUndefined();
    expect(res.notes.some(n => n.includes("C6 The Overflow"))).toBe(true);
  });

  it("talent seed row count matches 15 hits x 14 levels = 210 rows", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "candace"));
    expect(rows.length).toBe(210);
  });
});
