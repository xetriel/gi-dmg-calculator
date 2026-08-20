import type { ArtifactConfig } from "./types";

export const defendersWill: ArtifactConfig = {
  id: "defenders-will",
  name: "Defender's Will",
  rarity: 4,
  twoPieceDesc: "DEF increased by 30%.",
  fourPieceDesc: "For each different element present in your own party, the wearer's Elemental RES to that corresponding element is increased by 30%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "defenders-will-2pc-def",
      label: "2-Piece DEF% (Defender's Will)",
      stat: "def",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 30,
      compute: (ctx) => (30 / 100) * ctx.baseAtk,
    }
  ],
};
