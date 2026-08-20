import type { WeaponConfig } from "../types";

export const serpentSpine: WeaponConfig = {
  id: "serpent-spine",
  name: "Serpent Spine",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Wavesplitter",
  passiveDesc:
    "Every 4s a character is on the field, they will deal 6~10% more DMG and take 3~1.8% more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "serpent-spine-stacks",
      label: "Wavesplitter Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+6~10% All DMG bonus per stack (up to +30~50%)",
    }
  ],
  buffs: [
    {
      id: "serpent-spine-dmg",
      label: "All DMG Bonus (Serpent Spine)",
      stat: "dmgBonus",
      refinementValues: [30, 35, 40, 45, 50],
      isTeamBuff: false,
      conditionKey: "serpent-spine-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['serpent-spine-stacks'] ?? 5); return s * [6, 7, 8, 9, 10][r - 1]; },
    }
  ],
  
};
