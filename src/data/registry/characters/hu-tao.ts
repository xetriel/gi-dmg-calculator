import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk } from "./hit-helpers";

// Hits scale on ATK; her skill converts Max HP into bonus ATK, so enter the
// in-Paramita total ATK. (scalingSource stays "hp" as the conceptual source.)
export const huTao: CharacterConfig = {
  id: "hu-tao", name: "Hu Tao", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("4-hit", "4-Hit"), atk("5-hit", "5-Hit"), atk("6-hit", "6-Hit"),
      atk("charged", "Charged Attack"), atk("plunge", "Plunge"),
      atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Blood Blossom", hits: [atk("blood-blossom", "Blood Blossom")] },
    { type: "burst", name: "Elemental Burst — Spirit Soother", hits: [
      atk("skill-dmg", "Skill DMG"), atk("low-hp-skill-dmg", "Low-HP Skill DMG"),
    ] },
  ],
  panels: ["Party panel (Xianyun / Furina / Yelan)","Signature Weapon + Refinement","HP ≤ 50% Paramita state toggle"],
  wikiTalents: [
    {
      name: "Secret Spear of Wangsheng",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 6 rapid spear strikes. Charged Attack: Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the path. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact."
    },
    {
      name: "Guide to Afterlife",
      type: "Elemental Skill",
      description: "Hu Tao consumes a set portion of her HP to knock the surrounding enemies back and enter the Paramita Papilio state. Paramita Papilio: Increases Hu Tao's ATK based on her Max HP at the time of entering this state. ATK Bonus gained this way cannot exceed 400% of Hu Tao's Base ATK. Converts Attack DMG to Pyro DMG, which cannot be overridden by any other elemental infusion. Charged Attacks apply the Blood Blossom effect to enemies hit. Increases Hu Tao's resistance to interruption. Blood Blossom: Enemies affected by Blood Blossom will take Pyro DMG every 4s. This DMG is considered Elemental Skill DMG. Each enemy can be affected by only one Blood Blossom effect at a time, and its duration may only be refreshed by Hu Tao herself."
    },
    {
      name: "Spirit Soother",
      type: "Elemental Burst",
      description: "Commands a blazing spirit to attack, dealing Pyro DMG in a large AoE. Upon striking enemies, regenerates a percentage of Hu Tao's Max HP. This effect can be triggered up to 5 times, based on the number of enemies hit. If Hu Tao's HP is equal to or less than 50% when the skill hits, both the DMG and HP Regeneration are increased."
    },
    {
      name: "Flutter By",
      type: "Passive Talent",
      description: "When a Paramita Papilio state activated by Guide to Afterlife ends, all allies in the party (excluding Hu Tao herself) will have their CRIT Rate increased by 12% for 8s."
    },
    {
      name: "Sanguine Rouge",
      type: "Passive Talent",
      description: "When Hu Tao's HP is equal to or less than 50%, her Pyro DMG Bonus is increased by 33%."
    },
    {
      name: "The More the Merrier",
      type: "Passive Talent",
      description: "When Hu Tao cooks a dish perfectly, she has a 18% chance to receive an additional 'Suspicious' dish of the same type."
    }
  ],
  constellations: [
    {
      level: 1, name: "Crimson Bouquet",
      description: "While in Paramita Papilio state, Hu Tao's Charged Attacks do not consume Stamina.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Ominous Rainfall",
      description: "Increases Blood Blossom DMG by 10% of Hu Tao's Max HP. Spirit Soother also applies Blood Blossom.",
      effects: [{
        type: "flat_dmg_bonus",
        affectedHitKeys: ["blood-blossom"],
        bonusScaling: "hp",
        bonusPercent: 10,
      }]
    },
    {
      level: 3, name: "Lingering Carmine",
      description: "Increases the Level of Guide to Afterlife by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "Garden of Eternal Rest",
      description: "Upon defeating an enemy affected by Blood Blossom, all nearby allies' CRIT Rate +12% for 15s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Floral Incense",
      description: "Increases the Level of Spirit Soother by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Butterfly's Embrace",
      description: "When HP drops below 25%: CRIT Rate +100%, Elemental & Physical RES +200% for 10s. 60s cooldown.",
      effects: [{
        type: "stat_bonus",
        statKey: "critRate",
        statValue: 100,
        condition: "HP < 25%"
      }]
    },
  ]
};
