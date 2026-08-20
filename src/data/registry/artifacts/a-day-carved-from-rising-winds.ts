import type { ArtifactConfig } from "./types";

export const aDayCarvedFromRisingWinds: ArtifactConfig = {
  id: "a-day-carved-from-rising-winds",
  name: "A Day Carved From Rising Winds",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "After NA/CA/Skill/Burst hits, gain Blessing of Pastoral Winds: ATK +25%. If equipping character has completed Witch's Homework, upgraded to Resolve of Pastoral Winds (+20% CRIT Rate extra).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "pastoral-winds-active",
          "label": "Blessing of Pastoral Winds (+25% ATK)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases ATK by 25% for 6s after an attack hits an opponent"
      },
      {
          "id": "witch-homework-active",
          "label": "Completed Witch's Homework (+20% CRIT Rate)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases CRIT Rate by 20% when character has Witch's Homework synergy"
      }
  ],
  buffs: [
    {
      id: "rising-winds-2pc-atk",
      label: "2-Piece ATK% (A Day Carved From Rising Winds)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "rising-winds-4pc-atk",
      label: "4-Piece Pastoral Winds ATK% (A Day Carved From Rising Winds)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "pastoral-winds-active",
      value: 25,
      compute: (ctx) => {
        const on = (ctx.inputs?.["pastoral-winds-active"] ?? "1") === "1" || Number(ctx.inputs?.["pastoral-winds-active"] ?? 1) > 0;
        return on ? (25 / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "rising-winds-4pc-crit",
      label: "4-Piece Witch's Homework CRIT Rate (A Day Carved From Rising Winds)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "witch-homework-active",
      value: 20,
      compute: (ctx) => {
        const on = (ctx.inputs?.["pastoral-winds-active"] ?? "1") === "1" || Number(ctx.inputs?.["pastoral-winds-active"] ?? 1) > 0;
        if (!on) return 0;
        const homework = (ctx.inputs?.["witch-homework-active"] ?? "1") === "1" || Number(ctx.inputs?.["witch-homework-active"] ?? 1) > 0;
        return homework ? 20 : 0;
      },
    }
  ],
};
