import type { ArtifactConfig } from "./types";

export const berserker: ArtifactConfig = {
  id: "berserker",
  name: "Berserker",
  rarity: 4,
  twoPieceDesc: "CRIT Rate +12%",
  fourPieceDesc: "When HP is below 70%, CRIT Rate increases by an additional 24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "hp-lt-70",
          "label": "HP Below 70%",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Grants an additional +24% CRIT Rate when HP is below 70%"
      }
  ],
  buffs: [
    {
      id: "berserker-2pc-crit",
      label: "2-Piece CRIT Rate (Berserker)",
      stat: "critRate",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 12,
      compute: () => 12,
    },
    {
      id: "berserker-4pc-low-hp-crit",
      label: "4-Piece Low HP CRIT Rate (Berserker)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "hp-lt-70",
      value: 24,
      compute: (ctx) => {
        const on = (ctx.inputs?.["hp-lt-70"] ?? "1") === "1" || Number(ctx.inputs?.["hp-lt-70"] ?? 1) > 0;
        return on ? 24 : 0;
      },
    }
  ],
};
