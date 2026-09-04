import type { ArtifactConfig } from "./types";

export const emblemOfSeveredFate: ArtifactConfig = {
  id: "emblem-of-severed-fate",
  name: "Emblem of Severed Fate",
  rarity: 5,
  twoPieceDesc: "Energy Recharge +20%",
  fourPieceDesc: "Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "emblem-er-input",
          "label": "Total Energy Recharge% for Scaling",
          "control": "percent",
          "min": 100,
          "max": 350,
          "defaultValue": 200,
          "hint": "Elemental Burst DMG increases by 25% of Energy Recharge (Capped at 75% Burst DMG at 300% ER)"
      }
  ],
  buffs: [
    {
      id: "emblem-2pc-er",
      label: "2-Piece Energy Recharge% (Emblem of Severed Fate)",
      stat: "energyRecharge",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "emblem-4pc-burst-dmg",
      label: "4-Piece Scaled Burst DMG% (Emblem of Severed Fate)",
      stat: "burstDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "emblem-er-input",
      value: 50,
      compute: (ctx) => {
        const er = Number(ctx.inputs?.["emblem-er-input"] ?? 200);
        return Math.min(75, er * 0.25);
      },
    }
  ],
};
