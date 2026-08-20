import type { ArtifactConfig } from "./types";

export const lavawalker: ArtifactConfig = {
  id: "lavawalker",
  name: "Lavawalker",
  rarity: 5,
  twoPieceDesc: "Pyro RES increased by 40%.",
  fourPieceDesc: "Increases DMG against opponents affected by Pyro by 35%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "target-pyro",
          "label": "Opponent Affected by Pyro",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases DMG dealt by 35% against opponents affected by Pyro"
      }
  ],
  buffs: [
    {
      id: "lavawalker-4pc-dmg",
      label: "4-Piece DMG Bonus% (Lavawalker)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "target-pyro",
      value: 35,
      compute: (ctx) => {
        const on = (ctx.inputs?.["target-pyro"] ?? "1") === "1" || Number(ctx.inputs?.["target-pyro"] ?? 1) > 0;
        return on ? 35 : 0;
      },
    }
  ],
};
