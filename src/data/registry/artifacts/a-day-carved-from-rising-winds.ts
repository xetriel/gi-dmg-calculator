import type { ArtifactConfig } from "./types";

export const aDayCarvedFromRisingWinds: ArtifactConfig = {
  id: "a-day-carved-from-rising-winds",
  name: "A Day Carved from Rising Winds",
  rarity: 5,
  twoPieceDesc: "ATK +18%.",
  fourPieceDesc: "After a Normal Attack, Charged Attack, Elemental Skill or Elemental Burst hits an opponent, gain the Blessing of Pastoral Winds effect for 6s: ATK is increased by 25%. If the equipping character has completed Witch's Homework, Blessing of Pastoral Winds will be upgraded to Resolve of Pastoral Winds, which also increases the CRIT Rate of the equipping character by an additional 20%. This effect can be triggered even when the character is off-field.",
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
