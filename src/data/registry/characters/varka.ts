import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const varka: CharacterConfig = {
  id: "varka", name: "Varka", rarity: 5,
  element: "Anemo", weapon: "Claymore", scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("Anemo DMG Bonus%"),
  talents: [
    {
      type: "normal", name: "Normal Attack — Favonius Bladework: Dancing Radiance", hits: [
        { key: "1-hit", name: "1-Hit (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "2-hit-a", name: "2-Hit A (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "2-hit-b", name: "2-Hit B (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "3-hit-a", name: "3-Hit A (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "3-hit-b", name: "3-Hit B (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "4-hit-a", name: "4-Hit A (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "4-hit-b", name: "4-Hit B (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "5-hit-a", name: "5-Hit A (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "5-hit-b", name: "5-Hit B (Physical)", scaling: "atk", hitCategory: "normal" },
        { key: "charged-a", name: "Charged Attack A (Physical)", scaling: "atk", hitCategory: "charged" },
        { key: "charged-b", name: "Charged Attack B (Physical)", scaling: "atk", hitCategory: "charged" },
        { key: "plunge", name: "Plunge (Physical)", scaling: "atk", hitCategory: "plunge" },
        { key: "low-plunge", name: "Low Plunge (Physical)", scaling: "atk", hitCategory: "plunge" },
        { key: "high-plunge", name: "High Plunge (Physical)", scaling: "atk", hitCategory: "plunge" },
      ]
    },
    {
      type: "skill", name: "Elemental Skill — Windbound Execution", hits: [
        { key: "skill-dmg", name: "Skill DMG (Anemo)", scaling: "atk", hitCategory: "skill" },
        { key: "sd-1-hit", name: "Sturm und Drang 1-Hit (Right-Hand)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-2-hit-a", name: "Sturm und Drang 2-Hit A (Left-Hand Anemo)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-2-hit-b", name: "Sturm und Drang 2-Hit B (Right-Hand)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-3-hit-a", name: "Sturm und Drang 3-Hit A (Left-Hand Anemo)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-3-hit-b", name: "Sturm und Drang 3-Hit B (Right-Hand)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-4-hit-a", name: "Sturm und Drang 4-Hit A (Right-Hand)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-4-hit-b", name: "Sturm und Drang 4-Hit B (Left-Hand Anemo)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-5-hit-a", name: "Sturm und Drang 5-Hit A (Right-Hand)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-5-hit-b", name: "Sturm und Drang 5-Hit B (Left-Hand Anemo)", scaling: "atk", hitCategory: "normal" },
        { key: "sd-charged-a", name: "Sturm und Drang CA A (Right-Hand)", scaling: "atk", hitCategory: "charged" },
        { key: "sd-charged-b", name: "Sturm und Drang CA B (Left-Hand Anemo)", scaling: "atk", hitCategory: "charged" },
        { key: "azure-devour-a", name: "Azure Devour A (Right-Hand x2)", scaling: "atk", hitCategory: "charged" },
        { key: "azure-devour-b", name: "Azure Devour B (Left-Hand Anemo x2)", scaling: "atk", hitCategory: "charged" },
        { key: "four-winds-ascension-a", name: "Four Winds' Ascension A (Right-Hand)", scaling: "atk", hitCategory: "skill" },
        { key: "four-winds-ascension-b", name: "Four Winds' Ascension B (Anemo)", scaling: "atk", hitCategory: "skill" },
        { key: "c2-strike", name: "C2 Additional Strike (Anemo)", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst", name: "Elemental Burst — Northwind Avatar", hits: [
        { key: "burst-1-hit", name: "Burst 1-Hit (Right-Hand)", scaling: "atk", hitCategory: "burst" },
        { key: "burst-2-hit", name: "Burst 2-Hit (Anemo)", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanics: [
    "Normal/Charged/Plunging attacks deal Physical DMG.",
    "Sturm und Drang mode converts left-hand strikes to Anemo DMG and right-hand strikes to Pyro, Hydro, Electro, or Cryo DMG depending on the party elements.",
    "Both regular Physical and Sturm und Drang infused elemental attacks are displayed side-by-side.",
    "A1 Dawn Wind's March: grants +10% Anemo and corresponding Element DMG Bonus per 1,000 ATK (max 25%).",
    "A1 Resonance buffs: increases Sturm und Drang DMG by 1.4x (Tier 1) or 2.2x (Tier 2).",
    "A4 Wind's Vanguard: triggering Swirl grants Azure Fang's Oath stacks (+7.5% Normal/Charged/Special attacks DMG per stack, max 4 stacks). C6 enhances stacks to grant +20% CRIT DMG each.",
    "C1 Lyrical Libation: +100% DMG bonus (2x multiplier) for Four Winds' Ascension and Azure Devour.",
    "C2: Four Winds' Ascension or Azure Devour triggers an additional strike dealing 800% ATK Anemo DMG.",
    "C4: Swirl grants +20% Anemo and corresponding Element DMG Bonus.",
  ],
  mechanicDefs: [
    {
      id: "azure-oath-stacks", label: "A4 Azure Fang's Oath stacks", control: "stacks", max: 4, defaultValue: 4,
      hint: "A4: +7.5% Normal/Charged/Special DMG per stack (max 4). C6: Also +20% CRIT DMG per stack."
    },
    {
      id: "party-has-pyro", label: "Party has Pyro character", control: "toggle", defaultValue: 1,
      hint: "Right-hand element priority: Pyro > Hydro > Electro > Cryo."
    },
    {
      id: "party-has-hydro", label: "Party has Hydro character", control: "toggle", defaultValue: 0,
      hint: "Right-hand element priority: Pyro > Hydro > Electro > Cryo."
    },
    {
      id: "party-has-electro", label: "Party has Electro character", control: "toggle", defaultValue: 0,
      hint: "Right-hand element priority: Pyro > Hydro > Electro > Cryo."
    },
    {
      id: "party-has-cryo", label: "Party has Cryo character", control: "toggle", defaultValue: 0,
      hint: "Right-hand element priority: Pyro > Hydro > Electro > Cryo."
    },
    {
      id: "a1-resonance-tier1", label: "A1 Resonance Tier 1 (1.4x DMG)", control: "toggle", defaultValue: 1,
      hint: "A1: at least 2 Anemo or 2 same-element Pyro/Hydro/Electro/Cryo characters in party."
    },
    {
      id: "a1-resonance-tier2", label: "A1 Resonance Tier 2 (2.2x DMG)", control: "toggle", defaultValue: 0,
      hint: "A1: at least 2 Anemo AND at least 2 same-element Pyro/Hydro/Electro/Cryo characters in party."
    },
    {
      id: "lyrical-libation", label: "C1 Lyrical Libation (2x DMG)", control: "toggle", defaultValue: 1,
      hint: "C1: Four Winds' Ascension and Azure Devour deal 200% of their original DMG."
    },
    {
      id: "c4-swirl-buff", label: "C4 Swirl DMG Buff", control: "toggle", defaultValue: 1,
      hint: "C4: Varka triggering Swirl grants +20% Anemo and corresponding Element DMG Bonus for 10s."
    }
  ],
  wikiTalents: [
    {
      name: "Favonius Bladework: Dancing Radiance",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 5 consecutive strikes with dual claymores. Charged Attack: Consumes Stamina to perform a powerful dual slash. Plunging Attack: Standard plunging."
    },
    {
      name: "Windbound Execution",
      type: "Elemental Skill",
      description: "Tap: Leap forward and slash, dealing AoE Anemo DMG, and enters Sturm und Drang. In Sturm und Drang, Normal/Charged attacks deal increased DMG, cannot plunging. Left hand converted to Anemo, right hand converted to Pyro/Hydro/Electro/Cryo based on party elements. Skill converts to Four Winds' Ascension (deals Anemo + Element DMG). Normal Attack hits reduce Four Winds' Ascension CD. Varka can expend uses of Four Winds' Ascension to trigger Azure Devour Charged Attack. Hold: Charges up and leaps forward, generating 6 particles."
    },
    {
      name: "Northwind Avatar",
      type: "Elemental Burst",
      description: "Performs a double slash attack, dealing 2 instances of AoE Anemo DMG. First slash converts to deal corresponding element based on party elements (Pyro > Hydro > Electro > Cryo)."
    },
    {
      name: "Dawn Wind's March",
      type: "1st Ascension Passive",
      description: "Every 1,000 ATK grants +10% Anemo DMG and +10% right-hand element DMG (max 25%). If there are 2 Anemo or 2 same-element Pyro/Hydro/Electro/Cryo characters, Sturm und Drang/Azure/Four Winds' Ascension deal 140% DMG. If there are 2 Anemo AND 2 same-element characters, this increases to 220%."
    },
    {
      name: "Wind's Vanguard",
      type: "4th Ascension Passive",
      description: "Party Swirl triggers grant Azure Fang's Oath stacks (+7.5% Normal/Charged/Special DMG, max 4 stacks)."
    },
    {
      name: "Dawn's Return",
      type: "Witch's Eve Rite Passive",
      description: "If 2+ Hexerei characters are in party, Varka NA hits in Sturm und Drang reduce Four Winds' Ascension CD by 1s instead of 0.5s."
    },
    {
      name: "Homebound Wind's Paean",
      type: "Utility Passive",
      description: "For every Mondstadt character in party, Hold skill CD decreases by 5%."
    }
  ],
  constellations: [
    {
      level: 1, name: "Come, Friend, Let Us Dance Beneath the Moon's Soft Glow",
      description: "Switches to Sturm und Drang grants +1 use of Four Winds' Ascension. Also gains Lyrical Libation: Four Winds' Ascension or Azure Devour deals 200% DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "When Dawn Breaks, Our Journey Shall Take Flight",
      description: "Unleashing Four Winds' Ascension or Azure Devour triggers an additional strike dealing AoE Anemo DMG equal to 800% of Varka's ATK.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "O Friend, Quaff Not the Bitter Wine That Brings Tears of Woe",
      description: "Increases the level of Windbound Execution by 3.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "For None May Take From Us Our Freedom of Song",
      description: "Varka triggering Swirl grants all party members +20% Anemo DMG and +20% corresponding Element DMG Bonus for 10s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Fill High the Cup With Fine Wine, for Tyrants Come and Go",
      description: "Increases the level of Northwind Avatar by 3.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Beloved Mondstadt, Steadfast You Shall Shine",
      description: "Sturm und Drang is enhanced: Azure Devour and Four Winds' Ascension can trigger extra instances without expending uses. Azure Fang's Oath stacks grant +20% CRIT DMG each.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Anemo Grand Master and sub-DPS. Grants +20% Anemo and swirled Elemental DMG Bonus to all party members for 10s upon triggering Swirl at C4.",
    buffExplanations: [
      {
        name: "C4: Freedom of Song",
        brief: "+20% Anemo & Elemental DMG Bonus",
        full: "Triggering Swirl grants all party members +20% Anemo DMG and +20% corresponding Element DMG Bonus for 10s.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "2400" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "dmgBonus",
        label: "Anemo & Elemental DMG (Varka C4)",
        compute: (ctx) => (ctx.constellationLevel >= 4 ? 20 : 0),
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Total ATK", value: fmt(ctx.atk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
