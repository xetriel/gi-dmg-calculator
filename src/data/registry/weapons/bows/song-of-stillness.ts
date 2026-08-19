import type { WeaponConfig } from "../types";

export const songOfStillness: WeaponConfig = {
  id: "song-of-stillness",
  name: "Song of Stillness",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Benthic Pulse",
  passiveDesc:
    "After the wielder is healed, they will deal 16~32% more DMG for 8s. This can be triggered even if the character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "stillness-healed",
      label: "Character Received Healing",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% All DMG bonus for 8s",
    }
  ],
  buffs: [
    {
      id: "stillness-dmg",
      label: "All DMG Bonus (Song of Stillness)",
      stat: "dmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "stillness-healed",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["stillness-healed"]??"1")==="1"||Number(ctx.inputs?.["stillness-healed"]??1)>0;return on?[16,20,24,28,32][r-1]:0},
    }
  ],
  
};
