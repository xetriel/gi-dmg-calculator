import type { ArtifactConfig } from "./types";

export const noblesseOblige: ArtifactConfig = {
  id: "noblesse-oblige",
  name: "Noblesse Oblige",
  rarity: 5,
  twoPieceDesc: "Elemental Burst DMG +20%.",
  fourPieceDesc: "Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "noblesse-burst",
          "label": "Used Elemental Burst (Party ATK +20%)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases all party members' ATK by 20% for 12s (Non-stacking)"
      }
  ],
  buffs: [
    {
      id: "noblesse-2pc-burst",
      label: "2-Piece Elemental Burst DMG% (Noblesse Oblige)",
      stat: "burstDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "noblesse-4pc-party-atk",
      label: "4-Piece Party ATK% (Noblesse Oblige)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "noblesse-burst",
      value: 20,
      compute: (ctx) => {
        const on = (ctx.inputs?.["noblesse-burst"] ?? "1") === "1" || Number(ctx.inputs?.["noblesse-burst"] ?? 1) > 0;
        return on ? (20 / 100) * ctx.baseAtk : 0;
      },
    }
  ],
};
