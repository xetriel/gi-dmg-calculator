import type { ArtifactConfig } from "./types";

export const celestialGift: ArtifactConfig = {
  id: "celestial-gift",
  name: "Celestial Gift",
  rarity: 5,
  twoPieceDesc: "Energy Recharge + 20%.",
  fourPieceDesc: "If the equipping character has completed Witch's Homework, after they use an Elemental Skill, they also gain \"Light's Guidance\" for 20s: All nearby party members gain a 20% Elemental DMG Bonus corresponding to the equipping character's Elemental Type. The equipping character can trigger this effect while off-field. DMG Bonuses provided by Artifact Sets with the same name do not stack.When your party has the Hexerei: Secret Rite effect, Light's Guidance is upgraded to \"Mortal Hymn\": All nearby party members gain a 40% Elemental DMG Bonus corresponding to both the equipping character and the current active party member's Elemental Type instead. If both characters have the same Elemental Type, these bonuses will not stack.",
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
