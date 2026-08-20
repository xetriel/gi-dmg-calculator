import type { ArtifactConfig } from "./types";

export const heartOfTheFurnace: ArtifactConfig = {
  id: "heart-of-the-furnace",
  name: "Heart of the Furnace",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc:
    "Increases the equipping character's ATK by 12% for 12s when they trigger a Stellar Glimmer reaction or deal Stellar Glimmer reaction DMG. Also increases Stellar Glimmer reaction DMG dealt by all nearby party members by 50%. The above effects can trigger even when the equipping character is not on the field, and the DMG bonus from multiple Artifact Sets with the same name do not stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "trigger-stellar-glimmer",
      label: "Triggered / Dealt Stellar Glimmer DMG",
      control: "toggle",
      defaultValue: 1,
      hint: "Equipping character gains +12% ATK; all nearby party members gain +50% Stellar Glimmer reaction DMG for 12s",
    },
  ],
  buffs: [
    {
      id: "furnace-2pc-atk",
      label: "2-Piece ATK% (Heart of the Furnace)",
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
      id: "furnace-4pc-wielder-atk",
      label: "4-Piece Wielder ATK% (Heart of the Furnace)",
      description: "Equipping character gains +12% ATK for 12s when triggering a Stellar Glimmer reaction or dealing Stellar Glimmer DMG",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "trigger-stellar-glimmer",
      value: 12,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-glimmer"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-glimmer"] ?? 1) > 0;
        return on ? (12 / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "furnace-4pc-party-glimmer-dmg",
      label: "4-Piece Party Stellar Glimmer DMG% (Heart of the Furnace)",
      description: "All nearby party members gain +50% Stellar Glimmer reaction DMG (Does not stack with same artifact set)",
      stat: "stellarGlimmerDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "trigger-stellar-glimmer",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-glimmer"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-glimmer"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    },
  ],
};
