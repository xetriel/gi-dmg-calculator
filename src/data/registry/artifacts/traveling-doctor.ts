import type { ArtifactConfig } from "./types";

export const travelingDoctor: ArtifactConfig = {
  id: "traveling-doctor",
  name: "Traveling Doctor",
  rarity: 3,
  twoPieceDesc: "Increases incoming healing by 20%.",
  fourPieceDesc: "Using Elemental Burst restores 20% HP.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "traveling-doctor-2pc-heal",
      label: "2-Piece Incoming Healing% (Traveling Doctor)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    }
  ],
};
