import type { WeaponConfig } from "../types";

export const toukabouShigure: WeaponConfig = {
  id: "toukabou-shigure",
  name: "Toukabou Shigure",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Kaidan: Rain-Tied Talisman",
  passiveDesc:
    "After an attack hits an opponent, it will inflict an instance of Cursed Parasol upon one of them for 10s. The character equipping this weapon will deal 16~32% more DMG to the opponent affected by Cursed Parasol.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "parasol-target",
      label: "Target Afflicted by Cursed Parasol",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% All DMG against cursed target",
    }
  ],
  buffs: [
    {
      id: "parasol-dmg",
      label: "All DMG Bonus (Toukabou Shigure)",
      stat: "dmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "parasol-target",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["parasol-target"]??"1")==="1"||Number(ctx.inputs?.["parasol-target"]??1)>0;return on?[16,20,24,28,32][r-1]:0},
    }
  ],
  
};
