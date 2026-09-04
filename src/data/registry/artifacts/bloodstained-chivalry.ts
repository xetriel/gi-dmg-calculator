import type { ArtifactConfig } from "./types";

export const bloodstainedChivalry: ArtifactConfig = {
  id: "bloodstained-chivalry",
  name: "Bloodstained Chivalry",
  rarity: 5,
  twoPieceDesc: "Physical DMG Bonus +25%",
  fourPieceDesc: "After defeating an opponent, increases Charged Attack DMG by 50%, and reduces its Stamina cost to 0 for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "defeat-opponent-bc",
          "label": "Defeated Opponent",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Charged Attack DMG by 50% for 10s"
      }
  ],
  buffs: [
    {
      id: "bloodstained-2pc-phys",
      label: "2-Piece Physical DMG% (Bloodstained Chivalry)",
      stat: "physicalDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 25,
      compute: () => 25,
    },
    {
      id: "bloodstained-4pc-ca-dmg",
      label: "4-Piece Charged Attack DMG% (Bloodstained Chivalry)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "defeat-opponent-bc",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["defeat-opponent-bc"] ?? "1") === "1" || Number(ctx.inputs?.["defeat-opponent-bc"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    }
  ],
};
