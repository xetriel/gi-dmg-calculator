import type { ArtifactConfig } from "./types";

export const theExile: ArtifactConfig = {
  id: "the-exile",
  name: "The Exile",
  rarity: 4,
  twoPieceDesc: "Energy Recharge +20%.",
  fourPieceDesc: "Using an Elemental Burst regenerates 2 Energy for all party members (excluding the wearer) every 2s for 6s. This effect cannot stack.",
  isSupport: true,
  buffType: "both",
  buffs: [
    {
      id: "exile-2pc-er",
      label: "2-Piece Energy Recharge% (The Exile)",
      stat: "energyRecharge",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    }
  ],
};
