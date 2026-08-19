import type { WeaponConfig } from "../types";

export const skywardSpine: WeaponConfig = {
  id: "skyward-spine",
  name: "Skyward Spine",
  type: "Polearm",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Black Wing",
  passiveDesc:
    "Increases CRIT Rate by 8~16% and increases Normal ATK SPD by 12%. Normal and Charged Attacks on hit have a 50% chance to trigger a vacuum blade dealing 40~100% of ATK as DMG.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "skyward-spine-crit",
      label: "CRIT Rate% (Skyward Spine)",
      stat: "critRate",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      compute: (r) => [8, 10, 12, 14, 16][r - 1],
    }
  ],
  
};
