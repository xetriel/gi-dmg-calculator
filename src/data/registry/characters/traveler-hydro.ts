import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const travelerHydro: CharacterConfig = {
  id: "traveler-hydro",
  name: "Traveler (Hydro)",
  rarity: 5,
  element: "Hydro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("ATK%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Foreign Stream",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-1", name: "Charged Attack (Hit 1)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-aether", name: "Charged Attack (Hit 2 — Aether)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-lumine", name: "Charged Attack (Hit 2 — Lumine)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Aquacrest Saber",
      hits: [
        { key: "torrent-surge", name: "Torrent Surge DMG", scaling: "atk", hitCategory: "skill", element: "Hydro" },
        { key: "dewdrop", name: "Dewdrop DMG", scaling: "atk", hitCategory: "skill", element: "Hydro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Torrential Deluge",
      hits: [
        { key: "bubble-dmg", name: "Bubble DMG", scaling: "atk", hitCategory: "burst", element: "Hydro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "c4-shield",
      label: "C4 Pouring Stream (10% Max HP Shield)",
      control: "toggle",
      defaultValue: 1,
      hint: "Creates a shield absorbing 10% of Max HP when casting Aquacrest Saber."
    }
  ],
  mechanics: [
    "Spotless Waters (A1): Drops Sourcewater Droplet when Hold Dewdrop hits.",
    "Clear Waters (A4): Torrent Surge deals extra DMG based on HP consumed.",
    "Drowning Swell (C2): Decreases Torrential Deluge bubble speed and extends duration.",
    "Pouring Stream (C4): Creates a shield absorbing 10% Max HP."
  ],
  constellations: [
    { level: 1, name: "Swirling Weasel", description: "Picking up Sourcewater Droplet restores 2 Energy.", effects: [{ type: "informational" }] },
    { level: 2, name: "Drowning Swell", description: "Decreases Torrential Deluge movement speed by 30% and extends duration by 3s.", effects: [{ type: "informational" }] },
    { level: 3, name: "Surging City", description: "Increases the Level of Aquacrest Saber by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 4, name: "Pouring Stream", description: "Creates a shield absorbing 10% Max HP upon casting Aquacrest Saber.", effects: [{ type: "informational" }] },
    { level: 5, name: "Churning Whirlpool", description: "Increases the Level of Torrential Deluge by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 6, name: "Tides of Justice", description: "Restoring HP converts next Normal Attack to Hydro DMG.", effects: [{ type: "informational" }] }
  ]
};
