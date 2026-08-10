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
        { key: "spiritbreath-thorn", name: "Spiritbreath Thorn DMG (Arkhe: Pneuma)", scaling: "atk", hitCategory: "skill", element: "Hydro" },
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
      id: "a4-clear-waters",
      label: "A4 Clear Waters (Suffusion HP Consumed Extra DMG on Torrent Surge)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Torrent Surge DMG by 45% of total HP consumed via Suffusion (capped at 5,000 Flat DMG)."
    },
    {
      id: "c4-shield",
      label: "C4 Pouring Stream (10% Max HP Shield)",
      control: "toggle",
      defaultValue: 1,
      hint: "Creates a shield absorbing 10% of Max HP when casting Aquacrest Saber."
    },
    {
      id: "c6-tides-of-justice",
      label: "C6 Tides of Justice (Hydro Infusion & +40% Max HP Flat DMG on Normal Attacks)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal Attacks to Hydro DMG and adds flat DMG equal to 40% of Max HP after restoring HP."
    }
  ],
  mechanics: [
    "Spotless Waters (A1): Drops Sourcewater Droplet when Hold Dewdrop hits (restores 7% Max HP).",
    "Clear Waters (A4): Torrent Surge deals extra Flat DMG based on HP consumed (45% of HP consumed, max 5,000).",
    "Drowning Swell (C2): Decreases Torrential Deluge bubble speed by 30% and extends duration by 3s.",
    "Pouring Stream (C4): Creates a shield absorbing 10% Max HP upon casting Aquacrest Saber.",
    "Tides of Justice (C6): Restoring HP converts Normal Attack to Hydro DMG + 40% Max HP Flat DMG."
  ],
  constellations: [
    { level: 1, name: "Swirling Weasel", description: "Picking up Sourcewater Droplet restores 2 Energy.", effects: [{ type: "informational" }] },
    { level: 2, name: "Drowning Swell", description: "Decreases Torrential Deluge movement speed by 30% and extends duration by 3s.", effects: [{ type: "informational" }] },
    { level: 3, name: "Surging City", description: "Increases the Level of Aquacrest Saber by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 4, name: "Pouring Stream", description: "Creates a shield absorbing 10% Max HP upon casting Aquacrest Saber.", effects: [{ type: "informational" }] },
    { level: 5, name: "Churning Whirlpool", description: "Increases the Level of Torrential Deluge by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 6, name: "Tides of Justice", description: "Restoring HP converts next Normal Attack to Hydro DMG and adds 40% Max HP as Flat DMG.", effects: [{ type: "informational" }] }
  ]
};
