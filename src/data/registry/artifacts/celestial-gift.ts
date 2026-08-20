import type { ArtifactConfig } from "./types";

export const celestialGift: ArtifactConfig = {
  id: "celestial-gift",
  name: "Celestial Gift",
  rarity: 5,
  twoPieceDesc: "Energy Recharge +20%.",
  fourPieceDesc: "If character has Witch's Homework, using Skill grants Light's Guidance: all party members gain +20% Elemental DMG of wielder's element for 20s. With Hexerei: Secret Rite, upgraded to Mortal Hymn (+40% Elemental DMG to wielder & active member elements).",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "celestial-skill-guidance",
          "label": "Used Elemental Skill (Light's Guidance Active)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "All nearby party members gain 20% Elemental DMG Bonus for 20s"
      },
      {
          "id": "celestial-hexerei-active",
          "label": "Hexerei: Secret Rite Active (Mortal Hymn +40% DMG)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Upgrades party Elemental DMG Bonus to 40% for both wielder and active party member elements"
      }
  ],
  buffs: [
    {
      id: "celestial-gift-2pc-er",
      label: "2-Piece Energy Recharge% (Celestial Gift)",
      stat: "energyRecharge",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "celestial-gift-4pc-party-dmg",
      label: "4-Piece Party Elemental DMG% (Celestial Gift)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "celestial-skill-guidance",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["celestial-skill-guidance"] ?? "1") === "1" || Number(ctx.inputs?.["celestial-skill-guidance"] ?? 1) > 0;
        if (!on) return 0;
        const hexerei = (ctx.inputs?.["celestial-hexerei-active"] ?? "1") === "1" || Number(ctx.inputs?.["celestial-hexerei-active"] ?? 1) > 0;
        return hexerei ? 40 : 20;
      },
    }
  ],
};
