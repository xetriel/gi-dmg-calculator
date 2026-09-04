import type { WeaponConfig } from "../types";

export const disasterAndRemorse: WeaponConfig = {
  id: "disaster-and-remorse",
  name: "Disaster and Remorse",
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
  passiveName: "Dolorous Stroke",
  passiveDesc:
    "After the equipping character uses an Elemental Skill, they gain \"Path of Conflict\" for 17s, as well as \"Unforgivable\" (Normal/Charged DMG +40~80%) and \"Irreparable\" (Skill/Burst DMG +40~80%) for 3s each. Hitting opponents extends these effects. Hexerei: Secret Rite: The above DMG boosts are increased by 75%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "disaster-path-of-conflict",
      label: "Path of Conflict (Skill used active)",
      control: "toggle",
      defaultValue: 1,
      hint: "+40~80% NA/CA and Skill/Burst DMG",
    },
    {
      id: "disaster-hexerei-active",
      label: "Hexerei: Secret Rite Active (+75% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Increases DMG boosts by an additional 75% (+70~140%)",
    },
  ],
  buffs: [
    {
      id: "disaster-na-ca-dmg",
      label: "Normal/Charged Attack DMG Bonus (Unforgivable)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "disaster-path-of-conflict",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["disaster-path-of-conflict"] ?? "1") === "1" ||
          Number(ctx.inputs?.["disaster-path-of-conflict"] ?? 1) > 0;
        if (!on) return 0;
        const hex =
          (ctx.inputs?.["disaster-hexerei-active"] ?? "0") === "1" ||
          Number(ctx.inputs?.["disaster-hexerei-active"] ?? 0) > 0;
        const mult = hex ? 1.75 : 1.0;
        return [40, 50, 60, 70, 80][r - 1] * mult;
      },
    },
    {
      id: "disaster-skill-burst-dmg",
      label: "Elemental Skill & Burst DMG Bonus (Irreparable)",
      stat: "skillDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "disaster-path-of-conflict",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["disaster-path-of-conflict"] ?? "1") === "1" ||
          Number(ctx.inputs?.["disaster-path-of-conflict"] ?? 1) > 0;
        if (!on) return 0;
        const hex =
          (ctx.inputs?.["disaster-hexerei-active"] ?? "0") === "1" ||
          Number(ctx.inputs?.["disaster-hexerei-active"] ?? 0) > 0;
        const mult = hex ? 1.75 : 1.0;
        return [40, 50, 60, 70, 80][r - 1] * mult;
      },
    },
  ],
};
