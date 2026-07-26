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
});
