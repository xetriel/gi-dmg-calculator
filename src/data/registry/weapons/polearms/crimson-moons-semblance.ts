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
    "Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. When the equipping character has a Bond of Life, they gain a 12~28% DMG Bonus; if the value of the Bond of Life is greater than or equal to 30% of Max HP, gain an additional 24~56% DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "has-bol",
      label: "Character has Bond of Life (+12~28% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~28% All DMG bonus while Bond of Life is active",
    },
    {
      id: "bol-ge-30",
      label: "Bond of Life >= 30% Max HP (+24~56% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Additional +24~56% All DMG bonus when BoL is at least 30% of Max HP",
    },
  ],
  buffs: [
    {
      id: "crimson-bol-base",
      label: "DMG Bonus from Bond of Life (Crimson Moon)",
      stat: "dmgBonus",
      refinementValues: [12, 16, 20, 24, 28],
      isTeamBuff: false,
      conditionKey: "has-bol",
      compute: (r, ctx) => {
        const on = (ctx.inputs?.["has-bol"] ?? "1") === "1" || Number(ctx.inputs?.["has-bol"] ?? 1) > 0;
        return on ? [12, 16, 20, 24, 28][r - 1] : 0;
      },
    },
    {
      id: "crimson-bol-30",
      label: "DMG Bonus from BoL >= 30% (Crimson Moon)",
      stat: "dmgBonus",
      refinementValues: [24, 32, 40, 48, 56],
      isTeamBuff: false,
      conditionKey: "bol-ge-30",
      compute: (r, ctx) => {
        const on = (ctx.inputs?.["bol-ge-30"] ?? "1") === "1" || Number(ctx.inputs?.["bol-ge-30"] ?? 1) > 0;
        return on ? [24, 32, 40, 48, 56][r - 1] : 0;
      },
    },
  ],
  signatureFor: ["arlecchino"],
};
