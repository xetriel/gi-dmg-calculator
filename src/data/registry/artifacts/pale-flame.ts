import type { ArtifactConfig } from "./types";

export const paleFlame: ArtifactConfig = {
  id: "pale-flame",
  name: "Pale Flame",
  rarity: 5,
  twoPieceDesc: "Physical DMG +25%.",
  fourPieceDesc: "When an Elemental Skill hits an opponent, ATK is increased by 9% for 7s. This effect stacks up to 2 times and can be triggered once every 0.3s. Once 2 stacks are reached, the 2-set effect is increased by 100%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "pale-flame-stacks",
          "label": "Skill Hit Stacks (9% ATK / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 2,
          "defaultValue": 2,
          "hint": "Each stack grants +9% ATK. At 2 stacks, grants an additional +25% Physical DMG Bonus"
      }
  ],
  buffs: [
    {
      id: "pale-flame-2pc-phys",
      label: "2-Piece Physical DMG% (Pale Flame)",
      stat: "physicalDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 25,
      compute: () => 25,
    },
    {
      id: "pale-flame-4pc-atk",
      label: "4-Piece Stacking ATK% (Pale Flame)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "pale-flame-stacks",
      value: 18,
      compute: (ctx) => {
        const stacks = Math.min(2, Math.max(0, Number(ctx.inputs?.["pale-flame-stacks"] ?? 2)));
        return (stacks * 9 / 100) * ctx.baseAtk;
      },
    },
    {
      id: "pale-flame-4pc-max-phys",
      label: "4-Piece Max Stacks Physical DMG% (Pale Flame)",
      stat: "physicalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "pale-flame-stacks",
      value: 25,
      compute: (ctx) => {
        const stacks = Math.min(2, Math.max(0, Number(ctx.inputs?.["pale-flame-stacks"] ?? 2)));
        return stacks >= 2 ? 25 : 0;
      },
    }
  ],
};
