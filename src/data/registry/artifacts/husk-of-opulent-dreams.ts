import type { ArtifactConfig } from "./types";

export const huskOfOpulentDreams: ArtifactConfig = {
  id: "husk-of-opulent-dreams",
  name: "Husk of Opulent Dreams",
  rarity: 5,
  twoPieceDesc: "DEF +30%.",
  fourPieceDesc: "A character equipped with this Artifact set will obtain Curiosity stacks (up to 4 stacks, each providing 6% DEF and a 6% Geo DMG Bonus).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "curiosity-stacks",
          "label": "Curiosity Stacks (6% DEF & 6% Geo / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 4,
          "defaultValue": 4,
          "hint": "Each stack grants +6% DEF and +6% Geo DMG Bonus (Max 4 stacks = +24% DEF, +24% Geo DMG)"
      }
  ],
  buffs: [
    {
      id: "husk-2pc-def",
      label: "2-Piece DEF% (Husk of Opulent Dreams)",
      stat: "def",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 30,
      compute: (ctx) => (30 / 100) * ctx.baseAtk,
    },
    {
      id: "husk-4pc-geo-dmg",
      label: "4-Piece Stacking Geo DMG% (Husk of Opulent Dreams)",
      stat: "geoDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "curiosity-stacks",
      value: 24,
      compute: (ctx) => {
        const stacks = Math.min(4, Math.max(0, Number(ctx.inputs?.["curiosity-stacks"] ?? 4)));
        return stacks * 6;
      },
    }
  ],
};
