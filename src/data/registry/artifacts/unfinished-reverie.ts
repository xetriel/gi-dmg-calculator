import type { ArtifactConfig } from "./types";

export const unfinishedReverie: ArtifactConfig = {
  id: "unfinished-reverie",
  name: "Unfinished Reverie",
  rarity: 5,
  twoPieceDesc: "ATK +18%.",
  fourPieceDesc: "After leaving combat for 3s, DMG dealt increased by 50%. In combat, if no Burning opponents are nearby for more than 6s, this DMG Bonus will decrease by 10% per second until it reaches 0%. When a Burning opponent exists, it will increase by 10% instead until it reaches 50%. This effect still triggers if the equipping character is off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "reverie-burning-active",
          "label": "Burning Opponent Exists (+50% DMG)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases DMG dealt by 50% when a Burning opponent exists nearby"
      }
  ],
  buffs: [
    {
      id: "reverie-2pc-atk",
      label: "2-Piece ATK% (Unfinished Reverie)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "reverie-4pc-dmg",
      label: "4-Piece Burning DMG Bonus% (Unfinished Reverie)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "reverie-burning-active",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["reverie-burning-active"] ?? "1") === "1" || Number(ctx.inputs?.["reverie-burning-active"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    }
  ],
};
