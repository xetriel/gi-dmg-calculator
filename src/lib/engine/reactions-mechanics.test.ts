import { describe, it, expect } from "vitest";
import { levelMultiplier } from "./level-multiplier";
import { catalyzeAdditive, computeHit, type DamageStats } from "./damage";
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
  dmgBonus: 0, dmgReduction: 0,
  enemyRes: 0,
  levelChar: 90, levelEnemy: 100,
  defReduction: 0, defIgnore: 0,
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

function ctxFor(characterId: string, overrides: Partial<MechanicsCtx> = {}): MechanicsCtx {
  return {
    stats: baseStats,
    baseAtk: 800,
    constellationLevel: 0,
    talentLevels: { normal: 10, skill: 10, burst: 10 },
    scaling: scalingFor(characterId),
    inputs: {},
    ...overrides,
  };
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

describe("mechanics: Hu Tao", () => {
  it("Paramita adds skill% of Max HP as ATK (uncapped case)", () => {
    // skill lv10 atk-increase = 6.26 (% Max HP) -> 6.26% × 20000 = 1252 < 4×800
    const r = resolveMechanics(huTao, ctxFor("hu-tao", { inputs: { paramita: 1 } }));
    expect(r.statDeltas.atk).toBeCloseTo(1252, 1);
  });
  it("Paramita caps at 400% Base ATK", () => {
    const r = resolveMechanics(huTao, ctxFor("hu-tao", { baseAtk: 200, inputs: { paramita: 1 } }));
    expect(r.statDeltas.atk).toBeCloseTo(800, 6); // 4 × 200
  });
  it("Sanguine Rouge adds +33 Pyro DMG Bonus", () => {
    const r = resolveMechanics(huTao, ctxFor("hu-tao", { inputs: { "low-hp": 1 } }));
    expect(r.statDeltas.dmgBonus).toBe(33);
  });
});

describe("mechanics: Arlecchino", () => {
  it("Masque additive = masque%[NA lvl] × BoL% × ATK on NA hits", () => {
    // Wiki: base DMG = ATK × (Talent% + Masque% × BoL/MaxHP).
    // NA lv10 masque = 238 (%), BoL 200%, ATK 2000 -> 2.38 × 2.0 × 2000 = 9520
    const r = resolveMechanics(arlecchino, ctxFor("arlecchino", { inputs: { "bond-of-life": 200 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBeCloseTo(9520, 0);
    expect(r.perHit["high-plunge"].flatDmgBonus).toBeCloseTo(9520, 0);
    expect(r.perHit["spike"]).toBeUndefined(); // skill hits unaffected
  });
  it("Masque does not scale with Max HP (only the Burst heal note does)", () => {
    const lowHp = resolveMechanics(arlecchino, ctxFor("arlecchino", { stats: { ...baseStats, hp: 10000 }, inputs: { "bond-of-life": 100 } }));
    const highHp = resolveMechanics(arlecchino, ctxFor("arlecchino", { stats: { ...baseStats, hp: 40000 }, inputs: { "bond-of-life": 100 } }));
    expect(highHp.perHit["1-hit"].flatDmgBonus).toBe(lowHp.perHit["1-hit"].flatDmgBonus);
  });
  it("C1 adds +100pp to Masque", () => {
    const r = resolveMechanics(arlecchino, ctxFor("arlecchino", { constellationLevel: 1, inputs: { "bond-of-life": 200 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBeCloseTo(3.38 * 2.0 * 2000, 0); // 13520
  });
  it("C6: burst flat 700% ATK × BoL% and crit bonuses on NA+burst", () => {
    const r = resolveMechanics(arlecchino, ctxFor("arlecchino", { constellationLevel: 6, inputs: { "bond-of-life": 100 } }));
    expect(r.perHit["skill-dmg"].flatDmgBonus).toBeCloseTo(7 * 1 * 2000, 0);
    expect(r.perHit["skill-dmg"].critRateBonusPct).toBe(10);
    expect(r.perHit["1-hit"].critDmgBonusPct).toBe(70);
  });
});

describe("mechanics: Neuvillette", () => {
  it("Draconic stacks multiply Equitable Judgment only", () => {
    const r = resolveMechanics(neuvillette, ctxFor("neuvillette", { inputs: { "draconic-stacks": 3, "current-hp": 0 } }));
    expect(r.perHit["equitable-judgment"].baseDmgMultiplier).toBeCloseTo(1.6);
    expect(r.perHit["1-hit"]).toBeUndefined();
  });
  it("C1 adds a stack (capped at 3); C2 adds 14% CRIT DMG per stack", () => {
    const r = resolveMechanics(neuvillette, ctxFor("neuvillette", { constellationLevel: 2, inputs: { "draconic-stacks": 2, "current-hp": 0 } }));
    expect(r.perHit["equitable-judgment"].baseDmgMultiplier).toBeCloseTo(1.6); // 2+1 -> 3
    expect(r.perHit["equitable-judgment"].critDmgBonusPct).toBe(42);
  });
  it("A4 current-HP Hydro bonus caps at +30%", () => {
    expect(resolveMechanics(neuvillette, ctxFor("neuvillette", { inputs: { "current-hp": 100 } })).statDeltas.dmgBonus).toBe(30);
    expect(resolveMechanics(neuvillette, ctxFor("neuvillette", { inputs: { "current-hp": 60 } })).statDeltas.dmgBonus).toBeCloseTo(18);
    expect(resolveMechanics(neuvillette, ctxFor("neuvillette", { inputs: { "current-hp": 30 } })).statDeltas.dmgBonus).toBeUndefined();
  });
});

describe("mechanics: Clorinde", () => {
  it("Dark-Shattering Flame: 20% ATK per stack, cap 1800", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { inputs: { "dark-flame-stacks": 3 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBeCloseTo(1200, 0); // 3 × 0.2 × 2000
    const capped = resolveMechanics(clorinde, ctxFor("clorinde", { stats: { ...baseStats, atk: 4000 }, inputs: { "dark-flame-stacks": 3 } }));
    expect(capped.perHit["skill-dmg-x5"].flatDmgBonus).toBe(1800);
  });
  it("C2 upgrades to 30% per stack, cap 2700", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { stats: { ...baseStats, atk: 4000 }, constellationLevel: 2, inputs: { "dark-flame-stacks": 3 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBe(2700); // 3 × 0.3 × 4000 = 3600 -> cap
  });
  it("C4: +2% Last Lightfall DMG per 1% BoL, max 200", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { constellationLevel: 4, inputs: { "bond-of-life": 150 } }));
    expect(r.perHit["skill-dmg-x5"].bonusDmgPct).toBe(200); // 300 -> cap
  });
  it("A4 crit stacks and C6 crit buffs", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { constellationLevel: 6, inputs: { "a4-crit-stacks": 2 } }));
    expect(r.statDeltas.critRate).toBe(30); // 2×10 + C6 10
    expect(r.statDeltas.critDmg).toBe(70);
  });
});

describe("seed data integrity", () => {
  it("row counts match the wiki table dimensions", () => {
    const count = (id: string) => flattenSeed(TALENT_SEED.filter(s => s.characterId === id)).length;
    expect(count("hu-tao")).toBe(205);       // NA 11×11 + skill 2×14 + burst 4×14
    expect(count("neuvillette")).toBe(152);  // NA 8×13 + skill 2×11 + burst 2×13
    expect(count("arlecchino")).toBe(211);   // NA 12×14 + skill 3×10 + burst 1×13
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
