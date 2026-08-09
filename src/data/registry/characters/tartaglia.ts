import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const tartaglia: CharacterConfig = {
  id: "tartaglia",
  name: "Tartaglia",
  rarity: 5,
  element: "Hydro",
  weapon: "Bow",
  scalingSource: "atk",
  ascensionStat: { label: "Hydro DMG Bonus%", maxValue: 28.8 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("Hydro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Cutting Torrent",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "6-hit", name: "6-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "aimed", name: "Aimed Shot", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-1", name: "Fully Charged Aimed Shot", scaling: "atk", hitCategory: "charged", element: "Hydro" },
        { key: "riptide-flash", name: "Riptide Flash DMG (x3)", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "riptide-burst", name: "Riptide Burst DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Foul Legacy: Raging Wave",
      hits: [
        { key: "stance-change", name: "Stance Change DMG", scaling: "atk", hitCategory: "skill", element: "Hydro" },
        { key: "melee-1-hit", name: "Melee 1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-2-hit", name: "Melee 2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-3-hit", name: "Melee 3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-4-hit", name: "Melee 4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-5-hit", name: "Melee 5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-6-hit-1", name: "Melee 6-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-6-hit-2", name: "Melee 6-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "melee-charged-1", name: "Melee Charged Attack (Hit 1)", scaling: "atk", hitCategory: "charged", element: "Hydro" },
        { key: "melee-charged-2", name: "Melee Charged Attack (Hit 2)", scaling: "atk", hitCategory: "charged", element: "Hydro" },
        { key: "riptide-slash", name: "Riptide Slash DMG", scaling: "atk", hitCategory: "skill", element: "Hydro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Havoc: Obliteration",
      hits: [
        { key: "burst-ranged", name: "Ranged Burst: Flash of Havoc DMG", scaling: "atk", hitCategory: "burst", element: "Hydro" },
        { key: "burst-melee", name: "Melee Burst: Light of Obliteration DMG", scaling: "atk", hitCategory: "burst", element: "Hydro" },
        { key: "riptide-blast", name: "Riptide Blast DMG", scaling: "atk", hitCategory: "burst", element: "Hydro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "master-of-weaponry",
      label: "Master of Weaponry (+1 Normal Attack Talent Level)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases party members' Normal Attack Talent Level by 1."
    },
    {
      id: "riptide-active",
      label: "Riptide Status Active on Target",
      control: "toggle",
      defaultValue: 1,
      hint: "Enables Riptide Flash, Riptide Slash, and Riptide Blast proc damage."
    }
  ],
  mechanics: [
    "Master of Weaponry (Passive 1): Increases your own and party members' Normal Attack Talent Level by 1.",
    "Never-Ending Stream (A1): Extends Riptide duration by 8s.",
    "Sword of Torrents (A4): When Tartaglia is in Foul Legacy: Raging Wave's Melee Stance, CRIT Hits on Normal and Charged Attacks apply Riptide.",
    "Foul Legacy: Tide Withholder (C1): Decreases Foul Legacy: Raging Wave's CD by 20%.",
    "Foul Legacy: Underplay (C2): Defeating opponents affected by Riptide restores 4 Energy.",
    "Abyssal Mayhem: Hydrospout (C4): Triggers Riptide Flash/Slash automatically every 4s on opponents affected by Riptide.",
    "Havoc: Angelic Demise (C6): Using Havoc: Obliteration in Melee Stance resets the CD of Foul Legacy: Raging Wave upon returning to Ranged Stance."
  ],
  constellations: [
    {
      level: 1,
      name: "Foul Legacy: Tide Withholder",
      description: "Decreases the CD of Foul Legacy: Raging Wave by 20%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Foul Legacy: Underplay",
      description: "When opponents affected by Riptide are defeated, Tartaglia regenerates 4 Elemental Energy.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Abyssal Mayhem: Vortex of Chaos",
      description: "Increases the Level of Foul Legacy: Raging Wave by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Abyssal Mayhem: Hydrospout",
      description: "If Tartaglia is in Melee Stance, triggers Riptide Slash every 4s on opponents affected by Riptide; otherwise, triggers Riptide Flash.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Havoc: Formless Blade",
      description: "Increases the Level of Havoc: Obliteration by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Havoc: Angelic Demise",
      description: "When Havoc: Obliteration is cast in Melee Stance, the CD of Foul Legacy: Raging Wave is cleared upon returning to Ranged Stance.",
      effects: [{ type: "informational" }]
    }
  ]
};
