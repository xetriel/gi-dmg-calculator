import { describe, it, expect } from "vitest";
import { resolveOdette } from "./odette";
import { odette } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { odetteSeed } from "../../../data/talents/odette";
import { flattenSeed } from "../../../data/talents";

describe("odette mechanics", () => {
  it("A1 Marvelous Splendor: +15% Stellar Glimmer DMG per stack (max 4 at C0, 6 at C1)", () => {
    const r4 = resolveOdette(odette, ctxFor("odette", { inputs: { "marvelous-splendor-stacks": 4 } }));
    expect(r4.statDeltas.stellarReactionDmgBonus).toBe(60); // 60 from A1 (burst off)
    expect(r4.notes.some(n => n.includes("A1 Marvelous Splendor: +60% Stellar Glimmer DMG (4 stacks)"))).toBe(true);

    // Clamped to 4 at C0 even if input is 6
    const rClamp = resolveOdette(odette, ctxFor("odette", { constellationLevel: 0, inputs: { "marvelous-splendor-stacks": 6 } }));
    expect(rClamp.notes.some(n => n.includes("+60% Stellar Glimmer DMG (4 stacks)"))).toBe(true);

    // Allows 6 at C1
    const rC1 = resolveOdette(odette, ctxFor("odette", { constellationLevel: 1, inputs: { "marvelous-splendor-stacks": 6 } }));
    expect(rC1.notes.some(n => n.includes("+90% Stellar Glimmer DMG (6 stacks)"))).toBe(true);
  });

  it("A4 Pathetique of Pateticheskaya: +1.5% Base DMG Multiplier per 100 ATK over 1000 (cap 30% at 3000 ATK)", () => {
    // 1000 ATK -> 0% bonus
    const r1000 = resolveOdette(odette, ctxFor("odette", { stats: { ...baseStats, atk: 1000 } }));
    expect(r1000.perHit["coda-stellar-conduct"]?.baseDmgMultiplier).toBe(1.0);

    // 2000 ATK -> +15% bonus (baseDmgMultiplier = 1.15)
    const r2000 = resolveOdette(odette, ctxFor("odette", { stats: { ...baseStats, atk: 2000 } }));
    expect(r2000.perHit["coda-stellar-conduct"]?.baseDmgMultiplier).toBeCloseTo(1.15);
    expect(r2000.notes.some(n => n.includes("A4 Pathetique of Pateticheskaya: +15.0% Base DMG Multiplier"))).toBe(true);

    // 3000 ATK -> +30% bonus (capped at 1.30)
    const r3000 = resolveOdette(odette, ctxFor("odette", { stats: { ...baseStats, atk: 3000 } }));
    expect(r3000.perHit["coda-stellar-conduct"]?.baseDmgMultiplier).toBeCloseTo(1.30);

    // 3500 ATK -> +30% bonus (capped at 1.30)
    const r3500 = resolveOdette(odette, ctxFor("odette", { stats: { ...baseStats, atk: 3500 } }));
    expect(r3500.perHit["coda-stellar-conduct"]?.baseDmgMultiplier).toBeCloseTo(1.30);
  });

  it("Dance of Aurore: Base Stellar Reaction DMG +0.7% per 100 ATK (cap 14% at 2000 ATK)", () => {
    const r1 = resolveOdette(odette, ctxFor("odette", { stats: { ...baseStats, atk: 1000 } }));
    expect(r1.perHit["coda-stellar-conduct"]?.directReaction?.baseDmgBonusPct).toBeCloseTo(7.0);

    const r2 = resolveOdette(odette, ctxFor("odette", { stats: { ...baseStats, atk: 2500 } }));
    expect(r2.perHit["coda-stellar-conduct"]?.directReaction?.baseDmgBonusPct).toBe(14.0);
  });

  it("Snow Swan's Dream (Burst): +14% to +62% Stellar Glimmer Reaction DMG", () => {
    // Default Burst Lv10 -> +50%
    const rLv10 = resolveOdette(odette, ctxFor("odette", { inputs: { "snow-swans-dream": 1, "marvelous-splendor-stacks": 0 } }));
    expect(rLv10.statDeltas.stellarReactionDmgBonus).toBe(50);

    // Burst Lv13 with C5 -> +62%
    const rLv13 = resolveOdette(odette, ctxFor("odette", { constellationLevel: 5, inputs: { "snow-swans-dream": 1, "marvelous-splendor-stacks": 0 } }));
    expect(rLv13.statDeltas.stellarReactionDmgBonus).toBe(62);

    // Toggle off -> 0
    const rOff = resolveOdette(odette, ctxFor("odette", { inputs: { "snow-swans-dream": 0, "marvelous-splendor-stacks": 0 } }));
    expect(rOff.statDeltas.stellarReactionDmgBonus ?? 0).toBe(0);
  });

  it("Polestar Field & Priority Rule", () => {
    // Polestar Field off -> neutral
    const off = resolveOdette(odette, ctxFor("odette", { inputs: { "polestar-field": 0, "radiance-stellar-swirl": 0 } }));
    expect(off.perHit["coda-stellar-conduct"]?.directReaction?.coefficient).toBe(1.0);
    expect(off.statDeltas.dmgBonus ?? 0).toBe(0);

    // Polestar Field 0 hits
    const zero = resolveOdette(odette, ctxFor("odette", { inputs: { "polestar-field": 1, "polestar-hits": 0 } }));
    expect(zero.perHit["coda-stellar-conduct"]?.directReaction?.coefficient).toBe(1.0);
    expect(zero.statDeltas.dmgBonus).toBe(20);
    expect(zero.statDeltas.enemyPhysicalRes).toBe(-40);

    // Polestar Field 6 hits
    const six = resolveOdette(odette, ctxFor("odette", { inputs: { "polestar-field": 1, "polestar-hits": 6 } }));
    expect(six.perHit["coda-stellar-conduct"]?.directReaction?.coefficient).toBeCloseTo(1.70);
    expect(six.statDeltas.dmgBonus).toBe(34);
    expect(six.statDeltas.enemyPhysicalRes).toBe(-40);

    // Polestar Field 12 hits
    const twelve = resolveOdette(odette, ctxFor("odette", { inputs: { "polestar-field": 1, "polestar-hits": 12 } }));
    expect(twelve.perHit["coda-stellar-conduct"]?.directReaction?.coefficient).toBeCloseTo(2.00);
    expect(twelve.statDeltas.dmgBonus).toBe(40);
    expect(twelve.statDeltas.enemyPhysicalRes).toBe(-40);

    // Priority rule: Polestar Field takes priority over Radiance: Stellar Swirl
    const both = resolveOdette(odette, ctxFor("odette", { inputs: { "polestar-field": 1, "polestar-hits": 4, "radiance-stellar-swirl": 1 } }));
    expect(both.notes.some(n => n.includes("Radiance: Stellar-Conduct active"))).toBe(true);

    // Swirl only
    const swirlOnly = resolveOdette(odette, ctxFor("odette", { inputs: { "polestar-field": 0, "radiance-stellar-swirl": 1 } }));
    expect(swirlOnly.notes.some(n => n.includes("Radiance: Stellar Swirl active"))).toBe(true);
    expect(swirlOnly.statDeltas.dmgBonus ?? 0).toBe(0);
  });

  it("Constellation Hit Gating (C1 and C4 hits disabled below required level)", () => {
    // At C0: C1 and C4 hits are disabled (baseDmgMultiplier: 0)
    const c0 = resolveOdette(odette, ctxFor("odette", { constellationLevel: 0 }));
    expect(c0.perHit["c1-stellar-conduct"]?.baseDmgMultiplier).toBe(0);
    expect(c0.perHit["c1-stellar-swirl"]?.baseDmgMultiplier).toBe(0);
    expect(c0.perHit["c4-coord-stellar-conduct"]?.baseDmgMultiplier).toBe(0);
    expect(c0.perHit["c4-coord-stellar-swirl"]?.baseDmgMultiplier).toBe(0);

    // At C1: C1 hits are enabled
    const c1 = resolveOdette(odette, ctxFor("odette", { constellationLevel: 1, stats: { ...baseStats, atk: 1000 } }));
    expect(c1.perHit["c1-stellar-conduct"]?.baseDmgMultiplier).toBe(1.0);
    expect(c1.perHit["c1-stellar-swirl"]?.baseDmgMultiplier).toBe(1.0);
    expect(c1.perHit["c4-coord-stellar-conduct"]?.baseDmgMultiplier).toBe(0);

    // At C4: C4 hits are enabled
    const c4 = resolveOdette(odette, ctxFor("odette", { constellationLevel: 4, stats: { ...baseStats, atk: 1000 } }));
    expect(c4.perHit["c4-coord-stellar-conduct"]?.baseDmgMultiplier).toBe(1.0);
    expect(c4.perHit["c4-coord-stellar-swirl"]?.baseDmgMultiplier).toBe(1.0);
  });

  it("C2: ATK% per stack and -20% RES shred in Radiance", () => {
    // 4 stacks at C2 -> +28% ATK
    const c2 = resolveOdette(odette, ctxFor("odette", {
      constellationLevel: 2,
      inputs: { "marvelous-splendor-stacks": 4, "polestar-field": 1, "solo-dance-double": 1 },
    }));
    expect(c2.statDeltas.atkPercent).toBe(28);
    expect(c2.statDeltas.enemyCryoRes).toBe(-20);
    expect(c2.statDeltas.enemyElectroRes).toBe(-20);

    // Swirl state -> -20% Cryo & Anemo
    const c2Swirl = resolveOdette(odette, ctxFor("odette", {
      constellationLevel: 2,
      inputs: { "marvelous-splendor-stacks": 4, "polestar-field": 0, "radiance-stellar-swirl": 1, "solo-dance-double": 1 },
    }));
    expect(c2Swirl.statDeltas.enemyCryoRes).toBe(-20);
    expect(c2Swirl.statDeltas.enemyAnemoRes).toBe(-20);
    expect(c2Swirl.statDeltas.enemyElectroRes ?? 0).toBe(0);
  });

  it("C6: +45% Elevation to Stellar Glimmer reaction DMG", () => {
    const c6 = resolveOdette(odette, ctxFor("odette", { constellationLevel: 6, inputs: { "marvelous-splendor-stacks": 4 } }));
    expect(c6.statDeltas.stellarReactionSpecialDmgBonus).toBe(45);
    expect(c6.notes.some(n => n.includes("C6 Divine Elevation: +45% Elevation"))).toBe(true);
  });

  it("Solo Dance Double toggle disables Plume and Wing hits when off", () => {
    const off = resolveOdette(odette, ctxFor("odette", { inputs: { "solo-dance-double": 0 } }));
    expect(off.perHit["plume-dance"]?.baseDmgMultiplier).toBe(0);
    expect(off.perHit["plume-stellar-conduct"]?.baseDmgMultiplier).toBe(0);
    expect(off.perHit["wing-dance"]?.baseDmgMultiplier).toBe(0);
    expect(off.perHit["wing-stellar-conduct"]?.baseDmgMultiplier).toBe(0);
  });

  it("Support block computes buffs, scaling, and formatBriefStats properly", () => {
    const sBlock = odette.support;
    expect(sBlock).toBeDefined();

    // 1. Polestar field DMG bonus
    const dmgBuff = sBlock?.buffs.find(b => b.stat === "dmgBonus");
    expect(dmgBuff?.compute({ inputs: { "polestar-field": 1, "polestar-hits": 6 }, constellationLevel: 0, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(34);

    // 2. Phys RES shred
    const physBuff = sBlock?.buffs.find(b => b.stat === "enemyPhysicalRes");
    expect(physBuff?.compute({ inputs: { "polestar-field": 1 }, constellationLevel: 0, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(-40);

    // 3. A1 Marvelous Splendor (+15% per stack)
    const a1Buff = sBlock?.buffs.find(b => b.label.includes("Odette Marvelous Splendor"));
    expect(a1Buff?.compute({ inputs: { "marvelous-splendor-stacks": 4 }, constellationLevel: 0, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(60);

    // 4. C2 ATK% (+7% per stack)
    const c2AtkBuff = sBlock?.buffs.find(b => b.stat === "atkPercent");
    expect(c2AtkBuff?.compute({ inputs: { "marvelous-splendor-stacks": 4 }, constellationLevel: 0, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(0);
    expect(c2AtkBuff?.compute({ inputs: { "marvelous-splendor-stacks": 4 }, constellationLevel: 2, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(28);

    // 5. C4 Snow Swan's Dream Share (50% of burst)
    const c4ShareBuff = sBlock?.buffs.find(b => b.label.includes("Odette C4 Snow Swan's Dream Share"));
    expect(c4ShareBuff?.compute({ inputs: { "snow-swans-dream": 1 }, constellationLevel: 4, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: { burst: 10 } })).toBe(25);

    // 6. C6 Elevation (25% to party)
    const c6ElevBuff = sBlock?.buffs.find(b => b.stat === "stellarReactionSpecialDmgBonus");
    expect(c6ElevBuff?.compute({ inputs: { "marvelous-splendor-stacks": 4 }, constellationLevel: 6, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(25);

    // 7. stellarBaseBonusCompute (+0.7%/100 ATK, cap 14%)
    expect(sBlock?.stellarBaseBonusCompute?.({ inputs: {}, constellationLevel: 0, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} })).toBe(14);

    // 8. formatBriefStats
    const pills = sBlock?.formatBriefStats?.({ inputs: {}, constellationLevel: 0, atk: 2450.5, hp: 0, def: 0, em: 0, critRate: 65.2, critDmg: 150.4, energyRecharge: 100, healingBonus: 0, baseAtk: 800, baseHp: 0, baseDef: 0, talentLevels: {} });
    expect(pills).toEqual([
      { label: "Total ATK", value: "2,450.5" },
      { label: "CRIT", value: "65.2% / 150.4%" },
    ]);
  });

  it("odetteSeed contains exactly 27 hits × 14 levels = 378 rows", () => {
    expect(odetteSeed.hits.length).toBe(27);
    for (const h of odetteSeed.hits) {
      expect(h.values.length).toBe(14);
    }
    const rows = flattenSeed([odetteSeed]);
    expect(rows.length).toBe(378);
  });
});
