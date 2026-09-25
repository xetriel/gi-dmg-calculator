import type { WeaponConfig } from "../types";

export const breezeborneRefrain: WeaponConfig = {
  id: "breezeborne-refrain",
  name: "Breezeborne Refrain",
  description:
    "A dark green bow string made out of pure and flawless gemstone. It never fails to summon a warm spring breeze whenever it is drawn.",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6.0,
  },
  passiveName: "Viper's Ballad",
  passiveDesc:
    'Increases Energy Recharge by 20%/25%/30%/35%/40%. When the equipping character hits the opponent with their Elemental Skill or Elemental Burst, they gain a stack of "Hymn of the Pure." This effect can trigger once every 0.03s, max 3 stacks, and at 3 stacks, all instances of "Hymn of the Pure" are cleared to give the equipping character "Thus Lied the Viper" instead. This grants nearby party members a 24%/30%/36%/42%/48% Stellar Glimmer reaction DMG boost for 12s, during which no stacks of "Hymn of the Pure" can be obtained. The aforementioned effects can still trigger even when the equipping character is not on the field.',
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "breezeborne-viper-active",
      label: "Thus Lied the Viper Active (+24~48% Party Stellar Glimmer DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Triggered at 3 stacks of Hymn of the Pure; grants party +24/30/36/42/48% Stellar Glimmer DMG for 12s",
    },
  ],
  buffs: [
    {
      id: "breezeborne-er",
      label: "Energy Recharge% (Viper's Ballad Base)",
      stat: "energyRecharge",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "breezeborne-party-stellar-glimmer",
      label: "Party Stellar Glimmer DMG Bonus (Thus Lied the Viper)",
      description: "Nearby party members gain Stellar Glimmer reaction DMG boost for 12s",
      stat: "stellarGlimmerDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "breezeborne-viper-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["breezeborne-viper-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["breezeborne-viper-active"] ?? 1) > 0;
        return on ? [24, 30, 36, 42, 48][r - 1] : 0;
      },
    },
  ],
};
