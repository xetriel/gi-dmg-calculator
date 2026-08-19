import type { WeaponConfig } from "../types";

export const cloudforged: WeaponConfig = {
  id: "cloudforged",
  name: "Cloudforged",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Crag-Wreathed Needle",
  passiveDesc:
    "After Elemental Energy is decreased, the equipping character's Elemental Mastery is increased by 40~80 for 18s. Max 2 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "cloudforged-stacks",
      label: "Energy Decreased Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+40~80 EM per stack (up to +80~160 EM)",
    }
  ],
  buffs: [
    {
      id: "cloudforged-em",
      label: "Elemental Mastery (Cloudforged)",
      stat: "em",
      refinementValues: [80, 100, 120, 140, 160],
      isTeamBuff: false,
      conditionKey: "cloudforged-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["cloudforged-stacks"]??2);return s*[40,50,60,70,80][r-1]},
    }
  ],
  
};
