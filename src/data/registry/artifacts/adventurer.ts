import type { ArtifactConfig } from "./types";

export const adventurer: ArtifactConfig = {
  id: "adventurer",
  name: "Adventurer",
  rarity: 3,
  twoPieceDesc: "Max HP increased by 1,000.",
  fourPieceDesc: "Opening a chest regenerates 30% Max HP over 5s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "adventurer-2pc-hp",
      label: "2-Piece Flat HP (Adventurer)",
      stat: "hp",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 1000,
      compute: () => 1000,
    }
  ],
};
