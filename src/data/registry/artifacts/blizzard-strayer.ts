import type { ArtifactConfig } from "./types";

export const blizzardStrayer: ArtifactConfig = {
  id: "blizzard-strayer",
  name: "Blizzard Strayer",
  rarity: 5,
  twoPieceDesc: "Cryo DMG Bonus +15%",
  fourPieceDesc: "When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "target-cryo",
          "label": "Opponent Affected by Cryo (+20% CRIT Rate)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases CRIT Rate by 20% against opponents affected by Cryo"
      },
      {
          "id": "target-frozen",
          "label": "Opponent is Frozen (Additional +20% CRIT Rate)",
          "control": "toggle",
          "defaultValue": 0,
          "hint": "Increases CRIT Rate by an additional 20% (Total +40% CRIT Rate) when opponent is Frozen"
      }
  ],
  buffs: [
    {
      id: "blizzard-2pc-cryo",
      label: "2-Piece Cryo DMG Bonus% (Blizzard Strayer)",
      stat: "cryoDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "blizzard-4pc-crit",
      label: "4-Piece CRIT Rate (Blizzard Strayer)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 40,
      compute: (ctx) => {
        const cryo = (ctx.inputs?.["target-cryo"] ?? "1") === "1" || Number(ctx.inputs?.["target-cryo"] ?? 1) > 0;
        const frozen = (ctx.inputs?.["target-frozen"] ?? "0") === "1" || Number(ctx.inputs?.["target-frozen"] ?? 0) > 0;
        return (cryo ? 20 : 0) + (frozen ? 20 : 0);
      },
    }
  ],
};
