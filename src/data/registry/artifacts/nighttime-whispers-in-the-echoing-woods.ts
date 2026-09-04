import type { ArtifactConfig } from "./types";

export const nighttimeWhispersInTheEchoingWoods: ArtifactConfig = {
  id: "nighttime-whispers-in-the-echoing-woods",
  name: "Nighttime Whispers in the Echoing Woods",
  rarity: 5,
  twoPieceDesc: "ATK +18%.",
  fourPieceDesc: "After using an Elemental Skill, gain a 20% Geo DMG Bonus for 10s. When under a shield granted by the Crystallize reaction, or when Moondrifts formed by Lunar-Crystallize reactions are nearby, the above effect will be increased by 150%. When these conditions are no longer met, this additional increase disappears after 1s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "nighttime-skill-used",
          "label": "After Elemental Skill (+20% Geo DMG)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Geo DMG Bonus by 20% for 10s"
      },
      {
          "id": "nighttime-crystallize-shield",
          "label": "Protected by Crystallize Shield / Moondrifts (+150% Effect)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases the Geo DMG Bonus by 150% (Total +50% Geo DMG)"
      }
  ],
  buffs: [
    {
      id: "nighttime-2pc-atk",
      label: "2-Piece ATK% (Nighttime Whispers)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "nighttime-4pc-geo",
      label: "4-Piece Geo DMG Bonus% (Nighttime Whispers)",
      stat: "geoDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["nighttime-skill-used"] ?? "1") === "1" || Number(ctx.inputs?.["nighttime-skill-used"] ?? 1) > 0;
        if (!on) return 0;
        const shield = (ctx.inputs?.["nighttime-crystallize-shield"] ?? "1") === "1" || Number(ctx.inputs?.["nighttime-crystallize-shield"] ?? 1) > 0;
        return shield ? 50 : 20;
      },
    }
  ],
};
