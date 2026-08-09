import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const mualani: CharacterConfig = {
  id: "mualani",
  name: "Mualani",
  rarity: 5,
  element: "Hydro",
  weapon: "Catalyst",
  scalingSource: "hp",
  ascensionStat: { label: "CRIT Rate%", maxValue: 19.2 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("CRIT Rate%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Cooling Treatment",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Hydro" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Hydro" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Hydro" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Hydro" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Surfshark Wavebreaker",
      hits: [
        { key: "shark-bite", name: "Sharky's Bite DMG (0 Stacks)", scaling: "hp", hitCategory: "skill", element: "Hydro" },
        { key: "shark-bite-1", name: "Sharky's Bite DMG (1 Stack)", scaling: "hp", hitCategory: "skill", element: "Hydro" },
        { key: "shark-bite-2", name: "Sharky's Bite DMG (2 Stacks)", scaling: "hp", hitCategory: "skill", element: "Hydro" },
        { key: "surging-bite", name: "Sharky's Surging Bite DMG (3 Stacks)", scaling: "hp", hitCategory: "skill", element: "Hydro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Boomsharka-laka",
      hits: [
        { key: "burst-dmg", name: "Super Shark Missile DMG", scaling: "hp", hitCategory: "burst", element: "Hydro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "nightsoul-state",
      label: "Nightsoul's Blessing State (Sharky Surfboard)",
      control: "toggle",
      defaultValue: 1,
      hint: "Mualani rides Sharky Surfboard, converting Normal Attacks to Sharky's Bites scaling with Max HP."
    },
    {
      id: "wave-momentum-stacks",
      label: "Wave Momentum Stacks (0–3 Stacks)",
      control: "stacks",
      max: 3,
      defaultValue: 3,
      hint: "Making contact with enemies grants Wave Momentum. At 3 stacks, Sharky's Bite becomes Sharky's Surging Bite."
    },
    {
      id: "a1-pufferfish-stacks",
      label: "A1 Wave-Surfing's Passion Stacks (0–3 Stacks, +15% Max HP flat DMG/stack)",
      control: "stacks",
      max: 3,
      defaultValue: 3,
      hint: "A1: Retrieving Pufferfish grants stacks increasing the next Sharky's Bite / Surging Bite DMG by 15% Max HP per stack."
    },
    {
      id: "a4-nightsoul-burst-stacks",
      label: "A4 Till the Final Wave Stacks (0–2 Stacks, +15%/+30% Max HP Burst DMG)",
      control: "stacks",
      max: 2,
      defaultValue: 2,
      hint: "A4: Party members triggering Nightsoul Burst grant stacks increasing Boomsharka-laka DMG by 15% / 30% Max HP."
    },
    {
      id: "c1-surging-first-hit",
      label: "C1 The Leisurely \"Meztli\" (+66% Max HP Flat DMG to Surging Bite)",
      control: "toggle",
      defaultValue: 1,
      hint: "C1: Sharky's Surging Bite DMG is increased by 66% of Mualani's Max HP."
    },
    {
      id: "c4-burst-buff",
      label: "C4 Shark-Eating Shark (+75% Burst DMG Bonus)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Boomsharka-laka's DMG is increased by 75% DMG Bonus and retrieving Pufferfish restores 8 Energy."
    }
  ],
  mechanics: [
    "Nightsoul's Blessing: Rides Sharky Surfboard. Normal Attacks become Sharky's Bites scaling with Max HP.",
    "Wave Momentum (0–3 Stacks): Contact with enemies increases Sharky's Bite DMG. At 3 stacks, transforms into Sharky's Surging Bite.",
    "Heat-Seeking Surfshark (A1): Surging Bite spawns Pufferfish. Retrieving Pufferfish grants stacks increasing next Sharky's Bite / Surging Bite by 15% Max HP per stack (max 3 = +45% Max HP).",
    "Resistant Freshwater (A4): Nightsoul Bursts from teammates grant stacks increasing Burst DMG by 15% or 30% Max HP.",
    "The Leisurely \"Meztli\" (C1): Increases Surging Bite DMG by 66% of Max HP. Out-of-combat movement cost −75%.",
    "Shark-Eating Shark (C4): Pufferfish restores 8 Energy. Burst DMG increased by +75% DMG Bonus.",
    "Spirit of the Springs' People (C6): C1's 66% Max HP flat DMG boost applies to all Surging Bites."
  ],
  constellations: [
    {
      level: 1,
      name: "The Leisurely \"Meztli\"",
      description: "The DMG of the first Sharky's Surging Bite after entering Nightsoul's Blessing is increased by 66% of Mualani's Max HP. Out of combat Nightsoul/Phlogiston consumption is reduced by 75%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Mualani, Going All Out!",
      description: "Entering Nightsoul's Blessing grants 2 stacks of Wave Momentum. Retrieving a Pufferfish grants 2 stacks of Wave Momentum.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Same Style of Surfboard on Sale!",
      description: "Increases the Level of Surfshark Wavebreaker by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Shark-Eating Shark",
      description: "Retrieving a Pufferfish restores 8 Energy to Mualani. Additionally, Boomsharka-laka's DMG is increased by 75%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Same Old Wave-Rider",
      description: "Increases the Level of Boomsharka-laka by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Spirit of the Springs' People",
      description: "The DMG boost from the Constellation \"The Leisurely 'Meztli'\" is no longer restricted to triggering once per Nightsoul's Blessing state.",
      effects: [{ type: "informational" }]
    }
  ]
};
