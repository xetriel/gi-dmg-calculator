import type { WeaponConfig } from "../types";

export const mappaMare: WeaponConfig = {
  id: "mappa-mare",
  name: "Mappa Mare",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Infusion Scroll",
  passiveDesc:
    "Triggering an Elemental reaction grants a 8~16% Elemental DMG Bonus for 10s. Max 2 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mappa-stacks",
      label: "Infusion Scroll Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+8~16% Elemental DMG Bonus per stack",
    }
  ],
  buffs: [
    {
      id: "mappa-elem-dmg",
      label: "Elemental DMG Bonus (Mappa Mare)",
      stat: "dmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "mappa-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["mappa-stacks"]??2);return s*[8,10,12,14,16][r-1]},
    }
  ],
  
};
