import type { WeaponConfig } from "../types";

export const skywardPride: WeaponConfig = {
  id: "skyward-pride",
  name: "Skyward Pride",
  type: "Claymore",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Sky-ripping Dragon Spine",
  passiveDesc:
    "Increases all DMG by 8~16%. After using an Elemental Burst, Normal or Charged Attacks create a vacuum blade that deals 80~160% of ATK as DMG to opponents along its path for 20s or 8 blades.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "skyward-pride-dmg",
      label: "All DMG Bonus (Skyward Pride)",
      stat: "dmgBonus",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      compute: (r) => [8, 10, 12, 14, 16][r - 1],
    },
  ],
  damageInstances: [
    {
      id: "skyward-pride-proc",
      name: "Vacuum Blade DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [80, 100, 120, 140, 160],
      description: "Deals 80~160% ATK as Physical DMG to opponents along its path",
    },
  ],
};
