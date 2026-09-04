import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const ayaka: CharacterConfig = {
  id: "ayaka",
  name: "Kamisato Ayaka",
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
      name: "Normal Attack — Kamisato Art: Kabuki",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        { key: "4-hit", name: "4-Hit DMG (x3)", scaling: "atk", hitCategory: "normal" },
        atk("5-hit", "5-Hit"),
        { key: "charged", name: "Charged Attack DMG (x3)", scaling: "atk", hitCategory: "charged" },
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Kamisato Art: Hyouka",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Kamisato Art: Soumetsu",
      hits: [
        { key: "cutting-dmg", name: "Cutting DMG (x19)", scaling: "atk", hitCategory: "burst" },
        { key: "bloom-dmg", name: "Bloom DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "cryo-infusion",
      label: "Cryo Infusion (Kamisato Art: Senho)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal, Charged, and Plunging Attacks into Cryo DMG."
    },
    {
      id: "a1-skill-dmg-buff",
      label: "A1 Skill Activation DMG Buff",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Using Elemental Skill increases Normal and Charged Attack DMG by 30% for 6s."
    },
    {
      id: "senho-cryo-bonus",
      label: "Sprint Senho Cryo DMG Bonus (+18%)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Senho Cryo application hitting an enemy grants +18% Cryo DMG Bonus."
    },
    {
      id: "c4-def-shred",
      label: "C4 Burst DEF Shred (-30% Enemy DEF)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Opponents hit by Burst have their DEF reduced by 30% for 6s."
    },
    {
      id: "c6-charged-buff",
      label: "C6 Usurahi Butou Charged Attack Buff",
      control: "toggle",
      defaultValue: 0,
      hint: "C6: Increases Charged Attack DMG by 298% every 10s."
    }
  ],
  mechanics: [
    "Amatsumi Kunitsumi Ihahito (A1): Skill cast increases NA/CA DMG by 30% for 6s.",
    "Kanten Senmyou Blessing (A4): Sprinting on enemy grants +18% Cryo DMG Bonus.",
    "Ebb and Flow (C4): Burst hits reduce enemy DEF by 30%.",
    "Dance of Suigetsu (C6): Usurahi Butou increases CA DMG by 298%."
  ],
  constellations: [
    {
      level: 1,
      name: "Cherry Blossom Shidare",
      description: "Normal/Charged Attack hits have a 50% chance to reduce Skill CD.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Blizzard Blade Seki",
      description: "Soumetsu unleashes 2 smaller extra Frostflake Seki no To, each dealing 20% DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Frostbloom Kamifubuki",
      description: "Increases the Level of Elemental Burst by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Ebb and Flow",
      description: "Frostflake Seki no To hits decrease opponent DEF by 30% for 6s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Blossom Cloud Irutsutsu",
      description: "Increases the Level of Elemental Skill by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "Dance of Suigetsu",
      description: "Every 10s, Ayaka gains a Charged Attack buff, increasing its DMG by 298%.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Cryo DPS capable of supporting the team at C4 with powerful 30% enemy DEF reduction upon Burst hits.",
    buffExplanations: [
      {
        name: "C4: Ebb and Flow",
        brief: "-30% Enemy DEF Shred",
        full: "Opponents damaged by Kamisato Art: Soumetsu's Frostflake Seki no To have their DEF decreased by 30% for 6s.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "800" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "200" },
    ],
    buffs: [
      {
        stat: "defReduction",
        label: "Enemy DEF Shred (Ayaka C4)",
        compute: (ctx) => (ctx.constellationLevel >= 4 ? 30 : 0),
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Base ATK", value: fmt(ctx.baseAtk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
