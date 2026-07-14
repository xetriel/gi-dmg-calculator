import { describe, it, expect } from "vitest";
import { resolveMechanics } from "./mechanics";
import { linnea } from "../../data/registry/characters/linnea";
import { linneaSeed } from "../../data/talents/linnea";
import type { DamageStats } from "@/lib/engine/damage";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { MechanicsCtx } from "./mechanics";

const baseStats: DamageStats = {
  atk: 1000,
  hp: 20000,
  def: 1000,
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

const mockScaling: TalentScalingData = {
  normal: {
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    byLevel: {} as any,
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

linneaSeed.hits.forEach(h => {
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
  constellationLevel?: number;
  talentLevels?: Record<string, number>;
  inputs?: Record<string, number>;
}

function createCtx(overrides: MockCtxOverride): MechanicsCtx {
  const inputs = {
    "active-char-non-moonsign": 0,
    "field-catalog-stacks": 0,
    "c2-moondrift": 0,
    "c4-moondrift": 0,
    ...overrides.inputs,
  };
  return {
    stats: { ...baseStats, ...overrides.stats } as DamageStats,
    baseAtk: overrides.baseAtk ?? 144,
    baseDef: overrides.baseDef ?? 907,
    constellationLevel: overrides.constellationLevel ?? 0,
    talentLevels: { normal: 1, skill: 10, burst: 10, ...overrides.talentLevels },
    scaling: mockScaling,
    inputs,
  };
}

describe("Linnea Mechanics & Calculations", () => {
  it("A4 EM Buff works correctly", () => {
    // Non-active char non-moonsign
    const ctx1 = createCtx({ inputs: { "active-char-non-moonsign": 0 } });
    const r1 = resolveMechanics(linnea, ctx1);
    expect(r1.statDeltas.em).toBeUndefined();

    // Active char non-moonsign
    const ctx2 = createCtx({ inputs: { "active-char-non-moonsign": 1 }, stats: { def: 1000 } });
    const r2 = resolveMechanics(linnea, ctx2);
    expect(r2.statDeltas.em).toBe(50); // 5% of 1000 DEF
  });

  it("Moonsign Benediction sets lunarBaseBonusPct correctly", () => {
    // 1000 DEF -> 7% Base DMG Bonus
    const ctx1 = createCtx({ stats: { def: 1000 } });
    const r1 = resolveMechanics(linnea, ctx1);
    expect(r1.lunarBaseBonusPct).toBe(7);

    // 2500 DEF -> 14% Base DMG Bonus (capped)
    const ctx2 = createCtx({ stats: { def: 2500 } });
    const r2 = resolveMechanics(linnea, ctx2);
    expect(r2.lunarBaseBonusPct).toBe(14);
  });

  it("C1/C6 Field Catalog flat DMG is applied to heavy overdrive and million ton crush", () => {
    // C0 with 6 stacks
    const ctx1 = createCtx({ inputs: { "field-catalog-stacks": 6 }, stats: { def: 1000 } });
    const r1 = resolveMechanics(linnea, ctx1);
    // heavy-overdrive: consumes 1 stack -> 75% DEF = 750 flat DMG
    expect(r1.perHit["heavy-overdrive"].flatDmgBonus).toBe(750);
    // million-ton-crush: consumes up to 5 stacks -> 5 * 150% DEF = 7500 flat DMG
    expect(r1.perHit["million-ton-crush"].flatDmgBonus).toBe(7500);

    // C6 with 6 stacks
    const ctx2 = createCtx({ inputs: { "field-catalog-stacks": 6 }, constellationLevel: 6, stats: { def: 1000 } });
    const r2 = resolveMechanics(linnea, ctx2);
    // heavy-overdrive: consumes 2 stacks -> 112.5% DEF = 1125 flat DMG
    expect(r2.perHit["heavy-overdrive"].flatDmgBonus).toBe(1125);
    // million-ton-crush: consumes up to 10 stacks (takes 6 available) -> 6/2 * 225% DEF = 6750 flat DMG
    expect(r2.perHit["million-ton-crush"].flatDmgBonus).toBe(6750);
  });

  it("C2/C4 Moondrift buffs are applied properly", () => {
    // C2 active
    const ctx1 = createCtx({ inputs: { "c2-moondrift": 1 } });
    const r1 = resolveMechanics(linnea, ctx1);
    expect(r1.statDeltas.critDmg).toBe(40);
    expect(r1.perHit["million-ton-crush"].critDmgBonusPct).toBe(150);

    // C4 active (+25% DEF)
    const ctx2 = createCtx({ inputs: { "c4-moondrift": 1 }, baseDef: 907 });
    const r2 = resolveMechanics(linnea, ctx2);
    expect(r2.statDeltas.def).toBe(907 * 0.25);
  });

  it("Burst healing scaling and flat portions are mapped according to talent level", () => {
    const ctx1 = createCtx({ talentLevels: { burst: 10 } });
    const r1 = resolveMechanics(linnea, ctx1);
    // Initial flat heal: 1695
    expect(r1.perHit["burst-initial"].flatDmgBonus).toBe(1695);
    // Continuous flat heal: 339
    expect(r1.perHit["burst-continuous"].flatDmgBonus).toBe(339);

    const ctx2 = createCtx({ talentLevels: { burst: 1 } });
    const r2 = resolveMechanics(linnea, ctx2);
    // Initial flat heal: 770.38
    expect(r2.perHit["burst-initial"].flatDmgBonus).toBe(770.38);
    // Continuous flat heal: 154.08
    expect(r2.perHit["burst-continuous"].flatDmgBonus).toBe(154.08);
  });
});
