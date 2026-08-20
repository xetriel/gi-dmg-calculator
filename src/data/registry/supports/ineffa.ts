import type { SupportConfig } from "./types";

export const ineffaSupport: SupportConfig = {
  id: "ineffa-support",
  characterId: "ineffa",
  name: "Ineffa",
  rarity: 5,
  element: "Electro",
  weapon: "Polearm",
  description: "Electro sub-DPS and buffer. Shares EM with active characters scaling from her ATK, boosts Lunar-Charged reaction DMG at C1, and increases Lunar-Charged Base DMG via Moonsign Benediction.",
  buffExplanations: [
    {
      name: "A4: Burst EM Share",
      brief: "+6% Total ATK as EM",
      full: "Panoramic Permutation Protocol: While Ineffa's Burst is active, active party members gain an Elemental Mastery bonus equal to 6% of Ineffa's Total ATK.",
      category: "stat_share",
    },
    {
      name: "C1: Carrier Flow Composite",
      brief: "+2.5% Lunar-Charged DMG / 100 ATK (max 50%)",
      full: "Carrier Flow Composite: Increases party members' Lunar-Charged Reaction DMG by 2.5% per 100 ATK Ineffa possesses, up to a maximum of 50%. Requires C1.",
      category: "lunar",
    },
    {
      name: "Moonsign Benediction",
      brief: "+0.7% Lunar-Charged Base DMG / 100 ATK (max 14%)",
      full: "Moonsign Benediction: Enhances team Lunar-Charged Base DMG by +0.7% per 100 ATK, capped at +14.0% Lunar Base DMG.",
      category: "lunar",
    },
  ],

  // Limited stat inputs — only stats that affect Ineffa's support output
  statFields: [
    { key: "atk", label: "ATK", defaultValue: "700", hasBaseAndFlat: true },
    { key: "critRate", label: "CRIT Rate", defaultValue: "70" },
    { key: "critDmg", label: "CRIT DMG", defaultValue: "140" },
  ],

  mechanicDefs: [
    {
      id: "a4-burst-active",
      label: "A4: Burst EM Share Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Panoramic Permutation Protocol: Increases party member's EM by 6% of Ineffa's ATK"
    },
    {
      id: "c1-carrier-flow",
      label: "C1: Carrier Flow Composite",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Lunar-Charged DMG by 2.5% per 100 ATK (max 50%). Requires C1."
    },
  ],

  constellations: [
    {
      level: 1, name: "Rectifying Processor",
      description: "Carrier Flow Composite: Increases Lunar-Charged DMG by 2.5% per 100 ATK (max 50%).",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Support Cleaning Module",
      description: "After Burst, inflicts Punishment Edict (300% ATK Lunar-Charged DMG). Grants party shields.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Enhanced Emotion Emulator",
      description: "Increases Skill level by 3 (max 15).",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "The Edictless Path",
      description: "Lunar-Charged reactions recover 5 Energy. Once every 4s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Mirror's Dream Transcension",
      description: "Increases Burst level by 3 (max 15).",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "A Dawning Morn for You",
      description: "Carrier Flow active: thundercloud bursts deal 135% ATK Lunar-Charged DMG. Once per 3.5s.",
      effects: [{ type: "informational" }]
    },
  ],

  // Buffs provided to the DPS
  buffs: [
    {
      stat: "em",
      label: "EM (Ineffa A4)",
      compute: (ctx) => {
        if ((ctx.inputs["a4-burst-active"] ?? 0) <= 0) return 0;
        return 0.06 * ctx.atk;
      },
    },
    {
      stat: "lunarChargedDmgBonus",
      label: "Lunar-Charged DMG (Ineffa C1)",
      compute: (ctx) => {
        if (ctx.constellationLevel < 1) return 0;
        if ((ctx.inputs["c1-carrier-flow"] ?? 0) <= 0) return 0;
        return Math.min(2.5 * (ctx.atk / 100), 50);
      },
    },
  ],

  // Moonsign Benediction: Lunar-Charged Base DMG +0.7% per 100 ATK (max 14%)
  lunarBaseBonusCompute: (ctx) => Math.min(0.7 * (ctx.atk / 100), 14),

  // Brief stat pills for remastered support card UI
  formatBriefStats: (ctx) => {
    const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
    return [
      { label: "Total ATK", value: fmt(ctx.atk) },
      { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
    ];
  },
};
