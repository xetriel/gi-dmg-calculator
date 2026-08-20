import type { ArtifactConfig } from "./types";

export const disenchantmentInDeepShadow: ArtifactConfig = {
  id: "disenchantment-in-deep-shadow",
  name: "Disenchantment in Deep Shadow",
  rarity: 5,
  twoPieceDesc: "Physical DMG +25%.",
  fourPieceDesc: "Increases Superconduct Reaction DMG by 80% and Stellar-Conduct Reaction DMG by 40%. When the wielder attacks opponents affected by Superconduct or Stellar-Conduct, this attack's CRIT Rate is increased by 16%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "disenchantment-reaction-active",
          "label": "Opponent Affected by Superconduct / Stellar-Conduct",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases CRIT Rate by 16% when attacking opponents affected by Superconduct or Stellar-Conduct"
      }
  ],
  buffs: [
    {
      id: "disenchantment-2pc-phys",
      label: "2-Piece Physical DMG% (Disenchantment in Deep Shadow)",
      stat: "physicalDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 25,
      compute: () => 25,
    },
    {
      id: "disenchantment-4pc-crit",
      label: "4-Piece Reaction CRIT Rate (Disenchantment in Deep Shadow)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "disenchantment-reaction-active",
      value: 16,
      compute: (ctx) => {
        const on = (ctx.inputs?.["disenchantment-reaction-active"] ?? "1") === "1" || Number(ctx.inputs?.["disenchantment-reaction-active"] ?? 1) > 0;
        return on ? 16 : 0;
      },
    }
  ],
};
