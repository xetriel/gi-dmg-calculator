import type { ArtifactConfig } from "./types";

export const vourukashasGlow: ArtifactConfig = {
  id: "vourukashas-glow",
  name: "Vourukasha's Glow",
  rarity: 5,
  twoPieceDesc: "HP increased by 20%.",
  fourPieceDesc: "Elemental Skill and Elemental Burst DMG +10%. Taking DMG increases this bonus by 80% per stack (max 5 stacks, total +50% Skill/Burst DMG).",
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
      compute: (ctx) => (20 / 100) * ctx.baseAtk,
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
