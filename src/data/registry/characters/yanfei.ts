import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const yanfei: CharacterConfig = {
  id: "yanfei",
  name: "Yanfei",
  rarity: 4,
  element: "Pyro",
  weapon: "Catalyst",
  scalingSource: "atk",
  ascensionStat: { label: "Pyro DMG Bonus%", maxValue: 24.0 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Seal of Approval",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Pyro" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Pyro" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Pyro" },
        { key: "charged-0-seals", name: "Charged Attack (0 Seals)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "charged-1-seal", name: "Charged Attack (1 Seal)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "charged-2-seals", name: "Charged Attack (2 Seals)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "charged-3-seals", name: "Charged Attack (3 Seals)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "charged-4-seals", name: "Charged Attack (4 Seals - C6)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "blazing-eye", name: "Blazing Eye AoE Pyro DMG (A4)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Pyro" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Pyro" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Pyro" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Signed Decree",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Done Deal",
      hits: [
        { key: "burst-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "burst-charged-buff", name: "Brilliance Charged Attack DMG Bonus", scaling: "atk", hitCategory: "burst", element: "Pyro", kind: "buff" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "scarlet-seals",
      label: "Scarlet Seals Consumed (A1 Proviso)",
      control: "stacks",
      max: 4,
      defaultValue: 3,
      hint: "Proviso (A1): Each consumed Scarlet Seal grants +5% Pyro DMG Bonus for 6s."
    },
    {
      id: "brilliance-active",
      label: "Done Deal Brilliance Active (Burst CA Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Grants Scarlet Seals periodically and increases Charged Attack DMG %."
    },
    {
      id: "c2-low-hp-crit",
      label: "C2 Right of Final Interpretation (+20% CA CRIT Rate vs enemies < 50% HP)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Charged Attack CRIT Rate by 20% against opponents below 50% HP."
    },
    {
      id: "c4-shield",
      label: "C4 Supreme Amnesty (45% Max HP Shield)",
      control: "toggle",
      defaultValue: 1,
      hint: "Creates a shield absorbing 45% of Yanfei's Max HP upon casting Burst."
    }
  ],
  mechanics: [
    "Proviso (A1): Each Scarlet Seal consumed by a Charged Attack increases Yanfei's Pyro DMG Bonus by 5% for 6s.",
    "Blazing Eye (A4): When Yanfei's Charged Attack CRIT hits, she deals an additional instance of AoE Pyro DMG equal to 80% of her ATK.",
    "The Law Knows No Kindness (C1): Reduces Charged Attack Stamina Consumption per Scarlet Seal by an additional 10%.",
    "Right of Final Interpretation (C2): Increases Charged Attack CRIT Rate by 20% against opponents below 50% HP.",
    "Supreme Amnesty (C4): When Done Deal is used, creates a shield that absorbs DMG equal to 45% of Yanfei's Max HP for 15s.",
    "Extra Clause (C6): Increases the maximum number of Scarlet Seals Yanfei can hold by 1 (max 4)."
  ],
  constellations: [
    {
      level: 1,
      name: "The Law Knows No Kindness",
      description: "When Yanfei uses a Charged Attack, each consumed Scarlet Seal reduces Stamina Cost by an additional 10% and increases resistance to interruption.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Right of Final Interpretation",
      description: "Increases Yanfei's Charged Attack CRIT Rate by 20% against opponents below 50% HP.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Samadhi Fire-Forged",
      description: "Increases the Level of Signed Decree by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Supreme Amnesty",
      description: "When Done Deal is used: Creates a shield that absorbs DMG equal to 45% of Yanfei's Max HP for 15s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Abiding Affidavit",
      description: "Increases the Level of Done Deal by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Extra Clause",
      description: "Increases the maximum number of Scarlet Seals Yanfei can hold by 1.",
      effects: [{ type: "informational" }]
    }
  ]
};
