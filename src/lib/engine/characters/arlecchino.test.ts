import { describe, it, expect } from "vitest";
import { resolveArlecchino } from "./arlecchino";
import { arlecchino } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";

describe("mechanics: Arlecchino", () => {
  it("Masque additive = masque%[NA lvl] × BoL% × ATK on NA hits only", () => {
    // Wiki: base DMG = ATK × (Talent% + Masque% × BoL/MaxHP).
    // NA lv10 masque = 238 (%), BoL 200%, ATK 2000 -> 2.38 × 2.0 × 2000 = 9520
    const r = resolveArlecchino(arlecchino, ctxFor("arlecchino", { inputs: { "bond-of-life": 200 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBeCloseTo(9520, 0);
    expect(r.perHit["high-plunge"]?.flatDmgBonus).toBeUndefined(); // plunging hits unaffected
    expect(r.perHit["charged"]?.flatDmgBonus).toBeUndefined(); // charged hits unaffected
    expect(r.perHit["spike"]).toBeUndefined(); // skill hits unaffected
  });
  it("Masque does not scale with Max HP (only the Burst heal note does)", () => {
    const lowHp = resolveArlecchino(arlecchino, ctxFor("arlecchino", { stats: { ...baseStats, hp: 10000 }, inputs: { "bond-of-life": 100 } }));
    const highHp = resolveArlecchino(arlecchino, ctxFor("arlecchino", { stats: { ...baseStats, hp: 40000 }, inputs: { "bond-of-life": 100 } }));
    expect(highHp.perHit["1-hit"].flatDmgBonus).toBe(lowHp.perHit["1-hit"].flatDmgBonus);
  });
  it("C1 adds +100pp to Masque", () => {
    const r = resolveArlecchino(arlecchino, ctxFor("arlecchino", { constellationLevel: 1, inputs: { "bond-of-life": 200 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBeCloseTo(3.38 * 2.0 * 2000, 0); // 13520
  });
  it("C6: burst flat 700% ATK × BoL% and crit bonuses on NA+burst only", () => {
    const r = resolveArlecchino(arlecchino, ctxFor("arlecchino", { constellationLevel: 6, inputs: { "bond-of-life": 100 } }));
    expect(r.perHit["skill-dmg"].flatDmgBonus).toBeCloseTo(7 * 1 * 2000, 0);
    expect(r.perHit["skill-dmg"].critRateBonusPct).toBe(10);
    expect(r.perHit["1-hit"].critDmgBonusPct).toBe(70);
    expect(r.perHit["charged"]?.critDmgBonusPct).toBeUndefined();
    expect(r.perHit["high-plunge"]?.critDmgBonusPct).toBeUndefined();
  });
});
