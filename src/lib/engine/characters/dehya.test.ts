import { describe, it, expect } from "vitest";
import { resolveDehya } from "./dehya";
import { dehya } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("dehya mechanics", () => {
  it("base dual-scaling flat DMG additions for Skill and Burst", () => {
    // At level 10 skill: indomitable-flame-hp = 10.16% HP.
    // HP = 20,000 -> 10.16% of 20,000 = 2032 flat DMG.
    const r1 = resolveDehya(dehya, ctxFor("dehya", {
      stats: { ...baseStats, hp: 20000, atk: 1500 },
      talentLevels: { normal: 10, skill: 10, burst: 10 },
    }));
    expect(r1.perHit["indomitable-flame"]?.flatDmgBonus).toBeCloseTo(2032);
    // At level 10 burst: flame-manes-fist-hp = 10.15% HP -> 2030 flat DMG.
    expect(r1.perHit["flame-manes-fist"]?.flatDmgBonus).toBeCloseTo(2030);
  });

  it("C1 The Flame Incandescent +20% HP and extra flat DMG", () => {
    // C1 active: baseHp = 15675 -> +20% baseHp = 3135 HP -> total HP = 23135 HP.
    // Indomitable Flame base HP flat DMG: 10.16% of 23135 = 2350.516.
    // C1 Skill bonus flat DMG: 3.6% of 23135 = 832.86.
    // Total flat DMG for Indomitable Flame = 2350.516 + 832.86 = 3183.376.
    const r1 = resolveDehya(dehya, ctxFor("dehya", {
      constellationLevel: 1,
      inputs: { "c1-hp-buff": 1 },
      stats: { ...baseStats, hp: 20000, atk: 1500 },
      baseHp: 15675,
      talentLevels: { normal: 10, skill: 10, burst: 10 },
    }));
    expect(r1.statDeltas.hp).toBe(3135);
    expect(r1.perHit["indomitable-flame"]?.flatDmgBonus).toBeCloseTo(3183.376, 2);
  });

  it("C2 Sand-Blades Glittering Field DMG bonus (+50%)", () => {
    const r1 = resolveDehya(dehya, ctxFor("dehya", {
      constellationLevel: 2,
      inputs: { "c2-field-buff": 1 },
    }));
    expect(r1.perHit["field-dmg"]?.bonusDmgPct).toBe(50);
  });

  it("C6 Burning Claws Burst CRIT Rate & CRIT DMG stacks", () => {
    const r1 = resolveDehya(dehya, ctxFor("dehya", {
      constellationLevel: 6,
      inputs: { "c6-crit-stacks": 4 },
    }));
    expect(r1.perHit["flame-manes-fist"]?.critRateBonusPct).toBe(10);
    expect(r1.perHit["flame-manes-fist"]?.critDmgBonusPct).toBe(60);
    expect(r1.perHit["incineration-drive"]?.critDmgBonusPct).toBe(60);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "dehya"));
    expect(rows.length).toBe(266); // 19 hit definitions * 14 levels = 266 rows
  });
});
