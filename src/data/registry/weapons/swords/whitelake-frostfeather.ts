import type { WeaponConfig } from "../types";

export const whitelakeFrostfeather: WeaponConfig = {
  id: "whitelake-frostfeather",
  name: "Whitelake Frostfeather",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Snow Swan's Finale",
  passiveDesc:
    "When the equipping character hits an opponent with their Elemental Skill, they gain \"Lake-Hued Lament\": ATK increases by 8~16% for 8s (max 3 stacks). At 3 stacks, Stellar Glimmer reaction CRIT DMG increases by 50~110%, and triggering Stellar Glimmer reactions or reaction DMG restores 4~6 Energy every 3.5s. Can trigger off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lake-hued-lament-stacks",
      label: "Lake-Hued Lament Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8~16% ATK per stack; at 3 stacks grants Stellar Glimmer reaction bonuses",
    },
  ],
  buffs: [
    {
      id: "whitelake-atk-stack",
      label: "ATK% (Lake-Hued Lament)",
      stat: "atk",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "lake-hued-lament-stacks",
      compute: (r, ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["lake-hued-lament-stacks"] ?? 3)));
        const perStack = [8, 10, 12, 14, 16][r - 1];
        return ((stacks * perStack) / 100) * ctx.baseAtk;
      },
    },
  ],
};
