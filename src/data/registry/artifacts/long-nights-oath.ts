import type { ArtifactConfig } from "./types";

export const longNightsOath: ArtifactConfig = {
  id: "long-nights-oath",
  name: "Long Night's Oath",
  rarity: 5,
  twoPieceDesc: "Plunging Attack DMG increased by 20%.",
  fourPieceDesc: "After Plunging/Charged/Skill hits, gain Radiance Everlasting: Plunging Attacks deal 15% increased DMG for 6s. Max 5 stacks (+75% Plunging DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "long-night-stacks",
          "label": "Radiance Everlasting Stacks (15% Plunge / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 5,
          "defaultValue": 5,
          "hint": "Each stack increases Plunging Attack DMG by 15% (Max 5 stacks = +75% Plunge DMG)"
      }
  ],
  buffs: [
    {
      id: "long-night-2pc-plunge",
      label: "2-Piece Plunging Attack DMG% (Long Night's Oath)",
      stat: "plungeDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "long-night-4pc-plunge",
      label: "4-Piece Stacking Plunging DMG% (Long Night's Oath)",
      stat: "plungeDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "long-night-stacks",
      value: 75,
      compute: (ctx) => {
        const s = Math.min(5, Math.max(0, Number(ctx.inputs?.["long-night-stacks"] ?? 5)));
        return s * 15;
      },
    }
  ],
};
