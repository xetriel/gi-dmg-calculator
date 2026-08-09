import { describe, it, expect } from "vitest";
import { resolveLyney } from "./lyney";
import { lyney } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";
import { computeHit } from "../damage";

describe("lyney mechanics", () => {
  it("Genshin Optimizer benchmark: Skill DMG 1822.6 at Lv9, 503.53 ATK, 5 Prop Surplus stacks", () => {
    const testStats = {
      ...baseStats,
      atk: 503.53,
      critRate: 24.2,
      critDmg: 50,
      enemyRes: 10,
      levelChar: 90,
      levelEnemy: 100,
    };
    const ctx = ctxFor("lyney", {
      stats: testStats,
      talentLevels: { skill: 9 },
      inputs: { "prop-surplus-stacks": 5, "a4-pyro-members": 0 },
    });
    const mechRes = resolveLyney(lyney, ctx);
    expect(mechRes.perHit["skill-dmg"]?.flatDmgBonus).toBeCloseTo(2275.9556, 2);

    const mergedStats = { ...testStats };
    for (const [k, v] of Object.entries(mechRes.statDeltas)) {
      (mergedStats as any)[k] = ((mergedStats as any)[k] ?? 0) + v;
    }

    // Compute final damage hit output
    const hitRes = computeHit(
      mergedStats,
      {
        multiplier: 284.2,
        scaling: "atk",
        element: "Pyro",
        reaction: "none",
        reactionBonusPct: 0,
        flatDmgBonus: mechRes.perHit["skill-dmg"]?.flatDmgBonus,
        hitCategory: "skill",
      }
    );
    expect(hitRes.avg).toBeCloseTo(1822.0, 0);
  });

  it("A1 Perilous Performance +80% ATK flat DMG to Pyrotechnic Strike", () => {
    const r1 = resolveLyney(lyney, ctxFor("lyney", {
      stats: { atk: 2000 } as any,
      inputs: { "a1-hp-consumed": 1 },
    }));
    expect(r1.perHit["pyrotechnic-strike"]?.flatDmgBonus).toBe(1600);
    expect(r1.perHit["c6-reprise"]?.flatDmgBonus).toBe(1600);
  });

  it("A4 Conclusive Ovation +60% / +80% / +100% Pyro DMG Bonus", () => {
    const r1 = resolveLyney(lyney, ctxFor("lyney", { inputs: { "a4-pyro-members": 1 } }));
    expect(r1.statDeltas.pyroDmgBonus).toBe(60);

    const r2 = resolveLyney(lyney, ctxFor("lyney", { inputs: { "a4-pyro-members": 2 } }));
    expect(r2.statDeltas.pyroDmgBonus).toBe(80);

    const r3 = resolveLyney(lyney, ctxFor("lyney", { inputs: { "a4-pyro-members": 3 } }));
    expect(r3.statDeltas.pyroDmgBonus).toBe(100);
  });

  it("C2 Crisp Focus +60% CRIT DMG at 3 stacks", () => {
    const r2 = resolveLyney(lyney, ctxFor("lyney", {
      constellationLevel: 2,
      inputs: { "c2-focus-stacks": 3 },
    }));
    expect(r2.statDeltas.critDmg).toBe(60);
  });

  it("C4 Well-Rehearsed Verses -20% Pyro RES shred", () => {
    const r4 = resolveLyney(lyney, ctxFor("lyney", {
      constellationLevel: 4,
      inputs: { "c4-pyro-res-shred": 1 },
    }));
    expect(r4.statDeltas.enemyRes).toBe(-20);
  });

  it("C6 Reprise hit zeroing below C6", () => {
    const r0 = resolveLyney(lyney, ctxFor("lyney", { constellationLevel: 5 }));
    expect(r0.perHit["c6-reprise"]?.baseDmgMultiplier).toBe(0);

    const r6 = resolveLyney(lyney, ctxFor("lyney", { constellationLevel: 6 }));
    expect(r6.perHit["c6-reprise"]?.baseDmgMultiplier).toBeUndefined();
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "lyney"));
    expect(rows.length).toBe(238); // 17 hit definitions * 14 levels = 238 rows
  });
});
