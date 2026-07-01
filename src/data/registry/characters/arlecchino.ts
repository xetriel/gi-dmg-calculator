import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk } from "./hit-helpers";

export const arlecchino: CharacterConfig = {
  id: "arlecchino", name: "Arlecchino", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("4-hit-a", "4-Hit A"), atk("4-hit-b", "4-Hit B"),
      atk("5-hit", "5-Hit"), atk("6-hit", "6-Hit"),
      atk("charged", "Charged Attack"), atk("plunge", "Plunge"),
      atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    // Skill has no per-level multiplier table (fixed values only) — stays manual.
    { type: "skill", name: "Elemental Skill", hits: [
      atk("spike", "Spike"), atk("cleave", "Cleave"), atk("blood-debt-directive", "Blood-Debt Directive"),
    ] },
    { type: "burst", name: "Elemental Burst", hits: [atk("skill-dmg", "Skill DMG")] },
  ],
  mechanics: ["Masque of the Red Death Increase%","Bond of Life% (max 200)","Additional DMG (Normal Attack)","Additional DMG (Elemental Burst)","Normal Attack Type flag"],
  notes: ["Has ICD — amplifying (Vaporize/Melt) totals may be approximate."],
};
