import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const durin: CharacterConfig = {
  id: "durin",
  name: "Durin",
  rarity: 5,
  element: "Pyro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Radiant Wingslash",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Binary Form: Convergence and Division",
      hits: [
        { key: "purity-skill-dmg", name: "Transmutation: Confirmation of Purity DMG", scaling: "atk", hitCategory: "skill" },
        { key: "darkness-skill-1", name: "Transmutation: Denial of Darkness strike 1", scaling: "atk", hitCategory: "skill" },
        { key: "darkness-skill-2", name: "Transmutation: Denial of Darkness strike 2", scaling: "atk", hitCategory: "skill" },
        { key: "darkness-skill-3", name: "Transmutation: Denial of Darkness strike 3", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Principles of Purity & Darkness",
      hits: [
        { key: "purity-burst-1", name: "Principle of Purity: As the Light Shifts strike 1", scaling: "atk", hitCategory: "burst" },
        { key: "purity-burst-2", name: "Principle of Purity: As the Light Shifts strike 2", scaling: "atk", hitCategory: "burst" },
        { key: "purity-burst-3", name: "Principle of Purity: As the Light Shifts strike 3", scaling: "atk", hitCategory: "burst" },
        { key: "white-flame-dmg", name: "Dragon of White Flame DMG", scaling: "atk", hitCategory: "burst" },
        { key: "darkness-burst-1", name: "Principle of Darkness: As the Stars Smolder strike 1", scaling: "atk", hitCategory: "burst" },
        { key: "darkness-burst-2", name: "Principle of Darkness: As the Stars Smolder strike 2", scaling: "atk", hitCategory: "burst" },
        { key: "darkness-burst-3", name: "Principle of Darkness: As the Stars Smolder strike 3", scaling: "atk", hitCategory: "burst" },
        { key: "dark-decay-dmg", name: "Dragon of Dark Decay DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "purity-form",
      label: "Purity Form (White State)",
      control: "toggle",
      defaultValue: 1,
      hint: "Enables Support capabilities and AoE Pyro DMG."
    },
    {
      id: "darkness-form",
      label: "Darkness Form (Dark State)",
      control: "toggle",
      defaultValue: 0,
      hint: "Enables carry mode, boosting Vaporize and Melt reaction damage."
    },
    {
      id: "purity-res-shred",
      label: "Purity Form RES Shred",
      control: "toggle",
      defaultValue: 0,
      hint: "A1: Shreds enemy RES by 20% (35% with a Hexerei partner) in Purity Form."
    },
    {
      id: "hexerei-party-members",
      label: "Hexerei Party Member Present",
      control: "toggle",
      defaultValue: 0,
      hint: "Activates Hexerei team passive to enhance Durin's A1 buffs."
    },
    {
      id: "a4-primordial-fusion",
      label: "A4 Primordial Fusion (Summon DMG Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Periodic Dragon summon DMG increased by 3% of original DMG for every 100 ATK (up to 75%)."
    },
    {
      id: "c1-cycle-of-enlightenment",
      label: "C1 Cycle of Enlightenment",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Adds flat DMG equal to 60% of Durin's ATK to his hits."
    },
    {
      id: "c2-pyro-dmg-bonus",
      label: "C2 Reaction Pyro DMG Bonus",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: Increases Pyro DMG Bonus by 50% for 6s after triggering Pyro-related reactions."
    },
    {
      id: "c6-def-shred",
      label: "C6 Burst DEF Shred",
      control: "toggle",
      defaultValue: 0,
      hint: "C6: White Flame hits decrease enemy DEF by 30% for 6s."
    }
  ],
  mechanics: [
    "Light Manifest of the Divine Calculus (A1): Purity Form RES shred by 20% (35% if Hexerei active). Darkness Form Vaporize/Melt DMG Bonus +40% (+70% if Hexerei active).",
    "Chaos Formed Like the Night (A4): Summon DMG increased by 3% of original DMG per 100 ATK (up to 75%).",
    "Adamah's Redemption (C1): Enlightenment stacks add flat DMG of 60% ATK.",
    "Unground Visions (C2): Reaction triggers grant +50% Pyro DMG Bonus.",
    "Emanare's Source (C4): Burst hits gain +40% DMG Bonus.",
    "Dual Birth (C6): Burst hits ignore 30% DEF (Dark Decay ignores 70%). White Flame hits decrease enemy DEF by 30%."
  ],
  constellations: [
    {
      level: 1,
      name: "Adamah's Redemption",
      description: "Cycle of Enlightenment stacks increase DMG by 60% of Durin's ATK.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Unground Visions",
      description: "Triggering Pyro reactions after Burst increases Pyro DMG by 50%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Tale-Weaver's Authority",
      description: "Increases the Level of Elemental Burst by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Emanare's Source",
      description: "Burst hits gain +40% DMG Bonus.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Convergence Matrix",
      description: "Increases the Level of Elemental Skill by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "Dual Birth",
      description: "Burst hits ignore 30% DEF (Dark Decay ignores 70%). White Flame hits decrease enemy DEF by 30%.",
      effects: [{ type: "informational" }]
    }
  ]
};
