import { describe, it, expect } from "vitest";
import { resolveMechanics } from "./mechanics";
import { columbina } from "../../data/registry/characters/columbina";
import { columbinaSeed } from "../../data/talents/columbina";
import type { DamageStats } from "@/lib/engine/damage";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { MechanicsCtx } from "./mechanics";

const baseStats: DamageStats = {
  atk: 1000,
  hp: 20000,
  def: 800,
  em: 100,
  critRate: 5,
  critDmg: 50,
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
  levelEnemy: 90,
  defReduction: 0,
  defIgnore: 0,
};

// Build helper for scaling data
const mockScaling: TalentScalingData = {
  normal: {
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    byLevel: Object.fromEntries(
      columbinaSeed.hits
        .filter(h => h.talentType === "normal")
        .map(h => [1, {}]) // we only need level 1 in this simple check
    ) as any,
  },
  skill: {
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    byLevel: {} as any,
  },
  burst: {
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    byLevel: {} as any,
  },
};

// Populate the mock scaling with all values from columbinaSeed
columbinaSeed.hits.forEach(h => {
  h.values.forEach((v, idx) => {
    const lvl = idx + 1;
    const group = mockScaling[h.talentType as "normal" | "skill" | "burst"];
    if (group) {
      group.byLevel[lvl] = {
        ...group.byLevel[lvl],
        [h.hitKey]: v,
      };
    }
  });
});

interface MockCtxOverride {
  stats?: Partial<DamageStats>;
  baseAtk?: number;
  baseDef?: number;
  baseHp?: number;
  constellationLevel?: number;
  talentLevels?: Record<string, number>;
  inputs?: Record<string, number>;
}

function createCtx(overrides: MockCtxOverride): MechanicsCtx {
  const inputs = {
    "lunar-domain": 1,
    "lunacy-stacks": 3,
    "lunar-brilliance": 1,
    "c6-crit-dmg-buff": 1,
    ...overrides.inputs,
  };
  return {
    stats: { ...baseStats, ...overrides.stats } as DamageStats,
    baseAtk: overrides.baseAtk ?? 1000,
    baseDef: overrides.baseDef ?? 800,
    baseHp: overrides.baseHp ?? 15000,
    constellationLevel: overrides.constellationLevel ?? 0,
    talentLevels: { normal: 1, skill: 1, burst: 1, ...overrides.talentLevels },
    scaling: mockScaling,
    inputs,
  };
}

describe("Columbina Mechanics & Scale Resolving", () => {
  it("A1 CRIT Rate buff stacks", () => {
    const ctx0 = createCtx({ inputs: { "lunacy-stacks": 0 } });
    const r0 = resolveMechanics(columbina, ctx0);
    expect(r0.statDeltas.critRate ?? 0).toBe(0);

    const ctx3 = createCtx({ inputs: { "lunacy-stacks": 3 } });
    const r3 = resolveMechanics(columbina, ctx3);
    expect(r3.statDeltas.critRate ?? 0).toBe(15);
  });

  it("Moonsign Benediction Base DMG Bonus calculation from Max HP", () => {
    // hp = 20000 -> 0.2% per 1000 = 4% Lunar base DMG bonus
    const ctx = createCtx({ stats: { hp: 20000 } });
    const r = resolveMechanics(columbina, ctx);
    expect(r.lunarBaseBonusPct).toBeCloseTo(4.0, 4);

    // hp = 45000 -> 9.0% -> capped at 7%
    const ctxCap = createCtx({ stats: { hp: 45000 } });
    const rCap = resolveMechanics(columbina, ctxCap);
    expect(rCap.lunarBaseBonusPct).toBe(7.0);
  });

  it("C2 Lunar Brilliance HP increase and stats sharing", () => {
    // C0: no C2 HP increase or stat sharing
    const ctx0 = createCtx({ constellationLevel: 0, baseHp: 15000 });
    const r0 = resolveMechanics(columbina, ctx0);
    expect(r0.statDeltas.hp ?? 0).toBe(0);
    expect(r0.statDeltas.atk ?? 0).toBe(0);
    expect(r0.statDeltas.em ?? 0).toBe(0);
    expect(r0.statDeltas.def ?? 0).toBe(0);

    // C2: +40% baseHp (15000 * 0.40 = 6000 HP increase).
    // Total HP after buff: 20000 (stats.hp) + 6000 (C2 buff) = 26000.
    // ATK, EM, and DEF are shared simultaneously:
    // ATK shared = 26000 * 0.01 = 260 ATK
    // EM shared = 26000 * 0.0035 = 91 EM
    // DEF shared = 26000 * 0.01 = 260 DEF
    const ctx2 = createCtx({ constellationLevel: 2, baseHp: 15000, stats: { hp: 20000 } });
    const r2 = resolveMechanics(columbina, ctx2);
    expect(r2.statDeltas.hp ?? 0).toBe(6000);
    expect(r2.statDeltas.atk ?? 0).toBe(260);
    expect(r2.statDeltas.em ?? 0).toBe(91);
    expect(r2.statDeltas.def ?? 0).toBe(260);
  });

  it("C4 flat reaction DMG additions on Gravity Interference hits", () => {
    // Under C4:
    // C4 elevation is 1.10 (C1: +1.5%, C2: +7%, C4: +1.5%).
    // With C2 HP buff disabled ("lunar-brilliance": 0): HP = 20000.
    // gi-bloom flat DMG = 0.025 * 20000 * 1.10 = 550.
    // gi-charged / gi-crystallize flat DMG = 0.125 * 20000 * 1.10 = 2750.
    const ctxNoC2 = createCtx({
      constellationLevel: 4,
      stats: { hp: 20000 },
      inputs: { "lunar-brilliance": 0 }
    });
    const rNoC2 = resolveMechanics(columbina, ctxNoC2);
    expect(rNoC2.perHit["gi-bloom"]?.flatDmgBonus).toBeCloseTo(550, 4);
    expect(rNoC2.perHit["gi-charged"]?.flatDmgBonus).toBeCloseTo(2750, 4);
    expect(rNoC2.perHit["gi-crystallize"]?.flatDmgBonus).toBeCloseTo(2750, 4);

    // With C2 HP buff enabled: HP increases by 40% of baseHp (6000 HP) -> 26000 HP.
    // gi-bloom flat DMG = 0.025 * 26000 * 1.10 = 715.
    // gi-charged / gi-crystallize flat DMG = 0.125 * 26000 * 1.10 = 3575.
    const ctxC2 = createCtx({
      constellationLevel: 4,
      stats: { hp: 20000 },
      inputs: { "lunar-brilliance": 1 }
    });
    const rC2 = resolveMechanics(columbina, ctxC2);
    expect(rC2.perHit["gi-bloom"]?.flatDmgBonus).toBeCloseTo(715, 4);
    expect(rC2.perHit["gi-charged"]?.flatDmgBonus).toBeCloseTo(3575, 4);
    expect(rC2.perHit["gi-crystallize"]?.flatDmgBonus).toBeCloseTo(3575, 4);

    // All hit branches are active
    expect(rC2.perHit["gi-charged"]?.baseDmgMultiplier).toBeCloseTo(1.10, 4);
    expect(rC2.perHit["gi-bloom"]?.baseDmgMultiplier).toBeCloseTo(1.10, 4);
    expect(rC2.perHit["gi-crystallize"]?.baseDmgMultiplier).toBeCloseTo(1.10, 4);
  });

  it("C6 CRIT DMG buff application in Lunar Domain", () => {
    const ctx = createCtx({ constellationLevel: 6, inputs: { "lunar-domain": 1, "c6-crit-dmg-buff": 1 } });
    const r = resolveMechanics(columbina, ctx);
    expect(r.perHit["1-hit"]?.critDmgBonusPct).toBe(80);
    expect(r.perHit["skill-dmg"]?.critDmgBonusPct).toBe(80);
    expect(r.perHit["gi-bloom"]?.critDmgBonusPct).toBe(80);
    expect(r.perHit["burst-dmg"]?.critDmgBonusPct).toBe(80);
  });

  it("Constellation Elevation multiplier summation", () => {
    // C0: 1.0
    const ctx0 = createCtx({ constellationLevel: 0 });
    const r0 = resolveMechanics(columbina, ctx0);
    expect(r0.perHit["moondew-cleanse"]?.baseDmgMultiplier).toBe(1.0);

    // C1: 1.015 (+1.5%)
    const ctx1 = createCtx({ constellationLevel: 1 });
    const r1 = resolveMechanics(columbina, ctx1);
    expect(r1.perHit["moondew-cleanse"]?.baseDmgMultiplier).toBeCloseTo(1.015, 6);

    // C2: 1.085 (+1.5% + 7%)
    const ctx2 = createCtx({ constellationLevel: 2 });
    const r2 = resolveMechanics(columbina, ctx2);
    expect(r2.perHit["moondew-cleanse"]?.baseDmgMultiplier).toBeCloseTo(1.085, 6);

    // C4: 1.10 (+1.5% + 7% + 1.5%)
    const ctx4 = createCtx({ constellationLevel: 4 });
    const r4 = resolveMechanics(columbina, ctx4);
    expect(r4.perHit["moondew-cleanse"]?.baseDmgMultiplier).toBeCloseTo(1.10, 6);

    // C6: 1.17 (+1.5% + 7% + 1.5% + 7%)
    const ctx6 = createCtx({ constellationLevel: 6 });
    const r6 = resolveMechanics(columbina, ctx6);
    expect(r6.perHit["moondew-cleanse"]?.baseDmgMultiplier).toBeCloseTo(1.17, 6);
  });
});
