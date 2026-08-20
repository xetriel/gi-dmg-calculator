import type { ArtifactConfig } from "./types";

export const nymphsDream: ArtifactConfig = {
  id: "nymphs-dream",
  name: "Nymph's Dream",
  rarity: 5,
  twoPieceDesc: "Hydro DMG Bonus +15%.",
  fourPieceDesc: "After Normal/Charged/Plunge/Skill/Burst hits, gain Mirrored Nymph stacks. 1/2/3 stacks grant +7%/16%/25% ATK and +4%/9%/15% Hydro DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "nymph-stacks",
          "label": "Mirrored Nymph Stacks (1–3)",
          "control": "stacks",
          "min": 0,
          "max": 3,
          "defaultValue": 3,
          "hint": "1/2/3 stacks grant 7%/16%/25% ATK and 4%/9%/15% Hydro DMG Bonus"
      }
  ],
  buffs: [
    {
      id: "nymph-2pc-hydro",
      label: "2-Piece Hydro DMG Bonus% (Nymph's Dream)",
      stat: "hydroDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "nymph-4pc-atk",
      label: "4-Piece Stacking ATK% (Nymph's Dream)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "nymph-stacks",
      value: 25,
      compute: (ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["nymph-stacks"] ?? 3)));
        const pct = s >= 3 ? 25 : s === 2 ? 16 : s === 1 ? 7 : 0;
        return (pct / 100) * ctx.baseAtk;
      },
    },
    {
      id: "nymph-4pc-hydro",
      label: "4-Piece Stacking Hydro DMG% (Nymph's Dream)",
      stat: "hydroDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "nymph-stacks",
      value: 15,
      compute: (ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["nymph-stacks"] ?? 3)));
        return s >= 3 ? 15 : s === 2 ? 9 : s === 1 ? 4 : 0;
      },
    }
  ],
};
