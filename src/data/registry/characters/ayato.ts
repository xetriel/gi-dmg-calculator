import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const ayato: CharacterConfig = {
  id: "ayato",
  name: "Kamisato Ayato",
  rarity: 5,
  element: "Hydro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("Hydro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Kamisato Art: Marobashi",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        { key: "4-hit", name: "4-Hit DMG (x2)", scaling: "atk", hitCategory: "normal" },
        atk("5-hit", "5-Hit"),
        atkCharged("charged", "Charged Attack DMG"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Kamisato Art: Kyouka",
      hits: [
        { key: "shunsuiken-1", name: "Shunsuiken 1-Hit DMG", scaling: "atk", hitCategory: "normal" },
        { key: "shunsuiken-2", name: "Shunsuiken 2-Hit DMG", scaling: "atk", hitCategory: "normal" },
        { key: "shunsuiken-3", name: "Shunsuiken 3-Hit DMG", scaling: "atk", hitCategory: "normal" },
        { key: "water-illusion", name: "Water Illusion DMG", scaling: "atk", hitCategory: "skill" },
        { key: "c6-extra-strike", name: "C6 Extra Strike DMG (x2)", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Kamisato Art: Suiyuu",
      hits: [
        { key: "bloomwater-blade", name: "Bloomwater Blade DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "namisen-stacks",
      label: "Namisen Stacks",
      control: "stacks",
      max: 4,
      defaultValue: 4,
      hint: "Shunsuiken attacks gain extra DMG based on Max HP per stack. Max stacks is 4 (5 at C2)."
    },
    {
      id: "c1-low-hp-buff",
      label: "C1 Opponent HP ≤ 50% Shunsuiken DMG (+40%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Shunsuiken DMG increased by 40% against opponents with 50% HP or less."
    },
    {
      id: "c2-hp-buff",
      label: "C2 Max HP Increase (+50%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: Increases max Namisen stacks to 5. Ayato's Max HP is increased by 50% when he has 3+ stacks."
    },
    {
      id: "burst-na-buff",
      label: "Suiyuu Field NA DMG Bonus",
      control: "toggle",
      defaultValue: 1,
      hint: "Elemental Burst field increases Normal Attack DMG of characters inside."
    },
    {
      id: "c4-na-spd",
      label: "C4 Post-Burst NA Speed (+15%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Using Burst increases NA Speed of party members by 15% for 15s."
    }
  ],
  mechanics: [
    "Mine Wo Matoishi Kiyotaki (A1): Skill cast grants 2 Namisen stacks; Water Illusion explosion grants max stacks.",
    "Michiyuku Hagetsu (A4): Regenerates 2 Energy per second off-field if Energy is below 40.",
    "Kyouka Fushi (C1): Shunsuiken DMG increased by 40% against opponents with <= 50% HP.",
    "World Source (C2): Max Namisen stacks becomes 5. Grants +50% Max HP when holding 3+ stacks.",
    "Endless Flow (C4): Using Burst increases party NA Speed by 15% for 15s.",
    "Boundless Origin (C6): Skill cast causes next Shunsuiken to trigger 2 extra 450% ATK strikes."
  ],
  constellations: [
    {
      level: 1,
      name: "Kyouka Fushi",
      description: "Shunsuiken DMG is increased by 40% against opponents with 50% HP or less.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "World Source",
      description: "Namisen's maximum stack count is increased to 5. When Ayato has at least 3 Namisen stacks, his Max HP is increased by 50%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "To Rise Who Knows",
      description: "Increases the Level of Kamisato Art: Kyouka by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Endless Flow",
      description: "After using Kamisato Art: Suiyuu, all nearby party members gain 15% increased Normal Attack SPD for 15s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "To Soukai Boundless",
      description: "Increases the Level of Kamisato Art: Suiyuu by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Boundless Origin",
      description: "After using Kamisato Art: Kyouka, Ayato's next Shunsuiken attack will create 2 extra Shunsuiken strikes, each dealing 450% of Ayato's ATK as DMG.",
      effects: [{ type: "informational" }]
    }
  ]
};
