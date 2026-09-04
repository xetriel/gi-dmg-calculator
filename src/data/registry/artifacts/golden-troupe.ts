import type { ArtifactConfig } from "./types";

export const goldenTroupe: ArtifactConfig = {
  id: "golden-troupe",
  name: "Golden Troupe",
  rarity: 5,
  twoPieceDesc: "Increases Elemental Skill DMG by 20%.",
  fourPieceDesc: "Increases Elemental Skill DMG by 25%. Additionally, when not on the field, Elemental Skill DMG will be further increased by 25%. This effect will be cleared 2s after taking the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "golden-troupe-off-field",
          "label": "Character is Off-Field (+25% Extra Skill DMG)",
          "control": "toggle",
          "defaultValue": 0,
          "hint": "Grants an additional +25% Elemental Skill DMG when off-field (Total +70% Skill DMG)"
      }
  ],
  buffs: [
    {
      id: "golden-troupe-2pc-skill",
      label: "2-Piece Elemental Skill DMG% (Golden Troupe)",
      stat: "skillDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "golden-troupe-4pc-skill",
      label: "4-Piece Elemental Skill DMG% (Golden Troupe)",
      stat: "skillDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "golden-troupe-off-field",
      value: 25,
      compute: (ctx) => {
        const offField = (ctx.inputs?.["golden-troupe-off-field"] ?? "0") === "1" || Number(ctx.inputs?.["golden-troupe-off-field"] ?? 0) > 0;
        return 25 + (offField ? 25 : 0);
      },
    }
  ],
};
