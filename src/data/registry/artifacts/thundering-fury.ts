import type { ArtifactConfig } from "./types";

export const thunderingFury: ArtifactConfig = {
  id: "thundering-fury",
  name: "Thundering Fury",
  rarity: 5,
  twoPieceDesc: "Electro DMG Bonus +15%.",
  fourPieceDesc: "Increases the DMG caused by Overloaded, Electro-Charged, Superconduct, and Hyperbloom by 40%, the DMG Bonus conferred by Aggravate by 20%, and the DMG caused by Lunar-Charged and Stellar-Conduct by 20%. When Quicken or the aforementioned Elemental Reactions are triggered, Elemental Skill CD is decreased by 1s. Can only occur once every 0.8s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "tf-2pc-electro",
      label: "2-Piece Electro DMG Bonus% (Thundering Fury)",
      stat: "electroDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "tf-4pc-lunar-charged",
      label: "4-Piece Lunar-Charged DMG% (Thundering Fury)",
      stat: "lunarChargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    }
  ],
};
