import { describe, it, expect } from "vitest";
import { resolveSucrose } from "./sucrose";
import { sucrose } from "../../../data/registry/characters/sucrose";
import { sucroseSeed } from "../../../data/talents/sucrose";
import { flattenSeed } from "../../../data/talents";
import type { MechanicsCtx } from "../mechanics-utils";

function makeCtx(overrides: Partial<MechanicsCtx> = {}): MechanicsCtx {
  return {
    stats: {
      atk: 1200,
      hp: 15000,
      def: 700,
      em: 800,
      critRate: 50,
      critDmg: 100,
      energyRecharge: 160,
      healingBonus: 0,
      dmgBonus: 24, // Ascension Anemo DMG Bonus
      enemyRes: 10,
      levelChar: 90,
      levelEnemy: 100,
      defReduction: 0,
      defIgnore: 0,
      pyroDmgBonus: 0,
      hydroDmgBonus: 0,
      electroDmgBonus: 0,
      cryoDmgBonus: 0,
      anemoDmgBonus: 24,
      geoDmgBonus: 0,
      dendroDmgBonus: 0,
      physicalDmgBonus: 0,
      normalDmgBonus: 0,
      chargedDmgBonus: 0,
      plungeDmgBonus: 0,
      skillDmgBonus: 0,
      burstDmgBonus: 0,
    } as any,
    baseAtk: 600,
    baseDef: 700,
    scaling: {},
    inputs: {
      "hexerei-secret-rite": 1,
      "small-wind-spirit": 1,
      "large-wind-spirit": 1,
      "burst-absorption": 0,
      "c6-absorption-buff": 1,
      "a1-swirl-buff": 1,
      "a4-em-share": 1,
    },
    constellationLevel: 0,
    talentLevels: { normal: 10, skill: 10, burst: 10 },
    ...overrides,
  };
}

describe("Sucrose mechanics resolver", () => {
  it("Un-infused Burst disables burst-infusion with baseDmgMultiplier: 0", () => {
    const res = resolveSucrose(sucrose, makeCtx({ inputs: { "burst-absorption": 0 } }));
    expect(res.perHit["burst-infusion"]?.baseDmgMultiplier).toBe(0);
  });

  it("Infused Burst sets burst-infusion element to the absorbed element", () => {
    const res = resolveSucrose(sucrose, makeCtx({ inputs: { "burst-absorption": 1 } }));
    expect(res.perHit["burst-infusion"]?.element).toBe("Pyro");
    expect(res.perHit["burst-infusion"]?.baseDmgMultiplier).toBeUndefined();
    expect(res.notes.some((n) => n.includes("infused with Pyro"))).toBe(true);
  });

  it("Hexerei: Secret Rite applies Small Wind Spirit (+5.71428%) and Large Wind Spirit (+7.14285%) buffs", () => {
    // Both active: 40/7 + 50/7 = 90/7 ≈ 12.85714%
    const res = resolveSucrose(
      sucrose,
      makeCtx({
        inputs: {
          "hexerei-secret-rite": 1,
          "small-wind-spirit": 1,
          "large-wind-spirit": 1,
        },
      })
    );
    const expected = 90 / 7;
    expect(res.statDeltas.normalDmgBonus).toBeCloseTo(expected, 4);
    expect(res.statDeltas.chargedDmgBonus).toBeCloseTo(expected, 4);
    expect(res.statDeltas.plungeDmgBonus).toBeCloseTo(expected, 4);
    expect(res.statDeltas.skillDmgBonus).toBeCloseTo(expected, 4);
    expect(res.statDeltas.burstDmgBonus).toBeCloseTo(expected, 4);
  });

  it("Hexerei: Secret Rite disabled grants no attack DMG bonuses", () => {
    const res = resolveSucrose(
      sucrose,
      makeCtx({
        inputs: {
          "hexerei-secret-rite": 0,
          "small-wind-spirit": 1,
          "large-wind-spirit": 1,
        },
      })
    );
    expect(res.statDeltas.normalDmgBonus).toBeUndefined();
    expect(res.statDeltas.skillDmgBonus).toBeUndefined();
  });

  it("C6 Chaotic Entropy: standard +20% Elemental DMG Bonus without Hexerei", () => {
    const res = resolveSucrose(
      sucrose,
      makeCtx({
        constellationLevel: 6,
        inputs: {
          "burst-absorption": 1,
          "c6-absorption-buff": 1,
          "hexerei-secret-rite": 0,
        },
      })
    );
    expect(res.statDeltas.pyroDmgBonus).toBe(20);
  });

  it("C6 Chaotic Entropy: +28.57142% (20% + 8.57142%) Elemental DMG Bonus with Hexerei: Secret Rite", () => {
    const res = resolveSucrose(
      sucrose,
      makeCtx({
        constellationLevel: 6,
        inputs: {
          "burst-absorption": 1,
          "c6-absorption-buff": 1,
          "hexerei-secret-rite": 1,
        },
      })
    );
    expect(res.statDeltas.pyroDmgBonus).toBeCloseTo(20 + 60 / 7, 4);
  });

  it("C6 Chaotic Entropy requires Constellation Level >= 6", () => {
    const res = resolveSucrose(
      sucrose,
      makeCtx({
        constellationLevel: 5,
        inputs: {
          "burst-absorption": 1,
          "c6-absorption-buff": 1,
          "hexerei-secret-rite": 1,
        },
      })
    );
    expect(res.statDeltas.pyroDmgBonus).toBeUndefined();
  });

  it("Talent seed row count satisfies 11 hits * 14 levels = 154 rows", () => {
    expect(sucroseSeed.hits.length).toBe(11);
    const rows = flattenSeed([sucroseSeed]);
    expect(rows.length).toBe(154);
  });
});
