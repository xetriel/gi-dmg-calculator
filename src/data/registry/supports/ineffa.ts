import type { SupportConfig } from "./types";

export const ineffaSupport: SupportConfig = {
  id: "ineffa-support",
  characterId: "ineffa",
  name: "Ineffa",
  rarity: 5,
  element: "Electro",

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
};
