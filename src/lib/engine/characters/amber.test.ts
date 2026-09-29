import { describe, it, expect } from "vitest";
import { resolveAmber } from "./amber";
import { amber } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("amber mechanics", () => {
  it("A1 grants +10% CRIT Rate to Fiery Rain hits", () => {
    const r = resolveAmber(amber, ctxFor("amber"));
    expect(r.perHit["burst-wave-dmg"]?.critRateBonusPct).toBe(10);
    expect(r.perHit["burst-total-dmg"]?.critRateBonusPct).toBe(10);
  });

  it("A4 Precise Shot grants +15% ATK on weak spot hit", () => {
    const rActive = resolveAmber(amber, ctxFor("amber", {
      inputs: { "a4-precise-shot": 1 },
      baseAtk: 800,
    }));
    expect(rActive.statDeltas.atk).toBe(120); // 15% of 800
    expect(rActive.statDeltas.atkPercent).toBe(15);

    const rInactive = resolveAmber(amber, ctxFor("amber", {
      inputs: { "a4-precise-shot": 0 },
      baseAtk: 800,
    }));
    expect(rInactive.statDeltas.atk).toBeUndefined();
    expect(rInactive.statDeltas.atkPercent).toBeUndefined();
  });

  it("Weak Spot Auto-Crit grants +100% CRIT Rate to Aimed Shots", () => {
    const r = resolveAmber(amber, ctxFor("amber", {
      inputs: { "weakspot-auto-crit": 1 },
    }));
    expect(r.perHit["aimed"]?.critRateBonusPct).toBe(100);
    expect(r.perHit["aimed-c1"]?.critRateBonusPct).toBe(100);
    expect(r.perHit["fully-charged-aimed"]?.critRateBonusPct).toBe(100);
    expect(r.perHit["fully-charged-aimed-c1"]?.critRateBonusPct).toBe(100);
  });

  it("C1 secondary arrow enables at C1 and disables at C0", () => {
    const rC0 = resolveAmber(amber, ctxFor("amber", { constellationLevel: 0 }));
    expect(rC0.perHit["aimed-c1"]?.baseDmgMultiplier).toBe(0);
    expect(rC0.perHit["fully-charged-aimed-c1"]?.baseDmgMultiplier).toBe(0);

    const rC1 = resolveAmber(amber, ctxFor("amber", { constellationLevel: 1 }));
    expect(rC1.perHit["aimed-c1"]?.baseDmgMultiplier).toBe(1.0);
    expect(rC1.perHit["fully-charged-aimed-c1"]?.baseDmgMultiplier).toBe(1.0);
  });

  it("C2 Bunny Triggered adds +200% DMG bonus and unlocks manual-detonation-c2", () => {
    const rC0 = resolveAmber(amber, ctxFor("amber", { constellationLevel: 0 }));
    expect(rC0.perHit["manual-detonation-c2"]?.baseDmgMultiplier).toBe(0);

    const rC2 = resolveAmber(amber, ctxFor("amber", {
      constellationLevel: 2,
      inputs: { "c2-manual-detonation": 1 },
    }));
    expect(rC2.perHit["manual-detonation-c2"]?.baseDmgMultiplier).toBe(1.0);
    expect(rC2.perHit["manual-detonation-c2"]?.bonusDmgPct).toBe(200);
    expect(rC2.perHit["explosion-dmg"]?.bonusDmgPct).toBe(200);
  });

  it("C6 Wildfire grants +15% ATK and +15% Movement SPD at C6", () => {
    const rC0 = resolveAmber(amber, ctxFor("amber", {
      constellationLevel: 0,
      inputs: { "c6-wildfire": 1 },
      baseAtk: 800,
    }));
    expect(rC0.statDeltas.movementSpd).toBeUndefined();

    const rC6 = resolveAmber(amber, ctxFor("amber", {
      constellationLevel: 6,
      inputs: { "c6-wildfire": 1 },
      baseAtk: 800,
    }));
    expect(rC6.statDeltas.movementSpd).toBe(15);
    expect(rC6.statDeltas.atkPercent).toBe(15);
    expect(rC6.statDeltas.atk).toBe(120);
  });

  it("talent seed row count equals 238 (17 hits * 14 levels)", () => {
    const rows = flattenSeed(TALENT_SEED.filter(s => s.characterId === "amber"));
    expect(rows.length).toBe(238);
  });
});
