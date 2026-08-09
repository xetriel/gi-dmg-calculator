import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const xinyan: CharacterConfig = {
  id: "xinyan",
  name: "Xinyan",
  rarity: 4,
  element: "Pyro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Physical DMG Bonus%",
  stats: coreStats("ATK%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Dance on Fire",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-spin", name: "Charged Attack Spinning DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-final", name: "Charged Attack Final DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Sweeping Fervor",
      hits: [
        { key: "skill-swing", name: "Skill Swing DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
        { key: "shield-dot", name: "Level 3 Shield Rave DoT DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Riff Revolution",
      hits: [
        { key: "burst-physical", name: "Skill DMG (Physical Explosion)", scaling: "atk", hitCategory: "burst", element: "Physical" },
        { key: "burst-pyro-dot", name: "Pyro DoT DMG", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "shield-active",
      label: "A4 Shield Active (+15% Physical DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Characters protected by Sweeping Fervor's shield deal 15% increased Physical DMG."
    },
    {
      id: "c2-burst-crit",
      label: "C2 Impromptu Opening (+100% CRIT Rate on Burst Physical DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "C2: Riff Revolution's Physical DMG has its CRIT Rate increased by 100% and forms a Lv3 Shield."
    },
    {
      id: "c4-phys-shred",
      label: "C4 Wildfire Rhythm (-15% Enemy Physical RES)",
      control: "toggle",
      defaultValue: 1,
      hint: "C4: Sweeping Fervor's swing DMG decreases opponents' Physical RES by 15% for 12s."
    },
    {
      id: "c6-charged-atk-bonus",
      label: "C6 Rockin' in a Wild World (+50% DEF converted to ATK during Charged Attacks)",
      control: "toggle",
      defaultValue: 1,
      hint: "C6: Charged Attacks gain an ATK Bonus equal to 50% of Xinyan's DEF."
    }
  ],
  mechanics: [
    "Now That's Rock 'N' Roll! (A4): Characters protected by Sweeping Fervor's shield deal 15% increased Physical DMG.",
    "Fatal Acceleration (C1): Upon scoring a CRIT Hit, increases Normal and Charged Attack SPD by 12% for 5s.",
    "Impromptu Opening (C2): Riff Revolution's Physical DMG has its CRIT Rate increased by 100% and forms a Lv3 Shield.",
    "Wildfire Rhythm (C4): Sweeping Fervor's swing DMG decreases opponents' Physical RES by 15% for 12s.",
    "Rockin' in a Wild World (C6): Decreases Charged Attack Stamina Consumption by 30% and grants ATK Bonus equal to 50% of DEF during Charged Attacks."
  ],
  constellations: [
    {
      level: 1,
      name: "Fatal Acceleration",
      description: "Upon scoring a CRIT Hit, increases Normal and Charged Attack SPD by 12% for 5s. Can only occur once every 5s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Impromptu Opening",
      description: "Riff Revolution's Physical DMG has its CRIT Rate increased by 100%, and will form a Shield at Shield Level 3: Rave when cast.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Double-Stop",
      description: "Increases the Level of Sweeping Fervor by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Wildfire Rhythm",
      description: "Sweeping Fervor's swing DMG decreases opponents' Physical RES by 15% for 12s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Kindling Trigger",
      description: "Increases the Level of Riff Revolution by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Rockin' in a Wild World",
      description: "Decreases Xinyan's Charged Attack Stamina Consumption by 30%. Additionally, Xinyan's Charged Attacks gain an ATK Bonus equal to 50% of her DEF.",
      effects: [{ type: "informational" }]
    }
  ]
};
