import { describe, it, expect } from "vitest";
import { resolveMualani } from "./mualani";
import { mualani } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("mualani mechanics", () => {
  it("A1 Wave-Surfing's Passion +45% Max HP flat DMG at 3 stacks across all Sharky's Bite hit variants", () => {
    // effHp = 20000 -> 45% = 9000 flat DMG
    const r1 = resolveMualani(mualani, ctxFor("mualani", {
      stats: { ...baseStats, hp: 20000 },
      inputs: { "a1-pufferfish-stacks": 3 },
    }));
    expect(r1.perHit["shark-bite"]?.flatDmgBonus).toBe(9000);
    expect(r1.perHit["shark-bite-1"]?.flatDmgBonus).toBe(9000);
    expect(r1.perHit["shark-bite-2"]?.flatDmgBonus).toBe(9000);
    expect(r1.perHit["surging-bite"]?.flatDmgBonus).toBe(9000);
  });

  it("A4 Till the Final Wave +30% Max HP flat Burst DMG at 2 stacks", () => {
    // effHp = 20000 -> 30% = 6000 flat DMG
    const r4 = resolveMualani(mualani, ctxFor("mualani", {
      stats: { ...baseStats, hp: 20000 },
      inputs: { "a4-nightsoul-burst-stacks": 2 },
    }));
    expect(r4.perHit["burst-dmg"]?.flatDmgBonus).toBe(6000);
  });

  it("C1 The Leisurely \"Meztli\" +66% Max HP flat DMG to Surging Bite", () => {
    // effHp = 20000 -> 66% = 13200 flat DMG
    const r1 = resolveMualani(mualani, ctxFor("mualani", {
      constellationLevel: 1,
      stats: { ...baseStats, hp: 20000 },
      inputs: { "c1-surging-first-hit": 1 },
    }));
    expect(r1.perHit["surging-bite"]?.flatDmgBonus).toBe(13200);
  });

  it("C4 Shark-Eating Shark +75% Burst DMG Bonus", () => {
    const r4 = resolveMualani(mualani, ctxFor("mualani", {
      constellationLevel: 4,
      inputs: { "c4-burst-buff": 1 },
    }));
    expect(r4.perHit["burst-dmg"]?.bonusDmgPct).toBe(75);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "mualani"));
    expect(rows.length).toBe(182); // 13 hit definitions * 14 levels = 182 rows
  });
});
