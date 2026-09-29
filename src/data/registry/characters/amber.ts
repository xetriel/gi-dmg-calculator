import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const amber: CharacterConfig = {
  id: "amber",
  name: "Amber",
  rarity: 4,
  element: "Pyro",
  weapon: "Bow",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Sharpshooter",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "aimed", name: "Aimed Shot", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "aimed-c1", name: "Aimed Shot (C1 Second Arrow)", scaling: "atk", hitCategory: "normal", element: "Physical", minConstellation: 1 },
        { key: "fully-charged-aimed", name: "Fully-Charged Aimed Shot", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "fully-charged-aimed-c1", name: "Fully-Charged Aimed Shot (C1 Second Arrow)", scaling: "atk", hitCategory: "charged", element: "Pyro", minConstellation: 1 },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical", plungeSubtype: "collision" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical", plungeSubtype: "impact" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical", plungeSubtype: "impact" },
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Explosive Puppet",
      hits: [
        { key: "skill-hp", name: "Baron Bunny Inherited HP", scaling: "hp", kind: "heal" },
        { key: "explosion-dmg", name: "Explosion DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
        { key: "manual-detonation-c2", name: "Manual Detonation DMG (C2)", scaling: "atk", hitCategory: "skill", element: "Pyro", minConstellation: 2 },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Fiery Rain",
      hits: [
        { key: "burst-wave-dmg", name: "Fiery Rain DMG Per Wave", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "burst-total-dmg", name: "Total Fiery Rain DMG (18 Waves)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ],
    },
  ],
  mechanicDefs: [
    {
      id: "a4-precise-shot",
      label: "A4 Precise Shot (+15% ATK on Weak Spot Hit)",
      control: "toggle",
      defaultValue: 1,
      hint: "Aimed Shot hits on weak spots increase ATK by 15% for 10s.",
    },
    {
      id: "weakspot-auto-crit",
      label: "Weak Spot Hit (Guaranteed CRIT on Aimed Shots)",
      control: "toggle",
      defaultValue: 0,
      hint: "Aimed Shots hitting weak spots are guaranteed Critical Hits (+100% CRIT Rate).",
    },
    {
      id: "c2-manual-detonation",
      label: "C2 Bunny Triggered (+200% DMG on Manual Detonation)",
      control: "toggle",
      defaultValue: 0,
      hint: "Manually detonating Baron Bunny with a fully-charged Aimed Shot deals 200% additional DMG.",
    },
    {
      id: "c6-wildfire",
      label: "C6 Wildfire (+15% ATK & +15% Movement SPD after Burst)",
      control: "toggle",
      defaultValue: 1,
      hint: "Fiery Rain increases all party members' Movement SPD by 15% and ATK by 15% for 10s. Requires C6.",
    },
  ],
  mechanics: [
    "Every Arrow Finds Its Target (A1): Fiery Rain increases Amber's CRIT Rate by 10% and widens the AoE by 30%.",
    "Precise Shot (A4): Aimed Shot hits on weak spots increase ATK by 15% for 10s.",
    "Gliding Champion: Decreases gliding Stamina consumption for party members by 20%.",
    "One Arrow to Rule Them All (C1): Fires 2 arrows per Aimed Shot. The second arrow deals 20% of the first arrow's DMG.",
    "Bunny Triggered (C2): Hitting Baron Bunny's foot with a fully-charged Aimed Shot manually detonates it for 200% additional DMG (+200% DMG Bonus).",
    "It's Not Just Any Doll... (C4): Decreases Explosive Puppet's CD by 20% and adds 1 additional charge.",
    "Wildfire (C6): Fiery Rain increases all party members' Movement SPD by 15% and ATK by 15% for 10s.",
  ],
  constellations: [
    {
      level: 1,
      name: "One Arrow to Rule Them All",
      description: "Fires 2 arrows per Aimed Shot. The second arrow deals 20% of the first arrow's DMG.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Bunny Triggered",
      description: "Baron Bunny, new and improved! Hitting Baron Bunny's foot with a fully-charged Aimed Shot manually detonates it. Explosion via manual detonation deals 200% additional DMG.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "It Burns!",
      description: "Increases the Level of Fiery Rain by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 4,
      name: "It's Not Just Any Doll...",
      description: "Decreases Explosive Puppet's CD by 20%, and adds 1 additional charge.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Shock",
      description: "Increases the Level of Explosive Puppet by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 6,
      name: "Wildfire",
      description: "Fiery Rain increases all party members' Movement SPD by 15% and ATK by 15% for 10s.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Pyro archer providing team ATK buffs, taunt distraction, and rapid shieldbreaking. At C6, Fiery Rain grants +15% ATK and +15% Movement SPD to all party members for 10s.",
    buffExplanations: [
      {
        name: "C6: Wildfire",
        brief: "+15% ATK to party",
        full: "Fiery Rain increases all party members' Movement SPD by 15% and ATK by 15% for 10s. Requires C6.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "baseAtk", label: "Base ATK", defaultValue: "700" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
      { key: "energyRecharge", label: "Energy Recharge", defaultValue: "160" },
    ],
    buffs: [
      {
        stat: "atkPercent",
        label: "Party ATK% (Amber C6 Wildfire)",
        compute: (ctx) => (ctx.constellationLevel >= 6 && (ctx.inputs["c6-wildfire"] ?? 1) > 0 ? 15 : 0),
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
