import type { WeaponConfig } from "../types";

export const calamityQueller: WeaponConfig = {
  id: "calamity-queller",
  name: "Calamity Queller",
  type: "Polearm",
  rarity: 5,
  baseAtk: 741,
  lvl1BaseAtk: 49,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 16.5,
    baseValue: 3.6,
  },
  passiveName: "Extinguishing Precept",
  passiveDesc:
    "Gain 12~24% All Elemental DMG Bonus. Obtain Consummation for 20s after utilizing an Elemental Skill, causing ATK to increase by 3.2~6.4% per second. This ATK increase has a maximum of 6 stacks. When the character equipping this weapon is not on the field, Consummation's ATK increase is doubled.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "consummation-stacks",
      label: "Consummation Stacks (0-6)",
      control: "stacks",
      defaultValue: 6,
      max: 6,
      hint: "+3.2~6.4% ATK per second/stack (up to +19.2~38.4%)",
    },
    {
      id: "consummation-offfield",
      label: "Equipping Character Off-Field (2x ATK)",
      control: "toggle",
      defaultValue: 0,
      hint: "Doubles Consummation ATK bonus when off-field (up to +38.4~76.8%)",
    }
  ],
  buffs: [
    {
      id: "calamity-elem-dmg",
      label: "All Elemental DMG Bonus (Calamity Queller)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "calamity-consummation-atk",
      label: "ATK% (Consummation Stacks)",
      stat: "atk",
      refinementValues: [19.2, 24, 28.8, 33.6, 38.4],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "consummation-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['consummation-stacks'] ?? 6); const off = (ctx.inputs?.['consummation-offfield'] ?? '0') === '1' || Number(ctx.inputs?.['consummation-offfield'] ?? 0) > 0; const mult = off ? 2 : 1; const perStack = [3.2, 4.0, 4.8, 5.6, 6.4][r - 1]; return ((s * perStack * mult) / 100) * ctx.baseAtk; },
    }
  ],
  signatureFor: ["shenhe"],
};
