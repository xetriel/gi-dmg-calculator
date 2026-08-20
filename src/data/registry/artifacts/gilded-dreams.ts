import type { ArtifactConfig } from "./types";

export const gildedDreams: ArtifactConfig = {
  id: "gilded-dreams",
  name: "Gilded Dreams",
  rarity: 5,
  twoPieceDesc: "Increases Elemental Mastery by 80.",
  fourPieceDesc: "Within 8s of triggering an Elemental Reaction: ATK +14% for each same element party member (up to 3), and EM +50 for each different element party member (up to 3).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "gilded-same-element",
          "label": "Same Element Teammates (14% ATK / Char)",
          "control": "stacks",
          "min": 0,
          "max": 3,
          "defaultValue": 1,
          "hint": "Each teammate of the same element increases ATK by 14% (Max 3)"
      },
      {
          "id": "gilded-diff-element",
          "label": "Different Element Teammates (50 EM / Char)",
          "control": "stacks",
          "min": 0,
          "max": 3,
          "defaultValue": 2,
          "hint": "Each teammate of a different element increases Elemental Mastery by 50 (Max 3)"
      }
  ],
  buffs: [
    {
      id: "gilded-2pc-em",
      label: "2-Piece Elemental Mastery (Gilded Dreams)",
      stat: "em",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 80,
      compute: () => 80,
    },
    {
      id: "gilded-4pc-atk",
      label: "4-Piece Team Match ATK% (Gilded Dreams)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      value: 14,
      compute: (ctx) => {
        const same = Math.min(3, Math.max(0, Number(ctx.inputs?.["gilded-same-element"] ?? 1)));
        return (same * 14 / 100) * ctx.baseAtk;
      },
    },
    {
      id: "gilded-4pc-em",
      label: "4-Piece Team Variety EM (Gilded Dreams)",
      stat: "em",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 100,
      compute: (ctx) => {
        const diff = Math.min(3, Math.max(0, Number(ctx.inputs?.["gilded-diff-element"] ?? 2)));
        return diff * 50;
      },
    }
  ],
};
