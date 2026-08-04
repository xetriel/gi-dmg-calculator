import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const diluc: CharacterConfig = {
  id: "diluc",
  name: "Diluc",
  rarity: 5,
  element: "Pyro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 14.2 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Tempered Sword",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit"),
        atkCharged("charged-spin", "Charged Attack Cyclic DMG"),
        atkCharged("charged-final", "Charged Attack Final DMG"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Searing Onslaught",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "skill" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "skill" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Dawn",
      hits: [
        { key: "slashing-dmg", name: "Slashing DMG", scaling: "atk", hitCategory: "burst" },
        { key: "dot-dmg", name: "Continuous DoT DMG", scaling: "atk", hitCategory: "burst" },
        { key: "explosion-dmg", name: "Explosion DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "pyro-infusion",
      label: "Pyro Infusion (Dawn)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal, Charged, and Plunging Attacks into Pyro DMG after Burst cast."
    },
    {
      id: "a4-pyro-buff",
      label: "A4 Blessing of Phoenix Pyro DMG Bonus (+20%)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Grants +20% Pyro DMG Bonus during the Pyro Infusion duration after Burst cast."
    },
    {
      id: "c1-high-hp-buff",
      label: "C1 Conviction Opponent HP > 50% (+15% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Diluc deals 15% more DMG to opponents whose HP is above 50%."
    },
    {
      id: "c2-stacks",
      label: "C2 Searing Ember Stacks",
      control: "stacks",
      max: 3,
      defaultValue: 0,
      hint: "C2: Taking DMG increases ATK by 10% and ATK Speed by 5% per stack (max 3 stacks = +30% ATK)."
    },
    {
      id: "c4-rhythm-buff",
      label: "C4 Flowing Flame Rhythm Bonus (+40% Skill DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Casting Searing Onslaught in rhythm increases the DMG of the next Skill hit by 40%."
    },
    {
      id: "c6-post-skill-buff",
      label: "C6 Flaming Sword Next 2 NA DMG (+30%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C6: After casting Skill, the next 2 Normal Attacks within 6s deal 30% increased DMG."
    }
  ],
  mechanics: [
    "Relentless (A1): Charged Attack Stamina Cost -50%, max duration +3s.",
    "Blessing of Phoenix (A4): Pyro Infusion duration +4s (total 12s) and +20% Pyro DMG Bonus.",
    "Conviction (C1): Deals 15% more DMG to opponents whose HP is > 50%.",
    "Searing Ember (C2): Taking DMG grants +10% ATK & +5% ATK SPD per stack (max 3 stacks = +30% ATK).",
    "Flowing Flame (C4): Skill combo rhythm grants +40% DMG to next Skill hit.",
    "Flaming Sword, Nemesis of the Dark (C6): Skill cast grants next 2 NAs +30% DMG & +30% ATK SPD."
  ],
  constellations: [
    {
      level: 1,
      name: "Conviction",
      description: "Diluc deals 15% more DMG to opponents whose HP is above 50%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Searing Ember",
      description: "When Diluc takes DMG, his ATK increases by 10% and his ATK SPD increases by 5% for 10s. Max 3 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Fire and Steel",
      description: "Increases the Level of Searing Onslaught by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Flowing Flame",
      description: "2s after casting Searing Onslaught, casting the next Searing Onslaught in the combo deals 40% additional DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Phoenix, Harbinger of Dawn",
      description: "Increases the Level of Dawn by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Flaming Sword, Nemesis of the Dark",
      description: "After casting Searing Onslaught, the next 2 Normal Attacks within 6s will deal 30% increased DMG and have 30% increased ATK SPD.",
      effects: [{ type: "informational" }]
    }
  ]
};
