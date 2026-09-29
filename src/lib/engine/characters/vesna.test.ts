import { describe, it, expect } from "vitest";
import { resolveVesna } from "./vesna";
import { vesna } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { vesnaSeed } from "../../../data/talents/vesna";
import { flattenSeed } from "../../../data/talents";

describe("vesna mechanics", () => {
  it("A1 Disciplinary Action: +10% Base DMG Multiplier to Spirit Blades per stack (max 6)", () => {
    // 0 stacks -> 1.0 baseDmgMultiplier
    const r0 = resolveVesna(vesna, ctxFor("vesna", { inputs: { "armed-for-action": 1, "disciplinary-action-stacks": 0, "radiance-stellar-swirl": 0 } }));
    expect(r0.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBe(1.0);
    expect(r0.perHit["windborne-3-blades"]?.baseDmgMultiplier).toBe(1.0);
    expect(r0.perHit["burst-spirit-blade"]?.baseDmgMultiplier).toBe(1.0);

    // 4 stacks -> 1.4 baseDmgMultiplier
    const r4 = resolveVesna(vesna, ctxFor("vesna", { inputs: { "armed-for-action": 1, "disciplinary-action-stacks": 4, "radiance-stellar-swirl": 0 } }));
    expect(r4.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBeCloseTo(1.4);
    expect(r4.notes.some(n => n.includes("A1 Rite of Spring's Procession: +40% Base DMG Multiplier"))).toBe(true);

    // 6 stacks -> 1.6 baseDmgMultiplier
    const r6 = resolveVesna(vesna, ctxFor("vesna", { inputs: { "armed-for-action": 1, "disciplinary-action-stacks": 6, "radiance-stellar-swirl": 0 } }));
    expect(r6.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBeCloseTo(1.6);
    expect(r6.notes.some(n => n.includes("A1 Rite of Spring's Procession: +60% Base DMG Multiplier"))).toBe(true);

    // Input above 6 is clamped to 6
    const rClamp = resolveVesna(vesna, ctxFor("vesna", { inputs: { "armed-for-action": 1, "disciplinary-action-stacks": 10, "radiance-stellar-swirl": 0 } }));
    expect(rClamp.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBeCloseTo(1.6);
  });

  it("Stellar Jubilee: Splendid Prelude: +0.7% Base Stellar Swirl DMG per 100 ATK (cap 14% at 2000 ATK)", () => {
    // 1000 ATK -> 7%
    const r1000 = resolveVesna(vesna, ctxFor("vesna", { stats: { ...baseStats, atk: 1000 }, inputs: { "radiance-stellar-swirl": 1 } }));
    expect(r1000.perHit["spirit-blade-2-stellar"]?.directReaction?.baseDmgBonusPct).toBeCloseTo(7.0);

    // 2000 ATK -> 14%
    const r2000 = resolveVesna(vesna, ctxFor("vesna", { stats: { ...baseStats, atk: 2000 }, inputs: { "radiance-stellar-swirl": 1 } }));
    expect(r2000.perHit["spirit-blade-2-stellar"]?.directReaction?.baseDmgBonusPct).toBe(14.0);

    // 2500 ATK -> capped at 14%
    const r2500 = resolveVesna(vesna, ctxFor("vesna", { stats: { ...baseStats, atk: 2500 }, inputs: { "radiance-stellar-swirl": 1 } }));
    expect(r2500.perHit["spirit-blade-2-stellar"]?.directReaction?.baseDmgBonusPct).toBe(14.0);
    expect(r2500.notes.some(n => n.includes("Splendid Prelude: +14.0% Base Stellar Swirl DMG"))).toBe(true);
  });

  it("A4 Truth Prevails: ATK% and EM based on party elements (C0 vs C4 3×)", () => {
    // Inactive Radiance -> no bonuses
    const rOff = resolveVesna(vesna, ctxFor("vesna", {
      inputs: { "radiance-stellar-swirl": 0, "party-anemo-cryo-count": 2, "party-other-element-count": 1 },
    }));
    expect(rOff.statDeltas.atkPercent).toBeUndefined();
    expect(rOff.statDeltas.em).toBeUndefined();

    // C0: 2 Anemo/Cryo (+12% ATK) and 1 other element (+25 EM)
    const rC0 = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 0,
      inputs: { "radiance-stellar-swirl": 1, "party-anemo-cryo-count": 2, "party-other-element-count": 1 },
    }));
    expect(rC0.statDeltas.atkPercent).toBe(12);
    expect(rC0.statDeltas.em).toBe(25);
    expect(rC0.notes.some(n => n.includes("A4 Truth Prevails: +12% ATK (2 Anemo/Cryo teammates)"))).toBe(true);
    expect(rC0.notes.some(n => n.includes("A4 Truth Prevails: +25 EM (1 other-element teammate)"))).toBe(true);

    // C4: 3× boost -> 2 Anemo/Cryo (+36% ATK) and 1 other element (+75 EM)
    const rC4 = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 4,
      inputs: { "radiance-stellar-swirl": 1, "party-anemo-cryo-count": 2, "party-other-element-count": 1 },
    }));
    expect(rC4.statDeltas.atkPercent).toBe(36);
    expect(rC4.statDeltas.em).toBe(75);
    expect(rC4.notes.some(n => n.includes("A4 Truth Prevails (C4 3×): +36% ATK"))).toBe(true);
    expect(rC4.notes.some(n => n.includes("A4 Truth Prevails (C4 3×): +75 EM"))).toBe(true);
  });

  it("C1 Winter's Farewell Feast: +20% Stellar Swirl reaction DMG in Armed for Action", () => {
    // Armed active at C1
    const rC1Armed = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 1,
      inputs: { "armed-for-action": 1 },
    }));
    expect(rC1Armed.statDeltas.stellarSwirlDmgBonus).toBe(20);

    // Armed inactive at C1 -> no C1 bonus
    const rC1Unarmed = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 1,
      inputs: { "armed-for-action": 0 },
    }));
    expect(rC1Unarmed.statDeltas.stellarSwirlDmgBonus).toBeUndefined();

    // C0 armed -> no C1 bonus
    const rC0 = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 0,
      inputs: { "armed-for-action": 1 },
    }));
    expect(rC0.statDeltas.stellarSwirlDmgBonus).toBeUndefined();
  });

  it("C2 Kolo of Spring's Arrival: auto max Disciplinary Action stacks and +60% ATK", () => {
    // At C2 with Armed for Action, stacks automatically count as 6 and grant +60% ATK
    const rC2 = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 2,
      inputs: { "armed-for-action": 1, "disciplinary-action-stacks": 0 },
    }));
    expect(rC2.statDeltas.atkPercent).toBe(60);
    expect(rC2.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBeCloseTo(1.6);
    expect(rC2.notes.some(n => n.includes("C2 Kolo of Spring's Arrival: +60% ATK"))).toBe(true);
  });

  it("C6 Unwavering Ardor: unlocks Transpose hits and grants +20% Stellar Swirl DMG", () => {
    // At C5, Transpose hits are gated out (baseDmgMultiplier: 0)
    const rC5 = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 5,
      inputs: { "armed-for-action": 1, "radiance-stellar-swirl": 1 },
    }));
    expect(rC5.perHit["c6-transpose"]?.baseDmgMultiplier).toBe(0);
    expect(rC5.perHit["c6-transpose-blade"]?.baseDmgMultiplier).toBe(0);
    expect(rC5.perHit["c6-transpose-blade-stellar"]?.baseDmgMultiplier).toBe(0);

    // At C6, Transpose hits are enabled and +20% Stellar Swirl reaction DMG is granted
    const rC6 = resolveVesna(vesna, ctxFor("vesna", {
      constellationLevel: 6,
      inputs: { "armed-for-action": 1, "radiance-stellar-swirl": 1, "disciplinary-action-stacks": 6 },
    }));
    // C1 + C6 = 20 + 20 = 40% Stellar Swirl reaction DMG
    expect(rC6.statDeltas.stellarSwirlDmgBonus).toBe(40);
    expect(rC6.perHit["c6-transpose"]?.baseDmgMultiplier ?? 1).toBe(1.0);
    expect(rC6.perHit["c6-transpose-blade-stellar"]?.directReaction).toBeDefined();
    expect(rC6.perHit["c6-transpose-blade-stellar"]?.baseDmgMultiplier).toBeCloseTo(1.6); // from A1 stacks
  });

  it("Radiance state hit gating: correctly switches between standard Anemo and direct Stellar Swirl hits", () => {
    // Radiance ON
    const rOn = resolveVesna(vesna, ctxFor("vesna", {
      inputs: { "armed-for-action": 1, "radiance-stellar-swirl": 1 },
    }));
    expect(rOn.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBe(0);
    expect(rOn.perHit["burst-spirit-blade"]?.baseDmgMultiplier).toBe(0);
    expect(rOn.perHit["spirit-blade-2-stellar"]?.directReaction).toBeDefined();
    expect(rOn.perHit["burst-spirit-blade-stellar"]?.directReaction).toBeDefined();

    // Radiance OFF
    const rOff = resolveVesna(vesna, ctxFor("vesna", {
      inputs: { "armed-for-action": 1, "radiance-stellar-swirl": 0 },
    }));
    expect(rOff.perHit["spirit-blade-2-stellar"]?.baseDmgMultiplier).toBe(0);
    expect(rOff.perHit["burst-spirit-blade-stellar"]?.baseDmgMultiplier).toBe(0);
    expect(rOff.perHit["spirit-blade-2"]?.baseDmgMultiplier).toBeGreaterThan(0);
    expect(rOff.perHit["burst-spirit-blade"]?.baseDmgMultiplier).toBeGreaterThan(0);
  });

  it("Armed for Action: normal attack infusion and ability gating", () => {
    // Armed ON -> Anemo infusion
    const rArmed = resolveVesna(vesna, ctxFor("vesna", { inputs: { "armed-for-action": 1 } }));
    expect(rArmed.perHit["1-hit"]?.element).toBe("Anemo");
    expect(rArmed.perHit["charged"]?.element).toBe("Anemo");
    expect(rArmed.perHit["high-plunge"]?.element).toBe("Anemo");
    expect(rArmed.perHit["windborne-1"]?.baseDmgMultiplier ?? 1).toBeGreaterThan(0);

    // Armed OFF -> Wind Pinion and Windborne Sword hits are disabled
    const rUnarmed = resolveVesna(vesna, ctxFor("vesna", { inputs: { "armed-for-action": 0 } }));
    expect(rUnarmed.perHit["1-hit"]?.element).toBeUndefined();
    expect(rUnarmed.perHit["wind-pinion"]?.baseDmgMultiplier).toBe(0);
    expect(rUnarmed.perHit["windborne-1"]?.baseDmgMultiplier).toBe(0);
    expect(rUnarmed.perHit["windborne-2"]?.baseDmgMultiplier).toBe(0);
    expect(rUnarmed.perHit["windborne-3-final"]?.baseDmgMultiplier).toBe(0);
  });

  it("vesna support definition: calculates party Base Stellar Swirl DMG", () => {
    const sBlock = vesna.support;
    expect(sBlock).toBeDefined();
    const buff = sBlock?.buffs.find(b => b.label.includes("Vesna Splendid Prelude"));
    expect(buff).toBeDefined();

    // At 2000 ATK -> 14%
    const b2000 = buff?.compute({ atk: 2000 } as any);
    expect(b2000).toBe(14);

    // At 1000 ATK -> 7%
    const b1000 = buff?.compute({ atk: 1000 } as any);
    expect(b1000).toBe(7);
  });

  it("vesnaSeed contains exactly 25 hits × 14 levels = 350 rows", () => {
    expect(vesnaSeed.hits.length).toBe(25);
    for (const h of vesnaSeed.hits) {
      expect(h.values.length, `hit ${h.hitKey} does not have 14 levels`).toBe(14);
    }
    const rows = flattenSeed([vesnaSeed]);
    expect(rows.length).toBe(350);
  });
});
