import type { ArtifactConfig } from "./types";

export const scarletProof: ArtifactConfig = {
  id: "scarlet-proof",
  name: "Scarlet Proof",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc:
    "Increases the equipping character's CRIT Rate by 16%, and their Stellar Swirl reaction dealt by 40%, for 10s after they trigger a Stellar Swirl reaction.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "trigger-stellar-swirl",
      label: "Triggered Stellar Swirl",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases CRIT Rate by 16% and Stellar Swirl reaction DMG by 40% for 10s after triggering Stellar Swirl",
    },
  ],
  buffs: [
    {
      id: "scarlet-proof-2pc-atk",
      label: "2-Piece ATK% (Scarlet Proof)",
      description: "ATK increased by 18%",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => {
        return (18 / 100) * ctx.baseAtk;
      },
    },
    {
      id: "scarlet-proof-4pc-crit",
      label: "4-Piece CRIT Rate (Scarlet Proof)",
      description: "CRIT Rate increased by 16% for 10s after triggering a Stellar Swirl reaction",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "trigger-stellar-swirl",
      value: 16,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-swirl"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-swirl"] ?? 1) > 0;
        return on ? 16 : 0;
      },
    },
    {
      id: "scarlet-proof-4pc-stellar-swirl",
      label: "4-Piece Stellar Swirl DMG% (Scarlet Proof)",
      description: "Stellar Swirl reaction DMG dealt increased by 40% for 10s after triggering a Stellar Swirl reaction",
      stat: "stellarSwirlDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "trigger-stellar-swirl",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-swirl"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-swirl"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    },
  ],
};
