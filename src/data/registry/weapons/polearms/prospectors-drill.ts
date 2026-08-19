import type { WeaponConfig } from "../types";

export const prospectorsDrill: WeaponConfig = {
  id: "prospectors-drill",
  name: "Prospector's Drill",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Masons' Ditty",
  passiveDesc:
    "When the wielder is healed or heals all party members, gain a Unity's Symbol for 30s. Max 3 symbols. Using an Elemental Skill or Burst consumes all symbols and increases ATK by 3~6% and All Elemental DMG Bonus by 7~13% per symbol for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "prospector-symbols",
      label: "Unity Symbols Consumed (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+3~6% ATK & +7~13% Elem DMG per symbol",
    }
  ],
  buffs: [
    {
      id: "prospector-atk",
      label: "ATK% (Prospector's Drill)",
      stat: "atk",
      refinementValues: [9, 12, 15, 18, 21],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "prospector-symbols",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["prospector-symbols"]??3);return s*[3,4,5,6,7][r-1]/100*ctx.baseAtk},
    },
    {
      id: "prospector-elem-dmg",
      label: "All Elemental DMG Bonus (Prospector's Drill)",
      stat: "dmgBonus",
      refinementValues: [21, 25.5, 30, 34.5, 39],
      isTeamBuff: false,
      conditionKey: "prospector-symbols",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["prospector-symbols"]??3);return s*[7,8.5,10,11.5,13][r-1]},
    }
  ],
  
};
