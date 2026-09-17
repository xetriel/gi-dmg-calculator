import type { WeaponConfig } from "../types";

export const prospectorsShovel: WeaponConfig = {
  id: "prospectors-shovel",
  name: "Prospector's Shovel",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Swift and Sure",
  passiveDesc:
    "Electro-Charged DMG is increased by 48~96%, and Lunar-Charged DMG is increased by 12~24%. Moonsign: Ascendant Gleam: Lunar-Charged DMG is increased by an additional 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "prospector-moonsign-active",
      label: "Moonsign: Ascendant Gleam (+12~24% Lunar-Charged DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Additional +12~24% Lunar-Charged DMG when Moonsign is Ascendant Gleam",
    },
  ],
  buffs: [
    {
      id: "prospector-electro-charged",
      label: "Electro-Charged DMG% (Prospector's Shovel)",
      stat: "electroChargedDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [48, 60, 72, 84, 96][r - 1],
    },
    {
      id: "prospector-lunar-charged",
      label: "Lunar-Charged DMG% (Prospector's Shovel)",
      stat: "lunarChargedDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "prospector-ascendant-gleam",
      label: "Lunar-Charged DMG% (Ascendant Gleam)",
      stat: "lunarChargedDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "prospector-moonsign-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["prospector-moonsign-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["prospector-moonsign-active"] ?? 1) > 0;
        return on ? [12, 15, 18, 21, 24][r - 1] : 0;
      },
    },
  ],
};
