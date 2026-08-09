import { describe, it, expect } from "vitest";
import { resolveXinyan } from "./xinyan";
import { xinyan } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("xinyan mechanics", () => {
  it("A4 Shield active grants +15% Physical DMG Bonus", () => {
    const r1 = resolveXinyan(xinyan, ctxFor("xinyan", {
      inputs: { "shield-active": 1 },
    }));
    expect(r1.statDeltas.physicalDmgBonus).toBe(15);
  });

  it("C2 Impromptu Opening grants +100% CRIT Rate on Burst Physical DMG", () => {
    const r2 = resolveXinyan(xinyan, ctxFor("xinyan", {
      constellationLevel: 2,
      inputs: { "c2-burst-crit": 1 },
    }));
    expect(r2.perHit["burst-physical"]?.critRateBonusPct).toBe(100);
  });

  it("C4 Wildfire Rhythm note", () => {
    const r4 = resolveXinyan(xinyan, ctxFor("xinyan", {
      constellationLevel: 4,
      inputs: { "c4-phys-shred": 1 },
    }));
    expect(r4.notes.some(n => n.includes("C4"))).toBe(true);
  });

  it("C6 Rockin' in a Wild World converts 50% DEF to ATK", () => {
    const r6 = resolveXinyan(xinyan, ctxFor("xinyan", {
      stats: { ...baseStats, def: 1000 },
      constellationLevel: 6,
      inputs: { "c6-charged-atk-bonus": 1 },
    }));
    expect(r6.statDeltas.atk).toBe(500); // 50% of 1000 DEF = 500 ATK
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "xinyan"));
    expect(rows.length).toBe(182); // 13 hit definitions * 14 levels = 182 rows
  });
});
