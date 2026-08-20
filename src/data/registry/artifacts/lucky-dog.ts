import type { ArtifactConfig } from "./types";

export const luckyDog: ArtifactConfig = {
  id: "lucky-dog",
  name: "Lucky Dog",
  rarity: 3,
  twoPieceDesc: "DEF increased by 100.",
  fourPieceDesc: "Picking up Mora restores 300 HP.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "lucky-dog-2pc-def",
      label: "2-Piece Flat DEF (Lucky Dog)",
      stat: "def",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 100,
      compute: () => 100,
    }
  ],
};
