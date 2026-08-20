import type { ArtifactConfig } from "./types";

export const martialArtist: ArtifactConfig = {
  id: "martial-artist",
  name: "Martial Artist",
  rarity: 4,
  twoPieceDesc: "Increases Normal Attack and Charged Attack DMG by 15%.",
  fourPieceDesc: "After using Elemental Skill, increases Normal Attack and Charged Attack DMG by 25% for 8s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "skill-used-ma",
          "label": "After Elemental Skill",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Normal and Charged Attack DMG by an additional 25% for 8s"
      }
  ],
  buffs: [
    {
      id: "martial-artist-2pc-na",
      label: "2-Piece Normal Attack DMG% (Martial Artist)",
      stat: "normalDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "martial-artist-2pc-ca",
      label: "2-Piece Charged Attack DMG% (Martial Artist)",
      stat: "chargedDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "martial-artist-4pc-na",
      label: "4-Piece Normal Attack DMG% (Martial Artist)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "skill-used-ma",
      value: 25,
      compute: (ctx) => {
        const on = (ctx.inputs?.["skill-used-ma"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-ma"] ?? 1) > 0;
        return on ? 25 : 0;
      },
    },
    {
      id: "martial-artist-4pc-ca",
      label: "4-Piece Charged Attack DMG% (Martial Artist)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "skill-used-ma",
      value: 25,
      compute: (ctx) => {
        const on = (ctx.inputs?.["skill-used-ma"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-ma"] ?? 1) > 0;
        return on ? 25 : 0;
      },
    }
  ],
};
