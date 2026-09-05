import type { WeaponConfig } from "../types";

export const angelosHeptades: WeaponConfig = {
  id: "angelos-heptades",
  name: "Angelos' Heptades",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 741,
  lvl1BaseAtk: 49,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 16.5,
    baseValue: 3.6,
  },
  passiveName: "Crown of the Final Scion",
  passiveDesc:
    "ATK is increased by 12~24%. After creating a Shield, gain \"Pathfinder's Light\" for 20s: Increases active party member's DMG by 10~22% per 1,000 ATK (max 26~58%). Restores 14~18 Energy. Hexerei: Secret Rite gives off-field Hexerei 50% of the bonus.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "angelos-shield-active",
      label: "Pathfinder's Light (Shield created active)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases active party member DMG based on wielder ATK",
    },
  ],
  buffs: [
    {
      id: "angelos-wielder-atk",
      label: "ATK% (Crown of the Final Scion)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "angelos-party-dmg",
      label: "Party All DMG Bonus% (Pathfinder's Light)",
      stat: "dmgBonus",
      refinementValues: [26, 34, 42, 50, 58],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "angelos-shield-active",
      compute: (r, ctx) => {
        const on = (ctx.inputs?.["angelos-shield-active"] ?? "1") === "1" || Number(ctx.inputs?.["angelos-shield-active"] ?? 1) > 0;
        if (!on) return 0;
        const maxVal = [26, 34, 42, 50, 58][r - 1];
        const rate = [10, 13, 16, 19, 22][r - 1];
        // If wielder ATK is provided in inputs or ctx.baseAtk
        const wielderAtk = Number(ctx.inputs?.["wielderAtk"] ?? ctx.baseAtk ?? 2000);
        return Math.min(maxVal, (rate / 1000) * wielderAtk);
      },
    },
  ],
};
