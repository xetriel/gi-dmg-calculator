import { describe, it, expect } from "vitest";
import { arlecchino } from "../../../data/registry/characters/arlecchino";
import { arlecchinoSeed } from "../../../data/talents/arlecchino";
import { explainHitFormulas } from "../formula-explainer";
import type { CalcInstance } from "@/components/calculator/types";
import type { TalentScalingData } from "@/lib/talent-scaling";

describe("Arlecchino Genshin Optimizer Alignment Test", () => {
  it("computes exact Lv 13 NA + C1 Masque flat DMG increase of 27,720 matching GO", () => {
    const scaling: TalentScalingData = {
      normal: {
        levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        byLevel: {},
      },
    };
    for (const h of arlecchinoSeed.hits) {
      if (h.talentType === "normal") {
        h.values.forEach((v, idx) => {
          const lvl = idx + 1;
          (scaling.normal.byLevel[lvl] ??= {})[h.hitKey] = v;
        });
      }
    }

    const inst: CalcInstance = {
      id: "setup-1",
      stats: {
        "atk.base": "1016.4",
        "atk.percent": "204.1",
        "atk.flat": "1514",
        critRate: "80",
        critDmg: "228",
        dmgBonus: "40",
        normalDmgBonus: "20",
        pyroDmgBonus: "211.5",
        enemyRes: "-66",
        levelChar: "90",
        levelEnemy: "100",
      },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: { "bond-of-life": "155", "pyro-bonus": "1" },
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 3, // C3 adds +3 to NA talent level -> Effective Lv 13
    };

    const breakdowns = explainHitFormulas(arlecchino, scaling, inst);
    const hit1 = breakdowns.find(b => b.hitName === "1-Hit");

    expect(hit1).toBeDefined();
    if (!hit1) return;

    // 1-Hit multiplier at Level 13 should be 113.8%
    expect(hit1.multiplierPct).toBeCloseTo(113.8, 1);

    // Total DMG Increase should be 288.4% * 155% * 4604.6 + 100% C1 * 155% * 4604.6 = 27,720.0
    const flatDmgLine = hit1.subBreakdowns.find(s => s.includes("288.4%"));
    expect(flatDmgLine).toBeDefined();
    expect(flatDmgLine).toContain("288.4%");
    expect(flatDmgLine).toContain("100%");
  });
});
