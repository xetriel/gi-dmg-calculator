import type { ArtifactConfig } from "./types";

export const maidenBeloved: ArtifactConfig = {
  id: "maiden-beloved",
  name: "Maiden Beloved",
  rarity: 5,
  twoPieceDesc: "Character Healing Effectiveness +15%.",
  fourPieceDesc: "Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.",
  isSupport: true,
  buffType: "both",
  buffs: [
    {
      id: "maiden-2pc-heal",
      label: "2-Piece Healing Effectiveness% (Maiden Beloved)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    }
  ],
};
