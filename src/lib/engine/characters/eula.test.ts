import { describe, it, expect } from "vitest";
import { resolveEula } from "./eula";
import { eula } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("eula mechanics", () => {
  it("Grimheart stacks DEF% bonus (+30% per stack)", () => {
    const r1 = resolveEula(eula, ctxFor("eula", {
      inputs: { "grimheart-stacks": 1 },
      baseDef: 751,
    }));
    expect(r1.statDeltas.def).toBeCloseTo(225.3);

    const r2 = resolveEula(eula, ctxFor("eula", {
      inputs: { "grimheart-stacks": 2 },
      baseDef: 751,
    }));
    expect(r2.statDeltas.def).toBeCloseTo(450.6);
  });

  it("Hold Skill RES Shred (-25% enemy RES)", () => {
    const r1 = resolveEula(eula, ctxFor("eula", {
      inputs: { "hold-res-shred": 1 },
    }));
    expect(r1.statDeltas.enemyRes).toBe(-25);
  });

  it("C1 Tidal Illusion (+30% Physical DMG Bonus)", () => {
    const r1 = resolveEula(eula, ctxFor("eula", {
      constellationLevel: 1,
      inputs: { "c1-phys-buff": 1 },
    }));
    expect(r1.statDeltas.physicalDmgBonus).toBe(30);
  });

  it("Lightfall Sword energy stack accumulation flat DMG", () => {
    // Level 10 burst: lightfall-stack = 135% ATK
    // 15 energy stacks: flatDmgBonus = 15 * 1.35 * totalAtk (342 base + 1000 atk = 1342 totalAtk -> 15 * 1.35 * 1342 = 27175.5)
    const r15 = resolveEula(eula, ctxFor("eula", {
      inputs: { "lightfall-energy-stacks": 15 },
      levels: { burst: "10" },
      baseAtk: 342,
      stats: { atk: 1000 },
    }));
    expect(r15.perHit["lightfall-base"]?.flatDmgBonus).toBeCloseTo(27175.5);
  });

  it("C4 +25% DMG to Lightfall Swords vs opponents < 50% HP", () => {
    const r4 = resolveEula(eula, ctxFor("eula", {
      constellationLevel: 4,
      inputs: { "c4-low-hp-buff": 1 },
    }));
    expect(r4.perHit["lightfall-base"]?.bonusDmgPct).toBe(25);
    expect(r4.perHit["shattered-lightfall"]?.bonusDmgPct).toBe(25);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "eula"));
    expect(rows.length).toBe(238); // 17 hit definitions * 14 levels = 238 rows
  });
});
