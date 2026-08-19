import type { WeaponConfig } from "../types";

export const hakushinRing: WeaponConfig = {
  id: "hakushin-ring",
  name: "Hakushin Ring",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Sakura Saiguu",
  passiveDesc:
    "After the character equipping this weapon triggers an Electro-based reaction, nearby party members of an Elemental Type involved in the reaction gain a 10~20% Elemental DMG Bonus for their respective Elemental Type for 6s.",
  isSupport: true,
  buffType: "team",
  buffs: [
    {
      id: "hakushin-elem-dmg",
      label: "Elemental DMG Bonus (Hakushin Ring)",
      description: "Party members involved in Electro reaction gain +10~20% Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [10, 12.5, 15, 17.5, 20],
      isTeamBuff: true,
      compute: r=>[10,12.5,15,17.5,20][r-1],
    }
  ],
  
};
