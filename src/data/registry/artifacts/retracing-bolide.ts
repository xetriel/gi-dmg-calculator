import type { ArtifactConfig } from "./types";

export const retracingBolide: ArtifactConfig = {
  id: "retracing-bolide",
  name: "Retracing Bolide",
  rarity: 5,
  twoPieceDesc: "Increases Shield Strength by 35%.",
  fourPieceDesc: "While protected by a shield, gain an additional 40% Normal and Charged Attack DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "has-shield-bolide",
          "label": "Protected by a Shield",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Grants +40% Normal and Charged Attack DMG while shielded"
      }
  ],
  buffs: [
    {
      id: "bolide-4pc-na",
      label: "4-Piece Normal Attack DMG% (Retracing Bolide)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "has-shield-bolide",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["has-shield-bolide"] ?? "1") === "1" || Number(ctx.inputs?.["has-shield-bolide"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    },
    {
      id: "bolide-4pc-ca",
      label: "4-Piece Charged Attack DMG% (Retracing Bolide)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "has-shield-bolide",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["has-shield-bolide"] ?? "1") === "1" || Number(ctx.inputs?.["has-shield-bolide"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    }
  ],
};
