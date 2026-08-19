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
      id: "fjords-3-elements",
      label: ">= 3 Different Elements in Party",
      control: "toggle",
      defaultValue: 1,
      hint: "+120~240 Elemental Mastery",
    }
  ],
  buffs: [
    {
      id: "fjords-em",
      label: "EM (Ballad of the Fjords)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "fjords-3-elements",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["fjords-3-elements"]??"1")==="1"||Number(ctx.inputs?.["fjords-3-elements"]??1)>0;if(!on)return 0;return[120,150,180,210,240][r-1]},
    }
  ],
  
};
