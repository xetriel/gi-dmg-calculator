import type { WeaponConfig } from "../types";

export const whitelakeFrostfeather: WeaponConfig = {
  id: "whitelake-frostfeather",
  name: "Whitelake Frostfeather",
  description:
    "A longsword light as the feathers of a snow swan, and which stays pure and untainted at all times.",
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
    'When the equipping character hits an opponent with their Elemental Skill, they gain "Lake-Hued Lament": ATK increases by 8%/10%/12%/14%/16% for 8s. This effect can trigger once every 0.1s. Max 3 stacks, and each stack\'s duration is independent. At 3 stacks, the CRIT DMG of any Stellar Glimmer reaction DMG caused by the equipping character is increased by 50%/65%/80%/95%/110%, and triggering Stellar Glimmer reactions or Stellar Glimmer reaction DMG will also restore 4/4.5/5/5.5/6 Elemental Energy to the character. This Energy recovery effect can trigger once every 3.5s. Can be triggered even when the equipping character is off-field.',
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lake-hued-lament-stacks",
      label: "Lake-Hued Lament Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8~16% ATK per stack; at 3 stacks grants +50~110% Stellar Glimmer reaction CRIT DMG and restores Energy",
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
    {
      id: "whitelake-stellar-crit-dmg",
      label: "Stellar Glimmer CRIT DMG (Lake-Hued Lament)",
      stat: "stellarReactionCritDmg",
      refinementValues: [50, 65, 80, 95, 110],
      isTeamBuff: false,
      conditionKey: "lake-hued-lament-stacks",
      compute: (r, ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["lake-hued-lament-stacks"] ?? 3)));
        return stacks >= 3 ? [50, 65, 80, 95, 110][r - 1] : 0;
      },
    },
  ],
};
