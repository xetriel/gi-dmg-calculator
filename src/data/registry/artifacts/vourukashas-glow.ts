import type { ArtifactConfig } from "./types";

export const vourukashasGlow: ArtifactConfig = {
  id: "vourukashas-glow",
  name: "Vourukasha's Glow",
  rarity: 5,
  twoPieceDesc: "HP +20%",
  fourPieceDesc: "Elemental Skill and Elemental Burst DMG will be increased by 10%. After the equipping character takes DMG, the aforementioned DMG Bonus is increased by 80% for 5s. This effect increase can have 5 stacks. The duration of each stack is counted independently. These effects can be triggered even when the equipping character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "vourukasha-stacks",
          "label": "Damage Taken Stacks (0–5)",
          "control": "stacks",
          "min": 0,
          "max": 5,
          "defaultValue": 5,
          "hint": "Base +10% Skill/Burst DMG; each stack adds +8% (Max 5 stacks = +50% Skill/Burst DMG total)"
      }
  ],
  buffs: [
    {
      id: "vourukasha-2pc-hp",
      label: "2-Piece HP% (Vourukasha's Glow)",
      stat: "hp",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 20,
      compute: (ctx) => (20 / 100) * (ctx.baseHp ?? 0),
    },
    {
      id: "vourukasha-4pc-skill",
      label: "4-Piece Elemental Skill DMG% (Vourukasha's Glow)",
      stat: "skillDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "vourukasha-stacks",
      value: 50,
      compute: (ctx) => {
        const s = Math.min(5, Math.max(0, Number(ctx.inputs?.["vourukasha-stacks"] ?? 5)));
        return 10 + s * 8;
      },
    },
    {
      id: "vourukasha-4pc-burst",
      label: "4-Piece Elemental Burst DMG% (Vourukasha's Glow)",
      stat: "burstDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "vourukasha-stacks",
      value: 50,
      compute: (ctx) => {
        const s = Math.min(5, Math.max(0, Number(ctx.inputs?.["vourukasha-stacks"] ?? 5)));
        return 10 + s * 8;
      },
    }
  ],
};
