import type { ArtifactConfig } from "./types";

export const echoesOfAnOffering: ArtifactConfig = {
  id: "echoes-of-an-offering",
  name: "Echoes of an Offering",
  rarity: 5,
  twoPieceDesc: "ATK +18%.",
  fourPieceDesc: "When Normal Attacks hit opponents, there is a chance to trigger Valley Rite, increasing Normal Attack DMG by 70% of ATK.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "echoes-2pc-atk",
      label: "2-Piece ATK% (Echoes of an Offering)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    }
  ],
};
