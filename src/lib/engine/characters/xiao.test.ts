import { describe, it, expect } from "vitest";
import { resolveXiao } from "./xiao";
import { xiao } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";
import { computeHit } from "../damage";

describe("xiao mechanics", () => {
  it("Burst active grants Anemo infusion & Plunging DMG Bonus", () => {
    const r1 = resolveXiao(xiao, ctxFor("xiao", {
      talentLevels: { burst: 10 },
      inputs: { "burst-active": 1 },
    }));
    expect(r1.perHit["high-plunge"]?.element).toBe("Anemo");
    expect(r1.perHit["high-plunge"]?.bonusDmgPct).toBe(95.2);
    expect(r1.perHit["1-hit-1"]?.element).toBe("Anemo");
    expect(r1.perHit["charged"]?.element).toBe("Anemo");
  });

  it("A1 Tamer of Demons +25% DMG Bonus at 5 stacks", () => {
    const r1 = resolveXiao(xiao, ctxFor("xiao", {
      inputs: { "a1-dmg-stacks": 5 },
    }));
    expect(r1.statDeltas.anemoDmgBonus).toBe(25);
  });

  it("A4 Dissolution Eon +45% Skill DMG Bonus at 3 stacks", () => {
    const r1 = resolveXiao(xiao, ctxFor("xiao", {
      inputs: { "a4-skill-stacks": 3 },
    }));
    expect(r1.perHit["skill-dmg"]?.bonusDmgPct).toBe(45);
  });

  it("C2 Annihilation Eon +25% ER off-field", () => {
    const r2 = resolveXiao(xiao, ctxFor("xiao", {
      constellationLevel: 2,
      inputs: { "c2-off-field-er": 1 },
    }));
    expect(r2.statDeltas.energyRecharge).toBe(25);
  });

  it("C4 Transcendent Eon +100% Base DEF", () => {
    const r4 = resolveXiao(xiao, ctxFor("xiao", {
      baseDef: 799,
      constellationLevel: 4,
      inputs: { "c4-low-hp-def": 1 },
    }));
    expect(r4.statDeltas.def).toBe(799);
  });

  it("Genshin Optimizer High Plunge benchmark calculation", () => {
    const testStats = {
      ...baseStats,
      atk: 2712.5,
      critRate: 95.4,
      critDmg: 229.9,
      anemoDmgBonus: 99.8,
      plungeDmgBonus: 28.0, // 28.0% (Xianyun) + 95.2% (Burst) = 123.2% total
      dmgBonus: 126.0,
      enemyRes: -10, // -20% / 2 = -10%
      levelChar: 90,
      levelEnemy: 100,
    };
    const ctx = ctxFor("xiao", {
      stats: testStats,
      talentLevels: { normal: 11, burst: 10 },
      inputs: { "burst-active": 1, "a1-dmg-stacks": 5 },
    });
    const mechRes = resolveXiao(xiao, ctx);
    const mergedStats = { ...testStats };
    for (const [k, v] of Object.entries(mechRes.statDeltas)) {
      (mergedStats as any)[k] = ((mergedStats as any)[k] ?? 0) + v;
    }

    const hitRes = computeHit(
      mergedStats,
      {
        multiplier: 404.0,
        scaling: "atk",
        element: mechRes.perHit["high-plunge"]?.element ?? "Anemo",
        charElement: "Anemo",
        dmgBonusLabel: "Anemo DMG Bonus%",
        reaction: "none",
        reactionBonusPct: 0,
        flatDmgBonus: 17056,
        bonusDmgPct: mechRes.perHit["high-plunge"]?.bonusDmgPct,
        hitCategory: "plunge",
      }
    );
    expect(hitRes.avg).toBeCloseTo(215206, -4); // Within 1% of GO benchmark
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "xiao"));
    expect(rows.length).toBe(196); // 14 hit definitions * 14 levels = 196 rows
  });
});
