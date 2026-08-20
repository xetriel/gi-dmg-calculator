import type { ArtifactConfig } from "./types";

export const desertPavilionChronicle: ArtifactConfig = {
  id: "desert-pavilion-chronicle",
  name: "Desert Pavilion Chronicle",
  rarity: 5,
  twoPieceDesc: "Anemo DMG Bonus +15%.",
  fourPieceDesc: "When Charged Attacks hit opponents, the equipping character's Normal Attack SPD will increase by 10% while Normal, Charged, and Plunging Attack DMG will increase by 40% for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "dpc-ca-hit",
          "label": "Charged Attack Hit (+40% NA/CA/Plunge)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Normal, Charged, and Plunging Attack DMG by 40% for 15s"
      }
  ],
  buffs: [
    {
      id: "dpc-2pc-anemo",
      label: "2-Piece Anemo DMG Bonus% (Desert Pavilion Chronicle)",
      stat: "anemoDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "dpc-4pc-na",
      label: "4-Piece Normal Attack DMG% (Desert Pavilion Chronicle)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "dpc-ca-hit",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["dpc-ca-hit"] ?? "1") === "1" || Number(ctx.inputs?.["dpc-ca-hit"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    },
    {
      id: "dpc-4pc-ca",
      label: "4-Piece Charged Attack DMG% (Desert Pavilion Chronicle)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "dpc-ca-hit",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["dpc-ca-hit"] ?? "1") === "1" || Number(ctx.inputs?.["dpc-ca-hit"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    },
    {
      id: "dpc-4pc-plunge",
      label: "4-Piece Plunging Attack DMG% (Desert Pavilion Chronicle)",
      stat: "plungeDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "dpc-ca-hit",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["dpc-ca-hit"] ?? "1") === "1" || Number(ctx.inputs?.["dpc-ca-hit"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    }
  ],
};
