import type { WeaponConfig } from "../types";

export const aThousandBlazingSuns: WeaponConfig = {
  id: "a-thousand-blazing-suns",
  name: "A Thousand Blazing Suns",
  type: "Claymore",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Scorching Reverence",
  passiveDesc:
    "Increases CRIT DMG by 20~40%. When in Nightsoul's Blessing or triggering a Nightsoul Burst, increases ATK by 28~56% for 6s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "blazing-suns-active",
      label: "Nightsoul Burst Triggered",
      control: "toggle",
      defaultValue: 1,
      hint: "+28~56% ATK for 6s",
    }
  ],
  buffs: [
    {
      id: "blazing-suns-crit-dmg",
      label: "CRIT DMG%",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "blazing-suns-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "blazing-suns-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['blazing-suns-active'] ?? '1') === '1' || Number(ctx.inputs?.['blazing-suns-active'] ?? 1) > 0; return on ? ([28, 35, 42, 49, 56][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  signatureFor: ["mavuika"],
};
