import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const skirk: CharacterConfig = {
  id: "skirk",
  name: "Skirk",
  rarity: 5,
  element: "Cryo",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("Cryo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Havoc: Sunder",
      hits: [
        atk("1-hit", "1-Hit (Physical)"),
        atk("2-hit", "2-Hit (Physical)"),
        atk("3-hit-a", "3-Hit A (Physical)"),
        atk("3-hit-b", "3-Hit B (Physical)"),
        atk("4-hit", "4-Hit (Physical)"),
        atk("5-hit", "5-Hit (Physical)"),
        atkCharged("charged-a", "Charged Attack A (Physical)"),
        atkCharged("charged-b", "Charged Attack B (Physical)"),
        atkPlunge("plunge", "Plunge (Physical)"),
        atkPlunge("low-plunge", "Low Plunge (Physical)"),
        atkPlunge("high-plunge", "High Plunge (Physical)"),
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Havoc: Warp",
      hits: [
        { key: "sf-1-hit", name: "Seven-Phase Flash 1-Hit (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "sf-2-hit", name: "Seven-Phase Flash 2-Hit (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "sf-3-hit-a", name: "Seven-Phase Flash 3-Hit A (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "sf-3-hit-b", name: "Seven-Phase Flash 3-Hit B (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "sf-4-hit-a", name: "Seven-Phase Flash 4-Hit A (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "sf-4-hit-b", name: "Seven-Phase Flash 4-Hit B (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "sf-5-hit", name: "Seven-Phase Flash 5-Hit (Cryo)", scaling: "atk", hitCategory: "normal" },
        { key: "c1-blade", name: "C1 Crystal Blade DMG (Cryo)", scaling: "atk", hitCategory: "charged" },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Havoc: Ruin",
      hits: [
        { key: "slash-dmg", name: "Ruin Slashes (Cryo x5)", scaling: "atk", hitCategory: "burst" },
        { key: "final-dmg", name: "Ruin Final Slash (Cryo)", scaling: "atk", hitCategory: "burst" },
        { key: "sever-dmg", name: "C6 Sever DMG (Cryo, per stack)", scaling: "atk", hitCategory: "burst" },
      ],
    },
  ],
  mechanics: [
    "Under Seven-Phase Flash, Normal Attacks scale with Elemental Skill level and deal Cryo DMG.",
    "Mutual Weapons Mentorship (Utility Passive): Increases Elemental Skill Level by +1 when all party members are Hydro/Cryo and at least 1 of each is present.",
    "Return to Oblivion: Each Death's Crossing stack increases Seven-Phase Flash NA DMG (1.1x / 1.2x / 1.7x) and Burst DMG (1.05x / 1.15x / 1.6x). C4 adds +10%/+20%/+40% ATK.",
    "Serpent's Subtlety: Each point above 50 (up to 12 points, or 22 with C2) adds +34.782% ATK flat DMG to Burst slashes and final slash.",
    "All Shall Wither (Havoc: Extinction): Enhances Seven-Phase Flash Normal Attacks by +40% DMG Bonus, plus +8%/12%/16%/20% based on Void Rifts absorbed.",
    "C2 Into the Abyss: Burst accounts for 10 more Subtlety points. Using Havoc: Extinction grants +70% ATK for 12.5s.",
    "C1 Far to Fall: Absorbing a Void Rift deals 500% ATK Cryo DMG (Charged Attack DMG).",
    "C6 To the Source: Consuming Sever stacks deals 750% ATK Cryo DMG per stack (Elemental Burst DMG)."
  ],
  mechanicDefs: [
    {
      id: "mutual-weapons-mentorship",
      label: "Mutual Weapons Mentorship active (all party Hydro/Cryo, min 1 each)",
      control: "toggle",
      defaultValue: 1,
      hint: "Utility Passive: +1 Elemental Skill Level."
    },
    {
      id: "deaths-crossing-stacks",
      label: "Death's Crossing stacks (Return to Oblivion)",
      control: "stacks",
      max: 3,
      defaultValue: 3,
      hint: "Triggered by teammates. NA DMG ×1.1/1.2/1.7; Burst DMG ×1.05/1.15/1.6. C4: +10%/20%/40% ATK."
    },
    {
      id: "subtlety-bonus",
      label: "Serpent's Subtlety points above 50",
      control: "stacks",
      max: 22,
      defaultValue: 12,
      hint: "Each point adds 34.782% ATK flat DMG to Burst. Capped at 12 without C2, and 22 with C2."
    },
    {
      id: "all-shall-wither",
      label: "All Shall Wither buff (Havoc: Extinction)",
      control: "toggle",
      defaultValue: 1,
      hint: "Burst buff: +40% Normal ATK DMG Bonus."
    },
    {
      id: "wither-rifts",
      label: "Void Rifts absorbed during Havoc: Extinction",
      control: "stacks",
      max: 4,
      defaultValue: 4,
      hint: "Adds +8%/12%/16%/20% Normal ATK DMG Bonus to the All Shall Wither buff."
    },
    {
      id: "c2-burst-atk-buff",
      label: "C2 ATK buff active (after Havoc: Extinction)",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: +70% ATK for 12.5s after casting the special burst."
    },
    {
      id: "c6-sever-stacks",
      label: "C6 Havoc: Sever stacks (consumed on Burst)",
      control: "stacks",
      max: 6,
      defaultValue: 0,
      hint: "C6: deals 750% ATK Cryo DMG per stack consumed."
    }
  ],
  wikiTalents: [
    {
      name: "Havoc: Sunder",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 5 rapid strikes. Charged Attack: Hurling a spinning crystal spear. Plunging Attack: standard plunging."
    },
    {
      name: "Havoc: Warp",
      type: "Elemental Skill",
      description: "Tap: Enters Seven-Phase Flash mode, infusing attacks with Cryo, using Skill-level scaling. Hold: High-speed movement, travels over water, absorbs Void Rifts to gain Serpent's Subtlety."
    },
    {
      name: "Havoc: Ruin",
      type: "Elemental Burst",
      description: "Consumes Serpent's Subtlety points to deal rapid AoE Cryo slashes. If cast in Seven-Phase Flash mode, replaced by Havoc: Extinction, which does not consume Subtlety and grants the All Shall Wither buff."
    },
    {
      name: "Reason Beyond Reason",
      type: "1st Ascension Passive",
      description: "Teammate Cryo/Hydro reactions generate Void Rifts; absorbing one restores 8 Serpent's Subtlety."
    },
    {
      name: "Return to Oblivion",
      type: "4th Ascension Passive",
      description: "Teammates hitting Hydro/Cryo attacks grants Death's Crossing stacks (max 3), boosting Seven-Phase Flash NA DMG to 110%/120%/170% and Burst DMG to 105%/115%/160%."
    },
    {
      name: "Mutual Weapons Mentorship",
      type: "Utility Passive",
      description: "When all party members are either Hydro or Cryo (and at least 1 Hydro and 1 Cryo character in team), increases all party members' Elemental Skill Level by 1."
    }
  ],
  constellations: [
    {
      level: 1,
      name: "Far to Fall",
      description: "Every Void Rift absorbed summons a crystal blade dealing 500% ATK Cryo DMG (Charged Attack DMG).",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Into the Abyss",
      description: "Using Skill grants +10 Subtlety. Burst accounts for 10 more Subtlety points (up to 22). Casting Havoc: Extinction increases ATK by 70% for 12.5s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Serendipitous Sin",
      description: "Increases the Level of Havoc: Ruin by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Fractured Flow",
      description: "Return to Oblivion's Death's Crossing stacks increase ATK by 10%/20%/40% respectively.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "End of Wishes",
      description: "Increases the Level of Havoc: Warp by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "To the Source",
      description: "Each Void Rift absorbed grants one stack of Havoc: Sever. When using Burst, consumes all stacks to deal 750% ATK Cryo DMG per stack.",
      effects: [{ type: "informational" }]
    }
  ]
};
