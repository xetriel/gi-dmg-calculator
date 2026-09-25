import type { WeaponConfig } from "../types";

export const beyondTheChrysalis: WeaponConfig = {
  id: "beyond-the-chrysalis",
  name: "Beyond the Chrysalis",
  description:
    "A longsword brimming with light and color, and as weightless as a butterfly when brandished. It was once used by a certain individual to break bonds.",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Dance of Wings Unbound",
  passiveDesc:
    "Each time the equipping character uses their Elemental Skill or Elemental Burst, they gain one of the following three effects in sequence:\nWinds of Devotion: Increases the equipping character's CRIT DMG by 56%/72%/88%/104%/120% for 10s;\nWinds of Defiance: Increases Stellar Swirl reaction DMG dealt by the equipping character by 36%/45%/54%/63%/72% for 10s; and\nWinds of Plenty: Regenerates 5/5.5/6/6.5/7 Elemental Energy for the equipping character. Up to 5/5.5/6/6.5/7 Elemental Energy can be regenerated in this way every 4s.\nThe aforementioned effects are removed and the sequence is reset when the equipping character leaves the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "chrysalis-winds-devotion",
      label: "Winds of Devotion Active (+56~120% CRIT DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "1st effect in sequence for 10s after Skill/Burst",
    },
    {
      id: "chrysalis-winds-defiance",
      label: "Winds of Defiance Active (+36~72% Stellar Swirl DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "2nd effect in sequence for 10s after Skill/Burst",
    },
    {
      id: "chrysalis-winds-plenty",
      label: "Winds of Plenty Active (Energy Regen)",
      control: "toggle",
      defaultValue: 0,
      hint: "3rd effect in sequence after Skill/Burst (restores 5/5.5/6/6.5/7 Energy)",
    },
  ],
  buffs: [
    {
      id: "chrysalis-crit-dmg",
      label: "CRIT DMG% (Winds of Devotion)",
      stat: "critDmg",
      refinementValues: [56, 72, 88, 104, 120],
      isTeamBuff: false,
      conditionKey: "chrysalis-winds-devotion",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["chrysalis-winds-devotion"] ?? "1") === "1" ||
          Number(ctx.inputs?.["chrysalis-winds-devotion"] ?? 1) > 0;
        return on ? [56, 72, 88, 104, 120][r - 1] : 0;
      },
    },
    {
      id: "chrysalis-stellar-swirl-dmg",
      label: "Stellar Swirl DMG Bonus (Winds of Defiance)",
      stat: "stellarSwirlDmgBonus",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "chrysalis-winds-defiance",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["chrysalis-winds-defiance"] ?? "0") === "1" ||
          Number(ctx.inputs?.["chrysalis-winds-defiance"] ?? 0) > 0;
        return on ? [36, 45, 54, 63, 72][r - 1] : 0;
      },
    },
  ],
};
