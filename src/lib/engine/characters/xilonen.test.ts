import { describe, it, expect } from "vitest";
import { resolveXilonen } from "./xilonen";
import { xilonen } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("xilonen mechanics", () => {
  it("A4 Portable Armored Sheath: +20% DEF on Nightsoul Burst", () => {
    // baseDef = 1000 -> +200 DEF
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      stats: { ...baseStats, def: 1000 },
      baseDef: 1000,
      inputs: { "a4-nightsoul-burst": 1, "source-samples-active": 0 },
    }));
    expect(r.statDeltas.def).toBe(200);
  });

  it("Source Samples: -36% Enemy RES at Skill Lv10", () => {
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      stats: { ...baseStats, def: 1000 },
      talentLevels: { skill: "10" },
      inputs: { "source-samples-active": 1, "a4-nightsoul-burst": 0 },
    }));
    expect(r.statDeltas.enemyRes).toBe(-36);
  });

  it("C3 auto-boosts Skill to Lv13: -45% Enemy RES", () => {
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      constellationLevel: 3,
      stats: { ...baseStats, def: 1000 },
      talentLevels: { skill: "10" },
      inputs: { "source-samples-active": 1, "a4-nightsoul-burst": 0 },
    }));
    expect(r.statDeltas.enemyRes).toBe(-45);
  });

  it("A1 Netotiliztli's Echoes: +30% Normal/Plunge DMG bonus in Geo DPS mode", () => {
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      inputs: { "source-samples-geo-dps": 1 },
    }));
    expect(r.perHit["1-hit"]?.bonusDmgPct).toBe(30);
    expect(r.perHit["blade-roller-1"]?.bonusDmgPct).toBe(30);
    expect(r.perHit["plunge"]?.bonusDmgPct).toBe(30);
    expect(r.perHit["low-plunge"]?.bonusDmgPct).toBe(30);
    expect(r.perHit["high-plunge"]?.bonusDmgPct).toBe(30);
    expect(r.perHit["follow-up-beat"]?.baseDmgMultiplier).toBeUndefined();
  });

  it("Support Mode (Geo DPS mode off): disables Burst Follow-Up Beats", () => {
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      inputs: { "source-samples-geo-dps": 0 },
    }));
    expect(r.perHit["1-hit"]?.bonusDmgPct).toBeUndefined();
    expect(r.perHit["follow-up-beat"]?.baseDmgMultiplier).toBe(0);
  });

  it("C2 Chiucue Mix: +50% Geo DMG Bonus", () => {
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      constellationLevel: 2,
      inputs: { "c2-chiucue-mix": 1 },
    }));
    expect(r.statDeltas.geoDmgBonus).toBe(50);
  });

  it("C4 Suchitl's Trance: +65% DEF Flat DMG to Normal, Charged, Plunge", () => {
    // Total DEF = 2000 -> 65% = 1300 flat DMG
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      constellationLevel: 4,
      stats: { ...baseStats, def: 2000 },
      inputs: { "c4-blooming-blessing": 1, "a4-nightsoul-burst": 0 },
    }));
    expect(r.perHit["1-hit"]?.flatDmgBonus).toBe(1300);
    expect(r.perHit["charged"]?.flatDmgBonus).toBe(1300);
    expect(r.perHit["blade-roller-1"]?.flatDmgBonus).toBe(1300);
    expect(r.perHit["plunge"]?.flatDmgBonus).toBe(1300);
  });

  it("C6 Imperishable Night Carnival: +300% DEF Flat DMG", () => {
    // Total DEF = 2000 -> 300% = 6000 flat DMG
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      constellationLevel: 6,
      stats: { ...baseStats, def: 2000 },
      inputs: { "c4-blooming-blessing": 0, "c6-imperishable-night": 1, "a4-nightsoul-burst": 0 },
    }));
    expect(r.perHit["1-hit"]?.flatDmgBonus).toBe(6000);
    expect(r.perHit["blade-roller-1"]?.flatDmgBonus).toBe(6000);
    expect(r.perHit["plunge"]?.flatDmgBonus).toBe(6000);
  });

  it("C4 + C6 combined: +365% DEF Flat DMG on Blade Roller hits", () => {
    // Total DEF = 2000 -> 365% = 7300 flat DMG
    const r = resolveXilonen(xilonen, ctxFor("xilonen", {
      constellationLevel: 6,
      stats: { ...baseStats, def: 2000 },
      inputs: { "c4-blooming-blessing": 1, "c6-imperishable-night": 1, "a4-nightsoul-burst": 0 },
    }));
    expect(r.perHit["blade-roller-1"]?.flatDmgBonus).toBe(7300);
  });

  it("talent seed row count: 15 hits × 14 levels = 210 rows", () => {
    const rows = flattenSeed(TALENT_SEED.filter((x) => x.characterId === "xilonen"));
    expect(rows.length).toBe(210);
  });
});
