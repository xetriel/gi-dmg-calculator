import type { ArtifactConfig } from "./types";

export const oceanHuedClam: ArtifactConfig = {
  id: "ocean-hued-clam",
  name: "Ocean-Hued Clam",
  rarity: 5,
  twoPieceDesc: "Healing Bonus +15%.",
  fourPieceDesc: "Accumulates healing to explode Sea-Dyed Foam dealing physical DMG (90% of accumulated healing, up to 27,000 base DMG).",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "clam-2pc-heal",
      label: "2-Piece Healing Bonus% (Ocean-Hued Clam)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    }
  ],
};
