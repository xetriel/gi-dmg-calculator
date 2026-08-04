import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const dehya: CharacterConfig = {
  id: "dehya",
  name: "Dehya",
  rarity: 5,
  element: "Pyro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "HP%", maxValue: 28.8 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Sandstorm Assault",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit"),
        atkCharged("charged-spin", "Charged Attack Spinning DMG"),
        atkCharged("charged-final", "Charged Attack Final DMG"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Molten Inferno",
      hits: [
        { key: "indomitable-flame", name: "Indomitable Flame DMG", scaling: "atk", hitCategory: "skill" },
        { key: "ranging-flame", name: "Ranging Flame DMG", scaling: "atk", hitCategory: "skill" },
        { key: "field-dmg", name: "Fiery Sanctum Field DMG", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Leonine Bite",
      hits: [
        { key: "flame-manes-fist", name: "Flame-Mane's Fist DMG", scaling: "atk", hitCategory: "burst" },
        { key: "incineration-drive", name: "Incineration Drive DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "c1-hp-buff",
      label: "C1 The Flame Incandescent (+20% Max HP & HP Flat DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Increases Max HP by 20%. Skill DMG increased by 3.6% Max HP, Burst DMG increased by 6.0% Max HP."
    },
    {
      id: "c2-field-buff",
      label: "C2 Fiery Sanctum Field Coordinated Attack DMG (+50%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: Ranging Flame extends Fiery Sanctum duration by 6s and increases next Coordinated Attack DMG by 50%."
    },
    {
      id: "c6-crit-stacks",
      label: "C6 Leonine Bite Punch CRIT Stacks",
      control: "stacks",
      max: 4,
      defaultValue: 0,
      hint: "C6: Burst CRIT Rate +10%. Punch CRIT hits increase Burst CRIT DMG by 15% per stack (max 4 stacks = +60% CRIT DMG)."
    }
  ],
  mechanics: [
    "Unstoppable Stampede (A1): Taking Redmane's Blood DMG takes 60% less DMG after retrieving Fiery Sanctum.",
    "Stalwart's Integrity (A4): HP < 40% triggers 20% instant HP recovery + 6% HP recovery every 2s for 10s.",
    "The Flame Incandescent (C1): +20% Max HP. Skill DMG +3.6% Max HP, Burst DMG +6.0% Max HP.",
    "The Sand-Blades Glittering (C2): Field duration +6s. Coordinated Field Attack DMG +50%.",
    "An Oath Abiding (C4): Burst hits restore 1.5 Energy and 2.5% Max HP.",
    "The Burning Claws Cleaving (C6): Burst CRIT Rate +10%. Punch CRITs add up to +60% Burst CRIT DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "The Flame Incandescent",
      description: "Dehya's Max HP is increased by 20%. Skill DMG increased by 3.6% of Max HP, Burst DMG increased by 6.0% of Max HP.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "The Sand-Blades Glittering",
      description: "When Ranging Flame is used, Fiery Sanctum field duration is extended by 6s and next Coordinated Attack DMG is increased by 50%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "A Rage Swift as Fire",
      description: "Increases the Level of Leonine Bite by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "An Oath Abiding",
      description: "Flame-Mane's Fist and Incineration Drive hits restore 1.5 Energy and 2.5% Max HP for Dehya.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "The Alpha Unleashed",
      description: "Increases the Level of Molten Inferno by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "The Burning Claws Cleaving",
      description: "CRIT Rate of Leonine Bite is increased by 10%. Flame-Mane's Fist CRIT hits increase Burst CRIT DMG by 15% (max 4 stacks = +60% CRIT DMG).",
      effects: [{ type: "informational" }]
    }
  ]
};
