import type { ArtifactConfig } from "./types";

export const fragmentOfHarmonicWhimsy: ArtifactConfig = {
  id: "fragment-of-harmonic-whimsy",
  name: "Fragment of Harmonic Whimsy",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "When the value of a Bond of Life increases or decreases, this character deals 18% increased DMG for 6s. Max 3 stacks (Total +54% DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "whimsy-bol-stacks",
          "label": "Bond of Life Stacks (18% DMG / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 3,
          "defaultValue": 3,
          "hint": "Each stack grants +18% All DMG Bonus (Max 3 stacks = +54% All DMG)"
      }
  ],
  buffs: [
    {
      id: "whimsy-2pc-atk",
      label: "2-Piece ATK% (Fragment of Harmonic Whimsy)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "whimsy-4pc-dmg",
      label: "4-Piece Bond of Life DMG Bonus% (Fragment of Harmonic Whimsy)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "whimsy-bol-stacks",
      value: 54,
      compute: (ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["whimsy-bol-stacks"] ?? 3)));
        return stacks * 18;
      },
    }
  ],
};
