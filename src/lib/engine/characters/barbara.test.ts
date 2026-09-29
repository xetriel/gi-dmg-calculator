import { describe, it, expect } from "vitest";
import { resolveBarbara } from "./barbara";
import { barbara } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("barbara mechanics", () => {
  it("C2 Vitality Burst grants +15% Hydro DMG Bonus during Melody Loop at C2+", () => {
    // C0: even if toggled on, C2 is inactive
    const rC0 = resolveBarbara(barbara, ctxFor("barbara", {
      constellationLevel: 0,
      inputs: { "c2-hydro-bonus": 1, "melody-loop-active": 1 },
    }));
    expect(rC0.statDeltas.hydroDmgBonus).toBeUndefined();

    // C2 active
    const rC2Active = resolveBarbara(barbara, ctxFor("barbara", {
      constellationLevel: 2,
      inputs: { "c2-hydro-bonus": 1, "melody-loop-active": 1 },
    }));
    expect(rC2Active.statDeltas.hydroDmgBonus).toBe(15);

    // C2 toggled off
    const rC2Off = resolveBarbara(barbara, ctxFor("barbara", {
      constellationLevel: 2,
      inputs: { "c2-hydro-bonus": 0, "melody-loop-active": 1 },
    }));
    expect(rC2Off.statDeltas.hydroDmgBonus).toBeUndefined();

    // Melody Loop inactive
    const rMelodyOff = resolveBarbara(barbara, ctxFor("barbara", {
      constellationLevel: 2,
      inputs: { "c2-hydro-bonus": 1, "melody-loop-active": 0 },
    }));
    expect(rMelodyOff.statDeltas.hydroDmgBonus).toBeUndefined();
  });

  it("injects accurate flat healing components for Lv10 baseline", () => {
    const r = resolveBarbara(barbara, ctxFor("barbara", {
      constellationLevel: 0,
      talentLevels: { skill: 10, burst: 10 },
    }));

    expect(r.perHit["skill-heal-per-hit"]?.flatDmgBonus).toBe(158.90);
    expect(r.perHit["skill-charged-heal"]?.flatDmgBonus).toBeCloseTo(158.90 * 4, 2);
    expect(r.perHit["skill-continuous-heal"]?.flatDmgBonus).toBe(847.47);
    expect(r.perHit["burst-heal"]?.flatDmgBonus).toBe(3727);
  });

  it("scales flat healing components with constellation level boosts (C3 Burst +3, C5 Skill +3)", () => {
    // C5: skill level 13 (10 + 3)
    const rC5 = resolveBarbara(barbara, ctxFor("barbara", {
      constellationLevel: 5,
      talentLevels: { skill: 13, burst: 13 },
    }));

    expect(rC5.perHit["skill-heal-per-hit"]?.flatDmgBonus).toBe(198.63);
    expect(rC5.perHit["skill-charged-heal"]?.flatDmgBonus).toBeCloseTo(198.63 * 4, 2);
    expect(rC5.perHit["skill-continuous-heal"]?.flatDmgBonus).toBe(1059.00);
    expect(rC5.perHit["burst-heal"]?.flatDmgBonus).toBe(4659);
  });

  it("skill-charged-heal provides exactly 4x healing multiplier of skill-heal-per-hit", () => {
    const seed = TALENT_SEED.find((s) => s.characterId === "barbara")!;
    const normalHeal = seed.hits.find((h) => h.hitKey === "skill-heal-per-hit")!;
    const chargedHeal = seed.hits.find((h) => h.hitKey === "skill-charged-heal")!;

    expect(normalHeal).toBeDefined();
    expect(chargedHeal).toBeDefined();

    for (let i = 0; i < 14; i++) {
      expect(chargedHeal.values[i]).toBeCloseTo(normalHeal.values[i] * 4, 2);
    }
  });

  it("talent seed row count equals 182 (13 hits * 14 levels)", () => {
    const rows = flattenSeed(TALENT_SEED.filter((s) => s.characterId === "barbara"));
    expect(rows.length).toBe(182);
  });
});
