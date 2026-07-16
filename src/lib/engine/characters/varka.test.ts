import { describe, it, expect } from "vitest";
import { resolveMechanics } from "../mechanics";
import { varka } from "../../../data/registry/characters/varka";
import { varkaSeed } from "../../../data/talents/varka";
import type { DamageStats } from "../damage";
import type { TalentScalingData } from "../../talent-scaling";
import type { MechanicsCtx } from "../mechanics-utils";

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

// Populate the mock scaling with all values from varkaSeed
varkaSeed.hits.forEach(h => {
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
    "azure-oath-stacks": 4,
    "party-has-pyro": 1,
    "party-has-hydro": 0,
    "party-has-electro": 0,
    "party-has-cryo": 0,
    "a1-resonance-tier1": 1,
    "a1-resonance-tier2": 0,
    "lyrical-libation": 1,
    "c4-swirl-buff": 1,
    ...overrides.inputs,
  };
  return {
    stats: { ...baseStats, ...overrides.stats } as DamageStats,
    baseAtk: overrides.baseAtk ?? 1000,
    baseDef: overrides.baseDef ?? 800,
    constellationLevel: overrides.constellationLevel ?? 0,
    talentLevels: { normal: 1, skill: 1, burst: 1, ...overrides.talentLevels },
    scaling: mockScaling,
    inputs,
  };
}

describe("Varka Mechanics & Scale Resolving", () => {
  it("Element Conversion Priority", () => {
    // Pyro priority
    const ctxPyro = createCtx({
      inputs: { "party-has-pyro": 1, "party-has-hydro": 1, "party-has-electro": 1, "party-has-cryo": 1 }
    });
    const rPyro = resolveMechanics(varka, ctxPyro);
    expect(rPyro.perHit["sd-1-hit"].element).toBe("Pyro");

    // Hydro priority
    const ctxHydro = createCtx({
      inputs: { "party-has-pyro": 0, "party-has-hydro": 1, "party-has-electro": 1, "party-has-cryo": 1 }
    });
    const rHydro = resolveMechanics(varka, ctxHydro);
    expect(rHydro.perHit["sd-1-hit"].element).toBe("Hydro");

    // Electro priority
    const ctxElectro = createCtx({
      inputs: { "party-has-pyro": 0, "party-has-hydro": 0, "party-has-electro": 1, "party-has-cryo": 1 }
    });
    const rElectro = resolveMechanics(varka, ctxElectro);
    expect(rElectro.perHit["sd-1-hit"].element).toBe("Electro");

    // Cryo priority
    const ctxCryo = createCtx({
      inputs: { "party-has-pyro": 0, "party-has-hydro": 0, "party-has-electro": 0, "party-has-cryo": 1 }
    });
    const rCryo = resolveMechanics(varka, ctxCryo);
    expect(rCryo.perHit["sd-1-hit"].element).toBe("Cryo");

    // Fallback Anemo
    const ctxNone = createCtx({
      inputs: { "party-has-pyro": 0, "party-has-hydro": 0, "party-has-electro": 0, "party-has-cryo": 0 }
    });
    const rNone = resolveMechanics(varka, ctxNone);
    expect(rNone.perHit["sd-1-hit"].element).toBe("Anemo");
  });

  it("A1 ATK Scaling DMG Bonus & Cap", () => {
    // 1000 ATK -> +10% Anemo & Pyro (based on party element)
    const ctx1000 = createCtx({ stats: { ...baseStats, atk: 1000 } });
    const r1000 = resolveMechanics(varka, ctx1000);
    expect(r1000.statDeltas.anemoDmgBonus).toBe(10);
    expect(r1000.statDeltas.pyroDmgBonus).toBe(10);

    // 2000 ATK -> +20%
    const ctx2000 = createCtx({ stats: { ...baseStats, atk: 2000 } });
    const r2000 = resolveMechanics(varka, ctx2000);
    expect(r2000.statDeltas.anemoDmgBonus).toBe(20);
    expect(r2000.statDeltas.pyroDmgBonus).toBe(20);

    // 3000 ATK -> +25% (cap)
    const ctx3000 = createCtx({ stats: { ...baseStats, atk: 3000 } });
    const r3000 = resolveMechanics(varka, ctx3000);
    expect(r3000.statDeltas.anemoDmgBonus).toBe(25);
    expect(r3000.statDeltas.pyroDmgBonus).toBe(25);
  });

  it("A1 Resonance damage multipliers", () => {
    // Tier 1 resonance: 1.4x DMG
    const ctxTier1 = createCtx({ inputs: { "a1-resonance-tier1": 1, "a1-resonance-tier2": 0 } });
    const rTier1 = resolveMechanics(varka, ctxTier1);
    expect(rTier1.perHit["sd-1-hit"].baseDmgMultiplier).toBe(1.4);

    // Tier 2 resonance: 2.2x DMG (overrides tier 1)
    const ctxTier2 = createCtx({ inputs: { "a1-resonance-tier1": 1, "a1-resonance-tier2": 1 } });
    const rTier2 = resolveMechanics(varka, ctxTier2);
    expect(rTier2.perHit["sd-1-hit"].baseDmgMultiplier).toBe(2.2);
  });

  it("Simultaneous Physical & Elemental hits", () => {
    // Both regular attacks and Sturm und Drang elemental slashes are active simultaneously
    const ctx = createCtx({ inputs: { "a1-resonance-tier1": 1, "a1-resonance-tier2": 0 } });
    const r = resolveMechanics(varka, ctx);
    
    // Regular Normal Attack should be active (Physical, 1.0 multiplier)
    expect(r.perHit["1-hit"].baseDmgMultiplier).toBe(1.0);
    expect(r.perHit["1-hit"].element).toBe("Physical");

    // Sturm und Drang hits should be active simultaneously
    expect(r.perHit["sd-1-hit"].baseDmgMultiplier).toBe(1.4); // active (using Tier 1 Resonance)
    expect(r.perHit["sd-1-hit"].element).toBe("Pyro"); // Right-hand element (Pyro checked)
    expect(r.perHit["sd-2-hit-a"].element).toBe("Anemo"); // Left-hand element (always Anemo)
  });

  it("A1 Resonance limits based on checked elements", () => {
    // 1 element checked (Pyro): Tier 1 and Tier 2 both valid
    const ctx1 = createCtx({
      inputs: { "party-has-pyro": 1, "party-has-hydro": 0, "party-has-electro": 0, "a1-resonance-tier1": 1, "a1-resonance-tier2": 1 }
    });
    const r1 = resolveMechanics(varka, ctx1);
    expect(r1.perHit["sd-1-hit"].baseDmgMultiplier).toBe(2.2);

    // 2 elements checked (Pyro + Hydro): Tier 2 ignored, falls back to Tier 1 (1.4x)
    const ctx2 = createCtx({
      inputs: { "party-has-pyro": 1, "party-has-hydro": 1, "party-has-electro": 0, "a1-resonance-tier1": 1, "a1-resonance-tier2": 1 }
    });
    const r2 = resolveMechanics(varka, ctx2);
    expect(r2.perHit["sd-1-hit"].baseDmgMultiplier).toBe(1.4);

    // 3 elements checked (Pyro + Hydro + Electro): Both Tier 1 and Tier 2 ignored -> 1.0x DMG multiplier
    const ctx3 = createCtx({
      inputs: { "party-has-pyro": 1, "party-has-hydro": 1, "party-has-electro": 1, "a1-resonance-tier1": 1, "a1-resonance-tier2": 1 }
    });
    const r3 = resolveMechanics(varka, ctx3);
    expect(r3.perHit["sd-1-hit"].baseDmgMultiplier).toBe(1.0);
  });

  it("A4 Stacks & C6 Stacks CRIT DMG Buff", () => {
    // A4: 4 stacks -> 4 * 7.5% = 30% DMG Bonus
    const ctxA4 = createCtx({ inputs: { "azure-oath-stacks": 4 }, constellationLevel: 0 });
    const rA4 = resolveMechanics(varka, ctxA4);
    expect(rA4.perHit["sd-1-hit"].bonusDmgPct).toBe(30);
    expect(rA4.statDeltas.critDmg).toBeUndefined(); // no crit bonus pre-C6

    // C6: 4 stacks -> 4 * 20% = +80% CRIT DMG
    const ctxC6 = createCtx({ inputs: { "azure-oath-stacks": 4 }, constellationLevel: 6 });
    const rC6 = resolveMechanics(varka, ctxC6);
    expect(rC6.statDeltas.critDmg).toBe(80);
  });

  it("C1 Lyrical Libation multiplier", () => {
    const ctxC1 = createCtx({ inputs: { "lyrical-libation": 1, "a1-resonance-tier1": 0 }, constellationLevel: 1 });
    const rC1 = resolveMechanics(varka, ctxC1);
    // baseDmgMult = 1.0 (no A1 resonance), c1Mult = 2.0 -> four-winds-ascension should have 2.0x baseDmgMultiplier
    expect(rC1.perHit["four-winds-ascension-a"].baseDmgMultiplier).toBe(2.0);
    // azure-devour has x2 hits, so its baseDmgMultiplier is 2 * 2.0 = 4.0
    expect(rC1.perHit["azure-devour-a"].baseDmgMultiplier).toBe(4.0);
  });

  it("C2 Additional Strike", () => {
    // C2 strike is active if Sturm is on
    const ctxC2 = createCtx({ constellationLevel: 2 });
    const rC2 = resolveMechanics(varka, ctxC2);
    expect(rC2.perHit["c2-strike"].baseDmgMultiplier).toBe(1.0);
    expect(rC2.perHit["c2-strike"].element).toBe("Anemo");
  });

  it("C4 Swirl Buff", () => {
    const ctxC4 = createCtx({ inputs: { "c4-swirl-buff": 1 }, constellationLevel: 4 });
    const rC4 = resolveMechanics(varka, ctxC4);
    // grants +20% Anemo DMG & corresponding Element DMG (Pyro)
    // plus the A1 ATK scaling bonus (+10% for 1000 ATK)
    expect(rC4.statDeltas.anemoDmgBonus).toBe(30); // 20 + 10
    expect(rC4.statDeltas.pyroDmgBonus).toBe(30); // 20 + 10
  });
});
