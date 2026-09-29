import { describe, it, expect } from "vitest";
import { resolveAino } from "./aino";
import { aino } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { ainoSeed } from "../../../data/talents/aino";
import { flattenSeed } from "../../../data/talents";

describe("aino mechanics", () => {
  it("A4 Structured Power Booster: +50% EM flat DMG to Burst water ball hits", () => {
    // 600 EM -> 300 flat DMG bonus
    const r600 = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 600 },
        constellationLevel: 0,
        inputs: { "c1-ash-field-em": 0 },
      })
    );
    expect(r600.perHit["water-ball"]?.flatDmgBonus).toBe(300);
    expect(r600.perHit["water-ball-enhanced"]?.flatDmgBonus).toBe(300);
    expect(r600.notes.some((n) => n.includes("A4 Structured Power Booster: +300 flat DMG"))).toBe(true);

    // 400 EM -> 200 flat DMG bonus
    const r400 = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 400 },
        constellationLevel: 0,
        inputs: { "c1-ash-field-em": 0 },
      })
    );
    expect(r400.perHit["water-ball"]?.flatDmgBonus).toBe(200);
    expect(r400.perHit["water-ball-enhanced"]?.flatDmgBonus).toBe(200);
  });

  it("C1 Theory of Ash—Field Equilibrium: +80 EM granted and feeds into A4 scaling", () => {
    // At C0, no C1 bonus
    const rC0 = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 600 },
        constellationLevel: 0,
        inputs: { "c1-ash-field-em": 1 },
      })
    );
    expect(rC0.statDeltas.em).toBeUndefined();
    expect(rC0.perHit["water-ball"]?.flatDmgBonus).toBe(300);

    // At C1 with toggle ON -> +80 EM, effective EM = 680 -> A4 flat DMG = 340
    const rC1 = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 600 },
        constellationLevel: 1,
        inputs: { "c1-ash-field-em": 1 },
      })
    );
    expect(rC1.statDeltas.em).toBe(80);
    expect(rC1.perHit["water-ball"]?.flatDmgBonus).toBe(340);
    expect(rC1.notes.some((n) => n.includes("C1 Theory of Ash—Field Equilibrium: +80 EM"))).toBe(true);

    // At C1 with toggle OFF -> no C1 bonus
    const rC1Off = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 600 },
        constellationLevel: 1,
        inputs: { "c1-ash-field-em": 0 },
      })
    );
    expect(rC1Off.statDeltas.em).toBeUndefined();
    expect(rC1Off.perHit["water-ball"]?.flatDmgBonus).toBe(300);
  });

  it("C2 Principle of Transference in Gear Differentials: 25% ATK + 100% EM flat DMG", () => {
    // C0 or C1 -> hit disabled (baseDmgMultiplier: 0)
    const rC1 = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 500 },
        constellationLevel: 1,
        inputs: { "off-field-state": 1 },
      })
    );
    expect(rC1.perHit["c2-water-ball"]?.baseDmgMultiplier).toBe(0);

    // C2 with off-field OFF -> hit disabled
    const rC2Off = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 500 },
        constellationLevel: 2,
        inputs: { "off-field-state": 0 },
      })
    );
    expect(rC2Off.perHit["c2-water-ball"]?.baseDmgMultiplier).toBe(0);

    // C2 with off-field ON -> enabled with 100% EM flat DMG bonus (500 + 80 from C1 = 580)
    const rC2On = resolveAino(
      aino,
      ctxFor("aino", {
        stats: { ...baseStats, em: 500 },
        constellationLevel: 2,
        inputs: { "off-field-state": 1, "c1-ash-field-em": 1 },
      })
    );
    expect(rC2On.perHit["c2-water-ball"]?.baseDmgMultiplier).toBe(1.0);
    expect(rC2On.perHit["c2-water-ball"]?.flatDmgBonus).toBe(580);
    expect(rC2On.notes.some((n) => n.includes("C2 Principle of Transference: Enabled"))).toBe(true);
  });

  it("C6 The Burden of Creative Genius: Reaction DMG amplification (+15% standard, +35% with Ascendant Gleam)", () => {
    // Below C6 -> no reaction bonuses
    const rC5 = resolveAino(
      aino,
      ctxFor("aino", {
        constellationLevel: 5,
        inputs: { "c6-creative-genius": 1, "moonsign-ascendant-gleam": 1 },
      })
    );
    expect(rC5.statDeltas.electroChargedDmgBonus).toBeUndefined();
    expect(rC5.statDeltas.bloomDmgBonus).toBeUndefined();
    expect(rC5.statDeltas.lunarChargedDmgBonus).toBeUndefined();

    // C6 standard (Ascendant Gleam = 0) -> +15%
    const rC6Std = resolveAino(
      aino,
      ctxFor("aino", {
        constellationLevel: 6,
        inputs: { "c6-creative-genius": 1, "moonsign-ascendant-gleam": 0 },
      })
    );
    expect(rC6Std.statDeltas.electroChargedDmgBonus).toBe(15);
    expect(rC6Std.statDeltas.bloomDmgBonus).toBe(15);
    expect(rC6Std.statDeltas.lunarChargedDmgBonus).toBe(15);
    expect(rC6Std.statDeltas.lunarBloomDmgBonus).toBe(15);
    expect(rC6Std.statDeltas.lunarCrystallizeDmgBonus).toBe(15);
    expect(rC6Std.notes.some((n) => n.includes("+15% Reaction DMG"))).toBe(true);

    // C6 enhanced (Ascendant Gleam = 1) -> +35%
    const rC6Enh = resolveAino(
      aino,
      ctxFor("aino", {
        constellationLevel: 6,
        inputs: { "c6-creative-genius": 1, "moonsign-ascendant-gleam": 1 },
      })
    );
    expect(rC6Enh.statDeltas.electroChargedDmgBonus).toBe(35);
    expect(rC6Enh.statDeltas.bloomDmgBonus).toBe(35);
    expect(rC6Enh.statDeltas.lunarChargedDmgBonus).toBe(35);
    expect(rC6Enh.statDeltas.lunarBloomDmgBonus).toBe(35);
    expect(rC6Enh.statDeltas.lunarCrystallizeDmgBonus).toBe(35);
    expect(rC6Enh.notes.some((n) => n.includes("+35% Reaction DMG"))).toBe(true);
  });

  it("Normal Attack hits are tagged with element Physical", () => {
    const r = resolveAino(aino, ctxFor("aino", {}));
    expect(r.perHit["1-hit"]?.element).toBe("Physical");
    expect(r.perHit["2-hit"]?.element).toBe("Physical");
    expect(r.perHit["3-hit-a"]?.element).toBe("Physical");
    expect(r.perHit["3-hit-b"]?.element).toBe("Physical");
    expect(r.perHit["charged-loop"]?.element).toBe("Physical");
    expect(r.perHit["charged-final"]?.element).toBe("Physical");
    expect(r.perHit["plunge"]?.element).toBe("Physical");
    expect(r.perHit["low-plunge"]?.element).toBe("Physical");
    expect(r.perHit["high-plunge"]?.element).toBe("Physical");
  });

  it("Support block computes C1 EM and C6 reaction buffs correctly", () => {
    const s = aino.support;
    expect(s).toBeDefined();

    const emBuff = s?.buffs.find((b) => b.stat === "em");
    expect(emBuff).toBeDefined();
    expect(emBuff?.compute({ constellationLevel: 0, inputs: { "c1-ash-field-em": 1 } } as any)).toBe(0);
    expect(emBuff?.compute({ constellationLevel: 1, inputs: { "c1-ash-field-em": 1 } } as any)).toBe(80);
    expect(emBuff?.compute({ constellationLevel: 1, inputs: { "c1-ash-field-em": 0 } } as any)).toBe(0);

    const ecBuff = s?.buffs.find((b) => b.stat === "electroChargedDmgBonus");
    expect(ecBuff).toBeDefined();
    expect(ecBuff?.compute({ constellationLevel: 5, inputs: {} } as any)).toBe(0);
    expect(
      ecBuff?.compute({
        constellationLevel: 6,
        inputs: { "c6-creative-genius": 1, "moonsign-ascendant-gleam": 0 },
      } as any)
    ).toBe(15);
    expect(
      ecBuff?.compute({
        constellationLevel: 6,
        inputs: { "c6-creative-genius": 1, "moonsign-ascendant-gleam": 1 },
      } as any)
    ).toBe(35);

    const brief = s?.formatBriefStats?.({
      atk: 1450,
      em: 620,
      critRate: 55,
      critDmg: 110,
      inputs: { energyRecharge: 185 },
    } as any);
    expect(brief).toEqual([
      { label: "EM", value: "620" },
      { label: "Total ATK", value: "1,450" },
      { label: "CRIT", value: "55% / 110%" },
      { label: "ER", value: "185%" },
    ]);
  });

  it("ainoSeed contains exactly 14 hits × 14 levels = 196 rows", () => {
    expect(ainoSeed.hits.length).toBe(14);
    for (const h of ainoSeed.hits) {
      expect(h.values.length, `hit ${h.hitKey} does not have 14 levels`).toBe(14);
    }
    const rows = flattenSeed([ainoSeed]);
    expect(rows.length).toBe(196);
  });
});
