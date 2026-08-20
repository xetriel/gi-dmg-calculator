import type { ArtifactConfig } from "./types";

export const resolutionOfSojourner: ArtifactConfig = {
  id: "resolution-of-sojourner",
  name: "Resolution of Sojourner",
  rarity: 4,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "Increases Charged Attack CRIT Rate by 30%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "sojourner-2pc-atk",
      label: "2-Piece ATK% (Resolution of Sojourner)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "sojourner-4pc-ca-crit",
      label: "4-Piece Charged Attack CRIT Rate (Resolution of Sojourner)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 30,
      compute: () => 30,
    }
  ],
};
