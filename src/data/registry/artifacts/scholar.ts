import type { ArtifactConfig } from "./types";

export const scholar: ArtifactConfig = {
  id: "scholar",
  name: "Scholar",
  rarity: 4,
  twoPieceDesc: "Energy Recharge +20%.",
  fourPieceDesc: "Gaining Elemental Particles or Orbs gives 3 Energy to all party members who have a bow or a catalyst equipped. Can only occur once every 3s.",
  isSupport: true,
  buffType: "both",
  buffs: [
    {
      id: "scholar-2pc-er",
      label: "2-Piece Energy Recharge% (Scholar)",
      stat: "energyRecharge",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    }
  ],
};
