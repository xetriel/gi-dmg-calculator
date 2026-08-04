import { describe, it, expect } from "vitest";
import { resolveDiluc } from "./diluc";
import { diluc } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("diluc mechanics", () => {
  it("Pyro Infusion converts Normal, Charged, and Plunging attacks to Pyro element", () => {
    const r1 = resolveDiluc(diluc, ctxFor("diluc", {
      inputs: { "pyro-infusion": 1 },
    }));
    expect(r1.perHit["1-hit"]?.element).toBe("Pyro");
    expect(r1.perHit["charged-spin"]?.element).toBe("Pyro");
    expect(r1.perHit["high-plunge"]?.element).toBe("Pyro");

    const r2 = resolveDiluc(diluc, ctxFor("diluc", {
      inputs: { "pyro-infusion": 0 },
    }));
    expect(r2.perHit["1-hit"]?.element).toBeUndefined();
  });

  it("A4 Blessing of Phoenix grants +20% Pyro DMG Bonus", () => {
    const r1 = resolveDiluc(diluc, ctxFor("diluc", {
      inputs: { "a4-pyro-buff": 1 },
    }));
    expect(r1.statDeltas.pyroDmgBonus).toBe(20);
  });

  it("C1 Conviction grants +15% DMG Bonus", () => {
    const r1 = resolveDiluc(diluc, ctxFor("diluc", {
      constellationLevel: 1,
      inputs: { "c1-high-hp-buff": 1 },
    }));
    expect(r1.statDeltas.dmgBonus).toBe(15);
  });

  it("C2 Searing Ember stacks grant +10% Base ATK per stack", () => {
    // baseAtk = 335 -> 3 stacks = +30% = +100.5 ATK
    const r1 = resolveDiluc(diluc, ctxFor("diluc", {
      constellationLevel: 2,
      inputs: { "c2-stacks": 3 },
      baseAtk: 335,
    }));
    expect(r1.statDeltas.atk).toBeCloseTo(100.5);
  });

  it("C4 Flowing Flame grants +40% DMG bonus to Skill 2nd and 3rd hits", () => {
    const r1 = resolveDiluc(diluc, ctxFor("diluc", {
      constellationLevel: 4,
      inputs: { "c4-rhythm-buff": 1 },
    }));
    expect(r1.perHit["2-hit"]?.bonusDmgPct).toBe(40);
    expect(r1.perHit["3-hit"]?.bonusDmgPct).toBe(40);
    expect(r1.perHit["1-hit"]?.bonusDmgPct).toBeUndefined();
  });

  it("C6 Flaming Sword grants +30% Normal Attack DMG bonus", () => {
    const r1 = resolveDiluc(diluc, ctxFor("diluc", {
      constellationLevel: 6,
      inputs: { "c6-post-skill-buff": 1 },
    }));
    expect(r1.perHit["1-hit"]?.bonusDmgPct).toBe(30);
    expect(r1.perHit["2-hit"]?.bonusDmgPct).toBe(30);
    expect(r1.perHit["3-hit"]?.bonusDmgPct).toBe(30);
    expect(r1.perHit["4-hit"]?.bonusDmgPct).toBe(30);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "diluc"));
    expect(rows.length).toBe(210); // 15 hit definitions * 14 levels = 210 rows
  });
});
