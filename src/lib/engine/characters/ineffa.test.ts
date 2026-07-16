import { describe, it, expect } from "vitest";
import { resolveMechanics } from "../mechanics";
import { ineffa } from "../../../data/registry/characters/ineffa";
import { ineffaSeed } from "../../../data/talents/ineffa";
import type { DamageStats, TalentScalingData } from "../damage";
import type { MechanicsCtx } from "../mechanics-utils";

// Helper to build scaling data mock for Ineffa
const mockScaling: TalentScalingData = {};
ineffaSeed.hits.forEach(h => {
  const t = (mockScaling[h.talentType] ||= { levels: [], byLevel: {} });
  h.values.forEach((v, idx) => {
    const lvl = idx + 1;
    if (!t.levels.includes(lvl)) t.levels.push(lvl);
    (t.byLevel[lvl] ||= {})[h.hitKey] = v;
  });
});

const defaultStats: DamageStats = {
  atk: 1000, hp: 10000, def: 800, em: 100,
  critRate: 5, critDmg: 50, energyRecharge: 100,
  dmgBonus: 0, normalDmgBonus: 0, chargedDmgBonus: 0, plungeDmgBonus: 0,
  skillDmgBonus: 0, burstDmgBonus: 0,
  pyroDmgBonus: 0, hydroDmgBonus: 0, dendroDmgBonus: 0, electroDmgBonus: 0,
  anemoDmgBonus: 0, cryoDmgBonus: 0, geoDmgBonus: 0, physicalDmgBonus: 0,
  dmgReduction: 0, enemyRes: 10, levelChar: 90, levelEnemy: 90,
  defReduction: 0, defIgnore: 0,
};

function createCtx(overrides: Partial<MechanicsCtx>): MechanicsCtx {
  return {
    stats: { ...defaultStats, ...overrides.stats },
    baseAtk: overrides.baseAtk ?? 300,
    baseDef: overrides.baseDef ?? 600,
    constellationLevel: overrides.constellationLevel ?? 0,
    talentLevels: overrides.talentLevels ?? { normal: 10, skill: 10, burst: 10 },
    scaling: mockScaling,
    inputs: overrides.inputs ?? { "a4-burst-em-share": 1, "c1-carrier-flow": 1 },
  };
}

describe("Ineffa Character Calculator resolveMechanics", () => {
  it("character details are mapped correctly", () => {
    expect(ineffa.id).toBe("ineffa");
    expect(ineffa.element).toBe("Electro");
    expect(ineffa.weapon).toBe("Polearm");
    expect(ineffa.ascensionStat?.label).toBe("CRIT Rate");
    expect(ineffa.ascensionStat?.maxValue).toBe(19.2);
  });

  it("calculates Assemblage Hub base reaction bonus scaling with ATK", () => {
    // ATK = 1000 => 7% base reaction bonus
    const ctx1 = createCtx({ stats: { atk: 1000 } });
    const r1 = resolveMechanics(ineffa, ctx1);
    expect(r1.lunarBaseBonusPct).toBe(7);

    // ATK = 2000 => 14% base reaction bonus
    const ctx2 = createCtx({ stats: { atk: 2000 } });
    const r2 = resolveMechanics(ineffa, ctx2);
    expect(r2.lunarBaseBonusPct).toBe(14);

    // ATK = 3000 => 14% (capped)
    const ctx3 = createCtx({ stats: { atk: 3000 } });
    const r3 = resolveMechanics(ineffa, ctx3);
    expect(r3.lunarBaseBonusPct).toBe(14);
  });

  it("calculates A4 EM share based on Ineffa's final ATK", () => {
    // ATK = 2000 => EM share = 120 EM
    const ctx1 = createCtx({ stats: { atk: 2000 }, inputs: { "a4-burst-em-share": 1 } });
    const r1 = resolveMechanics(ineffa, ctx1);
    expect(r1.statDeltas.em).toBe(120);

    // Turn toggle off => no share
    const ctx2 = createCtx({ stats: { atk: 2000 }, inputs: { "a4-burst-em-share": 0 } });
    const r2 = resolveMechanics(ineffa, ctx2);
    expect(r2.statDeltas.em).toBeUndefined();
  });

  it("calculates C1 Carrier Flow Composite reaction bonus and sets direct reaction params", () => {
    // C0: C1 toggled on => no effect (requires C1)
    const ctx0 = createCtx({ constellationLevel: 0, stats: { atk: 2000 }, inputs: { "c1-carrier-flow": 1 } });
    const r0 = resolveMechanics(ineffa, ctx0);
    expect(r0.perHit["a1-extra"].directReaction?.reactionBonusPct).toBe(0);

    // C1: ATK = 1000 => 2.5 * 10 = 25% reaction bonus
    const ctx1 = createCtx({ constellationLevel: 1, stats: { atk: 1000 }, inputs: { "c1-carrier-flow": 1 } });
    const r1 = resolveMechanics(ineffa, ctx1);
    expect(r1.perHit["a1-extra"].directReaction?.reactionBonusPct).toBe(25);

    // C1: ATK = 2000 => 2.5 * 20 = 50% reaction bonus
    const ctx2 = createCtx({ constellationLevel: 1, stats: { atk: 2000 }, inputs: { "c1-carrier-flow": 1 } });
    const r2 = resolveMechanics(ineffa, ctx2);
    expect(r2.perHit["a1-extra"].directReaction?.reactionBonusPct).toBe(50);

    // C1: ATK = 3000 => 50% (capped)
    const ctx3 = createCtx({ constellationLevel: 1, stats: { atk: 3000 }, inputs: { "c1-carrier-flow": 1 } });
    const r3 = resolveMechanics(ineffa, ctx3);
    expect(r3.perHit["a1-extra"].directReaction?.reactionBonusPct).toBe(50);
  });

  it("scales flat shield absorption according to Elemental Skill level", () => {
    // Level 10: flat absorption = 3051
    const ctx1 = createCtx({ talentLevels: { skill: 10 } });
    const r1 = resolveMechanics(ineffa, ctx1);
    expect(r1.perHit["shield"].flatDmgBonus).toBe(3051);

    // Level 1: flat absorption = 1387
    const ctx2 = createCtx({ talentLevels: { skill: 1 } });
    const r2 = resolveMechanics(ineffa, ctx2);
    expect(r2.perHit["shield"].flatDmgBonus).toBe(1387);
  });

  it("handles direct reaction hit multipliers and constellation locks", () => {
    // C0: c2-punishment-edict multiplier = 0, c6-dawning-morn multiplier = 0
    const ctx0 = createCtx({ constellationLevel: 0 });
    const r0 = resolveMechanics(ineffa, ctx0);
    expect(r0.perHit["c2-punishment-edict"].baseDmgMultiplier).toBe(0);
    expect(r0.perHit["c6-dawning-morn"].baseDmgMultiplier).toBe(0);

    // C2: c2-punishment-edict multiplier = 1, c6-dawning-morn multiplier = 0
    const ctx2 = createCtx({ constellationLevel: 2 });
    const r2 = resolveMechanics(ineffa, ctx2);
    expect(r2.perHit["c2-punishment-edict"].baseDmgMultiplier).toBe(1);
    expect(r2.perHit["c6-dawning-morn"].baseDmgMultiplier).toBe(0);

    // C6 + C1 active: c6-dawning-morn multiplier = 1
    const ctx6 = createCtx({ constellationLevel: 6, inputs: { "c1-carrier-flow": 1 } });
    const r6 = resolveMechanics(ineffa, ctx6);
    expect(r6.perHit["c6-dawning-morn"].baseDmgMultiplier).toBe(1);

    // C6 + C1 inactive: c6-dawning-morn multiplier = 0
    const ctx6_inactive = createCtx({ constellationLevel: 6, inputs: { "c1-carrier-flow": 0 } });
    const r6_inactive = resolveMechanics(ineffa, ctx6_inactive);
    expect(r6_inactive.perHit["c6-dawning-morn"].baseDmgMultiplier).toBe(0);
  });

  it("explicitly sets normal attack elements to Physical", () => {
    const ctx = createCtx({});
    const r = resolveMechanics(ineffa, ctx);
    const normalKeys = ["1-hit", "2-hit", "3-hit", "4-hit", "charged", "plunge", "low-plunge", "high-plunge"];
    normalKeys.forEach(k => {
      expect(r.perHit[k].element).toBe("Physical");
    });
  });
});
