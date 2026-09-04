import type { ArtifactConfig } from "./types";

export const marechausseeHunter: ArtifactConfig = {
  id: "marechaussee-hunter",
  name: "Marechaussee Hunter",
  rarity: 5,
  twoPieceDesc: "Normal and Charged Attack DMG +15%.",
  fourPieceDesc: "When current HP increases or decreases, CRIT Rate will be increased by 12% for 5s. Max 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "marechaussee-stacks",
          "label": "HP Change Stacks (12% CRIT / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 3,
          "defaultValue": 3,
          "hint": "Each stack increases CRIT Rate by 12% (Max 3 stacks = +36% CRIT Rate)"
      }
  ],
  buffs: [
    {
      id: "marechaussee-2pc-na",
      label: "2-Piece Normal Attack DMG% (Marechaussee Hunter)",
      stat: "normalDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "marechaussee-2pc-ca",
      label: "2-Piece Charged Attack DMG% (Marechaussee Hunter)",
      stat: "chargedDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "marechaussee-4pc-crit",
      label: "4-Piece CRIT Rate (Marechaussee Hunter)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "marechaussee-stacks",
      value: 36,
      compute: (ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["marechaussee-stacks"] ?? 3)));
        return stacks * 12;
      },
    }
  ],
};
