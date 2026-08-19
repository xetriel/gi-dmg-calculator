import type { WeaponConfig } from "../types";

export const rightfulReward: WeaponConfig = {
  id: "rightful-reward",
  name: "Rightful Reward",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Tip of the Spear",
  passiveDesc:
    "When the wielder is healed, restores 8~16 Energy. Can trigger once every 10s even if off-field.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
