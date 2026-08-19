import type { WeaponConfig } from "../types";

export const xiphosMoonlight: WeaponConfig = {
  id: "xiphos-moonlight",
  name: "Xiphos' Moonlight",
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
  passiveName: "Jinni's Whisper",
  passiveDesc:
    "The equipping character will gain 0.036~0.072% Energy Recharge for each point of Elemental Mastery they possess for 12s. Nearby party members will gain 30% of this buff for the same duration.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "wielder-em",
      label: "Wielder EM",
      control: "stacks",
      defaultValue: 900,
      max: 2000,
      hint: "EM of the character equipping Xiphos (e.g. Kazuha)",
    }
  ],
  buffs: [
    {
      id: "xiphos-party-er",
      label: "Party Energy Recharge% (Xiphos' Moonlight)",
      stat: "energyRecharge",
      refinementValues: [0.0108, 0.0135, 0.0162, 0.0189, 0.0216],
      isTeamBuff: true,
      compute: (r,ctx)=>{const wielderEm=Number(ctx.inputs?.["wielder-em"]??900);const perEm=[36e-5*.3,45e-5*.3,54e-5*.3,63e-5*.3,72e-5*.3][r-1];return wielderEm*perEm*100},
    }
  ],
  
};
