import type { WeaponConfig } from "../types";

export const crimsonMoonsSemblance: WeaponConfig = {
  id: "crimson-moons-semblance",
  name: "Crimson Moon's Semblance",
  type: "Polearm",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Ashen Sun's Shadow",
  passiveDesc:
    "Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. When the equipping character has a Bond of Life, they gain 12~28% DMG Bonus; if the Bond of Life is >= 30% of Max HP, gain an additional 24~56% DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "has-bol",
      label: "Wielder has Bond of Life (+12~28% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active when any Bond of Life is present",
    },
    {
      id: "bol-ge-30",
      label: "Bond of Life >= 30% Max HP (+24~56% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Additional bonus when BoL is 30% or greater",
    }
  ],
  buffs: [
    {
      id: "crimson-moon-base-dmg",
      label: "All DMG Bonus (Bond of Life Active)",
      stat: "dmgBonus",
      refinementValues: [12, 16, 20, 24, 28],
      isTeamBuff: false,
      conditionKey: "has-bol",
      compute: (r, ctx) => { const on = (ctx.inputs?.['has-bol'] ?? '1') === '1' || Number(ctx.inputs?.['has-bol'] ?? 1) > 0; return on ? [12, 16, 20, 24, 28][r - 1] : 0; },
    },
    {
      id: "crimson-moon-extra-dmg",
      label: "All DMG Bonus (BoL >= 30% Max HP)",
      stat: "dmgBonus",
      refinementValues: [24, 32, 40, 48, 56],
      isTeamBuff: false,
      conditionKey: "bol-ge-30",
      compute: (r, ctx) => { const on = (ctx.inputs?.['bol-ge-30'] ?? '1') === '1' || Number(ctx.inputs?.['bol-ge-30'] ?? 1) > 0; return on ? [24, 32, 40, 48, 56][r - 1] : 0; },
    }
  ],
  signatureFor: ["arlecchino"],
};
