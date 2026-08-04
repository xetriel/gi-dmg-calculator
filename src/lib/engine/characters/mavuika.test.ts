import { describe, it, expect } from "vitest";
import { resolveMavuika } from "./mavuika";
import { mavuika } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("mavuika mechanics", () => {
  // ── A1: Gift of Flaming Flowers ──────────────────────────────────────
  it("A1 Gift of Flaming Flowers: ATK +30%", () => {
    const r1 = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "a1-nightsoul-burst": 1 }
    }));
    expect(r1.statDeltas.atk).toBe(0.30 * 800); // 30% of baseAtk (800)

    const r2 = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "a1-nightsoul-burst": 0 }
    }));
    expect(r2.statDeltas.atk).toBeUndefined();
  });

  // ── A4: Kiongozi ─────────────────────────────────────────────────────
  it("A4 Kiongozi: DMG +0.2% per Fighting Spirit (max 40%)", () => {
    // 200 FS → 40% DMG
    const r1 = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "a4-kiongozi": 1, "fighting-spirit": 200 }
    }));
    expect(r1.statDeltas.dmgBonus).toBe(40);

    // 100 FS → 20% DMG
    const r2 = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "a4-kiongozi": 1, "fighting-spirit": 100 }
    }));
    expect(r2.statDeltas.dmgBonus).toBe(20);

    // 0 FS → no bonus
    const r3 = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "a4-kiongozi": 1, "fighting-spirit": 0 }
    }));
    expect(r3.statDeltas.dmgBonus).toBeUndefined();

    // Kiongozi off → no bonus
    const r4 = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "a4-kiongozi": 0, "fighting-spirit": 200 }
    }));
    expect(r4.statDeltas.dmgBonus).toBeUndefined();
  });

  // ── C1: The Night-Lord's Explication ──────────────────────────────────
  it("C1: ATK +40% after gaining Fighting Spirit", () => {
    const r1 = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 1,
      inputs: { "c1-atk-buff": 1 }
    }));
    expect(r1.statDeltas.atk).toBe(0.40 * 800); // 40% of 800

    // No effect at C0
    const r2 = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 0,
      inputs: { "c1-atk-buff": 1 }
    }));
    expect(r2.statDeltas.atk).toBeUndefined();
  });

  // ── C2: The Ashen Price ───────────────────────────────────────────────
  it("C2: ATK +200 and DEF shred", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 2,
      inputs: { "c2-def-shred": 1 }
    }));
    expect(r.statDeltas.atk).toBe(200);
    expect(r.statDeltas.defReduction).toBe(20);
  });

  it("C2 Flamestrider: flat DMG bonuses on NA/CA/Sunfell", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 2,
      inputs: { "flamestrider-active": 1 }
    }));
    // ATK = 2000 (baseStats) + 200 (C2) = 2200
    const atkEff = 2200;
    expect(r.perHit["flamestrider-1-hit"]?.flatDmgBonus).toBe(0.60 * atkEff);
    expect(r.perHit["flamestrider-charged-cyclic"]?.flatDmgBonus).toBe(0.90 * atkEff);
    expect(r.perHit["sunfell-slice"]?.flatDmgBonus).toBe(1.20 * atkEff);
  });

  it("C2 Flamestrider bonuses not applied without stance", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 2,
      inputs: { "flamestrider-active": 0, "burst-active": 0 }
    }));
    expect(r.perHit["flamestrider-1-hit"]?.flatDmgBonus).toBeUndefined();
  });

  // ── C4: The Leader's Resolve ──────────────────────────────────────────
  it("C4: Kiongozi extra +10% DMG Bonus", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 4,
      inputs: { "a4-kiongozi": 1, "fighting-spirit": 200 }
    }));
    // 40% (A4 cap) + 10% (C4) = 50%
    expect(r.statDeltas.dmgBonus).toBe(50);
  });

  // ── Fighting Spirit burst flat DMG bonuses ────────────────────────────
  it("Fighting Spirit: flat DMG on Sunfell/NA/CA when burst active", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "burst-active": 1, "fighting-spirit": 200 }
    }));
    // All flat DMG bonuses should be > 0
    expect(r.perHit["sunfell-slice"]?.flatDmgBonus).toBeGreaterThan(0);
    expect(r.perHit["flamestrider-1-hit"]?.flatDmgBonus).toBeGreaterThan(0);
    expect(r.perHit["flamestrider-charged-cyclic"]?.flatDmgBonus).toBeGreaterThan(0);
  });

  it("Fighting Spirit: no bonuses when burst inactive", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "burst-active": 0, "fighting-spirit": 200 }
    }));
    expect(r.perHit["sunfell-slice"]?.flatDmgBonus).toBeUndefined();
  });

  it("Fighting Spirit: no bonuses at 0 spirit", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      inputs: { "burst-active": 1, "fighting-spirit": 0 }
    }));
    expect(r.perHit["sunfell-slice"]?.flatDmgBonus).toBeUndefined();
  });

  // ── C6: informational ────────────────────────────────────────────────
  it("C6 informational note", () => {
    const r = resolveMavuika(mavuika, ctxFor("mavuika", {
      constellationLevel: 6,
    }));
    expect(r.notes.some(n => n.includes("C6"))).toBe(true);
  });

  // ── Talent seed row count ─────────────────────────────────────────────
  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "mavuika"));
    // 9 NA + 9 Skill + 4 Burst (1 damage + 3 buff) = 22 hits × 15 levels = 330
    expect(rows.length).toBe(330);
  });
});
