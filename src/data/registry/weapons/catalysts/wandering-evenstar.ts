import type { WeaponConfig } from "../types";

export const wanderingEvenstar: WeaponConfig = {
  id: "wandering-evenstar",
  name: "Wandering Evenstar",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Wildling's Night Song",
  passiveDesc:
    "The equipping character gains 24~48% of their Elemental Mastery as extra ATK for 12s. Nearby party members gain 30% of this buff for the same duration.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "evenstar-wielder-em",
      label: "Evenstar Wielder EM",
      control: "stacks",
      defaultValue: 800,
      max: 2000,
      hint: "Wielder's EM used for party ATK sharing",
    }
  ],
  buffs: [
    {
      id: "evenstar-party-atk",
      label: "Party ATK from Wielder EM (Wandering Evenstar)",
      description: "Party members gain 30% of wielder's EM-to-ATK conversion",
      stat: "atk",
      refinementValues: [7.2, 9, 10.8, 12.6, 14.4],
      isTeamBuff: true,
      compute: (r,ctx)=>{const em=Number(ctx.inputs?.["evenstar-wielder-em"]??800);const ratio=[.24*.3,.3*.3,.36*.3,.42*.3,.48*.3][r-1];return em*ratio},
    }
  ],
  
};
