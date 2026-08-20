import type { ArtifactConfig } from "./types";

export const vermillionHereafter: ArtifactConfig = {
  id: "vermillion-hereafter",
  name: "Vermillion Hereafter",
  rarity: 5,
  twoPieceDesc: "ATK +18%.",
  fourPieceDesc: "After using Elemental Burst, gain Nascent Light increasing ATK by 8%, plus 10% per HP loss stack (max 4 stacks, total +48% ATK).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "vermillion-nascent-light",
          "label": "Nascent Light Active (After Burst)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Grants +8% ATK base after Elemental Burst"
      },
      {
          "id": "vermillion-hp-stacks",
          "label": "HP Loss Stacks (10% ATK / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 4,
          "defaultValue": 4,
          "hint": "Each HP loss grants +10% ATK (Max 4 stacks = +40% ATK, Total +48% ATK with base)"
      }
  ],
  buffs: [
    {
      id: "vermillion-2pc-atk",
      label: "2-Piece ATK% (Vermillion Hereafter)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "vermillion-4pc-atk",
      label: "4-Piece Nascent Light ATK% (Vermillion Hereafter)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "vermillion-nascent-light",
      value: 48,
      compute: (ctx) => {
        const on = (ctx.inputs?.["vermillion-nascent-light"] ?? "1") === "1" || Number(ctx.inputs?.["vermillion-nascent-light"] ?? 1) > 0;
        if (!on) return 0;
        const stacks = Math.min(4, Math.max(0, Number(ctx.inputs?.["vermillion-hp-stacks"] ?? 4)));
        return ((8 + stacks * 10) / 100) * ctx.baseAtk;
      },
    }
  ],
};
