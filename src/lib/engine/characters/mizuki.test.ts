import { describe, it, expect } from "vitest";
import { resolveMizuki } from "./mizuki";
import { mizuki } from "../../../data/registry/characters/mizuki";
import { ctxFor } from "./test-helpers";
import { flattenSeed } from "../../../data/talents";
import { mizukiSeed } from "../../../data/talents/mizuki";

describe("mizuki mechanics", () => {
  it("A4 Passive: Thoughts by Day Bring Dreams by Night +100 EM buff", () => {
    // Dreamdrifter + A4 buff active: +100 EM
    const r1 = resolveMizuki(mizuki, ctxFor("mizuki", { inputs: { "dreamdrifter-state": 1, "a4-em-buff": 1 } }));
    expect(r1.statDeltas.em).toBe(100);

    // Dreamdrifter inactive: no buff
    const r2 = resolveMizuki(mizuki, ctxFor("mizuki", { inputs: { "dreamdrifter-state": 0, "a4-em-buff": 1 } }));
    expect(r2.statDeltas.em).toBeUndefined();
  });

  it("Witch's Revelation / Hexerei Secret Rite: Stellar Swirl direct reaction", () => {
    // Hexerei + Dreamdrifter on: directReaction active
    const r1 = resolveMizuki(mizuki, ctxFor("mizuki", { inputs: { "dreamdrifter-state": 1, "hexerei-secret-rite": 1 } }));
    expect(r1.perHit["stellar-swirl-hit"]?.directReaction).toBeDefined();
    expect(r1.perHit["stellar-swirl-hit"]?.directReaction?.baseDmgBonusPct).toBe(14);
    expect(r1.perHit["stellar-swirl-hit"]?.baseDmgMultiplier).toBeUndefined();

    // Hexerei off: stellar swirl disabled (baseDmgMultiplier: 0)
    const r2 = resolveMizuki(mizuki, ctxFor("mizuki", { inputs: { "dreamdrifter-state": 1, "hexerei-secret-rite": 0 } }));
    expect(r2.perHit["stellar-swirl-hit"]?.baseDmgMultiplier).toBe(0);
  });

  it("C1 In Mist-Like Waters: 200% EM flat reaction damage", () => {
    const stats = { em: 800, atk: 1200, hp: 15000, def: 800, critRate: 50, critDmg: 100, energyRecharge: 100, dmgBonus: 0, normalDmgBonus: 0, chargedDmgBonus: 0, plungeDmgBonus: 0, skillDmgBonus: 0, burstDmgBonus: 0, pyroDmgBonus: 0, hydroDmgBonus: 0, dendroDmgBonus: 0, electroDmgBonus: 0, anemoDmgBonus: 0, cryoDmgBonus: 0, geoDmgBonus: 0, physicalDmgBonus: 0, dmgReduction: 0, enemyRes: 0, levelChar: 90, levelEnemy: 100, defReduction: 0, defIgnore: 0, healingBonus: 0 };

    // C1 active: 800 EM + 100 A4 EM = 900 EM -> 200% = 1800 flat DMG
    const r1 = resolveMizuki(mizuki, ctxFor("mizuki", {
      constellationLevel: 1,
      stats,
      inputs: { "dreamdrifter-state": 1, "hexerei-secret-rite": 1, "a4-em-buff": 1 }
    }));
    expect(r1.perHit["stellar-swirl-hit"]?.flatDmgBonus).toBe(1800);

    // Constellation < 1: no flat DMG bonus
    const r2 = resolveMizuki(mizuki, ctxFor("mizuki", {
      constellationLevel: 0,
      stats,
      inputs: { "dreamdrifter-state": 1, "hexerei-secret-rite": 1, "a4-em-buff": 1 }
    }));
    expect(r2.perHit["stellar-swirl-hit"]?.flatDmgBonus).toBeUndefined();
  });

  it("C2 Your Echo I Meet in Dreams: Team elemental DMG bonus based on EM", () => {
    const stats = { em: 1000, atk: 1200, hp: 15000, def: 800, critRate: 50, critDmg: 100, energyRecharge: 100, dmgBonus: 0, normalDmgBonus: 0, chargedDmgBonus: 0, plungeDmgBonus: 0, skillDmgBonus: 0, burstDmgBonus: 0, pyroDmgBonus: 0, hydroDmgBonus: 0, dendroDmgBonus: 0, electroDmgBonus: 0, anemoDmgBonus: 0, cryoDmgBonus: 0, geoDmgBonus: 0, physicalDmgBonus: 0, dmgReduction: 0, enemyRes: 0, levelChar: 90, levelEnemy: 100, defReduction: 0, defIgnore: 0, healingBonus: 0 };

    // C2 active: 1000 EM * 0.04% = 40% DMG bonus to Pyro, Hydro, Cryo, Electro
    const r1 = resolveMizuki(mizuki, ctxFor("mizuki", {
      constellationLevel: 2,
      stats,
      inputs: { "dreamdrifter-state": 1, "c2-em-dmg-buff": 1 }
    }));
    expect(r1.statDeltas.pyroDmgBonus).toBeCloseTo(40, 1);
    expect(r1.statDeltas.hydroDmgBonus).toBeCloseTo(40, 1);
    expect(r1.statDeltas.cryoDmgBonus).toBeCloseTo(40, 1);
    expect(r1.statDeltas.electroDmgBonus).toBeCloseTo(40, 1);
  });

  it("C6 The Heart Lingers Long: Stellar Swirl CRIT Rate and CRIT DMG buffs", () => {
    // Constellation >= 6: +20% CRIT Rate, +40% CRIT DMG on stellar-swirl-hit
    const r1 = resolveMizuki(mizuki, ctxFor("mizuki", {
      constellationLevel: 6,
      inputs: { "dreamdrifter-state": 1, "hexerei-secret-rite": 1 }
    }));
    expect(r1.perHit["stellar-swirl-hit"]?.critRateBonusPct).toBe(20);
    expect(r1.perHit["stellar-swirl-hit"]?.critDmgBonusPct).toBe(40);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed([mizukiSeed]);
    expect(rows.length).toBe(210); // 14 hits * 15 levels = 210 rows
  });
});
