import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge, lunarAtk } from "./hit-helpers";

export const ineffa: CharacterConfig = {
  id: "ineffa", name: "Ineffa", rarity: 5,
  element: "Electro", weapon: "Polearm", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Electro DMG Bonus%",
  stats: coreStats("Electro DMG Bonus%"),
  talents: [
    {
      type: "normal", name: "Normal Attack — Cyclonic Duster", hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit ×2 (each)"),
        atk("4-hit", "4-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill", name: "Elemental Skill — Cleaning Mode: Carrier Frequency", hits: [
        atk("skill-dmg", "Skill DMG"),
        { key: "shield", name: "Shield DMG Absorption", scaling: "atk", kind: "shield" },
        atk("discharge", "Birgitta Discharge DMG"),
        lunarAtk("a1-extra", "A1 Extra Lunar-Charged DMG (% ATK)"),
      ]
    },
    {
      type: "burst", name: "Elemental Burst — Supreme Instruction: Cyclonic Exterminator", hits: [
        atk("burst-dmg", "Skill DMG"),
        lunarAtk("c2-punishment-edict", "C2 Punishment Edict DMG (% ATK)"),
        lunarAtk("c6-dawning-morn", "C6 Dawning Morn DMG (% ATK)"),
      ]
    }
  ],
  mechanics: [
    "Lunar-tagged rows are Lunar-Charged reaction DMG (coefficient 3.0): they ignore DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Assemblage Hub (Moonsign Benediction): Electro-Charged becomes Lunar-Charged; +0.7% Lunar-Charged Base DMG per 100 ATK (max 14% at 2000 ATK) — applied automatically to her Lunar hits and the Indirect Lunar panel",
    "Panoramic Permutation Protocol (A4): Elemental Burst increases Ineffa and active party member's EM by 6% of Ineffa's ATK",
  ],
  mechanicDefs: [
    {
      id: "a4-burst-em-share", label: "Elemental Burst parameter permutation active (A4 EM Share)", control: "toggle", defaultValue: 1,
      hint: "Increases Ineffa and active party member's EM by 6% of Ineffa's ATK"
    },
    {
      id: "c1-carrier-flow", label: "Carrier Flow Composite (C1) active", control: "toggle", defaultValue: 1,
      hint: "Increases Lunar-Charged DMG by 2.5% for every 100 ATK Ineffa has (max 50%)"
    }
  ],
  wikiTalents: [
    {
      name: "Cyclonic Duster",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 4 consecutive spear strikes. Charged Attack: Consumes a certain amount of Stamina to perform a spinning attack. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact."
    },
    {
      name: "Cleaning Mode: Carrier Frequency",
      type: "Elemental Skill",
      description: "Ineffa engages her Enhanced Cleaning Module, dealing a single instance of AoE Electro DMG, activating her Optical Flow Shield Barrier (scales on ATK, absorbs Electro with 250% effectiveness), and summoning Birgitta. Birgitta releases discharge attacks every 2s, dealing AoE Electro DMG. Duration 20s, CD 16s."
    },
    {
      name: "Supreme Instruction: Cyclonic Exterminator",
      type: "Elemental Burst",
      description: "Ineffa shoots Birgitta into the fray, dealing AoE Electro DMG and summoning/refreshing Birgitta's field duration. CD 15s, Energy Cost 60."
    },
    {
      name: "Overclocking Circuit",
      type: "Passive Talent",
      description: "If there are thunderclouds created by Lunar-Charged reactions nearby when Birgitta unleashes Discharge attacks, she will initiate an additional attack, dealing AoE Electro DMG equal to 65% of Ineffa's ATK. This DMG is considered Lunar-Charged DMG."
    },
    {
      name: "Panoramic Permutation Protocol",
      type: "Passive Talent",
      description: "When using the Elemental Burst, all party members gain the Parameter Permutation effect: Increases Ineffa and active party member's EM by 6% of Ineffa's ATK for 20s. Snapshots Ineffa's ATK at moment of cast."
    },
    {
      name: "Assemblage Hub",
      type: "Moonsign Benediction Passive",
      description: "Converts Electro-Charged into Lunar-Charged reactions. Every 100 ATK Ineffa has increases Lunar-Charged's Base DMG by 0.7%, up to 14%. Increases Moonsign level by 1."
    },
    {
      name: "Flavor Synthesis Unit",
      type: "Utility Passive",
      description: "When Ineffa uses food, there is a 30% chance of gaining a seasoning ingredient."
    }
  ],
  constellations: [
    {
      level: 1, name: "Rectifying Processor",
      description: "When Ineffa activates her Optical Flow Shield Barrier, all nearby party members will gain the Carrier Flow Composite effect for 20s: Increases Lunar-Charged DMG by 2.5% for every 100 ATK that Ineffa has, up to a maximum of 50%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Support Cleaning Module",
      description: "After Elemental Burst hits, inflicts Punishment Edict status on one opponent: deals AoE Electro DMG equal to 300% ATK, considered Lunar-Charged DMG. Also, unleashing burst grants nearby party members Optical Flow Shield Barriers.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Enhanced Emotion Emulator",
      description: "Increases the Level of Cleaning Mode: Carrier Frequency by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "The Edictless Path",
      description: "When party members trigger Lunar-Charged reactions, recover 5 Elemental Energy. Once every 4s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Mirror's Dream Transcension",
      description: "Increases the Level of Supreme Instruction: Cyclonic Exterminator by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "A Dawning Morn for You",
      description: "When Ineffa is affected by the Carrier Flow Composite effect, she will deal AoE Electro DMG equal to 135% of her ATK after nearby thunderclouds release bursts of lightning. Considered Lunar-Charged DMG. Once every 3.5s.",
      effects: [{ type: "informational" }]
    }
  ]
};
