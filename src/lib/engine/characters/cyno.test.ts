import { describe, it, expect } from "vitest";
import { resolveCyno } from "./cyno";
import { cyno } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("cyno mechanics", () => {
  it("Pactsworn state grants +100 EM", () => {
    const r1 = resolveCyno(cyno, ctxFor("cyno", {
      inputs: { "pactsworn-state": 1 },
    }));
    expect(r1.statDeltas.em).toBe(100);
  });

  it("A4 EM flat DMG additions (150% for Pactsworn NAs, 250% for Duststalker Bolts)", () => {
    // base EM = 200 + 100 from pactsworn-state = 300 EM.
    // Pactsworn NA flat DMG = 1.5 * 300 = 450 flat DMG.
    // Duststalker Bolt flat DMG = 2.5 * 300 = 750 flat DMG.
    const r1 = resolveCyno(cyno, ctxFor("cyno", {
      stats: { ...baseStats, em: 200 },
      inputs: { "pactsworn-state": 1 },
    }));
    expect(r1.perHit["pactsworn-1"]?.flatDmgBonus).toBe(450);
    expect(r1.perHit["pactsworn-5"]?.flatDmgBonus).toBe(450);
    expect(r1.perHit["duststalker-bolt"]?.flatDmgBonus).toBe(750);
    expect(r1.perHit["duststalker-bolt-stellar"]?.flatDmgBonus).toBe(750);
  });

  it("A1 Judication Mortuary Rite +35% DMG bonus", () => {
    const r1 = resolveCyno(cyno, ctxFor("cyno", {
      inputs: { "judication-buff": 1 },
    }));
    expect(r1.perHit["mortuary-rite"]?.bonusDmgPct).toBe(35);
  });

  it("Revelation Buff / Stellar-Conduct direct reaction attachment", () => {
    const r1 = resolveCyno(cyno, ctxFor("cyno", {
      inputs: { "revelation-buff": 1 },
    }));
    expect(r1.perHit["duststalker-bolt-stellar"]?.directReaction?.coefficient).toBe(1.45);
  });

  it("C2 Ceremony Electro DMG Bonus stacks (+10% per stack)", () => {
    const r1 = resolveCyno(cyno, ctxFor("cyno", {
      constellationLevel: 2,
      inputs: { "c2-stacks": 5 },
    }));
    expect(r1.statDeltas.electroDmgBonus).toBe(50);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "cyno"));
    expect(rows.length).toBe(308); // 22 hit definitions * 14 levels = 308 rows
  });
});
