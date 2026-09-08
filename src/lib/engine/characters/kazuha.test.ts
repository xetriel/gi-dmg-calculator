import { describe, it, expect } from "vitest";
import { resolveKazuha } from "./kazuha";
import { kazuha } from "../../../data/registry/characters/kazuha";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";
import type { MechanicsCtx } from "../mechanics-utils";

function makeCtx(overrides: Partial<MechanicsCtx> = {}): MechanicsCtx {
  return {
    stats: {
      atk: 1500,
      hp: 20000,
      def: 800,
      em: 1000,
      critRate: 60,
      critDmg: 120,
      energyRecharge: 100,
      healingBonus: 0,
      dmgBonus: 0,
      enemyRes: 10,
      levelChar: 90,
      levelEnemy: 100,
      defReduction: 0,
      defIgnore: 0,
      pyroDmgBonus: 0,
      hydroDmgBonus: 0,
      electroDmgBonus: 0,
      cryoDmgBonus: 0,
      anemoDmgBonus: 0,
      geoDmgBonus: 0,
      dendroDmgBonus: 0,
      physicalDmgBonus: 0,
    } as any,
    baseAtk: 800,
    baseDef: 800,
    scaling: {},
    inputs: {
      "a4-pyro-swirl": 1,
      "a4-hydro-swirl": 0,
      "a4-electro-swirl": 0,
      "a4-cryo-swirl": 0,
      "c2-tailwind-active": 1,
      "c6-crimson-momiji": 1,
    },
    constellationLevel: 0,
    talentLevels: { normal: 10, skill: 10, burst: 10 },
    ...overrides,
  };
}

describe("Kazuha mechanics resolver", () => {
  it("A4 Poetics of Fuubutsu: grants +0.04% Elemental DMG per point of EM", () => {
    // 1000 EM * 0.04% = 40% Pyro DMG
    const res = resolveKazuha(kazuha, makeCtx({ constellationLevel: 0 }));
    expect(res.statDeltas.pyroDmgBonus).toBeCloseTo(40.0, 1);
    expect(res.statDeltas.hydroDmgBonus ?? 0).toBe(0);
  });

  it("A4 Poetics of Fuubutsu: supports multi-element swirl coexisting", () => {
    const res = resolveKazuha(
      kazuha,
      makeCtx({
        constellationLevel: 0,
        inputs: {
          "a4-pyro-swirl": 1,
          "a4-hydro-swirl": 1,
          "a4-electro-swirl": 0,
          "a4-cryo-swirl": 0,
        },
      })
    );
    expect(res.statDeltas.pyroDmgBonus).toBeCloseTo(40.0, 1);
    expect(res.statDeltas.hydroDmgBonus).toBeCloseTo(40.0, 1);
    expect(res.statDeltas.cryoDmgBonus ?? 0).toBe(0);
  });

  it("C2 Yamaarashi Tailwind: +200 EM inside Autumn Whirlwind and scales A4 buff", () => {
    // C2 active: EM +200 -> total EM = 1200. A4 Pyro DMG = 1200 * 0.04 = 48%
    const res = resolveKazuha(kazuha, makeCtx({ constellationLevel: 2 }));
    expect(res.statDeltas.em).toBe(200);
    expect(res.statDeltas.pyroDmgBonus).toBeCloseTo(48.0, 1);
  });

  it("C2 Yamaarashi Tailwind: inactive when constellation is below C2", () => {
    const res = resolveKazuha(kazuha, makeCtx({ constellationLevel: 1 }));
    expect(res.statDeltas.em ?? 0).toBe(0);
    expect(res.statDeltas.pyroDmgBonus).toBeCloseTo(40.0, 1);
  });

  it("C6 Crimson Momiji: Anemo Infusion and +0.2% DMG Bonus per EM to Normal/Charged/Plunge", () => {
    // C6 active: total EM = 1200 (with C2) -> DMG Bonus = 1200 * 0.2 = 240%
    const res = resolveKazuha(kazuha, makeCtx({ constellationLevel: 6 }));
    expect(res.perHit["1-hit"]?.element).toBe("Anemo");
    expect(res.perHit["charged-1"]?.element).toBe("Anemo");
    expect(res.perHit["low-plunge"]?.element).toBe("Anemo");
    expect(res.perHit["1-hit"]?.bonusDmgPct).toBeCloseTo(240.0, 1);
    expect(res.perHit["midare-ranzan-high"]?.bonusDmgPct).toBeCloseTo(240.0, 1);
    expect(res.perHit["soumon-pyro"]?.bonusDmgPct).toBeCloseTo(240.0, 1);
  });

  it("C6 Crimson Momiji: inactive when below C6", () => {
    const res = resolveKazuha(kazuha, makeCtx({ constellationLevel: 5 }));
    expect(res.perHit["1-hit"]?.element).toBeUndefined();
    expect(res.perHit["1-hit"]?.bonusDmgPct).toBeUndefined();
  });

  it("talent seed row count matches 25 hits * 14 levels = 350 rows", () => {
    const rows = flattenSeed(TALENT_SEED.filter((x) => x.characterId === "kazuha"));
    expect(rows.length).toBe(350);
  });
});
