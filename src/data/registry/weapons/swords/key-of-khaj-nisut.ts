import type { WeaponConfig } from "../types";

export const keyOfKhajNisut: WeaponConfig = {
  id: "key-of-khaj-nisut",
  name: "Key of Khaj-Nisut",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Sunken Song of the Sands",
  passiveDesc:
    "HP increased by 20~40%. When an Elemental Skill hits opponents, gain Grand Hymn effect for 20s (max 3 stacks): increases EM by 0.12~0.24% of Max HP per stack. At 3 stacks, all nearby party members gain EM equal to 0.2~0.4% of wielder's Max HP for 20s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "wielder-max-hp",
      label: "Wielder's Max HP (e.g. 70000)",
      control: "stacks",
      defaultValue: 70000,
      max: 100000,
      hint: "Used to calculate EM granted to party members",
    },
    {
      id: "key-hymn-stacks",
      label: "Grand Hymn Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "3 stacks required to activate party EM buff",
    }
  ],
  buffs: [
    {
      id: "key-self-hp",
      label: "HP% (Key of Khaj-Nisut Base)",
      stat: "hp",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "key-self-em",
      label: "Self EM from Max HP (Key of Khaj-Nisut)",
      stat: "em",
      refinementValues: [0.36, 0.45, 0.54, 0.63, 0.72],
      isTeamBuff: false,
      conditionKey: "key-hymn-stacks",
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['wielder-max-hp'] ?? 70000); const s = Number(ctx.inputs?.['key-hymn-stacks'] ?? 3); const perStack = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; return hp * perStack * s; },
    },
    {
      id: "key-party-em",
      label: "Party EM from Wielder Max HP (Key of Khaj-Nisut)",
      description: "Nearby party members gain EM equal to 0.2~0.4% of wielder's Max HP",
      stat: "em",
      refinementValues: [0.2, 0.25, 0.3, 0.35, 0.4],
      isTeamBuff: true,
      conditionKey: "key-hymn-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['key-hymn-stacks'] ?? 3); if (s < 3) return 0; const hp = Number(ctx.inputs?.['wielder-max-hp'] ?? 70000); const ratio = [0.002, 0.0025, 0.003, 0.0035, 0.004][r - 1]; return hp * ratio; },
    }
  ],
  signatureFor: ["nilou"],
};
