import { describe, it, expect } from "vitest";
import { resolveSkirk } from "./skirk";
import { skirk } from "../../../data/registry/characters";
import { ctxFor, baseStats, scalingFor } from "./test-helpers";
import { resolveHitMultipliers } from "../validation";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("skirk mechanics", () => {
  it("Mutual Weapons Mentorship increases Skill level by +1 when active", () => {
    const resolvedHits = resolveHitMultipliers(skirk, scalingFor("skirk"), { skill: "9" }, {}, 0, { "mutual-weapons-mentorship": "1" });
    // The resolved multiplier of sf-1-hit at level 10 (9 + 1) should be 132.82 * 1.97683 = 262.56
    // (groupIndex = 1, hitIndex = 0 for sf-1-hit)
    expect(resolvedHits["1:0"]).toBeCloseTo(262.56, 1);

    const inactiveHits = resolveHitMultipliers(skirk, scalingFor("skirk"), { skill: "9" }, {}, 0, { "mutual-weapons-mentorship": "0" });
    // at level 9 should be 132.82 * 1.83744 = 244.05
    expect(inactiveHits["1:0"]).toBeCloseTo(244.05, 1);
  });

  it("Return to Oblivion crossing stacks base multipliers", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { inputs: { "deaths-crossing-stacks": 3 } }));
    expect(r1.perHit["sf-1-hit"]?.baseDmgMultiplier).toBeCloseTo(1.70);
    expect(r1.perHit["slash-dmg"]?.baseDmgMultiplier).toBeCloseTo(1.60);

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { inputs: { "deaths-crossing-stacks": 1 } }));
    expect(r2.perHit["sf-1-hit"]?.baseDmgMultiplier).toBeCloseTo(1.10);
    expect(r2.perHit["slash-dmg"]?.baseDmgMultiplier).toBeCloseTo(1.05);
  });

  it("C4 Fractured Flow ATK bonus", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 4, baseAtk: 1000, inputs: { "deaths-crossing-stacks": 3 } }));
    expect(r1.statDeltas.atk).toBe(400); // 40% of 1000

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 4, baseAtk: 1000, inputs: { "deaths-crossing-stacks": 1 } }));
    expect(r2.statDeltas.atk).toBe(100); // 10% of 1000

    const r3 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 3, baseAtk: 1000, inputs: { "deaths-crossing-stacks": 3 } }));
    expect(r3.statDeltas.atk).toBeUndefined(); // requires C4
  });

  it("Serpent's Subtlety Burst DMG bonus and C2 Into the Abyss cap", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 0, stats: { ...baseStats, atk: 2000 }, inputs: { "subtlety-bonus": 12 } }));
    // 34.782% * 12 * 2000 = 8347.68 flat DMG
    expect(r1.perHit["slash-dmg"]?.flatDmgBonus).toBeCloseTo(8347.68, 1);

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 0, stats: { ...baseStats, atk: 2000 }, inputs: { "subtlety-bonus": 20 } }));
    // Capped at 12 points without C2
    expect(r2.perHit["slash-dmg"]?.flatDmgBonus).toBeCloseTo(8347.68, 1);

    const r3 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 2, stats: { ...baseStats, atk: 2000 }, inputs: { "subtlety-bonus": 20 } }));
    // C2 allows up to 22 points
    expect(r3.perHit["slash-dmg"]?.flatDmgBonus).toBeCloseTo(0.34782 * 20 * 2000, 1);
  });

  it("All Shall Wither Normal ATK DMG bonus", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { inputs: { "all-shall-wither": 1, "wither-rifts": 4 } }));
    expect(r1.statDeltas.normalDmgBonus).toBe(60); // 40% base + 20% from 4 rifts

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { inputs: { "all-shall-wither": 1, "wither-rifts": 1 } }));
    expect(r2.statDeltas.normalDmgBonus).toBe(48); // 40% base + 8% from 1 rift
  });

  it("C2 ATK buff active after Havoc: Extinction", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 2, baseAtk: 1000, inputs: { "c2-burst-atk-buff": 1 } }));
    expect(r1.statDeltas.atk).toBe(700); // 70% of 1000

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 1, baseAtk: 1000, inputs: { "c2-burst-atk-buff": 1 } }));
    expect(r2.statDeltas.atk).toBeUndefined(); // requires C2
  });

  it("C1 Far to Fall Crystal Blade scaling", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 0 }));
    expect(r1.perHit["c1-blade"]?.baseDmgMultiplier).toBe(0); // disabled

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 1 }));
    expect(r2.perHit["c1-blade"]?.baseDmgMultiplier).toBeUndefined(); // active/default
  });

  it("C6 To the Source Sever stacks scaling", () => {
    const r1 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 5, inputs: { "c6-sever-stacks": 4 } }));
    expect(r1.perHit["sever-dmg"]?.baseDmgMultiplier).toBe(0); // requires C6

    const r2 = resolveSkirk(skirk, ctxFor("skirk", { constellationLevel: 6, inputs: { "c6-sever-stacks": 4 } }));
    expect(r2.perHit["sever-dmg"]?.baseDmgMultiplier).toBe(4); // 4 stacks scaling
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "skirk"));
    expect(rows.length).toBe(330);
  });
});
