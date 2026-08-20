import type { ArtifactConfig } from "./types";

export const finaleOfTheDeepGalleries: ArtifactConfig = {
  id: "finale-of-the-deep-galleries",
  name: "Finale of the Deep Galleries",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "When the equipping character has 0 Elemental Energy, Normal Attack DMG is increased by 60% and Elemental Burst DMG is increased by 60%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "zero-energy-active",
          "label": "Has 0 Elemental Energy (+60% NA/Burst)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Normal Attack DMG by 60% and Elemental Burst DMG by 60% when at 0 Energy"
      }
  ],
  buffs: [
    {
      id: "deep-galleries-2pc-atk",
      label: "2-Piece ATK% (Finale of the Deep Galleries)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "deep-galleries-4pc-na",
      label: "4-Piece Normal Attack DMG% (Finale of the Deep Galleries)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "zero-energy-active",
      value: 60,
      compute: (ctx) => {
        const on = (ctx.inputs?.["zero-energy-active"] ?? "1") === "1" || Number(ctx.inputs?.["zero-energy-active"] ?? 1) > 0;
        return on ? 60 : 0;
      },
    },
    {
      id: "deep-galleries-4pc-burst",
      label: "4-Piece Elemental Burst DMG% (Finale of the Deep Galleries)",
      stat: "burstDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "zero-energy-active",
      value: 60,
      compute: (ctx) => {
        const on = (ctx.inputs?.["zero-energy-active"] ?? "1") === "1" || Number(ctx.inputs?.["zero-energy-active"] ?? 1) > 0;
        return on ? 60 : 0;
      },
    }
  ],
};
