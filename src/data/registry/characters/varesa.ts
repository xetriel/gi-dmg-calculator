import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const varesa: CharacterConfig = {
  id: "varesa",
  name: "Varesa",
  rarity: 5,
  element: "Electro",
  weapon: "Catalyst",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Electro DMG Bonus%",
  stats: coreStats("Electro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — By the Horns",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Riding the Night-Rainbow",
      hits: [
        { key: "rush-dmg", name: "Rush DMG", scaling: "atk", hitCategory: "skill" },
        { key: "fiery-rush-dmg", name: "Fiery Passion Rush DMG", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Guardian Vent!",
      hits: [
        { key: "kick-dmg", name: "Flying Kick DMG", scaling: "atk", hitCategory: "burst" },
        { key: "fiery-kick-dmg", name: "Fiery Passion Flying Kick DMG", scaling: "atk", hitCategory: "burst" },
        { key: "volcano-kablam-dmg", name: "Fiery Mountain Toss DMG (Volcano Kablam)", scaling: "atk", hitCategory: "plunge" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "fiery-passion",
      label: "Fiery Passion (Nightsoul Blessing)",
      control: "toggle",
      defaultValue: 0,
      hint: "Varesa's enhanced combat state. Buffs her attacks and Elemental Skill/Burst damage."
    },
    {
      id: "apex-drive",
      label: "Apex Drive",
      control: "toggle",
      defaultValue: 0,
      hint: "Unlocked after performing a Plunging Attack in Fiery Passion. Enables Volcano Kablam and affects C4 bonuses."
    },
    {
      id: "rainbow-crash",
      label: "Rainbow Crash (A1)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Plunging ground impact DMG +50% ATK (or +180% ATK in Fiery Passion or at C1)."
    },
    {
      id: "nightsoul-burst-stacks",
      label: "Nightsoul Burst Stacks (A4)",
      control: "stacks",
      max: 2,
      defaultValue: 0,
      hint: "A4: ATK +35% per stack (max 2) when a nearby party member triggers Nightsoul Burst."
    },
    {
      id: "c4-diligent-refinement",
      label: "Diligent Refinement (C4)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Plunging ground impact DMG +50% ATK (max 20,000 DMG) when neither state is active."
    }
  ],
  mechanics: [
    "Fiery Passion (Nightsoul Blessing): Enhances combat attacks and skill/burst damage.",
    "Tag-Team Triple Jump! (A1): Plunge ground impact DMG +50% ATK (or +180% ATK in Fiery Passion / C1).",
    "The Hero Twice-Returned! (A4): ATK +35% per Nightsoul Burst stack (max 2).",
    "Undying Passion (C1): Volcano Kablam triggers Rainbow Crash at 180% ATK scaling.",
    "Beyond the Edge of Light (C2): Enter Apex Drive after a Plunging Attack in Fiery Passion.",
    "The Courage to Press On (C4): Diligent Refinement (+500% ATK plunge bonus) or Burst DMG +100%.",
    "A Hero of Justice's Triumph (C6): Plunging Attacks and Elemental Burst +10% CRIT Rate / +100% CRIT DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "Undying Passion",
      description: "When performing Volcano Kablam, Varesa gains Rainbow Crash for 5s. During this, Plunging Attack ground impact DMG is increased by 180% of ATK. Reduces Nightsoul/Phlogiston consumption by 30% in Sudden Onrush.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Beyond the Edge of Light",
      description: "Apex Drive state increases interruption resistance and restores Energy.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Unbowed Resolve",
      description: "Increases the Level of Elemental Burst: Guardian Vent! by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "The Courage to Press On",
      description: "If Burst used with neither state active, gains Diligent Refinement (+500% ATK plunge bonus). If either state is active, Burst deals 100% increased DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Thoughts Floating on the Warm Breeze",
      description: "Increases the Level of Elemental Skill: Riding the Night-Rainbow by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "A Hero of Justice's Triumph",
      description: "Volcano Kablam restores Nightsoul points. Plunging Attacks and Elemental Burst gain +10% CRIT Rate and +100% CRIT DMG.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Pure on-field Pyro plunging hypercarry powered by Nightsoul Passion and Apex Drive. Provides team presence, Pyro resonance, and team CRIT passthrough.",
    buffExplanations: [
      {
        name: "Pyro Plunge Hypercarry",
        brief: "On-Field Pyro Hypercarry",
        full: "Varesa unleashes high-impact Volcano Kablam plunging attacks and Guardian Vent bursts, without providing party buffs.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "850" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "70" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "170" },
    ],
    buffs: [],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Base ATK", value: fmt(ctx.baseAtk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
