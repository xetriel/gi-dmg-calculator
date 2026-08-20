import type { ArtifactConfig } from "./types";

export const heartOfDepth: ArtifactConfig = {
  id: "heart-of-depth",
  name: "Heart of Depth",
  rarity: 5,
  twoPieceDesc: "Hydro DMG Bonus +15%.",
  fourPieceDesc: "After using an Elemental Skill, increases Normal Attack and Charged Attack DMG by 30% for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "skill-used-hod",
          "label": "After Elemental Skill (+30% NA/CA DMG)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Normal and Charged Attack DMG by 30% for 15s after using Elemental Skill"
      }
  ],
  buffs: [
    {
      id: "hod-2pc-hydro",
      label: "2-Piece Hydro DMG Bonus% (Heart of Depth)",
      stat: "hydroDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "hod-4pc-na",
      label: "4-Piece Normal Attack DMG% (Heart of Depth)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "skill-used-hod",
      value: 30,
      compute: (ctx) => {
        const on = (ctx.inputs?.["skill-used-hod"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-hod"] ?? 1) > 0;
        return on ? 30 : 0;
      },
    },
    {
      id: "hod-4pc-ca",
      label: "4-Piece Charged Attack DMG% (Heart of Depth)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "skill-used-hod",
      value: 30,
      compute: (ctx) => {
        const on = (ctx.inputs?.["skill-used-hod"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-hod"] ?? 1) > 0;
        return on ? 30 : 0;
      },
    }
  ],
};
