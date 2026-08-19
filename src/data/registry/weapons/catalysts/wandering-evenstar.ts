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
  passiveName: "Wildling Nightstar",
  passiveDesc:
    "The equipping character will gain 24~48% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "evenstar-wielder-em",
      label: "Wielder's Elemental Mastery (e.g. 1000)",
      control: "stacks",
      defaultValue: 1000,
      max: 2000,
      hint: "Used to compute flat ATK gained by wielder and party",
    }
  ],
  buffs: [
    {
      id: "evenstar-self-atk",
      label: "Self ATK from EM (Wandering Evenstar)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['evenstar-wielder-em'] ?? 1000); const ratio = [0.24, 0.30, 0.36, 0.42, 0.48][r - 1]; return em * ratio; },
    },
    {
      id: "evenstar-party-atk",
      label: "Party ATK from Wielder EM (Wandering Evenstar)",
      description: "Nearby party members gain 30% of the wielder's ATK buff",
      stat: "atk",
      refinementValues: [7.2, 9, 10.8, 12.6, 14.4],
      isTeamBuff: true,
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['evenstar-wielder-em'] ?? 1000); const ratio = [0.24, 0.30, 0.36, 0.42, 0.48][r - 1]; return em * ratio * 0.3; },
    }
  ],
  
};
