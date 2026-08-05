import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const itto: CharacterConfig = {
  id: "itto",
  name: "Arataki Itto",
  rarity: 5,
  element: "Geo",
  weapon: "Claymore",
  scalingSource: "def",
  ascensionStat: { label: "CRIT Rate%", maxValue: 24.2 },
  dmgBonusLabel: "Geo DMG Bonus%",
  stats: coreStats("CRIT Rate%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Fight Club Legend",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "kesagiri-combo", name: "Arataki Kesagiri Combo Slash DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "kesagiri-final", name: "Arataki Kesagiri Final Slash DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "saichimonji", name: "Saichimonji Slash DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Masatsu Zetsugi: Akaushi Burst!",
      hits: [
        { key: "skill-dmg", name: "Ushi Skill DMG", scaling: "atk", hitCategory: "skill", element: "Geo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Royal Descent: Behold, Itto the Evil!",
      hits: [
        { key: "def-to-atk", name: "ATK Bonus (% of DEF)", scaling: "def", hitCategory: "burst", kind: "buff" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "burst-oni-king",
      label: "Raging Oni King State (DEF to ATK Conversion & Geo Infusion)",
      control: "toggle",
      defaultValue: 1,
      hint: "Raging Oni King converts DEF into ATK, infuses Normal, Charged, and Plunging attacks with Geo, and grants +10% NA SPD."
    },
    {
      id: "a1-kesagiri-spd",
      label: "A1 Arataki Ichiban Kesagiri ATK SPD (+10%–30%)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Consecutive Arataki Kesagiri slashes gain +10% ATK SPD per slash (max +30%)."
    },
    {
      id: "c4-party-buff",
      label: "C4 Jailhouse Bread and Butter (+20% DEF & +20% ATK)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: When Raging Oni King ends, all nearby party members gain +20% DEF and +20% ATK for 10s."
    }
  ],
  mechanics: [
    "Raging Oni King: Converts DEF into ATK, infuses Normal, Charged, and Plunging attacks with non-overrideable Geo DMG, and grants +10% NA SPD.",
    "Bloodline of the Crimson Oni (A4): Arataki Kesagiri slash DMG is increased by 35% of Itto's DEF.",
    "Arataki Ichiban (A1): Consecutive Kesagiri slashes gain +10% ATK SPD per slash (up to +30%) and interruption resistance.",
    "Arataki Itto, Present! (C6): Arataki Kesagiri Charged Attacks gain +70% CRIT DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "Stay a While and Listen Up",
      description: "After using Royal Descent: Behold, Itto the Evil!, Itto gains 1 stack of Superlative Superstrength. After 1s, he gains 1 stack every 0.5s for 1.5s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Gather 'Round, It's a Brawl!",
      description: "After using Royal Descent: Behold, Itto the Evil!, each Geo party member decreases its CD by 1.5s and restores 6 Energy to Itto (max 4.5s CD reduction & 18 Energy).",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Horns Lowered, Coming Through",
      description: "Increases the Level of Masatsu Zetsugi: Akaushi Burst! by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Jailhouse Bread and Butter",
      description: "When the Raging Oni King state applied by Royal Descent: Behold, Itto the Evil! ends, all nearby party members gain 20% DEF and 20% ATK for 10s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "10 Years of Hanamizaka Fame",
      description: "Increases the Level of Royal Descent: Behold, Itto the Evil! by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Arataki Itto, Present!",
      description: "Arataki Itto's Charged Attacks deal +70% CRIT DMG. Additionally, when he uses Arataki Kesagiri, he has a 50% chance to not consume stacks of Superlative Superstrength.",
      effects: [{ type: "informational" }]
    }
  ]
};
