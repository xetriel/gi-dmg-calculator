import type { WeaponConfig } from "../types";

export const gestOfTheMightyWolf: WeaponConfig = {
  id: "gest-of-the-mighty-wolf",
  name: "Gest of the Mighty Wolf",
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
  passiveName: "Wolf's Song",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. Normal and Charged Attack hits increase ATK by 16~32% for 8s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mighty-wolf-atk-active",
      label: "NA/CA Hit (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 8s",
    }
  ],
  buffs: [
    {
      id: "mighty-wolf-elem-dmg",
      label: "All Elemental DMG Bonus (Gest of Mighty Wolf)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "mighty-wolf-atk",
      label: "ATK% (Gest of Mighty Wolf)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "mighty-wolf-atk-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['mighty-wolf-atk-active'] ?? '1') === '1' || Number(ctx.inputs?.['mighty-wolf-atk-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
