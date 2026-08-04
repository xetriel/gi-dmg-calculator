import { describe, it, expect } from "vitest";
import { resolveAloy } from "./aloy";
import { aloy } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("aloy mechanics", () => {
  it("Coil stacks 1–3 NA DMG Bonus scaling", () => {
    // At level 10 skill: coil-1 = 9.54%, coil-2 = 19.08%, coil-3 = 28.62%
    const r1 = resolveAloy(aloy, ctxFor("aloy", {
      inputs: { "coil-stacks": 1 },
      levels: { skill: "10" },
    }));
    expect(r1.statDeltas.normalDmgBonus).toBeCloseTo(9.54);

    const r3 = resolveAloy(aloy, ctxFor("aloy", {
      inputs: { "coil-stacks": 3 },
      levels: { skill: "10" },
    }));
    expect(r3.statDeltas.normalDmgBonus).toBeCloseTo(28.62);
  });

  it("Rushing Ice state (4 Coil stacks) Cryo NA infusion and +47.65% NA DMG Bonus", () => {
    const r0 = resolveAloy(aloy, ctxFor("aloy", {
      inputs: { "coil-stacks": 0 },
    }));
    expect(r0.perHit["1-hit-a"]?.element).toBeUndefined(); // Base hit element is Physical (white)

    const r4 = resolveAloy(aloy, ctxFor("aloy", {
      inputs: { "coil-stacks": 4 },
      levels: { skill: "10" },
    }));
    expect(r4.statDeltas.normalDmgBonus).toBeCloseTo(47.65);
    expect(r4.perHit["1-hit-a"]?.element).toBe("Cryo");
    expect(r4.perHit["4-hit"]?.element).toBe("Cryo");
  });

  it("A1 Combat Override +16% ATK buff", () => {
    // baseAtk = 234 -> +16% = 37.44 ATK
    const r1 = resolveAloy(aloy, ctxFor("aloy", {
      inputs: { "a1-atk-buff": 1 },
      baseAtk: 234,
    }));
    expect(r1.statDeltas.atk).toBeCloseTo(37.44);
  });

  it("A4 Strong Strike Cryo DMG Bonus stacks (+3.5% per stack)", () => {
    const r10 = resolveAloy(aloy, ctxFor("aloy", {
      inputs: { "a4-cryo-stacks": 10 },
    }));
    expect(r10.statDeltas.cryoDmgBonus).toBe(35);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "aloy"));
    expect(rows.length).toBe(238); // 17 hit definitions * 14 levels = 238 rows
  });
});
