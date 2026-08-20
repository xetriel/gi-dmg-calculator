import type { ArtifactConfig } from "./types";

export const braveHeart: ArtifactConfig = {
  id: "brave-heart",
  name: "Brave Heart",
  rarity: 4,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "Increases DMG by 30% against opponents with more than 50% HP.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "opponent-hp-gt-50",
          "label": "Opponent HP > 50%",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases DMG by 30% against opponents with more than 50% HP"
      }
  ],
  buffs: [
    {
      id: "brave-heart-2pc-atk",
      label: "2-Piece ATK% (Brave Heart)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "brave-heart-4pc-dmg",
      label: "4-Piece DMG Bonus% (Brave Heart)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "opponent-hp-gt-50",
      value: 30,
      compute: (ctx) => {
        const on = (ctx.inputs?.["opponent-hp-gt-50"] ?? "1") === "1" || Number(ctx.inputs?.["opponent-hp-gt-50"] ?? 1) > 0;
        return on ? 30 : 0;
      },
    }
  ],
};
