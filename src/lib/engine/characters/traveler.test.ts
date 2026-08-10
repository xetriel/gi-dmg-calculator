import { describe, it, expect } from "vitest";
import { resolveTravelerAnemo } from "./traveler-anemo";
import { resolveTravelerGeo } from "./traveler-geo";
import { resolveTravelerElectro } from "./traveler-electro";
import { resolveTravelerDendro } from "./traveler-dendro";
import { resolveTravelerHydro } from "./traveler-hydro";
import { resolveTravelerPyro } from "./traveler-pyro";
import { travelerAnemo, travelerGeo, travelerElectro, travelerDendro, travelerHydro, travelerPyro } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("traveler mechanics", () => {
  it("Anemo Traveler C2 grants +16% ER and C6 reduces enemy RES by 20%", () => {
    const r1 = resolveTravelerAnemo(travelerAnemo, ctxFor("traveler-anemo", {
      constellationLevel: 2,
      inputs: { "c2-er-bonus": 1 },
    }));
    expect(r1.statDeltas.energyRecharge).toBe(16);

    const r2 = resolveTravelerAnemo(travelerAnemo, ctxFor("traveler-anemo", {
      constellationLevel: 6,
      inputs: { "c6-res-shred": 1 },
    }));
    expect(r2.statDeltas.enemyRes).toBe(-20);
  });

  it("Geo Traveler C1 grants +10% CRIT Rate inside Burst zone", () => {
    const r = resolveTravelerGeo(travelerGeo, ctxFor("traveler-geo", {
      constellationLevel: 1,
      inputs: { "c1-crit-rate": 1 },
    }));
    expect(r.statDeltas.critRate).toBe(10);
  });

  it("Electro Traveler C6 grants 200% DMG multiplier on 3rd Falling Thunder", () => {
    const r = resolveTravelerElectro(travelerElectro, ctxFor("traveler-electro", {
      constellationLevel: 6,
    }));
    expect(r.perHit["falling-thunder-3rd"]?.baseDmgMultiplier).toBe(2);
  });

  it("Dendro Traveler A4 EM scaling and C6 Dendro DMG Bonus", () => {
    const r = resolveTravelerDendro(travelerDendro, ctxFor("traveler-dendro", {
      stats: { ...baseStats, em: 200 },
      constellationLevel: 6,
      inputs: { "c6-dendro-buff": 1 },
    }));
    expect(r.statDeltas.dendroDmgBonus).toBe(12);
    expect(r.perHit["skill-dmg"]?.bonusDmgPct).toBe(30); // 200 * 0.15% = 30%
    expect(r.perHit["lotus-dmg"]?.bonusDmgPct).toBe(20); // 200 * 0.1% = 20%
  });

  it("Hydro Traveler C4 shield durability note", () => {
    const r = resolveTravelerHydro(travelerHydro, ctxFor("traveler-hydro", {
      stats: { ...baseStats, hp: 10000 },
      constellationLevel: 4,
      inputs: { "c4-shield": 1 },
    }));
    expect(r.notes.some(n => n.includes("1000 HP durability"))).toBe(true);
  });

  it("Pyro Traveler C1, C4, C6 mechanics", () => {
    const r1 = resolveTravelerPyro(travelerPyro, ctxFor("traveler-pyro", {
      constellationLevel: 1,
      inputs: { "c1-starfire": 1, "c1-nightsoul-active": 1 },
    }));
    expect(r1.statDeltas.dmgBonus).toBe(15);

    const r4 = resolveTravelerPyro(travelerPyro, ctxFor("traveler-pyro", {
      constellationLevel: 4,
      inputs: { "c4-ravaging-flame": 1 },
    }));
    expect(r4.statDeltas.pyroDmgBonus).toBe(20);

    const r6 = resolveTravelerPyro(travelerPyro, ctxFor("traveler-pyro", {
      constellationLevel: 6,
      inputs: { "c6-sacred-flame": 1 },
    }));
    expect(r6.perHit["1-hit"]?.element).toBe("Pyro");
    expect(r6.perHit["1-hit"]?.critDmgBonusPct).toBe(40);
    expect(r6.perHit["skill-dmg"]?.critDmgBonusPct).toBe(40);
  });

  it("talent seed row counts for all Traveler forms", () => {
    const elements = ["traveler-anemo", "traveler-geo", "traveler-electro", "traveler-dendro", "traveler-hydro", "traveler-pyro"];
    for (const elem of elements) {
      const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === elem));
      expect(rows.length).toBeGreaterThan(0);
    }
  });
});
