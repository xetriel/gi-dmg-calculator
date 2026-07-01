import type { CharacterConfig, TalentHit } from "./types";
import { coreStats } from "./core-stats";

// Helpers: build a hit that scales off ATK or HP. `key` is the stable id joined
// to the TalentScaling table; `name` is the display label. Per-hit scaling matters
// because a character's hits are not always uniform (see Neuvillette below).
const atk = (key: string, name: string): TalentHit => ({ key, name, scaling: "atk" });
const hp = (key: string, name: string): TalentHit => ({ key, name, scaling: "hp" });

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

export const huTao: CharacterConfig = {
  id: "hu-tao", name: "Hu Tao", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  // Hits scale on ATK; her skill converts Max HP into bonus ATK, so enter the
  // in-Paramita total ATK. (scalingSource stays "hp" as the conceptual source.)
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("4-hit", "4-Hit"), atk("5-hit", "5-Hit"), atk("6-hit", "6-Hit"),
      atk("charged", "Charged Attack"), atk("plunge", "Plunge"),
      atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Blood Blossom", hits: [atk("blood-blossom", "Blood Blossom")] },
    { type: "burst", name: "Elemental Burst — Spirit Soother", hits: [
      atk("skill-dmg", "Skill DMG"), atk("low-hp-skill-dmg", "Low-HP Skill DMG"),
    ] },
  ],
  panels: ["Party panel (Xianyun / Furina / Yelan)","Signature Weapon + Refinement","HP ≤ 50% Paramita state toggle"],
};

export const neuvillette: CharacterConfig = {
  id: "neuvillette", name: "Neuvillette", rarity: 5,
  element: "Hydro", weapon: "Catalyst", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "All DMG Bonus%",
  stats: coreStats("All DMG Bonus%"),
  // Mixed scaling: basic NA / regular Charged / Plunges scale on ATK; Equitable
  // Judgment, Skill, and Burst scale on Max HP.
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("charged", "Charged Attack"),
      hp("equitable-judgment", "Charged Attack: Equitable Judgment (% Max HP)"),
      atk("plunge", "Plunge"), atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill", hits: [
      hp("skill-dmg", "Skill DMG (% Max HP)"), hp("spiritbreath-thorn", "Spiritbreath Thorn"),
    ] },
    // Burst per-level table not yet captured — stays manual until fetched.
    { type: "burst", name: "Elemental Burst", hits: [
      hp("skill-dmg", "Skill DMG (% Max HP)"), hp("waterfall", "Waterfall (% Max HP)"),
    ] },
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
  // No per-level tables retrievable yet — all hits stay manual until fetched.
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

export const CHARACTERS: CharacterConfig[] = [arlecchino, huTao, neuvillette, clorinde];
export const byId = (id: string) => CHARACTERS.find(c => c.id === id);
