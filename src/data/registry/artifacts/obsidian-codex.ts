import type { ArtifactConfig } from "./types";

export const obsidianCodex: ArtifactConfig = {
  id: "obsidian-codex",
  name: "Obsidian Codex",
  rarity: 5,
  twoPieceDesc: "While the equipping character is in Nightsoul's Blessing and is on the field, their DMG dealt is increased by 15%.",
  fourPieceDesc: "After the equipping character consumes 1 Nightsoul point while on the field, CRIT Rate increases by 40% for 6s. This effect can trigger once every second.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "obsidian-on-field-nightsoul",
          "label": "In Nightsoul's Blessing On-Field (+15% DMG)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases DMG dealt by 15% while in Nightsoul's Blessing on-field"
      },
      {
          "id": "obsidian-consumed-point",
          "label": "Consumed 1 Nightsoul Point (+40% CRIT Rate)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases CRIT Rate by 40% for 6s after consuming 1 Nightsoul point on-field"
      }
  ],
  buffs: [
    {
      id: "obsidian-2pc-dmg",
      label: "2-Piece Nightsoul DMG Bonus% (Obsidian Codex)",
      stat: "dmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      conditionKey: "obsidian-on-field-nightsoul",
      value: 15,
      compute: (ctx) => {
        const on = (ctx.inputs?.["obsidian-on-field-nightsoul"] ?? "1") === "1" || Number(ctx.inputs?.["obsidian-on-field-nightsoul"] ?? 1) > 0;
        return on ? 15 : 0;
      },
    },
    {
      id: "obsidian-4pc-crit",
      label: "4-Piece CRIT Rate (Obsidian Codex)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "obsidian-consumed-point",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["obsidian-consumed-point"] ?? "1") === "1" || Number(ctx.inputs?.["obsidian-consumed-point"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    }
  ],
};
