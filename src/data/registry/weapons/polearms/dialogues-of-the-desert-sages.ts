import type { WeaponConfig } from "../types";

export const dialoguesOfTheDesertSages: WeaponConfig = {
  id: "dialogues-of-the-desert-sages",
  name: "Dialogues of the Desert Sages",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Principle of Equilibrium",
  passiveDesc:
    "When the wielder is healed, restores 8~16 Energy. Can occur once every 10s even when character is off-field.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
