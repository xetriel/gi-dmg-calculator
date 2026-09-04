import type { ArtifactConfig } from "./types";

export const echoesOfAnOffering: ArtifactConfig = {
  id: "echoes-of-an-offering",
  name: "Echoes of an Offering",
  rarity: 5,
  twoPieceDesc: "ATK +18%.",
  fourPieceDesc: "When Normal Attacks hit opponents, there is a 36% chance that it will trigger Valley Rite, which will increase Normal Attack DMG by 70% of ATK.This effect will be dispelled 0.05s after a Normal Attack deals DMG.If a Normal Attack fails to trigger Valley Rite, the odds of it triggering the next time will increase by 20%.This trigger can occur once every 0.2s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "valley-rite-active",
      label: "Valley Rite Proc (Normal Attack DMG +70% of ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Normal Attack DMG by 70% of ATK upon trigger (average expectation ~50.2% proc rate or 70% ATK on hit)",
    },
  ],
  buffs: [
    {
      id: "echoes-2pc-atk",
      label: "2-Piece ATK% (Echoes of an Offering)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "echoes-4pc-valley-rite",
      label: "4-Piece Valley Rite (Echoes of an Offering)",
      stat: "flatDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "valley-rite-active",
      value: 70,
      compute: (ctx) => {
        const on = (ctx.inputs?.["valley-rite-active"] ?? "1") === "1" || Number(ctx.inputs?.["valley-rite-active"] ?? 1) > 0;
        return on ? (70 / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
