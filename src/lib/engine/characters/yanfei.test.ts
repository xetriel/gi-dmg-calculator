import { describe, it, expect } from "vitest";
import { resolveYanfei } from "./yanfei";
import { yanfei } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("yanfei mechanics", () => {
  it("A1 Proviso grants +20% Pyro DMG Bonus at 4 Scarlet Seals", () => {
    const r1 = resolveYanfei(yanfei, ctxFor("yanfei", {
      inputs: { "scarlet-seals": 4 },
    }));
    expect(r1.statDeltas.pyroDmgBonus).toBe(20);
  });

  it("Burst Brilliance active grants +55.8% Charged Attack DMG Bonus at Burst Lv10", () => {
    const r2 = resolveYanfei(yanfei, ctxFor("yanfei", {
      talentLevels: { burst: 10 },
      inputs: { "brilliance-active": 1 },
    }));
    expect(r2.perHit["charged-3-seals"]?.bonusDmgPct).toBe(55.8);
    expect(r2.perHit["blazing-eye"]?.bonusDmgPct).toBe(55.8);
  });

  it("C2 Right of Final Interpretation grants +20% CRIT Rate on Charged Attacks", () => {
    const r3 = resolveYanfei(yanfei, ctxFor("yanfei", {
      constellationLevel: 2,
      inputs: { "c2-low-hp-crit": 1 },
    }));
    expect(r3.perHit["charged-3-seals"]?.critRateBonusPct).toBe(20);
  });

  it("C4 Supreme Amnesty calculates and outputs 45% Max HP shield durability in notes", () => {
    const r4 = resolveYanfei(yanfei, ctxFor("yanfei", {
      stats: { ...baseStats, hp: 10000 },
      constellationLevel: 4,
      inputs: { "c4-shield": 1 },
    }));
    expect(r4.notes.some(n => n.includes("4500 HP durability"))).toBe(true);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "yanfei"));
    expect(rows.length).toBe(210); // 15 hit definitions * 14 levels = 210 rows
  });
});
