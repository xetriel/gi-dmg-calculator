import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk } from "./hit-helpers";

// Corrected from the Excel's leftover metadata (it carried Arlecchino's Pyro/Polearm/CRIT DMG).
// No per-level tables retrievable yet — all hits stay manual until fetched.
export const clorinde: CharacterConfig = {
  id: "clorinde", name: "Clorinde", rarity: 5,
  element: "Electro", weapon: "Sword", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit-x2", "3-Hit ×2"),
      atk("4-hit-x3", "4-Hit ×3"), atk("5-hit", "5-Hit"),
      atk("charged", "Charged Attack (Stamina 20)"),
      atk("plunge", "Plunge"), atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill", hits: [
      atk("swift-hunt-1", "Swift Hunt 1"), atk("swift-hunt-2", "Swift Hunt 2"),
      atk("impale-1", "Impale the Night 1"), atk("impale-2", "Impale the Night 2"),
      atk("impale-3", "Impale the Night 3"), atk("surging-blade", "Surging Blade"),
    ] },
    { type: "burst", name: "Elemental Burst", hits: [atk("skill-dmg-x5", "Skill DMG ×5")] },
  ],
  mechanics: ["Bond of Life thresholds (≥100% / <100% / 0%) select skill variants","Passive CRIT Rate bonus"],
  panels: ["Nahida support panel"],
};
