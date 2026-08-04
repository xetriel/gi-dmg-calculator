import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const cyno: CharacterConfig = {
  id: "cyno",
  name: "Cyno",
  rarity: 5,
  element: "Electro",
  weapon: "Polearm",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Electro DMG Bonus%",
  stats: coreStats("Electro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Invoker's Spear",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit (2 Hits)"),
        atk("5-hit", "5-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Secret Rite: Chasmic Soulfarer",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill" },
        { key: "mortuary-rite", name: "Mortuary Rite DMG", scaling: "atk", hitCategory: "skill" },
        { key: "duststalker-bolt", name: "Duststalker Bolt DMG", scaling: "atk", hitCategory: "skill" },
        { key: "duststalker-bolt-stellar", name: "Duststalker Bolt (Revelation / Direct Reaction)", scaling: "atk", direct: "stellar", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Sacred Rite: Wolf's Swiftness",
      hits: [
        { key: "pactsworn-1", name: "Pactsworn 1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Electro" },
        { key: "pactsworn-2", name: "Pactsworn 2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Electro" },
        { key: "pactsworn-3", name: "Pactsworn 3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Electro" },
        { key: "pactsworn-4", name: "Pactsworn 4-Hit DMG (2 Hits)", scaling: "atk", hitCategory: "normal", element: "Electro" },
        { key: "pactsworn-5", name: "Pactsworn 5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Electro" },
        { key: "pactsworn-charged", name: "Pactsworn Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Electro" },
        { key: "pactsworn-plunge", name: "Pactsworn Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Electro" },
        { key: "pactsworn-low-plunge", name: "Pactsworn Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Electro" },
        { key: "pactsworn-high-plunge", name: "Pactsworn High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Electro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "pactsworn-state",
      label: "Pactsworn Pathclearer State (Burst & +100 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "Enters Pactsworn Pathclearer state, converting attacks to Electro DMG and granting +100 EM."
    },
    {
      id: "judication-buff",
      label: "A1 Judication Endseer Stance (+35% Mortuary Rite DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Using Skill during Endseer stance increases Mortuary Rite DMG by 35% and fires 3 Duststalker Bolts."
    },
    {
      id: "revelation-buff",
      label: "Revelation Buff (Stellar-Conduct Direct Reaction)",
      control: "toggle",
      defaultValue: 0,
      hint: "Enables Stellar-Conduct direct reaction calculations for Duststalker Bolts."
    },
    {
      id: "c2-stacks",
      label: "C2 Ceremony Electro DMG Bonus Stacks",
      control: "stacks",
      max: 5,
      defaultValue: 0,
      hint: "C2: Normal Attacks hitting opponents increase Electro DMG Bonus by 10% for 4s (max 5 stacks = +50%)."
    }
  ],
  mechanics: [
    "Featherfall Judgment (A1): Grants +100 EM during Pactsworn state. Judication stance increases Mortuary Rite DMG by 35% and fires 3 Duststalker Bolts.",
    "Authority Over the Nine Bows (A4): Pactsworn Normal Attack DMG +150% EM as Flat DMG, Duststalker Bolt DMG +250% EM as Flat DMG.",
    "Ordinance: Unceasing Vigil (C1): +20% Normal Attack SPD after Burst cast.",
    "Ceremony: Homecoming of Spirits (C2): Normal Attack hits grant +10% Electro DMG Bonus per stack (max 5 stacks = +50%).",
    "Austerity: Forbidding Guard (C4): Electro reactions during Burst restore 3 Energy.",
    "Raiment: Just Scales (C6): Burst cast or Judication grants 4 Day of the Jackal stacks to fire extra Duststalker Bolts."
  ],
  constellations: [
    {
      level: 1,
      name: "Ordinance: Unceasing Vigil",
      description: "After using Sacred Rite: Wolf's Swiftness, Cyno's Normal Attack SPD is increased by 20% for 10s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Ceremony: Homecoming of Spirits",
      description: "When Cyno's Normal Attacks hit opponents, his Electro DMG Bonus increases by 10% for 4s. Max 5 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Precept: Lawful Enforcer",
      description: "Increases the Level of Sacred Rite: Wolf's Swiftness by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Austerity: Forbidding Guard",
      description: "When Cyno is in the Pactsworn Pathclearer state, triggering Electro-related reactions restores 3 Energy to Cyno.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Funerary Rite: The Passing of Starlight",
      description: "Increases the Level of Secret Rite: Chasmic Soulfarer by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "Raiment: Just Scales",
      description: "After using Burst or triggering Judication, Cyno gains 4 stacks of Day of the Jackal to fire off Duststalker Bolts.",
      effects: [{ type: "informational" }]
    }
  ]
};
