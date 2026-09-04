import type { WeaponConfig } from "../types";

export const frostbreath: WeaponConfig = {
  id: "frostbreath",
  name: "Frostbreath",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "A Cast Real Far",
  passiveDesc:
    "Triggering a Cryo or Hydro-related elemental reaction increases the equipping character's ATK by 20~40% for 15s, and regenerates 6~12 Elemental Energy for other members of their party. Can trigger once every 16s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "frostbreath-reaction-active",
      label: "Cryo/Hydro Reaction Triggered (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 15s; restores 6~12 Energy to party",
    },
  ],
  buffs: [
    {
      id: "frostbreath-wielder-atk",
      label: "ATK% (Frostbreath)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "frostbreath-reaction-active",
      compute: (r, ctx) => {
        const on = (ctx.inputs?.["frostbreath-reaction-active"] ?? "1") === "1" || Number(ctx.inputs?.["frostbreath-reaction-active"] ?? 1) > 0;
        return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
