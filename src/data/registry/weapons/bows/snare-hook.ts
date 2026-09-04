import type { WeaponConfig } from "../types";

export const snareHook: WeaponConfig = {
  id: "snare-hook",
  name: "Snare Hook",
  type: "Bow",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 61.3,
    baseValue: 13.3,
  },
  passiveName: "Phantom Flash",
  passiveDesc:
    "Upon causing an Elemental Reaction, increases Elemental Mastery by 60~120 for 12s. Moonsign: Ascendant Gleam: Elemental Mastery from this effect is further increased by 60~120 (up to +120~240 EM). This effect can be triggered even if the equipping character is off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "snare-reaction-active",
      label: "Elemental Reaction Triggered (+60~120 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+60~120 EM for 12s",
    },
    {
      id: "snare-moonsign-active",
      label: "Moonsign: Ascendant Gleam (+60~120 additional EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "Further increases EM bonus by +60~120 (up to +120~240 EM total)",
    },
  ],
  buffs: [
    {
      id: "snare-em",
      label: "Elemental Mastery (Phantom Flash)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "snare-reaction-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["snare-reaction-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["snare-reaction-active"] ?? 1) > 0;
        if (!on) return 0;
        const moon =
          (ctx.inputs?.["snare-moonsign-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["snare-moonsign-active"] ?? 1) > 0;
        const mult = moon ? 2 : 1;
        return [60, 75, 90, 105, 120][r - 1] * mult;
      },
    },
  ],
};
