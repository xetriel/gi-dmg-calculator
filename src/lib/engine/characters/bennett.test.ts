import { describe, it, expect } from "vitest";
import { resolveBennett } from "./bennett";
import { bennett } from "../../../data/registry/characters/bennett";
import type { MechanicsCtx } from "../mechanics-utils";

function makeCtx(overrides: Partial<MechanicsCtx> = {}): MechanicsCtx {
  return {
    baseAtk: 800,
    totalAtk: 1200,
    inputs: {
      "fantastic-voyage-active": 1,
      "c6-pyro-bonus": 1,
    },
    constellationLevel: 0,
    talentLevels: { normal: 10, skill: 10, burst: 10 },
    ...overrides,
  };
}

describe("Bennett DPS mechanics resolver", () => {
  it("C0 Fantastic Voyage active: ATK + 100.8% of Base ATK at Lv10", () => {
    const res = resolveBennett(bennett, makeCtx({ constellationLevel: 0 }));
    // 800 * 1.008 = 806.4
    expect(res.statDeltas.atk).toBeCloseTo(806.4, 1);
  });

  it("C1 Fantastic Voyage active: ATK + 120.8% of Base ATK at Lv10", () => {
    const res = resolveBennett(bennett, makeCtx({ constellationLevel: 1 }));
    // 800 * 1.208 = 966.4
    expect(res.statDeltas.atk).toBeCloseTo(966.4, 1);
  });

  it("C5 Fantastic Voyage active: ATK + 139.0% of Base ATK at Lv13", () => {
    const res = resolveBennett(bennett, makeCtx({ constellationLevel: 5, talentLevels: { normal: 10, skill: 10, burst: 13 } }));
    // 800 * 1.39 = 1112
    expect(res.statDeltas.atk).toBeCloseTo(1112.0, 1);
  });

  it("Fantastic Voyage off: no ATK bonus", () => {
    const res = resolveBennett(bennett, makeCtx({ inputs: { "fantastic-voyage-active": 0 } }));
    expect(res.statDeltas.atk ?? 0).toBe(0);
  });

  it("C6 Fire Ventures with Me: grants +15% Pyro DMG Bonus and Pyro infusion", () => {
    const res = resolveBennett(bennett, makeCtx({ constellationLevel: 6 }));
    expect(res.statDeltas.pyroDmgBonus).toBe(15);
    expect(res.perHit["1-hit"]?.element).toBe("Pyro");
  });

  it("C5 (below C6): no C6 Pyro bonus", () => {
    const res = resolveBennett(bennett, makeCtx({ constellationLevel: 5 }));
    expect(res.statDeltas.pyroDmgBonus ?? 0).toBe(0);
  });
});
