import { describe, it, expect } from "vitest";
import { resolveDurin } from "./durin";
import { durin } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("durin mechanics", () => {
  it("A1 Passive: Purity RES shred Element scaling", () => {
    // Purity form RES shred without Hexerei: -20% RES
    const r1 = resolveDurin(durin, ctxFor("durin", { inputs: { "purity-form": 1, "purity-res-shred": 1, "hexerei-party-members": 0 } }));
    expect(r1.statDeltas.enemyRes).toBe(-20);

    // Purity form RES shred with Hexerei: -35% RES
    const r2 = resolveDurin(durin, ctxFor("durin", { inputs: { "purity-form": 1, "purity-res-shred": 1, "hexerei-party-members": 1 } }));
    expect(r2.statDeltas.enemyRes).toBe(-35);
  });

  it("A1 Passive: Darkness Form Vaporize/Melt DMG Bonus", () => {
    // Darkness form reaction bonus without Hexerei: +40%
    const r1 = resolveDurin(durin, ctxFor("durin", { inputs: { "darkness-form": 1, "hexerei-party-members": 0 } }));
    expect(r1.perHit["white-flame-dmg"]?.reactionBonusPct).toBe(40);
    expect(r1.perHit["dark-decay-dmg"]?.reactionBonusPct).toBe(40);

    // Darkness form reaction bonus with Hexerei: +70%
    const r2 = resolveDurin(durin, ctxFor("durin", { inputs: { "darkness-form": 1, "hexerei-party-members": 1 } }));
    expect(r2.perHit["white-flame-dmg"]?.reactionBonusPct).toBe(70);
    expect(r2.perHit["dark-decay-dmg"]?.reactionBonusPct).toBe(70);
  });

  it("A4 Passive: Chaos Formed Like the Night periodic summon DMG multiplier", () => {
    // baseAtk 800 + flatAtk 1200 = 2000 ATK -> +3% per 100 ATK -> +60% DMG (1.6x multiplier)
    const r1 = resolveDurin(durin, ctxFor("durin", { stats: { ...baseStats, atk: 2000 }, inputs: { "a4-primordial-fusion": 1 } }));
    expect(r1.perHit["white-flame-dmg"]?.baseDmgMultiplier).toBeCloseTo(1.6, 2);

    // 2500 ATK -> +3% per 100 ATK -> +75% DMG (1.75x multiplier)
    const r2 = resolveDurin(durin, ctxFor("durin", { stats: { ...baseStats, atk: 2500 }, inputs: { "a4-primordial-fusion": 1 } }));
    expect(r2.perHit["white-flame-dmg"]?.baseDmgMultiplier).toBeCloseTo(1.75, 2);

    // 3000 ATK -> +3% per 100 ATK -> capped at +75% DMG (1.75x multiplier)
    const r3 = resolveDurin(durin, ctxFor("durin", { stats: { ...baseStats, atk: 3000 }, inputs: { "a4-primordial-fusion": 1 } }));
    expect(r3.perHit["white-flame-dmg"]?.baseDmgMultiplier).toBeCloseTo(1.75, 2);
  });

  it("C1: Adamah's Redemption flat DMG bonus", () => {
    const r = resolveDurin(durin, ctxFor("durin", { stats: { ...baseStats, atk: 2000 }, inputs: { "c1-cycle-of-enlightenment": 1 } }));
    // 60% of ATK = 1200 flat DMG bonus on all hits
    expect(r.perHit["1-hit"]?.flatDmgBonus).toBeCloseTo(1200, 1);
    expect(r.perHit["white-flame-dmg"]?.flatDmgBonus).toBeCloseTo(1200, 1);
  });

  it("C2: Unground Visions Pyro DMG bonus", () => {
    const r = resolveDurin(durin, ctxFor("durin", { constellationLevel: 2, inputs: { "c2-pyro-dmg-bonus": 1 } }));
    expect(r.statDeltas.dmgBonus).toBe(50);
  });

  it("C4: Emanare's Source Burst DMG bonus", () => {
    const r = resolveDurin(durin, ctxFor("durin", { constellationLevel: 4 }));
    expect(r.perHit["purity-burst-1"]?.bonusDmgPct).toBe(40);
    expect(r.perHit["white-flame-dmg"]?.bonusDmgPct).toBe(40);
    expect(r.perHit["1-hit"]?.bonusDmgPct).toBeUndefined(); // only burst hits
  });

  it("C6: Dual Birth DEF ignore & DEF reduction", () => {
    // C6 active: Burst hits ignore 30% DEF, Dark Decay ignores 70% DEF, DEF shred active
    const r = resolveDurin(durin, ctxFor("durin", { constellationLevel: 6, inputs: { "c6-def-shred": 1 } }));
    expect(r.perHit["purity-burst-1"]?.defIgnorePct).toBe(30);
    expect(r.perHit["white-flame-dmg"]?.defIgnorePct).toBe(30);
    expect(r.perHit["dark-decay-dmg"]?.defIgnorePct).toBe(70);
    expect(r.statDeltas.defReduction).toBe(30);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "durin"));
    expect(rows.length).toBe(300); // 20 hits * 15 levels = 300 rows
  });
});
