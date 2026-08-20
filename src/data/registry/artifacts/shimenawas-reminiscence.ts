import type { ArtifactConfig } from "./types";

export const shimenawasReminiscence: ArtifactConfig = {
  id: "shimenawas-reminiscence",
  name: "Shimenawa's Reminiscence",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by 50% for 10s. This effect will not trigger again during that duration.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "shimenawa-active",
          "label": "Skill Cast Energy Consumed (+50% NA/CA/Plunge)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Normal, Charged, and Plunging Attack DMG by 50% for 10s after casting Skill with >=15 Energy"
      }
  ],
  buffs: [
    {
      id: "shimenawa-2pc-atk",
      label: "2-Piece ATK% (Shimenawa's Reminiscence)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "shimenawa-4pc-na",
      label: "4-Piece Normal Attack DMG% (Shimenawa's Reminiscence)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "shimenawa-active",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["shimenawa-active"] ?? "1") === "1" || Number(ctx.inputs?.["shimenawa-active"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    },
    {
      id: "shimenawa-4pc-ca",
      label: "4-Piece Charged Attack DMG% (Shimenawa's Reminiscence)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "shimenawa-active",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["shimenawa-active"] ?? "1") === "1" || Number(ctx.inputs?.["shimenawa-active"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    },
    {
      id: "shimenawa-4pc-plunge",
      label: "4-Piece Plunging Attack DMG% (Shimenawa's Reminiscence)",
      stat: "plungeDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "shimenawa-active",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["shimenawa-active"] ?? "1") === "1" || Number(ctx.inputs?.["shimenawa-active"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    }
  ],
};
