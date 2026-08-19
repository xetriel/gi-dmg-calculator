import type { WeaponConfig } from "../types";

export const scionOfTheBlazingSun: WeaponConfig = {
  id: "scion-of-the-blazing-sun",
  name: "Scion of the Blazing Sun",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 18.4,
    baseValue: 4,
  },
  passiveName: "The Way of Sunfire",
  passiveDesc:
    "After a Charged Attack hits an opponent, a Sunfire Arrow will descend dealing 60~120% ATK as DMG and inflicting Heartsear: Charged Attack DMG from the equipping character against this opponent is increased by 28~56% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "scion-heartsear-active",
      label: "Target Afflicted with Heartsear",
      control: "toggle",
      defaultValue: 1,
      hint: "+28~56% Charged Attack DMG",
    }
  ],
  buffs: [
    {
      id: "scion-ca-dmg",
      label: "Charged Attack DMG Bonus (Scion of the Blazing Sun)",
      stat: "chargedDmgBonus",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      conditionKey: "scion-heartsear-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["scion-heartsear-active"]??"1")==="1"||Number(ctx.inputs?.["scion-heartsear-active"]??1)>0;return on?[28,35,42,49,56][r-1]:0},
    }
  ],
  
};
