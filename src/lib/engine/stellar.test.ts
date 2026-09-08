import { describe, it, expect } from "vitest";
import { levelMultiplier } from "./level-multiplier";
import {
  stellarConductBRC,
  stellarConductFieldBuffs,
  indirectStellarDamage,
  computeIndividualStellarDamage,
  combineRankedContributors,
  STELLAR_INDIRECT_COEFFICIENT,
  STELLAR_BY_ELEMENT,
  type ContributorParams,
} from "./stellar";
import type { DamageStats } from "./damage";

const LV90 = 1446.853458;

const baseStats: DamageStats = {
  atk: 2000,
  hp: 20000,
  def: 800,
  em: 0,
  critRate: 60,
  critDmg: 120,
  dmgBonus: 0,
  normalDmgBonus: 0,
  chargedDmgBonus: 0,
  plungeDmgBonus: 0,
  skillDmgBonus: 0,
  burstDmgBonus: 0,
  pyroDmgBonus: 0,
  hydroDmgBonus: 0,
  dendroDmgBonus: 0,
  electroDmgBonus: 0,
  anemoDmgBonus: 0,
  cryoDmgBonus: 0,
  geoDmgBonus: 0,
  physicalDmgBonus: 0,
  dmgReduction: 0,
  enemyRes: 10,
  levelChar: 90,
  levelEnemy: 100,
  defReduction: 0,
  defIgnore: 0,
  energyRecharge: 100,
  healingBonus: 0,
};

describe("Stellar-Conduct Polestar Field scaling", () => {
  it("computes BRC scaling across 0..12 hits", () => {
    expect(stellarConductBRC(0)).toBe(1.0);
    expect(stellarConductBRC(1)).toBeCloseTo(1.45);
    expect(stellarConductBRC(2)).toBeCloseTo(1.50);
    expect(stellarConductBRC(5)).toBeCloseTo(1.65);
    expect(stellarConductBRC(8)).toBeCloseTo(1.80);
    expect(stellarConductBRC(12)).toBeCloseTo(2.00);
    // Out of range clamping
    expect(stellarConductBRC(-5)).toBe(1.0);
    expect(stellarConductBRC(15)).toBeCloseTo(2.00);
  });

  it("computes party buffs and enemy Physical RES shred", () => {
    const b0 = stellarConductFieldBuffs(0);
    expect(b0.cryoDmgBonus).toBe(20);
    expect(b0.electroDmgBonus).toBe(20);
    expect(b0.enemyPhysicalResShred).toBe(40);
    expect(b0.brc).toBe(1.0);

    const b1 = stellarConductFieldBuffs(1);
    expect(b1.cryoDmgBonus).toBe(29);
    expect(b1.electroDmgBonus).toBe(29);
    expect(b1.enemyPhysicalResShred).toBe(40);
    expect(b1.brc).toBeCloseTo(1.45);

    const b12 = stellarConductFieldBuffs(12);
    expect(b12.cryoDmgBonus).toBe(40);
    expect(b12.electroDmgBonus).toBe(40);
    expect(b12.enemyPhysicalResShred).toBe(40);
    expect(b12.brc).toBeCloseTo(2.00);
  });
});

describe("Stellar Swirl variants & indirect damage", () => {
  it("defines correct Base Reaction Coefficients", () => {
    expect(STELLAR_INDIRECT_COEFFICIENT["initial"]).toBe(0.75);
    expect(STELLAR_INDIRECT_COEFFICIENT["vortex-lv1"]).toBe(2.0);
    expect(STELLAR_INDIRECT_COEFFICIENT["vortex-lv2"]).toBe(3.0);
  });

  it("maps correct triggering/participating elements", () => {
    expect(STELLAR_BY_ELEMENT["Anemo"]).toEqual(["stellar-swirl"]);
    expect(STELLAR_BY_ELEMENT["Cryo"]).toEqual(["stellar-conduct", "stellar-swirl"]);
    expect(STELLAR_BY_ELEMENT["Electro"]).toEqual(["stellar-conduct"]);
  });

  it("calculates single-contributor indirect Stellar Swirl (60% capacity)", () => {
    const s: DamageStats = { ...baseStats, em: 0, enemyRes: 0, critRate: 0, critDmg: 0 };
    const res = indirectStellarDamage("initial", s, 0, 0);

    // Initial variant: BRC 0.75 * LV90. Solo contributor = 0.60 * D1.
    const expectedD1 = 0.75 * LV90;
    const expectedIndirect = 0.60 * expectedD1;

    expect(res.nonCrit).toBeCloseTo(expectedIndirect, 3);
    expect(res.crit).toBeCloseTo(expectedIndirect, 3);
    expect(res.avg).toBeCloseTo(expectedIndirect, 3);
    expect(res.contributorCount).toBe(1);
  });

  it("mitigates initial with Anemo RES and vortex with Cryo RES", () => {
    const s: DamageStats = {
      ...baseStats,
      em: 0,
      enemyRes: 10,
      enemyAnemoRes: 20, // 20% Anemo RES -> 0.80 multiplier
      enemyCryoRes: -10,  // -10% Cryo RES -> 1.05 multiplier
      critRate: 0,
      critDmg: 0,
    };

    const resInitial = indirectStellarDamage("initial", s, 0, 0);
    const expectedInitial = 0.60 * (0.75 * LV90 * 0.80);
    expect(resInitial.nonCrit).toBeCloseTo(expectedInitial, 3);

    const resVortex1 = indirectStellarDamage("vortex-lv1", s, 0, 0);
    const expectedVortex1 = 0.60 * (2.0 * LV90 * 1.05);
    expect(resVortex1.nonCrit).toBeCloseTo(expectedVortex1, 3);
  });
});

describe("Multi-contributor combination & benchmark CRIT", () => {
  it("normalizes capacity with 1, 2, 3, and 4 contributors (60%, 90%, 95%, 100%)", () => {
    const d1 = { nonCrit: 1000, critRate: 50, critDmg: 100 };
    const d2 = { nonCrit: 800, critRate: 40, critDmg: 80 };
    const d3 = { nonCrit: 600, critRate: 30, critDmg: 60 };
    const d4 = { nonCrit: 400, critRate: 20, critDmg: 40 };

    // 1 contributor: 0.60 * 1000 = 600
    const res1 = combineRankedContributors([d1]);
    expect(res1.nonCrit).toBeCloseTo(600, 4);

    // 2 contributors: 0.60 * 1000 + 0.30 * 800 = 600 + 240 = 840
    const res2 = combineRankedContributors([d1, d2]);
    expect(res2.nonCrit).toBeCloseTo(840, 4);

    // 3 contributors: 0.60 * 1000 + 0.30 * 800 + 0.05 * 600 = 840 + 30 = 870
    const res3 = combineRankedContributors([d1, d2, d3]);
    expect(res3.nonCrit).toBeCloseTo(870, 4);

    // 4 contributors: 870 + 0.05 * 400 = 870 + 20 = 890
    const res4 = combineRankedContributors([d1, d2, d3, d4]);
    expect(res4.nonCrit).toBeCloseTo(890, 4);
  });

  it("sorts descending regardless of input order", () => {
    const d1 = { nonCrit: 1000, critRate: 50, critDmg: 100 };
    const d2 = { nonCrit: 2000, critRate: 70, critDmg: 140 }; // highest

    const res = combineRankedContributors([d1, d2]);
    // 0.60 * 2000 + 0.30 * 1000 = 1200 + 300 = 1500
    expect(res.nonCrit).toBeCloseTo(1500, 4);
    // Benchmark CRIT should come from d2 (highest contributor)
    expect(res.benchmarkCritRate).toBe(70);
    expect(res.benchmarkCritDmg).toBe(140);
  });

  it("highest contributor (D1) dictates benchmark CRIT ratio", () => {
    const d1 = { nonCrit: 1000, critRate: 80, critDmg: 160 };
    const d2 = { nonCrit: 500, critRate: 10, critDmg: 20 };

    const res = combineRankedContributors([d1, d2]);
    // combined non-crit = 0.6 * 1000 + 0.3 * 500 = 750
    expect(res.nonCrit).toBeCloseTo(750, 4);
    // CRIT uses D1's 160% CD: 750 * (1 + 1.60) = 1950
    expect(res.crit).toBeCloseTo(750 * 2.6, 4);
    // AVG uses D1's 80% CR & 160% CD: 750 * (1 + 0.80 * 1.60) = 750 * 2.28 = 1710
    expect(res.avg).toBeCloseTo(750 * (1 + 0.8 * 1.6), 4);
  });
});

describe("Stellar Glimmer superset and specific stat integration", () => {
  it("applies stellarReactionDmgBonus and stellarSwirlDmgBonus", () => {
    const s: DamageStats = {
      ...baseStats,
      em: 0,
      enemyRes: 0,
      critRate: 0,
      critDmg: 0,
      stellarSwirlDmgBonus: 20,
      stellarReactionDmgBonus: 15,
    };

    const res = indirectStellarDamage("vortex-lv1", s, 0, 0);
    // BRC 2.0 * LV90 * (1 + 0.20 + 0.15) * 0.60 capacity
    const expected = 0.60 * (2.0 * LV90 * 1.35);
    expect(res.nonCrit).toBeCloseTo(expected, 3);
  });

  it("applies stellarReactionBaseDmgMultiplier and stellarBaseBonusPct", () => {
    const s: DamageStats = {
      ...baseStats,
      em: 0,
      enemyRes: 0,
      critRate: 0,
      critDmg: 0,
      stellarReactionBaseDmgMultiplier: 10,
    };

    const res = indirectStellarDamage("vortex-lv2", s, 15, 0);
    // Base bonus: 15% (param) + 10% (stat) = 25%
    // BRC 3.0 * LV90 * (1 + 0.25) * 0.60 capacity
    const expected = 0.60 * (3.0 * LV90 * 1.25);
    expect(res.nonCrit).toBeCloseTo(expected, 3);
  });

  it("applies stellar reaction CRIT bonuses", () => {
    const s: DamageStats = {
      ...baseStats,
      em: 0,
      enemyRes: 0,
      critRate: 20,
      critDmg: 50,
      stellarReactionCritRate: 15,
      stellarSwirlCritDmg: 30,
    };

    const res = indirectStellarDamage("initial", s, 0, 0);
    // Effective CR = 20 + 15 = 35%
    // Effective CD = 50 + 30 = 80%
    expect(res.benchmarkCritRate).toBe(35);
    expect(res.benchmarkCritDmg).toBe(80);
    expect(res.crit).toBeCloseTo(res.nonCrit * (1 + 0.80), 3);
    expect(res.avg).toBeCloseTo(res.nonCrit * (1 + 0.35 * 0.80), 3);
  });

  it("applies stellarSwirlMultiplier and stellarReactionMultiplier to Base Reaction Coefficient", () => {
    const s: DamageStats = {
      ...baseStats,
      em: 0,
      enemyRes: 0,
      critRate: 0,
      critDmg: 0,
      stellarSwirlMultiplier: 40,
      stellarReactionMultiplier: 20,
    };

    // Initial base coeff is 0.75. With 40% + 20% = 60%, coeff becomes 0.75 + 0.60 = 1.35.
    const res = indirectStellarDamage("initial", s, 0, 0);
    const expected = 0.60 * (1.35 * LV90);
    expect(res.nonCrit).toBeCloseTo(expected, 3);
  });
});
