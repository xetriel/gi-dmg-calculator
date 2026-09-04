import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const xinyan: CharacterConfig = {
  id: "xinyan",
  name: "Xinyan",
  rarity: 4,
  element: "Pyro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "ATK", maxValue: 24.0 },
  dmgBonusLabel: "Physical DMG Bonus%",
  stats: coreStats("Physical DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Dance on Fire",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-cyclic", name: "Charged Attack Cyclic DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-final", name: "Charged Attack Final DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Sweeping Fervor",
      hits: [
        { key: "swing-dmg", name: "Swing DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
        { key: "shield-lv1", name: "Shield Lv. 1 DMG Absorption", scaling: "def", hitCategory: "skill", kind: "shield", element: "Pyro" },
        { key: "shield-lv2", name: "Shield Lv. 2 DMG Absorption", scaling: "def", hitCategory: "skill", kind: "shield", element: "Pyro" },
        { key: "shield-lv3", name: "Shield Lv. 3 DMG Absorption", scaling: "def", hitCategory: "skill", kind: "shield", element: "Pyro" },
        { key: "dot-dmg", name: "Shield Lv. 3 Pyro DoT DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Riff Revolution",
      hits: [
        { key: "burst-physical", name: "Skill DMG (Physical)", scaling: "atk", hitCategory: "burst", element: "Physical" },
        { key: "burst-pyro-dot", name: "Pyro DoT DMG", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "xinyan-shield-active",
      label: "Shield Active (A4 +15% Physical DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Characters shielded by Sweeping Fervor deal 15% increased Physical DMG."
    },
    {
      id: "c1-crit-spd",
      label: "C1 Fatal Acceleration (12% ATK SPD on CRIT)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Upon scoring a CRIT hit, increases Normal & Charged Attack SPD by 12% for 5s."
    },
    {
      id: "c4-phys-shred",
      label: "C4 Wildfire Rhythm (-15% Physical RES Shred)",
      control: "toggle",
      defaultValue: 1,
      hint: "C4: Sweeping Fervor swing DMG decreases opponent Physical RES by 15% for 12s."
    },
    {
      id: "c6-charged-atk-bonus",
      label: "C6 Rockin' in a Flaming World (DEF to ATK on CA)",
      control: "toggle",
      defaultValue: 1,
      hint: "C6: Charged Attacks gain an ATK Bonus equal to 50% of Xinyan's DEF."
    }
  ],
  mechanics: [
    "The Show Goes On, Even Without an Audience... (A1): Decreases the number of opponents Sweeping Fervor must hit to trigger each level of shielding: Shield Level 2 (1 hit), Shield Level 3 (2 hits).",
    "...Now That's Rock 'N' Roll! (A4): Characters shielded by Sweeping Fervor deal 15% increased Physical DMG.",
    "Fatal Acceleration (C1): Upon scoring a CRIT Hit, increases Xinyan's Normal and Charged Attack SPD by 12% for 5s.",
    "Impromptu Opening (C2): Riff Revolution's Physical DMG has its CRIT Rate increased by 100%, and will form a shield at Shield Level 3: Rave when cast.",
    "Double-Stop (C3): Increases the Level of Sweeping Fervor by 3. Maximum upgrade level is 15.",
    "Wildfire Rhythm (C4): Sweeping Fervor's swing DMG decreases opponent's Physical RES by 15% for 12s.",
    "Screamin' for a Bow (C5): Increases the Level of Riff Revolution by 3. Maximum upgrade level is 15.",
    "Rockin' in a Flaming World (C6): Decreases the Stamina Consumption of Xinyan's Charged Attacks by 30%. Additionally, Xinyan's Charged Attacks gain an ATK Bonus equal to 50% of her DEF."
  ],
  constellations: [
    {
      level: 1,
      name: "Fatal Acceleration",
      description: "Upon scoring a CRIT Hit, increases Xinyan's Normal and Charged Attack SPD by 12% for 5s. Can only occur once every 5s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Impromptu Opening",
      description: "Riff Revolution's Physical DMG has its CRIT Rate increased by 100%, and will form a shield at Shield Level 3: Rave when cast.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Double-Stop",
      description: "Increases the Level of Sweeping Fervor by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Wildfire Rhythm",
      description: "Sweeping Fervor's swing DMG decreases opponent's Physical RES by 15% for 12s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Screamin' for a Bow",
      description: "Increases the Level of Riff Revolution by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Rockin' in a Flaming World",
      description: "Decreases the Stamina Consumption of Xinyan's Charged Attacks by 30%. Additionally, Xinyan's Charged Attacks gain an ATK Bonus equal to 50% of her DEF.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Pyro shielder and Physical buffer. Grants +15% Physical DMG Bonus to shielded characters via A4, and shreds 15% Physical RES at C4.",
    buffExplanations: [
      {
        name: "A4: Now That's Rock 'N' Roll!",
        brief: "+15% Physical DMG Bonus",
        full: "Characters shielded by Sweeping Fervor deal 15% increased Physical DMG.",
        category: "dmg_bonus",
      },
      {
        name: "C4: Wildfire Rhythm",
        brief: "-15% Physical RES Shred",
        full: "Sweeping Fervor's swing DMG decreases opponent's Physical RES by 15% for 12s.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "def", label: "Total DEF", defaultValue: "2000" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "physicalDmgBonus",
        label: "Physical DMG (Xinyan A4 Shield)",
        compute: (ctx) => 15,
      },
      {
        stat: "enemyRes",
        label: "Physical RES Shred (Xinyan C4)",
        compute: (ctx) => (ctx.constellationLevel >= 4 ? -15 : 0),
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Total DEF", value: fmt(ctx.def) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
