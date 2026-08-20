import type { ArtifactConfig } from "./types";

export const gambler: ArtifactConfig = {
  id: "gambler",
  name: "Gambler",
  rarity: 4,
  twoPieceDesc: "Increases Elemental Skill DMG by 20%.",
  fourPieceDesc: "Defeating an opponent has a 100% chance to remove Elemental Skill CD. Can only occur once every 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "gambler-2pc-skill-dmg",
      label: "2-Piece Elemental Skill DMG% (Gambler)",
      stat: "skillDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    }
  ],
};
