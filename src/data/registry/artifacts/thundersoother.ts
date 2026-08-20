import type { ArtifactConfig } from "./types";

export const thundersoother: ArtifactConfig = {
  id: "thundersoother",
  name: "Thundersoother",
  rarity: 5,
  twoPieceDesc: "Electro RES increased by 40%.",
  fourPieceDesc: "Increases DMG against opponents affected by Electro by 35%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "target-electro",
          "label": "Opponent Affected by Electro",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases DMG dealt by 35% against opponents affected by Electro"
      }
  ],
  buffs: [
    {
      id: "thundersoother-4pc-dmg",
      label: "4-Piece DMG Bonus% (Thundersoother)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "target-electro",
      value: 35,
      compute: (ctx) => {
        const on = (ctx.inputs?.["target-electro"] ?? "1") === "1" || Number(ctx.inputs?.["target-electro"] ?? 1) > 0;
        return on ? 35 : 0;
      },
    }
  ],
};
