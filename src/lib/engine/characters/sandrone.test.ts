import { describe, it, expect } from "vitest";
import { resolveSandrone } from "./sandrone";
import { sandrone } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { computeHit, applyStatDeltas } from "../damage";
import { resolveStats } from "../validation";

describe("sandrone mechanics", () => {
  it("Light of Rationalisme: 0.7% per 100 ATK, capped at 14%", () => {
    const r1 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 1000 } }));
    expect(r1.perHit["prism-shot-stellar"]?.directReaction?.baseDmgBonusPct).toBeCloseTo(7);
    const r2 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 2500 } }));
    expect(r2.perHit["prism-shot-stellar"]?.directReaction?.baseDmgBonusPct).toBe(14);
  });
  it("Polestar field: BRC + Cryo DMG bonus by hit count; off → neutral", () => {
    const off = resolveSandrone(sandrone, ctxFor("sandrone"));
    expect(off.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBe(1);
    expect(off.statDeltas.dmgBonus ?? 0).toBe(0);
    const zero = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "polestar-field": 1, "polestar-hits": 0 } }));
    expect(zero.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBe(1);
    expect(zero.statDeltas.dmgBonus).toBe(20);
    expect(zero.statDeltas.enemyPhysicalRes).toBe(-40);
    const ten = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "polestar-field": 1, "polestar-hits": 10 } }));
    expect(ten.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBeCloseTo(1.9);
    expect(ten.statDeltas.dmgBonus).toBe(38);
    expect(ten.statDeltas.enemyPhysicalRes).toBe(-40);
    const twelve = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "polestar-field": 1, "polestar-hits": 12 } }));
    expect(twelve.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBeCloseTo(2.0);
    expect(twelve.statDeltas.dmgBonus).toBe(40);
    expect(twelve.statDeltas.enemyPhysicalRes).toBe(-40);
  });
  it("C1 adds +30% stellar reaction bonus", () => {
    const r = resolveSandrone(sandrone, ctxFor("sandrone", { constellationLevel: 1 }));
    expect(r.perHit["prism-shot-stellar"]?.directReaction?.reactionBonusPct).toBe(30);
  });
  it("A1 skills and C2 stack buffers", () => {
    const r = resolveSandrone(sandrone, ctxFor("sandrone", { inputs: { "decoding-over-50": 1, "refined-tactics": 10 } }));
    expect(r.perHit["prism-shot-stellar"]?.baseDmgMultiplier).toBe(4);
    expect(r.perHit["convective-ray-stellar"]?.baseDmgMultiplier).toBe(2);
  });
  it("C2 Beam stacks add CRIT DMG", () => {
    const r = resolveSandrone(sandrone, ctxFor("sandrone", { constellationLevel: 2, inputs: { "c2-beam-stacks": 3 } }));
    expect(r.perHit["condensed-beam-stellar"]?.critDmgBonusPct).toBe(100); // 40 + 20*3
  });
  it("Normal Attack 1-3 hits are Physical DMG and normal category", () => {
    const normalGroup = sandrone.talents.find(g => g.type === "normal");
    const h1 = normalGroup?.hits.find(h => h.key === "1-hit");
    const h2 = normalGroup?.hits.find(h => h.key === "2-hit");
    const h3 = normalGroup?.hits.find(h => h.key === "3-hit");
    expect(h1?.element).toBe("Physical");
    expect(h1?.hitCategory).toBe("normal");
    expect(h2?.element).toBe("Physical");
    expect(h2?.hitCategory).toBe("normal");
    expect(h3?.element).toBe("Physical");
    expect(h3?.hitCategory).toBe("normal");
  });
  it("Support block provides stellarConductMultiplier and C1 provides stellarConductDmgBonus & stellarSwirlDmgBonus", () => {
    const sBlock = sandrone.support;
    expect(sBlock).toBeDefined();
    const polestarBuff = sBlock?.buffs.find(b => b.stat === "stellarConductMultiplier");
    expect(polestarBuff).toBeDefined();
    expect(polestarBuff?.compute({ inputs: { "polestar-field": 1, "polestar-hits": 6 }, constellationLevel: 0, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0 })).toBe(70);

    const c1ConductBuff = sBlock?.buffs.find(b => b.stat === "stellarConductDmgBonus");
    expect(c1ConductBuff).toBeDefined();
    expect(c1ConductBuff?.compute({ inputs: {}, constellationLevel: 1, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0 })).toBe(30);

    const c1SwirlBuff = sBlock?.buffs.find(b => b.stat === "stellarSwirlDmgBonus");
    expect(c1SwirlBuff).toBeDefined();
    expect(c1SwirlBuff?.compute({ inputs: {}, constellationLevel: 1, atk: 2000, hp: 0, def: 0, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, healingBonus: 0 })).toBe(30);
  });

  it("A4: A Lady's Code of Conduct grants +8 EM per 100 ATK (cap 160)", () => {
    const r1 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 1000 } }));
    expect(r1.statDeltas.em).toBe(80);
    expect(r1.notes.some(n => n.includes("A4 A Lady's Code of Conduct: +80 EM"))).toBe(true);

    const r2 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 2000 } }));
    expect(r2.statDeltas.em).toBe(160);

    const r3 = resolveSandrone(sandrone, ctxFor("sandrone", { stats: { ...baseStats, atk: 3000 } }));
    expect(r3.statDeltas.em).toBe(160); // capped at 160
    expect(r3.notes.some(n => n.includes("capped"))).toBe(true);
  });

  it("Radiance: Stellar Swirl routes direct hits through stellar-swirl branch with BRC 1.0", () => {
    const swirl = resolveSandrone(sandrone, ctxFor("sandrone", {
      inputs: { "polestar-field": 0, "radiance-stellar-swirl": 1 },
    }));
    expect(swirl.perHit["condensed-beam-stellar"]?.directReaction?.stellarType).toBe("stellar-swirl");
    expect(swirl.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBe(1.0);
    expect(swirl.perHit["prism-shot-stellar"]?.directReaction?.stellarType).toBe("stellar-swirl");
    expect(swirl.perHit["convective-ray-stellar"]?.directReaction?.stellarType).toBe("stellar-swirl");
    expect(swirl.statDeltas.dmgBonus ?? 0).toBe(0); // no Polestar field DMG bonus
    expect(swirl.notes.some(n => n.includes("Radiance: Stellar Swirl active"))).toBe(true);
  });

  it("Priority Rule: Polestar Field (Stellar-Conduct) takes priority when both are active", () => {
    const both = resolveSandrone(sandrone, ctxFor("sandrone", {
      inputs: { "polestar-field": 1, "polestar-hits": 4, "radiance-stellar-swirl": 1 },
    }));
    expect(both.perHit["condensed-beam-stellar"]?.directReaction?.stellarType).toBe("stellar-conduct");
    expect(both.perHit["condensed-beam-stellar"]?.directReaction?.coefficient).toBeCloseTo(1.6);
    expect(both.statDeltas.dmgBonus).toBe(32);
    expect(both.notes.some(n => n.includes("Polestar Field: Radiance: Stellar-Conduct active"))).toBe(true);
  });

  it("C4 and C6 scale with Stellar-Conduct vs Stellar Swirl and apply C6 elevation", () => {
    // C4 & C6 under Stellar-Conduct
    const conductC6 = resolveSandrone(sandrone, ctxFor("sandrone", {
      constellationLevel: 6,
      inputs: { "polestar-field": 1, "polestar-hits": 0 },
      stats: { ...baseStats, atk: 2000 },
    }));
    expect(conductC6.statDeltas.stellarReactionSpecialDmgBonus).toBe(20);
    expect(conductC6.notes.some(n => n.includes("C4 Extra Cannon:") && n.includes("Stellar-Conduct DMG") && n.includes("125% ATK"))).toBe(true);
    expect(conductC6.notes.some(n => n.includes("C6 Cluster Beam:") && n.includes("Stellar-Conduct DMG") && n.includes("80% ATK"))).toBe(true);
    expect(conductC6.notes.some(n => n.includes("C6: +20% Elevation DMG to all Stellar Glimmer reaction DMG"))).toBe(true);

    // C4 & C6 under Stellar Swirl
    const swirlC6 = resolveSandrone(sandrone, ctxFor("sandrone", {
      constellationLevel: 6,
      inputs: { "polestar-field": 0, "radiance-stellar-swirl": 1 },
      stats: { ...baseStats, atk: 2000 },
    }));
    expect(swirlC6.statDeltas.stellarReactionSpecialDmgBonus).toBe(20);
    expect(swirlC6.notes.some(n => n.includes("C4 Extra Cannon:") && n.includes("Stellar Swirl DMG") && n.includes("187.5% ATK"))).toBe(true);
    expect(swirlC6.notes.some(n => n.includes("C6 Cluster Beam:") && n.includes("Stellar Swirl DMG") && n.includes("120% ATK"))).toBe(true);
  });

  it("Normal Attack 1-3 hits compute valid non-NaN damage with Polestar Field active", () => {
    // Simulate CharacterCalculator workflow:
    // raw stats with enemyRes 10 and undefined enemyPhysicalRes
    const rawInputs = {
      stats: {
        "atk.base": "800",
        "atk.percent": "100",
        "atk.flat": "200",
        critRate: "60",
        critDmg: "120",
        enemyRes: "10",
        levelChar: "90",
        levelEnemy: "100",
      },
      levels: { normal: 10, skill: 10, burst: 10 },
      constellationLevel: 0,
      mechanicInputs: { "polestar-field": "1", "polestar-hits": "0" },
    };
    const s = resolveStats(rawInputs);
    expect(s.enemyPhysicalRes).toBeUndefined();

    const mech = resolveSandrone(sandrone, ctxFor("sandrone", {
      stats: s,
      inputs: { "polestar-field": 1, "polestar-hits": 0 },
    }));
    expect(mech.statDeltas.enemyPhysicalRes).toBe(-40);

    applyStatDeltas(s, mech.statDeltas);
    // Base enemyRes was 10, debuff is -40, so enemyPhysicalRes should be -30
    expect(s.enemyPhysicalRes).toBe(-30);
    expect(Number.isNaN(s.enemyPhysicalRes)).toBe(false);

    // Compute damage for 1-hit, 2-hit, 3-hit
    const normalGroup = sandrone.talents.find(g => g.type === "normal");
    const hits = ["1-hit", "2-hit", "3-hit"];
    for (const key of hits) {
      const hit = normalGroup?.hits.find(h => h.key === key);
      expect(hit).toBeDefined();
      const res = computeHit(s, {
        multiplier: 100, // 100%
        scaling: "atk",
        element: hit!.element,
        hitCategory: hit!.hitCategory,
        charElement: sandrone.element,
        dmgBonusLabel: sandrone.dmgBonusLabel,
      });

      expect(Number.isNaN(res.nonCrit)).toBe(false);
      expect(Number.isNaN(res.crit)).toBe(false);
      expect(Number.isNaN(res.avg)).toBe(false);
      expect(res.nonCrit).toBeGreaterThan(0);
      expect(res.crit).toBeGreaterThan(res.nonCrit);
      expect(res.avg).toBeGreaterThan(res.nonCrit);
    }
  });
});
