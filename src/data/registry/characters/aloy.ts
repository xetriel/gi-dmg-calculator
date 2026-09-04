import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkPlunge } from "./hit-helpers";

export const aloy: CharacterConfig = {
  id: "aloy",
  name: "Aloy",
  rarity: 5,
  element: "Cryo",
  weapon: "Bow",
  scalingSource: "atk",
  ascensionStat: { label: "Cryo DMG Bonus%", maxValue: 28.8 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("Cryo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Rapid Fire",
      hits: [
        { key: "1-hit-a", name: "1-Hit A", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "1-hit-b", name: "1-Hit B (2 Hits)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "aimed", name: "Aimed Shot", scaling: "atk", element: "Physical" },
        { key: "fully-charged-aimed", name: "Fully-Charged Aimed Shot", scaling: "atk", hitCategory: "charged", element: "Cryo" },
        { key: "plunge", name: "Plunge", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Frozen Wilds",
      hits: [
        { key: "freeze-bomb", name: "Freeze Bomb DMG", scaling: "atk", hitCategory: "skill" },
        { key: "chillwater-bomblet", name: "Chillwater Bomblet DMG", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Prophecies of Dawn",
      hits: [
        { key: "burst-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "coil-stacks",
      label: "Coil Stacks / Rushing Ice State",
      control: "stacks",
      max: 4,
      defaultValue: 4,
      hint: "Coil stacks 1–3 grant NA DMG Bonus. At 4 stacks, enters Rushing Ice state (Cryo NA infusion + Rushing Ice NA DMG Bonus)."
    },
    {
      id: "a1-atk-buff",
      label: "A1 Combat Override ATK Bonus (+16%)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: When receiving a Coil stack, ATK increases by 16% for 10s."
    },
    {
      id: "a4-cryo-stacks",
      label: "A4 Strong Strike Cryo DMG Bonus Stacks",
      control: "stacks",
      max: 10,
      defaultValue: 0,
      hint: "A4: While in Rushing Ice state, Cryo DMG Bonus increases by 3.5% per second (max 10 stacks = +35%)."
    }
  ],
  mechanics: [
    "Combat Override (A1): Gaining a Coil stack grants +16% ATK for 10s.",
    "Strong Strike (A4): While in Rushing Ice state, Cryo DMG Bonus increases by 3.5% every 1s (max 10 stacks = +35%).",
    "Coil Mechanics: 1–3 Coil stacks grant NA DMG Bonus. 4 stacks triggers Rushing Ice state (Cryo NA Infusion + Rushing Ice NA DMG Bonus)."
  ],
  constellations: [],
  support: {
    description: "Cryo archer providing team ATK buffs. When Aloy triggers Combat Override (A1), party members gain an 8% ATK increase for 10s.",
    buffExplanations: [
      {
        name: "A1: Combat Override",
        brief: "+8% ATK to party",
        full: "When Aloy obtains the Coil effect from Frozen Wilds, her ATK increases by 16%, while nearby party members gain an 8% ATK increase for 10s.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "700" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "atk",
        label: "Party ATK (Aloy A1)",
        compute: (ctx) => ((ctx.inputs["a1-combat-override"] ?? 1) > 0 ? ctx.baseAtk * 0.08 : 0),
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
