import { describe, it, expect } from "vitest";
import { resolveXinyan } from "./xinyan";
import { xinyan } from "../../../data/registry/characters/xinyan";
import { ctxFor } from "./test-helpers";
import { flattenSeed } from "../../../data/talents";
import { xinyanSeed } from "../../../data/talents/xinyan";

describe("xinyan mechanics", () => {
  it("A4 Passive: ...Now That's Rock 'N' Roll! Physical DMG bonus when shielded", () => {
    // Shield active: +15% Physical DMG Bonus
    const r1 = resolveXinyan(xinyan, ctxFor("xinyan", { inputs: { "xinyan-shield-active": 1 } }));
    expect(r1.statDeltas.physicalDmgBonus).toBe(15);

    // Shield inactive: no bonus
    const r2 = resolveXinyan(xinyan, ctxFor("xinyan", { inputs: { "xinyan-shield-active": 0 } }));
    expect(r2.statDeltas.physicalDmgBonus).toBeUndefined();
  });

  it("C2 Impromptu Opening: 100% CRIT Rate to Burst Physical DMG", () => {
    // Constellation < 2: no bonus
    const r1 = resolveXinyan(xinyan, ctxFor("xinyan", { constellationLevel: 1 }));
    expect(r1.perHit["burst-physical"]?.critRateBonusPct).toBeUndefined();

    // Constellation >= 2: +100% CRIT Rate
    const r2 = resolveXinyan(xinyan, ctxFor("xinyan", { constellationLevel: 2 }));
    expect(r2.perHit["burst-physical"]?.critRateBonusPct).toBe(100);
  });

  it("C4 Wildfire Rhythm: Physical RES shred", () => {
    // C4 on with toggle
    const r1 = resolveXinyan(xinyan, ctxFor("xinyan", { constellationLevel: 4, inputs: { "c4-phys-shred": 1 } }));
    expect(r1.statDeltas.enemyRes).toBe(-15);

    // C4 on but toggle off
    const r2 = resolveXinyan(xinyan, ctxFor("xinyan", { constellationLevel: 4, inputs: { "c4-phys-shred": 0 } }));
    expect(r2.statDeltas.enemyRes).toBeUndefined();

    // Constellation < 4
    const r3 = resolveXinyan(xinyan, ctxFor("xinyan", { constellationLevel: 3, inputs: { "c4-phys-shred": 1 } }));
    expect(r3.statDeltas.enemyRes).toBeUndefined();
  });

  it("C6 Rockin' in a Flaming World: DEF to ATK conversion on Charged Attacks", () => {
    const stats = { def: 1000, atk: 1500, hp: 15000, em: 0, critRate: 50, critDmg: 100, energyRecharge: 100, dmgBonus: 0, normalDmgBonus: 0, chargedDmgBonus: 0, plungeDmgBonus: 0, skillDmgBonus: 0, burstDmgBonus: 0, pyroDmgBonus: 0, hydroDmgBonus: 0, dendroDmgBonus: 0, electroDmgBonus: 0, anemoDmgBonus: 0, cryoDmgBonus: 0, geoDmgBonus: 0, physicalDmgBonus: 0, dmgReduction: 0, enemyRes: 0, levelChar: 90, levelEnemy: 100, defReduction: 0, defIgnore: 0, healingBonus: 0 };
    
    // C6 on: DEF = 1000 -> 50% DEF = 500 ATK equivalent
    const r1 = resolveXinyan(xinyan, ctxFor("xinyan", {
      constellationLevel: 6,
      stats,
      inputs: { "c6-charged-atk-bonus": 1 }
    }));
    
    // At talent Lv10: charged-cyclic multiplier is 123.6%
    // Flat DMG bonus = (123.6 / 100) * 500 = 618
    expect(r1.perHit["charged-cyclic"]?.flatDmgBonus).toBeCloseTo(618, 1);
    // At talent Lv10: charged-final multiplier is 224.0%
    // Flat DMG bonus = (224.0 / 100) * 500 = 1120
    expect(r1.perHit["charged-final"]?.flatDmgBonus).toBeCloseTo(1120, 1);

    // Constellation < 6: no flat DMG bonus
    const r2 = resolveXinyan(xinyan, ctxFor("xinyan", {
      constellationLevel: 5,
      stats,
      inputs: { "c6-charged-atk-bonus": 1 }
    }));
    expect(r2.perHit["charged-cyclic"]?.flatDmgBonus).toBeUndefined();
    expect(r2.perHit["charged-final"]?.flatDmgBonus).toBeUndefined();
  });

  it("talent seed row count", () => {
    const rows = flattenSeed([xinyanSeed]);
    expect(rows.length).toBe(240); // 16 hits * 15 levels = 240 rows
  });
});
