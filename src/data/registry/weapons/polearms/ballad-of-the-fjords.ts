import type { WeaponConfig } from "../types";

export const balladOfTheFjords: WeaponConfig = {
  id: "ballad-of-the-fjords",
  name: "Ballad of the Fjords",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Tales of the Tundra",
  passiveDesc:
    "When there are at least 3 different Elemental Types in your party, Elemental Mastery is increased by 120~240.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "ballad-elements-met",
      label: "Party has >= 3 Different Elements (+120~240 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+120~240 EM when 3+ elements in team",
    }
  ],
  buffs: [
    {
      id: "ballad-em",
      label: "Elemental Mastery (Ballad of the Fjords)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "ballad-elements-met",
      compute: (r, ctx) => { const on = (ctx.inputs?.['ballad-elements-met'] ?? '1') === '1' || Number(ctx.inputs?.['ballad-elements-met'] ?? 1) > 0; return on ? [120, 150, 180, 210, 240][r - 1] : 0; },
    }
  ],
  
};
