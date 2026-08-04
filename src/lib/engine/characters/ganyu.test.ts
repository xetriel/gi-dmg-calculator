import { describe, it, expect } from "vitest";
import { resolveGanyu } from "./ganyu";
import { ganyu } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("ganyu mechanics", () => {
  it("A1 Undivided Heart +20% CRIT Rate to Frostflake Arrow & Bloom", () => {
    const r1 = resolveGanyu(ganyu, ctxFor("ganyu", {
      inputs: { "a1-crit-buff": 1 },
    }));
    expect(r1.perHit["frostflake-arrow"]?.critRateBonusPct).toBe(20);
    expect(r1.perHit["frostflake-bloom"]?.critRateBonusPct).toBe(20);
  });

  it("A4 Harmony Between Heaven and Earth +20% Cryo DMG Bonus", () => {
    const r1 = resolveGanyu(ganyu, ctxFor("ganyu", {
      inputs: { "a4-cryo-buff": 1 },
    }));
    expect(r1.statDeltas.cryoDmgBonus).toBe(20);
  });

  it("C1 Dew-Drinker -15% Cryo RES Shred", () => {
    const r1 = resolveGanyu(ganyu, ctxFor("ganyu", {
      constellationLevel: 1,
      inputs: { "c1-cryo-res-shred": 1 },
    }));
    expect(r1.statDeltas.enemyRes).toBe(-15);
  });

  it("C4 Westward Sojourn DMG stacks (+5% per stack)", () => {
    const r5 = resolveGanyu(ganyu, ctxFor("ganyu", {
      constellationLevel: 4,
      inputs: { "c4-dmg-stacks": 5 },
    }));
    expect(r5.statDeltas.dmgBonus).toBe(25);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "ganyu"));
    expect(rows.length).toBe(210); // 15 hit definitions * 14 levels = 210 rows
  });
});
