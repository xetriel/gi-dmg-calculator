import { describe, it, expect } from "vitest";
import { explainHitFormulas } from "./formula-explainer";
import { arlecchino } from "../../data/registry/characters/arlecchino";
import { TALENT_SEED } from "../../data/talents";
import type { TalentScalingData } from "../../lib/talent-scaling";

// Helper to build scaling map from seed
function buildScaling(characterId: string): TalentScalingData {
  const seeds = TALENT_SEED.filter(s => s.characterId === characterId);
  const out: TalentScalingData = {};
  for (const s of seeds) {
    for (const h of s.hits) {
      const t = (out[h.talentType] ??= { levels: [], byLevel: {} });
      h.values.forEach((v, idx) => {
        const lvl = idx + 1;
        (t.byLevel[lvl] ??= {})[h.hitKey] = v;
      });
    }
  }
  for (const t of Object.values(out)) {
    t.levels = Object.keys(t.byLevel).map(Number).sort((a, b) => a - b);
  }
  return out;
}

describe("explainHitFormulas: Arlecchino formula breakdown", () => {
  const scaling = buildScaling("arlecchino");

  it("generates main formula and sub-breakdowns for Arlecchino 1-Hit", () => {
    const inst = {
      id: "setup-1",
      stats: {
        "atk.base": "1016.4",
        "atk.flat": "311",
        "atk.percent": "71.1",
        "critRate": "80.3",
        "critDmg": "227.5",
        "dmgBonus": "40",
        "pyroDmgBonus": "46.6",
      },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: { "bond-of-life": "155" },
      reaction: "none" as const,
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };

    const breakdowns = explainHitFormulas(arlecchino, scaling, inst);
    expect(breakdowns.length).toBeGreaterThan(0);

    const hit1 = breakdowns.find(b => b.hitName === "1-Hit");
    expect(hit1).toBeDefined();
    expect(hit1?.mainFormula).toContain("1-Hit");
    expect(hit1?.subBreakdowns.some(s => s.includes("Base ATK"))).toBe(true);
    expect(hit1?.subBreakdowns.some(s => s.includes("Total Normal Att. DMG Increase"))).toBe(true);
  });

  it("generates correct Direct Lunar formula for Columbina Moondew Cleanse", async () => {
    const columbinaConfig = (await import("../../data/registry/characters/columbina")).columbina;
    const columbinaScaling = buildScaling("columbina");
    const inst = {
      id: "setup-columbina",
      stats: {
        "hp.base": "14695",
        "hp.flat": "29431",
        "hp.percent": "0",
        "em": "574.85",
        "critRate": "99.1",
        "critDmg": "211.2",
        "enemyRes": "-45",
      },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: { "lunar-domain": "1" },
      reaction: "none" as const,
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };

    const breakdowns = explainHitFormulas(columbinaConfig, columbinaScaling, inst);
    const moondew = breakdowns.find(b => b.hitName.includes("Moondew Cleanse"));

    expect(moondew).toBeDefined();
    expect(moondew?.mainFormulaCrit).not.toContain("Total DMG Bonus");
    expect(moondew?.mainFormulaCrit).toContain("Base Transformative Multiplier");
    expect(moondew?.mainFormulaCrit).toContain("Total Lunar Base DMG Multiplier");
    expect(moondew?.mainFormulaCrit).not.toContain("Enemy DEF Multiplier");
  });

  it("generates correct formula breakdown for Flins Thunderous Symphony Additional DMG", async () => {
    const flinsConfig = (await import("../../data/registry/characters/flins")).flins;
    const flinsScaling = buildScaling("flins");
    const inst = {
      id: "setup-flins-1",
      stats: {
        "atk.base": "1026",
        "atk.flat": "1443",
        "atk.percent": "0",
        "em": "501.8", // with Flins A4 (+160 ATK->EM), total EM becomes ~661.8
        "critRate": "71.8",
        "critDmg": "196.4",
        "enemyRes": "10",
      },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: { "ascendant-gleam": "1", "manifest-flame": "1" },
      reaction: "none" as const,
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };

    const breakdowns = explainHitFormulas(flinsConfig, flinsScaling, inst);
    const symphonyAdd = breakdowns.find(b => b.hitName === "Thunderous Symphony Additional DMG");

    expect(symphonyAdd).toBeDefined();

    // 1. Reaction coefficient 3 must be present in the main formula
    expect(symphonyAdd?.mainFormulaCrit).toContain("* 3 *");
    expect(symphonyAdd?.mainFormulaAvg).toContain("* 3 *");

    // 2. Positive 10% enemy RES must NOT have / 2
    expect(symphonyAdd?.mainFormulaCrit).toContain("(100% - Total Enemy Electro DMG RES 10%)");
    expect(symphonyAdd?.mainFormulaCrit).not.toContain("10% / 2");

    // 3. Sub-breakdown for CRIT Rate uses Initial Crit Rate
    const crLine = symphonyAdd?.subBreakdowns.find(s => s.startsWith("Total Crit Rate"));
    expect(crLine).toBeDefined();
    expect(crLine).toContain("Initial Crit Rate 71.8%");
    expect(crLine).not.toContain("Default Crit Rate");
    expect(crLine).not.toContain("Art. Crit Rate");

    // 4. Sub-breakdown for CRIT DMG uses Initial Crit DMG
    const cdLine = symphonyAdd?.subBreakdowns.find(s => s.startsWith("Total Crit DMG"));
    expect(cdLine).toBeDefined();
    expect(cdLine).toBe("Total Crit DMG 196.4% = Initial Crit DMG 196.4%");

    // 5. Lunar Base DMG Bonus must scale from ATK, not HP
    const lunarBaseLine = symphonyAdd?.subBreakdowns.find(s => s.includes("Lunar Base DMG"));
    expect(lunarBaseLine).toBeDefined();
    expect(lunarBaseLine).toContain("Min(0.7% * (Total ATK");
    expect(lunarBaseLine).not.toContain("Total HP");
  });

  it("strictly clamps CRIT Rate > 100% to 100% per the law of probability", async () => {
    const flinsConfig = (await import("../../data/registry/characters/flins")).flins;
    const flinsScaling = buildScaling("flins");
    const inst = {
      id: "setup-flins-overcapped-crit",
      stats: {
        "atk.base": "1026",
        "atk.flat": "1000",
        "atk.percent": "0",
        "critRate": "115",
        "critDmg": "200",
        "enemyRes": "10",
      },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: { "ascendant-gleam": "1" },
      reaction: "none" as const,
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };

    const breakdowns = explainHitFormulas(flinsConfig, flinsScaling, inst);
    const symphony = breakdowns.find(b => b.hitName === "Thunderous Symphony Additional DMG");
    const crLine = symphony?.subBreakdowns.find(s => s.startsWith("Total Crit Rate"));

    expect(crLine).toBeDefined();
    // Clamped total is 100%
    expect(crLine).toBe("Total Crit Rate 100% = Max(Min((Initial Crit Rate 115%), 100%), 0%)");
  });

  it("integrates External Artifact Buffs into CRIT breakdown and Received Team Buffs", async () => {
    const flinsConfig = (await import("../../data/registry/characters/flins")).flins;
    const flinsScaling = buildScaling("flins");
    const inst = {
      id: "setup-flins-external-artifacts",
      stats: {
        "atk.base": "1026",
        "atk.flat": "1000",
        "atk.percent": "0",
        "critRate": "50",
        "critDmg": "150",
        "enemyRes": "10",
      },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: { "ascendant-gleam": "1" },
      reaction: "none" as const,
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
      externalArtifactsEnabled: true,
      externalArtifacts: [
        {
          artifactId: "obsidian-codex",
          pieceCount: 4 as const,
          slot: "wielder" as const,
          enabled: true,
          inputs: { "obsidian-consumed-point": 1 },
        },
      ],
    };

    const breakdowns = explainHitFormulas(flinsConfig, flinsScaling, inst);
    const symphony = breakdowns.find(b => b.hitName === "Thunderous Symphony Additional DMG");
    const crLine = symphony?.subBreakdowns.find(s => s.startsWith("Total Crit Rate"));

    expect(crLine).toBeDefined();
    // 50% initial + 40% from Obsidian Codex = 90%
    expect(crLine).toContain("Initial Crit Rate 50%");
    expect(crLine).toContain("Crit Rate (Obsidian Codex) 40%");
    expect(crLine).toContain("Total Crit Rate 90%");

    // Received Team Buffs summary card
    const teamBuffsCard = breakdowns.find(b => b.id === "received-team-buffs");
    expect(teamBuffsCard).toBeDefined();
    expect(teamBuffsCard?.subBreakdowns.some(s => s.includes("Obsidian Codex"))).toBe(true);
  });
});
