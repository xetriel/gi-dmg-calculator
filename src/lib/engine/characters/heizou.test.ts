import { describe, it, expect } from "vitest";
import { resolveHeizou } from "./heizou";
import { heizou } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("heizou mechanics", () => {
  it("Heartstopper Strike 4 Declension stacks + Conviction flat DMG", () => {
    // Level 10 skill: declension-dmg = 102.38%, conviction-dmg = 204.77%
    // 4 stacks: total bonus % = 4 * 102.38 + 204.77 = 614.29%
    // baseAtk = 225, stats.atk = 775 -> totalAtk = 1000 -> flatDmgBonus = 6142.9
    const r4 = resolveHeizou(heizou, ctxFor("heizou", {
      inputs: { "declension-stacks": 4 },
      levels: { skill: "10" },
      baseAtk: 225,
      stats: { atk: 775 },
    }));
    expect(r4.perHit["skill-dmg"]?.flatDmgBonus).toBeCloseTo(6142.9);
  });

  it("C6 Curious Casefiles CRIT Rate & CRIT DMG bonuses", () => {
    const r4 = resolveHeizou(heizou, ctxFor("heizou", {
      constellationLevel: 6,
      inputs: { "declension-stacks": 4 },
    }));
    expect(r4.perHit["skill-dmg"]?.critRateBonusPct).toBe(16);
    expect(r4.perHit["skill-dmg"]?.critDmgBonusPct).toBe(32);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "heizou"));
    expect(rows.length).toBe(266); // 19 hit definitions * 14 levels = 266 rows
  });
});
