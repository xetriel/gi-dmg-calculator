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
    "Gain 12~24% All Elemental DMG Bonus. Obtain Consummation after using an Elemental Skill, causing ATK to increase by 3.2~6.4% per second. Max 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "calamity-stacks",
      label: "Consummation Stacks (0-6)",
      control: "stacks",
      defaultValue: 6,
      max: 6,
      hint: "+3.2~6.4% ATK per stack (up to 19.2~38.4%)",
    },
    {
      id: "calamity-off-field",
      label: "Wielder is Off-Field (2x ATK Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles ATK bonus from stacks (up to 38.4~76.8% ATK)",
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
      id: "calamity-atk",
      label: "ATK% (Calamity Queller Consummation)",
      stat: "atk",
      refinementValues: [19.2, 24, 28.8, 33.6, 38.4],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "calamity-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['calamity-stacks'] ?? 6); const offField = (ctx.inputs?.['calamity-off-field'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-off-field'] ?? 1) > 0; const mult = offField ? 2 : 1; const baseRatio = [0.032, 0.04, 0.048, 0.056, 0.064][r - 1]; return s * baseRatio * mult * ctx.baseAtk; },
    }
  ],
  signatureFor: ["shenhe"],
};
