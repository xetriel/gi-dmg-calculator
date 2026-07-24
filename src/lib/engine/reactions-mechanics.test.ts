import { describe, it, expect } from "vitest";
import { levelMultiplier } from "./level-multiplier";
import { catalyzeAdditive, computeHit, stellarBRC, stellarEmBonus, type DamageStats } from "./damage";
import { transformativeDamage, TRANSFORMATIVE_BY_ELEMENT } from "./transformative";
import { indirectLunarDamage, lunarEmBonus, LUNAR_BY_ELEMENT } from "./lunar";
import { resolveMechanics, type MechanicsCtx } from "./mechanics";
import { resolveHitMultipliers, hitId } from "./validation";
import { flattenSeed, TALENT_SEED } from "../../data/talents";
import { huTao, arlecchino, neuvillette, clorinde } from "../../data/registry/characters";
import type { TalentScalingData } from "../talent-scaling";

const LV90 = 1446.853458;

const baseStats: DamageStats = {
  atk: 2000, hp: 20000, def: 0, em: 0,
  critRate: 50, critDmg: 100,
  dmgBonus: 0,
  normalDmgBonus: 0, chargedDmgBonus: 0, plungeDmgBonus: 0,
  skillDmgBonus: 0, burstDmgBonus: 0,
  pyroDmgBonus: 0, hydroDmgBonus: 0, dendroDmgBonus: 0, electroDmgBonus: 0,
  anemoDmgBonus: 0, cryoDmgBonus: 0, geoDmgBonus: 0, physicalDmgBonus: 0,
  dmgReduction: 0,
  enemyRes: 0,
  levelChar: 90, levelEnemy: 100,
  defReduction: 0, defIgnore: 0,
  energyRecharge: 100, healingBonus: 0,
};

// Build TalentScalingData for a character straight from its seed (as the page does).
function scalingFor(characterId: string): TalentScalingData {
  const out: TalentScalingData = {};
  for (const r of flattenSeed(TALENT_SEED.filter(s => s.characterId === characterId))) {
    const t = (out[r.talentType] ??= { levels: [], byLevel: {} });
    (t.byLevel[r.level] ??= {})[r.hitKey] = r.value;
  }
  for (const t of Object.values(out)) t.levels = Object.keys(t.byLevel).map(Number).sort((a, b) => a - b);
  return out;
}

describe("levelMultiplier", () => {
  it("matches wiki-cited anchors", () => {
    expect(levelMultiplier(90)).toBeCloseTo(LV90, 4);
    expect(levelMultiplier(80)).toBeCloseTo(1077.443668, 4);
    expect(levelMultiplier(1)).toBeCloseTo(17.165605, 4);
  });
  it("clamps out-of-range levels", () => {
    expect(levelMultiplier(0)).toBe(levelMultiplier(1));
    expect(levelMultiplier(120)).toBe(levelMultiplier(100));
  });
});

describe("aggravate (catalyze additive)", () => {
  it("EM 0: 1.15 × levelMult", () => {
    expect(catalyzeAdditive("Electro", "aggravate", 90, 0, 0)).toBeCloseTo(1.15 * LV90, 3);
  });
  it("EM scales by 5·EM/(EM+1200)", () => {
    const em = 200;
    expect(catalyzeAdditive("Electro", "aggravate", 90, em, 0))
      .toBeCloseTo(1.15 * LV90 * (1 + (5 * em) / (em + 1200)), 3);
  });
  it("only applies to Electro", () => {
    expect(catalyzeAdditive("Pyro", "aggravate", 90, 0, 0)).toBe(0);
  });
  it("flows through computeHit as additive base DMG", () => {
    const s = { ...baseStats, critRate: 0, critDmg: 0 };
    const none = computeHit(s, { multiplier: 100, scaling: "atk", element: "Electro", reaction: "none", reactionBonusPct: 0 });
    const agg = computeHit(s, { multiplier: 100, scaling: "atk", element: "Electro", reaction: "aggravate", reactionBonusPct: 0 });
    // def 190/390, res 1, dmgBonus 1 -> difference = additive × def
    expect(agg.nonCrit - none.nonCrit).toBeCloseTo(1.15 * LV90 * (190 / 390), 2);
  });
});

describe("transformative reactions", () => {
  it("Overloaded @90/EM0/res10", () => {
    expect(transformativeDamage("overloaded", 90, 0, 10)).toBeCloseTo(2.75 * LV90 * 0.9, 3);
  });
  it("EM factor 16·EM/(EM+2000)", () => {
    const em = 500;
    expect(transformativeDamage("swirl", 90, em, 0))
      .toBeCloseTo(0.6 * LV90 * (1 + (16 * em) / (em + 2000)), 3);
  });
  it("element applicability", () => {
    expect(TRANSFORMATIVE_BY_ELEMENT.Electro).toContain("overloaded");
    expect(TRANSFORMATIVE_BY_ELEMENT.Pyro).toContain("overloaded");
    expect(TRANSFORMATIVE_BY_ELEMENT.Hydro).toContain("electro-charged");
    expect(TRANSFORMATIVE_BY_ELEMENT.Geo).toEqual([]);
  });
});

describe("lunar reactions", () => {
  it("indirect Lunar-Charged: 1.8 × levelMult, can crit", () => {
    const s = { ...baseStats, critRate: 50, critDmg: 100 };
    const r = indirectLunarDamage("lunar-charged", s, 0, 0);
    expect(r.nonCrit).toBeCloseTo(1.8 * LV90, 3);
    expect(r.crit).toBeCloseTo(1.8 * LV90 * 2, 3);
    expect(r.avg).toBeCloseTo(1.8 * LV90 * 1.5, 3);
  });
  it("lunar EM bonus is 6·EM/(EM+2000)", () => {
    expect(lunarEmBonus(1000)).toBeCloseTo(2.0, 6);
  });
  it("Lunar Base DMG Bonus multiplies", () => {
    const r = indirectLunarDamage("lunar-charged", { ...baseStats, critRate: 0, critDmg: 0 }, 10, 0);
    expect(r.nonCrit).toBeCloseTo(1.8 * LV90 * 1.1, 3);
  });
  it("Lunar-Bloom has no indirect DMG; element gating", () => {
    expect(indirectLunarDamage("lunar-bloom", baseStats, 0, 0).nonCrit).toBe(0);
    expect(LUNAR_BY_ELEMENT.Electro).toEqual(["lunar-charged"]);
    expect(LUNAR_BY_ELEMENT.Pyro).toEqual([]);
  });
});

describe("seed data integrity", () => {
  it("row counts match the wiki table dimensions", () => {
    const count = (id: string) => flattenSeed(TALENT_SEED.filter(s => s.characterId === id)).length;
    expect(count("hu-tao")).toBe(205);       // NA 11×11 + skill 2×14 + burst 4×14
    expect(count("neuvillette")).toBe(152);  // NA 8×13 + skill 2×11 + burst 2×13
    expect(count("arlecchino")).toBe(225);   // NA 12×14 + skill 3×10 + burst 1×13 + special (c2) 1×14
    expect(count("clorinde")).toBe(203);     // NA 9×11 + skill 6×13 + burst 2×13
  });
  it("level-select resolves wiki spot values", () => {
    // Clorinde Swift Hunt Lv10 = 52.9 / 76.67; Neuvillette Waterfall Lv10 = 16.39;
    // Hu Tao 5-Hit Lv10 = 59.36 + 62.8 (two hits).
    const cl = resolveHitMultipliers(clorinde, scalingFor("clorinde"), { skill: "10" }, {});
    const gi = clorinde.talents.findIndex(g => g.type === "skill");
    const swiftIdx = clorinde.talents[gi].hits.findIndex(h => h.key === "swift-hunt-1");
    expect(cl[hitId(gi, swiftIdx)]).toBeCloseTo(52.9);
    expect(cl[hitId(gi, swiftIdx + 1)]).toBeCloseTo(76.67);

    const nv = resolveHitMultipliers(neuvillette, scalingFor("neuvillette"), { burst: "10" }, {});
    const bi = neuvillette.talents.findIndex(g => g.type === "burst");
    const wfIdx = neuvillette.talents[bi].hits.findIndex(h => h.key === "waterfall");
    expect(nv[hitId(bi, wfIdx)]).toBeCloseTo(16.39);

    const ht = resolveHitMultipliers(huTao, scalingFor("hu-tao"), { normal: "10" }, {});
    const ni = huTao.talents.findIndex(g => g.type === "normal");
    const h5 = huTao.talents[ni].hits.findIndex(h => h.key === "5-hit");
    expect(ht[hitId(ni, h5)]).toBeCloseTo(59.36);
    expect(ht[hitId(ni, h5 + 1)]).toBeCloseTo(62.8);
  });
});

describe("stellar-conduct helpers", () => {
  it("BRC: 0 hits → 1; n≥1 → 1.4 + 0.05n; clamps at 10", () => {
    expect(stellarBRC(0)).toBe(1);
    expect(stellarBRC(1)).toBeCloseTo(1.45);
    expect(stellarBRC(10)).toBeCloseTo(1.9);
    expect(stellarBRC(15)).toBeCloseTo(1.9);
    expect(stellarBRC(-3)).toBe(1);
  });
  it("EM bonus: 6·EM/(EM+2000)", () => {
    expect(stellarEmBonus(0)).toBe(0);
    expect(stellarEmBonus(2000)).toBeCloseTo(3);
    expect(stellarEmBonus(1000)).toBeCloseTo(2);
  });
});

describe("stellar-conduct computeHit branch", () => {
  const s = { ...baseStats, critRate: 0, critDmg: 0 };
  const stellarHit = {
    multiplier: 100, scaling: "atk" as const, element: "Cryo" as const,
    reaction: "none" as const, reactionBonusPct: 0,
    directReaction: { coefficient: 1.45, baseDmgBonusPct: 14, reactionBonusPct: 30 },
  };
  it("matches the wiki formula by hand", () => {
    // 1.45 × 100% × 2000 × 1.14 × (1 + 0 + 0.30) × res(0)=1
    expect(computeHit(s, stellarHit).nonCrit).toBeCloseTo(1.45 * 2000 * 1.14 * 1.3, 3);
  });
  it("ignores DMG Bonus%, DEF reduction, and enemy DEF (reaction damage)", () => {
    const base = computeHit(s, stellarHit).nonCrit;
    expect(computeHit({ ...s, dmgBonus: 100 }, stellarHit).nonCrit).toBeCloseTo(base, 6);
    expect(computeHit({ ...s, defReduction: 90 }, stellarHit).nonCrit).toBeCloseTo(base, 6);
    expect(computeHit({ ...s, levelEnemy: 1 }, stellarHit).nonCrit).toBeCloseTo(base, 6);
  });
  it("applies enemy RES and EM bonus", () => {
    const base = computeHit(s, stellarHit).nonCrit;
    expect(computeHit({ ...s, enemyRes: 10 }, stellarHit).nonCrit).toBeCloseTo(base * 0.9, 3);
    // EM 1000 → (1 + 2 + 0.3) / (1 + 0.3) on the reaction-bonus term
    expect(computeHit({ ...s, em: 1000 }, stellarHit).nonCrit).toBeCloseTo(base * (3.3 / 1.3), 3);
  });
  it("still crits normally", () => {
    const r = computeHit({ ...s, critRate: 50, critDmg: 100 }, stellarHit);
    expect(r.crit).toBeCloseTo(r.nonCrit * 2, 3);
    expect(r.avg).toBeCloseTo(r.nonCrit * 1.5, 3);
  });
});

describe("direct lunar computeHit branch (Lunar-Crystallize, DEF-scaled)", () => {
  const s = { ...baseStats, def: 1500, critRate: 0, critDmg: 0 };
  const lunarHit = {
    multiplier: 100, scaling: "def" as const, element: "Geo" as const,
    reaction: "none" as const, reactionBonusPct: 0,
    directReaction: { coefficient: 1.6, baseDmgBonusPct: 14, reactionBonusPct: 0 },
  };
  it("matches the wiki Direct Lunar formula by hand", () => {
    // 1.6 × 100% × 1500 × 1.14 × (1 + 0 + 0) × res(0)=1
    expect(computeHit(s, lunarHit).nonCrit).toBeCloseTo(1.6 * 1500 * 1.14, 3);
  });
  it("ignores DMG Bonus% and enemy DEF; scales with DEF stat", () => {
    const base = computeHit(s, lunarHit).nonCrit;
    expect(computeHit({ ...s, dmgBonus: 100 }, lunarHit).nonCrit).toBeCloseTo(base, 6);
    expect(computeHit({ ...s, defReduction: 90 }, lunarHit).nonCrit).toBeCloseTo(base, 6);
    expect(computeHit({ ...s, def: 3000 }, lunarHit).nonCrit).toBeCloseTo(base * 2, 3);
  });
});
