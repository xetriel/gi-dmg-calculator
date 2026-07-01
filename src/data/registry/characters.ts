import type { CharacterConfig } from "./types";
import { coreStats } from "./core-stats";

export const arlecchino: CharacterConfig = {
  id: "arlecchino", name: "Arlecchino", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  talents: [
    { name: "Normal Attack", hits: ["1-Hit","2-Hit","3-Hit","4-Hit","4-Hit 2","5-Hit","6-Hit","Charged Attack","Plunge","Low Plunge","High Plunge"] },
    { name: "Elemental Skill", hits: ["Spike","Cleave","Blood-Debt Directive"] },
    { name: "Elemental Burst", hits: ["Skill DMG"] },
  ],
  mechanics: ["Masque of the Red Death Increase%","Bond of Life% (max 200)","Additional DMG (Normal Attack)","Additional DMG (Elemental Burst)","Normal Attack Type flag"],
  notes: ["Has ICD — amplifying (Vaporize/Melt) totals may be approximate."],
};

export const huTao: CharacterConfig = {
  id: "hu-tao", name: "Hu Tao", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    { name: "Normal Attack", hits: ["1-Hit","2-Hit","3-Hit","4-Hit","5-Hit","5-Hit 2","6-Hit","Charged Attack","Plunge","Low Plunge","High Plunge"] },
    { name: "Elemental Skill", hits: ["Guide to Afterlife"] },
    { name: "Elemental Burst", hits: ["Spirit Soother"] },
  ],
  panels: ["Party panel (Xianyun / Furina / Yelan)","Signature Weapon + Refinement","HP ≤ 50% Paramita state toggle"],
};

export const neuvillette: CharacterConfig = {
  id: "neuvillette", name: "Neuvillette", rarity: 5,
  element: "Hydro", weapon: "Catalyst", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "All DMG Bonus%",
  stats: coreStats("All DMG Bonus%"),
  talents: [
    { name: "Normal Attack", hits: ["1-Hit","2-Hit","3-Hit","Charged Attack","Charged Attack: Equitable Judgment (% Max HP)","Plunge","Low Plunge","High Plunge"] },
    { name: "Elemental Skill", hits: ["Skill DMG (% Max HP)","Spiritbreath Thorn"] },
    { name: "Elemental Burst", hits: ["Skill DMG (% Max HP)","Waterfall (% Max HP)"] },
  ],
  mechanics: ["Past Draconic Glories Stacks (0–3)","Max HP% buff"],
  panels: ["Active / Inactive + Refinement panel"],
};

export const clorinde: CharacterConfig = {
  id: "clorinde", name: "Clorinde", rarity: 5,
  // Corrected from the Excel's leftover metadata (it carried Arlecchino's Pyro/Polearm/CRIT DMG).
  element: "Electro", weapon: "Sword", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  talents: [
    { name: "Normal Attack", hits: ["1-Hit","2-Hit","3-Hit ×2","4-Hit ×3","5-Hit","Charged Attack (Stamina 20)","Plunge","Low Plunge","High Plunge"] },
    { name: "Elemental Skill", hits: ["Swift Hunt 1","Swift Hunt 2","Impale the Night 1","Impale the Night 2","Impale the Night 3","Surging Blade"] },
    { name: "Elemental Burst", hits: ["Skill DMG ×5"] },
  ],
  mechanics: ["Bond of Life thresholds (≥100% / <100% / 0%) select skill variants","Passive CRIT Rate bonus"],
  panels: ["Nahida support panel"],
};

export const CHARACTERS: CharacterConfig[] = [arlecchino, huTao, neuvillette, clorinde];
export const byId = (id: string) => CHARACTERS.find(c => c.id === id);
