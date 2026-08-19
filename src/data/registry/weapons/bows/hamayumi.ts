import type { WeaponConfig } from "../types";

export const hamayumi: WeaponConfig = {
  id: "hamayumi",
  name: "Hamayumi",
  type: "Bow",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Full Draw",
  passiveDesc:
    "Increases Normal Attack DMG by 16~32% and Charged Attack DMG by 12~24%. When the character's Energy reaches 100%, this effect is increased by 100%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "hamayumi-100-energy",
      label: "100% Energy Full (2x DMG Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles Normal and Charged DMG bonuses",
    }
  ],
  buffs: [
    {
      id: "hamayumi-na-dmg",
      label: "Normal Attack DMG Bonus (Hamayumi)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r,ctx)=>{const full=(ctx.inputs?.["hamayumi-100-energy"]??"1")==="1"||Number(ctx.inputs?.["hamayumi-100-energy"]??1)>0;return[16,20,24,28,32][r-1]*(full?2:1)},
    },
    {
      id: "hamayumi-ca-dmg",
      label: "Charged Attack DMG Bonus (Hamayumi)",
      stat: "chargedDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r,ctx)=>{const full=(ctx.inputs?.["hamayumi-100-energy"]??"1")==="1"||Number(ctx.inputs?.["hamayumi-100-energy"]??1)>0;return[12,15,18,21,24][r-1]*(full?2:1)},
    }
  ],
  
};
