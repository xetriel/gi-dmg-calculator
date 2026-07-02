import { describe, it, expect } from "vitest";
import {
  resMultiplier,
  defMultiplier,
  dmgBonusMultiplier,
  amplifyingMultiplier,
  availableReactions,
  computeHit,
  type DamageStats,
} from "./damage";
import { validate, resolveStats, resolveHitMultipliers, statInputIds, hitId, type RawInputs } from "./validation";
import { arlecchino, neuvillette } from "../../data/registry/characters";
import type { TalentScalingData } from "../talent-scaling";

// Resolve hits with no scaling data (all from manual input) — mirrors the pre-level behavior.
const manualResolved = (config: typeof arlecchino, raw: RawInputs) =>
  resolveHitMultipliers(config, {}, {}, raw.hits);

const baseStats: DamageStats = {
  atk: 2000, hp: 0, def: 0, em: 0,
  critRate: 50, critDmg: 100,
  dmgBonus: 50, dmgReduction: 0,
  enemyRes: 10,
  levelChar: 90, levelEnemy: 100,
  defReduction: 0, defIgnore: 0,
};

describe("resMultiplier", () => {
  it("normal, negative, and high RES", () => {
    expect(resMultiplier(0)).toBeCloseTo(1);
    expect(resMultiplier(10)).toBeCloseTo(0.9);
    expect(resMultiplier(75)).toBeCloseTo(0.25);
    expect(resMultiplier(-40)).toBeCloseTo(1.2);
  });
});

describe("defMultiplier", () => {
  it("no reduction: K=1", () => {
    // (90+100) / ((90+100) + (100+100)*1) = 190/390
    expect(defMultiplier(baseStats)).toBeCloseTo(190 / 390, 6);
  });
  it("floors %DEF Bonus at -90% (K=0.10)", () => {
    const s = { ...baseStats, defReduction: 200, defIgnore: 0 };
    // K clamped to 0.10 -> 190 / (190 + 200*0.10) = 190/210
    expect(defMultiplier(s)).toBeCloseTo(190 / 210, 6);
  });
  it("combines reduction + ignore before the floor", () => {
    const s = { ...baseStats, defReduction: 80, defIgnore: 20 }; // total 100 -> floored to 90 -> K=0.10
    expect(defMultiplier(s)).toBeCloseTo(190 / 210, 6);
  });
});

describe("dmgBonusMultiplier", () => {
  it("bonus minus reduction", () => {
    expect(dmgBonusMultiplier({ ...baseStats, dmgBonus: 100, dmgReduction: 20 })).toBeCloseTo(1.8);
  });
});

describe("amplifyingMultiplier + availableReactions", () => {
  it("Pyro vaporize base 1.5, EM raises it", () => {
    expect(amplifyingMultiplier("Pyro", "vaporize", 0, 0)).toBeCloseTo(1.5);
    // emBonus = 2.78*200/1600 = 0.3475 -> 1.5 * 1.3475
    expect(amplifyingMultiplier("Pyro", "vaporize", 200, 0)).toBeCloseTo(1.5 * 1.3475, 5);
  });
  it("Hydro vaporize is 2.0; extra reaction bonus adds", () => {
    expect(amplifyingMultiplier("Hydro", "vaporize", 0, 0)).toBeCloseTo(2.0);
    expect(amplifyingMultiplier("Hydro", "vaporize", 0, 20)).toBeCloseTo(2.0 * 1.2);
  });
  it("Electro has aggravate but no amplifying reaction", () => {
    expect(availableReactions("Electro")).toEqual(["none", "aggravate"]);
    expect(amplifyingMultiplier("Electro", "vaporize", 500, 0)).toBe(1);
    expect(amplifyingMultiplier("Electro", "aggravate", 500, 0)).toBe(1); // additive, not amplifying
  });
  it("reaction options per element", () => {
    expect(availableReactions("Pyro")).toEqual(["none", "vaporize", "melt"]);
    expect(availableReactions("Hydro")).toEqual(["none", "vaporize"]);
  });
});

describe("computeHit (full pipeline)", () => {
  it("non-crit / crit / average with hand-computed numbers", () => {
    // base = 100% * 2000 = 2000; dmgBonus 1.5; def 190/390; res 0.9; no reaction
    const r = computeHit(baseStats, {
      multiplier: 100, scaling: "atk", element: "Pyro", reaction: "none", reactionBonusPct: 0,
    });
    const expectedNonCrit = 2000 * 1.5 * (190 / 390) * 0.9;
    expect(r.nonCrit).toBeCloseTo(expectedNonCrit, 4);
    expect(r.crit).toBeCloseTo(expectedNonCrit * 2, 4);          // critDmg 100%
    expect(r.avg).toBeCloseTo(expectedNonCrit * 1.5, 4);         // critRate 50% * critDmg 100%
  });
  it("uses the hit's own scaling stat (HP vs ATK)", () => {
    const s = { ...baseStats, atk: 1000, hp: 40000, dmgBonus: 0, enemyRes: 0, critRate: 0, critDmg: 0 };
    const atkHit = computeHit(s, { multiplier: 100, scaling: "atk", element: "Hydro", reaction: "none", reactionBonusPct: 0 });
    const hpHit = computeHit(s, { multiplier: 100, scaling: "hp", element: "Hydro", reaction: "none", reactionBonusPct: 0 });
    expect(hpHit.nonCrit / atkHit.nonCrit).toBeCloseTo(40, 6); // 40000 vs 1000
  });
});

describe("resolveStats", () => {
  it("sums base + flat and reads single fields", () => {
    const raw: RawInputs = {
      stats: { "atk.base": "1500", "atk.flat": "500", "hp.base": "10000", "hp.flat": "0", em: "100" },
      hits: {}, reaction: "none", reactionBonus: "",
    };
    const s = resolveStats(raw);
    expect(s.atk).toBe(2000);
    expect(s.hp).toBe(10000);
    expect(s.em).toBe(100);
  });
});

// Build a fully-filled, valid raw input for a config.
function fullRaw(config: typeof arlecchino, overrides: Record<string, string> = {}): RawInputs {
  const stats: Record<string, string> = {};
  for (const id of statInputIds(config)) stats[id] = "10";
  stats["levelChar"] = "90";
  stats["levelEnemy"] = "100";
  const hits: Record<string, string> = {};
  config.talents.forEach((g, gi) => g.hits.forEach((_h, hi) => { hits[hitId(gi, hi)] = "100"; }));
  return { stats: { ...stats, ...overrides }, hits, reaction: "none", reactionBonus: "" };
}

describe("validate", () => {
  it("flags every empty field on a blank form", () => {
    const raw: RawInputs = { stats: {}, hits: {}, reaction: "none", reactionBonus: "" };
    const res = validate(arlecchino, raw, manualResolved(arlecchino, raw));
    expect(res.ok).toBe(false);
    expect(Object.keys(res.errors).length).toBeGreaterThan(0);
    expect(res.errors["atk.base"]).toBe("Required");
    expect(res.errors[hitId(0, 0)]).toBe("Required");
  });
  it("passes when everything is filled", () => {
    const raw = fullRaw(arlecchino);
    const res = validate(arlecchino, raw, manualResolved(arlecchino, raw));
    expect(res.ok).toBe(true);
    expect(res.errors).toEqual({});
  });
  it("rejects out-of-range levels", () => {
    const raw = fullRaw(neuvillette, { levelChar: "150", levelEnemy: "0" });
    const res = validate(neuvillette, raw, manualResolved(neuvillette, raw));
    expect(res.ok).toBe(false);
    expect(res.errors["levelChar"]).toMatch(/level/);
    expect(res.errors["levelEnemy"]).toMatch(/level/);
  });
  it("requires reaction bonus only when a reaction is selected", () => {
    const raw = { ...fullRaw(arlecchino), reaction: "vaporize" as const, reactionBonus: "" };
    expect(validate(arlecchino, raw, manualResolved(arlecchino, raw)).errors["reactionBonus"]).toBe("Required");
    const ok = { ...raw, reactionBonus: "0" };
    expect(validate(arlecchino, ok, manualResolved(arlecchino, ok)).ok).toBe(true);
  });
  it("hints when DEF reduction exceeds 90%", () => {
    const raw = fullRaw(arlecchino, { defReduction: "80", defIgnore: "20" });
    const res = validate(arlecchino, raw, manualResolved(arlecchino, raw));
    expect(res.general.some(g => /90%/.test(g))).toBe(true);
  });
});

describe("resolveHitMultipliers", () => {
  // Neuvillette "normal" hits: 0=1-hit, 1=2-hit, ..., 4=equitable-judgment
  const scaling: TalentScalingData = {
    normal: { levels: [1, 10], byLevel: { 10: { "1-hit": 98.24, "equitable-judgment": 14.47 } } },
  };
  it("prefers the level-backed value over manual", () => {
    const r = resolveHitMultipliers(neuvillette, scaling, { normal: "10" }, { [hitId(0, 0)]: "5" });
    expect(r[hitId(0, 0)]).toBe(98.24);          // 1-hit from level table, not the manual "5"
    expect(r[hitId(0, 4)]).toBe(14.47);          // equitable-judgment (HP) from level table
  });
  it("falls back to manual when the level has no value for that hit", () => {
    const r = resolveHitMultipliers(neuvillette, scaling, { normal: "10" }, { [hitId(0, 1)]: "42" });
    expect(r[hitId(0, 1)]).toBe(42);             // 2-hit not in table -> manual
  });
  it("is null when neither level nor manual provides a value", () => {
    const r = resolveHitMultipliers(neuvillette, scaling, { normal: "10" }, {});
    expect(r[hitId(0, 1)]).toBeNull();
    // A talent group with no scaling data at all also falls through to manual (null here).
    expect(r[hitId(1, 0)]).toBeNull();
  });
});
