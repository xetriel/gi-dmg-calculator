import type { WeaponConfig } from "../types";

export const skywardBlade: WeaponConfig = {
  id: "skyward-blade",
  name: "Skyward Blade",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Sky-Piercing Fang",
  passiveDesc:
    "CRIT Rate is increased by 4~8%. Using an Elemental Burst gains Skypiercing Might: increases Movement SPD by 10%, ATK SPD by 10%, and Normal and Charged Attacks deal additional DMG equal to 20~40% of ATK for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "skyward-blade-crit",
      label: "CRIT Rate% (Skyward Blade)",
      stat: "critRate",
      refinementValues: [4, 5, 6, 7, 8],
      isTeamBuff: false,
      compute: (r) => [4, 5, 6, 7, 8][r - 1],
    }
  ],
  signatureFor: ["bennett"],
};
