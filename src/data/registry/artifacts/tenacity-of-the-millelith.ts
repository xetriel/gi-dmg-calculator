import type { ArtifactConfig } from "./types";

export const tenacityOfTheMillelith: ArtifactConfig = {
  id: "tenacity-of-the-millelith",
  name: "Tenacity of the Millelith",
  rarity: 5,
  twoPieceDesc: "HP +20%",
  fourPieceDesc: "When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by 20% and their Shield Strength is increased by 30% for 3s. This effect can be triggered once every 0.5s. This effect can still be triggered even when the character who is using this artifact set is not on the field.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "totm-skill-hit",
          "label": "Elemental Skill Hit Opponent (Party ATK +20%)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases all nearby party members' ATK by 20% and Shield Strength by 30% for 3s"
      }
  ],
  buffs: [
    {
      id: "totm-2pc-hp",
      label: "2-Piece HP% (Tenacity of the Millelith)",
      stat: "hp",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 20,
      compute: (ctx) => (20 / 100) * (ctx.baseHp ?? 0),
    },
    {
      id: "totm-4pc-party-atk",
      label: "4-Piece Party ATK% (Tenacity of the Millelith)",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "totm-skill-hit",
      value: 20,
      compute: (ctx) => {
        const on = (ctx.inputs?.["totm-skill-hit"] ?? "1") === "1" || Number(ctx.inputs?.["totm-skill-hit"] ?? 1) > 0;
        return on ? (20 / 100) * ctx.baseAtk : 0;
      },
    }
  ],
};
