import { describe, it, expect } from "vitest";
import { resolveBaizhu } from "./baizhu";
import { baizhu } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("baizhu mechanics", () => {
  it("A1 Five Fortunes Forever toggles Dendro DMG vs Healing Bonus", () => {
    // Default / HP >= 50%
    const rHigh = resolveBaizhu(baizhu, ctxFor("baizhu", {
      inputs: { "a1-hp-threshold": 1 },
    }));
    expect(rHigh.statDeltas.dendroDmgBonus).toBe(25);
    expect(rHigh.statDeltas.healingBonus).toBeUndefined();

    // HP < 50%
    const rLow = resolveBaizhu(baizhu, ctxFor("baizhu", {
      inputs: { "a1-hp-threshold": 0 },
    }));
    expect(rLow.statDeltas.dendroDmgBonus).toBeUndefined();
    expect(rLow.statDeltas.healingBonus).toBe(20);
  });

  it("A4 Year of Verdant Favor reaction bonus scales with HP", () => {
    // Disabled
    const rOff = resolveBaizhu(baizhu, ctxFor("baizhu", {
      inputs: { "a4-verdant-favor": 0 },
      stats: { hp: 40000 },
    }));
    expect(rOff.statDeltas.bloomDmgBonus).toBeUndefined();
    expect(rOff.statDeltas.spreadDmgBonus).toBeUndefined();

    // 40,000 HP
    const r40k = resolveBaizhu(baizhu, ctxFor("baizhu", {
      inputs: { "a4-verdant-favor": 1 },
      stats: { hp: 40000 },
    }));
    expect(r40k.statDeltas.bloomDmgBonus).toBe(80);
    expect(r40k.statDeltas.hyperbloomDmgBonus).toBe(80);
    expect(r40k.statDeltas.burgeonDmgBonus).toBe(80);
    expect(r40k.statDeltas.burningDmgBonus).toBe(80);
    expect(r40k.statDeltas.lunarBloomDmgBonus).toBeCloseTo(28, 5);
    expect(r40k.statDeltas.spreadDmgBonus).toBeCloseTo(32, 5);
    expect(r40k.statDeltas.aggravateDmgBonus).toBeCloseTo(32, 5);
  });

  it("A4 Year of Verdant Favor reaction bonus caps at 50,000 HP", () => {
    // 60,000 HP (should cap at 50,000 HP)
    const r60k = resolveBaizhu(baizhu, ctxFor("baizhu", {
      inputs: { "a4-verdant-favor": 1 },
      stats: { hp: 60000 },
    }));
    expect(r60k.statDeltas.bloomDmgBonus).toBe(100);
    expect(r60k.statDeltas.hyperbloomDmgBonus).toBe(100);
    expect(r60k.statDeltas.burgeonDmgBonus).toBe(100);
    expect(r60k.statDeltas.burningDmgBonus).toBe(100);
    expect(r60k.statDeltas.lunarBloomDmgBonus).toBeCloseTo(35, 5);
    expect(r60k.statDeltas.spreadDmgBonus).toBeCloseTo(40, 5);
    expect(r60k.statDeltas.aggravateDmgBonus).toBeCloseTo(40, 5);
  });

  it("C2 Gossamer Sprite: Splice enables at C2 and disables below C2", () => {
    const rC0 = resolveBaizhu(baizhu, ctxFor("baizhu", { constellationLevel: 0 }));
    expect(rC0.perHit["c2-splice-dmg"]?.baseDmgMultiplier).toBe(0);

    const rC1 = resolveBaizhu(baizhu, ctxFor("baizhu", { constellationLevel: 1 }));
    expect(rC1.perHit["c2-splice-dmg"]?.baseDmgMultiplier).toBe(0);

    const rC2 = resolveBaizhu(baizhu, ctxFor("baizhu", { constellationLevel: 2 }));
    expect(rC2.perHit["c2-splice-dmg"]?.baseDmgMultiplier).toBe(1.0);
  });

  it("C4 Ancient Art of Perception gives +80 EM when active at C4+", () => {
    const rC0 = resolveBaizhu(baizhu, ctxFor("baizhu", {
      constellationLevel: 0,
      inputs: { "c4-art-of-perception": 1 },
    }));
    expect(rC0.statDeltas.em).toBeUndefined();

    const rC4Off = resolveBaizhu(baizhu, ctxFor("baizhu", {
      constellationLevel: 4,
      inputs: { "c4-art-of-perception": 0 },
    }));
    expect(rC4Off.statDeltas.em).toBeUndefined();

    const rC4On = resolveBaizhu(baizhu, ctxFor("baizhu", {
      constellationLevel: 4,
      inputs: { "c4-art-of-perception": 1 },
    }));
    expect(rC4On.statDeltas.em).toBe(80);
  });

  it("C6 Elimination of Malicious Qi gives +8% Max HP Flat DMG to Spiritveins", () => {
    const rC5 = resolveBaizhu(baizhu, ctxFor("baizhu", {
      constellationLevel: 5,
      stats: { hp: 50000 },
    }));
    expect(rC5.perHit["burst-spiritvein"]?.flatDmgBonus).toBeUndefined();

    const rC6 = resolveBaizhu(baizhu, ctxFor("baizhu", {
      constellationLevel: 6,
      stats: { hp: 50000 },
    }));
    expect(rC6.perHit["burst-spiritvein"]?.flatDmgBonus).toBe(4000); // 8% of 50000
  });

  it("talent seed row count equals 210 (15 hits * 14 levels)", () => {
    const rows = flattenSeed(TALENT_SEED.filter((s) => s.characterId === "baizhu"));
    expect(rows.length).toBe(210);
  });
});
